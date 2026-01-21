import * as handlers from '../handlers/dapodik.js'

export const dapodikRoutes = [
    {
        method: 'POST', // Usually POST for triggering sync
        path: '/api/admin/dapodik/sync',
        handler: handlers.syncDapodik,
        options: {
            tags: ['api', 'admin', 'integration'],
            description: 'Trigger Dapodik Synchronization',
            // auth: 'jwt' // Ensure auth in production
        }
    }
]
