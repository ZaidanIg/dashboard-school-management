import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Mail, Phone, MapPin, Calendar, User, Users, BookOpen, KeyRound, Copy, Check, Loader2 } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import StatusBadge from '@/components/common/StatusBadge'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorState from '@/components/common/ErrorState'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import { useStudent, useStudentMutations } from '@/hooks/useStudents'

interface CredentialStatus {
    hasAccount: boolean
    email: string | null
    hasPassword: boolean
    userId: string | null
    reason?: string
}

interface GeneratedCredentials {
    email: string
    password: string
    note: string
}

export default function StudentDetail() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { student, loading, error } = useStudent(id)
    const { deleteStudent, loading: deleting } = useStudentMutations()
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    // Credential management state
    const [credStatus, setCredStatus] = useState<CredentialStatus | null>(null)
    const [credLoading, setCredLoading] = useState(false)
    const [generatedCreds, setGeneratedCreds] = useState<GeneratedCredentials | null>(null)
    const [copied, setCopied] = useState(false)
    const [credError, setCredError] = useState('')

    useEffect(() => {
        if (id) checkCredentials()
    }, [id])

    const checkCredentials = async () => {
        try {
            const res = await fetch(`http://localhost:3001/api/students/${id}/credentials`)
            const data = await res.json()
            setCredStatus(data)
        } catch (err) {
            console.error('Failed to check credentials', err)
        }
    }

    const generateCredentials = async () => {
        setCredLoading(true)
        setCredError('')
        setGeneratedCreds(null)

        try {
            const res = await fetch(`http://localhost:3001/api/students/${id}/credentials`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.message || 'Failed to generate credentials')
            }

            const data = await res.json()
            setGeneratedCreds(data.credentials)
            checkCredentials()
        } catch (err: any) {
            setCredError(err.message || 'Gagal membuat kredensial')
        } finally {
            setCredLoading(false)
        }
    }

    const copyCredentials = () => {
        if (generatedCreds) {
            navigator.clipboard.writeText(`Email: ${generatedCreds.email}\nPassword: ${generatedCreds.password}`)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const handleDelete = async () => {
        if (!student) return
        const success = await deleteStudent(student.id)
        if (success) navigate('/students')
    }

    if (loading) return <LoadingSpinner fullPage text="Memuat data siswa..." />
    if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />
    if (!student) return <ErrorState message="Siswa tidak ditemukan" />

    const currentClass = student.classEnrollments?.find(e => e.status === 'ACTIVE')?.class

    // Calculate attendance stats
    const attendances = student.attendances || []
    const totalAttendance = attendances.length || 1
    const presentCount = attendances.filter(a => a.status === 'PRESENT').length
    const sickCount = attendances.filter(a => a.status === 'SICK').length
    const permitCount = attendances.filter(a => a.status === 'PERMITTED').length
    const absentCount = attendances.filter(a => a.status === 'ABSENT').length

    const attendance = {
        present: Math.round((presentCount / totalAttendance) * 100),
        sick: Math.round((sickCount / totalAttendance) * 100),
        permit: Math.round((permitCount / totalAttendance) * 100),
        absent: Math.round((absentCount / totalAttendance) * 100),
    }

    // Calculate average grade
    const grades = student.grades || []
    const avgGrade = grades.length > 0
        ? (grades.reduce((sum, g) => sum + (g.finalGrade || 0), 0) / grades.length).toFixed(1)
        : '-'

    return (
        <div className="space-y-6">
            <PageHeader
                title="Detail Siswa"
                breadcrumb={[
                    { label: 'Manajemen Siswa', path: '/students' },
                    { label: 'Data Siswa', path: '/students' },
                    { label: student.name },
                ]}
                actions={
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate(`/students/${student.id}/edit`)}
                            className="px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Hapus
                        </button>
                    </div>
                }
            />

            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                        {student.photo ? (
                            <img
                                src={`${import.meta.env.VITE_API_URL}${student.photo}`}
                                alt={student.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`
                                }}
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-2xl">
                                {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                            <h2 className="text-xl font-bold text-text-main dark:text-white">
                                {student.name}
                            </h2>
                            <StatusBadge
                                status={student.status === 'ACTIVE' ? 'active' : 'inactive'}
                                label={student.status === 'ACTIVE' ? 'Aktif' : student.status}
                            />
                        </div>
                        <p className="text-text-secondary mb-4">
                            NIS: {student.nis} | NISN: {student.nisn || '-'} | Kelas {currentClass?.name || '-'}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                            {student.email && (
                                <span className="flex items-center gap-1">
                                    <Mail size={16} /> {student.email}
                                </span>
                            )}
                            {student.phone && (
                                <span className="flex items-center gap-1">
                                    <Phone size={16} /> {student.phone}
                                </span>
                            )}
                            {student.address && (
                                <span className="flex items-center gap-1">
                                    <MapPin size={16} /> {student.address}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Login Credentials Card */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                    <KeyRound size={24} />
                    <h3 className="text-lg font-bold">Akses Student Portal</h3>
                </div>

                {credError && (
                    <div className="bg-red-500/20 border border-red-300/30 rounded-lg p-3 mb-4 text-sm">
                        {credError}
                    </div>
                )}

                {generatedCreds && (
                    <div className="bg-white/10 backdrop-blur rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm opacity-80">Kredensial Login:</span>
                            <button
                                onClick={copyCredentials}
                                className="flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30"
                            >
                                {copied ? <><Check size={12} /> Disalin!</> : <><Copy size={12} /> Salin</>}
                            </button>
                        </div>
                        <div className="font-mono text-sm space-y-1">
                            <p><span className="opacity-70">Email:</span> {generatedCreds.email}</p>
                            <p><span className="opacity-70">Password:</span> {generatedCreds.password}</p>
                        </div>
                        <p className="text-xs opacity-70 mt-2 italic">{generatedCreds.note}</p>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div className="text-sm">
                        {credStatus?.hasAccount ? (
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                Akun aktif: {credStatus.email}
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                                {credStatus?.reason || 'Belum memiliki akun login'}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={generateCredentials}
                        disabled={credLoading || !student.email}
                        className="px-4 py-2 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {credLoading && <Loader2 size={16} className="animate-spin" />}
                        {credStatus?.hasAccount ? 'Reset Password' : 'Buat Akun'}
                    </button>
                </div>
                {!student.email && (
                    <p className="text-xs mt-2 opacity-70">⚠️ Tambahkan email siswa terlebih dahulu untuk membuat akun login</p>
                )}
            </div>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Info */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                    <h3 className="flex items-center gap-2 text-base font-bold text-text-main dark:text-white mb-4">
                        <User size={20} className="text-primary" /> Informasi Pribadi
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-text-secondary">NIK</span>
                            <span className="text-text-main dark:text-white font-medium">{student.nik || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Tempat, Tanggal Lahir</span>
                            <span className="text-text-main dark:text-white font-medium">
                                {student.birthPlace || '-'}, {student.birthDate ? new Date(student.birthDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Jenis Kelamin</span>
                            <span className="text-text-main dark:text-white font-medium">
                                {student.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Agama</span>
                            <span className="text-text-main dark:text-white font-medium">{student.religion || '-'}</span>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                        <h4 className="text-sm font-semibold text-text-main dark:text-white mb-3">Alamat Domisili</h4>
                        <div className="space-y-2 text-sm">
                            <p className="text-text-main dark:text-white">{student.address || '-'}</p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-text-secondary">
                                <div>RT/RW: <span className="text-text-main dark:text-white">{student.rt || '-'}/{student.rw || '-'}</span></div>
                                <div>Kel/Desa: <span className="text-text-main dark:text-white">{student.village || '-'}</span></div>
                                <div>Kecamatan: <span className="text-text-main dark:text-white">{student.district || '-'}</span></div>
                                <div>Kota/Kab: <span className="text-text-main dark:text-white">{student.city || '-'}</span></div>
                                <div>Provinsi: <span className="text-text-main dark:text-white">{student.province || '-'}</span></div>
                                <div>Kode Pos: <span className="text-text-main dark:text-white">{student.postalCode || '-'}</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Parent Info */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                    <h3 className="flex items-center gap-2 text-base font-bold text-text-main dark:text-white mb-4">
                        <Users size={20} className="text-primary" /> Data Orang Tua & Wali
                    </h3>
                    <div className="space-y-6">
                        {/* Ayah */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-semibold text-text-main dark:text-white">Ayah</span>
                                <span className="text-text-secondary w-1/2 text-right">{student.fatherName || '-'}</span>
                            </div>
                            <div className="pl-4 border-l-2 border-gray-100 dark:border-gray-700 space-y-1 text-sm">
                                <div className="flex justify-between text-text-secondary">
                                    <span>NIK</span>
                                    <span className="text-text-main dark:text-white">{student.fatherNik || '-'}</span>
                                </div>
                                <div className="flex justify-between text-text-secondary">
                                    <span>Pekerjaan</span>
                                    <span className="text-text-main dark:text-white">{student.fatherJob || '-'}</span>
                                </div>
                                <div className="flex justify-between text-text-secondary">
                                    <span>Telepon</span>
                                    <span className="text-text-main dark:text-white">{student.fatherPhone || '-'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Ibu */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-semibold text-text-main dark:text-white">Ibu</span>
                                <span className="text-text-secondary w-1/2 text-right">{student.motherName || '-'}</span>
                            </div>
                            <div className="pl-4 border-l-2 border-gray-100 dark:border-gray-700 space-y-1 text-sm">
                                <div className="flex justify-between text-text-secondary">
                                    <span>NIK</span>
                                    <span className="text-text-main dark:text-white">{student.motherNik || '-'}</span>
                                </div>
                                <div className="flex justify-between text-text-secondary">
                                    <span>Pekerjaan</span>
                                    <span className="text-text-main dark:text-white">{student.motherJob || '-'}</span>
                                </div>
                                <div className="flex justify-between text-text-secondary">
                                    <span>Telepon</span>
                                    <span className="text-text-main dark:text-white">{student.motherPhone || '-'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Wali */}
                        {(student.guardianName) && (
                            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-semibold text-text-main dark:text-white">Wali ({student.guardianRelation || 'Wali'})</span>
                                    <span className="text-text-secondary w-1/2 text-right">{student.guardianName}</span>
                                </div>
                                <div className="pl-4 border-l-2 border-gray-100 dark:border-gray-700 space-y-1 text-sm">
                                    <div className="flex justify-between text-text-secondary">
                                        <span>Telepon</span>
                                        <span className="text-text-main dark:text-white">{student.guardianPhone || '-'}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Academic Summary */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                    <h3 className="flex items-center gap-2 text-base font-bold text-text-main dark:text-white mb-4">
                        <BookOpen size={20} className="text-primary" /> Ringkasan Akademik
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Rata-rata Nilai</span>
                            <span className="text-text-main dark:text-white font-bold text-lg">{avgGrade}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Total Mata Pelajaran</span>
                            <span className="text-text-main dark:text-white font-medium">{grades.length}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/grading/input')}
                        className="mt-4 text-sm text-primary font-medium hover:underline"
                    >
                        Lihat Detail Nilai →
                    </button>
                </div>

                {/* Attendance Summary */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                    <h3 className="flex items-center gap-2 text-base font-bold text-text-main dark:text-white mb-4">
                        <Calendar size={20} className="text-primary" /> Ringkasan Kehadiran
                    </h3>
                    <div className="space-y-3">
                        {[
                            { label: 'Hadir', value: attendance.present, color: 'bg-emerald-500' },
                            { label: 'Izin', value: attendance.permit, color: 'bg-amber-500' },
                            { label: 'Sakit', value: attendance.sick, color: 'bg-blue-500' },
                            { label: 'Alpha', value: attendance.absent, color: 'bg-rose-500' },
                        ].map(item => (
                            <div key={item.label} className="flex justify-between items-center">
                                <span className="text-text-secondary">{item.label}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }}></div>
                                    </div>
                                    <span className="text-text-main dark:text-white font-medium w-12 text-right">{item.value}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Hapus Siswa"
                message={`Apakah Anda yakin ingin menghapus siswa ${student.name}? Data akan dipindahkan ke sampah.`}
                confirmLabel="Hapus"
                variant="danger"
                isLoading={deleting}
            />
        </div>
    )
}

