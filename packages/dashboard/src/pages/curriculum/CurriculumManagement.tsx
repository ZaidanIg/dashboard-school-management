import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    BookOpen, CheckCircle, School, Lightbulb,
    FileText, ClipboardCheck, Users, FolderOpen, Settings, ArrowRight
} from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useCurriculumType } from '@/contexts/CurriculumContext'
import type { CurriculumType } from '@/contexts/CurriculumContext'

// K13 menu items
const k13MenuItems = [
    { title: 'Input Nilai', path: '/grading/input', icon: ClipboardCheck, description: 'Input nilai angka siswa' },
    { title: 'Rapor', path: '/grading/reports', icon: FileText, description: 'Generate rapor siswa' },
    { title: 'Analitik Nilai', path: '/grading/analytics', icon: Settings, description: 'Analisis performa siswa' },
]

// Merdeka menu items
const merdekaMenuItems = [
    { title: 'Capaian Pembelajaran', path: '/curriculum/cp', icon: BookOpen, description: 'Kelola CP per mata pelajaran' },
    { title: 'Modul Ajar', path: '/curriculum/modul-ajar', icon: FileText, description: 'Buat dan kelola modul ajar' },
    { title: 'Penilaian Formatif', path: '/curriculum/penilaian-formatif', icon: ClipboardCheck, description: 'Input penilaian harian' },
    { title: 'Penilaian Sumatif', path: '/curriculum/penilaian-sumatif', icon: ClipboardCheck, description: 'Input STS, SAS' },
    { title: 'Proyek P7', path: '/curriculum/p7', icon: Users, description: 'Projek Profil Pelajar Pancasila' },
    { title: 'Portofolio', path: '/curriculum/portofolio', icon: FolderOpen, description: 'Portofolio hasil belajar siswa' },
]

export default function CurriculumManagement() {
    const { curriculumType, loading, setCurriculumType, error } = useCurriculumType()
    const [saving, setSaving] = useState(false)
    const [showConfirm, setShowConfirm] = useState<CurriculumType | null>(null)

    const handleSelect = async (type: CurriculumType) => {
        if (type === curriculumType) return
        setShowConfirm(type)
    }

    const confirmChange = async () => {
        if (!showConfirm) return
        setSaving(true)
        await setCurriculumType(showConfirm)
        setSaving(false)
        setShowConfirm(null)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner />
            </div>
        )
    }

    const activeMenuItems = curriculumType === 'K13' ? k13MenuItems : merdekaMenuItems

    return (
        <div className="space-y-6">
            <PageHeader
                title="Manajemen Kurikulum"
                subtitle="Pilih dan kelola kurikulum yang digunakan sekolah"
                breadcrumb={[
                    { label: 'Kurikulum', path: '/curriculum' },
                    { label: 'Manajemen' }
                ]}
            />

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
                    {error}
                </div>
            )}

            {/* Curriculum Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* K13 Card */}
                <div
                    onClick={() => handleSelect('K13')}
                    className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all ${curriculumType === 'K13'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                >
                    {curriculumType === 'K13' && (
                        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-medium">
                            <CheckCircle size={14} />
                            Aktif
                        </div>
                    )}
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${curriculumType === 'K13' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                            }`}>
                            <School size={28} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-text-main dark:text-white">Kurikulum 2013</h3>
                            <p className="text-sm text-text-secondary">Penilaian angka (0-100)</p>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">Tugas</span>
                        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">UTS</span>
                        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">UAS</span>
                        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">Rapor A-E</span>
                    </div>
                </div>

                {/* Merdeka Card */}
                <div
                    onClick={() => handleSelect('MERDEKA')}
                    className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all ${curriculumType === 'MERDEKA'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                >
                    {curriculumType === 'MERDEKA' && (
                        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-medium">
                            <CheckCircle size={14} />
                            Aktif
                        </div>
                    )}
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${curriculumType === 'MERDEKA' ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                            }`}>
                            <Lightbulb size={28} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-text-main dark:text-white">Kurikulum Merdeka</h3>
                            <p className="text-sm text-text-secondary">Capaian Pembelajaran + P7</p>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">CP</span>
                        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">Formatif</span>
                        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">Sumatif</span>
                        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">P7</span>
                        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">Portofolio</span>
                    </div>
                </div>
            </div>

            {/* Active Curriculum Features */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-text-main dark:text-white flex items-center gap-2">
                        {curriculumType === 'K13' ? <School size={20} /> : <Lightbulb size={20} />}
                        Fitur {curriculumType === 'K13' ? 'Kurikulum 2013' : 'Kurikulum Merdeka'}
                    </h3>
                    {curriculumType === 'MERDEKA' && (
                        <Link
                            to="/kurikulum-merdeka"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                            Lihat Dashboard <ArrowRight size={14} />
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeMenuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="flex items-center gap-3 p-4 rounded-lg border border-border-color dark:border-gray-700 hover:border-primary hover:bg-primary/5 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                <item.icon size={20} />
                            </div>
                            <div>
                                <h4 className="font-medium text-text-main dark:text-white group-hover:text-primary transition-colors">
                                    {item.title}
                                </h4>
                                <p className="text-xs text-text-secondary">{item.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* P7 Dimensions (only for Merdeka) */}
            {curriculumType === 'MERDEKA' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                    <h3 className="font-semibold text-text-main dark:text-white mb-4">
                        6 Dimensi Profil Pelajar Pancasila
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {[
                            { kode: 'D1', nama: 'Beriman & Berakhlak', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' },
                            { kode: 'D2', nama: 'Berkebinekaan Global', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
                            { kode: 'D3', nama: 'Gotong Royong', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
                            { kode: 'D4', nama: 'Mandiri', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
                            { kode: 'D5', nama: 'Bernalar Kritis', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
                            { kode: 'D6', nama: 'Kreatif', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' }
                        ].map((d) => (
                            <div key={d.kode} className={`${d.color} rounded-lg p-3 text-center`}>
                                <p className="font-bold text-lg">{d.kode}</p>
                                <p className="text-xs mt-1">{d.nama}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-text-main dark:text-white mb-2">
                            Ubah Kurikulum Aktif?
                        </h3>
                        <p className="text-text-secondary mb-4">
                            Sistem penilaian akan berubah ke{' '}
                            <strong>{showConfirm === 'K13' ? 'Kurikulum 2013' : 'Kurikulum Merdeka'}</strong>.
                            Data yang sudah ada tetap tersimpan.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirm(null)}
                                disabled={saving}
                                className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmChange}
                                disabled={saving}
                                className="flex-1 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                            >
                                {saving ? 'Menyimpan...' : 'Ya, Ubah'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
