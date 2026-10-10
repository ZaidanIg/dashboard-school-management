/**
 * Cookie Consent & Article View Tracking Utility
 * Manages user cookie consent and prevents duplicate view counts within a 24-hour window.
 */

const CONSENT_COOKIE_KEY = 'school_cookie_consent'
const VIEWED_ARTICLES_COOKIE_KEY = 'school_viewed_articles'
const EXPIRY_HOURS = 24

// Helper: read a cookie by name
export function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null
    const matches = document.cookie.match(
        new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
    )
    return matches ? decodeURIComponent(matches[1]) : null
}

// Helper: set a cookie with expiry in days
export function setCookie(name: string, value: string, days: number = 365) {
    if (typeof document === 'undefined') return
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/; SameSite=Lax`
}

// Get user consent status: 'accepted' | 'declined' | null
export function getCookieConsent(): 'accepted' | 'declined' | null {
    const fromCookie = getCookie(CONSENT_COOKIE_KEY)
    if (fromCookie === 'accepted' || fromCookie === 'declined') return fromCookie

    // Fallback to localStorage if cookie was cleared
    if (typeof localStorage !== 'undefined') {
        const fromStorage = localStorage.getItem(CONSENT_COOKIE_KEY)
        if (fromStorage === 'accepted' || fromStorage === 'declined') return fromStorage as 'accepted' | 'declined'
    }

    return null
}

// Set user consent status
export function setCookieConsent(status: 'accepted' | 'declined') {
    setCookie(CONSENT_COOKIE_KEY, status, 365)
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem(CONSENT_COOKIE_KEY, status)
    }

    // If declined, remove tracking cookies
    if (status === 'declined') {
        document.cookie = `${VIEWED_ARTICLES_COOKIE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(VIEWED_ARTICLES_COOKIE_KEY)
        }
    }
}

// Check if article has already been viewed in the last 24h
export function hasViewedArticle(slug: string): boolean {
    const consent = getCookieConsent()
    if (consent !== 'accepted') return false // If not accepted, no cookie tracking

    try {
        const raw = getCookie(VIEWED_ARTICLES_COOKIE_KEY) || (typeof localStorage !== 'undefined' ? localStorage.getItem(VIEWED_ARTICLES_COOKIE_KEY) : null)
        if (!raw) return false

        const parsed: Record<string, number> = JSON.parse(raw)
        const timestamp = parsed[slug]
        if (!timestamp) return false

        // Check if within 24 hours
        const now = Date.now()
        const diffHours = (now - timestamp) / (1000 * 60 * 60)
        return diffHours < EXPIRY_HOURS
    } catch {
        return false
    }
}

// Record that this article has been viewed
export function markArticleViewed(slug: string) {
    const consent = getCookieConsent()
    if (consent !== 'accepted') return

    try {
        const raw = getCookie(VIEWED_ARTICLES_COOKIE_KEY) || (typeof localStorage !== 'undefined' ? localStorage.getItem(VIEWED_ARTICLES_COOKIE_KEY) : null)
        const records: Record<string, number> = raw ? JSON.parse(raw) : {}

        // Clean up expired entries (>24h)
        const now = Date.now()
        Object.keys(records).forEach((key) => {
            if ((now - records[key]) / (1000 * 60 * 60) >= EXPIRY_HOURS) {
                delete records[key]
            }
        })

        records[slug] = now
        const serialized = JSON.stringify(records)

        // Save in cookie (1 day) & localStorage
        setCookie(VIEWED_ARTICLES_COOKIE_KEY, serialized, 1)
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(VIEWED_ARTICLES_COOKIE_KEY, serialized)
        }
    } catch (e) {
        console.error('Failed to save viewed article cookie:', e)
    }
}
