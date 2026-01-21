import Boom from '@hapi/boom'

/**
 * Global error handler middleware
 * @param {import('@hapi/hapi').Server} server 
 */
export const errorHandler = (server) => {
    server.ext('onPreResponse', (request, h) => {
        const response = request.response

        if (response.isBoom) {
            const error = response

            // Log error in development
            if (process.env.NODE_ENV !== 'production') {
                console.error('Error:', {
                    statusCode: error.output.statusCode,
                    message: error.message,
                    path: request.path,
                    method: request.method
                })
            }

            // Customize error response
            const customError = {
                statusCode: error.output.statusCode,
                error: error.output.payload.error,
                message: error.message,
                ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
            }

            const newResponse = h.response(customError).code(error.output.statusCode)

            // Preserve headers from the original error (e.g. CORS)
            if (error.output.headers) {
                Object.entries(error.output.headers).forEach(([key, value]) => {
                    newResponse.header(key, value)
                })
            }

            return newResponse
        }

        return h.continue
    })

    console.log('✅ Error handler registered')
}
