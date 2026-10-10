import { useState, useEffect } from 'react'
import { Save, Loader2, Users } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import PageHeader from '@/components/common/PageHeader'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useCurriculumType } from '@/contexts/CurriculumContext'
import { useClasses } from '@/hooks/useClasses'
import { useSubjects } from '@/hooks/useSubjects'
import { useAcademicYears } from '@/hooks/useAcademicYears'
import { api } from '@/lib/api'
import { useToast } from '@/contexts/ToastContext'

interface StudentRow {
    id: string
    studentId: string
    name: string
    nis: string
    assignment1: number
    assignment2: number
    midtermExam: number
    finalExam: number | null
}

export default function GradeInput() {
    const { curriculumType, loading: currLoading } = useCurriculumType()
    const { classes } = useClasses()
    const { subjects } = useSubjects()
    const { years } = useAcademicYears()
    const { addToast } = useToast()

    const [selectedClass, setSelectedClass] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('')
    const [selectedSemester, setSelectedSemester] = useState<'GANJIL' | 'GENAP'>('GANJIL')
    const [students, setStudents] = useState<StudentRow[]>([])
    const [loadingStudents, setLoadingStudents] = useState(false)
    const [saving, setSaving] = useState(false)

    const activeYear = years.find(y => y.isActive) || years[0]

    // Set defaults when classes / subjects load
    useEffect(() => {
        if (!selectedClass && classes.length > 0) {
            setSelectedClass(classes[0].id)
        }
    }, [classes, selectedClass])

    useEffect(() => {
        if (!selectedSubject && subjects.length > 0) {
            setSelectedSubject(subjects[0].id)
        }
    }, [subjects, selectedSubject])

    // Fetch students and existing grades
    useEffect(() => {
        if (!selectedClass) return

        const fetchStudentGrades = async () => {
            setLoadingStudents(true)
            try {
                // Fetch students in class
                const studentsRes = await api.get<any>('/api/students', { classId: selectedClass })
                const studentList = Array.isArray(studentsRes) ? studentsRes : studentsRes?.data || []

                // Fetch existing grades if subject selected
                let existingGrades: any[] = []
                if (selectedSubject) {
                    try {
                        existingGrades = await api.get<any[]>('/api/grades', {
                            classId: selectedClass,
                            subjectId: selectedSubject,
                            semester: selectedSemester,
                            academicYearId: activeYear?.id
                        })
                    } catch {
                        existingGrades = []
                    }
                }

                const gradeMap = new Map<string, any>()
                if (Array.isArray(existingGrades)) {
                    existingGrades.forEach(g => {
                        gradeMap.set(g.studentId, g)
                    })
                }

                setStudents(
                    studentList.map((s: any) => {
                        const grade = gradeMap.get(s.id)
                        return {
                            id: s.id,
                            studentId: s.id,
                            name: s.name,
                            nis: s.nis || '-',
                            assignment1: grade?.assignment1 ?? 80,
                            assignment2: grade?.assignment2 ?? 80,
                            midtermExam: grade?.midtermExam ?? 75,
                            finalExam: grade?.finalExam ?? null
                        }
                    })
                )
            } catch (err) {
                console.error('Failed to load students and grades', err)
            } finally {
                setLoadingStudents(false)
            }
        }

        fetchStudentGrades()
    }, [selectedClass, selectedSubject, selectedSemester, activeYear?.id])

    // Redirect to Kurikulum Merdeka grading if selected
    if (!currLoading && curriculumType === 'MERDEKA') {
        return <Navigate to="/curriculum/penilaian-formatif" replace />
    }

    const calculateAverage = (t1: number, t2: number, uts: number, uas: number | null) => {
        if (uas === null) {
            return ((t1 + t2) * 0.25 + uts * 0.5).toFixed(1)
        }
        return ((t1 + t2) * 0.2 + uts * 0.3 + uas * 0.3).toFixed(1)
    }

    const handleScoreChange = (studentId: string, field: keyof StudentRow, value: any) => {
        setStudents(prev =>
            prev.map(s => (s.studentId === studentId ? { ...s, [field]: value } : s))
        )
    }

    const handleSave = async () => {
        if (!selectedClass || !selectedSubject) {
            addToast('error', 'Pilih kelas dan mata pelajaran terlebih dahulu')
            return
        }

        setSaving(true)
        try {
            const gradesPayload = students.map(s => ({
                studentId: s.studentId,
                subjectId: selectedSubject,
                academicYearId: activeYear?.id || '',
                semester: selectedSemester,
                assignment1: Number(s.assignment1) || 0,
                assignment2: Number(s.assignment2) || 0,
                midtermExam: Number(s.midtermExam) || 0,
                finalExam: s.finalExam !== null ? Number(s.finalExam) : 0,
                activityScore: 85
            }))

            await api.post('/api/grades/bulk', { grades: gradesPayload })
            addToast('success', 'Nilai Kurikulum 2013 berhasil disimpan!')
        } catch (error) {
            console.error('Failed to save grades', error)
            addToast('error', 'Gagal menyimpan nilai')
        } finally {
            setSaving(false)
        }
    }

    if (currLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner />
            </div>
        )
    }

    const currentClassName = classes.find(c => c.id === selectedClass)?.name || 'Pilih Kelas'
    const currentSubjectName = subjects.find(s => s.id === selectedSubject)?.name || 'Pilih Mapel'

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
                    <button
                        onClick={handleSave}
                        disabled={saving || students.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {saving ? 'Menyimpan...' : 'Simpan Nilai'}
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
                    <a href="/curriculum" className="text-primary hover:underline">
                        Manajemen Kurikulum
                    </a>
                </span>
            </div>

            {/* Selectors Bar */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-sm">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Kelas</label>
                    <select
                        value={selectedClass}
                        onChange={e => setSelectedClass(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Mata Pelajaran</label>
                    <select
                        value={selectedSubject}
                        onChange={e => setSelectedSubject(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        {subjects.map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Semester</label>
                    <select
                        value={selectedSemester}
                        onChange={e => setSelectedSemester(e.target.value as any)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        <option value="GANJIL">Semester Ganjil</option>
                        <option value="GENAP">Semester Genap</option>
                    </select>
                </div>
            </div>

            {/* Grade Input Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-border-color dark:border-gray-700 flex items-center justify-between flex-wrap gap-2">
                    <div>
                        <h3 className="font-semibold text-text-main dark:text-white">
                            {currentClassName} • {currentSubjectName}
                        </h3>
                        <p className="text-xs text-text-secondary">
                            Tahun Ajaran: {activeYear?.name || '-'} • Semester {selectedSemester}
                        </p>
                    </div>
                    <div className="text-xs text-text-secondary bg-slate-50 dark:bg-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600">
                        Bobot: Tugas 20% | UTS 30% | UAS 30% | Sikap & Keaktifan 20%
                    </div>
                </div>

                {loadingStudents ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner />
                    </div>
                ) : students.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <Users className="mx-auto mb-2 opacity-50" size={32} />
                        <p>Tidak ada siswa di kelas ini.</p>
                    </div>
                ) : (
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
                                        <td className="px-4 py-3 text-sm text-text-main dark:text-white font-mono">{student.nis}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-text-main dark:text-white">{student.name}</td>
                                        <td className="px-4 py-3 text-center">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={student.assignment1}
                                                onChange={e => handleScoreChange(student.studentId, 'assignment1', Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                                                className="w-16 px-2 py-1 text-center text-sm bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded focus:ring-2 focus:ring-primary/50 focus:outline-none"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={student.assignment2}
                                                onChange={e => handleScoreChange(student.studentId, 'assignment2', Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                                                className="w-16 px-2 py-1 text-center text-sm bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded focus:ring-2 focus:ring-primary/50 focus:outline-none"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={student.midtermExam}
                                                onChange={e => handleScoreChange(student.studentId, 'midtermExam', Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                                                className="w-16 px-2 py-1 text-center text-sm bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded focus:ring-2 focus:ring-primary/50 focus:outline-none"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                placeholder="-"
                                                value={student.finalExam ?? ''}
                                                onChange={e => handleScoreChange(student.studentId, 'finalExam', e.target.value === '' ? null : Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                                                className="w-16 px-2 py-1 text-center text-sm bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded focus:ring-2 focus:ring-primary/50 focus:outline-none"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="inline-flex items-center justify-center w-12 h-8 rounded bg-primary/10 text-primary font-bold text-sm">
                                                {calculateAverage(student.assignment1, student.assignment2, student.midtermExam, student.finalExam)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
