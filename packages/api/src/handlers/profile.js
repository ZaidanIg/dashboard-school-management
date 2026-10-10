import Boom from '@hapi/boom'
import { prisma } from '../plugins/prisma.js'

// Helper: Get or create default school
const getOrCreateSchool = async () => {
    let school = await prisma.school.findFirst()
    if (!school) {
        school = await prisma.school.create({
            data: {
                name: 'SMA Negeri 1 Jakarta',
                npsn: '20101234',
                educationType: 'SMA',
                status: 'NEGERI',
                accreditation: 'A',
                accreditationYear: 2023,
                curriculum: 'Kurikulum Merdeka'
            }
        })
    }
    return school
}

// ============================================
// SCHOOL PROFILE & LIVE STATS
// ============================================

export const getSchool = async (request, h) => {
    const school = await prisma.school.findFirst({
        include: {
            facilities: true,
            structures: {
                orderBy: [{ category: 'asc' }, { order: 'asc' }]
            },
            _count: { select: { gallery: true, achievements: true, organizations: true } }
        }
    })
    if (!school) throw Boom.notFound('School profile not found')
    return school
}

export const updateSchool = async (request, h) => {
    const existing = await prisma.school.findFirst()

    if (existing) {
        return prisma.school.update({
            where: { id: existing.id },
            data: request.payload
        })
    }

    const school = await prisma.school.create({ data: request.payload })
    return h.response(school).code(201)
}

export const getSchoolStats = async (request, h) => {
    const school = await getOrCreateSchool()

    const [
        totalStudents,
        totalTeachers,
        totalClasses,
        totalAchievements,
        totalFacilities,
        facilitiesAgg,
        totalOrganizations
    ] = await Promise.all([
        prisma.student.count({ where: { status: 'ACTIVE', deletedAt: null } }),
        prisma.teacher.count({ where: { status: 'ACTIVE' } }),
        prisma.class.count(),
        prisma.achievement.count({ where: { schoolId: school.id } }),
        prisma.facility.count({ where: { schoolId: school.id } }),
        prisma.facility.aggregate({
            _sum: { quantity: true },
            where: {
                schoolId: school.id,
                category: { contains: 'Kelas', mode: 'insensitive' }
            }
        }),
        prisma.studentOrganization.count({ where: { schoolId: school.id } })
    ])

    const totalClassrooms = facilitiesAgg._sum.quantity || totalClasses || 0

    return {
        totalStudents,
        totalTeachers,
        totalClasses,
        totalClassrooms,
        totalAchievements,
        totalFacilities,
        totalOrganizations,
        school: {
            id: school.id,
            name: school.name,
            npsn: school.npsn,
            accreditation: school.accreditation || 'A',
            accreditationYear: school.accreditationYear,
            curriculum: school.curriculum || 'Kurikulum Merdeka',
            status: school.status
        }
    }
}

// ============================================
// SCHOOL STRUCTURE (Pimpinan, Kaprodi, Komite)
// ============================================

export const listStructures = async (request, h) => {
    const { category } = request.query
    const school = await getOrCreateSchool()

    const where = { schoolId: school.id }
    if (category) where.category = category

    return prisma.schoolStructure.findMany({
        where,
        include: {
            teacher: { select: { id: true, name: true, nip: true, photo: true } }
        },
        orderBy: [{ category: 'asc' }, { order: 'asc' }, { createdAt: 'asc' }]
    })
}

export const createStructure = async (request, h) => {
    const school = await getOrCreateSchool()
    const structure = await prisma.schoolStructure.create({
        data: {
            ...request.payload,
            schoolId: school.id
        },
        include: {
            teacher: { select: { id: true, name: true, nip: true, photo: true } }
        }
    })
    return h.response(structure).code(201)
}

export const updateStructure = async (request, h) => {
    const { id } = request.params
    const updated = await prisma.schoolStructure.update({
        where: { id },
        data: request.payload,
        include: {
            teacher: { select: { id: true, name: true, nip: true, photo: true } }
        }
    })
    return updated
}

export const deleteStructure = async (request, h) => {
    const { id } = request.params
    await prisma.schoolStructure.delete({ where: { id } })
    return { success: true, message: 'Struktur organisasi berhasil dihapus' }
}

// ============================================
// FACILITIES
// ============================================

export const listFacilities = async (request, h) => {
    const school = await getOrCreateSchool()
    return prisma.facility.findMany({
        where: { schoolId: school.id },
        orderBy: [{ category: 'asc' }, { name: 'asc' }]
    })
}

