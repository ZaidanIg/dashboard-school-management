import { useState, useEffect } from 'react'
import { Award, Loader2 } from 'lucide-react'

interface Student {
    id: string
    name: string
    nis: string
}

interface Class {
    id: string
    name: string
}

interface Subject {
    id: string
    name: string
}

interface StudentFinal {
    studentId: string
    studentName: string
    nis: string
    formatifAvg: number
    utsScore: number
    uasScore: number
    nilaiAkhir: number
    predikat: string
}

export default function NilaiAkhir() {
    const [classes, setClasses] = useState<Class[]>([])
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [selectedClass, setSelectedClass] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('')
    const [loading, setLoading] = useState(false)
    const [studentData, setStudentData] = useState<StudentFinal[]>([])

    useEffect(() => {
        fetchClasses()
        fetchSubjects()
    }, [])

    useEffect(() => {
        if (selectedClass && selectedSubject) {
            fetchFinalGrades()
        }
    }, [selectedClass, selectedSubject])

    const fetchClasses = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/academic/classes')
            const response = await res.json()
            const data = response.data || response
            if (Array.isArray(data)) setClasses(data)
        } catch (error) {
            console.error('Failed to fetch classes', error)
        }
    }

    const fetchSubjects = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/academic/subjects')
            const response = await res.json()
            const data = response.data || response
            if (Array.isArray(data)) setSubjects(data)
        } catch (error) {
            console.error('Failed to fetch subjects', error)
        }
    }

    const fetchFinalGrades = async () => {
        if (!selectedClass) return
        setLoading(true)
        try {
            const res = await fetch(`http://localhost:3001/api/students?classId=${selectedClass}`)
            const response = await res.json()
            const data = response.data || response
            if (Array.isArray(data)) {
                // Mock data - In real implementation, fetch from grading API
                setStudentData(data.map((s: Student) => {
                    const formatifAvg = Math.floor(Math.random() * 30) + 70
                    const utsScore = Math.floor(Math.random() * 30) + 70
                    const uasScore = Math.floor(Math.random() * 30) + 70
                    // Formatif 30%, UTS 30%, UAS 40%
                    const nilaiAkhir = Math.round((formatifAvg * 0.3) + (utsScore * 0.3) + (uasScore * 0.4))

                    let predikat = 'Perlu Bimbingan'
                    if (nilaiAkhir >= 85) predikat = 'Sangat Baik'
                    else if (nilaiAkhir >= 70) predikat = 'Baik'
                    else if (nilaiAkhir >= 60) predikat = 'Cukup'

                    return {
                        studentId: s.id,
                        studentName: s.name,
                        nis: s.nis,
                        formatifAvg,
                        utsScore,
                        uasScore,
                        nilaiAkhir,
                        predikat
                    }
                }))
            }
        } catch (error) {
            console.error('Failed to fetch students', error)
        } finally {
            setLoading(false)
        }
    }

    const getPredikatColor = (predikat: string) => {
        switch (predikat) {
            case 'Sangat Baik': return 'bg-blue-100 text-blue-700 border-blue-200'
            case 'Baik': return 'bg-green-100 text-green-700 border-green-200'
            case 'Cukup': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
            case 'Perlu Bimbingan': return 'bg-red-100 text-red-700 border-red-200'
            default: return 'bg-slate-100 text-slate-500 border-slate-200'
        }
    }

    const getPredikatIcon = (predikat: string) => {
        switch (predikat) {
            case 'Sangat Baik': return '🔵'
            case 'Baik': return '🟢'
            case 'Cukup': return '🟡'
            case 'Perlu Bimbingan': return '🔴'
            default: return '⚪'
        }
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Nilai Akhir</h1>
                <p className="text-slate-500 dark:text-slate-400">Rekap nilai akhir semester per mata pelajaran</p>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Kelas</label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        >
                            <option value="">Pilih Kelas</option>
                            {classes.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Mata Pelajaran</label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        >
                            <option value="">Pilih Mata Pelajaran</option>
                            {subjects.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-sm">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">🔵 Sangat Baik (85-100)</span>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">🟢 Baik (70-84)</span>
                <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">🟡 Cukup (60-69)</span>
                <span className="px-3 py-1 rounded-full bg-red-100 text-red-700">🔴 Perlu Bimbingan (&lt;60)</span>
            </div>

            {/* Content */}
            {loading ? (
                <div className="text-center py-12 text-slate-500">
                    <Loader2 size={32} className="animate-spin mx-auto mb-4" />
                    Memuat data nilai...
                </div>
            ) : !selectedClass || !selectedSubject ? (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <Award size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500">Pilih kelas dan mata pelajaran untuk melihat nilai akhir</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">No</th>
                                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Nama Siswa</th>
                                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">NIS</th>
                                    <th className="text-center px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Formatif (30%)</th>
                                    <th className="text-center px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">UTS (30%)</th>
                                    <th className="text-center px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">UAS (40%)</th>
                                    <th className="text-center px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Nilai Akhir</th>
                                    <th className="text-center px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Predikat</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {studentData.map((student, idx) => (
                                    <tr key={student.studentId} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{idx + 1}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{student.studentName}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{student.nis}</td>
                                        <td className="px-4 py-3 text-center text-sm">{student.formatifAvg}</td>
                                        <td className="px-4 py-3 text-center text-sm">{student.utsScore}</td>
                                        <td className="px-4 py-3 text-center text-sm">{student.uasScore}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-xl font-bold text-primary">{student.nilaiAkhir}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border ${getPredikatColor(student.predikat)}`}>
                                                {getPredikatIcon(student.predikat)} {student.predikat}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
