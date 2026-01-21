import { prisma } from '../plugins/prisma.js'

// Inventory
export const listInventory = async (request, h) => {
    const { page, limit, search, category, condition } = request.query

    const where = {}
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { code: { contains: search } }
        ]
    }
    if (category) where.category = category
    if (condition) where.condition = condition

    const [items, total] = await Promise.all([
        prisma.inventoryItem.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { name: 'asc' }
        }),
        prisma.inventoryItem.count({ where })
    ])

    return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } }
}

export const createInventoryItem = async (request, h) => {
    const item = await prisma.inventoryItem.create({ data: request.payload })
    return h.response(item).code(201)
}

// Rooms
export const listRooms = async (request, h) => {
    const { type, isAvailable } = request.query

    const where = {}
    if (type) where.type = type
    if (isAvailable !== undefined) where.isAvailable = isAvailable === 'true'

    return prisma.room.findMany({ where, orderBy: { name: 'asc' } })
}

// Bookings
export const listBookings = async (request, h) => {
    const { roomId, date, status } = request.query

    const where = {}
    if (roomId) where.roomId = roomId
    if (date) where.date = new Date(date)
    if (status) where.status = status

    return prisma.roomBooking.findMany({
        where,
        include: { room: true },
        orderBy: { date: 'asc' }
    })
}

export const createBooking = async (request, h) => {
    const booking = await prisma.roomBooking.create({ data: request.payload })
    return h.response(booking).code(201)
}

// Maintenance
export const listMaintenance = async (request, h) => {
    const { status, type } = request.query

    const where = {}
    if (status) where.status = status
    if (type) where.type = type

    return prisma.maintenanceRecord.findMany({
        where,
        include: { item: true },
        orderBy: { reportedAt: 'desc' }
    })
}

export const createMaintenance = async (request, h) => {
    const record = await prisma.maintenanceRecord.create({ data: request.payload })
    return h.response(record).code(201)
}
