import { prisma } from '../plugins/prisma.js'

/**
 * List all curriculum configurations
 */
export const listCurriculumConfigs = async (request, h) => {
    const { isActive } = request.query

    const where = {}
    if (isActive !== undefined) {
        where.isActive = isActive === 'true'
    }

    return prisma.curriculumConfig.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: {
                    academicYears: true,
                    competencies: true
                }
            }
        }
    })
}

/**
 * Get a single curriculum configuration by ID or code
 */
export const getCurriculumConfig = async (request, h) => {
    const { id } = request.params

    // Try to find by ID first, then by code
    let config = await prisma.curriculumConfig.findUnique({
        where: { id },
        include: {
            academicYears: {
                include: {
                    academicYear: true
                }
            },
            competencies: {
                include: {
                    subject: true
                }
            }
        }
    })

    if (!config) {
        config = await prisma.curriculumConfig.findUnique({
            where: { code: id },
            include: {
                academicYears: {
                    include: {
                        academicYear: true
                    }
                },
                competencies: {
                    include: {
                        subject: true
                    }
                }
            }
        })
    }

    if (!config) {
        return h.response({ error: 'Curriculum config not found' }).code(404)
    }

    return config
}

/**
 * Get the active curriculum configuration for a specific class/grade
 */
export const getActiveCurriculumForClass = async (request, h) => {
    const { classId } = request.params

    // Get the class to determine academic year and grade level
    const classData = await prisma.class.findUnique({
        where: { id: classId },
        include: { academicYear: true }
    })

    if (!classData) {
        return h.response({ error: 'Class not found' }).code(404)
    }

    // Find curriculum config for this academic year and grade level
    let curriculumLink = await prisma.academicYearCurriculum.findFirst({
        where: {
            academicYearId: classData.academicYearId,
            gradeLevel: classData.grade
        },
        include: {
            curriculum: true
        }
    })

    // If no grade-specific config, try finding one for all grades
    if (!curriculumLink) {
        curriculumLink = await prisma.academicYearCurriculum.findFirst({
            where: {
                academicYearId: classData.academicYearId,
                gradeLevel: null
            },
            include: {
                curriculum: true
            }
        })
    }

    // If still no config, return the default active curriculum
    if (!curriculumLink) {
        const defaultCurriculum = await prisma.curriculumConfig.findFirst({
            where: { isActive: true }
        })

        if (!defaultCurriculum) {
            return h.response({ error: 'No active curriculum configuration found' }).code(404)
        }

        return {
            curriculum: defaultCurriculum,
            class: classData,
            source: 'default'
        }
    }

    return {
        curriculum: curriculumLink.curriculum,
        class: classData,
        source: curriculumLink.gradeLevel ? 'grade-specific' : 'academic-year'
    }
}

/**
 * Create a new curriculum configuration
 */
export const createCurriculumConfig = async (request, h) => {
    const data = request.payload

    // Validate required fields
    if (!data.code || !data.name || !data.config) {
        return h.response({ error: 'code, name, and config are required' }).code(400)
    }

    try {
        const config = await prisma.curriculumConfig.create({
            data: {
                code: data.code,
                name: data.name,
                isActive: data.isActive || false,
                config: data.config
            }
        })

        return h.response(config).code(201)
    } catch (error) {
        if (error.code === 'P2002') {
            return h.response({ error: 'Curriculum config with this code already exists' }).code(409)
        }
        throw error
    }
}

/**
 * Update a curriculum configuration
 */
export const updateCurriculumConfig = async (request, h) => {
    const { id } = request.params
    const data = request.payload

    const existing = await prisma.curriculumConfig.findUnique({
        where: { id }
    })

    if (!existing) {
        return h.response({ error: 'Curriculum config not found' }).code(404)
    }

    const updated = await prisma.curriculumConfig.update({
        where: { id },
        data: {
            name: data.name,
            isActive: data.isActive,
            config: data.config
        }
    })

    return updated
}

/**
 * Set a curriculum as active (and deactivate others)
 */
export const setActiveCurriculum = async (request, h) => {
    const { id } = request.params

    const config = await prisma.curriculumConfig.findUnique({
        where: { id }
    })

    if (!config) {
        return h.response({ error: 'Curriculum config not found' }).code(404)
    }

    // Deactivate all other curricula
    await prisma.curriculumConfig.updateMany({
        where: { id: { not: id } },
        data: { isActive: false }
    })

    // Activate this one
    const updated = await prisma.curriculumConfig.update({
        where: { id },
        data: { isActive: true }
    })

    return updated
}

/**
 * Link curriculum to academic year
 */
export const linkCurriculumToAcademicYear = async (request, h) => {
    const { curriculumId, academicYearId, gradeLevel } = request.payload

    try {
        const link = await prisma.academicYearCurriculum.upsert({
            where: {
                academicYearId_gradeLevel: {
                    academicYearId,
                    gradeLevel: gradeLevel || null
                }
            },
            update: {
                curriculumId
            },
            create: {
                academicYearId,
                curriculumId,
                gradeLevel: gradeLevel || null
            },
            include: {
                academicYear: true,
                curriculum: true
            }
        })

        return h.response(link).code(201)
    } catch (error) {
        if (error.code === 'P2003') {
            return h.response({ error: 'Invalid curriculum or academic year ID' }).code(400)
        }
        throw error
    }
}

/**
 * List report templates
 */
export const listReportTemplates = async (request, h) => {
    const { isActive } = request.query

    const where = {}
    if (isActive !== undefined) {
        where.isActive = isActive === 'true'
    }

    return prisma.reportTemplate.findMany({
        where,
        orderBy: { createdAt: 'desc' }
    })
}

/**
 * Get a report template by code
 */
export const getReportTemplate = async (request, h) => {
    const { code } = request.params

    const template = await prisma.reportTemplate.findUnique({
        where: { code }
    })

    if (!template) {
        return h.response({ error: 'Report template not found' }).code(404)
    }

    return template
}
