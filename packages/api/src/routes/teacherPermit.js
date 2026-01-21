import * as handlers from '../handlers/teacherPermit.js'
import { idParam } from '../validators/index.js'
import Joi from 'joi'

export const teacherPermitRoutes = [
    {
        method: 'GET',
        path: '/api/teacher-permits',
        handler: handlers.listPermits,
        options: {
            tags: ['api', 'teacher-permits'],
            description: 'List all teacher permits',
            validate: {
                query: Joi.object({
                    search: Joi.string().optional(),
                    type: Joi.string().valid('SICK', 'FAMILY', 'OFFICIAL', 'OTHER').optional(),
                    status: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED').optional(),
                    teacherId: Joi.string().optional(),
                    startDate: Joi.date().optional(),
                    endDate: Joi.date().optional()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/teacher-permits/stats',
        handler: handlers.getPermitStats,
        options: {
            tags: ['api', 'teacher-permits'],
            description: 'Get teacher permit statistics'
        }
    },
    {
        method: 'GET',
        path: '/api/teacher-permits/export',
        handler: handlers.exportPermits,
        options: {
            tags: ['api', 'teacher-permits'],
            description: 'Export teacher permits to CSV',
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
        path: '/api/teacher-permits/{id}',
        handler: handlers.getPermit,
        options: {
            tags: ['api', 'teacher-permits'],
            description: 'Get teacher permit by ID',
            validate: { params: idParam }
        }
    },
    {
        method: 'POST',
        path: '/api/teacher-permits',
        handler: handlers.createPermit,
        options: {
            tags: ['api', 'teacher-permits'],
            description: 'Create new teacher permit',
            validate: {
                payload: Joi.object({
                    teacherId: Joi.string().required(),
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
        path: '/api/teacher-permits/{id}',
        handler: handlers.updatePermit,
        options: {
            tags: ['api', 'teacher-permits'],
            description: 'Update teacher permit',
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
        path: '/api/teacher-permits/{id}/status',
        handler: handlers.updatePermitStatus,
        options: {
            tags: ['api', 'teacher-permits'],
            description: 'Update teacher permit status',
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
        path: '/api/teacher-permits/{id}',
        handler: handlers.deletePermit,
        options: {
            tags: ['api', 'teacher-permits'],
            description: 'Delete teacher permit',
            validate: { params: idParam }
        }
    }
]