export const createFacility = async (request, h) => {
    const school = await getOrCreateSchool()
    const facility = await prisma.facility.create({
        data: {
            ...request.payload,
            schoolId: school.id
        }
    })
    return h.response(facility).code(201)
}

export const updateFacility = async (request, h) => {
    const { id } = request.params
    const facility = await prisma.facility.update({
        where: { id },
        data: request.payload
    })
    return facility
}

export const deleteFacility = async (request, h) => {
    const { id } = request.params
    await prisma.facility.delete({ where: { id } })
    return { success: true, message: 'Fasilitas berhasil dihapus' }
}

// ============================================
// GALLERY
// ============================================

export const listGallery = async (request, h) => {
    const { category } = request.query
    const school = await getOrCreateSchool()

    const where = { schoolId: school.id }
    if (category) where.category = category

    return prisma.galleryItem.findMany({ where, orderBy: { createdAt: 'desc' } })
}

export const createGalleryItem = async (request, h) => {
    const school = await getOrCreateSchool()
    const item = await prisma.galleryItem.create({
        data: {
            ...request.payload,
            schoolId: school.id
        }
    })
    return h.response(item).code(201)
}

export const updateGalleryItem = async (request, h) => {
    const { id } = request.params
    const updated = await prisma.galleryItem.update({
        where: { id },
        data: request.payload
    })
    return updated
}

export const deleteGalleryItem = async (request, h) => {
    const { id } = request.params
    await prisma.galleryItem.delete({ where: { id } })
    return { success: true, message: 'Foto galeri berhasil dihapus' }
}

// ============================================
// ACHIEVEMENTS
// ============================================

export const listAchievements = async (request, h) => {
    const { category, level, year } = request.query
    const school = await getOrCreateSchool()

    const where = { schoolId: school.id }
    if (category) where.category = category
    if (level) where.level = level
    if (year) where.year = parseInt(year)

    return prisma.achievement.findMany({
        where,
        include: {
            student: { select: { id: true, name: true, nis: true } },
            teacher: { select: { id: true, name: true, nip: true } }
        },
        orderBy: [{ year: 'desc' }, { createdAt: 'desc' }]
    })
}

export const createAchievement = async (request, h) => {
    const school = await getOrCreateSchool()
    const achievement = await prisma.achievement.create({
        data: {
            ...request.payload,
            schoolId: school.id
        },
        include: {
            student: { select: { id: true, name: true, nis: true } },
            teacher: { select: { id: true, name: true, nip: true } }
        }
    })
    return h.response(achievement).code(201)
}

export const updateAchievement = async (request, h) => {
    const { id } = request.params
    const updated = await prisma.achievement.update({
        where: { id },
        data: request.payload,
        include: {
            student: { select: { id: true, name: true, nis: true } },
            teacher: { select: { id: true, name: true, nip: true } }
        }
    })
    return updated
}

export const deleteAchievement = async (request, h) => {
    const { id } = request.params
    await prisma.achievement.delete({ where: { id } })
    return { success: true, message: 'Prestasi berhasil dihapus' }
}

// ============================================
// ORGANIZATIONS (OSIS, MPK, EKSTRAKURIKULER)
// ============================================

export const listOrganizations = async (request, h) => {
    const { type } = request.query
    const school = await getOrCreateSchool()

    const where = { schoolId: school.id }
    if (type) where.type = type

    return prisma.studentOrganization.findMany({
        where,
        include: {
            advisor: { select: { id: true, name: true, nip: true, phone: true } },
            members: {
                include: {
                    student: { select: { id: true, name: true, nis: true, photo: true } }
                },
                orderBy: [{ order: 'asc' }, { createdAt: 'asc' }]
            }
        },
        orderBy: { period: 'desc' }
    })
}

export const getOrganization = async (request, h) => {
    const { id } = request.params
    const org = await prisma.studentOrganization.findUnique({
        where: { id },
        include: {
            advisor: { select: { id: true, name: true, nip: true, phone: true } },
            members: {
                include: {
                    student: { select: { id: true, name: true, nis: true, photo: true } }
                },
                orderBy: [{ order: 'asc' }, { createdAt: 'asc' }]
            }
        }
    })
    if (!org) throw Boom.notFound('Organisasi tidak ditemukan')
    return org
}

