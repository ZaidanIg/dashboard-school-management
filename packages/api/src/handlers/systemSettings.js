import { prisma } from '../plugins/prisma.js'

// ============================================
// SYSTEM SETTINGS HANDLERS
// ============================================

/**
 * Get active curriculum type
 */
export const getActiveCurriculum = async (request, h) => {
    const setting = await prisma.systemSetting.findUnique({
        where: { key: 'activeCurriculumType' }
    })

    return h.response({
        curriculumType: setting?.value || 'MERDEKA'
    }).code(200)
}

/**
 * Set active curriculum type
 */
export const setActiveCurriculum = async (request, h) => {
    const { curriculumType } = request.payload

    const setting = await prisma.systemSetting.upsert({
        where: { key: 'activeCurriculumType' },
        update: { value: curriculumType },
        create: { key: 'activeCurriculumType', value: curriculumType }
    })

    return h.response({
        key: setting.key,
        curriculumType: setting.value,
        updatedAt: setting.updatedAt
    }).code(200)
}

/**
 * Get a system setting by key
 */
export const getSetting = async (request, h) => {
    const { key } = request.params

    const setting = await prisma.systemSetting.findUnique({
        where: { key }
    })

    if (!setting) {
        return h.response({ error: 'Setting not found' }).code(404)
    }

    return h.response(setting).code(200)
}

/**
 * Set a system setting
 */
export const setSetting = async (request, h) => {
    const { key } = request.params
    const { value } = request.payload

    const setting = await prisma.systemSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
    })

    return h.response(setting).code(200)
}

/**
 * Get all system settings
 */
export const getAllSettings = async (request, h) => {
    const settings = await prisma.systemSetting.findMany({
        orderBy: { key: 'asc' }
    })

    // Convert to key-value object
    const settingsMap = settings.reduce((acc, s) => {
        acc[s.key] = s.value
        return acc
    }, {})

    return h.response(settingsMap).code(200)
}
