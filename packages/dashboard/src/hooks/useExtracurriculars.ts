import { useFetch, useDebounce, useMutations } from './useShared'

export interface Extracurricular {
    id: string
    name: string
    category: string
    description: string | null
    schedule: string | null
    location: string | null
    advisorId: string | null
    maxMembers: number | null
    isActive: boolean
    createdAt: string
    updatedAt: string
    advisor: {
        id: string
        name: string
    } | null
    _count: {
        members: number
    }
}

export interface ExtracurricularFormData {
    name: string
    category: string
    description?: string
    schedule?: string
    location?: string
    advisorId?: string | null
    maxMembers?: number | null
    isActive?: boolean
}

interface UseExtracurricularsFilters {
    search?: string
    category?: string
    isActive?: boolean
}

// Hook for listing extracurriculars
export function useExtracurriculars(filters: UseExtracurricularsFilters = {}) {
    const debouncedSearch = useDebounce(filters.search)

    const params: Record<string, any> = {
        ...filters,
        search: debouncedSearch
    }

    const { data: extracurriculars, loading, error, refetch } = useFetch<Extracurricular[]>('/api/extracurriculars', params, {
        initialData: []
    })

    return { extracurriculars, loading, error, refetch }
}

// Hook for categories
export function useExtracurricularCategories() {
    const { data: categories, loading } = useFetch<string[]>('/api/extracurriculars/categories', undefined, {
        initialData: ['Wajib', 'Olahraga', 'Seni', 'Akademik'] // Fallback if fetch fails or is empty initially
    })
    return { categories, loading }
}

// Hook for mutations
export function useExtracurricularMutations() {
    const { create, update, remove, loading } = useMutations<Extracurricular, ExtracurricularFormData, Partial<ExtracurricularFormData>>('/api/extracurriculars')

    return {
        createExtracurricular: create,
        updateExtracurricular: update,
        deleteExtracurricular: remove,
        loading
    }
}