export const upsertOrganization = async (request, h) => {
    const school = await getOrCreateSchool()
    const targetId = request.params?.id || request.payload?.id
    const { type, name, period, advisorId, vision, mission, programs } = request.payload || {}

    if (targetId) {
        return prisma.studentOrganization.update({
            where: { id: targetId },
            data: {
                ...(name && { name }),
                ...(type && { type }),
                ...(period && { period }),
                ...(advisorId !== undefined && { advisorId }),
                ...(vision !== undefined && { vision }),
                ...(mission !== undefined && { mission }),
                ...(programs !== undefined && { programs })
            },
            include: {
                advisor: { select: { id: true, name: true, nip: true, phone: true } },
                members: true
            }
        })
    }

    // Check if organization of same type & period exists
    const existing = await prisma.studentOrganization.findFirst({
        where: { schoolId: school.id, type, period }
    })

    if (existing) {
        return prisma.studentOrganization.update({
            where: { id: existing.id },
            data: {
                ...(name && { name }),
                ...(advisorId !== undefined && { advisorId }),
                ...(vision !== undefined && { vision }),
                ...(mission !== undefined && { mission }),
                ...(programs !== undefined && { programs })
            },
            include: {
                advisor: { select: { id: true, name: true, nip: true, phone: true } },
                members: true
            }
        })
    }

    const created = await prisma.studentOrganization.create({
        data: {
            schoolId: school.id,
            name: name || (type === 'OSIS' ? 'OSIS' : type === 'MPK' ? 'MPK' : 'Organisasi'),
            type,
            period: period || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
            advisorId,
            vision,
            mission: mission || [],
            programs: programs || []
        },
        include: {
            advisor: { select: { id: true, name: true, nip: true, phone: true } },
            members: true
        }
    })
    return h.response(created).code(201)
}

