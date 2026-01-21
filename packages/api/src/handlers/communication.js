import { prisma } from '../plugins/prisma.js'

// Announcements
export const listAnnouncements = async (request, h) => {
    const { page, limit, category } = request.query

    const where = {}
    if (category) where.category = category

    const [announcements, total] = await Promise.all([
        prisma.announcement.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }]
        }),
        prisma.announcement.count({ where })
    ])

    return { data: announcements, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } }
}

export const createAnnouncement = async (request, h) => {
    const announcement = await prisma.announcement.create({ data: request.payload })
    return h.response(announcement).code(201)
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
