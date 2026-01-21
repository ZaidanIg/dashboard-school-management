import { useState, useCallback, useEffect } from 'react'
import { api } from '@/lib/api'

export interface CalendarEvent {
    id: string
    academicYearId: string
    title: string
    description?: string
    startDate: string
    endDate: string
    type: 'HOLIDAY' | 'EXAM' | 'EVENT' | 'MEETING' | 'OTHER'
}

export function useCalendar() {
    const [events, setEvents] = useState<CalendarEvent[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchEvents = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await api.get<CalendarEvent[]>('/api/academic/calendar')
            setEvents(data)
        } catch (err: unknown) {
            const error = err as { message?: string }
            setError(error.message || 'Gagal memuat kalender')
        } finally {
            setLoading(false)
        }
    }, [])

    const createEvent = useCallback(async (data: Partial<CalendarEvent>) => {
        setLoading(true)
        try {
            await api.post('/api/academic/calendar', data)
            await fetchEvents()
            return { success: true }
        } catch (err: unknown) {
            const error = err as { message?: string }
            return { success: false, error: error.message || 'Gagal membuat event' }
        } finally {
            setLoading(false)
        }
    }, [fetchEvents])

    const updateEvent = useCallback(async (id: string, data: Partial<CalendarEvent>) => {
        setLoading(true)
        try {
            await api.put(`/api/academic/calendar/${id}`, data)
            await fetchEvents()
            return { success: true }
        } catch (err: unknown) {
            const error = err as { message?: string }
            return { success: false, error: error.message || 'Gagal memperbarui event' }
        } finally {
            setLoading(false)
        }
    }, [fetchEvents])

    const deleteEvent = useCallback(async (id: string) => {
        setLoading(true)
        try {
            await api.delete(`/api/academic/calendar/${id}`)
            await fetchEvents()
            return { success: true }
        } catch (err: unknown) {
            const error = err as { message?: string }
            return { success: false, error: error.message || 'Gagal menghapus event' }
        } finally {
            setLoading(false)
        }
    }, [fetchEvents])

    useEffect(() => {
        fetchEvents()
    }, [fetchEvents])

    return {
        events,
        loading,
        error,
        refetch: fetchEvents,
        createEvent,
        updateEvent,
        deleteEvent
    }
}
