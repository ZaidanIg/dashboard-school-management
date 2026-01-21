import { useState, useEffect } from 'react'
import { useAuthContext } from '../../contexts/AuthContext'
import {
    GraduationCap, Users, CheckCircle, Loader2,
    AlertCircle, BookOpen, ChevronRight
} from 'lucide-react'

interface ClassData {
    id: string
    name: string
    level: string
    capacity?: number
    studentCount: number
    homeroomTeacher?: { name: string }
    academicYear?: { name: string; isCurrent: boolean }
}

interface Enrollment {
    id: string
    status: string
    enrolledAt: string
    class: ClassData
}

interface StudentRecord {
    id: string
    name: string
    nis: string
    email?: string
}

export default function ClassEnrollment() {
    const { user } = useAuthContext()
    const [classes, setClasses] = useState<ClassData[]>([])
    const [enrollments, setEnrollments] = useState<Enrollment[]>([])
    const [studentRecord, setStudentRecord] = useState<StudentRecord | null>(null)
    const [loading, setLoading] = useState(true)
    const [enrolling, setEnrolling] = useState<string | null>(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        if (user?.email) {
            fetchStudentByEmail()
        } else {
            setLoading(false)
            setError('Tidak dapat menemukan data akun siswa')
        }
    }, [user])

    // First, find the student record by email
    const fetchStudentByEmail = async () => {
        setLoading(true)
        try {
            // Search for student by email
            const res = await fetch(`http://localhost:3001/api/students?search=${encodeURIComponent(user?.email || '')}&limit=1`)
            const result = await res.json()
            const students = result.data || result

            if (Array.isArray(students) && students.length > 0) {
                const student = students[0]
                setStudentRecord(student)
                // Now fetch classes and enrollments
                await fetchData(student.id)
            } else {
                setError('Data siswa tidak ditemukan. Silakan hubungi admin sekolah.')
                setLoading(false)
            }
        } catch (err) {
            console.error('Failed to fetch student by email', err)
            setError('Gagal memuat data siswa')
            setLoading(false)
        }
    }

    const fetchData = async (studentId: string) => {
        try {
            const [classesRes, enrollmentRes] = await Promise.all([
                fetch('http://localhost:3001/api/students/classes/available'),
                fetch(`http://localhost:3001/api/students/${studentId}/enrollment`)
            ])

            const classesData = await classesRes.json()
            const enrollmentData = await enrollmentRes.json()

            setClasses(classesData.data || [])
            setEnrollments(enrollmentData.data || [])
        } catch (err) {
            console.error('Failed to fetch data', err)
            setError('Gagal memuat data kelas')
        } finally {
            setLoading(false)
        }
    }

    const handleEnroll = async (classId: string) => {
        if (!studentRecord) {
            setError('Data siswa tidak ditemukan')
            return
        }

        setEnrolling(classId)
        setError('')
        setSuccess('')

        try {
            const res = await fetch(`http://localhost:3001/api/students/${studentRecord.id}/enrollment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ classId })
            })

            if (!res.ok) {
                const err = await res.json()
                if (res.status === 409) {
                    throw new Error('Anda sudah terdaftar di kelas ini.')
                }
                throw new Error(err.message || 'Gagal untuk mendaftar')
            }

            setSuccess('Berhasil bergabung ke kelas!')
            await fetchData(studentRecord.id)
        } catch (err: any) {
            setError(err.message || 'Gagal bergabung ke kelas')
        } finally {
            setEnrolling(null)
        }
    }

    const activeEnrollment = enrollments.find(e => e.status === 'ACTIVE')

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 size={32} className="animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-8 px-4 md:px-0">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pendaftaran Kelas</h1>
                <p className="text-slate-500">Bergabung dengan kelas untuk tahun ajaran ini</p>
                {studentRecord && (
                    <p className="text-sm text-primary mt-1">
                        Siswa: <span className="font-semibold">{studentRecord.name}</span> ({studentRecord.nis})
                    </p>
                )}
            </div>

            {/* Messages */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}
            {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-3">
                    <CheckCircle size={20} />
                    {success}
                </div>
            )}

            {/* Current Enrollment */}
            {activeEnrollment && (
                <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                            <GraduationCap size={32} />
                        </div>
                        <div>
                            <p className="text-blue-100 text-sm">Kelas Saat Ini</p>
                            <h2 className="text-2xl font-bold">{activeEnrollment.class.name}</h2>
                            <p className="text-blue-200 text-sm mt-1">
                                Bergabung sejak {new Date(activeEnrollment.enrolledAt).toLocaleDateString('id-ID', {
                                    day: 'numeric', month: 'long', year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Available Classes */}
            {studentRecord && (
                <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <BookOpen className="text-primary" size={20} />
                        Kelas Tersedia
                    </h2>

                    {classes.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Tidak ada kelas tersedia saat ini</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {classes.map((cls) => {
                                const isEnrolled = activeEnrollment?.class.id === cls.id
                                const hasActiveEnrollment = !!activeEnrollment
                                const isFull = cls.capacity && cls.studentCount >= cls.capacity

                                return (
                                    <div
                                        key={cls.id}
                                        className={`bg-white dark:bg-slate-800 rounded-xl border p-5 transition-all ${isEnrolled
                                            ? 'border-primary bg-primary/5'
                                            : 'border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:shadow-md'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{cls.name}</h3>
                                                <p className="text-sm text-slate-500">{cls.level}</p>
                                            </div>
                                            {isEnrolled && (
                                                <span className="px-2 py-1 bg-primary text-white text-xs font-bold rounded-full">
                                                    Kelas Saya
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-2 mb-4 text-sm">
                                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                <Users size={16} />
                                                <span>
                                                    {cls.studentCount} siswa
                                                    {cls.capacity && ` / ${cls.capacity} kapasitas`}
                                                </span>
                                            </div>
                                            {cls.homeroomTeacher && (
                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                    <GraduationCap size={16} />
                                                    <span>Wali: {cls.homeroomTeacher.name}</span>
                                                </div>
                                            )}
                                            {cls.academicYear && (
                                                <div className="text-xs text-slate-500">
                                                    {cls.academicYear.name}
                                                    {cls.academicYear.isCurrent && (
                                                        <span className="ml-2 px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded">Aktif</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {isEnrolled ? (
                                            <button disabled className="w-full py-2.5 bg-slate-100 text-slate-500 rounded-lg font-medium cursor-not-allowed">
                                                <CheckCircle size={16} className="inline mr-2" />
                                                Sudah Terdaftar
                                            </button>
                                        ) : hasActiveEnrollment ? (
                                            <button disabled className="w-full py-2.5 bg-slate-100 text-slate-500 rounded-lg font-medium cursor-not-allowed text-xs">
                                                Hubungi Admin untuk Pindah
                                            </button>
                                        ) : isFull ? (
                                            <button disabled className="w-full py-2.5 bg-slate-100 text-slate-500 rounded-lg font-medium cursor-not-allowed">
                                                Kelas Penuh
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleEnroll(cls.id)}
                                                disabled={enrolling === cls.id}
                                                className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {enrolling === cls.id ? (
                                                    <><Loader2 size={16} className="animate-spin" /> Mendaftar...</>
                                                ) : (
                                                    <>Gabung Kelas <ChevronRight size={16} /></>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}


        </div>
    )
}
