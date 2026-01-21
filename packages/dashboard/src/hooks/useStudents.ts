import { useState, useEffect, useCallback } from 'react'
import { useToast } from '../contexts/ToastContext'
import { api } from '../lib/api'
import type { ApiResponse } from '../lib/api'
import type { Student, StudentAttendance } from '../types'

interface UseStudentsOptions {
    page?: number
    limit?: number
    search?: string
    status?: string
    classId?: string
}

interface UseStudentsResult {
    students: Student[]
    loading: boolean
    error: string | null
    meta: { page: number; limit: number; total: number; totalPages: number } | null
    refetch: () => void
}

export function useStudents(options: UseStudentsOptions = {}): UseStudentsResult {
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [meta, setMeta] = useState<UseStudentsResult['meta']>(null)

    const fetchStudents = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await api.get<ApiResponse<Student[]>>('/api/students', {
                page: options.page,
                limit: options.limit,
                search: options.search,
                status: options.status,
                classId: options.classId,
            })
            setStudents(response.data)
            setMeta(response.meta || null)
        } catch (err: unknown) {
            const error = err as { message?: string }
            setError(error.message || 'Failed to fetch students')
        } finally {
            setLoading(false)
        }
    }, [options.page, options.limit, options.search, options.status, options.classId])

    useEffect(() => {
        fetchStudents()
    }, [fetchStudents])

    return { students, loading, error, meta, refetch: fetchStudents }
}

export function useStudent(id: string | undefined) {
    const [student, setStudent] = useState<Student | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!id || id === 'new') {
            setLoading(false)
            return
        }

        const fetchStudent = async () => {
            setLoading(true)
            setError(null)

            try {
                const data = await api.get<Student>(`/api/students/${id}`)
                setStudent(data)
            } catch (err: unknown) {
                const error = err as { message?: string }
                setError(error.message || 'Failed to fetch student')
            } finally {
                setLoading(false)
            }
        }

        fetchStudent()
    }, [id])

    return { student, loading, error }
}

export function useStudentMutations() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { addToast } = useToast()

    const createStudent = async (data: Partial<Student>, photoFile?: File) => {
        setLoading(true)
        setError(null)
        try {
            const formData = new FormData()

            // Append all data fields
            Object.keys(data).forEach(key => {
                const value = data[key as keyof Student]
                if (value !== undefined && value !== null) {
                    if (value instanceof Date) {
                        formData.append(key, value.toISOString())
                    } else {
                        formData.append(key, String(value))
                    }
                }
            })

            // Append photo if exists
            if (photoFile) {
                formData.append('photo', photoFile)
            }

            await api.post('/api/students', formData)
            addToast('success', 'Siswa berhasil ditambahkan')
            return true
        } catch (err: any) {
            setError(err.message)
            return false
        } finally {
            setLoading(false)
        }
    }

    const updateStudent = async (id: string, data: Partial<Student>, photoFile?: File) => {
        setLoading(true)
        setError(null)
        try {
            const formData = new FormData()

            // Append all data fields
            Object.keys(data).forEach(key => {
                // Skip read-only and relational fields
                if ([
                    'id', 'createdAt', 'updatedAt', 'deletedAt',
                    'classEnrollments', 'grades', 'studentAttendances', 'attendances', 'sppBillings', 'academicRecords'
                ].includes(key)) return

                const value = data[key as keyof Student]
                if (value !== undefined && value !== null) {
                    if (value instanceof Date) {
                        formData.append(key, value.toISOString())
                    } else {
                        formData.append(key, String(value))
                    }
                }
            })

            // Append photo if exists
            if (photoFile) {
                formData.append('photo', photoFile)
            }

            await api.put(`/api/students/${id}`, formData)
            addToast('success', 'Data siswa berhasil diperbarui')
            return true
        } catch (err: any) {
            setError(err.message)
            return false
        } finally {
            setLoading(false)
        }
    }

    const deleteStudent = async (id: string): Promise<boolean> => {
        setLoading(true)
        setError(null)
        try {
            await api.delete(`/api/students/${id}`)
            addToast('success', 'Data siswa berhasil dihapus')
            return true
        } catch (err: unknown) {
            const error = err as { message?: string }
            setError(error.message || 'Failed to delete student')
            return false
        } finally {
            setLoading(false)
        }
    }

    const recordAttendance = async (data: Partial<StudentAttendance>): Promise<StudentAttendance | null> => {
        setLoading(true)
        setError(null)
        try {
            const attendance = await api.post<StudentAttendance>('/api/students/attendance', data)
            return attendance
        } catch (err: unknown) {
            const error = err as { message?: string }
            setError(error.message || 'Failed to record attendance')
            return null
        } finally {
            setLoading(false)
        }
    }

    return { createStudent, updateStudent, deleteStudent, recordAttendance, loading, error }
}
