import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/common/PageHeader'
import StudentForm from '@/components/students/StudentForm'
import { useStudentMutations } from '@/hooks/useStudents'
import type { Student } from '@/types'

export default function StudentCreate() {
    const navigate = useNavigate()
    const { createStudent, loading, error } = useStudentMutations()

    const handleSubmit = async (data: Partial<Student>, photoFile?: File) => {
        const success = await createStudent(data, photoFile)
        if (success) {
            navigate('/students')
        }
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Tambah Siswa Baru"
                subtitle="Tambahkan data siswa baru ke dalam sistem"
                breadcrumb={[
                    { label: 'Siswa', path: '/students' },
                    { label: 'Tambah Baru' }
                ]}
            />

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <StudentForm
                onSubmit={handleSubmit}
                loading={loading}
                onCancel={() => navigate('/students')}
            />
        </div>
    )
}
