import * as handlers from '../handlers/profile.js'
import Joi from 'joi'

export const profileRoutes = [
    // School Profile & Stats
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
        path: '/api/profile/school/stats',
        handler: handlers.getSchoolStats,
        options: { tags: ['api', 'profile'], description: 'Get live real-time school stats' }
    },

    // School Structure (Leadership, Departments, Committees)
    {
        method: 'GET',
        path: '/api/profile/structure',
        handler: handlers.listStructures,
        options: {
            tags: ['api', 'profile'],
            description: 'List school structure members',
            validate: { query: Joi.object({ category: Joi.string().valid('LEADERSHIP', 'DEPARTMENT', 'COMMITTEE').optional() }) }
        }
    },
    {
        method: 'POST',
        path: '/api/profile/structure',
        handler: handlers.createStructure,
        options: { tags: ['api', 'profile'], description: 'Add school structure member' }
    },
    {
        method: 'PUT',
        path: '/api/profile/structure/{id}',
        handler: handlers.updateStructure,
        options: { tags: ['api', 'profile'], description: 'Update school structure member' }
    },
    {
        method: 'DELETE',
        path: '/api/profile/structure/{id}',
        handler: handlers.deleteStructure,
        options: { tags: ['api', 'profile'], description: 'Delete school structure member' }
    },

    // Facilities
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
        method: 'PUT',
        path: '/api/profile/facilities/{id}',
        handler: handlers.updateFacility,
        options: { tags: ['api', 'profile'], description: 'Update facility' }
    },
    {
        method: 'DELETE',
        path: '/api/profile/facilities/{id}',
        handler: handlers.deleteFacility,
        options: { tags: ['api', 'profile'], description: 'Delete facility' }
    },

    // Gallery
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
        method: 'POST',
        path: '/api/profile/gallery',
        handler: handlers.createGalleryItem,
        options: { tags: ['api', 'profile'], description: 'Add gallery item' }
    },
    {
        method: 'PUT',
        path: '/api/profile/gallery/{id}',
        handler: handlers.updateGalleryItem,
        options: { tags: ['api', 'profile'], description: 'Update gallery item' }
    },
    {
        method: 'DELETE',
        path: '/api/profile/gallery/{id}',
        handler: handlers.deleteGalleryItem,
        options: { tags: ['api', 'profile'], description: 'Delete gallery item' }
    },

    // Achievements
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
        method: 'POST',
        path: '/api/profile/achievements',
        handler: handlers.createAchievement,
        options: { tags: ['api', 'profile'], description: 'Add achievement' }
    },
    {
        method: 'PUT',
        path: '/api/profile/achievements/{id}',
        handler: handlers.updateAchievement,
        options: { tags: ['api', 'profile'], description: 'Update achievement' }
    },
    {
        method: 'DELETE',
        path: '/api/profile/achievements/{id}',
        handler: handlers.deleteAchievement,
        options: { tags: ['api', 'profile'], description: 'Delete achievement' }
    },

    // Organizations (OSIS, MPK, Ekstrakurikuler)
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
    },
    {
        method: 'POST',
        path: '/api/profile/organizations/seed',
        handler: handlers.seedOrganization,
        options: { tags: ['api', 'profile'], description: 'Seed default organization data (OSIS/MPK)' }
    },
    {
        method: 'GET',
        path: '/api/profile/organizations/{id}',
        handler: handlers.getOrganization,
        options: { tags: ['api', 'profile'], description: 'Get organization details' }
    },
    {
        method: 'POST',
        path: '/api/profile/organizations',
        handler: handlers.upsertOrganization,
        options: { tags: ['api', 'profile'], description: 'Create or update organization' }
    },
    {
        method: 'PUT',
        path: '/api/profile/organizations/{id}',
        handler: handlers.upsertOrganization,
        options: { tags: ['api', 'profile'], description: 'Update organization' }
    },
    {
        method: 'DELETE',
        path: '/api/profile/organizations/{id}',
        handler: handlers.deleteOrganization,
        options: { tags: ['api', 'profile'], description: 'Delete organization' }
    },

    // Organization Members
    {
        method: 'POST',
        path: '/api/profile/organizations/members',
        handler: handlers.createOrgMember,
        options: { tags: ['api', 'profile'], description: 'Add member to organization' }
    },
    {
        method: 'PUT',
        path: '/api/profile/organizations/members/{id}',
        handler: handlers.updateOrgMember,
        options: { tags: ['api', 'profile'], description: 'Update organization member' }
    },
    {
        method: 'DELETE',
        path: '/api/profile/organizations/members/{id}',
        handler: handlers.deleteOrgMember,
        options: { tags: ['api', 'profile'], description: 'Delete organization member' }
    }
]
