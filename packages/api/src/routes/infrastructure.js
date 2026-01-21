import * as handlers from '../handlers/infrastructure.js'
import { paginationQuery } from '../validators/index.js'
import Joi from 'joi'

export const infrastructureRoutes = [
    // Inventory
    {
        method: 'GET',
        path: '/api/infrastructure/inventory',
        handler: handlers.listInventory,
        options: {
            tags: ['api', 'infrastructure'],
            description: 'List inventory items',
            validate: {
                query: paginationQuery.keys({
                    category: Joi.string().optional(),
                    condition: Joi.string().valid('GOOD', 'FAIR', 'POOR', 'DAMAGED').optional()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/infrastructure/inventory',
        handler: handlers.createInventoryItem,
        options: { tags: ['api', 'infrastructure'], description: 'Create inventory item' }
    },
    // Rooms
    {
        method: 'GET',
        path: '/api/infrastructure/rooms',
        handler: handlers.listRooms,
        options: { tags: ['api', 'infrastructure'], description: 'List rooms' }
    },
    // Bookings
    {
        method: 'GET',
        path: '/api/infrastructure/bookings',
        handler: handlers.listBookings,
        options: { tags: ['api', 'infrastructure'], description: 'List room bookings' }
    },
    {
        method: 'POST',
        path: '/api/infrastructure/bookings',
        handler: handlers.createBooking,
        options: { tags: ['api', 'infrastructure'], description: 'Create booking' }
    },
    // Maintenance
    {
        method: 'GET',
        path: '/api/infrastructure/maintenance',
        handler: handlers.listMaintenance,
        options: { tags: ['api', 'infrastructure'], description: 'List maintenance records' }
    },
    {
        method: 'POST',
        path: '/api/infrastructure/maintenance',
        handler: handlers.createMaintenance,
        options: { tags: ['api', 'infrastructure'], description: 'Create maintenance record' }
    }
]
