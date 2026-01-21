import { useState } from 'react'
import { DollarSign, Calculator, Download, Users, Briefcase, Search } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import StatusBadge from '@/components/common/StatusBadge'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import StatsSummary from '@/components/common/StatsSummary'
import { useTeachers } from '@/hooks/useTeachers'
import type { Teacher } from '@/types/api'

// Salary calculation constants
const SALARY_RATES = {
    PNS: { baseSalary: 4500000, teachingHourRate: 50000, certificationBonus: 1000000 },
    HONORER: { baseSalary: 2500000, teachingHourRate: 35000, certificationBonus: 500000 },
    P3K: { baseSalary: 3500000, teachingHourRate: 45000, certificationBonus: 750000 },
    STAFF: { baseSalary: 2000000, teachingHourRate: 0, certificationBonus: 0 }
}

interface TeacherSalary extends Teacher {
    teachingHours: number
    baseSalary: number
    hourlyBonus: number
    certificationBonus: number
    totalSalary: number
}

export default function StaffSalary() {
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [positionFilter, setPositionFilter] = useState('')
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))

    const params: Record<string, string | number> = { page, limit: 50 }
    if (search) params.search = search
    if (positionFilter) params.position = positionFilter

    const { teachers, loading, error } = useTeachers(params)

    // Calculate salaries
    const teacherSalaries: TeacherSalary[] = teachers.map((teacher) => {
        const rates = SALARY_RATES[teacher.position as keyof typeof SALARY_RATES] || SALARY_RATES.HONORER
        const teachingHours = 24 // Placeholder - should come from actual schedule
        const hourlyBonus = teachingHours * rates.teachingHourRate
        const certificationBonus = teacher.isCertified ? rates.certificationBonus : 0
        const totalSalary = rates.baseSalary + hourlyBonus + certificationBonus

        return {
            ...teacher,
            teachingHours,
            baseSalary: rates.baseSalary,
            hourlyBonus,
            certificationBonus,
            totalSalary
        }
    })

    const totalPayroll = teacherSalaries.reduce((sum, t) => sum + t.totalSalary, 0)
    const pnsCount = teachers.filter(t => t.position === 'PNS').length
    const honorerCount = teachers.filter(t => t.position === 'HONORER').length
    const p3kCount = teachers.filter(t => t.position === 'P3K').length

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount)
    }

    const stats = [
        { label: 'Total Gaji Bulan Ini', value: formatCurrency(totalPayroll), icon: DollarSign, iconBg: 'bg-emerald-50 dark:bg-emerald-900/30', iconColor: 'text-emerald-600' },
        { label: 'Guru PNS', value: pnsCount.toString(), icon: Briefcase, iconBg: 'bg-blue-50 dark:bg-blue-900/30', iconColor: 'text-blue-600' },
        { label: 'Guru Honorer', value: honorerCount.toString(), icon: Users, iconBg: 'bg-amber-50 dark:bg-amber-900/30', iconColor: 'text-amber-600' },
        { label: 'Guru P3K', value: p3kCount.toString(), icon: Users, iconBg: 'bg-purple-50 dark:bg-purple-900/30', iconColor: 'text-purple-600' }
    ]

    return (
        <div className="space-y-6 px-4 md:px-0 pb-20">
            <PageHeader
                title="Gaji Guru"
                subtitle="Perhitungan dan pengelolaan gaji guru"
                breadcrumb={[
                    { label: 'Keuangan', path: '/staff-portal/finance/salary' },
                    { label: 'Gaji Guru' }
                ]}
                actions={
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors">
                            <Calculator size={18} />
                            Hitung Gaji
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-border-color dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800">
                            <Download size={18} />
                            Export
                        </button>
                    </div>
                }
            />

            <StatsSummary items={stats} />

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari nama guru..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-color dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
                <input
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="px-4 py-2.5 rounded-lg border border-border-color dark:border-gray-700 bg-white dark:bg-gray-800"
                />
                <select
                    value={positionFilter}
                    onChange={(e) => setPositionFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-lg border border-border-color dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                    <option value="">Semua Jabatan</option>
                    <option value="PNS">PNS</option>
                    <option value="HONORER">Honorer</option>
                    <option value="P3K">P3K</option>
                </select>
            </div>

            {/* Salary Table */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner />
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Nama</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-text-secondary uppercase">Jabatan</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase">Gaji Pokok</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-text-secondary uppercase">Jam Mengajar</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase">Tunjangan Jam</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase">Sertifikasi</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-color dark:divide-gray-700">
                                {teacherSalaries.map((teacher) => (
                                    <tr key={teacher.id} className="hover:bg-slate-50 dark:hover:bg-gray-700/30">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="size-8 rounded-full bg-cover bg-center bg-gray-200"
                                                    style={{
                                                        backgroundImage: `url('https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=random')`
                                                    }}
                                                />
                                                <div>
                                                    <p className="font-medium text-text-main dark:text-white">{teacher.name}</p>
                                                    <p className="text-xs text-text-secondary">{teacher.nip || '-'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <StatusBadge
                                                status={teacher.position === 'PNS' ? 'success' : teacher.position === 'HONORER' ? 'warning' : 'info'}
                                                label={teacher.position}
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm">{formatCurrency(teacher.baseSalary)}</td>
                                        <td className="px-4 py-3 text-center text-sm">{teacher.teachingHours} jam</td>
                                        <td className="px-4 py-3 text-right text-sm">{formatCurrency(teacher.hourlyBonus)}</td>
                                        <td className="px-4 py-3 text-right text-sm">
                                            {teacher.isCertified ? (
                                                <span className="text-emerald-600">{formatCurrency(teacher.certificationBonus)}</span>
                                            ) : (
                                                <span className="text-text-secondary">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="font-bold text-emerald-600">{formatCurrency(teacher.totalSalary)}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-emerald-50 dark:bg-emerald-900/20">
                                <tr>
                                    <td colSpan={6} className="px-4 py-3 text-right font-bold">Total Penggajian:</td>
                                    <td className="px-4 py-3 text-right font-bold text-emerald-700 dark:text-emerald-400 text-lg">
                                        {formatCurrency(totalPayroll)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}

            {/* Salary Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Keterangan Perhitungan Gaji</h4>
                <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
                    <li>• PNS: Gaji Pokok Rp 4.500.000 + Rp 50.000/jam mengajar + Tunjangan Sertifikasi Rp 1.000.000</li>
                    <li>• Honorer: Gaji Pokok Rp 2.500.000 + Rp 35.000/jam mengajar + Tunjangan Sertifikasi Rp 500.000</li>
                    <li>• P3K: Gaji Pokok Rp 3.500.000 + Rp 45.000/jam mengajar + Tunjangan Sertifikasi Rp 750.000</li>
                </ul>
            </div>
        </div>
    )
}
