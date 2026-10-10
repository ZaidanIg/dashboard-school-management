import { prisma } from '../plugins/prisma.js'

// Audience tags that are considered safe to show on the public website
const PUBLIC_AUDIENCE = ['ALL', 'PUBLIC', 'UMUM', 'all', 'public', 'umum']

/**
 * PUBLIC: Aggregated data for the landing page.
 * Only exposes non-sensitive information (no personal contact data of students/teachers).
 */
export const getLandingData = async () => {
    const now = new Date()
    const school = await prisma.school.findFirst({
        select: {
            id: true,
            npsn: true,
            name: true,
            status: true,
            educationType: true,
            accreditation: true,
            accreditationYear: true,
            foundedYear: true,
            curriculum: true,
            vision: true,
            mission: true,
            address: true,
            city: true,
            province: true,
            postalCode: true,
            phone: true,
            email: true,
            website: true,
            latitude: true,
            longitude: true,
            logo: true,
            facilities: {
                select: { id: true, name: true, category: true, quantity: true, description: true },
                orderBy: { category: 'asc' }
            }
        }
    })

    const schoolFilter = school ? { schoolId: school.id } : { schoolId: '__none__' }

    const [
        studentCount,
        teacherCount,
        extracurricularCount,
        achievementCount,
        achievements,
        gallery,
        extracurriculars,
        announcements,
        structures,
        facilities,
        organizations,
        articles,
        trendingArticles
    ] = await Promise.all([
        prisma.student.count({ where: { status: 'ACTIVE', deletedAt: null } }),
        prisma.teacher.count({ where: { status: 'ACTIVE' } }),
        prisma.extracurricular.count({ where: { isActive: true } }),
        prisma.achievement.count({ where: schoolFilter }),
        prisma.achievement.findMany({
            where: schoolFilter,
            select: {
                id: true,
                title: true,
                category: true,
                level: true,
                year: true,
                description: true,
                student: { select: { name: true } }
            },
            orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
            take: 6
        }),
        prisma.galleryItem.findMany({
            where: schoolFilter,
            select: { id: true, title: true, category: true, imageUrl: true, date: true },
            orderBy: { createdAt: 'desc' },
            take: 8
        }),
        prisma.extracurricular.findMany({
            where: { isActive: true },
            select: { id: true, name: true, category: true, schedule: true, description: true },
            orderBy: { name: 'asc' },
            take: 16
        }),
        prisma.announcement.findMany({
            where: {
                publishedAt: { lte: now },
                AND: [
                    { OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] },
                    { OR: [{ targetAudience: { isEmpty: true } }, { targetAudience: { hasSome: PUBLIC_AUDIENCE } }] }
                ]
            },
            select: { id: true, title: true, content: true, category: true, isPinned: true, publishedAt: true },
            orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }],
            take: 3
        }),
        prisma.schoolStructure.findMany({
            where: schoolFilter,
            select: {
                id: true,
                name: true,
                position: true,
                category: true,
                department: true,
                photo: true,
                greeting: true,
                order: true,
                teacher: { select: { photo: true } }
            },
            orderBy: [{ category: 'asc' }, { order: 'asc' }, { createdAt: 'asc' }]
        }),
        prisma.facility.findMany({
            where: schoolFilter,
            select: {
                id: true,
                name: true,
                category: true,
                quantity: true,
                condition: true,
                description: true
            },
            orderBy: [{ category: 'asc' }, { name: 'asc' }]
        }),
        prisma.studentOrganization.findMany({
            where: schoolFilter,
            select: {
                id: true,
                name: true,
                type: true,
                period: true,
                vision: true,
                mission: true,
                programs: true,
                _count: { select: { members: true } }
            },
            orderBy: { period: 'desc' }
        }),
        prisma.article.findMany({
            where: { status: 'PUBLISHED' },
            select: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                coverImage: true,
                category: true,
                authorName: true,
                views: true,
                publishedAt: true,
                createdAt: true
            },
            orderBy: { publishedAt: 'desc' },
            take: 6
        }),
        prisma.article.findMany({
            where: { status: 'PUBLISHED' },
            select: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                coverImage: true,
                category: true,
                authorName: true,
                views: true,
                publishedAt: true,
                createdAt: true
            },
            orderBy: { views: 'desc' },
            take: 5
        })
    ])

    return {
        school,
        stats: {
            students: studentCount,
            teachers: teacherCount,
            extracurriculars: extracurricularCount,
            achievements: achievementCount
        },
        achievements: achievements.map(({ student, ...rest }) => ({ ...rest, studentName: student?.name || null })),
        gallery,
        extracurriculars,
        announcements,
        structures: structures.map(({ teacher, ...s }) => ({
            ...s,
            photo: s.photo || teacher?.photo || null
        })),
        facilities,
        organizations,
        articles,
        trendingArticles
    }
}
