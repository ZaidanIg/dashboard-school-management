
import { Link, useLocation } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    Package,
    Wallet,
    DollarSign,
    ArrowUpCircle,
    ArrowDownCircle,
    Bell,
    LogOut,
    Briefcase,
    ChevronDown,
    Menu,
    X
} from 'lucide-react'
import { useState } from 'react'

interface NavItem {
    label: string
    path: string
    icon: React.ReactNode
    children?: { label: string; path: string; icon: React.ReactNode }[]
}

export default function StaffNavbar() {
    const { user, logout } = useAuthContext()
    const location = useLocation()
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const navItems: NavItem[] = [
        { label: 'Dashboard', path: '/staff-portal', icon: <LayoutDashboard size={18} /> },
        { label: 'Siswa', path: '/staff-portal/students', icon: <GraduationCap size={18} /> },
        { label: 'Guru', path: '/staff-portal/teachers', icon: <Users size={18} /> },
        { label: 'Inventaris', path: '/staff-portal/inventory', icon: <Package size={18} /> },
        {
            label: 'Keuangan',
            path: '/staff-portal/finance',
            icon: <Wallet size={18} />,
            children: [
                { label: 'Gaji Guru', path: '/staff-portal/finance/salary', icon: <DollarSign size={16} /> },
                { label: 'SPP', path: '/staff-portal/finance/spp', icon: <Briefcase size={16} /> },
                { label: 'Pemasukan', path: '/staff-portal/finance/income', icon: <ArrowUpCircle size={16} /> },
                { label: 'Pengeluaran', path: '/staff-portal/finance/expenses', icon: <ArrowDownCircle size={16} /> },
            ]
        },
        { label: 'Pengumuman', path: '/staff-portal/announcements', icon: <Bell size={18} /> },
    ]

    const isActive = (path: string) => {
        if (path === '/staff-portal') return location.pathname === '/staff-portal'
        return location.pathname.startsWith(path)
    }

    const toggleSubmenu = (label: string) => {
        setExpandedMenu(expandedMenu === label ? null : label)
    }

    return (
        <>
            {/* Desktop Navigation (Top Bar) */}
            <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-border-color dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/staff-portal" className="flex items-center gap-2">
                            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600">
                                <Briefcase size={24} />
                            </div>
                            <span className="text-lg font-bold text-text-main dark:text-white hidden md:block">
                                Staff Portal
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navItems.map((item) => (
                                item.children ? (
                                    <div key={item.label} className="relative group">
                                        <button
                                            onClick={() => toggleSubmenu(item.label)}
                                            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.path)
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                : 'text-text-secondary hover:text-text-main hover:bg-slate-50 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            {item.icon}
                                            <span>{item.label}</span>
                                            <ChevronDown size={14} className={`transition-transform ${expandedMenu === item.label ? 'rotate-180' : ''}`} />
                                        </button>

                                        {/* Dropdown */}
                                        {expandedMenu === item.label && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setExpandedMenu(null)} />
                                                <div className="absolute left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-border-color dark:border-gray-700 py-1 z-50 animate-in fade-in slide-in-from-top-2">
                                                    {item.children.map((child) => (
                                                        <Link
                                                            key={child.path}
                                                            to={child.path}
                                                            onClick={() => setExpandedMenu(null)}
                                                            className={`flex items-center gap-2 px-4 py-2 text-sm ${isActive(child.path)
                                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                                                                : 'text-text-secondary hover:bg-slate-50 dark:hover:bg-gray-700'
                                                                }`}
                                                        >
                                                            {child.icon}
                                                            {child.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.path)
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                            : 'text-text-secondary hover:text-text-main hover:bg-slate-50 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </Link>
                                )
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
                                            : "url('https://ui-avatars.com/api/?name=" + (user?.name || 'Staff') + "&background=10b981&color=fff')",
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
                                                TU Staff
                                            </p>
                                        </div>
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

            {/* Mobile Navigation (Bottom Bar) */}
            <div
                className="md:hidden fixed bottom-0 left-0 right-0 z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)]"
                style={{ willChange: 'transform' }}
            >
                <div
                    className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 border-t border-border-color/50 dark:border-gray-800"
                    style={{
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        transform: 'translateZ(0)'
                    }}
                />

                <div className="relative flex items-end justify-around h-[72px] px-1" style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}>

                    {/* Siswa */}
                    <Link
                        to="/staff-portal/students"
                        className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl touch-manipulation active:scale-95 transition-transform duration-150 ${isActive('/staff-portal/students') ? 'text-emerald-600' : 'text-gray-500 dark:text-gray-400'
                            }`}
                    >
                        <GraduationCap size={22} strokeWidth={isActive('/staff-portal/students') ? 2.5 : 2} />
                        <span className="text-[10px] font-medium mt-0.5">Siswa</span>
                    </Link>

                    {/* Keuangan */}
                    <Link
                        to="/staff-portal/finance/salary"
                        className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl touch-manipulation active:scale-95 transition-transform duration-150 ${isActive('/staff-portal/finance') ? 'text-emerald-600' : 'text-gray-500 dark:text-gray-400'
                            }`}
                    >
                        <Wallet size={22} strokeWidth={isActive('/staff-portal/finance') ? 2.5 : 2} />
                        <span className="text-[10px] font-medium mt-0.5">Uang</span>
                    </Link>

                    {/* Center: Dashboard */}
                    <div className="relative -mt-5">
                        <Link
                            to="/staff-portal"
                            className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg touch-manipulation active:scale-90 transition-transform duration-150 ${isActive('/staff-portal') && location.pathname === '/staff-portal'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white dark:bg-gray-800 text-emerald-600 border-2 border-emerald-600/30'
                                }`}
                            style={{
                                WebkitTapHighlightColor: 'transparent',
                                boxShadow: isActive('/staff-portal') && location.pathname === '/staff-portal'
                                    ? '0 4px 20px rgba(16, 185, 129, 0.4)'
                                    : '0 4px 12px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <LayoutDashboard size={24} strokeWidth={2} />
                        </Link>
                    </div>

                    {/* Inventaris */}
                    <Link
                        to="/staff-portal/inventory"
                        className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl touch-manipulation active:scale-95 transition-transform duration-150 ${isActive('/staff-portal/inventory') ? 'text-emerald-600' : 'text-gray-500 dark:text-gray-400'
                            }`}
                    >
                        <Package size={22} strokeWidth={isActive('/staff-portal/inventory') ? 2.5 : 2} />
                        <span className="text-[10px] font-medium mt-0.5">Barang</span>
                    </Link>

                    {/* More/Menu */}
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="flex flex-col items-center justify-center w-14 h-14 rounded-xl touch-manipulation active:scale-95 transition-transform duration-150 text-gray-500 dark:text-gray-400"
                    >
                        <Menu size={22} strokeWidth={2} />
                        <span className="text-[10px] font-medium mt-0.5">Lainnya</span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-[150]">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
                    <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl p-6 animate-in slide-in-from-bottom">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-text-main dark:text-white">Menu</h3>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-gray-800">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {navItems.map((item) => (
                                item.children ? (
                                    item.children.map((child) => (
                                        <Link
                                            key={child.path}
                                            to={child.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`flex flex-col items-center p-4 rounded-xl ${isActive(child.path)
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30'
                                                : 'bg-slate-50 dark:bg-gray-800 text-text-secondary'
                                                }`}
                                        >
                                            {child.icon}
                                            <span className="text-xs mt-2 text-center">{child.label}</span>
                                        </Link>
                                    ))
                                ) : (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex flex-col items-center p-4 rounded-xl ${isActive(item.path)
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30'
                                            : 'bg-slate-50 dark:bg-gray-800 text-text-secondary'
                                            }`}
                                    >
                                        {item.icon}
                                        <span className="text-xs mt-2 text-center">{item.label}</span>
                                    </Link>
                                )
                            ))}
                        </div>

                        {/* Logout */}
                        <button
                            onClick={() => {
                                logout()
                                setIsMobileMenuOpen(false)
                            }}
                            className="w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-900/20"
                        >
                            <LogOut size={18} />
                            Keluar
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
