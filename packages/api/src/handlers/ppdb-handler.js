import { PrismaClient } from '@prisma/client'
import Boom from '@hapi/boom'

const prisma = new PrismaClient()

// PUBLIC: Get active PPDB Batch config
export const getPublicConfig = async (request, h) => {
    const now = new Date()

    // Find active batch where today is between start and end date
    const activeBatch = await prisma.pPDBBatch.findFirst({
        where: {
            isActive: true,
            startDate: { lte: now },
            endDate: { gte: now }
        },
        include: {
            academicYear: true
        }
    })

    if (!activeBatch) {
        // Check if there is a future batch
        const nextBatch = await prisma.pPDBBatch.findFirst({
            where: {
                isActive: true,
                startDate: { gt: now }
            },
            orderBy: { startDate: 'asc' }
        })

        return {
            isOpen: false,
            message: nextBatch
                ? `Pendaftaran akan dibuka pada tanggal ${nextBatch.startDate.toLocaleDateString('id-ID')}`
                : 'Pendaftaran Peserta Didik Baru belum dibuka.',
            nextBatch: nextBatch ? {
                name: nextBatch.name,
                startDate: nextBatch.startDate
            } : null
        }
    }

    return {
        isOpen: true,
        batchId: activeBatch.id,
        name: activeBatch.name,
        academicYear: activeBatch.academicYear.name,
        description: activeBatch.description,
        endDate: activeBatch.endDate
    }
}

// PUBLIC: Register a new student
export const registerStudent = async (request, h) => {
    const {
        fullName, nisn, nik, gender, birthPlace, birthDate, religion,
        email, phone, address, city, postalCode,
        fatherName, fatherPhone, motherName, motherPhone,
        originSchool, graduationYear
    } = request.payload

    // Check for active batch
    const now = new Date()
    const activeBatch = await prisma.pPDBBatch.findFirst({
        where: {
            isActive: true,
            startDate: { lte: now },
            endDate: { gte: now }
        }
    })

    if (!activeBatch) {
        throw Boom.forbidden('Pendaftaran sedang ditutup.')
    }

    // Check duplicate NIK or NISN if provided
    if (nik || nisn) {
        const existing = await prisma.pPDBRegistration.findFirst({
            where: {
                OR: [
                    nik ? { nik } : {},
                    nisn ? { nisn } : {}
                ],
                batchId: activeBatch.id
            }
        })

        if (existing) {
            throw Boom.conflict('Siswa dengan NIK atau NISN tersebut sudah terdaftar.')
        }
    }

    // Generate Registration Number: PPDB-{YEAR}-{BATCH}-{RANDOM}
    // Simple implementation
    const year = new Date().getFullYear()
    const random = Math.floor(1000 + Math.random() * 9000)
    const registrationNo = `PPDB-${year}-${activeBatch.id.substring(20)}-${random}`

    try {
        const registration = await prisma.pPDBRegistration.create({
            data: {
                batchId: activeBatch.id,
                registrationNo,
                fullName,
                nisn: nisn || null,
                nik: nik || null,
                gender,
                birthPlace,
                birthDate: new Date(birthDate), // Ensure Date object
                religion,
                email,
                phone,
                address,
                city,
                postalCode,
                fatherName,
                fatherPhone,
                motherName,
                motherPhone,
                originSchool,
                graduationYear: parseInt(graduationYear),
                status: 'PENDING'
            }
        })

        return h.response({
            message: 'Pendaftaran berhasil!',
            data: registration
        }).code(201)

    } catch (error) {
        console.error('PPDB Registration Error:', error)
        throw Boom.internal('Terjadi kesalahan saat memproses pendaftaran.')
    }
}

// ADMIN: Create/Update Batch
export const upsertBatch = async (request, h) => {
    const { id, name, academicYearId, startDate, endDate, isActive, description } = request.payload

    if (id) {
        // Update
        const batch = await prisma.pPDBBatch.update({
            where: { id },
            data: {
                name,
                academicYearId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                isActive,
                description
            }
        })
        return batch
    } else {
        // Create
        const batch = await prisma.pPDBBatch.create({
            data: {
                name,
                academicYearId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                isActive,
                description
            }
        })
        return h.response(batch).code(201)
    }
}

// ADMIN: Get All Batches
export const getBatches = async (request, h) => {
    return await prisma.pPDBBatch.findMany({
        include: {
            academicYear: true,
            _count: {
                select: { registrations: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })
}

// ADMIN: Get Registrations
export const getRegistrations = async (request, h) => {
    const { batchId, status } = request.query

    const where = {}
    if (batchId) where.batchId = batchId
    if (status) where.status = status

    return await prisma.pPDBRegistration.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
            batch: true
        }
    })
}

// ADMIN: Update Registration Status
export const updateRegistrationStatus = async (request, h) => {
    const { id } = request.params
    const { status, notes } = request.payload

    const registration = await prisma.pPDBRegistration.update({
        where: { id },
        data: {
            status,
            notes
        }
    })

    return registration
}
