import Boom from '@hapi/boom'
import { prisma } from '../plugins/prisma.js'

/**
 * List teachers
 */
export const listTeachers = async (request, h) => {
    const { page, limit, search, position, status } = request.query

    const where = {}
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { nip: { contains: search } },
            { email: { contains: search, mode: 'insensitive' } }
        ]
    }
    if (position) where.position = position
    if (status) where.status = status

    const [teachers, total] = await Promise.all([
        prisma.teacher.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { name: 'asc' },
            include: { subjects: { include: { subject: true } } }
        }),
        prisma.teacher.count({ where })
    ])

    return {
        data: teachers,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
    }
}

/**
 * Get teacher by ID
 */
export const getTeacher = async (request, h) => {
    const { id } = request.params

    const teacher = await prisma.teacher.findUnique({
        where: { id },
        include: {
            subjects: { include: { subject: true } },
            homerooms: true,
            teachingSchedules: true,
            performances: true
        }
    })

    if (!teacher) throw Boom.notFound('Teacher not found')
    return teacher
}

/**
 * Create teacher
 */
export const createTeacher = async (request, h) => {
    const { subjectIds, password, ...data } = request.payload

    if (!data.email) throw Boom.badRequest('Email is required')

    let userId = undefined

    if (password) {
        const existingUser = await prisma.user.findUnique({ where: { email: data.email } })
        if (existingUser) throw Boom.conflict('User with this email already exists')

        const { hashPassword } = await import('better-auth/crypto')
        const hashedPassword = await hashPassword(password)

        return await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: data.email,
                    name: data.name,
                    role: 'TEACHER',
                    emailVerified: true,
                    status: 'ACTIVE'
                }
            })

            await tx.account.create({
                data: {
                    userId: user.id,
                    accountId: user.id,
                    providerId: 'credential',
                    password: hashedPassword
                }
            })

            const createData = {
                ...data,
                userId: user.id,
                subjects: subjectIds?.length ? {
                    create: subjectIds.map(subjectId => ({ subjectId }))
                } : undefined
            }

            const teacher = await tx.teacher.create({ data: createData })
            return h.response(teacher).code(201)
        })
    }

    const createData = {
        ...data,
        subjects: subjectIds?.length ? {
            create: subjectIds.map(subjectId => ({ subjectId }))
        } : undefined
    }

    const teacher = await prisma.teacher.create({ data: createData })
    return h.response(teacher).code(201)
}

/**
 * Update teacher
 */
export const updateTeacher = async (request, h) => {
    const { id } = request.params
    const { subjectIds, ...data } = request.payload

    const updateData = { ...data }

    if (subjectIds) {
        await prisma.teacherSubject.deleteMany({ where: { teacherId: id } })

        updateData.subjects = {
            create: subjectIds.map(subjectId => ({ subjectId }))
        }
    }

    const teacher = await prisma.teacher.update({
        where: { id },
        data: updateData
    })
    return teacher
}

/**
 * Delete teacher
 */
export const deleteTeacher = async (request, h) => {
    const { id } = request.params
    await prisma.teacher.delete({ where: { id } })
    return h.response().code(204)
}

/**
 * Record teacher attendance
 */
export const recordTeacherAttendance = async (request, h) => {
    const { teacherId, date, status, checkInTime, checkOutTime, notes } = request.payload

    const attendance = await prisma.teacherAttendance.upsert({
        where: { teacherId_date: { teacherId, date: new Date(date) } },
        update: { status, checkInTime, checkOutTime, notes },
        create: { teacherId, date: new Date(date), status, checkInTime, checkOutTime, notes }
    })

    return h.response(attendance).code(201)
}

/**
 * Export teachers to CSV
 */
export const exportTeachers = async (request, h) => {
    const { search, position, status } = request.query

    const where = {}
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { nip: { contains: search } },
            { email: { contains: search, mode: 'insensitive' } }
        ]
    }
    if (position) where.position = position
    if (status) where.status = status

    const teachers = await prisma.teacher.findMany({
        where,
        orderBy: { name: 'asc' },
        include: { subjects: { include: { subject: true } } }
    })

    let csv = 'NIP,Nama,Posisi,Status,Email,Telepon,Alamat,Mata Pelajaran,Pendidikan Terakhir\n'
    teachers.forEach(t => {
        const subjects = t.subjects.map(s => s.subject.name).join(';')
        csv += `${t.nip || '-'},"${t.name}",${t.position},${t.status},${t.email || '-'},${t.phone || '-'},"${t.address || '-'}",${subjects},${t.education || '-'}\n`
    })

    return h.response(csv)
        .type('text/csv')
        .header('Content-Disposition', `attachment; filename=guru-${new Date().toISOString().split('T')[0]}.csv`)
}

/**
 * Get logged-in teacher's schedule
 */
export const getMyTeachingSchedule = async (request, h) => {
    const { getSession } = await import('../plugins/auth.js')
    const session = await getSession(request)

    if (!session) throw Boom.unauthorized('Anda harus login terlebih dahulu')

    const userId = session.user.id

    const teacher = await prisma.teacher.findUnique({
        where: { userId }
    })

    if (!teacher) throw Boom.forbidden('Anda tidak terdaftar sebagai guru')

    const schedules = await prisma.classSchedule.findMany({
        where: { teacherId: teacher.id },
        include: {
            class: {
                include: {
                    _count: {
                        select: { enrollments: true }
                    }
                }
            },
            subject: true
        },
        orderBy: [
            { dayOfWeek: 'asc' },
            { startTime: 'asc' }
        ]
    })

    return schedules
}

