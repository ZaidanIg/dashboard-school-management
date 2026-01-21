import 'dotenv/config'

export const config = {
    server: {
        port: process.env.PORT || 3001,
        host: process.env.HOST || '0.0.0.0'
    },
    database: {
        url: process.env.DATABASE_URL
    },
    auth: {
        secret: process.env.BETTER_AUTH_SECRET || 'change-this-secret',
        url: process.env.BETTER_AUTH_URL || 'http://localhost:3001'
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    },
    smtp: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        from: process.env.EMAIL_FROM || 'Artefact <noreply@artefact.id>'
    },
    frontend: {
        url: process.env.FRONTEND_URL || 'http://localhost:5174'
    },
    isDev: process.env.NODE_ENV !== 'production'
}
