import * as handlers from '../handlers/profile.js'
import Joi from 'joi'

export const profileRoutes = [
    {
        method: 'GET',
        path: '/api/profile/school',
        handler: handlers.getSchool,
        options: { tags: ['api', 'profile'], description: 'Get school profile' }
    },
    {
        method: 'PUT',
        path: '/api/profile/school',
        handler: handlers.updateSchool,
        options: { tags: ['api', 'profile'], description: 'Update school profile' }
    },
    {
        method: 'GET',
        path: '/api/profile/facilities',
        handler: handlers.listFacilities,
        options: { tags: ['api', 'profile'], description: 'List facilities' }
    },
    {
        method: 'POST',
        path: '/api/profile/facilities',
        handler: handlers.createFacility,
        options: { tags: ['api', 'profile'], description: 'Add facility' }
    },
    {
        method: 'GET',
        path: '/api/profile/gallery',
        handler: handlers.listGallery,
        options: {
            tags: ['api', 'profile'],
            description: 'List gallery items',
            validate: { query: Joi.object({ category: Joi.string().optional() }) }
        }
    },
    {
        method: 'GET',
        path: '/api/profile/achievements',
        handler: handlers.listAchievements,
        options: {
            tags: ['api', 'profile'],
            description: 'List achievements',
            validate: {
                query: Joi.object({
                    category: Joi.string().optional(),
                    level: Joi.string().valid('SEKOLAH', 'KOTA', 'PROVINSI', 'NASIONAL', 'INTERNASIONAL').optional(),
                    year: Joi.number().optional()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/profile/organizations',
        handler: handlers.listOrganizations,
        options: {
            tags: ['api', 'profile'],
            description: 'List organizations',
            validate: {
                query: Joi.object({
                    type: Joi.string().valid('OSIS', 'MPK', 'EXTRACURRICULAR').optional()
                })
            }
        }
    }
]
