
import Joi from 'joi'
import {
    listCurriculums,
    getCurriculum,
    createCurriculum,
    updateCurriculum,
    deleteCurriculum,
    listModules,
    createModule,
    updateModule,
    deleteModule
} from '../handlers/curriculum.js'

export const curriculumRoutes = [
    // Curriculum
    {
        method: 'GET',
        path: '/api/curriculum',
        handler: listCurriculums,
        options: {
            description: 'Get all curriculums',
            notes: 'Returns a list of all non-deleted curriculums',
            tags: ['api', 'curriculum']
        }
    },
    {
        method: 'GET',
        path: '/api/curriculum/{id}',
        handler: getCurriculum,
        options: {
            description: 'Get curriculum by id',
            tags: ['api', 'curriculum'],
            validate: {
                params: Joi.object({
                    id: Joi.string().required()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/curriculum',
        handler: createCurriculum,
        options: {
            description: 'Create new curriculum',
            tags: ['api', 'curriculum'],
            validate: {
                payload: Joi.object({
                    name: Joi.string().required(),
                    year: Joi.number().required(),
                    description: Joi.string().allow('').optional(),
                    isActive: Joi.boolean().optional()
                })
            }
        }
    },
    {
        method: 'PUT',
        path: '/api/curriculum/{id}',
        handler: updateCurriculum,
        options: {
            description: 'Update curriculum',
            tags: ['api', 'curriculum'],
            validate: {
                params: Joi.object({
                    id: Joi.string().required()
                }),
                payload: Joi.object({
                    name: Joi.string().optional(),
                    year: Joi.number().optional(),
                    description: Joi.string().allow('').optional(),
                    isActive: Joi.boolean().optional()
                })
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/curriculum/{id}',
        handler: deleteCurriculum,
        options: {
            description: 'Delete curriculum',
            tags: ['api', 'curriculum'],
            validate: {
                params: Joi.object({
                    id: Joi.string().required()
                })
            }
        }
    },

    // Modules
    {
        method: 'GET',
        path: '/api/curriculum/{id}/modules',
        handler: listModules,
        options: {
            description: 'Get all modules for a curriculum',
            tags: ['api', 'curriculum', 'modules'],
            validate: {
                params: Joi.object({
                    id: Joi.string().required() // Curriculum ID
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/curriculum/{id}/modules',
        handler: createModule,
        options: {
            description: 'Create new module for a curriculum',
            tags: ['api', 'curriculum', 'modules'],
            validate: {
                params: Joi.object({
                    id: Joi.string().required() // Curriculum ID
                }),
                payload: Joi.object({
                    subjectCode: Joi.string().required(),
                    grade: Joi.number().required(),
                    semester: Joi.string().valid('GANJIL', 'GENAP').required(),
                    title: Joi.string().required(),
                    description: Joi.string().allow('').optional(),
                    competencies: Joi.array().items(Joi.string()).optional()
                })
            }
        }
    },
    {
        method: 'PUT',
        path: '/api/curriculum/modules/{moduleId}',
        handler: updateModule,
        options: {
            description: 'Update module',
            tags: ['api', 'curriculum', 'modules'],
            validate: {
                params: Joi.object({
                    moduleId: Joi.string().required()
                }),
                payload: Joi.object({
                    subjectCode: Joi.string().optional(),
                    grade: Joi.number().optional(),
                    semester: Joi.string().valid('GANJIL', 'GENAP').optional(),
                    title: Joi.string().optional(),
                    description: Joi.string().allow('').optional(),
                    competencies: Joi.array().items(Joi.string()).optional()
                })
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/curriculum/modules/{moduleId}',
        handler: deleteModule,
        options: {
            description: 'Delete module',
            tags: ['api', 'curriculum', 'modules'],
            validate: {
                params: Joi.object({
                    moduleId: Joi.string().required()
                })
            }
        }
    }
]
