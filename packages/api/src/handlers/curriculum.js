import { prisma } from '../plugins/prisma.js'

export const listCurriculums = async (request, h) => {
    const curriculums = await prisma.curriculum.findMany({
        where: {
            deletedAt: null // Filter out soft-deleted
        },
        include: {
            _count: {
                select: { modules: true }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return h.response(curriculums).code(200)
}

export const getCurriculum = async (request, h) => {
    const { id } = request.params
    const curriculum = await prisma.curriculum.findFirst({
        where: {
            id,
            deletedAt: null
        },
        include: {
            modules: {
                where: { deletedAt: null }
            }
        }
    })

    if (!curriculum) {
        return h.response({ error: 'Curriculum not found' }).code(404)
    }

    return h.response(curriculum).code(200)
}

export const createCurriculum = async (request, h) => {
    const payload = request.payload

    const newCurriculum = await prisma.curriculum.create({
        data: {
            name: payload.name,
            year: parseInt(payload.year),
            description: payload.description,
            isActive: payload.isActive || false
        }
    })

    // If setting active, deactivate others (optional business rule)
    if (newCurriculum.isActive) {
        await prisma.curriculum.updateMany({
            where: {
                id: { not: newCurriculum.id },
                isActive: true
            },
            data: { isActive: false }
        })
    }

    return h.response(newCurriculum).code(201)
}

export const updateCurriculum = async (request, h) => {
    const { id } = request.params
    const payload = request.payload

    const updated = await prisma.curriculum.update({
        where: { id },
        data: {
            name: payload.name,
            year: payload.year ? parseInt(payload.year) : undefined,
            description: payload.description,
            isActive: payload.isActive
        }
    })

    // If set to active, deactivate others
    if (payload.isActive === true) {
        await prisma.curriculum.updateMany({
            where: {
                id: { not: id },
                isActive: true
            },
            data: { isActive: false }
        })
    }

    return h.response(updated).code(200)
}

export const deleteCurriculum = async (request, h) => {
    const { id } = request.params

    await prisma.curriculum.update({
        where: { id },
        data: {
            deletedAt: new Date(),
            isActive: false
        }
    })

    return h.response({ message: 'Curriculum deleted successfully' }).code(200)
}

// Module Handlers
export const listModules = async (request, h) => {
    const { id } = request.params // Curriculum ID

    // Check if curriculum exists
    const curriculum = await prisma.curriculum.findUnique({
        where: { id }
    })

    if (!curriculum) {
        return h.response({ error: 'Curriculum not found' }).code(404)
    }

    const modules = await prisma.curriculumModule.findMany({
        where: {
            curriculumId: id,
            deletedAt: null
        },
        orderBy: [
            { grade: 'asc' },
            { subjectCode: 'asc' }
        ]
    })

    return h.response(modules).code(200)
}

export const createModule = async (request, h) => {
    const { id } = request.params // Curriculum ID
    const payload = request.payload

    // Verify curriculum exists before creating module
    const curriculum = await prisma.curriculum.findUnique({
        where: { id }
    })

    if (!curriculum) {
        return h.response({
            error: 'Curriculum not found',
            message: `Curriculum dengan ID '${id}' tidak ditemukan. Pastikan ID curriculum valid.`
        }).code(404)
    }

    const newModule = await prisma.curriculumModule.create({
        data: {
            curriculumId: id,
            subjectCode: payload.subjectCode,
            grade: parseInt(payload.grade),
            semester: payload.semester,
            title: payload.title,
            description: payload.description,
            competencies: payload.competencies || []
        }
    })

    return h.response(newModule).code(201)
}

export const updateModule = async (request, h) => {
    const { moduleId } = request.params
    const payload = request.payload

    const updated = await prisma.curriculumModule.update({
        where: { id: moduleId },
        data: {
            subjectCode: payload.subjectCode,
            grade: payload.grade ? parseInt(payload.grade) : undefined,
            semester: payload.semester,
            title: payload.title,
            description: payload.description,
            competencies: payload.competencies
        }
    })

    return h.response(updated).code(200)
}

export const deleteModule = async (request, h) => {
    const { moduleId } = request.params

    await prisma.curriculumModule.update({
        where: { id: moduleId },
        data: { deletedAt: new Date() }
    })

    return h.response({ message: 'Module deleted successfully' }).code(200)
}
