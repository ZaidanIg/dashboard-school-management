import Boom from '@hapi/boom'
import { prisma } from '../plugins/prisma.js'
import { getSession } from '../plugins/auth.js'

/**
 * Helper to build where clause according to authenticated user / role
 */
const buildNotificationWhere = async (request) => {
    let user = null
    try {
        const session = await getSession(request)
        if (session?.user) {
            user = session.user
        }
    } catch (e) {
        // Fallback to query if session not available
    }

    const { role: qRole, userId: qUserId, classId: qClassId } = request.query || {}

    const targetUserId = user?.id || qUserId
    const rawRole = user?.role || qRole
    const targetRole = typeof rawRole === 'string' ? rawRole.toUpperCase() : undefined
    let targetClassId = qClassId

    // If user is STUDENT, resolve their enrolled class IDs
    let studentClassIds = []
    if (targetRole === 'STUDENT' && user?.email) {
        try {
            const student = await prisma.student.findFirst({
                where: { email: user.email },
                include: {
                    classEnrollments: {
                        where: { status: 'ACTIVE' },
                        select: { classId: true }
                    }
                }
            })
            if (student?.classEnrollments?.length) {
                studentClassIds = student.classEnrollments.map(e => e.classId).filter(Boolean)
            }
        } catch (err) {
            console.error('Error fetching student enrollment in notifications:', err)
        }
    }
    if (targetClassId && !studentClassIds.includes(targetClassId)) {
        studentClassIds.push(targetClassId)
    }

    const conditions = []

    // 1. Direct notification to this user
    if (targetUserId) {
        conditions.push({ userId: targetUserId })
    }

    // 2. Role-based notification
    if (targetRole === 'STUDENT') {
        const studentOrs = [{ classId: null }]
        if (studentClassIds.length > 0) {
            studentOrs.push({ classId: { in: studentClassIds } })
        } else {
            // Fallback for demo / unassigned students: allow seeing general student notifications and any class assignments
            studentOrs.push({ classId: { not: null } })
        }
        conditions.push({
            role: 'STUDENT',
            OR: studentOrs
        })
    } else if (targetRole === 'TEACHER') {
        conditions.push({ role: 'TEACHER' })
    } else if (targetRole) {
        conditions.push({ role: targetRole })
    }

    // 3. Broadcast to all (role: null, classId: null, userId: null)
    conditions.push({
        role: null,
        classId: null,
        userId: null
    })

    return {
        OR: conditions
    }
}

/**
 * List notifications for current user/role
 */
export const listNotifications = async (request, h) => {
    try {
        const where = await buildNotificationWhere(request)
        const limit = parseInt(request.query?.limit) || 30

        const [notifications, unreadCount] = await Promise.all([
            prisma.notification.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: limit
            }),
            prisma.notification.count({
                where: {
                    ...where,
                    isRead: false
                }
            })
        ])

        return {
            data: notifications,
            meta: {
                total: notifications.length,
                unreadCount
            }
        }
    } catch (error) {
        console.error('Error in listNotifications:', error)
        throw Boom.internal('Gagal mengambil notifikasi', error)
    }
}

/**
 * Mark a single notification as read
 */
export const markNotificationAsRead = async (request, h) => {
    const { id } = request.params
    try {
        const notification = await prisma.notification.update({
            where: { id },
            data: {
                isRead: true,
                readAt: new Date()
            }
        })
        return { success: true, data: notification }
    } catch (error) {
        if (error.code === 'P2025') {
            throw Boom.notFound('Notifikasi tidak ditemukan')
        }
        throw Boom.internal('Gagal memperbarui notifikasi', error)
    }
}

/**
 * Mark all matching notifications as read
 */
export const markAllNotificationsAsRead = async (request, h) => {
    try {
        const where = await buildNotificationWhere(request)
        const result = await prisma.notification.updateMany({
            where: {
                ...where,
                isRead: false
            },
            data: {
                isRead: true,
                readAt: new Date()
            }
        })
        return { success: true, count: result.count }
    } catch (error) {
        console.error('Error in markAllNotificationsAsRead:', error)
        throw Boom.internal('Gagal memperbarui semua notifikasi', error)
    }
}

/**
 * Create a new notification (broadcast/specific)
 */
export const createNotification = async (request, h) => {
    const { title, message, type, role, classId, userId, link, metadata } = request.payload

    try {
        const notification = await prisma.notification.create({
            data: {
                title,
                message,
                type: type || 'INFO',
                role: role || null,
                classId: classId || null,
                userId: userId || null,
                link: link || null,
                metadata: metadata || null
            }
        })
        return h.response(notification).code(201)
    } catch (error) {
        console.error('Error in createNotification:', error)
        throw Boom.internal('Gagal membuat notifikasi', error)
    }
}
