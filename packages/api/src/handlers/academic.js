import { prisma } from '../plugins/prisma.js'

// Academic Years
export const listAcademicYears = async (request, h) => {
    const years = await prisma.academicYear.findMany({
        orderBy: { startDate: 'desc' },
        include: {
            _count: { select: { classes: true } }
        }
    })

    // Add student count for each year
    const result = await Promise.all(years.map(async year => {
        const studentCount = await prisma.classEnrollment.count({
            where: {
                class: { academicYearId: year.id },
                status: 'ACTIVE'
            }
        })
        return { ...year, studentCount }
    }))

    return result
}

export const getAcademicYear = async (request, h) => {
    const { id } = request.params
    const year = await prisma.academicYear.findUnique({
        where: { id },
        include: {
            classes: {
                include: { homeroomTeacher: true, _count: { select: { enrollments: true } } }
            }
        }
    })
    if (!year) {
        return h.response({ error: 'Academic year not found' }).code(404)
    }
    return year
}

export const createAcademicYear = async (request, h) => {
    if (request.payload.isActive) {
        await prisma.academicYear.updateMany({ data: { isActive: false } })
    }
    const year = await prisma.academicYear.create({ data: request.payload })
    return h.response(year).code(201)
}

export const updateAcademicYear = async (request, h) => {
    const { id } = request.params
    if (request.payload.isActive) {
        await prisma.academicYear.updateMany({
            where: { id: { not: id } },
            data: { isActive: false }
        })
    }
    const year = await prisma.academicYear.update({
        where: { id },
        data: request.payload
    })
    return year
}

export const deleteAcademicYear = async (request, h) => {
    const { id } = request.params
    // Check if year has classes
    const classCount = await prisma.class.count({ where: { academicYearId: id } })
    if (classCount > 0) {
        return h.response({
            error: 'Tidak dapat menghapus tahun ajaran yang memiliki kelas'
        }).code(400)
    }
    await prisma.academicYear.delete({ where: { id } })
    return h.response().code(204)
}

// Classes
export const listClasses = async (request, h) => {
    const { academicYearId, grade, major, search } = request.query

    const where = {
        deletedAt: null  // Only show non-deleted classes
    }
    if (academicYearId) where.academicYearId = academicYearId
    if (grade) where.grade = parseInt(grade)
    if (major) where.major = major
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { major: { contains: search, mode: 'insensitive' } },
            { homeroomTeacher: { name: { contains: search, mode: 'insensitive' } } }
        ]
    }

    return prisma.class.findMany({
        where,
        include: {
            homeroomTeacher: true,
            academicYear: true,
            _count: {
                select: {
                    enrollments: {
                        where: { status: 'ACTIVE' }
                    }
                }
            }
        },
        orderBy: [{ grade: 'asc' }, { name: 'asc' }]
    })
}

export const getClass = async (request, h) => {
    const { id } = request.params
    const cls = await prisma.class.findUnique({
        where: { id },
        include: {
            homeroomTeacher: true,
            academicYear: true,
            enrollments: {
                include: { student: true },
                where: { status: 'ACTIVE' }
            }
        }
    })
    if (!cls) {
        return h.response({ error: 'Class not found' }).code(404)
    }
    return cls
}

export const createClass = async (request, h) => {
    const cls = await prisma.class.create({
        data: request.payload,
        include: { homeroomTeacher: true }
    })
    return h.response(cls).code(201)
}

export const updateClass = async (request, h) => {
    const { id } = request.params
    const cls = await prisma.class.update({
        where: { id },
        data: request.payload,
        include: { homeroomTeacher: true }
    })
    return cls
}

export const deleteClass = async (request, h) => {
    const { id } = request.params

    // Check if class exists and is not already deleted
    const existingClass = await prisma.class.findUnique({ where: { id } })
    if (!existingClass || existingClass.deletedAt) {
        return h.response({ error: 'Kelas tidak ditemukan' }).code(404)
    }

    // Check if class has enrolled students
    const enrollmentCount = await prisma.classEnrollment.count({
        where: { classId: id, status: 'ACTIVE' }
    })
    if (enrollmentCount > 0) {
        return h.response({
            error: 'Tidak dapat menghapus kelas yang masih memiliki siswa aktif'
        }).code(400)
    }

    // Soft delete by setting deletedAt timestamp
    await prisma.class.update({
        where: { id },
        data: { deletedAt: new Date() }
    })

    return h.response({ message: 'Kelas berhasil dihapus' }).code(200)
}

