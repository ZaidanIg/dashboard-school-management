import { prisma } from '../plugins/prisma.js'

/**
 * Calculate final grade
 */
const calculateGrade = (data) => {
    const weights = { assignment: 0.2, midterm: 0.3, final: 0.3, activity: 0.2 }
    const assignmentAvg = ((data.assignment1 || 0) + (data.assignment2 || 0) + (data.assignment3 || 0)) / 3

    const finalGrade =
        (assignmentAvg * weights.assignment) +
        ((data.midtermExam || 0) * weights.midterm) +
        ((data.finalExam || 0) * weights.final) +
        ((data.activityScore || 0) * weights.activity)

    const letterGrade =
        finalGrade >= 90 ? 'A' :
            finalGrade >= 80 ? 'B' :
                finalGrade >= 70 ? 'C' :
                    finalGrade >= 60 ? 'D' : 'E'

    return { finalGrade, letterGrade }
}

/**
 * List grades
 */
export const listGrades = async (request, h) => {
    const { classId, subjectId, academicYearId, semester } = request.query

    const where = {}
    if (subjectId) where.subjectId = subjectId
    if (academicYearId) where.academicYearId = academicYearId
    if (semester) where.semester = semester

    if (classId) {
        const enrollments = await prisma.classEnrollment.findMany({
            where: { classId, status: 'ACTIVE' },
            select: { studentId: true }
        })
        where.studentId = { in: enrollments.map(e => e.studentId) }
    }

    return prisma.grade.findMany({
        where,
        include: { student: true, subject: true },
        orderBy: [{ student: { name: 'asc' } }]
    })
}

/**
 * Save or update grade
 */
export const saveGrade = async (request, h) => {
    const data = request.payload
    const { finalGrade, letterGrade } = calculateGrade(data)

    const grade = await prisma.grade.upsert({
        where: {
            studentId_subjectId_academicYearId_semester: {
                studentId: data.studentId,
                subjectId: data.subjectId,
                academicYearId: data.academicYearId,
                semester: data.semester
            }
        },
        update: { ...data, finalGrade, letterGrade },
        create: { ...data, finalGrade, letterGrade }
    })

    return grade
}

/**
 * Bulk save grades
 */
export const bulkSaveGrades = async (request, h) => {
    const { grades } = request.payload

    const results = await Promise.all(
        grades.map(async (g) => {
            const { finalGrade, letterGrade } = calculateGrade(g)
            return prisma.grade.upsert({
                where: {
                    studentId_subjectId_academicYearId_semester: {
                        studentId: g.studentId,
                        subjectId: g.subjectId,
                        academicYearId: g.academicYearId,
                        semester: g.semester
                    }
                },
                update: { ...g, finalGrade, letterGrade },
                create: { ...g, finalGrade, letterGrade }
            })
        })
    )

    return { saved: results.length }
}

/**
 * List P5 projects
 */
export const listP5Projects = async (request, h) => {
    return prisma.p5Project.findMany({
        include: { participants: true, _count: { select: { participants: true } } },
        orderBy: { createdAt: 'desc' }
    })
}

/**
 * Create P5 project
 */
export const createP5Project = async (request, h) => {
    const project = await prisma.p5Project.create({ data: request.payload })
    return h.response(project).code(201)
}
