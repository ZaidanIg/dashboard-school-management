import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { toNodeHandler } from 'better-auth/node'
import { createTransport } from 'nodemailer'
import { prisma } from './prisma.js'
import { config } from '../config/index.js'

// Email transporter
const transporter = createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: false,
    auth: {
        user: config.smtp.user,
        pass: config.smtp.pass
    }
})

// Initialize Better Auth
export const auth = betterAuth({
    database: prismaAdapter(prisma, { provider: 'postgresql' }),
    baseURL: config.auth.url,
    secret: config.auth.secret,

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, // TODO: Enable when SMTP is configured
        sendResetPassword: async ({ user, url }) => {
            await transporter.sendMail({
                from: config.smtp.from,
                to: user.email,
                subject: 'Reset Password - Artefact',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2>Reset Password</h2>
                        <p>Halo ${user.name},</p>
                        <p>Klik tombol di bawah untuk mereset password:</p>
                        <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">Reset Password</a>
                        <p>Link ini akan kedaluwarsa dalam 1 jam.</p>
                    </div>
                `
            })
        }
    },

    emailVerification: {
        sendOnSignUp: false, // TODO: Enable when SMTP is configured
        sendVerificationEmail: async ({ user, url }) => {
            await transporter.sendMail({
                from: config.smtp.from,
                to: user.email,
                subject: 'Verifikasi Email - Artefact',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2>Verifikasi Email</h2>
                        <p>Halo ${user.name},</p>
                        <p>Terima kasih telah mendaftar di Artefact!</p>
                        <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">Verifikasi Email</a>
                    </div>
                `
            })
        }
    },

    socialProviders: {
        google: {
            clientId: config.google.clientId,
            clientSecret: config.google.clientSecret,
            enabled: !!(config.google.clientId && config.google.clientSecret)
        }
    },

    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24 // 1 day
    },

    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                input: false // Not user imputable during signup (unless handled elsewhere)
            }
        }
    },

    trustedOrigins: [config.frontend.url]
})

/**
 * Better Auth plugin
 */
export const authPlugin = {
    name: 'better-auth',
    version: '1.0.0',
    register: async (server) => {
        const nodeHandler = toNodeHandler(auth)
        const allowedOrigin = config.frontend.url

        // Helper to add CORS headers (needed because h.abandon bypasses onPreResponse)
        const setCorsHeaders = (res) => {
            res.setHeader('Access-Control-Allow-Origin', allowedOrigin)
            res.setHeader('Access-Control-Allow-Credentials', 'true')
            res.setHeader('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, If-None-Match')
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        }

        // GET requests (no payload)
        server.route({
            method: 'GET',
            path: '/api/auth/{path*}',
            handler: async (request, h) => {
                setCorsHeaders(request.raw.res)
                await nodeHandler(request.raw.req, request.raw.res)
                return h.abandon
            },
            options: { auth: false }
        })

        // POST requests (with payload)
        server.route({
            method: 'POST',
            path: '/api/auth/{path*}',
            handler: async (request, h) => {
                setCorsHeaders(request.raw.res)
                await nodeHandler(request.raw.req, request.raw.res)
                return h.abandon
            },
            options: {
                auth: false,
                payload: { parse: false, output: 'stream' }
            }
        })

        // OPTIONS preflight for auth routes
        server.route({
            method: 'OPTIONS',
            path: '/api/auth/{path*}',
            handler: (request, h) => {
                setCorsHeaders(request.raw.res)
                return h.response().code(204)
            },
            options: { auth: false }
        })

        console.log('✅ Better Auth configured')
        console.log('   - Email/Password: enabled')
        console.log('   - Google OAuth:', config.google.clientId ? 'enabled' : 'disabled')
    }
}

/**
 * Get session from request headers
 * @param {import('@hapi/hapi').Request} request 
 */
export const getSession = async (request) => {
    const headers = new Headers()
    Object.entries(request.headers).forEach(([key, value]) => {
        if (typeof value === 'string') headers.append(key, value)
    })
    return auth.api.getSession({ headers })
}
