import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Trash2, FileText, Plus } from 'lucide-react'
import StudentSelectorModal from '@/components/modals/StudentSelectorModal'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import { useClass } from '@/hooks/useClasses'
import { api } from '@/lib/api'
import { useToast } from '@/contexts/ToastContext'

export default function ClassDetail() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { classDetail, loading, error, refetch } = useClass(id)
    const [removingStudent, setRemovingStudent] = useState<{ id: string, name: string, enrollmentId: string } | null>(null)
    const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const toast = useToast()

    const handleAddStudent = async (student: { id: string, name: string }) => {
        if (!id) return
        setIsAddStudentOpen(false)
        // Use a separate loading state or reuse isProcessing but careful with modal closing
        // Better to show toast 'Adding...' 
        // We'll use global validation/toast feedback.

        try {
            await api.post('/api/students/' + student.id + '/enrollment', { classId: id })
            toast.success('Berhasil menambahkan siswa', student.name + ' berhasil ditambahkan ke kelas')
            refetch()
        } catch (err: any) {
            toast.error('Gagal menambahkan siswa', err.message || 'Terjadi kesalahan')
        }
    }

    const handleRemoveStudent = async () => {
        if (!removingStudent || !id) return

        setIsProcessing(true)
        try {
            await api.delete(`/api/students/${removingStudent.id}/enrollment/${removingStudent.enrollmentId}`)
            toast.success('Siswa berhasil dikeluarkan', `${removingStudent.name} telah dikeluarkan dari kelas`)
            setRemovingStudent(null)
            refetch()
        } catch (err: any) {
            toast.error('Gagal mengeluarkan siswa', err.message || 'Terjadi kesalahan')
        } finally {
            setIsProcessing(false)
        }
    }

    if (loading) return <LoadingSpinner fullPage text="Memuat detail kelas..." />
    if (error) return <ErrorState message={error} onRetry={refetch} />
    if (!classDetail) return <ErrorState message="Kelas tidak ditemukan" onRetry={refetch} />

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/students/classes')}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} className="text-text-secondary" />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-text-main dark:text-white">Kelas {classDetail.name}</h1>
                    <p className="text-text-secondary">Tahun Ajaran {classDetail.academicYear?.name} • Wali Kelas: {classDetail.homeroomTeacher?.name || '-'}</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-border-color dark:border-gray-700 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                        <User size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-text-secondary">Total Siswa</p>
                        <p className="text-2xl font-bold text-text-main dark:text-white">{classDetail.enrollments?.length || 0}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-border-color dark:border-gray-700 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                        <User size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-text-secondary">Kapasitas</p>
                        <p className="text-2xl font-bold text-text-main dark:text-white">{classDetail.capacity}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-border-color dark:border-gray-700 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
                        <FileText size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-text-secondary">Program</p>
                        <p className="text-2xl font-bold text-text-main dark:text-white">{classDetail.major || '-'}</p>
                    </div>
                </div>
            </div>

            {/* Students List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-border-color dark:border-gray-700 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-text-main dark:text-white">Daftar Siswa</h2>
                        <p className="text-sm text-text-secondary">{classDetail.enrollments?.length || 0} Siswa Terdaftar</p>
                    </div>
                    <button
                        onClick={() => setIsAddStudentOpen(true)}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                        <Plus size={16} />
                        Tambah Siswa
                    </button>
                </div>

                {!classDetail.enrollments || classDetail.enrollments.length === 0 ? (
                    <EmptyState
                        title="Belum ada siswa"
                        description="Belum ada siswa yang terdaftar di kelas ini."
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase">NIS / NISN</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Nama Siswa</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase">L/P</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Tanggal Masuk</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-text-secondary uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-color dark:divide-gray-700">
                                {classDetail.enrollments.map((enrollment) => (
                                    <tr key={enrollment.id} className="hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-text-main dark:text-white">{enrollment.student.nis}</div>
                                            <div className="text-xs text-text-secondary">{enrollment.student.nisn}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-text-main dark:text-white">{enrollment.student.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${enrollment.student.gender === 'MALE'
                                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                : 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
                                                }`}>
                                                {enrollment.student.gender === 'MALE' ? 'L' : 'P'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-text-secondary">
                                                {new Date(enrollment.enrolledAt).toLocaleDateString('id-ID', {
                                                    day: 'numeric', month: 'long', year: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setRemovingStudent({
                                                    id: enrollment.student.id,
                                                    name: enrollment.student.name,
                                                    enrollmentId: enrollment.id
                                                })}
                                                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 p-2 rounded-lg transition-colors"
                                                title="Keluarkan Siswa"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={!!removingStudent}
                onClose={() => setRemovingStudent(null)}
                onConfirm={handleRemoveStudent}
                title="Keluarkan Siswa"
                message={`Apakah Anda yakin ingin mengeluarkan siswa ${removingStudent?.name} dari kelas ini?`}
                confirmLabel="Keluarkan"
                variant="danger"
                isLoading={isProcessing}
            />

            <StudentSelectorModal
                isOpen={isAddStudentOpen}
                onClose={() => setIsAddStudentOpen(false)}
                onSelect={handleAddStudent}
                title={`Tambah Siswa ke Kelas ${classDetail.name}`}
                excludeStudentIds={classDetail.enrollments?.map(e => e.student.id) || []}
            />
        </div>
    )
}

