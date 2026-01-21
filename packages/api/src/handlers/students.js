import Boom from '@hapi/boom'
import { prisma } from '../plugins/prisma.js'
import { uploadFile } from '../utils/fileUpload.js'

/**
 * List all students with pagination
 */
/**
 * List all students with pagination
 */
export const listStudents = async (request, h) => {
    const { page, limit, search, classId, status, includeDeleted } = request.query

    const where = {}
    // Soft delete filter
    if (!includeDeleted) {
        where.deletedAt = null
    }

    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { nis: { contains: search } },
            { nisn: { contains: search } },
            { nik: { contains: search } },
            { email: { equals: search, mode: 'insensitive' } }
        ]
    }
    if (status) where.status = status
    if (status) where.status = status
    if (request.query.email) where.email = request.query.email

    if (classId) {
        where.classEnrollments = {
            some: {
                classId: classId,
                status: 'ACTIVE'
            }
        }
    }

    const [students, total] = await Promise.all([
        prisma.student.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { name: 'asc' },
            include: {
                classEnrollments: {
                    where: { status: 'ACTIVE' },
                    include: { class: true },
                    take: 1
                }
            }
        }),
        prisma.student.count({ where })
    ])

    return {
        data: students,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
    }
}

/**
 * Get single student by ID
 */
export const getStudent = async (request, h) => {
    const { id } = request.params

    const student = await prisma.student.findUnique({
        where: { id },
        include: {
            classEnrollments: { include: { class: true } },
            grades: { include: { subject: true } },
            attendances: { orderBy: { date: 'desc' }, take: 30 },
            sppBillings: { orderBy: { dueDate: 'desc' }, take: 12 }
        }
    })

    if (!student) throw Boom.notFound('Student not found')
    // If soft deleted, only show if explicitly requested? 
    // Usually individual GET returns it, or 404. Let's return it but maybe UI handles it.
    // Or strictly 404. Given "trash bin" concept, it might be viewable in "Bin".
    // I'll leave it accessible for now.

    return student
}

/**
 * Create new student
 */
export const createStudent = async (request, h) => {
    const { photo, ...data } = request.payload

    // Handle photo upload
    let photoUrl = null
    if (photo && photo.hapi && photo.hapi.filename) {
        const filename = await uploadFile(photo)
        photoUrl = `/uploads/${filename}`
    } else if (typeof photo === 'string') {
        photoUrl = photo
    }

    const student = await prisma.student.create({
        data: {
            ...data,
            photo: photoUrl
        }
    })
    return h.response(student).code(201)
}

/**
 * Update student
 */
export const updateStudent = async (request, h) => {
    const { id } = request.params
    const { photo, ...data } = request.payload

    // Handle photo upload
    let photoUrl = undefined
    if (photo && photo.hapi && photo.hapi.filename) {
        const filename = await uploadFile(photo)
        photoUrl = `/uploads/${filename}`
    } else if (typeof photo === 'string') {
        photoUrl = photo
    }

    const updateData = { ...data }
    if (photoUrl !== undefined) updateData.photo = photoUrl

    const student = await prisma.student.update({
        where: { id },
        data: updateData
    })
    return student
}

/**
 * Delete student (Soft Delete)
 */
export const deleteStudent = async (request, h) => {
    const { id } = request.params
    await prisma.student.update({
        where: { id },
        data: { deletedAt: new Date() }
    })
    return h.response().code(204)
}

/**
 * Get student attendance
 */
export const getStudentAttendance = async (request, h) => {
    const { id } = request.params
    const { startDate, endDate } = request.query

    const where = { studentId: id }
    if (startDate || endDate) {
        where.date = {}
        if (startDate) where.date.gte = new Date(startDate)
        if (endDate) where.date.lte = new Date(endDate)
    }

    return prisma.studentAttendance.findMany({
        where,
        orderBy: { date: 'desc' }
    })
}

/**
 * Get current logged-in student's profile
 */
export const getMyProfile = async (request, h) => {
    // 1. Get Session
    const { getSession } = await import('../plugins/auth.js')
    const session = await getSession(request)
    if (!session) throw Boom.unauthorized('Anda harus login terlebih dahulu')

    const userEmail = session.user.email

    // 2. Get Student by Email
    const student = await prisma.student.findFirst({
        where: { email: userEmail },
        include: {
            classEnrollments: {
                where: { status: 'ACTIVE' },
                include: { class: true }
            },
            grades: {
                include: { subject: true }
            }
        }
    })

    if (!student) throw Boom.notFound('Student profile not found')

    return student
}

