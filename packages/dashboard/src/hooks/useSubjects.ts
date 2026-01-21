import { useState, useCallback, useEffect } from 'react'
import { api } from '@/lib/api'
import type { Subject } from '@/types'

export function useSubjects() {
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchSubjects = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await api.get<Subject[]>('/api/academic/subjects')
            setSubjects(data)
        } catch (err: unknown) {
            const error = err as { message?: string }
            setError(error.message || 'Gagal memuat mata pelajaran')
        } finally {
            setLoading(false)
        }
    }, [])

    const createSubject = useCallback(async (data: Partial<Subject>) => {
        setLoading(true)
        try {
            await api.post('/api/academic/subjects', data)
            await fetchSubjects()
            return { success: true }
        } catch (err: unknown) {
            const error = err as { message?: string }
            return { success: false, error: error.message || 'Gagal membuat mata pelajaran' }
        } finally {
            setLoading(false)
        }
    }, [fetchSubjects])

    const updateSubject = useCallback(async (id: string, data: Partial<Subject>) => {
        setLoading(true)
        try {
            await api.put(`/api/academic/subjects/${id}`, data)
            await fetchSubjects()
            return { success: true }
        } catch (err: unknown) {
            const error = err as { message?: string }
            return { success: false, error: error.message || 'Gagal memperbarui mata pelajaran' }
        } finally {
            setLoading(false)
        }
    }, [fetchSubjects])

    const deleteSubject = useCallback(async (id: string) => {
        setLoading(true)
        try {
            await api.delete(`/api/academic/subjects/${id}`)
            await fetchSubjects()
            return { success: true }
        } catch (err: unknown) {
            const error = err as { message?: string }
            return { success: false, error: error.message || 'Gagal menghapus mata pelajaran' }
        } finally {
            setLoading(false)
        }
    }, [fetchSubjects])

    useEffect(() => {
        fetchSubjects()
    }, [fetchSubjects])

    return {
        subjects,
        loading,
        error,
        refetch: fetchSubjects,
        createSubject,
        updateSubject,
        deleteSubject
    }
}
