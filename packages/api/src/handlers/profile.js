import Boom from '@hapi/boom'
import { prisma } from '../plugins/prisma.js'

// School profile
export const getSchool = async (request, h) => {
    const school = await prisma.school.findFirst({
        include: {
            facilities: true,
            _count: { select: { gallery: true, achievements: true, organizations: true } }
        }
    })
    if (!school) throw Boom.notFound('School profile not found')
    return school
}

export const updateSchool = async (request, h) => {
    const existing = await prisma.school.findFirst()

    if (existing) {
        return prisma.school.update({ where: { id: existing.id }, data: request.payload })
    }

    const school = await prisma.school.create({ data: request.payload })
    return h.response(school).code(201)
}

// Facilities
export const listFacilities = async (request, h) => {
    const school = await prisma.school.findFirst()
    if (!school) return []
    return prisma.facility.findMany({ where: { schoolId: school.id }, orderBy: { category: 'asc' } })
}

export const createFacility = async (request, h) => {
    const school = await prisma.school.findFirst()
    if (!school) throw Boom.preconditionFailed('School profile required')

    const facility = await prisma.facility.create({ data: { ...request.payload, schoolId: school.id } })
    return h.response(facility).code(201)
}

// Gallery
export const listGallery = async (request, h) => {
    const { category } = request.query
    const school = await prisma.school.findFirst()
    if (!school) return []

    const where = { schoolId: school.id }
    if (category) where.category = category

    return prisma.galleryItem.findMany({ where, orderBy: { createdAt: 'desc' } })
}

// Achievements
export const listAchievements = async (request, h) => {
    const { category, level, year } = request.query
    const school = await prisma.school.findFirst()
    if (!school) return []

    const where = { schoolId: school.id }
    if (category) where.category = category
    if (level) where.level = level
    if (year) where.year = parseInt(year)

    return prisma.achievement.findMany({
        where,
        include: { student: true, teacher: true },
        orderBy: [{ year: 'desc' }, { createdAt: 'desc' }]
    })
}

// Organizations
export const listOrganizations = async (request, h) => {
    const { type } = request.query
    const school = await prisma.school.findFirst()
    if (!school) return []

    const where = { schoolId: school.id }
    if (type) where.type = type

    return prisma.studentOrganization.findMany({
        where,
        include: { advisor: true, members: { include: { student: true } } },
        orderBy: { period: 'desc' }
    })
}
