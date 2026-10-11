import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronRight, Clock, GraduationCap, Mail, Menu, Phone, X, LogOut, LayoutDashboard } from 'lucide-react'
import { navItems } from './content'
import { Container } from './ui'
import { resolveAssetUrl, toTelHref, type PublicSchool } from './useLandingData'
import { useAuthContext } from '@/contexts/AuthContext'

interface HeaderProps {
    school: PublicSchool | null
    schoolName: string
    activeId: string
    ppdbOpen: boolean
    onNavigate: (href: string) => void
}

export function SchoolMark({ school, size = 'md' }: { school: PublicSchool | null; size?: 'md' | 'lg' }) {
    const box = size === 'lg' ? 'h-10 w-10 sm:h-11 sm:w-11' : 'h-9 w-9 sm:h-10 sm:w-10'
    if (school?.logo) {
        return <img src={resolveAssetUrl(school.logo)} alt={`Logo ${school.name}`} className={`${box} rounded-xl object-contain bg-white border border-slate-100 p-0.5 shrink-0`} />
    }
    return (
        <span className={`${box} grid place-items-center rounded-xl bg-blue-600 text-white shadow-xs shrink-0`} aria-hidden="true">
            <GraduationCap size={size === 'lg' ? 22 : 18} />
        </span>
    )
}

const primaryNavItems = [
    { label: 'Profil', href: '#profil' },
    { label: 'Akademik', href: '#akademik' },
    { label: 'Fasilitas', href: '#fasilitas' },
    { label: 'Prestasi', href: '#prestasi' },
    { label: 'Berita', href: '#berita' },
    { label: 'Kontak', href: '#kontak' },
]

const moreNavItems = [
    { label: 'Struktur Organisasi', href: '#struktur' },
    { label: 'Ekstrakurikuler', href: '#organisasi' },
    { label: 'Galeri Sekolah', href: '#galeri' },
]

