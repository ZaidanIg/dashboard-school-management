import { useFetch, useDebounce, useMutations, downloadFile } from './useShared'
import type { Teacher } from '../types'

interface UseTeachersFilters {
    page?: number
    limit?: number
    search?: string
    status?: string
    position?: string
}

export function useTeachers(filters: UseTeachersFilters = {}) {
    const debouncedSearch = useDebounce(filters.search)

    const params: Record<string, any> = {
        ...filters,
        search: debouncedSearch,
        page: filters.page || 1,
        limit: filters.limit || 20
    }

    const { data, loading, error, refetch } = useFetch<{ data: Teacher[], meta: any }>('/api/teachers', params, {
        initialData: { data: [], meta: null }
    })

    return {
        teachers: data.data || [],
        meta: data.meta,
        loading,
        error,
        refetch
    }
}

export function useTeacher(id: string | undefined) {
    const { data: teacher, loading, error } = useFetch<Teacher | null>(`/api/teachers/${id}`, undefined, {
        initialData: null,
        fetchOnMount: !!id
    })

    return { teacher, loading, error }
}

export function useTeacherMutations() {
    const { create, update, remove, loading } = useMutations<Teacher>('/api/teachers')

    const exportTeachers = async (filters: { status?: string, position?: string, search?: string }) => {
        return downloadFile('/api/teachers/export', `guru-${new Date().toISOString().split('T')[0]}.csv`, filters as Record<string, string>)
    }

    return {
        createTeacher: create,
        updateTeacher: update,
        deleteTeacher: remove,
        exportTeachers,
        loading
    }
}
