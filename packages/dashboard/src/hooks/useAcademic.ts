import { useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'
import type { AcademicYear, Class, Subject } from '../types'

// Academic Years
export function useAcademicYears() {
    const [years, setYears] = useState<AcademicYear[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchYears = useCallback(async () => {
        setLoading(true)
        try {
            const data = await api.get<AcademicYear[]>('/api/academic/years')
            setYears(data)
        } catch (err: unknown) {
            const error = err as { message?: string }
            setError(error.message || 'Failed to fetch academic years')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchYears() }, [fetchYears])
    return { years, loading, error, refetch: fetchYears }
}

// Classes
export function useClasses(options: { academicYearId?: string; grade?: number } = {}) {
    const [classes, setClasses] = useState<Class[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchClasses = useCallback(async () => {
        setLoading(true)
        try {
            const data = await api.get<Class[]>('/api/academic/classes', options)
            setClasses(data)
        } catch (err: unknown) {
            const error = err as { message?: string }
            setError(error.message || 'Failed to fetch classes')
        } finally {
            setLoading(false)
        }
    }, [options.academicYearId, options.grade])

    useEffect(() => { fetchClasses() }, [fetchClasses])
    return { classes, loading, error, refetch: fetchClasses }
}

// Subjects
export function useSubjects(options: { category?: string } = {}) {
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchSubjects = useCallback(async () => {
        setLoading(true)
        try {
            const data = await api.get<Subject[]>('/api/academic/subjects', options)
            setSubjects(data)
        } catch (err: unknown) {
            const error = err as { message?: string }
            setError(error.message || 'Failed to fetch subjects')
        } finally {
            setLoading(false)
        }
    }, [options.category])

    useEffect(() => { fetchSubjects() }, [fetchSubjects])
    return { subjects, loading, error, refetch: fetchSubjects }
}

// Active Academic Year
export function useActiveAcademicYear() {
    const { years, loading, error } = useAcademicYears()
    const activeYear = years.find(y => y.isActive) || years[0]
    return { activeYear, loading, error }
}
