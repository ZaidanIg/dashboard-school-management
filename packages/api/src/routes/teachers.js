import * as handlers from '../handlers/teachers.js'
import { teacherValidators, idParam } from '../validators/index.js'

export const teacherRoutes = [
    {
        method: 'GET',
        path: '/api/teachers',
        handler: handlers.listTeachers,
        options: {
            tags: ['api', 'teachers'],
            description: 'List all teachers',
            validate: { query: teacherValidators.query }
        }
    },
    {
        method: 'GET',
        path: '/api/teachers/export',
        handler: handlers.exportTeachers,
        options: {
            tags: ['api', 'teachers'],
            description: 'Export teachers to CSV',
            validate: { query: teacherValidators.query }
        }
    },
    {
        method: 'GET',
        path: '/api/teachers/me/schedules',
        handler: handlers.getMyTeachingSchedule,
        options: {
            tags: ['api', 'teachers'],
            description: 'Get logged-in teacher\'s schedule'
        }
    },
    {
        method: 'GET',
        path: '/api/teachers/me',
        handler: handlers.getMe,
        options: {
            tags: ['api', 'teachers'],
            description: 'Get logged-in teacher profile'
        }
    },
    {
        method: 'GET',
        path: '/api/teachers/me/attendance',
        handler: handlers.getMyAttendance,
        options: {
            tags: ['api', 'teachers'],
            description: 'Get logged-in teacher own attendance'
        }
    },
    {
        method: 'POST',
        path: '/api/teachers/attendance/self-checkin',
        handler: handlers.selfCheckIn,
        options: {
            tags: ['api', 'teachers'],
            description: 'Teacher self check-in with photo and location',
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
        method: 'GET',
        path: '/api/teachers/me/permits',
        handler: handlers.getMyPermits,
        options: {
            tags: ['api', 'teachers'],
            description: 'Get logged-in teacher permits'
        }
    },
    {
        method: 'POST',
        path: '/api/teachers/me/permits',
        handler: handlers.createMyPermit,
        options: {
            tags: ['api', 'teachers'],
            description: 'Create permit request for current teacher',
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
                multipart: true,
                maxBytes: 5 * 1024 * 1024
            }
        }
    },
    {
        method: 'GET',
        path: '/api/teachers/{id}',
        handler: handlers.getTeacher,
        options: {
            tags: ['api', 'teachers'],
            description: 'Get teacher by ID',
            validate: { params: idParam }
        }
    },
    {
        method: 'POST',
        path: '/api/teachers',
        handler: handlers.createTeacher,
        options: {
            tags: ['api', 'teachers'],
            description: 'Create new teacher',
            validate: { payload: teacherValidators.create }
        }
    },
    {
        method: 'PUT',
        path: '/api/teachers/{id}',
        handler: handlers.updateTeacher,
        options: {
            tags: ['api', 'teachers'],
            description: 'Update teacher',
            validate: { params: idParam, payload: teacherValidators.update }
        }
    },
    {
        method: 'DELETE',
        path: '/api/teachers/{id}',
        handler: handlers.deleteTeacher,
        options: {
            tags: ['api', 'teachers'],
            description: 'Delete teacher',
            validate: { params: idParam }
        }
    },
    {
        method: 'POST',
        path: '/api/teachers/attendance',
        handler: handlers.recordTeacherAttendance,
        options: {
            tags: ['api', 'teachers'],
            description: 'Record teacher attendance'
        }
    }
]
