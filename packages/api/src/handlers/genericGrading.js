import { prisma } from '../plugins/prisma.js'

/**
 * Calculate grade based on curriculum config rules
 */
const calculateGradeFromConfig = (data, curriculumConfig) => {
    const { scoring } = curriculumConfig.config
    const result = {}

    if (scoring.type === 'numeric') {
        // K13 style: calculate weighted average
        const weights = curriculumConfig.config.weightCalculation || {
            tugas: 0.2,
            uts: 0.3,
            uas: 0.5
        }

        // Calculate assignment average if using scoreJson
        let numericScore = data.scoreNumeric
        if (!numericScore && data.scoreJson) {
            const scores = data.scoreJson
            const tugasAvg = ((scores.tugas1 || 0) + (scores.tugas2 || 0) + (scores.tugas3 || 0)) / 3
            numericScore = (tugasAvg * weights.tugas) +
                ((scores.uts || 0) * weights.uts) +
                ((scores.uas || 0) * weights.uas)
        }

        result.scoreNumeric = Math.round(numericScore * 100) / 100

        // Determine letter grade
        const letterGrades = scoring.letterGrades || []
        for (const grade of letterGrades) {
            if (numericScore >= grade.minScore && numericScore <= grade.maxScore) {
                result.scoreLetter = grade.letter
                result.predikat = grade.predikat
                break
            }
        }

        // Check if remedial is needed (below KKM)
        if (scoring.kkm && numericScore < scoring.kkm) {
            result.needsRemedial = true
        }

    } else if (scoring.type === 'descriptive') {
        // Merdeka style: use descriptive levels
        result.scoreDescriptive = data.scoreDescriptive

        // If numeric provided, convert to descriptive
        if (data.scoreNumeric && !data.scoreDescriptive) {
            const levels = scoring.descriptiveLevels || []
            for (const level of levels) {
                if (data.scoreNumeric >= level.minScore && data.scoreNumeric <= level.maxScore) {
                    result.scoreDescriptive = level.code
                    break
                }
            }
        }

        // Store numeric if provided
        if (data.scoreNumeric) {
            result.scoreNumeric = data.scoreNumeric
        }

    } else if (scoring.type === 'rubric') {
        // Rubric style: store complex data in JSON
        result.scoreJson = data.scoreJson
        result.scoreDescriptive = data.scoreDescriptive
    }

    return result
}

/**
 * List generic grades with flexible filtering
 */
export const listGenericGrades = async (request, h) => {
    const {
        studentId,
        subjectId,
        classId,
        academicYearId,
        semester,
        assessmentType,
        competencyId
    } = request.query

    const where = {}

    if (studentId) where.studentId = studentId
    if (subjectId) where.subjectId = subjectId
    if (academicYearId) where.academicYearId = academicYearId
    if (semester) where.semester = semester
    if (assessmentType) where.assessmentType = assessmentType
    if (competencyId) where.competencyId = competencyId

    // If classId provided, filter by class enrollment
    if (classId) {
        const enrollments = await prisma.classEnrollment.findMany({
            where: { classId, status: 'ACTIVE' },
            select: { studentId: true }
        })
        where.studentId = { in: enrollments.map(e => e.studentId) }
    }

    return prisma.genericGrade.findMany({
        where,
        include: {
            student: {
                select: { id: true, name: true, nis: true, nisn: true }
            },
            subject: {
                select: { id: true, code: true, name: true }
            },
            competency: {
                select: { id: true, code: true, description: true, type: true }
            },
            academicYear: {
                select: { id: true, name: true }
            }
        },
        orderBy: [
            { student: { name: 'asc' } },
            { subject: { name: 'asc' } }
        ]
    })
}

/**
 * Save a generic grade (config-driven)
 */
export const saveGenericGrade = async (request, h) => {
    const data = request.payload

    // Validate required fields
    if (!data.studentId || !data.subjectId || !data.academicYearId || !data.semester || !data.assessmentType) {
        return h.response({
            error: 'studentId, subjectId, academicYearId, semester, and assessmentType are required'
        }).code(400)
    }

    // Get the active curriculum config for calculations
    let curriculumConfig
    if (data.curriculumConfigId) {
        curriculumConfig = await prisma.curriculumConfig.findUnique({
            where: { id: data.curriculumConfigId }
        })
    } else {
        curriculumConfig = await prisma.curriculumConfig.findFirst({
            where: { isActive: true }
        })
    }

    // Calculate derived values based on curriculum config
    let calculatedValues = {}
    if (curriculumConfig) {
        calculatedValues = calculateGradeFromConfig(data, curriculumConfig)
    }

    // Prepare grade data
    const gradeData = {
        studentId: data.studentId,
        subjectId: data.subjectId,
        academicYearId: data.academicYearId,
        semester: data.semester,
        assessmentType: data.assessmentType,
        competencyId: data.competencyId || null,
        scoreNumeric: calculatedValues.scoreNumeric || data.scoreNumeric || null,
        scoreLetter: calculatedValues.scoreLetter || data.scoreLetter || null,
        scoreDescriptive: calculatedValues.scoreDescriptive || data.scoreDescriptive || null,
        scoreJson: data.scoreJson || null,
        evidenceLinks: data.evidenceLinks || [],
        feedback: data.feedback || null,
        assessedAt: data.assessedAt ? new Date(data.assessedAt) : new Date(),
        assessedBy: data.assessedBy || null
    }

    // Upsert the grade
    let grade
    if (data.id) {
        // Update existing
        grade = await prisma.genericGrade.update({
            where: { id: data.id },
            data: gradeData,
            include: {
                student: true,
                subject: true,
                competency: true
            }
        })
    } else {
        // Create new
        grade = await prisma.genericGrade.create({
            data: gradeData,
            include: {
                student: true,
                subject: true,
                competency: true
            }
        })
    }

    return grade
}

