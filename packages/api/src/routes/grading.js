import * as handlers from '../handlers/grading.js'
import { gradeValidators } from '../validators/index.js'
import Joi from 'joi'

export const gradingRoutes = [
    {
        method: 'GET',
        path: '/api/grades',
        handler: handlers.listGrades,
        options: {
            tags: ['api', 'grading'],
            description: 'List grades',
            validate: {
                query: Joi.object({
                    classId: Joi.string().optional(),
                    subjectId: Joi.string().optional(),
                    academicYearId: Joi.string().optional(),
                    semester: Joi.string().valid('GANJIL', 'GENAP').optional()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/grades',
        handler: handlers.saveGrade,
        options: {
            tags: ['api', 'grading'],
            description: 'Save grade',
            validate: { payload: gradeValidators.create }
        }
    },
    {
        method: 'POST',
        path: '/api/grades/bulk',
        handler: handlers.bulkSaveGrades,
        options: {
            tags: ['api', 'grading'],
            description: 'Bulk save grades',
            validate: { payload: gradeValidators.bulk }
        }
    },
    {
        method: 'GET',
        path: '/api/grades/p5-projects',
        handler: handlers.listP5Projects,
        options: { tags: ['api', 'grading'], description: 'List P5 projects' }
    },
    {
        method: 'POST',
        path: '/api/grades/p5-projects',
        handler: handlers.createP5Project,
        options: {
            tags: ['api', 'grading'],
            description: 'Create P5 project',
            validate: {
                payload: Joi.object({
                    title: Joi.string().required(),
                    theme: Joi.string().required(),
                    description: Joi.string().optional(),
                    academicYearId: Joi.string().optional(),
                    startDate: Joi.date().optional(),
                    endDate: Joi.date().optional(),
                    status: Joi.string().valid('PLANNING', 'IN_PROGRESS', 'COMPLETED').default('PLANNING')
                })
            }
        }
    }
]
