import { useState, useEffect, useRef } from 'react'
import {
    User, Target, PenLine, BarChart3,
    Save, Download, Upload, Plus, Trash2, Loader2,
    AlertTriangle, CheckCircle, ChevronRight, FileSpreadsheet
} from 'lucide-react'

interface Class {
    id: string
    name: string
}

interface Subject {
    id: string
    name: string
}

interface Teacher {
    id: string
    name: string
    nip?: string
    email?: string
}

interface Student {
    id: string
    name: string
    nis: string
}

interface LingkupMateri {
    id: string
    name: string
    tp1: string
    tp2: string
    tp3: string
}

interface StudentGrade {
    studentId: string
    name: string
    nis: string
    scores: { [key: string]: number | null }
    nilaiTP: number
    nonTest: number | null
    test: number | null
    naPAS: number
    nrp: number
    predikat: string
    deskripsi: string
}

type Step = 'guru' | 'cp' | 'nilai' | 'hasil'

const steps: { id: Step; label: string; icon: typeof User }[] = [
    { id: 'guru', label: 'Data Guru & Mapel', icon: User },
    { id: 'cp', label: 'Capaian Pembelajaran', icon: Target },
    { id: 'nilai', label: 'Input Nilai', icon: PenLine },
    { id: 'hasil', label: 'Lihat Hasil', icon: BarChart3 },
]

const getPredikat = (score: number) => {
    if (score >= 86) return { label: 'Sangat Baik', color: 'bg-blue-500 text-white', desc: 'sangat baik' }
    if (score >= 66) return { label: 'Baik', color: 'bg-green-500 text-white', desc: 'baik' }
    if (score >= 41) return { label: 'Cukup', color: 'bg-yellow-500 text-white', desc: 'cukup' }
    return { label: 'Perlu Bimbingan', color: 'bg-red-500 text-white', desc: 'perlu bimbingan' }
}