/**
 * Get logged-in teacher profile
 */
export const getMe = async (request, h) => {
    const { getSession } = await import('../plugins/auth.js')
    const session = await getSession(request)

    if (!session) throw Boom.unauthorized('Anda harus login terlebih dahulu')

    const teacher = await prisma.teacher.findUnique({
        where: { userId: session.user.id },
        include: {
            subjects: { include: { subject: true } }
        }
    })

    if (!teacher) throw Boom.forbidden('Anda tidak terdaftar sebagai guru')

    return teacher
}

/**
 * Calculate distance between two points in meters (Haversine formula)
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3
    const φ1 = lat1 * Math.PI / 180
    const φ2 = lat2 * Math.PI / 180
    const Δφ = (lat2 - lat1) * Math.PI / 180
    const Δλ = (lon2 - lon1) * Math.PI / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
}

/**
 * Teacher Self Check-in
 */
export const selfCheckIn = async (request, h) => {
    const { latitude, longitude, photo } = request.payload

    const { getSession } = await import('../plugins/auth.js')
    const session = await getSession(request)
    if (!session) throw Boom.unauthorized('Anda harus login terlebih dahulu')

    const userId = session.user.id

    const teacher = await prisma.teacher.findUnique({
        where: { userId }
    })
    if (!teacher) throw Boom.forbidden('Data guru tidak ditemukan')

    const now = new Date()
    const dateString = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })
    const today = new Date(dateString)

    const existing = await prisma.teacherAttendance.findUnique({
        where: {
            teacherId_date: {
                teacherId: teacher.id,
                date: today
            }
        }
    })

    if (existing) {
        throw Boom.conflict('Anda sudah melakukan presensi hari ini')
    }

    const school = await prisma.school.findFirst()
    if (school && school.latitude !== null && school.longitude !== null) {
        const distance = haversineDistance(latitude, longitude, school.latitude, school.longitude)
        const MAX_DISTANCE = 200
        if (distance > MAX_DISTANCE) {
            throw Boom.forbidden(`Lokasi anda terlalu jauh dari sekolah (${Math.round(distance)}m). Maksimal ${MAX_DISTANCE}m.`)
        }
    }

    let photoUrl = null
    if (photo) {
        const { uploadFile } = await import('../utils/fileUpload.js')
        const filename = await uploadFile(photo)
        photoUrl = `/uploads/${filename}`
    } else {
        throw Boom.badRequest('Foto wajah wajib diupload')
    }

    const status = 'PRESENT'

    const attendance = await prisma.teacherAttendance.create({
        data: {
            teacherId: teacher.id,
            date: today,
            status,
            checkInTime: now,
            checkInLat: parseFloat(latitude),
            checkInLong: parseFloat(longitude),
            photoUrl
        }
    })

    return h.response({
        success: true,
        message: 'Berhasil melakukan presensi',
        data: attendance
    }).code(201)
}

/**
 * Get current logged-in teacher's own attendance
 */
export const getMyAttendance = async (request, h) => {
    const { startDate, endDate } = request.query

    const { getSession } = await import('../plugins/auth.js')
    const session = await getSession(request)
    if (!session) throw Boom.unauthorized('Anda harus login terlebih dahulu')

    const teacher = await prisma.teacher.findUnique({
        where: { userId: session.user.id }
    })

    if (!teacher) return []

    const where = { teacherId: teacher.id }
    if (startDate || endDate) {
        where.date = {}
        if (startDate) where.date.gte = new Date(startDate)
        if (endDate) where.date.lte = new Date(endDate)
    }

    return prisma.teacherAttendance.findMany({
        where,
        orderBy: { date: 'desc' }
    })
}

/**
 * Get current logged-in teacher's permits
 */
export const getMyPermits = async (request, h) => {
    const { getSession } = await import('../plugins/auth.js')
    const session = await getSession(request)
    if (!session) throw Boom.unauthorized('Anda harus login terlebih dahulu')

    const teacher = await prisma.teacher.findUnique({
        where: { userId: session.user.id }
    })

    if (!teacher) return []

    return prisma.teacherPermit.findMany({
        where: { teacherId: teacher.id },
        orderBy: { createdAt: 'desc' }
    })
}

/**
 * Create permit request for current logged-in teacher
 */
export const createMyPermit = async (request, h) => {
    const { getSession } = await import('../plugins/auth.js')
    const session = await getSession(request)
    if (!session) throw Boom.unauthorized('Anda harus login terlebih dahulu')

    const teacher = await prisma.teacher.findUnique({
        where: { userId: session.user.id }
    })
    if (!teacher) throw Boom.forbidden('Data guru tidak ditemukan')

    const { type, startDate, endDate, reason, document } = request.payload

    let documentUrl = null
    if (document && document.hapi) {
        const { uploadFile } = await import('../utils/fileUpload.js')
        const filename = await uploadFile(document)
        documentUrl = `/uploads/${filename}`
    }

    const permit = await prisma.teacherPermit.create({
        data: {
            teacherId: teacher.id,
            type,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason,
            document: documentUrl,
            status: 'PENDING'
        }
    })

    return h.response({
        success: true,
        message: 'Permohonan izin berhasil diajukan',
        data: permit
    }).code(201)
}
