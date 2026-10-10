import Boom from '@hapi/boom'
import { prisma } from '../plugins/prisma.js'

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

const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
}

const ensureUniqueSlug = async (baseSlug, excludeId = null) => {
    let slug = baseSlug || 'artikel'
    let counter = 1
    while (true) {
        const candidate = counter === 1 ? slug : `${slug}-${counter}`
        const existing = await prisma.article.findUnique({
            where: { slug: candidate }
        })
        if (!existing || (excludeId && existing.id === excludeId)) {
            return candidate
        }
        counter++
    }
}

export const listArticles = async (request, h) => {
    const { search, category, status, page = 1, limit = 10 } = request.query
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10)
    const take = parseInt(limit, 10)

    const where = {}
    if (category && category !== 'ALL') {
        where.category = category
    }
    if (status && status !== 'ALL') {
        where.status = status
    }
    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { excerpt: { contains: search, mode: 'insensitive' } },
            { authorName: { contains: search, mode: 'insensitive' } }
        ]
    }

    const [articles, total] = await Promise.all([
        prisma.article.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take
        }),
        prisma.article.count({ where })
    ])

    return {
        data: articles,
        meta: {
            page: parseInt(page, 10),
            limit: take,
            total,
            totalPages: Math.ceil(total / take)
        }
    }
}

export const getArticleStats = async (request, h) => {
    const [total, published, draft, archived, totalViews] = await Promise.all([
        prisma.article.count(),
        prisma.article.count({ where: { status: 'PUBLISHED' } }),
        prisma.article.count({ where: { status: 'DRAFT' } }),
        prisma.article.count({ where: { status: 'ARCHIVED' } }),
        prisma.article.aggregate({ _sum: { views: true } })
    ])

    return {
        total,
        published,
        draft,
        archived,
        totalViews: totalViews._sum.views || 0
    }
}

export const getArticle = async (request, h) => {
    const { id } = request.params
    const article = await prisma.article.findUnique({
        where: { id }
    })
    if (!article) throw Boom.notFound('Artikel tidak ditemukan')
    return article
}

export const createArticle = async (request, h) => {
    const school = await getOrCreateSchool()
    const { title, excerpt, content, coverImage, category, authorName, status } = request.payload

    const rawSlug = slugify(title)
    const slug = await ensureUniqueSlug(rawSlug)

    const article = await prisma.article.create({
        data: {
            schoolId: school.id,
            title,
            slug,
            excerpt: excerpt || title.substring(0, 160),
            content,
            coverImage: coverImage || null,
            category: category || 'Berita Sekolah',
            authorName: authorName || 'Tim Redaksi',
            status: status || 'PUBLISHED',
            publishedAt: (status === 'PUBLISHED' || !status) ? new Date() : null
        }
    })

    return h.response(article).code(201)
}

export const updateArticle = async (request, h) => {
    const { id } = request.params
    const existing = await prisma.article.findUnique({ where: { id } })
    if (!existing) throw Boom.notFound('Artikel tidak ditemukan')

    const { title, excerpt, content, coverImage, category, authorName, status } = request.payload

    const data = {}
    if (title !== undefined) {
        data.title = title
        if (title !== existing.title) {
            data.slug = await ensureUniqueSlug(slugify(title), id)
        }
    }
    if (excerpt !== undefined) data.excerpt = excerpt
    if (content !== undefined) data.content = content
    if (coverImage !== undefined) data.coverImage = coverImage
    if (category !== undefined) data.category = category
    if (authorName !== undefined) data.authorName = authorName
    if (status !== undefined) {
        data.status = status
        if (status === 'PUBLISHED' && !existing.publishedAt) {
            data.publishedAt = new Date()
        }
    }

    const updated = await prisma.article.update({
        where: { id },
        data
    })

    return updated
}

export const deleteArticle = async (request, h) => {
    const { id } = request.params
    const existing = await prisma.article.findUnique({ where: { id } })
    if (!existing) throw Boom.notFound('Artikel tidak ditemukan')

    await prisma.article.delete({ where: { id } })
    return { success: true, message: 'Artikel berhasil dihapus' }
}

// Public endpoints
export const listPublicArticles = async (request, h) => {
    const { search, category, page = 1, limit = 9 } = request.query
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10)
    const take = parseInt(limit, 10)

    const where = {
        status: 'PUBLISHED'
    }

    if (category && category !== 'ALL') {
        where.category = category
    }

    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { excerpt: { contains: search, mode: 'insensitive' } }
        ]
    }

    const [articles, total, categoriesGroup] = await Promise.all([
        prisma.article.findMany({
            where,
            orderBy: { publishedAt: 'desc' },
            skip,
            take,
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
            }
        }),
        prisma.article.count({ where }),
        prisma.article.groupBy({
            by: ['category'],
            where: { status: 'PUBLISHED' },
            _count: { _all: true }
        })
    ])

    return {
        data: articles,
        meta: {
            page: parseInt(page, 10),
            limit: take,
            total,
            totalPages: Math.ceil(total / take)
        },
        categories: categoriesGroup.map(c => ({ name: c.category, count: c._count._all }))
    }
}

export const getPublicArticleBySlug = async (request, h) => {
    const { slug } = request.params
    const { countView } = request.query || {}

    const article = await prisma.article.findUnique({
        where: { slug }
    })

    if (!article || article.status !== 'PUBLISHED') {
        throw Boom.notFound('Artikel tidak ditemukan atau belum dipublikasikan')
    }

    let currentViews = article.views

    // Increment views only when countView === 'true'
    // Frontend triggers this when user hasn't read this in the 24h window
    if (countView === 'true' || countView === '1') {
        const updated = await prisma.article.update({
            where: { id: article.id },
            data: { views: { increment: 1 } }
        })
        currentViews = updated.views
    }

    // Fetch related articles
    const related = await prisma.article.findMany({
        where: {
            status: 'PUBLISHED',
            id: { not: article.id },
            category: article.category
        },
        take: 3,
        orderBy: { publishedAt: 'desc' },
        select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            coverImage: true,
            category: true,
            publishedAt: true,
            views: true
        }
    })

    return {
        article: {
            ...article,
            views: currentViews
        },
        related
    }
}
