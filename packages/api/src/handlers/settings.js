import Boom from '@hapi/boom'
import { prisma } from '../plugins/prisma.js'
import { getSession, auth } from '../plugins/auth.js'

// Users
export const listUsers = async (request, h) => {
    const { page, limit, role, status, search } = request.query

    const where = {}
    if (role) where.role = role
    if (status) where.status = status
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } }
        ]
    }

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            select: { id: true, email: true, name: true, role: true, status: true, emailVerified: true, image: true, createdAt: true },
            orderBy: { name: 'asc' }
        }),
        prisma.user.count({ where })
    ])

    return { data: users, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } }
}

export const updateUser = async (request, h) => {
    const { id } = request.params
    return prisma.user.update({
        where: { id },
        data: request.payload,
        select: { id: true, email: true, name: true, role: true, status: true }
    })
}

export const createUser = async (request, h) => {
    const { email, password, name, role = 'STAFF', status = 'ACTIVE' } = request.payload
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) throw Boom.badRequest('Email sudah terdaftar')

    await auth.api.signUpEmail({
        body: { email, password, name }
    })

    const updated = await prisma.user.update({
        where: { email },
        data: { role, status },
        select: { id: true, email: true, name: true, role: true, status: true, createdAt: true }
    })
    return h.response(updated).code(201)
}

export const deleteUser = async (request, h) => {
    const { id } = request.params
    await prisma.teacher.updateMany({
        where: { userId: id },
        data: { userId: null }
    })
    await prisma.user.delete({ where: { id } })
    return { success: true }
}



// Roles
export const listRoles = async (request, h) => {
    let roles = await prisma.role.findMany({ orderBy: { name: 'asc' } })
    if (roles.length === 0) {
        const defaultRoles = [
            {
                name: 'Super Admin',
                description: 'Akses penuh ke semua fitur dan konfigurasi sistem',
                permissions: ['all']
            },
            {
                name: 'Kepala Sekolah',
                description: 'Akses ke dashboard, laporan analitik, dan data guru/siswa',
                permissions: ['dashboard:view', 'students:view', 'teachers:view', 'finance:view', 'academic:view', 'grading:view', 'settings:view']
            },
            {
                name: 'Wakil Kurikulum',
                description: 'Akses pengelolaan akademik, kurikulum, dan kalender pendidikan',
                permissions: ['dashboard:view', 'academic:manage', 'academic:view', 'grading:view', 'students:view', 'teachers:view']
            },
            {
                name: 'Guru',
                description: 'Akses ke modul penilaian, jadwal mengajar, dan absensi kelas',
                permissions: ['dashboard:view', 'academic:view', 'grading:manage', 'grading:view', 'students:view']
            },
            {
                name: 'Staff Keuangan',
                description: 'Akses ke modul pembayaran SPP, tagihan, dan laporan kas',
                permissions: ['dashboard:view', 'finance:manage', 'finance:view', 'reports:view']
            },
            {
                name: 'Staff Tata Usaha',
                description: 'Akses administrasi data siswa, sarpras, dan surat-menyurat',
                permissions: ['dashboard:view', 'students:manage', 'teachers:view', 'infrastructure:manage', 'communication:manage']
            }
        ]
        for (const r of defaultRoles) {
            await prisma.role.create({ data: r })
        }
        roles = await prisma.role.findMany({ orderBy: { name: 'asc' } })
    }

    // Attach user count
    const roleMapping = {
        'Super Admin': 'SUPER_ADMIN',
        'Kepala Sekolah': 'PRINCIPAL',
        'Guru': 'TEACHER',
        'Staff Keuangan': 'STAFF',
        'Staff Tata Usaha': 'STAFF',
        'Wakil Kurikulum': 'PRINCIPAL'
    }

    const rolesWithCounts = await Promise.all(
        roles.map(async (role) => {
            const mappedRole = roleMapping[role.name] || 'STAFF'
            const userCount = await prisma.user.count({ where: { role: mappedRole } })
            return {
                ...role,
                usersCount: userCount
            }
        })
    )

    return rolesWithCounts
}

export const createRole = async (request, h) => {
    const role = await prisma.role.create({ data: request.payload })
    return h.response(role).code(201)
}

export const updateRole = async (request, h) => {
    const { id } = request.params
    const updated = await prisma.role.update({
        where: { id },
        data: request.payload
    })
    return updated
}

export const deleteRole = async (request, h) => {
    const { id } = request.params
    await prisma.role.delete({ where: { id } })
    return { success: true, message: 'Role berhasil dihapus' }
}

// System Config
export const getConfig = async (request, h) => {
    const configs = await prisma.systemConfig.findMany()
    const result = {}
    configs.forEach(c => { result[c.key] = c.value })
    return result
}

export const updateConfig = async (request, h) => {
    const entries = Object.entries(request.payload)
    await Promise.all(
        entries.map(([key, value]) =>
            prisma.systemConfig.upsert({
                where: { key },
                update: { value },
                create: { key, value }
            })
        )
    )
    return { updated: entries.length }
}

