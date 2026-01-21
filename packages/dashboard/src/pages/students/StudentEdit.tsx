import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '@/components/common/PageHeader'
import StudentForm from '@/components/students/StudentForm'
import { useStudent, useStudentMutations } from '@/hooks/useStudents'
import type { Student } from '@/types'

export default function StudentEdit() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { student, loading: fetchLoading, error: fetchError } = useStudent(id)
    const { updateStudent, loading: updateLoading, error: updateError } = useStudentMutations()

    const handleSubmit = async (data: Partial<Student>, photoFile?: File) => {
        if (!id) return
        const success = await updateStudent(id, data, photoFile)
        if (success) {
            navigate(`/students/${id}`)
        }
    }

    if (fetchLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (fetchError || !student) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Error</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{fetchError || 'Student not found'}</p>
                <button
                    onClick={() => navigate('/students')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Kembali
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Edit Data Siswa"
                subtitle={`Edit data siswa: ${student.name}`}
                breadcrumb={[
                    { label: 'Siswa', path: '/students' },
                    { label: student.name, path: `/students/${id}` },
                    { label: 'Edit' }
                ]}
            />

            {updateError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{updateError}</span>
                </div>
            )}

            <StudentForm
                initialData={student}
                onSubmit={handleSubmit}
                loading={updateLoading}
                onCancel={() => navigate(`/students/${id}`)}
            />
        </div>
    )
}