export const seedOrganization = async (request, h) => {
    const school = await getOrCreateSchool()
    const { type } = request.payload || {}
    if (!type || !['OSIS', 'MPK'].includes(type)) {
        throw Boom.badRequest('Tipe organisasi harus OSIS atau MPK')
    }

    const period = `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`
    const isOsis = type === 'OSIS'
    const name = isOsis ? 'OSIS SMA Negeri 1' : 'MPK SMA Negeri 1'
    const vision = isOsis
        ? 'Mewujudkan siswa yang bertaqwa, berkarakter unggul, kreatif, inovatif, dan berdaya saing global.'
        : 'Mewujudkan MPK yang berintegritas tinggi, aspiratif, transparan, dan menjunjung asas musyawarah mufakat demi kemajuan sekolah.'
    const mission = isOsis
        ? [
            'Mengembangkan keimanan dan ketaqwaan kepada Tuhan YME',
            'Mendorong prestasi akademik dan ekstrakurikuler',
            'Membangun komunikasi yang harmonis dan lingkungan sekolah yang inklusif'
        ]
        : [
            'Mengawasi pelaksanaan program kerja OSIS secara transparan',
            'Menampung dan memperjuangkan seluruh aspirasi siswa kepada pihak sekolah',
            'Memperkokoh koordinasi dan persatuan seluruh perwakilan kelas'
        ]
    const programs = isOsis
        ? [
            { id: '1', name: 'Latihan Dasar Kepemimpinan Siswa (LDKS)', status: 'completed' },
            { id: '2', name: 'Class Meeting & Pekan Olahraga Antar Kelas', status: 'completed' },
            { id: '3', name: 'Pentas Seni & Budaya Nusantara', status: 'upcoming' },
            { id: '4', name: 'Bakti Sosial & Peduli Lingkungan Hidup', status: 'upcoming' },
            { id: '5', name: 'Peringatan Hari Besar Nasional & Keagamaan', status: 'upcoming' }
        ]
        : [
            { id: '1', name: 'Rapat Pleno dan Musyawarah Perwakilan Kelas', status: 'completed' },
            { id: '2', name: 'Forum Dialog dan Penjaringan Aspirasi Siswa Terbuka', status: 'completed' },
            { id: '3', name: 'Evaluasi Kinerja dan Sidang Evaluasi Program OSIS', status: 'upcoming' },
            { id: '4', name: 'Sidang Paripurna Pengesahan Peraturan Siswa', status: 'upcoming' },
            { id: '5', name: 'Penyelenggaraan Pemilihan Umum OSIS (Pemilos)', status: 'upcoming' }
        ]

    const defaultMembers = isOsis
        ? [
            { name: 'M. Farhan Rizki', position: 'Ketua OSIS', className: '12 IPA 1', section: 'BPH', order: 1 },
            { name: 'Anisa Putri', position: 'Wakil Ketua', className: '12 IPS 1', section: 'BPH', order: 2 },
            { name: 'Dimas Pratama', position: 'Sekretaris 1', className: '11 IPA 2', section: 'BPH', order: 3 },
            { name: 'Rina Wulandari', position: 'Sekretaris 2', className: '11 IPS 1', section: 'BPH', order: 4 },
            { name: 'Ahmad Fauzi', position: 'Bendahara 1', className: '12 IPA 2', section: 'BPH', order: 5 },
            { name: 'Siti Nurhaliza', position: 'Bendahara 2', className: '11 IPA 1', section: 'BPH', order: 6 },
            { name: 'Fajar Hidayat', position: 'Koordinator', className: '11 IPA 3', section: 'Seksi Ketaqwaan', order: 7 },
            { name: 'Mega Sari', position: 'Koordinator', className: '11 IPS 2', section: 'Seksi Pendidikan', order: 8 },
            { name: 'Rizal Pratama', position: 'Koordinator', className: '11 IPA 1', section: 'Seksi Kesenian', order: 9 },
            { name: 'Doni Saputra', position: 'Koordinator', className: '11 IPS 3', section: 'Seksi Olahraga', order: 10 }
        ]
        : [
            { name: 'Raffi Ahmad', position: 'Ketua MPK', className: '12 IPA 1', section: 'Pimpinan Inti', order: 1 },
            { name: 'Nabila Putri', position: 'Wakil Ketua', className: '12 IPS 2', section: 'Pimpinan Inti', order: 2 },
            { name: 'Kevin Pratama', position: 'Sekretaris', className: '11 IPA 1', section: 'Pimpinan Inti', order: 3 },
            { name: 'Zahra Aulia', position: 'Bendahara', className: '11 IPA 2', section: 'Pimpinan Inti', order: 4 },
            { name: 'Bima Sakti', position: 'Ketua Komisi A', className: '11 IPS 1', section: 'Komisi A (Kebijakan)', order: 5 },
            { name: 'Dinda Permata', position: 'Ketua Komisi B', className: '11 IPA 3', section: 'Komisi B (Aspirasi)', order: 6 },
            { name: 'Aldo Pratama', position: 'Ketua Komisi C', className: '11 IPS 2', section: 'Komisi C (Pengawasan)', order: 7 }
        ]

    let org = await prisma.studentOrganization.findFirst({
        where: { schoolId: school.id, type }
    })

    if (org) {
        org = await prisma.studentOrganization.update({
            where: { id: org.id },
            data: {
                name,
                vision: org.vision || vision,
                mission: (org.mission && org.mission.length > 0) ? org.mission : mission,
                programs: org.programs || programs
            }
        })
    } else {
        org = await prisma.studentOrganization.create({
            data: {
                schoolId: school.id,
                name,
                type,
                period,
                vision,
                mission,
                programs
            }
        })
    }

    const existingCount = await prisma.orgMember.count({
        where: { organizationId: org.id }
    })

    if (existingCount === 0) {
        await prisma.orgMember.createMany({
            data: defaultMembers.map(m => ({
                organizationId: org.id,
                name: m.name,
                position: m.position,
                className: m.className,
                section: m.section,
                order: m.order
            }))
        })
    }

    const result = await prisma.studentOrganization.findUnique({
        where: { id: org.id },
        include: {
            advisor: { select: { id: true, name: true, nip: true, phone: true } },
            members: {
                orderBy: [{ order: 'asc' }, { createdAt: 'asc' }]
            }
        }
    })

    return h.response(result).code(201)
}

export const deleteOrganization = async (request, h) => {
    const { id } = request.params
    await prisma.studentOrganization.delete({ where: { id } })
    return { success: true, message: 'Organisasi berhasil dihapus' }
}

// Org Members CRUD
export const createOrgMember = async (request, h) => {
    const { organizationId, studentId, name, className, section, position, photo, order } = request.payload
    const member = await prisma.orgMember.create({
        data: {
            organizationId,
            studentId,
            name,
            className,
            section,
            position,
            photo,
            order: order ?? 0
        },
        include: {
            student: { select: { id: true, name: true, nis: true, photo: true } }
        }
    })
    return h.response(member).code(201)
}

export const updateOrgMember = async (request, h) => {
    const { id } = request.params
    const updated = await prisma.orgMember.update({
        where: { id },
        data: request.payload,
        include: {
            student: { select: { id: true, name: true, nis: true, photo: true } }
        }
    })
    return updated
}

export const deleteOrgMember = async (request, h) => {
    const { id } = request.params
    await prisma.orgMember.delete({ where: { id } })
    return { success: true, message: 'Anggota organisasi berhasil dihapus' }
}
