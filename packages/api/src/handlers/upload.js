import { createWriteStream, existsSync, mkdirSync } from 'fs'
import { join, extname } from 'path'
import { randomUUID } from 'crypto'
import Boom from '@hapi/boom'
import { virusScan } from '../services/virusScan.js'
import { config } from '../config/index.js'
import { prisma } from '../plugins/prisma.js' // Audit log usage

// Ensure upload dir exists
const UPLOAD_DIR = join(process.cwd(), 'uploads')
if (!existsSync(UPLOAD_DIR)) {
    mkdirSync(UPLOAD_DIR, { recursive: true })
}

export const uploadFile = async (request, h) => {
    const { file } = request.payload

    if (!file) {
        return Boom.badRequest('No file uploaded')
    }

    const filename = file.hapi.filename
    const headers = file.hapi.headers
    const fileSize = headers['content-length'] // Might be undefined depends on client

    // 1. Virus Scan (Mock)
    const scanResult = await virusScan.scan({ filename, headers })
    if (!scanResult.clean) {
        return Boom.forbidden(`Security Alert: ${scanResult.message}`)
    }

    // 2. Validate Extension
    const allowedExts = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip']
    const ext = extname(filename).toLowerCase()

    // Strict extension check
    if (!allowedExts.includes(ext)) {
        return Boom.unsupportedMediaType('File type not allowed')
    }

    // 3. Save File
    const uniqueName = `${randomUUID()}${ext}`
    const filePath = join(UPLOAD_DIR, uniqueName)
    const fileStream = createWriteStream(filePath)

    try {
        await new Promise((resolve, reject) => {
            file.pipe(fileStream)
            file.on('end', resolve)
            file.on('error', reject)
        })
    } catch (err) {
        console.error('Upload Error:', err)
        return Boom.internal('Failed to save file')
    }

    // 4. Construct URL
    // Assumes server serves 'uploads' at /uploads
    // Ideally we use env config for base URL
    const baseUrl = config.server.host === '0.0.0.0' ? 'http://localhost' : config.server.host
    const port = config.server.port
    // Quick fix for dev url
    const fileUrl = `${request.server.info.uri}/uploads/${uniqueName}`

    return {
        filename,
        url: fileUrl,
        size: fileSize,
        mimetype: headers['content-type']
    }
}
