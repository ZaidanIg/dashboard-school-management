import { Save } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useCurriculumType } from '@/contexts/CurriculumContext'

const students = [
    { id: '1', name: 'Ahmad Rizki', nis: '12345001', tugas1: 85, tugas2: 90, uts: 78, uas: null },
    { id: '2', name: 'Siti Aminah', nis: '12345002', tugas1: 92, tugas2: 88, uts: 85, uas: null },
    { id: '3', name: 'Budi Santoso', nis: '12345003', tugas1: 78, tugas2: 75, uts: 72, uas: null },
    { id: '4', name: 'Dewi Lestari', nis: '12345004', tugas1: 88, tugas2: 90, uts: 82, uas: null },
    { id: '5', name: 'Eko Prasetyo', nis: '12345005', tugas1: 80, tugas2: 82, uts: 75, uas: null },
    { id: '6', name: 'Fitri Handayani', nis: '12345006', tugas1: 95, tugas2: 93, uts: 90, uas: null },
]

export default function GradeInput() {
    const { curriculumType, loading } = useCurriculumType()

    // Show loading spinner while fetching curriculum type
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner />
            </div>
        )
    }

    // Redirect to Kurikulum Merdeka grading if selected
    if (curriculumType === 'MERDEKA') {
        return <Navigate to="/curriculum/penilaian-formatif" replace />
    }

    // K13 Grading UI (existing)
    const calculateAverage = (tugas1: number, tugas2: number, uts: number, uas: number | null) => {
        if (uas === null) {
            return ((tugas1 + tugas2) * 0.2 + uts * 0.3).toFixed(1)
        }
        return ((tugas1 + tugas2) * 0.2 + uts * 0.3 + uas * 0.3).toFixed(1)
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Input Nilai"
                subtitle="Input nilai siswa per mata pelajaran (Kurikulum 2013)"
                breadcrumb={[
                    { label: 'Penilaian', path: '/grading' },
                    { label: 'Input Nilai' },
                ]}
                actions={
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                        <Save size={18} />
                        Simpan Nilai
                    </button>
                }
            />

            {/* Curriculum Badge */}
            <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-medium">
                    Kurikulum 2013
                </span>
                <span className="text-xs text-text-secondary">
                    Untuk menggunakan Kurikulum Merdeka, ubah di{' '}
                    <a href="/curriculum/config" className="text-primary hover:underline">
                        Konfigurasi Kurikulum
                    </a>
                </span>
            </div>

            <FilterBar
                searchPlaceholder="Cari siswa..."
                filters={[
                    {
                        label: 'Pilih Kelas',
                        options: [
                            { label: '10-A', value: '10-A' },
                            { label: '10-B', value: '10-B' },
                            { label: '11-A', value: '11-A' },
                        ],
                    },
                    {
                        label: 'Mata Pelajaran',
                        options: [
                            { label: 'Matematika', value: 'MTK' },
                            { label: 'Fisika', value: 'FIS' },
                            { label: 'Kimia', value: 'KIM' },
                        ],
                    },
                    {
                        label: 'Semester',
                        options: [
                            { label: 'Ganjil', value: 'ganjil' },
                            { label: 'Genap', value: 'genap' },
                        ],
                    },
                ]}
            />

            {/* Grade Input Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-border-color dark:border-gray-700 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-text-main dark:text-white">Kelas 10-A • Matematika</h3>
                        <p className="text-sm text-text-secondary">Semester Ganjil 2024/2025</p>
                    </div>
                    <div className="text-sm text-text-secondary">
                        Bobot: Tugas 20% | UTS 30% | UAS 30% | Keaktifan 20%
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-gray-700/50">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">No</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">NIS</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Nama Siswa</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Tugas 1</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Tugas 2</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">UTS</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">UAS</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Rata-rata</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-color dark:divide-gray-700">
                            {students.map((student, index) => (
                                <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-gray-700/50">
                                    <td className="px-4 py-3 text-sm text-text-secondary">{index + 1}</td>
                                    <td className="px-4 py-3 text-sm text-text-main dark:text-white">{student.nis}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-text-main dark:text-white">{student.name}</td>
                                    <td className="px-4 py-3">
                                        <input
                                            type="number"
                                            defaultValue={student.tugas1}
                                            min="0"
                                            max="100"
                                            className="w-16 px-2 py-1 text-center text-sm bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded focus:ring-2 focus:ring-primary/50 focus:outline-none"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <input
                                            type="number"
                                            defaultValue={student.tugas2}
                                            min="0"
                                            max="100"
                                            className="w-16 px-2 py-1 text-center text-sm bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded focus:ring-2 focus:ring-primary/50 focus:outline-none"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <input
                                            type="number"
                                            defaultValue={student.uts}
                                            min="0"
                                            max="100"
                                            className="w-16 px-2 py-1 text-center text-sm bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded focus:ring-2 focus:ring-primary/50 focus:outline-none"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <input
                                            type="number"
                                            defaultValue={student.uas ?? ''}
                                            min="0"
                                            max="100"
                                            placeholder="-"
                                            className="w-16 px-2 py-1 text-center text-sm bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded focus:ring-2 focus:ring-primary/50 focus:outline-none"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="inline-flex items-center justify-center w-12 h-8 rounded bg-primary/10 text-primary font-bold text-sm">
                                            {calculateAverage(student.tugas1, student.tugas2, student.uts, student.uas)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
