import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

/**
 * Handle file upload
 * @param {import('stream').Readable} fileStream 
 * @param {object} hapiFileConfig - File metadata from HAPI (hapi.filename, etc.)
 * @returns {Promise<string>} - Public URL path
 */
export const uploadFile = async (fileStream) => {
    if (!fileStream) return null

    const filename = `${crypto.randomUUID()}${path.extname(fileStream.hapi.filename)}`
    const filePath = path.join(UPLOAD_DIR, filename)
    const writeStream = fs.createWriteStream(filePath)

    return new Promise((resolve, reject) => {
        fileStream.pipe(writeStream)
        fileStream.on('end', () => resolve(filename)) // Return filename only (handler puts /uploads/)
        fileStream.on('error', (err) => reject(err))
    })
}