// Subjects
export const listSubjects = async (request, h) => {
    const { category, search } = request.query
    const where = {
        deletedAt: null
    }
    if (category) where.category = category
    if (search) {
        where.name = { contains: search, mode: 'insensitive' }
    }

    return prisma.subject.findMany({
        where,
        include: { teachers: { include: { teacher: true } } },
        orderBy: { name: 'asc' }
    })
}

export const getSubject = async (request, h) => {
    const { id } = request.params
    const subject = await prisma.subject.findUnique({
        where: { id },
        include: { teachers: { include: { teacher: true } } }
    })
    if (!subject || subject.deletedAt) {
        return h.response({ error: 'Mata pelajaran tidak ditemukan' }).code(404)
    }
    return subject
}

export const createSubject = async (request, h) => {
    const subject = await prisma.subject.create({ data: request.payload })
    return h.response(subject).code(201)
}

export const updateSubject = async (request, h) => {
    const { id } = request.params
    const { code } = request.payload

    if (code) {
        const existing = await prisma.subject.findFirst({
            where: { code, id: { not: id } }
        })
        if (existing) {
            return h.response({ error: 'Kode mata pelajaran sudah digunakan' }).code(400)
        }
    }

    const subject = await prisma.subject.update({
        where: { id },
        data: request.payload
    })
    return subject
}

export const deleteSubject = async (request, h) => {
    const { id } = request.params

    // Check usage in classes/schedules/assignments if needed
    // For now, simple soft delete

    await prisma.subject.update({
        where: { id },
        data: { deletedAt: new Date() }
    })

    return h.response({ message: 'Mata pelajaran berhasil dihapus' }).code(200)
}

// Schedules
export const listSchedules = async (request, h) => {
    const { classId, dayOfWeek } = request.query

    const where = {
        deletedAt: null
    }
    if (classId) where.classId = classId
    if (dayOfWeek !== undefined) where.dayOfWeek = parseInt(dayOfWeek)

    const schedules = await prisma.classSchedule.findMany({
        where,
        include: {
            class: true,
            subject: true
        },
        orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }]
    })

    // Manually enrich with teacher data
    const teacherIds = [...new Set(schedules.map(s => s.teacherId).filter(Boolean))]

    if (teacherIds.length > 0) {
        const teachers = await prisma.teacher.findMany({
            where: { id: { in: teacherIds } },
            select: { id: true, name: true, nip: true }
        })
        const teacherMap = Object.fromEntries(teachers.map(t => [t.id, t]))
        return schedules.map(s => ({
            ...s,
            teacher: s.teacherId ? (teacherMap[s.teacherId] || null) : null
        }))
    }

    return schedules
}

export const createSchedule = async (request, h) => {
    const schedule = await prisma.classSchedule.create({ data: request.payload })
    return h.response(schedule).code(201)
}

export const updateSchedule = async (request, h) => {
    const { id } = request.params
    const schedule = await prisma.classSchedule.update({
        where: { id },
        data: request.payload
    })
    return schedule
}

export const deleteSchedule = async (request, h) => {
    const { id } = request.params
    await prisma.classSchedule.update({
        where: { id },
        data: { deletedAt: new Date() }
    })
    return h.response({ message: 'Jadwal berhasil dihapus' }).code(200)
}

// Calendar
export const listCalendarEvents = async (request, h) => {
    const { academicYearId, type, startDate, endDate } = request.query

    const where = {
        deletedAt: null
    }
    if (academicYearId) where.academicYearId = academicYearId
    if (type) where.type = type
    if (startDate || endDate) {
        where.startDate = {}
        if (startDate) where.startDate.gte = new Date(startDate)
        if (endDate) where.startDate.lte = new Date(endDate)
    }

    return prisma.academicCalendarEvent.findMany({
        where,
        orderBy: { startDate: 'asc' }
    })
}

export const createCalendarEvent = async (request, h) => {
    const event = await prisma.academicCalendarEvent.create({ data: request.payload })
    return h.response(event).code(201)
}

export const updateCalendarEvent = async (request, h) => {
    const { id } = request.params
    const event = await prisma.academicCalendarEvent.update({
        where: { id },
        data: request.payload
    })
    return event
}

export const deleteCalendarEvent = async (request, h) => {
    const { id } = request.params
    await prisma.academicCalendarEvent.update({
        where: { id },
        data: { deletedAt: new Date() }
    })
    return h.response({ message: 'Event berhasil dihapus' }).code(200)
}
