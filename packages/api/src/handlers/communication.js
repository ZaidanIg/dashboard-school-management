import { prisma } from '../plugins/prisma.js'
import { getSession } from '../plugins/auth.js'

/**
 * Format database announcement record to match frontend expectations
 */
const formatAnnouncement = (a) => ({
    ...a,
    type: a.category || 'INFO',
    target: a.targetAudience?.[0] || 'ALL',
    status: a.publishedAt ? 'PUBLISHED' : 'DRAFT',
    authorId: a.createdBy || '',
    author: { name: a.createdBy || 'Admin' }
})

// Announcements
export const listAnnouncements = async (request, h) => {
    const { page = 1, limit = 20, category, type, search, status, target } = request.query || {}

    const pageNum = parseInt(page) || 1
    const limitNum = parseInt(limit) || 20

    const where = {}
    const filterCat = type || category
    if (filterCat) where.category = filterCat

    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } }
        ]
    }

    if (target && target !== 'ALL') {
        where.targetAudience = { has: target }
    }

    if (status === 'PUBLISHED') {
        where.publishedAt = { not: null }
    } else if (status === 'DRAFT') {
        where.publishedAt = null
    }

    const [announcements, total] = await Promise.all([
        prisma.announcement.findMany({
            where,
            skip: (pageNum - 1) * limitNum,
            take: limitNum,
            orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }]
        }),
        prisma.announcement.count({ where })
    ])

    const formattedData = announcements.map(formatAnnouncement)

    return {
        data: formattedData,
        meta: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum)
        }
    }
}

export const createAnnouncement = async (request, h) => {
    const {
        title,
        content,
        type,
        category,
        target,
        targetAudience,
        status,
        authorId,
        createdBy,
        isPinned,
        expiresAt
    } = request.payload

    let creatorName = createdBy || authorId
    try {
        const session = await getSession(request)
        if (session?.user?.name) {
            creatorName = session.user.name
        }
    } catch (e) {
        // Fallback
    }
    if (!creatorName) creatorName = 'Super Admin'

    const targetArr = Array.isArray(targetAudience)
        ? targetAudience
        : (target ? [target] : ['ALL'])

    const announcement = await prisma.announcement.create({
        data: {
            title,
            content,
            category: type || category || 'INFO',
            targetAudience: targetArr,
            isPinned: !!isPinned,
            publishedAt: status === 'DRAFT' ? null : new Date(),
            expiresAt: expiresAt ? new Date(expiresAt) : null,
            createdBy: creatorName
        }
    })

    // In-App Notification for target audience
    try {
        const notifTarget = target || targetArr[0] || 'ALL'
        const rolesToNotify = []
        if (notifTarget === 'ALL') {
            rolesToNotify.push('STUDENT', 'TEACHER')
        } else if (notifTarget === 'STUDENTS' || notifTarget === 'STUDENT') {
            rolesToNotify.push('STUDENT')
        } else if (notifTarget === 'TEACHERS' || notifTarget === 'TEACHER') {
            rolesToNotify.push('TEACHER')
        }

        for (const role of rolesToNotify) {
            await prisma.notification.create({
                data: {
                    title: `Pengumuman: ${announcement.title}`,
                    message: announcement.content?.length > 150 ? `${announcement.content.substring(0, 150)}...` : (announcement.content || 'Pengumuman baru dari operator/admin sekolah.'),
                    type: 'ANNOUNCEMENT',
                    role,
                    link: role === 'STUDENT' ? '/student-portal/announcements' : role === 'TEACHER' ? '/teacher-portal' : '/announcements',
                    metadata: { announcementId: announcement.id, category: announcement.category }
                }
            })
        }
    } catch (notifErr) {
        console.error('Failed to create notifications for announcement:', notifErr)
    }

    return h.response(formatAnnouncement(announcement)).code(201)
}

export const updateAnnouncement = async (request, h) => {
    const { id } = request.params
    const {
        title,
        content,
        type,
        category,
        target,
        targetAudience,
        status,
        isPinned,
        expiresAt
    } = request.payload

    const data = {}
    if (title !== undefined) data.title = title
    if (content !== undefined) data.content = content
    if (type !== undefined || category !== undefined) data.category = type || category
    if (target !== undefined || targetAudience !== undefined) {
        data.targetAudience = Array.isArray(targetAudience) ? targetAudience : [target]
    }
    if (isPinned !== undefined) data.isPinned = !!isPinned
    if (status !== undefined) {
        data.publishedAt = status === 'DRAFT' ? null : new Date()
    }
    if (expiresAt !== undefined) {
        data.expiresAt = expiresAt ? new Date(expiresAt) : null
    }

    const updated = await prisma.announcement.update({
        where: { id },
        data
    })
    return formatAnnouncement(updated)
}

export const deleteAnnouncement = async (request, h) => {
    const { id } = request.params
    await prisma.announcement.delete({ where: { id } })
    return { success: true }
}


// Letters
export const listLetters = async (request, h) => {
    const { page, limit, type, status } = request.query

    const where = {}
    if (type) where.type = type
    if (status) where.status = status

    const [letters, total] = await Promise.all([
        prisma.letter.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { date: 'desc' }
        }),
        prisma.letter.count({ where })
    ])

    return { data: letters, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } }
}

export const createLetter = async (request, h) => {
    const letter = await prisma.letter.create({ data: request.payload })
    return h.response(letter).code(201)
}

// WhatsApp
export const listWhatsAppMessages = async (request, h) => {
    const { page, limit, status } = request.query

    const where = {}
    if (status) where.status = status

    const [messages, total] = await Promise.all([
        prisma.whatsAppMessage.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'desc' }
        }),
        prisma.whatsAppMessage.count({ where })
    ])

    return { data: messages, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } }
}

export const queueWhatsAppMessage = async (request, h) => {
    const message = await prisma.whatsAppMessage.create({
        data: {
            recipients: request.payload.recipients,
            message: request.payload.message,
            template: request.payload.template,
            status: 'PENDING'
        }
    })
    // TODO: Integrate with actual WhatsApp API
    return h.response(message).code(201)
}
