import * as handlers from '../handlers/upload.js'
import { join } from 'path'

export const uploadRoutes = [
    {
        method: 'POST',
        path: '/api/upload',
        handler: handlers.uploadFile,
        options: {
            tags: ['api', 'upload'],
            description: 'Upload file securely',
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
                maxBytes: 50 * 1024 * 1024, // 50MB
                multipart: true
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            },
            validate: {
                // Joi validation for file if needed, but stream handling is manual in handler
            }
        }
    },
    {
        method: 'GET',
        path: '/uploads/{param*}',
        handler: {
            directory: {
                path: join(process.cwd(), 'uploads'),
                redirectToSlash: true,
                index: false
            }
        },
        options: {
            auth: false,
            tags: ['api', 'static'],
            description: 'Serve uploaded files'
        }
    }
]
