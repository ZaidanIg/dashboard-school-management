import * as handlers from '../handlers/academic.js'
import { academicValidators } from '../validators/index.js'
import Joi from 'joi'

export const academicRoutes = [
    // Academic Years
    {
        method: 'GET',
        path: '/api/academic/years',
        handler: handlers.listAcademicYears,
        options: { tags: ['api', 'academic'], description: 'List academic years' }
    },
    {
        method: 'GET',
        path: '/api/academic/years/{id}',
        handler: handlers.getAcademicYear,
        options: {
            tags: ['api', 'academic'],
            description: 'Get academic year by ID',
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        }
    },
    {
        method: 'POST',
        path: '/api/academic/years',
        handler: handlers.createAcademicYear,
        options: {
            tags: ['api', 'academic'],
            description: 'Create academic year',
            validate: { payload: academicValidators.year }
        }
    },
    {
        method: 'PUT',
        path: '/api/academic/years/{id}',
        handler: handlers.updateAcademicYear,
        options: {
            tags: ['api', 'academic'],
            description: 'Update academic year',
            validate: {
                params: Joi.object({ id: Joi.string().required() }),
                payload: academicValidators.year
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/academic/years/{id}',
        handler: handlers.deleteAcademicYear,
        options: {
            tags: ['api', 'academic'],
            description: 'Delete academic year',
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        }
    },
    // Classes
    {
        method: 'GET',
        path: '/api/academic/classes',
        handler: handlers.listClasses,
        options: {
            tags: ['api', 'academic'],
            description: 'List classes',
            validate: {
                query: Joi.object({
                    academicYearId: Joi.string().optional(),
                    grade: Joi.number().optional(),
                    major: Joi.string().optional(),
                    search: Joi.string().optional()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/academic/classes/{id}',
        handler: handlers.getClass,
        options: {
            tags: ['api', 'academic'],
            description: 'Get class by ID',
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        }
    },
    {
        method: 'POST',
        path: '/api/academic/classes',
        handler: handlers.createClass,
        options: {
            tags: ['api', 'academic'],
            description: 'Create class',
            validate: { payload: academicValidators.class }
        }
    },
    {
        method: 'PUT',
        path: '/api/academic/classes/{id}',
        handler: handlers.updateClass,
        options: {
            tags: ['api', 'academic'],
            description: 'Update class',
            validate: {
                params: Joi.object({ id: Joi.string().required() }),
                payload: academicValidators.class
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/academic/classes/{id}',
        handler: handlers.deleteClass,
        options: {
            tags: ['api', 'academic'],
            description: 'Delete class',
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        }
    },
    // Subjects
    {
        method: 'GET',
        path: '/api/academic/subjects',
        handler: handlers.listSubjects,
        options: {
            tags: ['api', 'academic'],
            description: 'List subjects',
            validate: {
                query: Joi.object({
                    category: Joi.string().valid('WAJIB', 'PEMINATAN_IPA', 'PEMINATAN_IPS', 'MULOK', 'EKSTRA').optional(),
                    search: Joi.string().optional()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/academic/subjects/{id}',
        handler: handlers.getSubject,
        options: {
            tags: ['api', 'academic'],
            description: 'Get subject by ID',
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        }
    },
    {
        method: 'POST',
        path: '/api/academic/subjects',
        handler: handlers.createSubject,
        options: {
            tags: ['api', 'academic'],
            description: 'Create subject',
            validate: { payload: academicValidators.subject }
        }
    },
    {
        method: 'PUT',
        path: '/api/academic/subjects/{id}',
        handler: handlers.updateSubject,
        options: {
            tags: ['api', 'academic'],
            description: 'Update subject',
            validate: {
                params: Joi.object({ id: Joi.string().required() }),
                payload: academicValidators.subject
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/academic/subjects/{id}',
        handler: handlers.deleteSubject,
        options: {
            tags: ['api', 'academic'],
            description: 'Delete subject (Soft Delete)',
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        }
    },
    // Schedules
    {
        method: 'GET',
        path: '/api/academic/schedules',
        handler: handlers.listSchedules,
        options: {
            tags: ['api', 'academic'],
            description: 'List class schedules',
            validate: {
                query: Joi.object({
                    classId: Joi.string().optional(),
                    dayOfWeek: Joi.number().min(0).max(6).optional()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/academic/schedules',
        handler: handlers.createSchedule,
        options: {
            tags: ['api', 'academic'],
            description: 'Create class schedule',
            validate: {
                payload: Joi.object({
                    classId: Joi.string().required(),
                    subjectId: Joi.string().required(),
                    teacherId: Joi.string().optional().allow(null),
                    dayOfWeek: Joi.number().min(0).max(6).required(),
                    startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
                    endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
                    room: Joi.string().optional().allow(null, '')
                })
            }
        }
    },
    {
        method: 'PUT',
        path: '/api/academic/schedules/{id}',
        handler: handlers.updateSchedule,
        options: {
            tags: ['api', 'academic'],
            description: 'Update class schedule',
            validate: {
                params: Joi.object({ id: Joi.string().required() }),
                payload: Joi.object({
                    classId: Joi.string().optional(),
                    subjectId: Joi.string().optional(),
                    teacherId: Joi.string().optional().allow(null),
                    dayOfWeek: Joi.number().min(0).max(6).optional(),
                    startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
                    endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
                    room: Joi.string().optional().allow(null, '')
                })
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/academic/schedules/{id}',
        handler: handlers.deleteSchedule,
        options: {
            tags: ['api', 'academic'],
            description: 'Delete class schedule (Soft Delete)',
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        }
    },
    // Calendar
    {
        method: 'GET',
        path: '/api/academic/calendar',
        handler: handlers.listCalendarEvents,
        options: {
            tags: ['api', 'academic'],
            description: 'List calendar events',
            validate: {
                query: Joi.object({
                    academicYearId: Joi.string().optional(),
                    type: Joi.string().valid('HOLIDAY', 'EXAM', 'EVENT', 'MEETING', 'OTHER').optional(),
                    startDate: Joi.date().optional(),
                    endDate: Joi.date().optional()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/academic/calendar',
        handler: handlers.createCalendarEvent,
        options: {
            tags: ['api', 'academic'],
            description: 'Create calendar event',
            validate: {
                payload: Joi.object({
                    academicYearId: Joi.string().required(),
                    title: Joi.string().required(),
                    description: Joi.string().optional(),
                    startDate: Joi.date().required(),
                    endDate: Joi.date().required(),
                    type: Joi.string().valid('HOLIDAY', 'EXAM', 'EVENT', 'MEETING', 'OTHER').required()
                })
            }
        }
    },
    {
        method: 'PUT',
        path: '/api/academic/calendar/{id}',
        handler: handlers.updateCalendarEvent,
        options: {
            tags: ['api', 'academic'],
            description: 'Update calendar event',
            validate: {
                params: Joi.object({ id: Joi.string().required() }),
                payload: Joi.object({
                    academicYearId: Joi.string().optional(),
                    title: Joi.string().optional(),
                    description: Joi.string().optional(),
                    startDate: Joi.date().optional(),
                    endDate: Joi.date().optional(),
                    type: Joi.string().valid('HOLIDAY', 'EXAM', 'EVENT', 'MEETING', 'OTHER').optional()
                })
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/academic/calendar/{id}',
        handler: handlers.deleteCalendarEvent,
        options: {
            tags: ['api', 'academic'],
            description: 'Delete calendar event (Soft Delete)',
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        }
    }
]
