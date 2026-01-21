import { Link, useLocation } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'
import {
    LayoutDashboard,
    CalendarCheck,
    FileText,
    CalendarDays,
    Award,
    LogOut,
    User,
    School,
    GraduationCap
} from 'lucide-react'
import { useState } from 'react'

export default function StudentNavbar() {
    const { user, logout } = useAuthContext()
    const location = useLocation()
    const [isProfileOpen, setIsProfileOpen] = useState(false)

    const navItems = [
        { label: 'Dashboard', path: '/student-portal', icon: <LayoutDashboard size={18} /> },
        { label: 'Presensi', path: '/student-portal/attendance', icon: <CalendarCheck size={18} /> },
        { label: 'Tugas', path: '/student-portal/assignments', icon: <FileText size={18} /> },
        { label: 'Jadwal', path: '/student-portal/schedule', icon: <CalendarDays size={18} /> },
        { label: 'Nilai', path: '/student-portal/grades', icon: <Award size={18} /> },
        { label: 'Kelas', path: '/student-portal/enrollment', icon: <GraduationCap size={18} /> },
    ]

    const isActive = (path: string) => location.pathname === path

    return (
        <>
            {/* Desktop Navigation (Top Bar) */}
            <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-border-color dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/student/dashboard" className="flex items-center gap-2">
                            <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                                <School size={24} />
                            </div>
                            <span className="text-lg font-bold text-text-main dark:text-white hidden md:block">
                                Student Portal
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.path)
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-text-secondary hover:text-text-main hover:bg-slate-50 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </div>

                        {/* User Profile */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <div
                                    className="size-8 rounded-full bg-cover bg-center bg-gray-200"
                                    style={{
                                        backgroundImage: user?.image
                                            ? `url('${user.image}')`
                                            : "url('https://ui-avatars.com/api/?name=" + (user?.name || 'Student') + "&background=random')",
                                    }}
                                />
                            </button>

                            {/* Dropdown */}
                            {isProfileOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsProfileOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-border-color dark:border-gray-700 py-1 z-50 animate-in fade-in slide-in-from-top-2">
                                        <div className="px-4 py-2 border-b border-border-color dark:border-gray-700">
                                            <p className="text-sm font-bold text-text-main dark:text-white truncate">
                                                {user?.name}
                                            </p>
                                            <p className="text-xs text-text-secondary dark:text-gray-400">
                                                {user?.email}
                                            </p>
                                        </div>
                                        <Link
                                            to="/student/profile-school/identity"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-slate-50 dark:hover:bg-gray-700"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <User size={16} />
                                            Profile Sekolah
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout()
                                                setIsProfileOpen(false)
                                            }}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                                        >
                                            <LogOut size={16} />
                                            Keluar
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation (Bottom Bar) - Optimized for iOS/Android */}
            <div
                className="md:hidden fixed bottom-0 left-0 right-0 z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)]"
                style={{ willChange: 'transform' }}
            >
                {/* Background - GPU accelerated */}
                <div
                    className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 border-t border-border-color/50 dark:border-gray-800"
                    style={{
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        transform: 'translateZ(0)'
                    }}
                />

                {/* Navigation Container - Touch optimized */}
                <div className="relative flex items-end justify-around h-[72px] px-1" style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}>
                    {/* Presensi */}
                    <Link
                        to="/student-portal/attendance"
                        className={`flex flex-col items-center justify-center w-16 h-14 rounded-xl touch-manipulation active:scale-95 transition-transform duration-150 ${isActive('/student-portal/attendance') ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                            }`}
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        <CalendarCheck size={22} strokeWidth={isActive('/student-portal/attendance') ? 2.5 : 2} />
                        <span className="text-[10px] font-medium mt-0.5">Presensi</span>
                    </Link>

                    {/* Tugas */}
                    <Link
                        to="/student-portal/assignments"
                        className={`flex flex-col items-center justify-center w-16 h-14 rounded-xl touch-manipulation active:scale-95 transition-transform duration-150 ${isActive('/student-portal/assignments') ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                            }`}
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        <FileText size={22} strokeWidth={isActive('/student-portal/assignments') ? 2.5 : 2} />
                        <span className="text-[10px] font-medium mt-0.5">Tugas</span>
                    </Link>

                    {/* Center: Dashboard - Prominent Circle Button */}
                    <div className="relative -mt-5">
                        <Link
                            to="/student-portal"
                            className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg touch-manipulation active:scale-90 transition-transform duration-150 ${isActive('/student-portal')
                                ? 'bg-primary text-white'
                                : 'bg-white dark:bg-gray-800 text-primary border-2 border-primary/30'
                                }`}
                            style={{
                                WebkitTapHighlightColor: 'transparent',
                                boxShadow: isActive('/student-portal')
                                    ? '0 4px 20px rgba(59, 130, 246, 0.4)'
                                    : '0 4px 12px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <LayoutDashboard size={24} strokeWidth={2} />
                        </Link>
                    </div>

                    {/* Jadwal */}
                    <Link
                        to="/student-portal/schedule"
                        className={`flex flex-col items-center justify-center w-16 h-14 rounded-xl touch-manipulation active:scale-95 transition-transform duration-150 ${isActive('/student-portal/schedule') ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                            }`}
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        <CalendarDays size={22} strokeWidth={isActive('/student-portal/schedule') ? 2.5 : 2} />
                        <span className="text-[10px] font-medium mt-0.5">Jadwal</span>
                    </Link>

                    {/* Nilai */}
                    <Link
                        to="/student-portal/grades"
                        className={`flex flex-col items-center justify-center w-16 h-14 rounded-xl touch-manipulation active:scale-95 transition-transform duration-150 ${isActive('/student-portal/grades') ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                            }`}
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        <Award size={22} strokeWidth={isActive('/student-portal/grades') ? 2.5 : 2} />
                        <span className="text-[10px] font-medium mt-0.5">Nilai</span>
                    </Link>
                </div>
            </div>
        </>
    )
}
