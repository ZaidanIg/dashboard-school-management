import { PrismaClient } from '@prisma/client'
import { config } from '../config/index.js'

const prisma = new PrismaClient({
    log: config.isDev ? ['query', 'error', 'warn'] : ['error']
})

/**
 * Prisma database plugin
 */
export const prismaPlugin = {
    name: 'prisma',
    version: '1.0.0',
    register: async (server) => {
        await prisma.$connect()
        console.log('✅ Database connected')

        // Make prisma available on server.app
        server.app.prisma = prisma

        // Graceful shutdown
        server.ext('onPreStop', async () => {
            await prisma.$disconnect()
            console.log('📦 Database disconnected')
        })
    }
}

// Export for direct use in handlers
export { prisma }
