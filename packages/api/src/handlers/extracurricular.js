import { prisma } from '../plugins/prisma.js'

/**
 * List all extracurriculars with filters
 */
export const listExtracurriculars = async (request, h) => {
    const { search, category, isActive } = request.query

    const where = {}

    if (isActive !== undefined) {
        where.isActive = isActive === 'true'
    }

    if (category) {
        where.category = category
    }

    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { advisor: { name: { contains: search, mode: 'insensitive' } } }
        ]
    }

    return prisma.extracurricular.findMany({
        where,
        include: {
            advisor: true,
            _count: { select: { members: true } }
        },
        orderBy: { name: 'asc' }
    })
}

/**
 * Get single extracurricular by ID
 */
export const getExtracurricular = async (request, h) => {
    const { id } = request.params

    const extracurricular = await prisma.extracurricular.findUnique({
        where: { id },
        include: {
            advisor: true,
            members: {
                include: {
                    student: {
                        select: { id: true, name: true, nis: true, photo: true }
                    }
                },
                where: { status: 'ACTIVE' }
            },
            _count: { select: { members: true } }
        }
    })

    if (!extracurricular) {
        return h.response({ error: 'Ekstrakurikuler tidak ditemukan' }).code(404)
    }

    return extracurricular
}

/**
 * Create new extracurricular
 */
export const createExtracurricular = async (request, h) => {
    const extracurricular = await prisma.extracurricular.create({
        data: request.payload,
        include: { advisor: true }
    })
    return h.response(extracurricular).code(201)
}

/**
 * Update extracurricular
 */
export const updateExtracurricular = async (request, h) => {
    const { id } = request.params

    const extracurricular = await prisma.extracurricular.update({
        where: { id },
        data: request.payload,
        include: { advisor: true }
    })
    return extracurricular
}

/**
 * Delete extracurricular
 */
export const deleteExtracurricular = async (request, h) => {
    const { id } = request.params

    // Check if has active members
    const memberCount = await prisma.extracurricularMember.count({
        where: { extracurricularId: id, status: 'ACTIVE' }
    })

    if (memberCount > 0) {
        return h.response({
            error: 'Tidak dapat menghapus ekstrakurikuler yang masih memiliki anggota aktif'
        }).code(400)
    }

    await prisma.extracurricular.delete({ where: { id } })
    return h.response({ message: 'Ekstrakurikuler berhasil dihapus' }).code(200)
}

/**
 * Add member to extracurricular
 */
export const addMember = async (request, h) => {
    const { extracurricularId, studentId, role } = request.payload

    // Check if already member
    const existing = await prisma.extracurricularMember.findUnique({
        where: { extracurricularId_studentId: { extracurricularId, studentId } }
    })

    if (existing) {
        if (existing.status === 'ACTIVE') {
            return h.response({ error: 'Siswa sudah menjadi anggota' }).code(400)
        }
        // Reactivate
        const member = await prisma.extracurricularMember.update({
            where: { id: existing.id },
            data: { status: 'ACTIVE', role },
            include: { student: true }
        })
        return member
    }

    const member = await prisma.extracurricularMember.create({
        data: { extracurricularId, studentId, role },
        include: { student: true }
    })
    return h.response(member).code(201)
}

/**
 * Remove member from extracurricular
 */
export const removeMember = async (request, h) => {
    const { id } = request.params

    await prisma.extracurricularMember.update({
        where: { id },
        data: { status: 'INACTIVE' }
    })

    return h.response({ message: 'Anggota berhasil dikeluarkan' }).code(200)
}

/**
 * Get available categories
 */
export const getCategories = async (request, h) => {
    const categories = await prisma.extracurricular.findMany({
        select: { category: true },
        distinct: ['category']
    })
    return categories.map(c => c.category)
}
