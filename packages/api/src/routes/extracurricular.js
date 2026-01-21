import * as handlers from '../handlers/extracurricular.js'
import { idParam } from '../validators/index.js'
import Joi from 'joi'

export const extracurricularRoutes = [
    {
        method: 'GET',
        path: '/api/extracurriculars',
        handler: handlers.listExtracurriculars,
        options: {
            tags: ['api', 'extracurricular'],
            description: 'List all extracurriculars',
            validate: {
                query: Joi.object({
                    search: Joi.string().optional(),
                    category: Joi.string().optional(),
                    isActive: Joi.string().valid('true', 'false').optional()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/extracurriculars/categories',
        handler: handlers.getCategories,
        options: {
            tags: ['api', 'extracurricular'],
            description: 'Get available categories'
        }
    },
    {
        method: 'GET',
        path: '/api/extracurriculars/{id}',
        handler: handlers.getExtracurricular,
        options: {
            tags: ['api', 'extracurricular'],
            description: 'Get extracurricular by ID',
            validate: { params: idParam }
        }
    },
    {
        method: 'POST',
        path: '/api/extracurriculars',
        handler: handlers.createExtracurricular,
        options: {
            tags: ['api', 'extracurricular'],
            description: 'Create new extracurricular',
            validate: {
                payload: Joi.object({
                    name: Joi.string().required(),
                    category: Joi.string().required(),
                    description: Joi.string().optional().allow(''),
                    schedule: Joi.string().optional().allow(''),
                    location: Joi.string().optional().allow(''),
                    advisorId: Joi.string().optional().allow(null),
                    maxMembers: Joi.number().optional().allow(null),
                    isActive: Joi.boolean().default(true)
                })
            }
        }
    },
    {
        method: 'PUT',
        path: '/api/extracurriculars/{id}',
        handler: handlers.updateExtracurricular,
        options: {
            tags: ['api', 'extracurricular'],
            description: 'Update extracurricular',
            validate: {
                params: idParam,
                payload: Joi.object({
                    name: Joi.string().optional(),
                    category: Joi.string().optional(),
                    description: Joi.string().optional().allow(''),
                    schedule: Joi.string().optional().allow(''),
                    location: Joi.string().optional().allow(''),
                    advisorId: Joi.string().optional().allow(null),
                    maxMembers: Joi.number().optional().allow(null),
                    isActive: Joi.boolean().optional()
                })
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/extracurriculars/{id}',
        handler: handlers.deleteExtracurricular,
        options: {
            tags: ['api', 'extracurricular'],
            description: 'Delete extracurricular',
            validate: { params: idParam }
        }
    },
    {
        method: 'POST',
        path: '/api/extracurriculars/members',
        handler: handlers.addMember,
        options: {
            tags: ['api', 'extracurricular'],
            description: 'Add member to extracurricular',
            validate: {
                payload: Joi.object({
                    extracurricularId: Joi.string().required(),
                    studentId: Joi.string().required(),
                    role: Joi.string().optional().allow('')
                })
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/extracurriculars/members/{id}',
        handler: handlers.removeMember,
        options: {
            tags: ['api', 'extracurricular'],
            description: 'Remove member from extracurricular',
            validate: { params: idParam }
        }
    }
]
