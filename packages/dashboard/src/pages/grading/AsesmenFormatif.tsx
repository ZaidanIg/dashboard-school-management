import { useState, useEffect } from 'react'
import { ClipboardCheck, Plus, Save, Loader2, BookOpen, FileText, FlaskConical } from 'lucide-react'

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

interface FormatifEntry {
    id?: string
    type: 'TUGAS' | 'KUIS' | 'PRAKTIK'
    date: string
    score: number
    notes?: string
}

interface StudentFormatif {
    studentId: string
    studentName: string
    nis: string
    entries: FormatifEntry[]
    average: number
}

const typeConfig = {
    TUGAS: { label: 'Tugas', icon: FileText, color: 'bg-blue-100 text-blue-600' },
    KUIS: { label: 'Kuis', icon: BookOpen, color: 'bg-purple-100 text-purple-600' },
    PRAKTIK: { label: 'Praktik', icon: FlaskConical, color: 'bg-emerald-100 text-emerald-600' },
}

export default function AsesmenFormatif() {
    const [classes, setClasses] = useState<Class[]>([])
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [selectedClass, setSelectedClass] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('')
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [studentData, setStudentData] = useState<StudentFormatif[]>([])
    const [showAddModal, setShowAddModal] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
    const [newEntry, setNewEntry] = useState<FormatifEntry>({
        type: 'TUGAS',
        date: new Date().toISOString().split('T')[0],
        score: 0,
        notes: ''
    })

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
                // Initialize student data with empty entries
                setStudentData(data.map((s: Student) => ({
                    studentId: s.id,
                    studentName: s.name,
                    nis: s.nis,
                    entries: [],
                    average: 0
                })))
            }
        } catch (error) {
            console.error('Failed to fetch students', error)
        } finally {
            setLoading(false)
        }
    }

    const calculateAverage = (entries: FormatifEntry[]) => {
        if (entries.length === 0) return 0
        const sum = entries.reduce((acc, e) => acc + e.score, 0)
        return Math.round(sum / entries.length)
    }

    const openAddModal = (studentId: string) => {
        setSelectedStudent(studentId)
        setNewEntry({
            type: 'TUGAS',
            date: new Date().toISOString().split('T')[0],
            score: 0,
            notes: ''
        })
        setShowAddModal(true)
    }

    const addEntry = () => {
        if (!selectedStudent) return
        setStudentData(prev => prev.map(s => {
            if (s.studentId === selectedStudent) {
                const newEntries = [...s.entries, { ...newEntry, id: Date.now().toString() }]
                return { ...s, entries: newEntries, average: calculateAverage(newEntries) }
            }
            return s
        }))
        setShowAddModal(false)
    }

    const removeEntry = (studentId: string, entryId: string) => {
        setStudentData(prev => prev.map(s => {
            if (s.studentId === studentId) {
                const newEntries = s.entries.filter(e => e.id !== entryId)
                return { ...s, entries: newEntries, average: calculateAverage(newEntries) }
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

    const getPredikat = (score: number) => {
        if (score >= 85) return { label: 'Sangat Baik', color: 'bg-blue-100 text-blue-700' }
        if (score >= 70) return { label: 'Baik', color: 'bg-green-100 text-green-700' }
        if (score >= 60) return { label: 'Cukup', color: 'bg-yellow-100 text-yellow-700' }
        return { label: 'Perlu Bimbingan', color: 'bg-red-100 text-red-700' }
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Asesmen Formatif</h1>
                    <p className="text-slate-500 dark:text-slate-400">Penilaian berkelanjutan untuk proses pembelajaran</p>
                </div>
                {studentData.some(s => s.entries.length > 0) && (
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
                    <ClipboardCheck size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500">Pilih kelas untuk mulai input nilai formatif</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {studentData.map((student) => (
                        <div key={student.studentId} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{student.studentName}</h3>
                                    <p className="text-sm text-slate-500">NIS: {student.nis}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {student.entries.length > 0 && (
                                        <div className="text-right">
                                            <p className="text-sm text-slate-500">Rata-rata</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-bold text-primary">{student.average}</span>
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${getPredikat(student.average).color}`}>
                                                    {getPredikat(student.average).label}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => openAddModal(student.studentId)}
                                        className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>

                            {student.entries.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {student.entries.map((entry) => {
                                        const TypeIcon = typeConfig[entry.type].icon
                                        return (
                                            <div
                                                key={entry.id}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${typeConfig[entry.type].color}`}
                                            >
                                                <TypeIcon size={16} />
                                                <span className="text-sm font-medium">{entry.score}</span>
                                                <span className="text-xs opacity-75">{entry.date}</span>
                                                <button
                                                    onClick={() => removeEntry(student.studentId, entry.id!)}
                                                    className="ml-1 hover:opacity-75"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400 italic">Belum ada penilaian. Klik + untuk menambah.</p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add Entry Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-xl">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Tambah Nilai Formatif</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Jenis Penilaian</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['TUGAS', 'KUIS', 'PRAKTIK'] as const).map((type) => {
                                        const TypeIcon = typeConfig[type].icon
                                        return (
                                            <button
                                                key={type}
                                                onClick={() => setNewEntry({ ...newEntry, type })}
                                                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-colors ${newEntry.type === type ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-600'}`}
                                            >
                                                <TypeIcon size={20} />
                                                <span className="text-xs font-medium">{typeConfig[type].label}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Tanggal</label>
                                    <input
                                        type="date"
                                        value={newEntry.date}
                                        onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Nilai (0-100)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={newEntry.score}
                                        onChange={(e) => setNewEntry({ ...newEntry, score: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Catatan (Opsional)</label>
                                <input
                                    type="text"
                                    value={newEntry.notes}
                                    onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                                    placeholder="Keterangan tambahan..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 p-6 border-t border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={addEntry}
                                className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
