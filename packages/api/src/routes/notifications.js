import * as handlers from '../handlers/notifications.js'
import Joi from 'joi'

export const notificationRoutes = [
    {
        method: 'GET',
        path: '/api/notifications',
        handler: handlers.listNotifications,
        options: {
            tags: ['api', 'notifications'],
            description: 'List user notifications and unread count',
            validate: {
                query: Joi.object({
                    limit: Joi.number().integer().min(1).max(100).default(30),
                    role: Joi.string().allow('').optional(),
                    userId: Joi.string().allow('').optional(),
                    classId: Joi.string().allow('').optional()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/notifications',
        handler: handlers.createNotification,
        options: {
            tags: ['api', 'notifications'],
            description: 'Create a new notification',
            validate: {
                payload: Joi.object({
                    title: Joi.string().required(),
                    message: Joi.string().required(),
                    type: Joi.string().valid('ASSIGNMENT', 'SUBMISSION', 'ANNOUNCEMENT', 'INFO').default('INFO'),
                    role: Joi.string().valid('SUPER_ADMIN', 'PRINCIPAL', 'TEACHER', 'STAFF', 'PARENT', 'STUDENT').allow(null).optional(),
                    classId: Joi.string().allow(null).optional(),
                    userId: Joi.string().allow(null).optional(),
                    link: Joi.string().allow(null).optional(),
                    metadata: Joi.object().unknown().allow(null).optional()
                })
            }
        }
    },
    {
        method: 'PATCH',
        path: '/api/notifications/{id}/read',
        handler: handlers.markNotificationAsRead,
        options: {
            tags: ['api', 'notifications'],
            description: 'Mark notification as read',
            validate: {
                params: Joi.object({
                    id: Joi.string().required()
                })
            }
        }
    },
    {
        method: 'PATCH',
        path: '/api/notifications/read-all',
        handler: handlers.markAllNotificationsAsRead,
        options: {
            tags: ['api', 'notifications'],
            description: 'Mark all user notifications as read',
            validate: {
                query: Joi.object({
                    role: Joi.string().allow('').optional(),
                    userId: Joi.string().allow('').optional(),
                    classId: Joi.string().allow('').optional()
                })
            }
        }
    }
]