/**
 * Get current logged-in student's own attendance
 */
export const getMyAttendance = async (request, h) => {
    const { startDate, endDate } = request.query

    // 1. Get Session
    const { getSession } = await import('../plugins/auth.js')
    const session = await getSession(request)
    if (!session) throw Boom.unauthorized('Anda harus login terlebih dahulu')

    const userEmail = session.user.email

    // 2. Get Student by Email
    const student = await prisma.student.findFirst({
        where: { email: userEmail }
    })

    // Return empty array if student not found (allows page to load)
    if (!student) {
        console.warn(`Student not found for email: ${userEmail}`)
        return []
    }

    // 3. Build query
    const where = { studentId: student.id }
    if (startDate || endDate) {
        where.date = {}
        if (startDate) where.date.gte = new Date(startDate)
        if (endDate) where.date.lte = new Date(endDate)
    }

    return prisma.studentAttendance.findMany({
        where,
        orderBy: { date: 'desc' }
    })
}

/**
 * Record student attendance
 */
export const recordAttendance = async (request, h) => {
    const { studentId, date, status, checkInTime, checkOutTime, notes } = request.payload

    const attendance = await prisma.studentAttendance.upsert({
        where: { studentId_date: { studentId, date: new Date(date) } },
        update: {
            status,
            checkInTime: checkInTime ? new Date(checkInTime) : undefined,
            checkOutTime: checkOutTime ? new Date(checkOutTime) : undefined,
            notes
        },
        create: {
            studentId,
            date: new Date(date),
            status,
            checkInTime: checkInTime ? new Date(checkInTime) : undefined,
            checkOutTime: checkOutTime ? new Date(checkOutTime) : undefined,
            notes
        }
    })

    return h.response(attendance).code(201)
}

/**
 * Get attendance summary for a specific date (today or selected date)
 */
