import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, Clock, GraduationCap, Mail, Menu, Phone, X } from 'lucide-react'
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
    const box = size === 'lg' ? 'h-11 w-11' : 'h-10 w-10'
    if (school?.logo) {
        return <img src={resolveAssetUrl(school.logo)} alt={`Logo ${school.name}`} className={`${box} rounded-xl object-contain bg-white border border-slate-100 p-0.5`} />
    }
    return (
        <span className={`${box} grid place-items-center rounded-xl bg-blue-600 text-white shadow-xs`} aria-hidden="true">
            <GraduationCap size={size === 'lg' ? 24 : 20} />
        </span>
    )
}

export function Header({ school, schoolName, activeId, ppdbOpen, onNavigate }: HeaderProps) {
    const { isAuthenticated, user } = useAuthContext()
    const dashboardPath = user?.role === 'STUDENT' ? '/student-portal' : user?.role === 'TEACHER' ? '/teacher-portal' : user?.role === 'STAFF' ? '/staff-portal' : '/dashboard'
    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

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
                    <div className="flex items-center gap-6">
                        {school?.phone && (
                            <a href={toTelHref(school.phone)} className="inline-flex items-center gap-2 hover:text-white transition-colors">
                                <Phone size={13} className="text-blue-400" /> {school.phone}
                            </a>
                        )}
                        {school?.email && (
                            <a href={`mailto:${school.email}`} className="inline-flex items-center gap-2 hover:text-white transition-colors">
                                <Mail size={13} className="text-blue-400" /> {school.email}
                            </a>
                        )}
                        <span className="inline-flex items-center gap-2 text-slate-400">
                            <Clock size={13} className="text-blue-400" /> Senin – Jumat, 07.00 – 15.00 WIB
                        </span>
                    </div>
                    <nav aria-label="Portal Akses Cepat" className="flex items-center divide-x divide-slate-700 text-slate-300">
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
                <Container className="flex h-16 lg:h-20 items-center justify-between gap-4">
                    {/* Brand Logo & Name */}
                    <a href="#beranda" onClick={(e) => { e.preventDefault(); go('#beranda') }} className="flex min-w-0 items-center gap-3 group">
                        <SchoolMark school={school} />
                        <span className="min-w-0">
                            <span className="block truncate font-heading text-base lg:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                                {schoolName}
                            </span>
                            {subtitle && <span className="block truncate text-[11px] lg:text-xs text-slate-500 font-medium">{subtitle}</span>}
                        </span>
                    </a>

                    {/* Desktop Navigation */}
                    <nav aria-label="Navigasi utama" className="hidden lg:flex items-center gap-1">
                        {navItems.map((item) => {
                            const active = activeId === item.href.slice(1)
                            return (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    onClick={(e) => { e.preventDefault(); go(item.href) }}
                                    aria-current={active ? 'true' : undefined}
                                    className={`relative rounded-lg px-3.5 py-2 text-sm font-semibold transition-all ${
                                        active ? 'text-blue-600 bg-blue-50/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                                >
                                    {item.label}
                                    <span
                                        className={`absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-blue-600 transition-transform duration-300 origin-left ${
                                            active ? 'scale-x-100' : 'scale-x-0'
                                        }`}
                                        aria-hidden="true"
                                    />
                                </a>
                            )
                        })}
                    </nav>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {isAuthenticated ? (
                            <Link
                                to={dashboardPath}
                                className="hidden sm:inline-flex h-9.5 items-center rounded-lg px-4 py-4 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="hidden sm:inline-flex h-9.5 items-center rounded-lg px-4 py-4 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
                            >
                                Login
                            </Link>
                        )}
                        <Link
                            to={ppdbOpen ? '/ppdb/register' : '#ppdb'}
                            onClick={(e) => { if (!ppdbOpen) { e.preventDefault(); go('#ppdb') } }}
                            className="hidden sm:inline-flex h-9.5 items-center rounded-lg bg-blue-600 px-4 py-4 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
                        >
                            {ppdbOpen ? 'Daftar PPDB' : 'Info PPDB'}
                        </Link>
                        <button
                            type="button"
                            onClick={() => setOpen((v) => !v)}
                            aria-expanded={open}
                            aria-controls="mobile-menu"
                            aria-label={open ? 'Tutup menu' : 'Buka menu'}
                            className="lg:hidden -mr-2 grid h-10 w-10 place-items-center rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                            {open ? <X size={22} /> : <Menu size={22} />}
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
                                <ul className="px-5 py-3 divide-y divide-slate-100">
                                    {navItems.map((item) => (
                                        <li key={item.href}>
                                            <a
                                                href={item.href}
                                                onClick={(e) => { e.preventDefault(); go(item.href) }}
                                                className={`flex items-center justify-between py-3.5 text-sm font-semibold ${
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
                                    <Link
                                        to="/login"
                                        onClick={() => setOpen(false)}
                                        className="w-full flex items-center justify-center h-10 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm"
                                    >
                                        Masuk Portal
                                    </Link>
                                    <Link
                                        to="/ppdb/register"
                                        onClick={() => setOpen(false)}
                                        className="w-full flex items-center justify-center h-10 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-xs"
                                    >
                                        Daftar PPDB Online
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
