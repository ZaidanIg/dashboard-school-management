import * as handlers from '../handlers/communication.js'
import { paginationQuery } from '../validators/index.js'
import Joi from 'joi'

export const communicationRoutes = [
    // Announcements
    {
        method: 'GET',
        path: '/api/communication/announcements',
        handler: handlers.listAnnouncements,
        options: {
            tags: ['api', 'communication'],
            description: 'List announcements',
            validate: {
                query: paginationQuery.keys({
                    category: Joi.string().optional(),
                    status: Joi.string().valid('DRAFT', 'PUBLISHED', 'ARCHIVED').optional(),
                    search: Joi.string().optional(),
                    target: Joi.string().valid('ALL', 'STUDENTS', 'TEACHERS', 'PARENTS').optional()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/communication/announcements',
        handler: handlers.createAnnouncement,
        options: { tags: ['api', 'communication'], description: 'Create announcement' }
    },
    // Letters
    {
        method: 'GET',
        path: '/api/communication/letters',
        handler: handlers.listLetters,
        options: {
            tags: ['api', 'communication'],
            description: 'List letters',
            validate: {
                query: paginationQuery.keys({
                    type: Joi.string().valid('INCOMING', 'OUTGOING', 'INTERNAL').optional(),
                    status: Joi.string().valid('DRAFT', 'SENT', 'RECEIVED', 'ARCHIVED').optional()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/communication/letters',
        handler: handlers.createLetter,
        options: { tags: ['api', 'communication'], description: 'Create letter' }
    },
    // WhatsApp
    {
        method: 'GET',
        path: '/api/communication/whatsapp',
        handler: handlers.listWhatsAppMessages,
        options: { tags: ['api', 'communication'], description: 'List WhatsApp messages' }
    },
    {
        method: 'POST',
        path: '/api/communication/whatsapp',
        handler: handlers.queueWhatsAppMessage,
        options: { tags: ['api', 'communication'], description: 'Queue WhatsApp message' }
    }
]
