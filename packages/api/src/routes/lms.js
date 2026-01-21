import * as handlers from '../handlers/lms.js'
import { lmsValidators, idParam, paginationQuery } from '../validators/index.js'
import Joi from 'joi'

export const lmsRoutes = [
    {
        method: 'GET',
        path: '/api/lms/assignments',
        handler: handlers.listAssignments,
        options: {
            tags: ['api', 'lms'],
            description: 'List assignments',
            validate: {
                query: paginationQuery.keys({
                    classId: Joi.string().optional(),
                    subjectId: Joi.string().optional(),
                    teacherId: Joi.string().optional(),
                    studentId: Joi.string().optional()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/lms/assignments',
        handler: handlers.createAssignment,
        options: {
            tags: ['api', 'lms'],
            description: 'Create assignment',
            validate: { payload: lmsValidators.createAssignment }
        }
    },
    {
        method: 'GET',
        path: '/api/lms/assignments/{id}',
        handler: handlers.getAssignmentDetail,
        options: {
            tags: ['api', 'lms'],
            description: 'Get assignment detail',
            validate: {
                params: idParam,
                query: Joi.object({
                    studentId: Joi.string().optional()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/lms/assignments/{id}/submit',
        handler: handlers.submitAssignment,
        options: {
            tags: ['api', 'lms'],
            description: 'Submit assignment (Student)',
            validate: {
                params: idParam,
                payload: lmsValidators.submitAssignment
            }
        }
    },
    {
        method: 'POST',
        path: '/api/lms/submissions/{submissionId}/grade',
        handler: handlers.gradeSubmission,
        options: {
            tags: ['api', 'lms'],
            description: 'Grade submission (Teacher)',
            validate: {
                params: Joi.object({
                    submissionId: Joi.string().required()
                }),
                payload: lmsValidators.gradeSubmission
            }
        }
    },
    {
        method: 'PUT',
        path: '/api/lms/assignments/{id}',
        handler: handlers.updateAssignment,
        options: {
            tags: ['api', 'lms'],
            description: 'Update assignment',
            validate: {
                params: idParam,
                payload: lmsValidators.createAssignment
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/lms/assignments/{id}',
        handler: handlers.deleteAssignment,
        options: {
            tags: ['api', 'lms'],
            description: 'Delete assignment',
            validate: {
                params: idParam
            }
        }
    }
]
