import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    LayoutDashboard,
    School,
    Users,
    UserCog,
    Wallet,
    BookOpen,
    GraduationCap,
    Building2,
    Megaphone,
    Settings,
    ChevronDown,
    ChevronRight,
    CalendarCheck,
    FileText,
    CalendarDays,
    Award,
    UserPlus
} from 'lucide-react'
import { useAuthContext } from '../../contexts/AuthContext'

interface MenuItem {
    id: string
    label: string
    icon: React.ReactNode
    path?: string
    children?: { label: string; path: string }[]
}

const adminMenuItems: MenuItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <LayoutDashboard size={20} />,
        path: '/dashboard',
    },
    {
        id: 'school-profile',
        label: 'Profil Sekolah',
        icon: <School size={20} />,
        children: [
            { label: 'Identitas Sekolah', path: '/profile/identity' },
            { label: 'Struktur Organisasi', path: '/profile/organization' },
            { label: 'Fasilitas', path: '/profile/facilities' },
            { label: 'Gallery', path: '/profile/gallery' },
            { label: 'Prestasi', path: '/profile/achievements' },
            { label: 'OSIS', path: '/profile/osis' },
            { label: 'MPK', path: '/profile/mpk' },
        ],
    },
    {
        id: 'students',
        label: 'Manajemen Siswa',
        icon: <Users size={20} />,
        children: [
            { label: 'Data Siswa', path: '/students' },
            { label: 'Kelas & Jurusan', path: '/students/classes' },
            { label: 'Absensi Siswa', path: '/students/attendance' },
            { label: 'Ekstrakurikuler', path: '/students/extracurricular' },

        ],
    },
    {
        id: 'teachers',
        label: 'Manajemen Guru',
        icon: <UserCog size={20} />,
        children: [
            { label: 'Data Guru & Staff', path: '/teachers' },
            { label: 'Jadwal Mengajar', path: '/teachers/schedule' },
            { label: 'Kehadiran Guru', path: '/teachers/attendance' },
            { label: 'Evaluasi Kinerja', path: '/teachers/performance' },
        ],
    },
    {
        id: 'finance',
        label: 'Keuangan',
        icon: <Wallet size={20} />,
        children: [
            { label: 'Dashboard Keuangan', path: '/finance' },
            { label: 'Pemasukan', path: '/finance/income' },
            { label: 'Pengeluaran', path: '/finance/expenses' },
            { label: 'Tagihan SPP', path: '/finance/billing' },
            { label: 'Laporan Keuangan', path: '/finance/reports' },
        ],
    },
    {
        id: 'academic',
        label: 'Akademik',
        icon: <BookOpen size={20} />,
        children: [
            { label: 'Tahun Ajaran', path: '/academic/years' },
            { label: 'Mata Pelajaran', path: '/academic/subjects' },
            { label: 'Jadwal Pelajaran', path: '/academic/schedules' },
            { label: 'LMS (Tugas Kls)', path: '/academic/lms' },
            { label: 'Kalender Akademik', path: '/academic/calendar' },
        ],
    },
    // Curriculum removed - kept in API for future
    {
        id: 'grading',
        label: 'Penilaian',
        icon: <GraduationCap size={20} />,
        path: '/grading',
    },
    {
        id: 'infrastructure',
        label: 'Infrastruktur',
        icon: <Building2 size={20} />,
        children: [
            { label: 'Inventaris', path: '/infrastructure/inventory' },
            { label: 'Pemeliharaan', path: '/infrastructure/maintenance' },
            { label: 'Booking Ruang', path: '/infrastructure/booking' },
        ],
    },
    {
        id: 'communication',
        label: 'Komunikasi',
        icon: <Megaphone size={20} />,
        children: [
            { label: 'Pengumuman', path: '/communication/announcements' },
            { label: 'Surat Menyurat', path: '/communication/letters' },
            { label: 'WhatsApp Blast', path: '/communication/whatsapp' },
        ],
    },
    {
        id: 'settings',
        label: 'Pengaturan',
        icon: <Settings size={20} />,
        children: [
            { label: 'User Management', path: '/settings/users' },
            { label: 'Roles & Permission', path: '/settings/roles' },
            { label: 'Backup Data', path: '/settings/backup' },
            { label: 'Konfigurasi Sistem', path: '/settings/config' },
            { label: 'Konfigurasi Kurikulum', path: '/settings/curriculum' },
        ],
    },
    {
        id: 'ppdb',
        label: 'PPDB',
        icon: <UserPlus size={20} />,
        children: [
            { label: 'Jadwal / Batch', path: '/ppdb/batches' },
            { label: 'Daftar Pendaftar', path: '/ppdb/registrations' },
        ],
    },
]

// Teacher Menu - Limited Access
const teacherMenuItems: MenuItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <LayoutDashboard size={20} />,
        path: '/dashboard',
    },
    {
        id: 'academic',
        label: 'Akademik',
        icon: <BookOpen size={20} />,
        children: [
            { label: 'LMS (Tugas Kls)', path: '/academic/lms' },
            { label: 'Jadwal Pelajaran', path: '/academic/schedules' },
            { label: 'Kalender Akademik', path: '/academic/calendar' },
        ],
    },
    // Curriculum removed for teachers - kept in API for future
    {
        id: 'grading',
        label: 'Penilaian',
        icon: <GraduationCap size={20} />,
        path: '/grading',
    },
    {
        id: 'school-profile',
        label: 'Profil Sekolah',
        icon: <School size={20} />,
        children: [
            { label: 'Identitas Sekolah', path: '/profile/identity' },
            { label: 'Fasilitas', path: '/profile/facilities' },
            { label: 'Prestasi', path: '/profile/achievements' },
        ],
    },
]

