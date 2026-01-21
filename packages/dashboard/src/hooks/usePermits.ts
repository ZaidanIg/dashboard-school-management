import { useFetch, useDebounce, useMutations, downloadFile } from './useShared'
import { api } from '../lib/api'

export interface Permit {
    id: string
    studentId: string
    studentName: string
    studentNis: string
    className: string
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

export interface PermitFormData {
    studentId: string
    type: 'SICK' | 'FAMILY' | 'OFFICIAL' | 'OTHER'
    startDate: string
    endDate: string
    reason: string
    document?: string
}

export interface PermitStats {
    total: number
    approved: number
    pending: number
    rejected: number
}

interface UsePermitsFilters {
    search?: string
    type?: string
    status?: string
}

// Hook for listing permits
export function usePermits(filters: UsePermitsFilters = {}) {
    const debouncedSearch = useDebounce(filters.search)

    const params: Record<string, any> = {
        ...filters,
        search: debouncedSearch
    }

    const { data: permits, loading, error, refetch } = useFetch<Permit[]>('/api/permits', params, {
        initialData: []
    })

    return { permits, loading, error, refetch }
}

// Hook for permit stats
export function usePermitStats() {
    const { data: stats, loading } = useFetch<PermitStats>('/api/permits/stats', undefined, {
        initialData: { total: 0, approved: 0, pending: 0, rejected: 0 }
    })
    return { stats, loading }
}

// Hook for permit mutations
export function usePermitMutations() {
    const { create, remove, loading: baseLoading } = useMutations<Permit, PermitFormData>('/api/permits')

    const updatePermitStatus = async (id: string, status: 'APPROVED' | 'REJECTED', approvedBy?: string): Promise<boolean> => {
        try {
            await api.patch(`/api/permits/${id}/status`, { status, approvedBy })
            return true
        } catch (e) {
            console.error(e)
            return false
        }
    }

    const exportPermits = async (filters?: { type?: string, status?: string }) => {
        return downloadFile('/api/permits/export', `perizinan-${new Date().toISOString().split('T')[0]}.csv`, filters as Record<string, string>)
    }

    return {
        createPermit: create,
        updatePermitStatus,
        deletePermit: remove,
        exportPermits,
        loading: baseLoading
    }
}
