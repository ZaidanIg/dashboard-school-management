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
                    category: Joi.string().allow('').optional(),
                    type: Joi.string().allow('').optional(),
                    status: Joi.string().allow('').optional(),
                    search: Joi.string().allow('').optional(),
                    target: Joi.string().allow('').optional()
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
    {
        method: 'PUT',
        path: '/api/communication/announcements/{id}',
        handler: handlers.updateAnnouncement,
        options: { tags: ['api', 'communication'], description: 'Update announcement' }
    },
    {
        method: 'DELETE',
        path: '/api/communication/announcements/{id}',
        handler: handlers.deleteAnnouncement,
        options: { tags: ['api', 'communication'], description: 'Delete announcement' }
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
