import Inert from '@hapi/inert'
import Vision from '@hapi/vision'
import HapiSwagger from 'hapi-swagger'
import { prismaPlugin } from './prisma.js'
import { authPlugin } from './auth.js'
import { corsPlugin } from './cors.js'

/**
 * Register all HAPI plugins
 * @param {import('@hapi/hapi').Server} server 
 */
export const registerPlugins = async (server) => {
    // Swagger documentation
    const swaggerOptions = {
        info: {
            title: 'Artefact API',
            version: '1.0.0',
            description: 'School Management System API'
        },
        grouping: 'tags',
        sortTags: 'alpha'
    }

    // Core plugins
    await server.register([
        Inert,
        Vision,
        { plugin: HapiSwagger, options: swaggerOptions }
    ])

    // Custom plugins
    await server.register(prismaPlugin)
    await server.register(corsPlugin)
    await server.register(authPlugin)

    console.log('✅ All plugins registered')
}
