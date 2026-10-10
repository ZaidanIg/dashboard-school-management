import { useFetch, useMutations } from './useShared'

export interface Grade {
    id: string
    studentId: string
    student?: { name: string; nis: string }
    subjectId: string
    subject?: { name: string }
    academicYearId: string
    semester: 'GANJIL' | 'GENAP'
    type: 'FORMATIVE' | 'SUMMATIVE' | 'PROJECT'
    score: number
    feedback?: string
    createdAt: string
    updatedAt: string
}

export interface P5Project {
    id: string
    title: string
    theme: string
    description?: string
    academicYearId?: string
    status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED'
    startDate?: string
    endDate?: string
}

export type GradeFormData = Omit<Grade, 'id' | 'createdAt' | 'updatedAt' | 'student' | 'subject'>

export function useGrades(params?: Record<string, string | number | undefined>) {
    const { data: grades, loading, error, refetch } = useFetch<Grade[]>('/api/grades', params, {
        initialData: []
    })

    const { create, update, remove, loading: mutationLoading } = useMutations<Grade, GradeFormData, Partial<GradeFormData>>('/api/grades')

    return {
        grades,
        loading,
        mutationLoading,
        error,
        refetch,
        create,
        update,
        remove
    }
}

export function useP5Projects(params?: Record<string, string | number | undefined>) {
    const { data: projects, loading, error, refetch } = useFetch<P5Project[]>('/api/grades/p5-projects', params, {
        initialData: []
    })

    const { create, update, remove, loading: mutationLoading } = useMutations<P5Project, Omit<P5Project, 'id'>>('/api/grades/p5-projects')

    return {
        projects,
        loading,
        mutationLoading,
        error,
        refetch,
        createProject: create,
        updateProject: update,
        removeProject: remove
    }
}

