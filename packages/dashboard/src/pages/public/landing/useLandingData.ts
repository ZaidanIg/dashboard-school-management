import { useEffect, useMemo, useState } from 'react'
import { API_URL } from '../../../lib/api'

export type AchievementLevel = 'SEKOLAH' | 'KOTA' | 'PROVINSI' | 'NASIONAL' | 'INTERNASIONAL'

export interface PublicSchool {
    id: string
    npsn: string
    name: string
    status: 'NEGERI' | 'SWASTA'
    educationType: string
    accreditation?: string | null
    accreditationYear?: number | null
    foundedYear?: number | null
    curriculum?: string | null
    vision?: string | null
    mission: string[]
    address?: string | null
    city?: string | null
    province?: string | null
    postalCode?: string | null
    phone?: string | null
    email?: string | null
    website?: string | null
    latitude?: number | null
    longitude?: number | null
    logo?: string | null
    facilities: { id: string; name: string; category: string; quantity: number; description?: string | null }[]
}

export interface PublicArticle {
    id: string
    title: string
    slug: string
    excerpt: string
    coverImage?: string | null
    category: string
    authorName: string
    views: number
    publishedAt: string
    createdAt: string
}

export interface LandingData {
    school: PublicSchool | null
    stats: { students: number; teachers: number; extracurriculars: number; achievements: number }
    achievements: { id: string; title: string; category: string; level: AchievementLevel; year: number; description?: string | null; studentName: string | null }[]
    gallery: { id: string; title: string; category: string; imageUrl: string; date?: string | null }[]
    extracurriculars: { id: string; name: string; category: string; schedule?: string | null; description?: string | null }[]
    announcements: { id: string; title: string; content: string; category?: string | null; isPinned: boolean; publishedAt: string }[]
    structures?: { id: string; name: string; position: string; category: string; department?: string; photo?: string; greeting?: string; order: number }[]
    facilities?: { id: string; name: string; category: string; quantity: number; condition: string; description?: string }[]
    organizations?: { id: string; name: string; type: string; period: string; vision?: string; mission: string[]; programs?: any; _count?: { members: number } }[]
    articles?: PublicArticle[]
    trendingArticles?: PublicArticle[]
}

export interface PpdbConfig {
    isOpen: boolean
    name?: string
    academicYear?: string
    description?: string | null
    endDate?: string
    message?: string
    nextBatch?: { name: string; startDate: string } | null
}

/**
 * Fetches public landing data with plain `fetch` (not the shared api client)
 * so anonymous visitors never trigger the global "unauthorized" toast.
 */
export function useLandingData() {
    const [data, setData] = useState<LandingData | null>(null)
    const [ppdb, setPpdb] = useState<PpdbConfig | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const controller = new AbortController()
        const load = async () => {
            const get = async <T,>(path: string): Promise<T | null> => {
                try {
                    const res = await fetch(`${API_URL}${path}`, { signal: controller.signal })
                    return res.ok ? ((await res.json()) as T) : null
                } catch {
                    return null
                }
            }
            const [landing, config] = await Promise.all([
                get<LandingData>('/public/landing'),
                get<PpdbConfig>('/public/ppdb/config'),
            ])
            if (controller.signal.aborted) return
            setData(landing)
            setPpdb(config)
            setLoading(false)
        }
        load()
        return () => controller.abort()
    }, [])

    return { data, ppdb, loading }
}

/** Countdown that only re-subscribes when the target timestamp actually changes. */
export function useCountdown(target?: string) {
    const targetMs = useMemo(() => (target ? new Date(target).getTime() : 0), [target])
    const [now, setNow] = useState(() => Date.now())

    useEffect(() => {
        if (!targetMs) return
        const id = window.setInterval(() => setNow(Date.now()), 1000)
        return () => window.clearInterval(id)
    }, [targetMs])

    const distance = Math.max(0, targetMs - now)
    return {
        days: Math.floor(distance / 86_400_000),
        hours: Math.floor((distance % 86_400_000) / 3_600_000),
        minutes: Math.floor((distance % 3_600_000) / 60_000),
        seconds: Math.floor((distance % 60_000) / 1000),
        finished: !!targetMs && distance === 0,
    }
}

/** Tracks which section is currently in view for nav highlighting. */
export function useScrollSpy(ids: readonly string[]) {
    const [active, setActive] = useState<string>('')

    useEffect(() => {
        const elements = ids
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => !!el)
        if (!elements.length) return

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
                if (visible[0]) setActive(visible[0].target.id)
            },
            { rootMargin: '-35% 0px -55% 0px' }
        )
        elements.forEach((el) => observer.observe(el))
        return () => observer.disconnect()
    }, [ids])

    return active
}

export function resolveAssetUrl(url?: string | null) {
    if (!url) return ''
    if (/^(https?:)?\/\//.test(url) || url.startsWith('/images/')) return url
    return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`
}

export function stripHtml(html: string) {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return (doc.body.textContent || '').replace(/\s+/g, ' ').trim()
}

export function toTelHref(phone?: string | null) {
    if (!phone) return undefined
    return `tel:${phone.replace(/[^\d+]/g, '')}`
}
