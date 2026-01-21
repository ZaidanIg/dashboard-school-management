import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '@/components/common/PageHeader'
import TeacherForm from '@/components/teachers/TeacherForm'
import { useTeacher, useTeacherMutations } from '@/hooks/useTeachers'
import { useToast } from '@/contexts/ToastContext'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorState from '@/components/common/ErrorState'

export default function TeacherEdit() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { teacher, loading: fetching, error } = useTeacher(id)
    const { updateTeacher, loading: updating } = useTeacherMutations()
    const toast = useToast()

    const handleSubmit = async (data: any) => {
        if (!id) return
        const result = await updateTeacher(id, data)
        if (result) {
            toast.success('Data guru berhasil diperbarui')
            navigate('/teachers')
        } else {
            toast.error('Gagal memperbarui data guru')
        }
    }

    if (fetching) return <LoadingSpinner fullPage text="Memuat data guru..." />
    if (error || !teacher) return <ErrorState message={error || 'Teacher not found'} />

    return (
        <div className="space-y-6">
            <PageHeader
                title="Edit Data Guru"
                subtitle={`Edit data guru: ${teacher.name}`}
                breadcrumb={[
                    { label: 'Manajemen Guru', path: '/teachers' },
                    { label: teacher.name, path: `/teachers/${id}` },
                    { label: 'Edit' }
                ]}
            />

            <TeacherForm
                initialData={teacher}
                onSubmit={handleSubmit}
                loading={updating}
                onCancel={() => navigate('/teachers')}
            />
        </div>
    )
}
