/**
 * Shared Hook Utilities
 * Provides reusable patterns for data fetching, mutations, and common UI logic
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { api } from '../lib/api'

// ============================================
// DEBOUNCE HOOK
// ============================================

/**
 * Debounce a value by specified delay
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay)
        return () => clearTimeout(timer)
    }, [value, delay])

    return debouncedValue
}

// ============================================
// API FETCH HOOK
// ============================================

interface UseFetchOptions<T> {
    /** Initial data before first fetch */
    initialData?: T
    /** Whether to fetch on mount */
    fetchOnMount?: boolean
    /** Transform response data */
    transform?: (data: any) => T
}

interface UseFetchResult<T> {
    data: T
    loading: boolean
    error: string | null
    refetch: () => Promise<void>
}

/**
 * Generic hook for fetching data from API
 */
export function useFetch<T>(
    endpoint: string | null | undefined,
    params?: Record<string, string | number | boolean | undefined>,
    options: UseFetchOptions<T> = {}
): UseFetchResult<T> {
    const { initialData, fetchOnMount = true, transform } = options
    const [data, setData] = useState<T>(initialData as T)
    const [loading, setLoading] = useState(fetchOnMount && !!endpoint)
    const [error, setError] = useState<string | null>(null)
    const isFirstLoad = useRef(true)

    const fetchData = useCallback(async () => {
        if (!endpoint) return

        if (isFirstLoad.current) setLoading(true)
        setError(null)

        try {
            // Clean undefined params
            const cleanParams: Record<string, string | number> = {}
            if (params) {
                Object.entries(params).forEach(([key, val]) => {
                    if (val !== undefined && val !== '') {
                        cleanParams[key] = typeof val === 'boolean' ? String(val) : val as string | number
                    }
                })
            }

            const response = await api.get<any>(endpoint, cleanParams)
            const result = transform ? transform(response) : response
            setData(result)
            isFirstLoad.current = false
        } catch (err) {
            setError(err instanceof Error ? err.message : (err as any)?.message || 'Fetch failed')
        } finally {
            setLoading(false)
        }
    }, [endpoint, JSON.stringify(params), transform])

    useEffect(() => {
        if (fetchOnMount) fetchData()
    }, [fetchData, fetchOnMount])

    return { data, loading, error, refetch: fetchData }
}

// ============================================
// CRUD MUTATIONS HOOK
// ============================================

interface UseMutationsResult<T, CreateData = Partial<T>, UpdateData = Partial<T>> {
    create: (data: CreateData) => Promise<T | null>
    update: (id: string, data: UpdateData) => Promise<T | null>
    remove: (id: string) => Promise<boolean>
    loading: boolean
    error: string | null
}

/**
 * Generic hook for CRUD mutations
 */
export function useMutations<T, CreateData = Partial<T>, UpdateData = Partial<T>>(
    baseEndpoint: string
): UseMutationsResult<T, CreateData, UpdateData> {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const create = async (data: CreateData): Promise<T | null> => {
        setLoading(true)
        setError(null)
        try {
            return await api.post<T>(baseEndpoint, data)
        } catch (err) {
            setError((err as any)?.message || 'Create failed')
            return null
        } finally {
            setLoading(false)
        }
    }

    const update = async (id: string, data: UpdateData): Promise<T | null> => {
        setLoading(true)
        setError(null)
        try {
            return await api.put<T>(`${baseEndpoint}/${id}`, data)
        } catch (err) {
            setError((err as any)?.message || 'Update failed')
            return null
        } finally {
            setLoading(false)
        }
    }

    const remove = async (id: string): Promise<boolean> => {
        setLoading(true)
        setError(null)
        try {
            await api.delete(`${baseEndpoint}/${id}`)
            return true
        } catch (err) {
            setError((err as any)?.message || 'Delete failed')
            return false
        } finally {
            setLoading(false)
        }
    }

    return { create, update, remove, loading, error }
}

// ============================================
// FILE DOWNLOAD HELPER
// ============================================

export async function downloadFile(
    endpoint: string,
    filename: string,
    params?: Record<string, string | undefined>
): Promise<boolean> {
    try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'
        const searchParams = new URLSearchParams()
        if (params) {
            Object.entries(params).forEach(([key, val]) => {
                if (val) searchParams.set(key, val)
            })
        }

        const response = await fetch(`${API_BASE}${endpoint}?${searchParams}`)
        if (!response.ok) return false

        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        link.click()
        URL.revokeObjectURL(url)
        return true
    } catch {
        return false
    }
}

// ============================================
// DROPDOWN MENU HOOK
// ============================================

/**
 * Hook for managing dropdown/context menu state
 */
export function useDropdownMenu() {
    const [activeId, setActiveId] = useState<string | null>(null)

    const toggle = (id: string) => {
        setActiveId(activeId === id ? null : id)
    }

    const close = () => setActiveId(null)

    const isOpen = (id: string) => activeId === id

    return { activeId, toggle, close, isOpen }
}

// ============================================
// MODAL STATE HOOK
// ============================================

interface UseModalState<T> {
    isOpen: boolean
    data: T | null
    open: (data?: T) => void
    close: () => void
}

/**
 * Hook for managing modal state with optional data
 */
export function useModalState<T = undefined>(): UseModalState<T> {
    const [isOpen, setIsOpen] = useState(false)
    const [data, setData] = useState<T | null>(null)

    const open = (modalData?: T) => {
        setData(modalData ?? null)
        setIsOpen(true)
    }

    const close = () => {
        setIsOpen(false)
        setData(null)
    }

    return { isOpen, data, open, close }
}

// ============================================
// FORM STATE HOOK
// ============================================

interface UseFormOptions<T> {
    initialValues: T
    validate?: (values: T) => Record<string, string>
    onSubmit: (values: T) => Promise<void>
}

export function useForm<T extends Record<string, any>>({ initialValues, validate, onSubmit }: UseFormOptions<T>) {
    const [values, setValues] = useState<T>(initialValues)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [submitting, setSubmitting] = useState(false)

    const setValue = <K extends keyof T>(key: K, value: T[K]) => {
        setValues(prev => ({ ...prev, [key]: value }))
    }

    const reset = (newValues?: T) => {
        setValues(newValues ?? initialValues)
        setErrors({})
    }

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault()

        if (validate) {
            const validationErrors = validate(values)
            setErrors(validationErrors)
            if (Object.keys(validationErrors).length > 0) return
        }

        setSubmitting(true)
        try {
            await onSubmit(values)
        } finally {
            setSubmitting(false)
        }
    }

    return { values, errors, submitting, setValue, setValues, setErrors, reset, handleSubmit }
}
