import Boom from '@hapi/boom'
import { getSession } from '../plugins/auth.js'

/**
 * Require authentication middleware
 * Use in route options: pre: [{ method: requireAuth }]
 */
export const requireAuth = async (request, h) => {
    const session = await getSession(request)

    if (!session || !session.user) {
        throw Boom.unauthorized('Authentication required')
    }

    // Attach user to request
    request.auth.credentials = session.user
    request.auth.session = session.session

    return session.user
}

/**
 * Require specific role middleware
 * @param {string[]} roles - Allowed roles
 */
export const requireRole = (roles) => {
    return async (request, h) => {
        const user = await requireAuth(request, h)

        if (!roles.includes(user.role)) {
            throw Boom.forbidden('Insufficient permissions')
        }

        return user
    }
}

/**
 * Optional authentication (doesn't fail if not authenticated)
 */
export const optionalAuth = async (request, h) => {
    try {
        const session = await getSession(request)
        if (session?.user) {
            request.auth.credentials = session.user
            request.auth.session = session.session
        }
    } catch (err) {
        // Ignore auth errors
    }
    return h.continue
}
