import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    Users,
    GraduationCap,
    Package,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Bell,
    Calendar,
    ArrowRight,
    Loader2
} from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import { api } from '@/lib/api'

interface DashboardStats {
    totalStudents: number
    totalTeachers: number
    totalInventory: number
    monthlyIncome: number
    monthlyExpenses: number
    pendingAnnouncements: number
}

export default function StaffDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalStudents: 0,
        totalTeachers: 0,
        totalInventory: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        pendingAnnouncements: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch from existing APIs
                const [studentsRes, teachersRes, inventoryRes] = await Promise.all([
                    api.get<any>('/api/students', { page: 1, limit: 1 }),
                    api.get<any>('/api/teachers', { page: 1, limit: 1 }),
                    api.get<any>('/api/infrastructure/inventory', { page: 1, limit: 1 })
                ])

                setStats({
                    totalStudents: studentsRes.meta?.total || 0,
                    totalTeachers: teachersRes.meta?.total || 0,
                    totalInventory: inventoryRes.meta?.total || 0,
                    monthlyIncome: 45000000, // Placeholder
                    monthlyExpenses: 32000000, // Placeholder
                    pendingAnnouncements: 3 // Placeholder
                })
            } catch (error) {
                console.error('Failed to fetch stats:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount)
    }

    const statsCards = [
        {
            title: 'Total Siswa',
            value: stats.totalStudents.toString(),
            icon: GraduationCap,
            color: 'text-blue-600',
            bg: 'bg-blue-100 dark:bg-blue-900/30',
            link: '/staff-portal/students'
        },
        {
            title: 'Total Guru',
            value: stats.totalTeachers.toString(),
            icon: Users,
            color: 'text-purple-600',
            bg: 'bg-purple-100 dark:bg-purple-900/30',
            link: '/staff-portal/teachers'
        },
        {
            title: 'Item Inventaris',
            value: stats.totalInventory.toString(),
            icon: Package,
            color: 'text-amber-600',
            bg: 'bg-amber-100 dark:bg-amber-900/30',
            link: '/staff-portal/inventory'
        },
        {
            title: 'Pemasukan Bulan Ini',
            value: formatCurrency(stats.monthlyIncome),
            icon: TrendingUp,
            color: 'text-emerald-600',
            bg: 'bg-emerald-100 dark:bg-emerald-900/30',
            link: '/staff-portal/finance/income'
        },
        {
            title: 'Pengeluaran Bulan Ini',
            value: formatCurrency(stats.monthlyExpenses),
            icon: TrendingDown,
            color: 'text-rose-600',
            bg: 'bg-rose-100 dark:bg-rose-900/30',
            link: '/staff-portal/finance/expenses'
        },
        {
            title: 'Pengumuman',
            value: stats.pendingAnnouncements.toString(),
            icon: Bell,
            color: 'text-cyan-600',
            bg: 'bg-cyan-100 dark:bg-cyan-900/30',
            link: '/staff-portal/announcements'
        }
    ]

    const quickActions = [
        { label: 'Kelola Siswa', path: '/staff-portal/students', icon: GraduationCap },
        { label: 'Kelola Guru', path: '/staff-portal/teachers', icon: Users },
        { label: 'Gaji Guru', path: '/staff-portal/finance/salary', icon: DollarSign },
        { label: 'SPP Siswa', path: '/staff-portal/finance/spp', icon: DollarSign },
        { label: 'Inventaris', path: '/staff-portal/inventory', icon: Package },
        { label: 'Buat Pengumuman', path: '/staff-portal/announcements', icon: Bell }
    ]

    return (
        <div className="space-y-6 px-4 md:px-0 pb-20">
            <PageHeader
                title="Dashboard Staff"
                subtitle="Selamat datang di Portal Tata Usaha"
                breadcrumb={[{ label: 'Dashboard' }]}
            />

            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-6 md:p-8 text-white">
                <div className="relative z-10">
                    <p className="text-emerald-100 text-sm mb-1">
                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Portal Tata Usaha</h2>
                    <p className="text-emerald-100 max-w-md">
                        Kelola data siswa, guru, keuangan, dan inventaris sekolah dari satu tempat.
                    </p>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
            </div>

            {/* Stats Grid */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-emerald-600" size={32} />
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {statsCards.map((stat, index) => (
                        <Link
                            key={index}
                            to={stat.link}
                            className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-4 hover:shadow-lg transition-all hover:-translate-y-1"
                        >
                            <div className={`inline-flex p-2 rounded-lg ${stat.bg} ${stat.color} mb-3`}>
                                <stat.icon size={20} />
                            </div>
                            <p className="text-xl md:text-2xl font-bold text-text-main dark:text-white">
                                {stat.value}
                            </p>
                            <p className="text-xs text-text-secondary dark:text-gray-400 mt-1">
                                {stat.title}
                            </p>
                        </Link>
                    ))}
                </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-text-main dark:text-white mb-4">
                    Aksi Cepat
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {quickActions.map((action, index) => (
                        <Link
                            key={index}
                            to={action.path}
                            className="flex flex-col items-center p-4 rounded-xl bg-slate-50 dark:bg-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors group"
                        >
                            <div className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-sm group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                                <action.icon size={24} className="text-emerald-600" />
                            </div>
                            <span className="text-sm font-medium text-text-main dark:text-white mt-3 text-center">
                                {action.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Activities & Summary */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Today's Summary */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-text-main dark:text-white flex items-center gap-2">
                            <Calendar size={20} className="text-emerald-600" />
                            Ringkasan Hari Ini
                        </h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-sm text-text-secondary">SPP Terbayar</span>
                            <span className="font-semibold text-emerald-600">Rp 5.500.000</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-sm text-text-secondary">SPP Tertunggak</span>
                            <span className="font-semibold text-rose-600">12 siswa</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-sm text-text-secondary">Guru Hadir</span>
                            <span className="font-semibold text-text-main dark:text-white">28/30</span>
                        </div>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-text-main dark:text-white">
                            Aktivitas Terbaru
                        </h3>
                        <Link to="/staff-portal/announcements" className="text-sm text-emerald-600 hover:underline flex items-center gap-1">
                            Lihat Semua <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-gray-700 rounded-lg">
                            <div className="p-2 rounded-full bg-emerald-100 text-emerald-600">
                                <DollarSign size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-text-main dark:text-white">Pembayaran SPP diterima</p>
                                <p className="text-xs text-text-secondary">Ahmad Rizki - Kelas 10A • 10 menit lalu</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-gray-700 rounded-lg">
                            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                                <GraduationCap size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-text-main dark:text-white">Siswa baru terdaftar</p>
                                <p className="text-xs text-text-secondary">Dewi Sartika - Kelas 7B • 1 jam lalu</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-gray-700 rounded-lg">
                            <div className="p-2 rounded-full bg-amber-100 text-amber-600">
                                <Package size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-text-main dark:text-white">Inventaris diperbarui</p>
                                <p className="text-xs text-text-secondary">Proyektor LCD ditambahkan • 2 jam lalu</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
