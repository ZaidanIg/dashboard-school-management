import * as handlers from '../handlers/students.js'
import { studentValidators, idParam, paginationQuery } from '../validators/index.js'
import Joi from 'joi'

export const studentRoutes = [
    {
        method: 'GET',
        path: '/api/students',
        handler: handlers.listStudents,
        options: {
            tags: ['api', 'students'],
            description: 'List all students',
            validate: { query: studentValidators.query }
        }
    },
    {
        method: 'GET',
        path: '/api/students/{id}',
        handler: handlers.getStudent,
        options: {
            tags: ['api', 'students'],
            description: 'Get student by ID',
            validate: { params: idParam }
        }
    },
    {
        method: 'POST',
        path: '/api/students',
        handler: handlers.createStudent,
        options: {
            tags: ['api', 'students'],
            description: 'Create new student',
            validate: {
                payload: studentValidators.create,
                failAction: (request, h, err) => { throw err }
            },
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
                multipart: true,
                maxBytes: 5 * 1024 * 1024 // 5MB
            }
        }
    },
    {
        method: 'PUT',
        path: '/api/students/{id}',
        handler: handlers.updateStudent,
        options: {
            tags: ['api', 'students'],
            description: 'Update student',
            validate: {
                params: idParam,
                payload: studentValidators.update,
                failAction: (request, h, err) => { throw err }
            },
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
                multipart: true,
                maxBytes: 5 * 1024 * 1024 // 5MB
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/students/{id}',
        handler: handlers.deleteStudent,
        options: {
            tags: ['api', 'students'],
            description: 'Delete student',
            validate: { params: idParam }
        }
    },
    {
        method: 'GET',
        path: '/api/students/me',
        handler: handlers.getMyProfile,
        options: {
            auth: false, // Handled inside handler
            tags: ['api', 'students'],
            description: 'Get current logged-in student profile'
        }
    },
    {
        method: 'GET',
        path: '/api/students/me/attendance',
        handler: handlers.getMyAttendance,
        options: {
            auth: false, // Handled inside handler
            tags: ['api', 'students'],
            description: 'Get current logged-in student own attendance',
            validate: {
                query: Joi.object({
                    startDate: Joi.date().optional(),
                    endDate: Joi.date().optional()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/students/me/permits',
        handler: handlers.getMyPermits,
        options: {
            auth: false,
            tags: ['api', 'students'],
            description: 'Get current logged-in student permits'
        }
    },
    {
        method: 'POST',
        path: '/api/students/me/permits',
        handler: handlers.createMyPermit,
        options: {
            auth: false,
            tags: ['api', 'students'],
            description: 'Create permit request for current student',
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
                multipart: true,
                maxBytes: 5 * 1024 * 1024
            },
            validate: {
                payload: Joi.object({
                    type: Joi.string().valid('SICK', 'FAMILY', 'OFFICIAL', 'OTHER').required(),
                    startDate: Joi.string().required(),
                    endDate: Joi.string().required(),
                    reason: Joi.string().required(),
                    document: Joi.any().optional()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/students/{id}/attendance',
        handler: handlers.getStudentAttendance,
        options: {
            tags: ['api', 'students'],
            description: 'Get student attendance',
            validate: {
                params: idParam,
                query: Joi.object({
                    startDate: Joi.date().optional(),
                    endDate: Joi.date().optional()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/students/attendance',
        handler: handlers.recordAttendance,
        options: {
            tags: ['api', 'students'],
            description: 'Record attendance',
            validate: { payload: studentValidators.attendance }
        }
    },
    {
        method: 'POST',
        path: '/api/students/attendance/self-checkin',
        handler: handlers.selfCheckIn,
        options: {
            auth: false, // Handled inside handler
            tags: ['api', 'students'],
            description: 'Student self check-in with photo and location',
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
                multipart: true,
                maxBytes: 5 * 1024 * 1024 // 5MB
            },
            validate: { payload: studentValidators.selfCheckIn }
        }
    },
    {
        method: 'GET',
        path: '/api/students/attendance/summary',
        handler: handlers.getAttendanceSummary,
        options: {
            tags: ['api', 'students'],
            description: 'Get attendance summary for a date',
            validate: {
                query: Joi.object({
                    date: Joi.date().optional(),
                    classId: Joi.string().optional()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/students/attendance/recap',
        handler: handlers.getAttendanceRecap,
        options: {
            tags: ['api', 'students'],
            description: 'Get attendance recap (monthly/semester/yearly)',
            validate: {
                query: Joi.object({
                    period: Joi.string().valid('monthly', 'semester', 'yearly').default('monthly'),
                    year: Joi.number().optional(),
                    month: Joi.number().min(1).max(12).optional(),
                    semester: Joi.number().valid(1, 2).optional()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/students/attendance/low',
        handler: handlers.getLowAttendanceStudents,
        options: {
            tags: ['api', 'students'],
            description: 'Get students with low attendance',
            validate: {
                query: Joi.object({
                    threshold: Joi.number().min(0).max(100).default(60),
                    period: Joi.string().valid('semester', 'yearly').default('semester'),
                    year: Joi.number().optional(),
                    semester: Joi.number().valid(1, 2).optional()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/students/export',
        handler: handlers.exportStudents,
        options: {
            tags: ['api', 'students'],
            description: 'Export students to CSV or JSON',
            validate: {
                query: Joi.object({
                    format: Joi.string().valid('csv', 'json').default('csv'),
                    classFilter: Joi.string().optional(),
                    fields: Joi.string().optional()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/students/import/template',
        handler: handlers.getImportTemplate,
        options: {
            tags: ['api', 'students'],
            description: 'Get import template CSV'
        }
    },
    {
        method: 'POST',
        path: '/api/students/import',
        handler: handlers.importStudents,
        options: {
            tags: ['api', 'students'],
            description: 'Import students from JSON',
            validate: {
                payload: Joi.object({
                    students: Joi.array().items(Joi.object({
                        nis: Joi.string().required(),
                        nisn: Joi.string().optional(),
                        nik: Joi.string().optional(),
                        name: Joi.string().required(),
                        gender: Joi.string().valid('MALE', 'FEMALE').default('MALE'),
                        birthPlace: Joi.string().optional(),
                        birthDate: Joi.date().optional(),
                        address: Joi.string().optional(),
                        phone: Joi.string().optional(),
                        email: Joi.string().email().optional()
                    })).required(),
                    updateExisting: Joi.boolean().default(false)
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/students/dapodik/sync',
        handler: handlers.syncFromDapodik,
        options: {
            tags: ['api', 'students'],
            description: 'Sync students from Dapodik',
            validate: {
                payload: Joi.object({
                    npsn: Joi.string().required(),
                    tingkat: Joi.string().optional()
                })
            }
        }
    },
    // Class Enrollment Routes
    {
        method: 'GET',
        path: '/api/students/classes/available',
        handler: handlers.getAvailableClasses,
        options: {
            tags: ['api', 'students', 'enrollment'],
            description: 'Get available classes for enrollment',
            validate: {
                query: Joi.object({
                    academicYearId: Joi.string().optional()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/students/{id}/enrollment',
        handler: handlers.getStudentEnrollment,
        options: {
            tags: ['api', 'students', 'enrollment'],
            description: 'Get student class enrollments',
            validate: { params: idParam }
        }
    },
    {
        method: 'POST',
        path: '/api/students/{id}/enrollment',
        handler: handlers.enrollStudent,
        options: {
            tags: ['api', 'students', 'enrollment'],
            description: 'Enroll student in a class',
            validate: {
                params: idParam,
                payload: Joi.object({
                    classId: Joi.string().required()
                })
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/students/{id}/enrollment/{enrollmentId}',
        handler: handlers.unenrollStudent,
        options: {
            tags: ['api', 'students', 'enrollment'],
            description: 'Remove student from a class',
            validate: {
                params: Joi.object({
                    id: Joi.string().required(),
                    enrollmentId: Joi.string().required()
                })
            }
        }
    },
    // Credential Management Routes
    {
        method: 'GET',
        path: '/api/students/{id}/credentials',
        handler: handlers.checkCredentials,
        options: {
            tags: ['api', 'students', 'credentials'],
            description: 'Check if student has login credentials',
            validate: { params: idParam }
        }
    },
    {
        method: 'POST',
        path: '/api/students/{id}/credentials',
        handler: handlers.generateCredentials,
        options: {
            tags: ['api', 'students', 'credentials'],
            description: 'Generate login credentials for student',
            validate: {
                params: idParam,
                payload: Joi.object({
                    email: Joi.string().email().optional(),
                    password: Joi.string().min(6).optional()
                })
            }
        }
    }
]
