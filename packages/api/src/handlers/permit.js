import { prisma } from '../plugins/prisma.js'

/**
 * List all permits with filters
 */
export const listPermits = async (request, h) => {
    const { search, type, status, studentId, startDate, endDate } = request.query

    const where = {}

    if (type) where.type = type
    if (status) where.status = status
    if (studentId) where.studentId = studentId

    if (startDate || endDate) {
        where.startDate = {}
        if (startDate) where.startDate.gte = new Date(startDate)
        if (endDate) where.startDate.lte = new Date(endDate)
    }

    if (search) {
        where.student = {
            name: { contains: search, mode: 'insensitive' }
        }
    }

    const permits = await prisma.studentPermit.findMany({
        where,
        include: {
            student: {
                select: {
                    id: true,
                    name: true,
                    nis: true,
                    classEnrollments: {
                        where: { status: 'ACTIVE' },
                        include: { class: { select: { name: true } } },
                        take: 1
                    }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return permits.map(p => ({
        ...p,
        studentName: p.student.name,
        studentNis: p.student.nis,
        className: p.student.classEnrollments[0]?.class?.name || '-'
    }))
}

/**
 * Get permit statistics
 */
export const getPermitStats = async (request, h) => {
    const [total, approved, pending, rejected] = await Promise.all([
        prisma.studentPermit.count(),
        prisma.studentPermit.count({ where: { status: 'APPROVED' } }),
        prisma.studentPermit.count({ where: { status: 'PENDING' } }),
        prisma.studentPermit.count({ where: { status: 'REJECTED' } })
    ])

    return { total, approved, pending, rejected }
}

/**
 * Get single permit
 */
export const getPermit = async (request, h) => {
    const { id } = request.params

    const permit = await prisma.studentPermit.findUnique({
        where: { id },
        include: {
            student: {
                select: {
                    id: true, name: true, nis: true, photo: true,
                    classEnrollments: {
                        where: { status: 'ACTIVE' },
                        include: { class: true },
                        take: 1
                    }
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
    const { studentId, type, startDate, endDate, reason, document } = request.payload

    const permit = await prisma.studentPermit.create({
        data: {
            studentId,
            type,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason,
            document
        },
        include: {
            student: { select: { name: true } }
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

    const permit = await prisma.studentPermit.update({
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

    const permit = await prisma.studentPermit.update({
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

    await prisma.studentPermit.delete({ where: { id } })

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

    const permits = await prisma.studentPermit.findMany({
        where,
        include: {
            student: {
                select: {
                    name: true, nis: true,
                    classEnrollments: {
                        where: { status: 'ACTIVE' },
                        include: { class: { select: { name: true } } },
                        take: 1
                    }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    const typeLabels = { SICK: 'Sakit', FAMILY: 'Keluarga', OFFICIAL: 'Dinas', OTHER: 'Lainnya' }
    const statusLabels = { PENDING: 'Menunggu', APPROVED: 'Disetujui', REJECTED: 'Ditolak' }

    let csv = 'NIS,Nama Siswa,Kelas,Jenis,Tanggal Mulai,Tanggal Selesai,Alasan,Status\n'
    permits.forEach(p => {
        csv += `${p.student.nis},"${p.student.name}",${p.student.classEnrollments[0]?.class?.name || '-'},${typeLabels[p.type] || p.type},${p.startDate.toISOString().split('T')[0]},${p.endDate.toISOString().split('T')[0]},"${p.reason}",${statusLabels[p.status] || p.status}\n`
    })

    return h.response(csv)
        .type('text/csv')
        .header('Content-Disposition', `attachment; filename=perizinan-${new Date().toISOString().split('T')[0]}.csv`)
}
