import * as handlers from '../handlers/settings.js'
import { paginationQuery, idParam } from '../validators/index.js'
import Joi from 'joi'

export const settingsRoutes = [
    // Users
    {
        method: 'GET',
        path: '/api/settings/users',
        handler: handlers.listUsers,
        options: {
            tags: ['api', 'settings'],
            description: 'List users',
            validate: {
                query: paginationQuery.keys({
                    role: Joi.string().valid('SUPER_ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF', 'PARENT', 'STUDENT').optional(),
                    status: Joi.string().valid('ACTIVE', 'INACTIVE').optional()
                })
            }
        }
    },
    {
        method: 'PUT',
        path: '/api/settings/users/{id}',
        handler: handlers.updateUser,
        options: {
            tags: ['api', 'settings'],
            description: 'Update user',
            validate: { params: idParam }
        }
    },
    // Roles
    {
        method: 'GET',
        path: '/api/settings/roles',
        handler: handlers.listRoles,
        options: { tags: ['api', 'settings'], description: 'List roles' }
    },
    {
        method: 'POST',
        path: '/api/settings/roles',
        handler: handlers.createRole,
        options: { tags: ['api', 'settings'], description: 'Create role' }
    },
    // Config
    {
        method: 'GET',
        path: '/api/settings/config',
        handler: handlers.getConfig,
        options: { tags: ['api', 'settings'], description: 'Get system config' }
    },
    {
        method: 'PUT',
        path: '/api/settings/config',
        handler: handlers.updateConfig,
        options: { tags: ['api', 'settings'], description: 'Update system config' }
    },
    // Activity Log
    {
        method: 'GET',
        path: '/api/settings/activity-log',
        handler: handlers.listActivityLog,
        options: {
            tags: ['api', 'settings'],
            description: 'Get activity log',
            validate: {
                query: paginationQuery.keys({
                    userId: Joi.string().optional(),
                    action: Joi.string().optional(),
                    entity: Joi.string().optional()
                })
            }
        }
    },
    // Backups
    {
        method: 'GET',
        path: '/api/settings/backups',
        handler: handlers.listBackups,
        options: { tags: ['api', 'settings'], description: 'List backups' }
    },
    {
        method: 'POST',
        path: '/api/settings/backups',
        handler: handlers.createBackup,
        options: { tags: ['api', 'settings'], description: 'Trigger backup' }
    },
    // Me
    {
        method: 'GET',
        path: '/api/settings/me',
        handler: handlers.getCurrentUser,
        options: { tags: ['api', 'settings'], description: 'Get current user' }
    },
    // School Profile
    {
        method: 'GET',
        path: '/api/settings/school',
        handler: handlers.getSchoolProfile,
        options: {
            auth: false, // Allow public access
            tags: ['api', 'settings'],
            description: 'Get school profile'
        }
    },
    {
        method: 'PUT',
        path: '/api/settings/school',
        handler: handlers.updateSchoolProfile,
        options: {
            tags: ['api', 'settings'],
            description: 'Update school profile',
            validate: {
                payload: Joi.object({
                    id: Joi.any().strip(), // Strip id from payload
                    name: Joi.string().allow('', null).optional(),
                    address: Joi.string().allow('', null).optional(),
                    phone: Joi.string().allow('', null).optional(),
                    email: Joi.string().email().allow('', null).optional(),
                    website: Joi.string().allow('', null).optional(),
                    latitude: Joi.number().min(-90).max(90).allow(null).optional(),
                    longitude: Joi.number().min(-180).max(180).allow(null).optional()
                }).unknown(true) // Allow other fields to be stripped
            }
        }
    }
]
