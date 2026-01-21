import Hapi from '@hapi/hapi'
import { config } from './config/index.js'
import { registerPlugins } from './plugins/index.js'
import { registerRoutes } from './routes/index.js'
import { errorHandler } from './middleware/errorHandler.js'

const init = async () => {
    // Create server
    const server = Hapi.server({
        port: config.server.port,
        host: config.server.host,
        routes: {
            cors: false, // Handled by CORS plugin
            validate: {
                failAction: async (request, h, err) => {
                    throw err
                }
            }
        }
    })

    // Register all plugins
    await registerPlugins(server)

    // Register error handler
    errorHandler(server)

    // Register all routes
    registerRoutes(server)

    // Start server
    await server.start()
    console.log('🚀 Server running on %s', server.info.uri)
    console.log('📚 API docs at %s/documentation', server.info.uri)

    return server
}

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled rejection:', err)
    process.exit(1)
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err)
    process.exit(1)
})

init()
