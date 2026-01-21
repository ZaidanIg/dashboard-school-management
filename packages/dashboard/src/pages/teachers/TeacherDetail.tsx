import { useParams, useNavigate } from 'react-router-dom'
import { User, MapPin, Phone, Mail, BookOpen, Calendar, Edit, Trash2, ArrowLeft } from 'lucide-react'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorState from '@/components/common/ErrorState'
import StatusBadge from '@/components/common/StatusBadge'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import { useTeacher, useTeacherMutations } from '@/hooks/useTeachers'
import { useToast } from '@/contexts/ToastContext'
import { useState } from 'react'

export default function TeacherDetail() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { teacher, loading, error } = useTeacher(id)
    const { deleteTeacher } = useTeacherMutations()
    const toast = useToast()
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    const handleDelete = async () => {
        if (!id) return
        const success = await deleteTeacher(id)
        if (success) {
            toast.success('Guru berhasil dihapus')
            navigate('/teachers')
        } else {
            toast.error('Gagal menghapus guru')
        }
    }

    if (loading) return <LoadingSpinner fullPage text="Memuat data guru..." />
    if (error || !teacher) return <ErrorState message={error || 'Guru tidak ditemukan'} />

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <button
                        onClick={() => navigate('/teachers')}
                        className="flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-2 transition-colors"
                    >
                        <ArrowLeft size={16} className="mr-1" />
                        Kembali ke Daftar Guru
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{teacher.name}</h1>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                            {teacher.nip ? `NIP: ${teacher.nip}` : 'NIP: -'}
                        </span>
                        <span>•</span>
                        <StatusBadge status={teacher.status === 'ACTIVE' ? 'active' : 'inactive'} label={teacher.status === 'ACTIVE' ? 'Aktif' : teacher.status} />
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate(`/teachers/${id}/edit`)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Edit size={16} />
                        Edit
                    </button>
                    <button
                        onClick={() => setIsDeleteOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors"
                    >
                        <Trash2 size={16} />
                        Hapus
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Profile Card */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                        <div className="px-6 pb-6">
                            <div className="relative flex justify-center -mt-16 mb-4">
                                <div className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-4xl">
                                        {teacher.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span>{teacher.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span>{teacher.address || '-'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span>{teacher.phone || '-'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span>{teacher.email || '-'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span>Bergabung: {teacher.joinDate ? new Date(teacher.joinDate).toLocaleDateString('id-ID') : '-'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Professional Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-500" />
                            Informasi Profesi
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">Posisi</label>
                                <p className="text-sm font-medium mt-1">{teacher.position}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">Status Sertifikasi</label>
                                <p className="text-sm font-medium mt-1">
                                    {teacher.isCertified ?
                                        <span className="text-emerald-600 flex items-center gap-1">Sudah Sertifikasi</span> :
                                        <span className="text-gray-600">Belum Sertifikasi</span>
                                    }
                                </p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">Tempat, Tanggal Lahir</label>
                                <p className="text-sm font-medium mt-1">
                                    {teacher.birthPlace ? `${teacher.birthPlace}, ` : ''}
                                    {teacher.birthDate ? new Date(teacher.birthDate).toLocaleDateString('id-ID') : '-'}
                                </p>
                            </div>
                        </div>

                        {/* Subjects */}
                        <div className="mt-6 border-t pt-6 border-gray-100 dark:border-gray-700">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Mata Pelajaran Diampu</h4>
                            {teacher.subjects && teacher.subjects.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {teacher.subjects.map(ts => (
                                        <span key={ts.id} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                            {ts.subject?.name}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">Belum ada mata pelajaran yang diampu.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Hapus Guru"
                message={`Apakah Anda yakin ingin menghapus data guru "${teacher.name}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Hapus"
                variant="danger"
            />
        </div>
    )
}