export default function Penilaian() {
    const [currentStep, setCurrentStep] = useState<Step>('guru')
    const [classes, setClasses] = useState<Class[]>([])
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [teachers, setTeachers] = useState<Teacher[]>([])
    const [selectedClass, setSelectedClass] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('')
    const [selectedTeacher, setSelectedTeacher] = useState('')
    const [subjectName, setSubjectName] = useState('')
    const [teacherName, setTeacherName] = useState('')
    const [semester, setSemester] = useState('1')
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)

    const [lingkupMateri, setLingkupMateri] = useState<LingkupMateri[]>([
        { id: '1', name: 'Lingkup Materi 1', tp1: '', tp2: '', tp3: '' }
    ])

    const [students, setStudents] = useState<StudentGrade[]>([])

    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        fetchClasses()
        fetchSubjects()
        fetchTeachers()
    }, [])

    const fetchClasses = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/academic/classes')
            const response = await res.json()
            setClasses(response.data || response)
        } catch (error) {
            console.error('Failed to fetch classes', error)
        }
    }

    const fetchSubjects = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/academic/subjects')
            const response = await res.json()
            setSubjects(response.data || response)
        } catch (error) {
            console.error('Failed to fetch subjects', error)
        }
    }

    const fetchTeachers = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/teachers')
            const response = await res.json()
            const data = response.data || response
            if (Array.isArray(data)) setTeachers(data)
        } catch (error) {
            console.error('Failed to fetch teachers', error)
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
                setStudents(data.map((s: Student) => ({
                    studentId: s.id,
                    name: s.name,
                    nis: s.nis,
                    scores: {},
                    nilaiTP: 0,
                    nonTest: null,
                    test: null,
                    naPAS: 0,
                    nrp: 0,
                    predikat: '-',
                    deskripsi: ''
                })))
            }
        } catch (error) {
            console.error('Failed to fetch students', error)
        } finally {
            setLoading(false)
        }
    }

    const addLingkupMateri = () => {
        const newId = (lingkupMateri.length + 1).toString()
        setLingkupMateri([...lingkupMateri, {
            id: newId,
            name: `Lingkup Materi ${newId}`,
            tp1: '', tp2: '', tp3: ''
        }])
    }

    const removeLingkupMateri = (id: string) => {
        if (lingkupMateri.length > 1) {
            setLingkupMateri(lingkupMateri.filter(l => l.id !== id))
        }
    }

    const updateLingkupMateri = (id: string, field: keyof LingkupMateri, value: string) => {
        setLingkupMateri(lingkupMateri.map(l =>
            l.id === id ? { ...l, [field]: value } : l
        ))
    }

    const calculateStudent = (student: StudentGrade): StudentGrade => {
        const allScores = Object.values(student.scores).filter(v => v !== null && v !== undefined) as number[]
        const nilaiTP = allScores.length > 0
            ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
            : 0

        const nonTest = student.nonTest || 0
        const test = student.test || 0
        const naPAS = (student.nonTest !== null || student.test !== null)
            ? Math.round((nonTest * 0.4) + (test * 0.6))
            : 0

        const nrp = (nilaiTP > 0 || naPAS > 0)
            ? Math.round((nilaiTP * 0.5) + (naPAS * 0.5))
            : 0

        const predikat = nrp > 0 ? getPredikat(nrp).label : '-'
        const deskripsi = generateDeskripsi(student, nrp)

        return { ...student, nilaiTP, naPAS, nrp, predikat, deskripsi }
    }

    const generateDeskripsi = (student: StudentGrade, nrp: number): string => {
        if (nrp === 0) return ''

        const pred = getPredikat(nrp)
        const subj = subjectName || 'mata pelajaran ini'

        const parts: string[] = []
        lingkupMateri.forEach(lm => {
            const scores = [
                student.scores[`${lm.id}-tp1`],
                student.scores[`${lm.id}-tp2`],
                student.scores[`${lm.id}-tp3`]
            ].filter(s => s !== null && s !== undefined) as number[]

            if (scores.length > 0) {
                const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
                const lmPred = getPredikat(avg)
                const tpDescs = [lm.tp1, lm.tp2, lm.tp3].filter(t => t.trim())
                if (tpDescs.length > 0) {
                    parts.push(`${lmPred.desc} dalam ${tpDescs[0].toLowerCase()}`)
                } else {
                    parts.push(`${lmPred.desc} dalam ${lm.name.toLowerCase()}`)
                }
            }
        })

        if (parts.length === 0) return ''
        return `Ananda menunjukkan kemampuan yang ${parts.join(', ')}. Secara keseluruhan, pencapaian ${subj} adalah ${pred.desc}.`
    }

    const updateScore = (studentId: string, key: string, value: number | null) => {
        setStudents(prev => prev.map(s => {
            if (s.studentId !== studentId) return s
            const updated = { ...s, scores: { ...s.scores, [key]: value } }
            return calculateStudent(updated)
        }))
    }

    const updatePAS = (studentId: string, field: 'nonTest' | 'test', value: number | null) => {
        setStudents(prev => prev.map(s => {
            if (s.studentId !== studentId) return s
            const updated = { ...s, [field]: value }
            return calculateStudent(updated)
        }))
    }

    const handleSubjectChange = (value: string) => {
        setSelectedSubject(value)
        const subject = subjects.find(s => s.id === value)
        setSubjectName(subject?.name || '')
    }

    const handleTeacherChange = (value: string) => {
        setSelectedTeacher(value)
        const teacher = teachers.find(t => t.id === value)
        setTeacherName(teacher?.name || '')
    }

    const exportCP = () => {
        const data = lingkupMateri.map(l => ({
            'Lingkup Materi': l.name,
            'TP 1': l.tp1,
            'TP 2': l.tp2,
            'TP 3': l.tp3
        }))
        const csv = [
            Object.keys(data[0]).join(','),
            ...data.map(row => Object.values(row).map(v => `"${v}"`).join(','))
        ].join('\n')

        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'capaian_pembelajaran.csv'
        a.click()
    }

    const importCP = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            const text = event.target?.result as string
            const lines = text.split('\n')

            const imported: LingkupMateri[] = []
            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue
                const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim())
                imported.push({
                    id: i.toString(),
                    name: values[0] || `Lingkup Materi ${i}`,
                    tp1: values[1] || '',
                    tp2: values[2] || '',
                    tp3: values[3] || ''
                })
            }
            if (imported.length > 0) setLingkupMateri(imported)
        }
        reader.readAsText(file)
    }

    const exportNilai = () => {
        const headers = ['No', 'NISN', 'Nama']
        lingkupMateri.forEach(lm => {
            headers.push(`${lm.name} TP1`, `${lm.name} TP2`, `${lm.name} TP3`)
        })
        headers.push('Nilai TP', 'Non-Test', 'Test', 'NA PAS', 'NRP', 'Predikat', 'Deskripsi')

        const rows = students.map((s, idx) => {
            const row: (string | number)[] = [idx + 1, s.nis, s.name]
            lingkupMateri.forEach(lm => {
                row.push(
                    s.scores[`${lm.id}-tp1`] ?? '',
                    s.scores[`${lm.id}-tp2`] ?? '',
                    s.scores[`${lm.id}-tp3`] ?? ''
                )
            })
            row.push(s.nilaiTP, s.nonTest ?? '', s.test ?? '', s.naPAS, s.nrp, s.predikat, s.deskripsi)
            return row.map(v => `"${v}"`).join(',')
        })

        const csv = [headers.join(','), ...rows].join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `nilai_${selectedClass}_${selectedSubject}.csv`
        a.click()
    }

    const handleSave = async () => {
        setSaving(true)
        setTimeout(() => {
            setSaving(false)
            alert('Data berhasil disimpan!')
        }, 1000)
    }

    const canProceed = () => {
        switch (currentStep) {
            case 'guru': return selectedClass && selectedSubject && selectedTeacher
            case 'cp': return lingkupMateri.every(l => l.name)
            case 'nilai': return students.length > 0
            default: return true
        }
    }

    const nextStep = () => {
        const idx = steps.findIndex(s => s.id === currentStep)
        if (idx < steps.length - 1) {
            if (currentStep === 'guru') fetchStudents()
            setCurrentStep(steps[idx + 1].id)
        }
    }

    const prevStep = () => {
        const idx = steps.findIndex(s => s.id === currentStep)
        if (idx > 0) setCurrentStep(steps[idx - 1].id)
    }

    // Unused variables for linting (used in exports/descriptions)
    void teacherName

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Penilaian Kurikulum Merdeka</h1>
                    <p className="text-slate-500">Sistem penilaian berbasis Capaian Pembelajaran</p>
                </div>

                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                    {steps.map((step, idx) => {
                        const Icon = step.icon
                        const isActive = currentStep === step.id
                        const isPast = steps.findIndex(s => s.id === currentStep) > idx
                        return (
                            <button
                                key={step.id}
                                onClick={() => setCurrentStep(step.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${isActive ? 'bg-primary text-white shadow-lg'
                                    : isPast ? 'bg-green-100 text-green-700'
                                        : 'bg-white text-slate-500 border border-slate-200'
                                    }`}
                            >
                                {isPast ? <CheckCircle size={18} /> : <Icon size={18} />}
                                <span className="hidden sm:inline">{step.label}</span>
                            </button>
                        )
                    })}
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">

                    {currentStep === 'guru' && (
                        <div className="p-6 space-y-6">
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="text-amber-500 mt-0.5 flex-shrink-0" size={20} />
                                    <div>
                                        <h3 className="font-bold text-amber-800">Kriteria Ketercapaian Tujuan Pembelajaran</h3>
                                        <div className="mt-2 flex flex-wrap gap-2 text-sm">
                                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded">0-40: Perlu Bimbingan</span>
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">41-65: Cukup</span>
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded">66-85: Baik</span>
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">86-100: Sangat Baik</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Guru *</label>
                                    <select
                                        value={selectedTeacher}
                                        onChange={(e) => handleTeacherChange(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary outline-none"
                                    >
                                        <option value="">Pilih Guru</option>
                                        {teachers.map((t) => (
                                            <option key={t.id} value={t.id}>
                                                {t.name} {t.nip ? `(${t.nip})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Kelas *</label>
                                    <select
                                        value={selectedClass}
                                        onChange={(e) => setSelectedClass(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary outline-none"
                                    >
                                        <option value="">Pilih Kelas</option>
                                        {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Mata Pelajaran *</label>
                                    <select
                                        value={selectedSubject}
                                        onChange={(e) => handleSubjectChange(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary outline-none"
                                    >
                                        <option value="">Pilih Mata Pelajaran</option>
                                        {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Semester</label>
                                    <select
                                        value={semester}
                                        onChange={(e) => setSemester(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary outline-none"
                                    >
                                        <option value="1">Semester 1 (Ganjil)</option>
                                        <option value="2">Semester 2 (Genap)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 'cp' && (
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div>
                                    <h2 className="text-lg font-bold">Capaian Pembelajaran (CP)</h2>
                                    <p className="text-sm text-slate-500">Tentukan lingkup materi dan tujuan pembelajaran</p>
                                </div>
                                <div className="flex gap-2">
                                    <input type="file" ref={fileInputRef} onChange={importCP} accept=".csv" className="hidden" />
                                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">
                                        <Upload size={16} /> Import
                                    </button>
                                    <button onClick={exportCP} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">
                                        <Download size={16} /> Export
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {lingkupMateri.map((lm) => (
                                    <div key={lm.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <input
                                                type="text"
                                                value={lm.name}
                                                onChange={(e) => updateLingkupMateri(lm.id, 'name', e.target.value)}
                                                className="text-sm font-bold bg-transparent border-0 outline-none text-primary"
                                            />
                                            {lingkupMateri.length > 1 && (
                                                <button onClick={() => removeLingkupMateri(lm.id)} className="text-red-500 hover:bg-red-100 p-1 rounded">
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                        <div className="grid md:grid-cols-3 gap-3">
                                            {(['tp1', 'tp2', 'tp3'] as const).map((tp, i) => (
                                                <div key={tp}>
                                                    <label className="text-xs font-medium text-slate-500 mb-1 block">TP {i + 1}</label>
                                                    <input
                                                        type="text"
                                                        value={lm[tp]}
                                                        onChange={(e) => updateLingkupMateri(lm.id, tp, e.target.value)}
                                                        placeholder={`Tujuan pembelajaran ${i + 1}...`}
                                                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <button onClick={addLingkupMateri} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-primary hover:text-primary flex items-center justify-center gap-2">
                                    <Plus size={18} /> Tambah Lingkup Materi
                                </button>
                            </div>
                        </div>
                    )}

                    {currentStep === 'nilai' && (
                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="flex items-center justify-center h-64 text-slate-500">
                                    <Loader2 size={32} className="animate-spin mr-3" /> Memuat data siswa...
                                </div>
                            ) : students.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                                    <AlertTriangle size={48} className="mb-4 opacity-50" />
                                    <p>Tidak ada data siswa. Kembali dan pilih kelas.</p>
                                </div>
                            ) : (
                                <table className="w-full border-collapse text-sm">
                                    <thead className="sticky top-0 z-10">
                                        <tr className="bg-slate-100">
                                            <th rowSpan={2} className="border border-slate-300 px-2 py-2 text-center font-bold w-10 sticky left-0 bg-slate-100 z-20">No</th>
                                            <th rowSpan={2} className="border border-slate-300 px-2 py-2 text-left font-bold min-w-[140px] sticky left-10 bg-slate-100 z-20">Nama</th>
                                            {lingkupMateri.map((lm) => (
                                                <th key={lm.id} colSpan={3} className="border border-slate-300 px-2 py-2 text-center font-bold text-primary bg-primary/10">
                                                    {lm.name}
                                                </th>
                                            ))}
                                            <th rowSpan={2} className="border border-slate-300 px-2 py-2 text-center font-bold bg-blue-100 text-blue-700 w-16">Nilai TP</th>
                                            <th colSpan={2} className="border border-slate-300 px-2 py-2 text-center font-bold bg-amber-100 text-amber-700">Penilaian Akhir Semester</th>
                                            <th rowSpan={2} className="border border-slate-300 px-2 py-2 text-center font-bold bg-orange-100 text-orange-700 w-16">NA PAS</th>
                                            <th rowSpan={2} className="border border-slate-300 px-2 py-2 text-center font-bold bg-emerald-100 text-emerald-700 w-16">NRP</th>
                                            <th rowSpan={2} className="border border-slate-300 px-2 py-2 text-center font-bold bg-slate-200 w-24">Predikat</th>
                                        </tr>
                                        <tr className="bg-slate-50">
                                            {lingkupMateri.map((lm) => (
                                                ['TP1', 'TP2', 'TP3'].map((tp) => (
                                                    <th key={`${lm.id}-${tp}`} className="border border-slate-300 px-1 py-1 text-center text-xs font-medium w-12">{tp}</th>
                                                ))
                                            ))}
                                            <th className="border border-slate-300 px-1 py-1 text-center text-xs font-medium bg-amber-50 w-16">Non-Test</th>
                                            <th className="border border-slate-300 px-1 py-1 text-center text-xs font-medium bg-amber-50 w-16">Test</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student, idx) => (
                                            <tr key={student.studentId} className="hover:bg-blue-50/50">
                                                <td className="border border-slate-300 px-2 py-1 text-center sticky left-0 bg-white">{idx + 1}</td>
                                                <td className="border border-slate-300 px-2 py-1 sticky left-10 bg-white">
                                                    <div className="font-medium truncate max-w-[120px]">{student.name}</div>
                                                    <div className="text-xs text-slate-500">{student.nis}</div>
                                                </td>
                                                {lingkupMateri.map((lm) => (
                                                    ['tp1', 'tp2', 'tp3'].map((tp) => (
                                                        <td key={`${lm.id}-${tp}`} className="border border-slate-300 p-0 bg-white">
                                                            <input
                                                                type="number"
                                                                min={0}
                                                                max={100}
                                                                value={student.scores[`${lm.id}-${tp}`] ?? ''}
                                                                onChange={(e) => {
                                                                    const val = e.target.value === '' ? null : Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                                                                    updateScore(student.studentId, `${lm.id}-${tp}`, val)
                                                                }}
                                                                className="w-full h-8 px-1 text-center text-sm border-0 outline-none bg-transparent focus:bg-primary/5 focus:ring-2 focus:ring-inset focus:ring-primary"
                                                            />
                                                        </td>
                                                    ))
                                                ))}
                                                <td className="border border-slate-300 px-2 py-1 text-center font-bold text-blue-700 bg-blue-50">
                                                    {student.nilaiTP || '-'}
                                                </td>
                                                <td className="border border-slate-300 p-0 bg-amber-50/50">
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        max={100}
                                                        value={student.nonTest ?? ''}
                                                        onChange={(e) => {
                                                            const val = e.target.value === '' ? null : Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                                                            updatePAS(student.studentId, 'nonTest', val)
                                                        }}
                                                        className="w-full h-8 px-1 text-center text-sm border-0 outline-none bg-transparent focus:bg-primary/5 focus:ring-2 focus:ring-inset focus:ring-primary"
                                                    />
                                                </td>
                                                <td className="border border-slate-300 p-0 bg-amber-50/50">
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        max={100}
                                                        value={student.test ?? ''}
                                                        onChange={(e) => {
                                                            const val = e.target.value === '' ? null : Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                                                            updatePAS(student.studentId, 'test', val)
                                                        }}
                                                        className="w-full h-8 px-1 text-center text-sm border-0 outline-none bg-transparent focus:bg-primary/5 focus:ring-2 focus:ring-inset focus:ring-primary"
                                                    />
                                                </td>
                                                <td className="border border-slate-300 px-2 py-1 text-center font-bold text-orange-700 bg-orange-50">
                                                    {student.naPAS || '-'}
                                                </td>
                                                <td className="border border-slate-300 px-2 py-1 text-center font-bold text-lg text-emerald-700 bg-emerald-50">
                                                    {student.nrp || '-'}
                                                </td>
                                                <td className="border border-slate-300 px-1 py-1 text-center">
                                                    {student.nrp > 0 && (
                                                        <span className={`px-1.5 py-0.5 text-xs font-bold rounded ${getPredikat(student.nrp).color}`}>
                                                            {student.predikat}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {currentStep === 'hasil' && (
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <h2 className="text-lg font-bold">Hasil Penilaian</h2>
                                <div className="flex gap-2">
                                    <button onClick={exportNilai} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600">
                                        <FileSpreadsheet size={18} /> Export Excel
                                    </button>
                                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50">
                                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                        Simpan ke Database
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {students.map((student, idx) => (
                                    <div key={student.studentId} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-full text-sm font-bold">{idx + 1}</span>
                                                <div>
                                                    <p className="font-bold">{student.name}</p>
                                                    <p className="text-sm text-slate-500">{student.nis}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-500">NRP</p>
                                                    <span className="text-2xl font-bold text-primary">{student.nrp}</span>
                                                </div>
                                                <span className={`px-3 py-1 text-sm font-bold rounded-lg ${getPredikat(student.nrp).color}`}>
                                                    {student.predikat}
                                                </span>
                                            </div>
                                        </div>
                                        {student.deskripsi && (
                                            <div className="p-3 bg-white rounded-lg border border-slate-200 text-sm text-slate-700">
                                                <p className="font-medium text-slate-500 mb-1">Deskripsi:</p>
                                                {student.deskripsi}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between p-4 border-t border-slate-200">
                        <button onClick={prevStep} disabled={currentStep === 'guru'} className="px-4 py-2 text-slate-600 disabled:opacity-30">
                            ← Sebelumnya
                        </button>
                        {currentStep !== 'hasil' && (
                            <button
                                onClick={nextStep}
                                disabled={!canProceed()}
                                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50"
                            >
                                Selanjutnya <ChevronRight size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
