import { useState, useEffect, useCallback } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export interface AcademicYear {
    id: string
    name: string
    startDate: string
    endDate: string
    isActive: boolean
    _count?: {
        classes: number
    }
    studentCount?: number
}

export function useAcademicYears() {
    const [years, setYears] = useState<AcademicYear[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchYears = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`${API_BASE}/api/academic/years`)

            if (!response.ok) {
                throw new Error('Failed to fetch academic years')
            }

            const data = await response.json()
            setYears(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch academic years')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchYears()
    }, [fetchYears])

    return { years, loading, error, refetch: fetchYears }
}

export function useAcademicYearMutations() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const createYear = async (data: {
        name: string
        startDate: string
        endDate: string
        isActive?: boolean
    }): Promise<AcademicYear | null> => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`${API_BASE}/api/academic/years`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to create academic year')
            }

            return await response.json()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create academic year')
            return null
        } finally {
            setLoading(false)
        }
    }

    const updateYear = async (id: string, data: Partial<{
        name: string
        startDate: string
        endDate: string
        isActive: boolean
    }>): Promise<AcademicYear | null> => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`${API_BASE}/api/academic/years/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to update academic year')
            }

            return await response.json()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update academic year')
            return null
        } finally {
            setLoading(false)
        }
    }

    const deleteYear = async (id: string): Promise<boolean> => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`${API_BASE}/api/academic/years/${id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to delete academic year')
            }

            return true
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete academic year')
            return false
        } finally {
            setLoading(false)
        }
    }

    const setActiveYear = async (id: string): Promise<boolean> => {
        const result = await updateYear(id, { isActive: true })
        return result !== null
    }

    return { createYear, updateYear, deleteYear, setActiveYear, loading, error }
}
