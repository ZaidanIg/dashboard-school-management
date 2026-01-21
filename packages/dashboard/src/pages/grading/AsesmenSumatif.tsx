import { useState, useEffect } from 'react'
import { FileCheck, Save, Loader2 } from 'lucide-react'

interface Student {
    id: string
    name: string
    nis: string
}

interface Class {
    id: string
    name: string
    grade: number
}

interface Subject {
    id: string
    name: string
    code: string
}

interface StudentSumatif {
    studentId: string
    studentName: string
    nis: string
    utsScore: number | null
    uasScore: number | null
    nilaiAkhir: number
    predikat: string
}

export default function AsesmenSumatif() {
    const [classes, setClasses] = useState<Class[]>([])
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [selectedClass, setSelectedClass] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('')
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [studentData, setStudentData] = useState<StudentSumatif[]>([])

    useEffect(() => {
        fetchClasses()
        fetchSubjects()
    }, [])

    useEffect(() => {
        if (selectedClass) {
            fetchStudents()
        }
    }, [selectedClass])

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

    const fetchStudents = async () => {
        if (!selectedClass) return
        setLoading(true)
        try {
            const res = await fetch(`http://localhost:3001/api/students?classId=${selectedClass}`)
            const response = await res.json()
            const data = response.data || response
            if (Array.isArray(data)) {
                setStudentData(data.map((s: Student) => ({
                    studentId: s.id,
                    studentName: s.name,
                    nis: s.nis,
                    utsScore: null,
                    uasScore: null,
                    nilaiAkhir: 0,
                    predikat: '-'
                })))
            }
        } catch (error) {
            console.error('Failed to fetch students', error)
        } finally {
            setLoading(false)
        }
    }

    const calculateFinal = (uts: number | null, uas: number | null): { nilaiAkhir: number, predikat: string } => {
        if (uts === null && uas === null) return { nilaiAkhir: 0, predikat: '-' }
        const utsVal = uts || 0
        const uasVal = uas || 0
        // UTS 40%, UAS 60%
        const nilaiAkhir = Math.round((utsVal * 0.4) + (uasVal * 0.6))

        let predikat = 'Perlu Bimbingan'
        if (nilaiAkhir >= 85) predikat = 'Sangat Baik'
        else if (nilaiAkhir >= 70) predikat = 'Baik'
        else if (nilaiAkhir >= 60) predikat = 'Cukup'

        return { nilaiAkhir, predikat }
    }

    const updateScore = (studentId: string, field: 'utsScore' | 'uasScore', value: number | null) => {
        setStudentData(prev => prev.map(s => {
            if (s.studentId === studentId) {
                const newData = { ...s, [field]: value }
                const { nilaiAkhir, predikat } = calculateFinal(
                    field === 'utsScore' ? value : s.utsScore,
                    field === 'uasScore' ? value : s.uasScore
                )
                return { ...newData, nilaiAkhir, predikat }
            }
            return s
        }))
    }

    const handleSave = async () => {
        setSaving(true)
        // TODO: Implement save to API
        setTimeout(() => {
            setSaving(false)
            alert('Data berhasil disimpan!')
        }, 1000)
    }

    const getPredikatColor = (predikat: string) => {
        switch (predikat) {
            case 'Sangat Baik': return 'bg-blue-100 text-blue-700'
            case 'Baik': return 'bg-green-100 text-green-700'
            case 'Cukup': return 'bg-yellow-100 text-yellow-700'
            case 'Perlu Bimbingan': return 'bg-red-100 text-red-700'
            default: return 'bg-slate-100 text-slate-500'
        }
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Asesmen Sumatif</h1>
                    <p className="text-slate-500 dark:text-slate-400">Penilaian akhir semester (UTS & UAS)</p>
                </div>
                {studentData.length > 0 && (
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        Simpan Data
                    </button>
                )}
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

            {/* Content */}
            {loading ? (
                <div className="text-center py-12 text-slate-500">
                    <Loader2 size={32} className="animate-spin mx-auto mb-4" />
                    Memuat data siswa...
                </div>
            ) : !selectedClass ? (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <FileCheck size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500">Pilih kelas untuk mulai input nilai sumatif</p>
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
                                    <th className="text-center px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">UTS (40%)</th>
                                    <th className="text-center px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">UAS (60%)</th>
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
                                        <td className="px-4 py-3">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={student.utsScore ?? ''}
                                                onChange={(e) => updateScore(student.studentId, 'utsScore', e.target.value ? parseInt(e.target.value) : null)}
                                                className="w-20 mx-auto block px-3 py-1.5 text-center rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                                placeholder="-"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={student.uasScore ?? ''}
                                                onChange={(e) => updateScore(student.studentId, 'uasScore', e.target.value ? parseInt(e.target.value) : null)}
                                                className="w-20 mx-auto block px-3 py-1.5 text-center rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                                placeholder="-"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-lg font-bold text-primary">{student.nilaiAkhir || '-'}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getPredikatColor(student.predikat)}`}>
                                                {student.predikat}
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
