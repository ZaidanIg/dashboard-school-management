import Boom from '@hapi/boom'
import { prisma } from '../plugins/prisma.js'
import { getSession } from '../plugins/auth.js'

// Users
export const listUsers = async (request, h) => {
    const { page, limit, role, status, search } = request.query

    const where = {}
    if (role) where.role = role
    if (status) where.status = status
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } }
        ]
    }

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            select: { id: true, email: true, name: true, role: true, status: true, emailVerified: true, image: true, createdAt: true },
            orderBy: { name: 'asc' }
        }),
        prisma.user.count({ where })
    ])

    return { data: users, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } }
}

export const updateUser = async (request, h) => {
    const { id } = request.params
    return prisma.user.update({
        where: { id },
        data: request.payload,
        select: { id: true, email: true, name: true, role: true, status: true }
    })
}

// Roles
export const listRoles = async (request, h) => {
    return prisma.role.findMany({ orderBy: { name: 'asc' } })
}

export const createRole = async (request, h) => {
    const role = await prisma.role.create({ data: request.payload })
    return h.response(role).code(201)
}

// System Config
export const getConfig = async (request, h) => {
    const configs = await prisma.systemConfig.findMany()
    const result = {}
    configs.forEach(c => { result[c.key] = c.value })
    return result
}

export const updateConfig = async (request, h) => {
    const entries = Object.entries(request.payload)
    await Promise.all(
        entries.map(([key, value]) =>
            prisma.systemConfig.upsert({
                where: { key },
                update: { value },
                create: { key, value }
            })
        )
    )
    return { updated: entries.length }
}

// Activity Log
export const listActivityLog = async (request, h) => {
    const { page, limit, userId, action, entity } = request.query

    const where = {}
    if (userId) where.userId = userId
    if (action) where.action = action
    if (entity) where.entity = entity

    const [logs, total] = await Promise.all([
        prisma.activityLog.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            include: { user: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.activityLog.count({ where })
    ])

    return { data: logs, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } }
}

// Backups
export const listBackups = async (request, h) => {
    return prisma.dataBackup.findMany({ orderBy: { createdAt: 'desc' }, take: 20 })
}

export const createBackup = async (request, h) => {
    const backup = await prisma.dataBackup.create({
        data: {
            filename: `backup-${Date.now()}.sql`,
            size: 0,
            type: request.payload?.type || 'MANUAL',
            status: 'PENDING'
        }
    })
    // TODO: Implement actual backup logic
    return h.response(backup).code(202)
}

// Current user
export const getCurrentUser = async (request, h) => {
    const session = await getSession(request)
    if (!session) throw Boom.unauthorized('Not authenticated')
    return session.user
}

// School Profile
export const getSchoolProfile = async (request, h) => {
    const school = await prisma.school.findFirst()
    if (!school) {
        // Return default values if no school configured
        return {
            id: null,
            name: '',
            address: '',
            phone: '',
            email: '',
            website: '',
            latitude: null,
            longitude: null
        }
    }
    return school
}

export const updateSchoolProfile = async (request, h) => {
    const { name, address, phone, email, website, latitude, longitude } = request.payload

    // Find existing school or create new one
    const existingSchool = await prisma.school.findFirst()

    if (existingSchool) {
        return prisma.school.update({
            where: { id: existingSchool.id },
            data: { name, address, phone, email, website, latitude, longitude }
        })
    } else {
        return prisma.school.create({
            data: { name, address, phone, email, website, latitude, longitude }
        })
    }
}
