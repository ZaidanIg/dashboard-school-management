import { useState, useCallback, useEffect } from 'react'
import { api } from '@/lib/api'
import type { Subject, Class } from '@/types'

export interface Schedule {
    id: string
    classId: string
    subjectId: string
    teacherId?: string
    dayOfWeek: number
    startTime: string
    endTime: string
    room?: string
    class?: Class
    subject?: Subject
}

export function useSchedules(classId?: string, dayOfWeek?: number) {
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchSchedules = useCallback(async () => {
        // IMPORTANT: Skip fetch if classId is not provided to avoid fetching ALL schedules
        if (!classId) {
            console.log('useSchedules: classId undefined, waiting...')
            setLoading(true)
            return
        }

        setLoading(true)
        setError(null)
        try {
            const params = new URLSearchParams()
            params.append('classId', classId)
            if (dayOfWeek !== undefined) params.append('dayOfWeek', dayOfWeek.toString())

            const data = await api.get<Schedule[]>(`/api/academic/schedules?${params.toString()}`)
            setSchedules(data)
        } catch (err: unknown) {
            const error = err as { message?: string }
            setError(error.message || 'Gagal memuat jadwal pelajaran')
        } finally {
            setLoading(false)
        }
    }, [classId, dayOfWeek])

    const createSchedule = useCallback(async (data: Partial<Schedule>) => {
        setLoading(true)
        try {
            await api.post('/api/academic/schedules', data)
            await fetchSchedules()
            return { success: true }
        } catch (err: unknown) {
            const error = err as { message?: string }
            return { success: false, error: error.message || 'Gagal membuat jadwal' }
        } finally {
            setLoading(false)
        }
    }, [fetchSchedules])

    const updateSchedule = useCallback(async (id: string, data: Partial<Schedule>) => {
        setLoading(true)
        try {
            await api.put(`/api/academic/schedules/${id}`, data)
            await fetchSchedules()
            return { success: true }
        } catch (err: unknown) {
            const error = err as { message?: string }
            return { success: false, error: error.message || 'Gagal memperbarui jadwal' }
        } finally {
            setLoading(false)
        }
    }, [fetchSchedules])

    const deleteSchedule = useCallback(async (id: string) => {
        setLoading(true)
        try {
            await api.delete(`/api/academic/schedules/${id}`)
            await fetchSchedules()
            return { success: true }
        } catch (err: unknown) {
            const error = err as { message?: string }
            return { success: false, error: error.message || 'Gagal menghapus jadwal' }
        } finally {
            setLoading(false)
        }
    }, [fetchSchedules])

    useEffect(() => {
        fetchSchedules()
    }, [fetchSchedules])

    return {
        schedules,
        loading,
        error,
        refetch: fetchSchedules,
        createSchedule,
        updateSchedule,
        deleteSchedule
    }
}