// Activity Log
export const listActivityLog = async (request, h) => {
    const { page, limit, userId, action, entity } = request.query

    const where = {}
    if (userId) where.userId = userId
    if (action) where.action = action
    if (entity) where.entity = entity

    const [logs, total] = await Promise.all([
        prisma.activityLog.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            include: { user: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.activityLog.count({ where })
    ])

    return { data: logs, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } }
}

// Backups
export const listBackups = async (request, h) => {
    return prisma.dataBackup.findMany({ orderBy: { createdAt: 'desc' }, take: 20 })
}

export const createBackup = async (request, h) => {
    const fs = await import('fs')
    const path = await import('path')

    const backupDir = path.resolve(process.cwd(), 'uploads', 'backups')
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true })
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `backup-sekolah-${timestamp}.json`
    const filepath = path.join(backupDir, filename)

    // Gather database snapshot
    const [
        school,
        systemConfigs,
        users,
        academicYears,
        classes,
        subjects,
        announcements,
        inventory
    ] = await Promise.all([
        prisma.school.findFirst(),
        prisma.systemConfig.findMany(),
        prisma.user.findMany({ select: { id: true, email: true, name: true, role: true, status: true, createdAt: true } }),
        prisma.academicYear.findMany(),
        prisma.class.findMany(),
        prisma.subject.findMany(),
        prisma.announcement.findMany(),
        prisma.inventoryItem.findMany()
    ])

    const backupData = {
        metadata: {
            exportedAt: new Date().toISOString(),
            version: '1.0.0',
            system: 'School Management Dashboard'
        },
        data: {
            school,
            systemConfigs,
            users,
            academicYears,
            classes,
            subjects,
            announcements,
            inventory
        }
    }

    const jsonString = JSON.stringify(backupData, null, 2)
    fs.writeFileSync(filepath, jsonString, 'utf8')
    const size = Buffer.byteLength(jsonString)

    const backup = await prisma.dataBackup.create({
        data: {
            filename,
            size,
            type: request.payload?.type || 'MANUAL',
            status: 'COMPLETED',
            storageUrl: `/uploads/backups/${filename}`,
            completedAt: new Date()
        }
    })

    return h.response(backup).code(201)
}

export const downloadBackup = async (request, h) => {
    const fs = await import('fs')
    const path = await import('path')
    const { id } = request.params

    const backup = await prisma.dataBackup.findUnique({ where: { id } })
    if (!backup) throw Boom.notFound('Backup tidak ditemukan')

    const filepath = path.resolve(process.cwd(), 'uploads', 'backups', backup.filename)
    if (!fs.existsSync(filepath)) {
        // Return JSON directly if file missing
        return h.response({ message: 'File backup lama telah diarsipkan', backup })
    }

    const fileBuffer = fs.readFileSync(filepath)
    return h.response(fileBuffer)
        .header('Content-Type', 'application/json')
        .header('Content-Disposition', `attachment; filename="${backup.filename}"`)
}

export const deleteBackup = async (request, h) => {
    const fs = await import('fs')
    const path = await import('path')
    const { id } = request.params

    const backup = await prisma.dataBackup.findUnique({ where: { id } })
    if (backup) {
        const filepath = path.resolve(process.cwd(), 'uploads', 'backups', backup.filename)
        if (fs.existsSync(filepath)) {
            try { fs.unlinkSync(filepath) } catch (e) { /* ignore */ }
        }
        await prisma.dataBackup.delete({ where: { id } })
    }

    return { success: true, message: 'Backup berhasil dihapus' }
}

export const restoreBackup = async (request, h) => {
    const { backupData } = request.payload
    if (!backupData || !backupData.data) {
        throw Boom.badRequest('Format data backup tidak valid')
    }

    const { school, systemConfigs } = backupData.data

    if (school) {
        const existing = await prisma.school.findFirst()
        if (existing) {
            await prisma.school.update({ where: { id: existing.id }, data: school })
        }
    }

    if (Array.isArray(systemConfigs)) {
        for (const cfg of systemConfigs) {
            await prisma.systemConfig.upsert({
                where: { key: cfg.key },
                update: { value: cfg.value },
                create: { key: cfg.key, value: cfg.value }
            })
        }
    }

    return { success: true, message: 'Data konfigurasi berhasil dipulihkan dari backup' }
}

// Current user
export const getCurrentUser = async (request, h) => {
    const session = await getSession(request)
    if (!session) throw Boom.unauthorized('Not authenticated')
    return session.user
}

// School Profile
export const getSchoolProfile = async (request, h) => {
    const school = await prisma.school.findFirst()
    if (!school) {
        // Return default values if no school configured
        return {
            id: null,
            name: '',
            address: '',
            phone: '',
            email: '',
            website: '',
            latitude: null,
            longitude: null
        }
    }
    return school
}

export const updateSchoolProfile = async (request, h) => {
    // Find existing school or create new one
    const existingSchool = await prisma.school.findFirst()

    if (existingSchool) {
        return prisma.school.update({
            where: { id: existingSchool.id },
            data: request.payload
        })
    } else {
        return prisma.school.create({
            data: request.payload
        })
    }
}
