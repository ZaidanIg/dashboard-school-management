
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/common/PageHeader'
import TeacherForm from '@/components/teachers/TeacherForm'
import { useTeacherMutations } from '@/hooks/useTeachers'
import { useToast } from '@/contexts/ToastContext'
import { CheckCircle, Copy, X } from 'lucide-react'

export default function TeacherCreate() {
    const navigate = useNavigate()
    const { createTeacher, loading } = useTeacherMutations()
    const toast = useToast()
    const [createdCredentials, setCreatedCredentials] = useState<{ email: string, password: string } | null>(null)

    const handleSubmit = async (data: any) => {
        const result = await createTeacher(data)
        if (result) {
            if (data.password) {
                setCreatedCredentials({
                    email: data.email,
                    password: data.password
                })
                toast.success('Guru dan Akun berhasil dibuat')
            } else {
                toast.success('Guru berhasil ditambahkan')
                navigate('/teachers')
            }
        } else {
            toast.error('Gagal menambahkan guru')
        }
    }

    const handleClose = () => {
        navigate('/teachers')
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success('Disalin ke clipboard')
    }

    return (
        <div className="space-y-6 relative">
            <PageHeader
                title="Tambah Guru Baru"
                subtitle="Tambahkan data guru dan staff baru ke dalam sistem"
                breadcrumb={[
                    { label: 'Manajemen Guru', path: '/teachers' },
                    { label: 'Tambah Guru' }
                ]}
            />

            <TeacherForm
                onSubmit={handleSubmit}
                loading={loading}
                onCancel={() => navigate('/teachers')}
            />

            {/* Credentials Modal */}
            {createdCredentials && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full">
                                    <CheckCircle size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Akun Berhasil Dibuat</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Guru dapat login menggunakan kredensial berikut.</p>
                                </div>
                            </div>
                            <button onClick={handleClose} className="text-gray-400 hover:text-gray-500">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="bg-slate-50 dark:bg-gray-900 rounded-xl p-4 space-y-4 border border-gray-200 dark:border-gray-700">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</label>
                                <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <code className="text-sm font-mono text-gray-900 dark:text-white select-all">
                                        {createdCredentials.email}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(createdCredentials.email)}
                                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-500 transition-colors"
                                        title="Copy Email"
                                    >
                                        <Copy size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Password</label>
                                <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <code className="text-sm font-mono text-blue-600 dark:text-blue-400 font-bold select-all">
                                        {createdCredentials.password}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(createdCredentials.password)}
                                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-500 transition-colors"
                                        title="Copy Password"
                                    >
                                        <Copy size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={handleClose}
                                className="w-full py-2.5 px-4 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors"
                            >
                                Selesai & Kembali ke Daftar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