/**
 * Bulk save generic grades
 */
export const bulkSaveGenericGrades = async (request, h) => {
    const { grades, curriculumConfigId } = request.payload

    if (!grades || !Array.isArray(grades) || grades.length === 0) {
        return h.response({ error: 'grades array is required' }).code(400)
    }

    // Get curriculum config for calculations
    let curriculumConfig
    if (curriculumConfigId) {
        curriculumConfig = await prisma.curriculumConfig.findUnique({
            where: { id: curriculumConfigId }
        })
    } else {
        curriculumConfig = await prisma.curriculumConfig.findFirst({
            where: { isActive: true }
        })
    }

    const results = await Promise.all(
        grades.map(async (data) => {
            // Calculate derived values
            let calculatedValues = {}
            if (curriculumConfig) {
                calculatedValues = calculateGradeFromConfig(data, curriculumConfig)
            }

            const gradeData = {
                studentId: data.studentId,
                subjectId: data.subjectId,
                academicYearId: data.academicYearId,
                semester: data.semester,
                assessmentType: data.assessmentType,
                competencyId: data.competencyId || null,
                scoreNumeric: calculatedValues.scoreNumeric || data.scoreNumeric || null,
                scoreLetter: calculatedValues.scoreLetter || data.scoreLetter || null,
                scoreDescriptive: calculatedValues.scoreDescriptive || data.scoreDescriptive || null,
                scoreJson: data.scoreJson || null,
                evidenceLinks: data.evidenceLinks || [],
                feedback: data.feedback || null,
                assessedAt: new Date(),
                assessedBy: data.assessedBy || null
            }

            if (data.id) {
                return prisma.genericGrade.update({
                    where: { id: data.id },
                    data: gradeData
                })
            } else {
                return prisma.genericGrade.create({
                    data: gradeData
                })
            }
        })
    )

    return { saved: results.length, grades: results }
}

/**
 * Get grade summary for a student
 */
export const getStudentGradeSummary = async (request, h) => {
    const { studentId, academicYearId, semester } = request.params

    const where = {
        studentId,
        academicYearId
    }
    if (semester) where.semester = semester

    const grades = await prisma.genericGrade.findMany({
        where,
        include: {
            subject: true,
            competency: true
        },
        orderBy: { subject: { name: 'asc' } }
    })

    // Get curriculum config
    const curriculumConfig = await prisma.curriculumConfig.findFirst({
        where: { isActive: true }
    })

    // Group by subject
    const bySubject = {}
    for (const grade of grades) {
        const subjectId = grade.subjectId
        if (!bySubject[subjectId]) {
            bySubject[subjectId] = {
                subject: grade.subject,
                grades: [],
                summary: {}
            }
        }
        bySubject[subjectId].grades.push(grade)
    }

    // Calculate summaries per subject
    for (const subjectId in bySubject) {
        const subjectGrades = bySubject[subjectId].grades
        const summary = bySubject[subjectId].summary

        // Numeric average
        const numericGrades = subjectGrades.filter(g => g.scoreNumeric !== null)
        if (numericGrades.length > 0) {
            summary.averageNumeric = numericGrades.reduce((sum, g) => sum + g.scoreNumeric, 0) / numericGrades.length
        }

        // Descriptive level distribution
        const descriptiveGrades = subjectGrades.filter(g => g.scoreDescriptive !== null)
        if (descriptiveGrades.length > 0) {
            summary.levelDistribution = {}
            for (const g of descriptiveGrades) {
                summary.levelDistribution[g.scoreDescriptive] = (summary.levelDistribution[g.scoreDescriptive] || 0) + 1
            }

            // Determine predominant level
            let maxCount = 0
            for (const level in summary.levelDistribution) {
                if (summary.levelDistribution[level] > maxCount) {
                    maxCount = summary.levelDistribution[level]
                    summary.predominantLevel = level
                }
            }
        }

        // Count by assessment type
        summary.byAssessmentType = {}
        for (const g of subjectGrades) {
            summary.byAssessmentType[g.assessmentType] = (summary.byAssessmentType[g.assessmentType] || 0) + 1
        }
    }

    return {
        studentId,
        academicYearId,
        semester,
        curriculumConfig: curriculumConfig ? { id: curriculumConfig.id, code: curriculumConfig.code, name: curriculumConfig.name } : null,
        subjects: Object.values(bySubject)
    }
}

/**
 * Delete a generic grade
 */
export const deleteGenericGrade = async (request, h) => {
    const { id } = request.params

    const existing = await prisma.genericGrade.findUnique({
        where: { id }
    })

    if (!existing) {
        return h.response({ error: 'Grade not found' }).code(404)
    }

    await prisma.genericGrade.delete({
        where: { id }
    })

    return { deleted: true, id }
}
