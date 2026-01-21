import { useFetch, useDebounce, useMutations } from './useShared'

export interface Class {
    id: string
    name: string
    grade: number
    major: string | null
    academicYearId: string
    homeroomTeacherId: string | null
    capacity: number
    homeroomTeacher?: {
        id: string
        name: string
    } | null
    academicYear?: {
        id: string
        name: string
    }
    _count?: {
        enrollments: number
    }
}

export interface ClassFilters {
    academicYearId?: string
    grade?: number
    major?: string
    search?: string
}

export function useClasses(filters: ClassFilters = {}) {
    const debouncedSearch = useDebounce(filters.search)

    // Construct params for useFetch
    const params: Record<string, any> = {
        ...filters,
        search: debouncedSearch
    }

    const { data: classes, loading, error, refetch } = useFetch<Class[]>('/api/academic/classes', params, {
        initialData: []
    })

    return { classes, loading, error, refetch }
}

export interface ClassDetail extends Class {
    enrollments: {
        id: string
        student: {
            id: string
            name: string
            nis: string
            nisn: string
            gender: string
        }
        enrolledAt: string
        status: 'ACTIVE' | 'TRANSFERRED' | 'DROPPED'
    }[]
}

export function useClass(id: string | undefined) {
    const { data: classDetail, loading, error, refetch } = useFetch<ClassDetail>(
        id ? `/api/academic/classes/${id}` : '',
        undefined,
        { fetchOnMount: !!id }
    )

    return { classDetail, loading, error, refetch }
}

export function useClassMutations() {
    const { create, update, remove, loading, error } = useMutations<Class>('/api/academic/classes')

    return {
        createClass: create,
        updateClass: update,
        deleteClass: remove,
        loading,
        error
    }
}

// Hook for academic years (needed for class form)
export function useAcademicYears() {
    const { data: years, loading } = useFetch<{ id: string; name: string; isActive: boolean }[]>('/api/academic/years', undefined, {
        initialData: []
    })
    return { years, loading }
}

// Hook for teachers (for homeroom teacher selection) - Simplified list
export function useTeachers() {
    const { data, loading } = useFetch<{ data: { id: string; name: string }[] } | { id: string; name: string }[]>('/api/teachers', undefined, {
        initialData: []
    })

    // Handle different response structures (pagination vs flat list)
    const teachers = Array.isArray(data) ? data : (data?.data || [])

    return { teachers, loading }
}