export const getAttendanceSummary = async (request, h) => {
    const { date, classId } = request.query
    const targetDate = date ? new Date(date) : new Date()

    // Set date to start of day
    const startOfDay = new Date(targetDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(targetDate)
    endOfDay.setHours(23, 59, 59, 999)

    const where = {
        date: { gte: startOfDay, lte: endOfDay }
    }

    // Get all attendance for the day
    const attendances = await prisma.studentAttendance.findMany({
        where,
        include: {
            student: {
                include: {
                    classEnrollments: {
                        where: { status: 'ACTIVE' },
                        include: { class: true }
                    }
                }
            }
        }
    })

    // Filter by class if specified
    let filtered = attendances
    if (classId) {
        filtered = attendances.filter(a =>
            a.student.classEnrollments.some(e => e.classId === classId)
        )
    }

    // Calculate summary
    const summary = {
        date: targetDate.toISOString().split('T')[0],
        present: filtered.filter(a => a.status === 'PRESENT').length,
        sick: filtered.filter(a => a.status === 'SICK').length,
        permitted: filtered.filter(a => a.status === 'PERMITTED').length,
        absent: filtered.filter(a => a.status === 'ABSENT').length,
        late: filtered.filter(a => a.status === 'LATE').length,
        total: filtered.length
    }

    // Get per-class breakdown
    const classMap = new Map()
    for (const att of filtered) {
        const className = att.student.classEnrollments[0]?.class?.name || 'Tidak ada kelas'
        const classId = att.student.classEnrollments[0]?.classId || 'none'
        if (!classMap.has(classId)) {
            classMap.set(classId, {
                classId,
                className,
                present: 0, sick: 0, permitted: 0, absent: 0, late: 0, total: 0
            })
        }
        const entry = classMap.get(classId)
        entry[att.status.toLowerCase()]++
        entry.total++
    }

    return {
        summary,
        byClass: Array.from(classMap.values())
    }
}

/**
 * Get attendance recap - monthly, semester, or yearly
 */
export const getAttendanceRecap = async (request, h) => {
    const { period = 'monthly', year, month, semester } = request.query
    const currentYear = year ? parseInt(year) : new Date().getFullYear()

    let startDate, endDate, periodLabel

    if (period === 'monthly') {
        const targetMonth = month ? parseInt(month) - 1 : new Date().getMonth()
        startDate = new Date(currentYear, targetMonth, 1)
        endDate = new Date(currentYear, targetMonth + 1, 0, 23, 59, 59)
        periodLabel = startDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    } else if (period === 'semester') {
        const targetSemester = semester || (new Date().getMonth() < 6 ? 1 : 2)
        if (targetSemester === 1) {
            startDate = new Date(currentYear, 0, 1)
            endDate = new Date(currentYear, 5, 30, 23, 59, 59)
            periodLabel = `Semester 1 ${currentYear}`
        } else {
            startDate = new Date(currentYear, 6, 1)
            endDate = new Date(currentYear, 11, 31, 23, 59, 59)
            periodLabel = `Semester 2 ${currentYear}`
        }
    } else {
        startDate = new Date(currentYear, 0, 1)
        endDate = new Date(currentYear, 11, 31, 23, 59, 59)
        periodLabel = `Tahun ${currentYear}`
    }

    // Get all students with their attendance in this period
    const students = await prisma.student.findMany({
        where: { deletedAt: null, status: 'ACTIVE' },
        include: {
            attendances: {
                where: { date: { gte: startDate, lte: endDate } }
            },
            classEnrollments: {
                where: { status: 'ACTIVE' },
                include: { class: true }
            }
        }
    })

    // Calculate attendance percentage for each student
    const recap = students.map(student => {
        const totalDays = student.attendances.length
        const presentDays = student.attendances.filter(a =>
            a.status === 'PRESENT' || a.status === 'LATE'
        ).length
        const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0

        return {
            studentId: student.id,
            studentName: student.name,
            nis: student.nis,
            className: student.classEnrollments[0]?.class?.name || '-',
            totalDays,
            present: student.attendances.filter(a => a.status === 'PRESENT').length,
            late: student.attendances.filter(a => a.status === 'LATE').length,
            sick: student.attendances.filter(a => a.status === 'SICK').length,
            permitted: student.attendances.filter(a => a.status === 'PERMITTED').length,
            absent: student.attendances.filter(a => a.status === 'ABSENT').length,
            percentage,
            isLowAttendance: percentage < 60 && totalDays > 0
        }
    })

    // Sort by percentage ascending (lowest first)
    recap.sort((a, b) => a.percentage - b.percentage)

    return {
        period: periodLabel,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        totalStudents: recap.length,
        lowAttendanceCount: recap.filter(r => r.isLowAttendance).length,
        students: recap
    }
}

/**
 * Get students with low attendance (below threshold)
 */
export const getLowAttendanceStudents = async (request, h) => {
    const { threshold = 60, period = 'semester', year, semester } = request.query
    const currentYear = year ? parseInt(year) : new Date().getFullYear()

    let startDate, endDate

    if (period === 'semester') {
        const targetSemester = semester || (new Date().getMonth() < 6 ? 1 : 2)
        if (targetSemester === 1) {
            startDate = new Date(currentYear, 0, 1)
            endDate = new Date(currentYear, 5, 30, 23, 59, 59)
        } else {
            startDate = new Date(currentYear, 6, 1)
            endDate = new Date(currentYear, 11, 31, 23, 59, 59)
        }
    } else {
        startDate = new Date(currentYear, 0, 1)
        endDate = new Date(currentYear, 11, 31, 23, 59, 59)
    }

    const students = await prisma.student.findMany({
        where: { deletedAt: null, status: 'ACTIVE' },
        include: {
            attendances: {
                where: { date: { gte: startDate, lte: endDate } }
            },
            classEnrollments: {
                where: { status: 'ACTIVE' },
                include: { class: true }
            }
        }
    })

    const lowAttendance = students
        .map(student => {
            const totalDays = student.attendances.length
            const presentDays = student.attendances.filter(a =>
                a.status === 'PRESENT' || a.status === 'LATE'
            ).length
            const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100

            return {
                studentId: student.id,
                studentName: student.name,
                nis: student.nis,
                className: student.classEnrollments[0]?.class?.name || '-',
                totalDays,
                presentDays,
                absentDays: totalDays - presentDays,
                percentage,
                phone: student.phone || student.fatherPhone || student.motherPhone,
                email: student.email
            }
        })
        .filter(s => s.percentage < threshold && s.totalDays > 0)
        .sort((a, b) => a.percentage - b.percentage)

    return {
        threshold,
        totalStudents: lowAttendance.length,
        students: lowAttendance
    }
}

/**
 * Export students to CSV/JSON
 */
export const exportStudents = async (request, h) => {
    const { format = 'csv', classFilter, fields } = request.query

    const where = { deletedAt: null }
    // classFilter could be '10', '11', '12'
    // In a production app, we'd join with classEnrollments

    const students = await prisma.student.findMany({
        where,
        orderBy: { name: 'asc' },
        include: {
            classEnrollments: {
                where: { status: 'ACTIVE' },
                include: { class: true },
                take: 1
            }
        }
    })

    // Parse fields if provided
    const selectedFields = fields ? fields.split(',') : ['nis', 'nisn', 'name', 'gender', 'status']

    if (format === 'json') {
        const data = students.map(student => {
            const result = {}
            selectedFields.forEach(field => {
                if (field === 'class') {
                    result[field] = student.classEnrollments?.[0]?.class?.name || '-'
                } else {
                    result[field] = student[field]
                }
            })
            return result
        })
        return { data, total: students.length }
    }

    // CSV format
    const fieldLabels = {
        nis: 'NIS',
        nisn: 'NISN',
        name: 'Nama Lengkap',
        gender: 'Jenis Kelamin',
        birthPlace: 'Tempat Lahir',
        birthDate: 'Tanggal Lahir',
        address: 'Alamat',
        phone: 'No HP',
        email: 'Email',
        status: 'Status',
        class: 'Kelas'
    }

    const headers = selectedFields.map(f => fieldLabels[f] || f).join(',')
    const rows = students.map(student => {
        return selectedFields.map(field => {
            if (field === 'class') {
                return `"${student.classEnrollments?.[0]?.class?.name || '-'}"`
            }
            const value = student[field] || ''
            // Escape quotes and wrap in quotes
            return `"${String(value).replace(/"/g, '""')}"`
        }).join(',')
    }).join('\n')

    const csv = headers + '\n' + rows

    return h.response(csv)
        .type('text/csv')
        .header('Content-Disposition', `attachment; filename=students_${new Date().toISOString().split('T')[0]}.csv`)
}

/**
 * Import students from JSON payload
 */
export const importStudents = async (request, h) => {
    const { students, updateExisting = false } = request.payload

    if (!Array.isArray(students) || students.length === 0) {
        throw Boom.badRequest('Students array is required')
    }

    const results = {
        success: 0,
        failed: 0,
        skipped: 0,
        errors: []
    }

    for (const studentData of students) {
        try {
            // Check if student already exists by NIS or NISN
            const existing = await prisma.student.findFirst({
                where: {
                    OR: [
                        { nis: studentData.nis },
                        { nisn: studentData.nisn }
                    ]
                }
            })

            if (existing) {
                if (updateExisting) {
                    await prisma.student.update({
                        where: { id: existing.id },
                        data: {
                            name: studentData.name,
                            gender: studentData.gender || 'MALE',
                            birthPlace: studentData.birthPlace,
                            birthDate: studentData.birthDate ? new Date(studentData.birthDate) : undefined,
                            address: studentData.address,
                            phone: studentData.phone,
                            email: studentData.email
                        }
                    })
                    results.success++
                } else {
                    results.skipped++
                }
            } else {
                await prisma.student.create({
                    data: {
                        nis: studentData.nis,
                        nisn: studentData.nisn,
                        nik: studentData.nik,
                        name: studentData.name,
                        gender: studentData.gender || 'MALE',
                        birthPlace: studentData.birthPlace,
                        birthDate: studentData.birthDate ? new Date(studentData.birthDate) : undefined,
                        address: studentData.address,
                        phone: studentData.phone,
                        email: studentData.email,
                        status: 'ACTIVE'
                    }
                })
                results.success++
            }
        } catch (error) {
            results.failed++
            results.errors.push(`Error importing ${studentData.name || studentData.nis}: ${error.message}`)
        }
    }

    return h.response({
        message: `Import completed: ${results.success} success, ${results.skipped} skipped, ${results.failed} failed`,
        ...results
    }).code(201)
}

/**
 * Sync students from Dapodik (Mock implementation)
 * In production, this would connect to actual Dapodik web service
 */
export const syncFromDapodik = async (request, h) => {
    const { npsn, tingkat } = request.payload

    // Mock Dapodik sync - in production this would call Dapodik web service
    // URL: https://dapodik.example.com/ws/peserta_didik?npsn=<npsn>

    // For now, simulate a successful sync with mock data
    const mockDapodikStudents = [
        {
            peserta_didik_id: 'DP001',
            nisn: '0012345681',
            nik: '3171012345678904',
            nama: 'Ahmad Dapodik Sync',
            tempat_lahir: 'Jakarta',
            tanggal_lahir: '2008-05-15',
            jenis_kelamin: 'L',
            alamat: 'Jl. Dapodik No. 1'
        },
        {
            peserta_didik_id: 'DP002',
            nisn: '0012345682',
            nik: '3171012345678905',
            nama: 'Siti Dapodik Sync',
            tempat_lahir: 'Bandung',
            tanggal_lahir: '2008-08-20',
            jenis_kelamin: 'P',
            alamat: 'Jl. Dapodik No. 2'
        }
    ]

    const results = {
        totalFound: mockDapodikStudents.length,
        success: 0,
        skipped: 0,
        failed: 0,
        students: []
    }

    for (const dapodikStudent of mockDapodikStudents) {
        try {
            // Check if exists
            const existing = await prisma.student.findFirst({
                where: { nisn: dapodikStudent.nisn }
            })

            if (existing) {
                results.skipped++
                continue
            }

            // Generate NIS for new student
            const lastStudent = await prisma.student.findFirst({
                orderBy: { nis: 'desc' }
            })
            const newNis = lastStudent?.nis
                ? String(parseInt(lastStudent.nis) + 1).padStart(8, '0')
                : '10000001'

            const student = await prisma.student.create({
                data: {
                    nis: newNis,
                    nisn: dapodikStudent.nisn,
                    nik: dapodikStudent.nik,
                    name: dapodikStudent.nama,
                    gender: dapodikStudent.jenis_kelamin === 'L' ? 'MALE' : 'FEMALE',
                    birthPlace: dapodikStudent.tempat_lahir,
                    birthDate: new Date(dapodikStudent.tanggal_lahir),
                    address: dapodikStudent.alamat,
                    status: 'ACTIVE'
                }
            })

            results.success++
            results.students.push(student)
        } catch (error) {
            results.failed++
        }
    }

    return h.response({
        success: true,
        message: `Dapodik sync completed for NPSN ${npsn}`,
        ...results
    }).code(200)
}

/**
 * Get import template
 */
export const getImportTemplate = async (request, h) => {
    const template = 'NIS,NISN,NIK,Nama Lengkap,Jenis Kelamin (MALE/FEMALE),Tempat Lahir,Tanggal Lahir (YYYY-MM-DD),Alamat,No HP,Email\n'

    return h.response(template)
        .type('text/csv')
        .header('Content-Disposition', 'attachment; filename=template_import_siswa.csv')
}

/**
 * Get student's current class enrollment
 */
export const getStudentEnrollment = async (request, h) => {
    const { id } = request.params

    const enrollments = await prisma.classEnrollment.findMany({
        where: { studentId: id },
        include: {
            class: {
                include: { academicYear: true }
            }
        },
        orderBy: { enrolledAt: 'desc' }
    })

    return { data: enrollments }
}

/**
 * Enroll student in a class
 */
export const enrollStudent = async (request, h) => {
    const { id } = request.params
    const { classId } = request.payload

    // Check if student exists
    const student = await prisma.student.findUnique({ where: { id } })
    if (!student) throw Boom.notFound('Student not found')

    // Check if class exists
    const classData = await prisma.class.findUnique({ where: { id: classId } })
    if (!classData) throw Boom.notFound('Class not found')

    // Check if already enrolled in this class
    const existing = await prisma.classEnrollment.findUnique({
        where: { studentId_classId: { studentId: id, classId } }
    })

    if (existing) {
        if (existing.status === 'ACTIVE') {
            throw Boom.conflict('Student is already enrolled in this class')
        }
        // Reactivate enrollment
        const enrollment = await prisma.classEnrollment.update({
            where: { id: existing.id },
            data: { status: 'ACTIVE', enrolledAt: new Date() },
            include: { class: true }
        })
        return h.response(enrollment).code(200)
    }

    // Check for other active enrollments in same academic year
    const activeEnrollment = await prisma.classEnrollment.findFirst({
        where: {
            studentId: id,
            status: 'ACTIVE',
            class: {
                academicYearId: classData.academicYearId
            },
            classId: { not: classId }
        },
        include: { class: true }
    })

    if (activeEnrollment) {
        throw Boom.conflict(`Siswa sudah terdaftar di kelas ${activeEnrollment.class.name}. Hubungi admin untuk pindah kelas.`)
    }

    // Create new enrollment
    const enrollment = await prisma.classEnrollment.create({
        data: {
            studentId: id,
            classId,
            status: 'ACTIVE'
        },
        include: { class: true }
    })

    return h.response(enrollment).code(201)
}

/**
 * Unenroll student from a class
 */
export const unenrollStudent = async (request, h) => {
    const { id, enrollmentId } = request.params

    const enrollment = await prisma.classEnrollment.findFirst({
        where: { id: enrollmentId, studentId: id }
    })

    if (!enrollment) throw Boom.notFound('Enrollment not found')

    await prisma.classEnrollment.update({
        where: { id: enrollmentId },
        data: { status: 'TRANSFERRED' }
    })

    return h.response().code(204)
}

/**
 * Get available classes for enrollment
 */
export const getAvailableClasses = async (request, h) => {
    const { academicYearId } = request.query

    const where = {
        deletedAt: null
    }

    if (academicYearId) {
        where.academicYearId = academicYearId
    } else {
        const activeYear = await prisma.academicYear.findFirst({
            where: { isActive: true }
        })
        if (activeYear) {
            where.academicYearId = activeYear.id
        }
    }

    const classes = await prisma.class.findMany({
        where,
        include: {
            academicYear: true,
            homeroomTeacher: true,
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

    return {
        data: classes.map(c => ({
            ...c,
            studentCount: c._count.enrollments
        }))
    }
}

/**
 * Generate login credentials for a student
 * Creates User + Account records for student login
 */
export const generateCredentials = async (request, h) => {
    const { id } = request.params
    const { password, email } = request.payload

    // Get student
    const student = await prisma.student.findUnique({ where: { id } })
    if (!student) throw Boom.notFound('Student not found')

    // Use provided email or student's email
    const userEmail = email || student.email
    if (!userEmail) throw Boom.badRequest('Email is required. Please provide email or update student email first.')

    // Generate password if not provided (use NIS as default)
    const userPassword = password || student.nis

    // Hash password using Better Auth's hashPassword
    const { hashPassword } = await import('better-auth/crypto')
    const hashedPassword = await hashPassword(userPassword)

    // Check if user already exists
    let user = await prisma.user.findUnique({ where: { email: userEmail } })

    if (user) {
        // Update password in existing account
        await prisma.account.updateMany({
            where: { userId: user.id, providerId: 'credential' },
            data: { password: hashedPassword }
        })

        return h.response({
            success: true,
            message: 'Password berhasil diperbarui',
            credentials: {
                email: userEmail,
                password: userPassword,
                note: 'Siswa dapat login dengan kredensial ini'
            }
        }).code(200)
    }

    // Create new user
    user = await prisma.user.create({
        data: {
            email: userEmail,
            name: student.name,
            role: 'STUDENT',
            status: 'ACTIVE',
            emailVerified: true
        }
    })

    // Create account with credential provider
    await prisma.account.create({
        data: {
            userId: user.id,
            accountId: user.id,
            providerId: 'credential',
            password: hashedPassword
        }
    })

    // Update student email if it was provided differently
    if (email && email !== student.email) {
        await prisma.student.update({
            where: { id },
            data: { email }
        })
    }

    return h.response({
        success: true,
        message: 'Akun siswa berhasil dibuat',
        credentials: {
            email: userEmail,
            password: userPassword,
            note: 'Siswa dapat login dengan kredensial ini. Simpan password karena tidak dapat dilihat kembali.'
        }
    }).code(201)
}

/**
 * Check if student has login account
 */
export const checkCredentials = async (request, h) => {
    const { id } = request.params

    const student = await prisma.student.findUnique({ where: { id } })
    if (!student) throw Boom.notFound('Student not found')

    if (!student.email) {
        return { hasAccount: false, email: null, reason: 'Email belum diisi' }
    }

    const user = await prisma.user.findUnique({
        where: { email: student.email },
        include: { accounts: { where: { providerId: 'credential' } } }
    })

    return {
        hasAccount: !!user,
        email: student.email,
        hasPassword: user?.accounts?.length > 0,
        userId: user?.id || null
    }
}


/**
 * Calculate distance between two points in meters (Haversine formula)
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3 // Earth radius in meters
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
 * Student Self Check-in
 */
export const selfCheckIn = async (request, h) => {
    const { latitude, longitude, photo } = request.payload

    // 1. Get Session
    const { getSession } = await import('../plugins/auth.js')
    const session = await getSession(request)
    if (!session) throw Boom.unauthorized('Anda harus login terlebih dahulu')

    const userEmail = session.user.email

    // 2. Get Student by Email
    const student = await prisma.student.findFirst({
        where: { email: userEmail, status: 'ACTIVE' }
    })
    if (!student) throw Boom.forbidden('Data siswa tidak ditemukan atau tidak aktif')

    // 3. Check if already checked in
    // FIX: Use Indonesia Time (WIB/Asia/Jakarta) for School Day
    // If we rely on UTC, 00:00-07:00 WIB will be yesterday.
    // We want 05:00 WIB to be TODAY.
    const now = new Date()
    const dateString = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }) // YYYY-MM-DD relative to Jakarta
    const today = new Date(dateString) // Creates Date at 00:00:00 UTC for that YYYY-MM-DD

    const existing = await prisma.studentAttendance.findFirst({
        where: {
            studentId: student.id,
            date: today
        }
    })

    if (existing) {
        throw Boom.conflict('Anda sudah melakukan presensi hari ini')
    }

    // 4. Validate Location
    const school = await prisma.school.findFirst()
    if (!school || school.latitude === null || school.longitude === null) {
        // Fallback or skip validation if school location not set? 
        // For safety, maybe allow if school location not set yet (dev mode), or enforce.
        // Let's enforce if set, otherwise loose.
        console.warn('School location not set, skipping geo validation')
    } else {
        const distance = haversineDistance(latitude, longitude, school.latitude, school.longitude)
        const MAX_DISTANCE = 200 // meters
        if (distance > MAX_DISTANCE) {
            throw Boom.forbidden(`Lokasi anda terlalu jauh dari sekolah (${Math.round(distance)}m). Maksimal ${MAX_DISTANCE}m.`)
        }
    }

    // 5. Upload Photo
    let photoUrl = null
    if (photo) {
        const filename = await uploadFile(photo)
        photoUrl = `/uploads/${filename}`
    } else {
        throw Boom.badRequest('Foto wajah wajib diupload')
    }

    // 6. Record Attendance
    // 'now' is already defined above (line 1001)
    // Determine status based on time (e.g. late after 7:15)
    // For now, default to PRESENT or LATE based on hardcoded time?
    // Let's just say PRESENT for now, advanced later.
    const status = 'PRESENT'

    const attendance = await prisma.studentAttendance.create({
        data: {
            studentId: student.id,
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
 * Get current logged-in student's permits
 */
export const getMyPermits = async (request, h) => {
    // 1. Get Session
    const { getSession } = await import('../plugins/auth.js')
    const session = await getSession(request)
    if (!session) throw Boom.unauthorized('Anda harus login terlebih dahulu')

    const userEmail = session.user.email

    // 2. Get Student by Email
    const student = await prisma.student.findFirst({
        where: { email: userEmail }
    })

    if (!student) {
        return []
    }

    // 3. Get Permits
    return prisma.studentPermit.findMany({
        where: { studentId: student.id },
        orderBy: { createdAt: 'desc' }
    })
}

/**
 * Create permit request for current logged-in student
 */
export const createMyPermit = async (request, h) => {
    // 1. Get Session
    const { getSession } = await import('../plugins/auth.js')
    const session = await getSession(request)
    if (!session) throw Boom.unauthorized('Anda harus login terlebih dahulu')

    const userEmail = session.user.email

    // 2. Get Student by Email
    const student = await prisma.student.findFirst({
        where: { email: userEmail, status: 'ACTIVE' }
    })

    if (!student) throw Boom.forbidden('Data siswa tidak ditemukan atau tidak aktif')

    const { type, startDate, endDate, reason, document } = request.payload

    // 3. Upload document if provided
    let documentUrl = null
    if (document && document.hapi) {
        const filename = await uploadFile(document)
        documentUrl = `/uploads/${filename}`
    }

    // 4. Create Permit
    const permit = await prisma.studentPermit.create({
        data: {
            studentId: student.id,
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
