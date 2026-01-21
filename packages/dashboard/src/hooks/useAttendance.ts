import { useState, useEffect, useCallback } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export interface AttendanceSummary {
    date: string
    present: number
    sick: number
    permitted: number
    absent: number
    late: number
    total: number
}

export interface ClassAttendance {
    classId: string
    className: string
    present: number
    sick: number
    permitted: number
    absent: number
    late: number
    total: number
}

export interface AttendanceSummaryResponse {
    summary: AttendanceSummary
    byClass: ClassAttendance[]
}

export interface StudentRecap {
    studentId: string
    studentName: string
    nis: string
    className: string
    totalDays: number
    present: number
    late: number
    sick: number
    permitted: number
    absent: number
    percentage: number
    isLowAttendance: boolean
}

export interface AttendanceRecapResponse {
    period: string
    startDate: string
    endDate: string
    totalStudents: number
    lowAttendanceCount: number
    students: StudentRecap[]
}

export interface LowAttendanceStudent {
    studentId: string
    studentName: string
    nis: string
    className: string
    totalDays: number
    presentDays: number
    absentDays: number
    percentage: number
    phone: string | null
    email: string | null
}

export interface LowAttendanceResponse {
    threshold: number
    totalStudents: number
    students: LowAttendanceStudent[]
}

// Hook for daily attendance summary
export function useAttendanceSummary(date?: string, classId?: string) {
    const [data, setData] = useState<AttendanceSummaryResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchSummary = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const params = new URLSearchParams()
            if (date) params.set('date', date)
            if (classId) params.set('classId', classId)

            const response = await fetch(`${API_BASE}/api/students/attendance/summary?${params}`)

            if (!response.ok) throw new Error('Failed to fetch attendance summary')

            setData(await response.json())
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching attendance')
        } finally {
            setLoading(false)
        }
    }, [date, classId])

    useEffect(() => {
        fetchSummary()
    }, [fetchSummary])

    return { data, loading, error, refetch: fetchSummary }
}

// Hook for attendance recap (monthly/semester/yearly)
export function useAttendanceRecap(
    period: 'monthly' | 'semester' | 'yearly' = 'monthly',
    year?: number,
    month?: number,
    semester?: number
) {
    const [data, setData] = useState<AttendanceRecapResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchRecap = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const params = new URLSearchParams()
            params.set('period', period)
            if (year) params.set('year', year.toString())
            if (month) params.set('month', month.toString())
            if (semester) params.set('semester', semester.toString())

            const response = await fetch(`${API_BASE}/api/students/attendance/recap?${params}`)

            if (!response.ok) throw new Error('Failed to fetch attendance recap')

            setData(await response.json())
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching recap')
        } finally {
            setLoading(false)
        }
    }, [period, year, month, semester])

    useEffect(() => {
        fetchRecap()
    }, [fetchRecap])

    return { data, loading, error, refetch: fetchRecap }
}

// Hook for low attendance students
export function useLowAttendanceStudents(
    threshold: number = 60,
    period: 'semester' | 'yearly' = 'semester',
    year?: number,
    semester?: number
) {
    const [data, setData] = useState<LowAttendanceResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchLowAttendance = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const params = new URLSearchParams()
            params.set('threshold', threshold.toString())
            params.set('period', period)
            if (year) params.set('year', year.toString())
            if (semester) params.set('semester', semester.toString())

            const response = await fetch(`${API_BASE}/api/students/attendance/low?${params}`)

            if (!response.ok) throw new Error('Failed to fetch low attendance students')

            setData(await response.json())
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching data')
        } finally {
            setLoading(false)
        }
    }, [threshold, period, year, semester])

    useEffect(() => {
        fetchLowAttendance()
    }, [fetchLowAttendance])

    return { data, loading, error, refetch: fetchLowAttendance }
}
