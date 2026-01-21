import * as handlers from '../handlers/finance.js'
import { financeValidators, idParam, paginationQuery } from '../validators/index.js'
import Joi from 'joi'

export const financeRoutes = [
    {
        method: 'GET',
        path: '/api/finance/dashboard',
        handler: handlers.getDashboard,
        options: { tags: ['api', 'finance'], description: 'Get finance dashboard stats' }
    },
    {
        method: 'GET',
        path: '/api/finance/billings',
        handler: handlers.listBillings,
        options: {
            tags: ['api', 'finance'],
            description: 'List SPP billings',
            validate: {
                query: paginationQuery.keys({
                    studentId: Joi.string().optional(),
                    status: Joi.string().valid('PENDING', 'PAID', 'OVERDUE', 'PARTIAL', 'CANCELLED').optional(),
                    month: Joi.number().min(1).max(12).optional(),
                    year: Joi.number().optional()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/finance/billings/{id}/pay',
        handler: handlers.recordPayment,
        options: {
            tags: ['api', 'finance'],
            description: 'Record payment',
            validate: { params: idParam, payload: financeValidators.payment }
        }
    },
    {
        method: 'POST',
        path: '/api/finance/billings/{id}/notify',
        handler: handlers.sendBillingNotification,
        options: {
            tags: ['api', 'finance'],
            description: 'Send billing notification to parent',
            validate: { params: idParam }
        }
    },
    {
        method: 'GET',
        path: '/api/finance/transactions',
        handler: handlers.listTransactions,
        options: {
            tags: ['api', 'finance'],
            description: 'List transactions',
            validate: {
                query: paginationQuery.keys({
                    type: Joi.string().valid('INCOME', 'EXPENSE').optional(),
                    category: Joi.string().optional(),
                    startDate: Joi.date().optional(),
                    endDate: Joi.date().optional(),
                    search: Joi.string().allow('').optional()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/finance/transactions',
        handler: handlers.createTransaction,
        options: {
            tags: ['api', 'finance'],
            description: 'Create transaction',
            validate: { payload: financeValidators.transaction }
        }
    },
    {
        method: 'GET',
        path: '/api/finance/reports/export',
        handler: handlers.exportReports,
        options: {
            tags: ['api', 'finance'],
            description: 'Export finance reports',
            validate: {
                query: paginationQuery.keys({
                    type: Joi.string().valid('INCOME', 'EXPENSE').optional(),
                    category: Joi.string().optional(),
                    startDate: Joi.date().optional(),
                    endDate: Joi.date().optional()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/finance/fee-types',
        handler: handlers.listFeeTypes,
        options: { tags: ['api', 'finance'], description: 'List fee types' }
    }
]