export function Header({ school, schoolName, activeId, ppdbOpen, onNavigate }: HeaderProps) {
    const { isAuthenticated, user, logout } = useAuthContext()

    const roleLabels: Record<string, string> = {
        SUPER_ADMIN: 'Super Admin',
        ADMIN: 'Admin',
        PRINCIPAL: 'Kepala Sekolah',
        TEACHER: 'Guru',
        STAFF: 'Staf',
        STUDENT: 'Siswa',
        PARENT: 'Orang Tua',
    }

    const getPortalInfo = () => {
        if (!user) return null
        if (user.role === 'STUDENT') return { path: '/student-portal', label: 'Portal Siswa' }
        if (user.role === 'TEACHER') return { path: '/teacher-portal', label: 'Portal Guru' }
        if (user.role === 'STAFF') return { path: '/staff-portal', label: 'Portal Staf' }
        if (user.role === 'SUPER_ADMIN' || user.role === 'PRINCIPAL' || (user.role as string) === 'ADMIN') {
            return { path: '/dashboard', label: 'Dashboard' }
        }
        return null
    }

    const portal = getPortalInfo()
    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [moreOpen, setMoreOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)

    const moreRef = useRef<HTMLDivElement>(null)
    const userMenuRef = useRef<HTMLDivElement>(null)

    // Check if any item in the "Lainnya" dropdown is active
    const isMoreActive = moreNavItems.some((item) => activeId === item.href.slice(1))

    useEffect(() => {
        const handleOutside = (e: MouseEvent) => {
            if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
                setMoreOpen(false)
            }
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleOutside)
        return () => document.removeEventListener('mousedown', handleOutside)
    }, [])

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        if (!open) return
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
        window.addEventListener('keydown', onKey)
        return () => {
            document.body.style.overflow = prev
            window.removeEventListener('keydown', onKey)
        }
    }, [open])

    const go = (href: string) => {
        setOpen(false)
        setMoreOpen(false)
        onNavigate(href)
    }

    const subtitle = [school?.npsn && `NPSN ${school.npsn}`, school?.accreditation && `Akreditasi ${school.accreditation}`]
        .filter(Boolean)
        .join(' · ')

    return (
        <>
            {/* Top Utility Bar */}
            <div className="hidden lg:block bg-slate-900 text-slate-300 text-xs border-b border-slate-800">
                <Container className="flex h-9 items-center justify-between">
                    <div className="flex items-center gap-4 xl:gap-6 text-[11px] xl:text-xs">
                        {school?.phone && (
                            <a href={toTelHref(school.phone)} className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                                <Phone size={12} className="text-blue-400" /> {school.phone}
                            </a>
                        )}
                        {school?.email && (
                            <a href={`mailto:${school.email}`} className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                                <Mail size={12} className="text-blue-400" /> {school.email}
                            </a>
                        )}
                        <span className="inline-flex items-center gap-1.5 text-slate-400">
                            <Clock size={12} className="text-blue-400" /> Senin – Jumat, 07.00 – 15.00 WIB
                        </span>
                    </div>
                    <nav aria-label="Portal Akses Cepat" className="flex items-center divide-x divide-slate-700 text-[11px] xl:text-xs text-slate-300">
                        {['Portal Siswa', 'Portal Guru', 'Portal Staff'].map((label) => (
                            <Link key={label} to="/login" className="px-3 last:pr-0 hover:text-white transition-colors">
                                {label}
                            </Link>
                        ))}
                    </nav>
                </Container>
            </div>

            {/* Main Sticky Navbar */}
            <header
                className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b transition-all duration-300 ${
                    scrolled ? 'border-slate-200/90 shadow-md shadow-slate-900/5' : 'border-slate-100'
                }`}
            >
                <Container className="flex h-16 lg:h-18 items-center justify-between gap-3 xl:gap-4">
                    {/* Brand Logo & Name */}
                    <a
                        href="#beranda"
                        onClick={(e) => { e.preventDefault(); go('#beranda') }}
                        className="flex min-w-0 items-center gap-2.5 sm:gap-3 group shrink-0"
                    >
                        <SchoolMark school={school} />
                        <span className="min-w-0 max-w-[170px] sm:max-w-[220px] xl:max-w-xs">
                            <span className="block truncate font-heading text-sm sm:text-base xl:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                                {schoolName}
                            </span>
                            {subtitle && (
                                <span className="hidden xl:block truncate text-[11px] text-slate-500 font-medium mt-0.5">
                                    {subtitle}
                                </span>
                            )}
                        </span>
                    </a>

                    {/* Desktop Navigation (Clean & Compact) */}
                    <nav aria-label="Navigasi utama" className="hidden lg:flex items-center gap-0.5 xl:gap-1">
                        {primaryNavItems.map((item) => {
                            const active = activeId === item.href.slice(1)
                            return (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    onClick={(e) => { e.preventDefault(); go(item.href) }}
                                    aria-current={active ? 'true' : undefined}
                                    className={`relative rounded-lg px-2.5 xl:px-3 py-1.5 xl:py-2 text-xs xl:text-sm font-semibold transition-all ${
                                        active ? 'text-blue-600 bg-blue-50/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                                >
                                    {item.label}
                                    <span
                                        className={`absolute inset-x-2.5 xl:inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-blue-600 transition-transform duration-300 origin-left ${
                                            active ? 'scale-x-100' : 'scale-x-0'
                                        }`}
                                        aria-hidden="true"
                                    />
                                </a>
                            )
                        })}

                        {/* "Lainnya" Dropdown */}
                        <div className="relative" ref={moreRef}>
                            <button
                                type="button"
                                onClick={() => setMoreOpen((v) => !v)}
                                aria-expanded={moreOpen}
                                className={`relative inline-flex items-center gap-1 rounded-lg px-2.5 xl:px-3 py-1.5 xl:py-2 text-xs xl:text-sm font-semibold transition-all ${
                                    isMoreActive ? 'text-blue-600 bg-blue-50/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                            >
                                <span>Lainnya</span>
                                <ChevronDown size={13} className={`transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} />
                                <span
                                    className={`absolute inset-x-2.5 xl:inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-blue-600 transition-transform duration-300 origin-left ${
                                        isMoreActive ? 'scale-x-100' : 'scale-x-0'
                                    }`}
                                    aria-hidden="true"
                                />
                            </button>
                            <AnimatePresence>
                                {moreOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute left-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 z-50"
                                    >
                                        {moreNavItems.map((item) => {
                                            const active = activeId === item.href.slice(1)
                                            return (
                                                <a
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        go(item.href)
                                                    }}
                                                    className={`block rounded-lg px-3 py-2 text-xs xl:text-sm font-semibold transition-colors ${
                                                        active ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                                                    }`}
                                                >
                                                    {item.label}
                                                </a>
                                            )
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </nav>

                    {/* Action Buttons (Symmetrical & Clean) */}
                    <div className="flex items-center gap-2 sm:gap-2.5">
                        {isAuthenticated && user ? (
                            <>
                                {portal && (
                                    <Link
                                        to={portal.path}
                                        className="hidden lg:inline-flex h-9 xl:h-10 items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50/80 px-3.5 xl:px-4 text-xs xl:text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors shadow-2xs whitespace-nowrap"
                                    >
                                        <LayoutDashboard size={15} />
                                        <span>{portal.label}</span>
                                    </Link>
                                )}

                                {/* User Menu Dropdown */}
                                <div className="relative hidden sm:block" ref={userMenuRef}>
                                    <button
                                        type="button"
                                        onClick={() => setUserMenuOpen((v) => !v)}
                                        className="inline-flex h-9 xl:h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white pl-2 pr-2.5 xl:pr-3 text-xs xl:text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs"
                                        aria-expanded={userMenuOpen}
                                    >
                                        <span className="grid h-6 w-6 place-items-center rounded-md bg-blue-600 text-[11px] font-bold text-white uppercase shrink-0">
                                            {user.name ? user.name.charAt(0) : 'U'}
                                        </span>
                                        <span className="max-w-[70px] xl:max-w-[100px] truncate text-slate-800">
                                            {user.name.split(' ')[0]}
                                        </span>
                                        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 shrink-0 ${userMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {userMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 z-50"
                                            >
                                                <div className="p-2.5 bg-slate-50 rounded-lg mb-1.5 border border-slate-100">
                                                    <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                                                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                                                    <div className="mt-1.5">
                                                        <span className="inline-block text-[10px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                                            {roleLabels[user.role] || user.role}
                                                        </span>
                                                    </div>
                                                </div>
                                                {portal && (
                                                    <Link
                                                        to={portal.path}
                                                        onClick={() => setUserMenuOpen(false)}
                                                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                                                    >
                                                        <LayoutDashboard size={14} className="text-blue-600" />
                                                        <span>{portal.label}</span>
                                                    </Link>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={async () => {
                                                        setUserMenuOpen(false)
                                                        await logout()
                                                    }}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left"
                                                >
                                                    <LogOut size={14} />
                                                    <span>Keluar (Logout)</span>
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="hidden sm:inline-flex h-9 xl:h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-3.5 xl:px-4 text-xs xl:text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 hover:border-slate-300 transition-colors shadow-2xs whitespace-nowrap"
                            >
                                Login
                            </Link>
                        )}

                        {/* Primary CTA (PPDB) */}
                        <Link
                            to={ppdbOpen ? '/ppdb/register' : '#ppdb'}
                            onClick={(e) => { if (!ppdbOpen) { e.preventDefault(); go('#ppdb') } }}
                            className="hidden sm:inline-flex h-9 xl:h-10 items-center justify-center rounded-lg bg-blue-600 px-3.5 xl:px-4 text-xs xl:text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs hover:shadow whitespace-nowrap"
                        >
                            {ppdbOpen ? 'Daftar PPDB' : 'Info PPDB'}
                        </Link>

                        {/* Mobile Toggle Button */}
                        <button
                            type="button"
                            onClick={() => setOpen((v) => !v)}
                            aria-expanded={open}
                            aria-controls="mobile-menu"
                            aria-label={open ? 'Tutup menu' : 'Buka menu'}
                            className="lg:hidden -mr-1 grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                            {open ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </Container>

                {/* Mobile Navigation Drawer */}
                <AnimatePresence>
                    {open && (
                        <>
                            <motion.div
                                key="backdrop"
                                className="lg:hidden fixed inset-0 top-[65px] z-30 bg-slate-950/40 backdrop-blur-xs"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setOpen(false)}
                            />
                            <motion.nav
                                key="panel"
                                id="mobile-menu"
                                aria-label="Navigasi mobile"
                                className="lg:hidden fixed inset-x-0 top-[65px] z-40 max-h-[calc(100vh-65px)] overflow-y-auto bg-white border-t border-slate-100 shadow-xl"
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ul className="px-5 py-2 divide-y divide-slate-100">
                                    {navItems.map((item) => (
                                        <li key={item.href}>
                                            <a
                                                href={item.href}
                                                onClick={(e) => { e.preventDefault(); go(item.href) }}
                                                className={`flex items-center justify-between py-3 text-sm font-semibold ${
                                                    activeId === item.href.slice(1) ? 'text-blue-600' : 'text-slate-700'
                                                }`}
                                            >
                                                {item.label}
                                                <ChevronRight size={16} className="text-slate-400" />
                                            </a>
                                        </li>
                                    ))}
                                </ul>

                                <div className="p-5 border-t border-slate-100 bg-slate-50 flex flex-col gap-2.5">
                                    {isAuthenticated && user ? (
                                        <>
                                            <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-sm text-slate-800 truncate">{user.name}</p>
                                                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                                    </div>
                                                    <span className="shrink-0 text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 px-2 py-0.5 rounded-md">
                                                        {roleLabels[user.role] || user.role}
                                                    </span>
                                                </div>
                                            </div>
                                            {portal && (
                                                <Link
                                                    to={portal.path}
                                                    onClick={() => setOpen(false)}
                                                    className="w-full flex items-center justify-center gap-2 h-10 rounded-lg bg-blue-600 text-white font-semibold text-sm shadow-xs hover:bg-blue-700 transition-colors"
                                                >
                                                    <LayoutDashboard size={16} />
                                                    <span>{portal.label}</span>
                                                </Link>
                                            )}
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    await logout()
                                                    setOpen(false)
                                                }}
                                                className="w-full flex items-center justify-center gap-2 h-10 rounded-lg bg-white border border-rose-200 text-rose-600 font-semibold text-sm hover:bg-rose-50 transition-colors"
                                            >
                                                <LogOut size={16} />
                                                <span>Keluar (Logout)</span>
                                            </button>
                                        </>
                                    ) : (
                                        <Link
                                            to="/login"
                                            onClick={() => setOpen(false)}
                                            className="w-full flex items-center justify-center h-10 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
                                        >
                                            Masuk Portal
                                        </Link>
                                    )}

                                    <Link
                                        to={ppdbOpen ? '/ppdb/register' : '#ppdb'}
                                        onClick={(e) => {
                                            setOpen(false)
                                            if (!ppdbOpen) {
                                                e.preventDefault()
                                                go('#ppdb')
                                            }
                                        }}
                                        className="w-full flex items-center justify-center h-10 rounded-lg bg-blue-600 text-white font-semibold text-sm shadow-xs hover:bg-blue-700 transition-colors"
                                    >
                                        {ppdbOpen ? 'Daftar PPDB Online' : 'Info PPDB'}
                                    </Link>
                                </div>
                            </motion.nav>
                        </>
                    )}
                </AnimatePresence>
            </header>
        </>
    )
}
