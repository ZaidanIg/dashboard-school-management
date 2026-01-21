import { prisma } from '../plugins/prisma.js'
import Boom from '@hapi/boom'
import { getSession } from '../plugins/auth.js'

// Helper: Log Activity
const logActivity = async (request, action, entity, entityId, details = {}) => {
    try {
        const session = await getSession(request)
        if (!session?.user?.id) return // Skip if no user (should rely on auth strategy mainly)

        await prisma.activityLog.create({
            data: {
                userId: session.user.id,
                action,
                entity,
                entityId,
                details: JSON.stringify(details),
                ipAddress: request.info.remoteAddress,
                userAgent: request.headers['user-agent']
            }
        })
    } catch (e) {
        console.error('Audit Log Error:', e)
    }
}

// Helper: Send WhatsApp
const sendWhatsApp = async (recipients, message) => {
    if (!recipients || recipients.length === 0) return
    try {
        await prisma.whatsAppMessage.create({
            data: {
                recipients: [...new Set(recipients)], // Dedupe
                message,
                status: 'PENDING',
                sentBy: 'SYSTEM'
            }
        })
    } catch (e) {
        console.error('WhatsApp Queue Error:', e)
    }
}

/**
 * List assignments
 */
export const listAssignments = async (request, h) => {
    const { classId, subjectId, teacherId, studentId } = request.query
    const where = {}

    if (classId) where.classId = classId
    if (subjectId) where.subjectId = subjectId
    if (teacherId) where.teacherId = teacherId

    const assignments = await prisma.assignment.findMany({
        where,
        include: {
            class: true,
            subject: true,
            teacher: true,
            _count: { select: { submissions: true } },
            submissions: studentId ? { where: { studentId }, select: { studentId: true, status: true, grade: true, late: true } } : false,
            attachments: true // Include attachments
        },
        orderBy: { createdAt: 'desc' }
    })

    return assignments
}

/**
 * Create assignment
 */
export const createAssignment = async (request, h) => {
    let { attachments, ...payload } = request.payload
    const session = await getSession(request)

    // Resolve Teacher ID
    let validTeacherId = payload.teacherId
    const teacherById = await prisma.teacher.findUnique({ where: { id: payload.teacherId } })

    if (!teacherById) {
        // Not a Teacher ID. Check if it's a User ID linked to a Teacher
        const teacherByUserId = await prisma.teacher.findUnique({ where: { userId: payload.teacherId } })
        if (teacherByUserId) {
            validTeacherId = teacherByUserId.id
        } else {
            return Boom.badRequest('Teacher ID invalid or Teacher profile not found')
        }
    }

    payload.teacherId = validTeacherId

    const assignment = await prisma.assignment.create({
        data: {
            ...payload,
            attachments: attachments ? {
                create: attachments
            } : undefined
        },
        include: {
            class: { include: { enrollments: { include: { student: true } } } },
            subject: true,
            attachments: true
        }
    })

    // Audit Log
    await logActivity(request, 'CREATE_ASSIGNMENT', 'Assignment', assignment.id, { title: assignment.title })

    // Notification Queue (Tugas Baru)
    if (assignment.class?.students?.length > 0) {
        // Collect parent numbers
        const phones = assignment.class.students
            .map(s => s.fatherPhone || s.motherPhone || s.guardianPhone || s.phone)
            .filter(Boolean)

        const message = `📚 *Tugas Baru*\n\nMapel: ${assignment.subject.name}\nJudul: ${assignment.title}\nTenggat: ${new Date(assignment.dueDate).toLocaleString('id-ID')}\n\nMohon dicek di aplikasi siswa. Semangat!`

        await sendWhatsApp(phones, message)
    }

    return h.response(assignment).code(201)
}

/**
 * Get assignment detail
 */
export const getAssignmentDetail = async (request, h) => {
    const { id } = request.params

    const assignment = await prisma.assignment.findUnique({
        where: { id },
        include: {
            class: true,
            subject: true,
            teacher: true,
            attachments: true,
            submissions: {
                include: { student: true },
                orderBy: { student: { name: 'asc' } }
            }
        }
    })

    if (!assignment) return Boom.notFound('Tugas tidak ditemukan')

    return assignment
}

