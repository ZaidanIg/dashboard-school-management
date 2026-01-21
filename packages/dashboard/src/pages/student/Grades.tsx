import { useState } from 'react'
import PageHeader from '@/components/common/PageHeader'
import { Award, TrendingUp, Download, FileText, ChevronDown, Loader2 } from 'lucide-react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useAuthContext } from '@/contexts/AuthContext'
import { useSchoolProfile } from '@/hooks/useSettings'
import { useFetch } from '@/hooks/useShared'
import type { Student } from '@/types'

export default function StudentGrades() {
    const { user } = useAuthContext()
    const { school } = useSchoolProfile()
    const [selectedSemester, setSelectedSemester] = useState<1 | 2>(1)

    // Map selection 1->GANJIL, 2->GENAP
    // If your backend uses different values, adjust here.
    const semesterKey = selectedSemester === 1 ? 'GANJIL' : 'GENAP'

    // Fetch student profile including grades
    // Assuming /api/students/me returns the full Student object
    const { data: student, loading, error } = useFetch<Student>('/api/students/me')

    // Filter grades for current semester
    // Note: If grades are undefined, empty array is used
    const currentGrades = student?.grades?.filter(g => g.semester === semesterKey) || []

    // Calculate GPA from finalGrade
    const gpa = (currentGrades.reduce((acc, curr) => acc + (curr.finalGrade || 0), 0) / (currentGrades.length || 1)).toFixed(2)

    const handleDownloadPDF = () => {
        const doc = new jsPDF()

        // Header
        doc.setFontSize(18)
        doc.text(school?.name || 'SCHOOL MANAGEMENT SYSTEM', 105, 20, { align: 'center' })

        doc.setFontSize(14)
        doc.text('LAPORAN HASIL BELAJAR SISWA', 105, 30, { align: 'center' })

        // Line separator
        doc.setLineWidth(0.5)
        doc.line(20, 35, 190, 35)

        // Student Info
        doc.setFontSize(10)
        const startY = 45
        doc.text(`Nama Lengkap`, 20, startY)
        doc.text(`: ${student?.name || user?.name || '-'}`, 60, startY)

        doc.text(`NIS / NISN`, 20, startY + 6)
        doc.text(`: ${student?.nis || '-'} / ${student?.nisn || '-'}`, 60, startY + 6)

        doc.text(`Kelas`, 20, startY + 12)
        // Access class name via enrollment if available
        const className = student?.classEnrollments?.[0]?.class?.name || '-'
        doc.text(`: ${className}`, 60, startY + 12)

        doc.text(`Semester`, 20, startY + 18)
        doc.text(`: ${selectedSemester} (${semesterKey} 2024/2025)`, 60, startY + 18)

        // Table
        autoTable(doc, {
            startY: startY + 25,
            head: [['Mata Pelajaran', 'KKM', 'Tugas', 'UTS', 'UAS', 'Nilai Akhir', 'Predikat']],
            body: currentGrades.map(g => [
                g.subject?.name || '-',
                '75', // Default KKM if specific mapel KKM is not available
                g.assignment1?.toString() || '-',
                g.midtermExam?.toString() || '-',
                g.finalExam?.toString() || '-',
                g.finalGrade?.toString() || '-',
                g.letterGrade || '-'
            ]),
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            styles: { fontSize: 9, cellPadding: 3 },
            columnStyles: {
                0: { cellWidth: 50 }, // Mapel
                5: { fontStyle: 'bold' }, // Akhir
                6: { halign: 'center', fontStyle: 'bold' } // Predikat
            }
        })

        // Footer
        const finalY = (doc as any).lastAutoTable.finalY + 20
        doc.text('Mengetahui,', 140, finalY)
        doc.text('Wali Kelas', 140, finalY + 25)
        doc.text('( .............................. )', 140, finalY + 30)

        const date = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        doc.text(`Jakarta, ${date}`, 140, finalY - 5)

        doc.save(`Rapor_Semester_${selectedSemester}_${(student?.name || user?.name || 'Siswa').replace(/\s+/g, '_')}.pdf`)
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="text-text-secondary">Memuat data nilai...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                    <FileText className="text-rose-500" size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Gagal Memuat Nilai</h3>
                <p className="text-gray-500 max-w-sm mb-6">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                    Coba Lagi
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6 px-4 md:px-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PageHeader
                    title="Nilai Semester"
                    subtitle="Laporan hasil belajar dan evaluasi akademik"
                    breadcrumb={[{ label: 'Nilai' }]}
                />

                <div className="flex items-center gap-3">
                    {/* Semester Selector */}
                    <div className="relative">
                        <select
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(Number(e.target.value) as 1 | 2)}
                            className="appearance-none bg-white dark:bg-gray-800 border border-border-color dark:border-gray-700 text-text-main dark:text-white px-4 py-2 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-sm"
                        >
                            <option value={1}>Semester 1 (Ganjil)</option>
                            <option value={2}>Semester 2 (Genap)</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={16} />
                    </div>

                    <button
                        onClick={handleDownloadPDF}
                        disabled={currentGrades.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download size={18} />
                        <span className="hidden sm:inline">Download PDF</span>
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-border-color dark:border-gray-700 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-text-secondary">Rata-rata (GPA)</p>
                        <p className="text-2xl font-bold text-text-main dark:text-white">{gpa}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-border-color dark:border-gray-700 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-3 rounded-full bg-emerald-50 text-emerald-600">
                        <Award size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-text-secondary">Ranking Kelas</p>
                        <p className="text-2xl font-bold text-text-main dark:text-white">
                            - <span className="text-sm font-normal text-text-secondary">dari -</span>
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-border-color dark:border-gray-700 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                        <FileText size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-text-secondary">Total Mapel</p>
                        <p className="text-2xl font-bold text-text-main dark:text-white">{currentGrades.length ?? 0}</p>
                    </div>
                </div>
            </div>

            {/* Grade Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-border-color dark:border-gray-700 flex justify-between items-center bg-slate-50/50 dark:bg-gray-800/50">
                    <h3 className="font-bold text-lg text-text-main dark:text-white">Daftar Nilai Semester {selectedSemester} ({semesterKey})</h3>
                    <span className="text-xs text-text-secondary bg-white dark:bg-gray-700 px-3 py-1 rounded-full border border-border-color dark:border-gray-600 shadow-sm">
                        Tahun Ajaran 2024/2025
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Mata Pelajaran</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">KKM</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">Tugas</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">UTS</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">UAS</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">Nilai Akhir</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">Predikat</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-color dark:divide-gray-700">
                            {currentGrades && currentGrades.length > 0 ? (
                                currentGrades.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-text-main dark:text-white">
                                            {item.subject?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-center text-text-secondary dark:text-gray-400">
                                            75
                                        </td>
                                        <td className="px-6 py-4 text-sm text-center text-text-secondary dark:text-gray-300">
                                            {item.assignment1 ?? '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-center text-text-secondary dark:text-gray-300">
                                            {item.midtermExam ?? '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-center text-text-secondary dark:text-gray-300">
                                            {item.finalExam ?? '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-center font-bold text-text-main dark:text-white">
                                            {item.finalGrade ?? '-'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${item.letterGrade === 'A' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                                                    item.letterGrade === 'B' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                                                        item.letterGrade === 'C' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                                                            'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
                                                }`}>
                                                {item.letterGrade || '-'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center text-text-secondary">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="p-4 bg-slate-50 dark:bg-gray-800 rounded-full">
                                                <FileText className="text-slate-300 dark:text-gray-600" size={40} />
                                            </div>
                                            <p className="font-medium">Belum ada data nilai semester ini</p>
                                            <p className="text-sm text-text-secondary/70">Nilai akan muncul setelah guru melakukan penilaian</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
