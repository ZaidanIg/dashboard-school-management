import Joi from 'joi'
import * as ppdbHandler from '../handlers/ppdb-handler.js'

export const ppdbRoutes = [
    // PUBLIC ROUTES
    {
        method: 'GET',
        path: '/public/ppdb/config',
        options: {
            auth: false,
            handler: ppdbHandler.getPublicConfig,
            description: 'Get active PPDB batch configuration',
            tags: ['api', 'ppdb', 'public']
        }
    },
    {
        method: 'POST',
        path: '/public/ppdb/register',
        options: {
            auth: false, // Public registration
            handler: ppdbHandler.registerStudent,
            description: 'Register a new student',
            tags: ['api', 'ppdb', 'public'],
            validate: {
                payload: Joi.object({
                    // Personal Data
                    fullName: Joi.string().required(),
                    nisn: Joi.string().allow('', null),
                    nik: Joi.string().allow('', null),
                    gender: Joi.string().valid('L', 'P').required(),
                    birthPlace: Joi.string().required(),
                    birthDate: Joi.date().required(),
                    religion: Joi.string().allow('', null),

                    // Contact
                    email: Joi.string().email().required(),
                    phone: Joi.string().required(),
                    address: Joi.string().required(),
                    city: Joi.string().required(),
                    postalCode: Joi.string().required(),

                    // Parents
                    fatherName: Joi.string().required(),
                    fatherPhone: Joi.string().required(),
                    motherName: Joi.string().required(),
                    motherPhone: Joi.string().required(),

                    // Previous School
                    originSchool: Joi.string().required(),
                    graduationYear: Joi.number().min(2000).max(2100).required()
                })
            }
        }
    },

    // ADMIN ROUTES
    {
        method: 'GET',
        path: '/ppdb/batches',
        options: {
            // auth: 'jwt', // TODO: Enable auth
            handler: ppdbHandler.getBatches,
            description: 'Get all PPDB batches',
            tags: ['api', 'ppdb', 'admin']
        }
    },
    {
        method: 'POST',
        path: '/ppdb/batches',
        options: {
            // auth: 'jwt',
            handler: ppdbHandler.upsertBatch,
            description: 'Create or update PPDB batch',
            tags: ['api', 'ppdb', 'admin'],
            validate: {
                payload: Joi.object({
                    id: Joi.string().optional(),
                    name: Joi.string().required(),
                    academicYearId: Joi.string().required(),
                    startDate: Joi.date().required(),
                    endDate: Joi.date().required(),
                    isActive: Joi.boolean().default(false),
                    description: Joi.string().allow('', null)
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/ppdb/registrations',
        options: {
            // auth: 'jwt',
            handler: ppdbHandler.getRegistrations,
            description: 'Get all PPDB registrations',
            tags: ['api', 'ppdb', 'admin'],
            validate: {
                query: Joi.object({
                    batchId: Joi.string().optional(),
                    status: Joi.string().valid('PENDING', 'VERIFIED', 'ACCEPTED', 'REJECTED').optional()
                })
            }
        }
    },
    {
        method: 'PUT',
        path: '/ppdb/registrations/{id}/status',
        options: {
            // auth: 'jwt',
            handler: ppdbHandler.updateRegistrationStatus,
            description: 'Update registration status',
            tags: ['api', 'ppdb', 'admin'],
            validate: {
                params: Joi.object({
                    id: Joi.string().required()
                }),
                payload: Joi.object({
                    status: Joi.string().valid('PENDING', 'VERIFIED', 'ACCEPTED', 'REJECTED').required(),
                    notes: Joi.string().allow('', null)
                })
            }
        }
    }
]