/**
 * Submit assignment (Student)
 */
export const submitAssignment = async (request, h) => {
    const { id } = request.params
    const { studentId, fileUrl, content } = request.payload

    const assignment = await prisma.assignment.findUnique({ where: { id } })
    if (!assignment) return Boom.notFound('Tugas tidak ditemukan')

    // Check Deadline & Tolerance (TODO: Tolerance from SystemConfig)
    const now = new Date()
    const isLate = assignment.dueDate ? now > new Date(assignment.dueDate) : false

    const submission = await prisma.assignmentSubmission.upsert({
        where: {
            assignmentId_studentId: { assignmentId: id, studentId }
        },
        create: {
            assignmentId: id,
            studentId,
            fileUrl,
            content,
            status: isLate ? 'LATE' : 'SUBMITTED', // Set status LATE if late
            submittedAt: now,
            late: isLate
        },
        update: {
            fileUrl,
            content,
            status: isLate ? 'LATE' : 'SUBMITTED',
            submittedAt: now,
            late: isLate
        }
    })

    // Audit Log
    await logActivity(request, 'SUBMIT_ASSIGNMENT', 'AssignmentSubmission', submission.id, { assignmentId: id, late: isLate })

    return submission
}

/**
 * Grade submission (Teacher)
 */
export const gradeSubmission = async (request, h) => {
    const { submissionId } = request.params
    const { grade, feedback } = request.payload

    const submission = await prisma.assignmentSubmission.findUnique({
        where: { id: submissionId },
        include: { student: true, assignment: { include: { subject: true } } }
    })

    if (!submission) return Boom.notFound('Pengumpulan tidak ditemukan')

    const updated = await prisma.assignmentSubmission.update({
        where: { id: submissionId },
        data: {
            grade,
            feedback,
            status: 'GRADED',
            gradedAt: new Date()
        }
    })

    // Audit Log
    await logActivity(request, 'GRADE_ASSIGNMENT', 'AssignmentSubmission', submissionId, { grade })

    // Notification (Nilai Keluar)
    const s = submission.student
    const phone = s.fatherPhone || s.motherPhone || s.guardianPhone || s.phone
    if (phone) {
        const message = `📝 *Nilai Tugas Keluar*\n\nMapel: ${submission.assignment.subject.name}\nTugas: ${submission.assignment.title}\nNilai: ${grade}/100\n\n"${feedback || 'Tetap semangat!'}"`
        await sendWhatsApp([phone], message)
    }

    return updated
}

export const updateAssignment = async (request, h) => {
    const { id } = request.params
    const { classId, subjectId, teacherId, title, description, dueDate, maxScore, attachments } = request.payload

    try {
        // Resolve Teacher ID if provided
        let validTeacherId = teacherId
        if (teacherId) {
            const teacherById = await prisma.teacher.findUnique({ where: { id: teacherId } })
            if (!teacherById) {
                const teacherByUserId = await prisma.teacher.findUnique({ where: { userId: teacherId } })
                if (teacherByUserId) {
                    validTeacherId = teacherByUserId.id
                } else {
                    return Boom.badRequest('Teacher ID invalid or Teacher profile not found')
                }
            }
        }

        const assignment = await prisma.assignment.update({
            where: { id },
            data: {
                classId,
                subjectId,
                teacherId: validTeacherId,
                title,
                description,
                dueDate,
                maxScore,
                attachments: {
                    deleteMany: {},
                    create: attachments?.map(att => ({
                        type: att.type,
                        url: att.url,
                        filename: att.filename,
                        mimeType: att.mimeType,
                        size: att.size
                    }))
                }
            }
        })

        return h.response(assignment).code(200)
    } catch (error) {
        console.error(error)
        return Boom.badImplementation('Failed to update assignment')
    }
}

export const deleteAssignment = async (request, h) => {
    const { id } = request.params

    try {
        await prisma.assignment.delete({
            where: { id }
        })

        return h.response({ message: 'Assignment deleted successfully' }).code(200)
    } catch (error) {
        console.error(error)
        return Boom.badImplementation('Failed to delete assignment')
    }
}