const studentMenuItems: MenuItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <LayoutDashboard size={20} />,
        path: '/student/dashboard',
    },
    {
        id: 'profile',
        label: 'Profil Sekolah',
        icon: <School size={20} />,
        path: '/student/profile-school/identity',
    },
    {
        id: 'attendance',
        label: 'Presensi',
        icon: <CalendarCheck size={20} />,
        path: '/student/attendance',
    },
    {
        id: 'assignments',
        label: 'Tugas Saya',
        icon: <FileText size={20} />,
        path: '/student/assignments',
    },
    {
        id: 'schedule',
        label: 'Jadwal Pelajaran',
        icon: <CalendarDays size={20} />,
        path: '/student/schedule',
    },
    {
        id: 'grades',
        label: 'Nilai & Raport',
        icon: <Award size={20} />,
        path: '/student/grades',
    },
    {
        id: 'announcements',
        label: 'Pengumuman',
        icon: <Megaphone size={20} />,
        path: '/student/announcements',
    },
    {
        id: 'enrollment',
        label: 'Pendaftaran Kelas',
        icon: <GraduationCap size={20} />,
        path: '/student-portal/enrollment',
    }
]

export default function Sidebar() {
    const location = useLocation()
    const { user } = useAuthContext()
    const [expandedMenus, setExpandedMenus] = useState<string[]>(['dashboard'])

    const toggleMenu = (menuId: string) => {
        setExpandedMenus((prev) =>
            prev.includes(menuId)
                ? prev.filter((id) => id !== menuId)
                : [...prev, menuId]
        )
    }

    const isActive = (path?: string) => {
        if (!path) return false
        return location.pathname === path
    }

    const isParentActive = (item: MenuItem) => {
        if (item.path) return isActive(item.path)
        return item.children?.some((child) => location.pathname === child.path)
    }

    const getMenus = () => {
        if (user?.role === 'STUDENT') return studentMenuItems
        if (user?.role === 'TEACHER') return teacherMenuItems
        return adminMenuItems
    }

    const menus = getMenus()

    return (
        <aside className="flex w-72 flex-col bg-white dark:bg-gray-800 border-r border-border-color dark:border-gray-700 overflow-y-auto hidden lg:flex">
            {/* Logo */}
            <div className="p-6 flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <School size={24} />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-text-main dark:text-white leading-tight">
                        Artefact
                    </h1>
                    <p className="text-xs text-text-secondary dark:text-gray-400 font-medium">
                        {user?.role === 'STUDENT' ? 'Student Portal' : 'Admin Portal'}
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 flex flex-col gap-1">
                {menus.map((item) => (
                    <div key={item.id}>
                        {item.path ? (
                            <Link
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive(item.path)
                                    ? 'bg-primary text-white'
                                    : 'text-text-secondary hover:bg-slate-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <span className={isActive(item.path) ? 'text-white' : 'group-hover:text-primary'}>
                                    {item.icon}
                                </span>
                                <span className={`text-sm font-medium ${isActive(item.path) ? 'text-white' : 'text-text-main dark:text-gray-200'
                                    }`}>
                                    {item.label}
                                </span>
                            </Link>
                        ) : (
                            <>
                                <button
                                    onClick={() => toggleMenu(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isParentActive(item)
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-text-secondary hover:bg-slate-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <span>{item.icon}</span>
                                    <span className={`text-sm font-medium flex-1 text-left ${isParentActive(item) ? 'text-primary' : 'text-text-main dark:text-gray-200'
                                        }`}>
                                        {item.label}
                                    </span>
                                    {expandedMenus.includes(item.id) ? (
                                        <ChevronDown size={16} />
                                    ) : (
                                        <ChevronRight size={16} />
                                    )}
                                </button>
                                {expandedMenus.includes(item.id) && item.children && (
                                    <div className="ml-8 mt-1 flex flex-col gap-1">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.path}
                                                to={child.path}
                                                className={`px-3 py-2 rounded-lg text-sm transition-colors ${isActive(child.path)
                                                    ? 'bg-primary text-white font-medium'
                                                    : 'text-text-secondary hover:bg-slate-100 dark:hover:bg-gray-700 hover:text-text-main dark:hover:text-white'
                                                    }`}
                                            >
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-border-color dark:border-gray-700">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 cursor-pointer">
                    <div
                        className="size-10 rounded-full bg-cover bg-center bg-gradient-to-br from-primary to-blue-400"
                        style={{
                            backgroundImage: user?.image
                                ? `url('${user.image}')`
                                : "url('https://ui-avatars.com/api/?name=" + (user?.name || 'User') + "&background=random')",
                        }}
                    />
                    <div className="flex flex-col">
                        <p className="text-sm font-bold text-text-main dark:text-white truncate max-w-[140px]">
                            {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-text-secondary dark:text-gray-400">
                            {user?.role?.replace('_', ' ') || 'Guest'}
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    )
}
