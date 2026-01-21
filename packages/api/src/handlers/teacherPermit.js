import { prisma } from '../plugins/prisma.js'

/**
 * List all permits with filters
 */
export const listPermits = async (request, h) => {
    const { search, type, status, teacherId, startDate, endDate } = request.query

    const where = {}

    if (type) where.type = type
    if (status) where.status = status
    if (teacherId) where.teacherId = teacherId

    if (startDate || endDate) {
        where.startDate = {}
        if (startDate) where.startDate.gte = new Date(startDate)
        if (endDate) where.startDate.lte = new Date(endDate)
    }

    if (search) {
        where.teacher = {
            name: { contains: search, mode: 'insensitive' }
        }
    }

    const permits = await prisma.teacherPermit.findMany({
        where,
        include: {
            teacher: {
                select: {
                    id: true,
                    name: true,
                    nip: true,
                    position: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return permits.map(p => ({
        ...p,
        teacherName: p.teacher.name,
        teacherNip: p.teacher.nip || '-',
        position: p.teacher.position
    }))
}

/**
 * Get permit statistics
 */
export const getPermitStats = async (request, h) => {
    const [total, approved, pending, rejected] = await Promise.all([
        prisma.teacherPermit.count(),
        prisma.teacherPermit.count({ where: { status: 'APPROVED' } }),
        prisma.teacherPermit.count({ where: { status: 'PENDING' } }),
        prisma.teacherPermit.count({ where: { status: 'REJECTED' } })
    ])

    return { total, approved, pending, rejected }
}

/**
 * Get single permit
 */
export const getPermit = async (request, h) => {
    const { id } = request.params

    const permit = await prisma.teacherPermit.findUnique({
        where: { id },
        include: {
            teacher: {
                select: {
                    id: true, name: true, nip: true, photo: true, position: true
                }
            }
        }
    })

    if (!permit) {
        return h.response({ error: 'Perizinan tidak ditemukan' }).code(404)
    }

    return permit
}

/**
 * Create new permit
 */
export const createPermit = async (request, h) => {
    const { teacherId, type, startDate, endDate, reason, document } = request.payload

    const permit = await prisma.teacherPermit.create({
        data: {
            teacherId,
            type,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason,
            document
        },
        include: {
            teacher: { select: { name: true } }
        }
    })

    return h.response(permit).code(201)
}

/**
 * Update permit status (approve/reject)
 */
export const updatePermitStatus = async (request, h) => {
    const { id } = request.params
    const { status, approvedBy } = request.payload

    const permit = await prisma.teacherPermit.update({
        where: { id },
        data: { status, approvedBy }
    })

    return permit
}

/**
 * Update permit details
 */
export const updatePermit = async (request, h) => {
    const { id } = request.params
    const data = { ...request.payload }

    if (data.startDate) data.startDate = new Date(data.startDate)
    if (data.endDate) data.endDate = new Date(data.endDate)

    const permit = await prisma.teacherPermit.update({
        where: { id },
        data
    })

    return permit
}

/**
 * Delete permit
 */
export const deletePermit = async (request, h) => {
    const { id } = request.params

    await prisma.teacherPermit.delete({ where: { id } })

    return h.response({ message: 'Perizinan berhasil dihapus' }).code(200)
}

/**
 * Export permits to CSV
 */
export const exportPermits = async (request, h) => {
    const { startDate, endDate, status, type } = request.query

    const where = {}
    if (type) where.type = type
    if (status) where.status = status
    if (startDate || endDate) {
        where.startDate = {}
        if (startDate) where.startDate.gte = new Date(startDate)
        if (endDate) where.startDate.lte = new Date(endDate)
    }

    const permits = await prisma.teacherPermit.findMany({
        where,
        include: {
            teacher: {
                select: {
                    name: true, nip: true, position: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    const typeLabels = { SICK: 'Sakit', FAMILY: 'Keluarga', OFFICIAL: 'Dinas', OTHER: 'Lainnya' }
    const statusLabels = { PENDING: 'Menunggu', APPROVED: 'Disetujui', REJECTED: 'Ditolak' }

    let csv = 'NIP,Nama Guru,Posisi,Jenis,Tanggal Mulai,Tanggal Selesai,Alasan,Status\n'
    permits.forEach(p => {
        csv += `${p.teacher.nip || '-'},"${p.teacher.name}",${p.teacher.position},${typeLabels[p.type] || p.type},${p.startDate.toISOString().split('T')[0]},${p.endDate.toISOString().split('T')[0]},"${p.reason}",${statusLabels[p.status] || p.status}\n`
    })

    return h.response(csv)
        .type('text/csv')
        .header('Content-Disposition', `attachment; filename=perizinan-guru-${new Date().toISOString().split('T')[0]}.csv`)
}
