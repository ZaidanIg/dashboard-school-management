import { useFetch, useDebounce, useMutations, downloadFile } from './useShared'
import { api } from '../lib/api'

export interface TeacherPermit {
    id: string
    teacherId: string
    teacherName: string
    teacherNip: string
    position: string
    type: 'SICK' | 'FAMILY' | 'OFFICIAL' | 'OTHER'
    startDate: string
    endDate: string
    reason: string
    document: string | null
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
    approvedBy: string | null
    createdAt: string
    updatedAt: string
}

export interface TeacherPermitFormData {
    teacherId: string
    type: 'SICK' | 'FAMILY' | 'OFFICIAL' | 'OTHER'
    startDate: string
    endDate: string
    reason: string
    document?: string
}

export interface TeacherPermitStats {
    total: number
    approved: number
    pending: number
    rejected: number
}

interface UseTeacherPermitsFilters {
    search?: string
    type?: string
    status?: string
}

// Hook for listing permits
export function useTeacherPermits(filters: UseTeacherPermitsFilters = {}) {
    const debouncedSearch = useDebounce(filters.search)

    const params: Record<string, any> = {
        ...filters,
        search: debouncedSearch
    }

    const { data: permits, loading, error, refetch } = useFetch<TeacherPermit[]>('/api/teacher-permits', params, {
        initialData: []
    })

    return { permits, loading, error, refetch }
}

// Hook for permit stats
export function useTeacherPermitStats() {
    const { data: stats, loading } = useFetch<TeacherPermitStats>('/api/teacher-permits/stats', undefined, {
        initialData: { total: 0, approved: 0, pending: 0, rejected: 0 }
    })
    return { stats, loading }
}

// Hook for permit mutations
export function useTeacherPermitMutations() {
    const { create, remove, loading: baseLoading } = useMutations<TeacherPermit, TeacherPermitFormData>('/api/teacher-permits')

    const updatePermitStatus = async (id: string, status: 'APPROVED' | 'REJECTED', approvedBy?: string): Promise<boolean> => {
        try {
            await api.patch(`/api/teacher-permits/${id}/status`, { status, approvedBy })
            return true
        } catch (e) {
            console.error(e)
            return false
        }
    }

    const exportPermits = async (filters?: { type?: string, status?: string }) => {
        return downloadFile('/api/teacher-permits/export', `perizinan-guru-${new Date().toISOString().split('T')[0]}.csv`, filters as Record<string, string>)
    }

    return {
        createPermit: create,
        updatePermitStatus,
        deletePermit: remove,
        exportPermits,
        loading: baseLoading
    }
}
