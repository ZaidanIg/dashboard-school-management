import Joi from 'joi'
import * as handlers from '../handlers/systemSettings.js'

export const systemSettingsRoutes = [
    // Get active curriculum type
    {
        method: 'GET',
        path: '/api/settings/curriculum',
        handler: handlers.getActiveCurriculum,
        options: {
            tags: ['api', 'settings', 'curriculum'],
            description: 'Get active curriculum type (K13 or MERDEKA)'
        }
    },

    // Set active curriculum type
    {
        method: 'PUT',
        path: '/api/settings/curriculum',
        handler: handlers.setActiveCurriculum,
        options: {
            tags: ['api', 'settings', 'curriculum'],
            description: 'Set active curriculum type',
            validate: {
                payload: Joi.object({
                    curriculumType: Joi.string().valid('K13', 'MERDEKA').required()
                })
            }
        }
    },

    // Get all settings
    {
        method: 'GET',
        path: '/api/settings/all',
        handler: handlers.getAllSettings,
        options: {
            tags: ['api', 'settings'],
            description: 'Get all system settings'
        }
    },

    // Get a specific setting
    {
        method: 'GET',
        path: '/api/settings/{key}',
        handler: handlers.getSetting,
        options: {
            tags: ['api', 'settings'],
            description: 'Get a specific system setting',
            validate: {
                params: Joi.object({
                    key: Joi.string().required()
                })
            }
        }
    },

    // Set a specific setting
    {
        method: 'PUT',
        path: '/api/settings/{key}',
        handler: handlers.setSetting,
        options: {
            tags: ['api', 'settings'],
            description: 'Set a system setting',
            validate: {
                params: Joi.object({
                    key: Joi.string().required()
                }),
                payload: Joi.object({
                    value: Joi.string().required()
                })
            }
        }
    }
]
