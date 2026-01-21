import * as handlers from '../handlers/permit.js'
import { idParam } from '../validators/index.js'
import Joi from 'joi'

export const permitRoutes = [
    {
        method: 'GET',
        path: '/api/permits',
        handler: handlers.listPermits,
        options: {
            tags: ['api', 'permits'],
            description: 'List all permits',
            validate: {
                query: Joi.object({
                    search: Joi.string().optional(),
                    type: Joi.string().valid('SICK', 'FAMILY', 'OFFICIAL', 'OTHER').optional(),
                    status: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED').optional(),
                    studentId: Joi.string().optional(),
                    startDate: Joi.date().optional(),
                    endDate: Joi.date().optional()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/permits/stats',
        handler: handlers.getPermitStats,
        options: {
            tags: ['api', 'permits'],
            description: 'Get permit statistics'
        }
    },
    {
        method: 'GET',
        path: '/api/permits/export',
        handler: handlers.exportPermits,
        options: {
            tags: ['api', 'permits'],
            description: 'Export permits to CSV',
            validate: {
                query: Joi.object({
                    startDate: Joi.date().optional(),
                    endDate: Joi.date().optional(),
                    type: Joi.string().valid('SICK', 'FAMILY', 'OFFICIAL', 'OTHER').optional(),
                    status: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED').optional()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/permits/{id}',
        handler: handlers.getPermit,
        options: {
            tags: ['api', 'permits'],
            description: 'Get permit by ID',
            validate: { params: idParam }
        }
    },
    {
        method: 'POST',
        path: '/api/permits',
        handler: handlers.createPermit,
        options: {
            tags: ['api', 'permits'],
            description: 'Create new permit',
            validate: {
                payload: Joi.object({
                    studentId: Joi.string().required(),
                    type: Joi.string().valid('SICK', 'FAMILY', 'OFFICIAL', 'OTHER').required(),
                    startDate: Joi.date().required(),
                    endDate: Joi.date().required(),
                    reason: Joi.string().required(),
                    document: Joi.string().optional().allow(null, '')
                })
            }
        }
    },
    {
        method: 'PUT',
        path: '/api/permits/{id}',
        handler: handlers.updatePermit,
        options: {
            tags: ['api', 'permits'],
            description: 'Update permit',
            validate: {
                params: idParam,
                payload: Joi.object({
                    type: Joi.string().valid('SICK', 'FAMILY', 'OFFICIAL', 'OTHER').optional(),
                    startDate: Joi.date().optional(),
                    endDate: Joi.date().optional(),
                    reason: Joi.string().optional(),
                    document: Joi.string().optional().allow(null, '')
                })
            }
        }
    },
    {
        method: 'PATCH',
        path: '/api/permits/{id}/status',
        handler: handlers.updatePermitStatus,
        options: {
            tags: ['api', 'permits'],
            description: 'Update permit status',
            validate: {
                params: idParam,
                payload: Joi.object({
                    status: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED').required(),
                    approvedBy: Joi.string().optional().allow(null)
                })
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/permits/{id}',
        handler: handlers.deletePermit,
        options: {
            tags: ['api', 'permits'],
            description: 'Delete permit',
            validate: { params: idParam }
        }
    }
]
