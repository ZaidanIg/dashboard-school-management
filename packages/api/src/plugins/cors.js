import { config } from '../config/index.js'

/**
 * CORS handling plugin
 */
export const corsPlugin = {
    name: 'cors',
    version: '1.0.0',
    register: async (server) => {
        // Allow any origin that is requesting
        server.ext('onPreResponse', (request, h) => {
            const response = request.response
            // Get origin from request. If missing, we don't set CORS headers for credentials
            const origin = request.headers.origin

            // Common headers
            const allowedHeaders = 'Accept, Authorization, Content-Type, If-None-Match, Origin, X-Requested-With'
            const allowedMethods = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'

            if (response.isBoom) {
                // Ensure headers object exists
                response.output.headers = response.output.headers || {}

                if (origin) {
                    response.output.headers['Access-Control-Allow-Origin'] = origin
                    response.output.headers['Access-Control-Allow-Credentials'] = 'true'
                } else {
                    // Fallback for non-browser/no-origin requests
                    response.output.headers['Access-Control-Allow-Origin'] = '*'
                }

                response.output.headers['Access-Control-Allow-Headers'] = allowedHeaders
                response.output.headers['Access-Control-Allow-Methods'] = allowedMethods
            } else {
                if (origin) {
                    response.header('Access-Control-Allow-Origin', origin)
                    response.header('Access-Control-Allow-Credentials', 'true')
                } else {
                    response.header('Access-Control-Allow-Origin', '*')
                }

                response.header('Access-Control-Allow-Headers', allowedHeaders)
                response.header('Access-Control-Allow-Methods', allowedMethods)
            }

            return h.continue
        })

        // Preflight handler
        server.route({
            method: 'OPTIONS',
            path: '/{any*}',
            handler: (request, h) => {
                const response = h.response().code(204)
                const origin = request.headers.origin

                if (origin) {
                    response.header('Access-Control-Allow-Origin', origin)
                    response.header('Access-Control-Allow-Credentials', 'true')
                } else {
                    response.header('Access-Control-Allow-Origin', '*')
                }

                response.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, If-None-Match, Origin, X-Requested-With')
                response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')

                return response
            },
            options: { auth: false, cors: false }
        })

        console.log('✅ CORS configured for: Dynamic Origin')
    }
}
