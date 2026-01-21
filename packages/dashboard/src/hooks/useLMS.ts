import { useState, useCallback, useEffect } from 'react'
import { api } from '@/lib/api'
import type { Assignment, AssignmentSubmission } from '@/types'

interface AssignmentFilters {
    classId?: string
    subjectId?: string
    teacherId?: string
    studentId?: string
}

export function useAssignments(filters?: AssignmentFilters) {
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Stringify filters for dependency comparison (handle undefined case)
    const filtersKey = filters ? JSON.stringify(filters) : 'undefined'

    const fetchAssignments = useCallback(async () => {
        // Skip fetch if filters is undefined (waiting for dependencies)
        if (!filters) {
            console.log('useAssignments: filters undefined, waiting...')
            setLoading(true) // Keep loading true while waiting
            return
        }

        console.log('useAssignments: fetching with filters', filters)
        setLoading(true)
        setError(null)
        try {
            const data = await api.get<Assignment[]>('/api/lms/assignments', filters as Record<string, string | number | undefined>)
            console.log('useAssignments: received', data?.length, 'assignments')
            setAssignments(data)
        } catch (err: unknown) {
            const error = err as { message?: string }
            console.error('useAssignments: error', error)
            setError(error.message || 'Gagal memuat daftar tugas')
        } finally {
            setLoading(false)
        }
    }, [filtersKey]) // Use the string key, not JSON.stringify directly

    useEffect(() => {
        fetchAssignments()
    }, [fetchAssignments])

    return { assignments, loading, error, refetch: fetchAssignments }
}

export function useAssignment(id: string) {
    const [assignment, setAssignment] = useState<Assignment | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchAssignment = useCallback(async () => {
        if (!id) {
            setLoading(false)
            return
        }
        setLoading(true)
        setError(null)
        try {
            const data = await api.get<Assignment>(`/api/lms/assignments/${id}`)
            setAssignment(data)
        } catch (err: unknown) {
            const error = err as { message?: string }
            setError(error.message || 'Gagal memuat detail tugas')
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        fetchAssignment()
    }, [fetchAssignment])

    return { assignment, loading, error, refetch: fetchAssignment }
}

export function useLMSMutations() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const createAssignment = async (data: any) => {
        setLoading(true)
        try {
            return await api.post<Assignment>('/api/lms/assignments', data)
        } catch (err: unknown) {
            const error = err as { message?: string }
            setError(error.message || 'Gagal membuat tugas')
            throw error
        } finally {
            setLoading(false)
        }
    }

    const submitAssignment = async (assignmentId: string, data: { studentId: string, fileUrl?: string, content?: string }) => {
        setLoading(true)
        try {
            return await api.post<AssignmentSubmission>(`/api/lms/assignments/${assignmentId}/submit`, data)
        } catch (err: unknown) {
            const error = err as { message?: string }
            setError(error.message || 'Gagal mengirim tugas')
            throw error
        } finally {
            setLoading(false)
        }
    }

    const gradeSubmission = async (submissionId: string, data: { grade: number, feedback?: string }) => {
        setLoading(true)
        try {
            return await api.post<AssignmentSubmission>(`/api/lms/submissions/${submissionId}/grade`, data)
        } catch (err: unknown) {
            const error = err as { message?: string }
            setError(error.message || 'Gagal menilai tugas')
            throw error
        } finally {
            setLoading(false)
        }
    }

    const updateAssignment = async (id: string, data: any) => {
        setLoading(true)
        try {
            return await api.put<Assignment>(`/api/lms/assignments/${id}`, data)
        } catch (err: unknown) {
            const error = err as { message?: string }
            setError(error.message || 'Gagal mengupdate tugas')
            throw error
        } finally {
            setLoading(false)
        }
    }

    const deleteAssignment = async (id: string) => {
        setLoading(true)
        try {
            await api.delete(`/api/lms/assignments/${id}`)
        } catch (err: unknown) {
            const error = err as { message?: string }
            setError(error.message || 'Gagal menghapus tugas')
            throw error
        } finally {
            setLoading(false)
        }
    }

    return { createAssignment, updateAssignment, deleteAssignment, submitAssignment, gradeSubmission, loading, error }
}
