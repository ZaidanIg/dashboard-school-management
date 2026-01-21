
import { useState, useCallback, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export interface Curriculum {
    id: string
    name: string
    year: number
    description: string
    isActive: boolean
    _count?: {
        modules: number
    }
}

export interface CurriculumModule {
    id: string
    curriculumId: string
    subjectCode: string
    grade: number
    semester: 'GANJIL' | 'GENAP'
    title: string
    description?: string
    competencies: string[]
}

export function useCurriculum() {
    const [curriculums, setCurriculums] = useState<Curriculum[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchCurriculums = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch(`${API_BASE}/api/curriculum`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (!response.ok) throw new Error('Failed to fetch curriculums')
            const data = await response.json()
            setCurriculums(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching data')
        } finally {
            setLoading(false)
        }
    }, [])

    const createCurriculum = async (data: Partial<Curriculum>) => {
        setLoading(true)
        try {
            const response = await fetch(`${API_BASE}/api/curriculum`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            })
            if (!response.ok) {
                const err = await response.json()
                throw new Error(err.message || 'Failed to create curriculum')
            }
            await fetchCurriculums() // Refresh list
            return { success: true }
        } catch (err) {
            return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
        } finally {
            setLoading(false)
        }
    }

    const updateCurriculum = async (id: string, data: Partial<Curriculum>) => {
        setLoading(true)
        try {
            const response = await fetch(`${API_BASE}/api/curriculum/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            })
            if (!response.ok) {
                const err = await response.json()
                throw new Error(err.message || 'Failed to update curriculum')
            }
            await fetchCurriculums()
            return { success: true }
        } catch (err) {
            return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
        } finally {
            setLoading(false)
        }
    }

    const deleteCurriculum = async (id: string) => {
        setLoading(true)
        try {
            const response = await fetch(`${API_BASE}/api/curriculum/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (!response.ok) throw new Error('Failed to delete curriculum')
            await fetchCurriculums()
            return { success: true }
        } catch (err) {
            return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCurriculums()
    }, [fetchCurriculums])

    return {
        curriculums,
        loading,
        error,
        fetchCurriculums,
        createCurriculum,
        updateCurriculum,
        deleteCurriculum
    }
}

export function useCurriculumModules(curriculumId?: string) {
    const [modules, setModules] = useState<CurriculumModule[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchModules = useCallback(async () => {
        if (!curriculumId) return
        setLoading(true)
        setError(null)
        try {
            const response = await fetch(`${API_BASE}/api/curriculum/${curriculumId}/modules`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (!response.ok) throw new Error('Failed to fetch modules')
            const data = await response.json()
            setModules(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching modules')
        } finally {
            setLoading(false)
        }
    }, [curriculumId])

    const createModule = async (data: Partial<CurriculumModule>) => {
        if (!curriculumId) return { success: false, error: 'No curriculum ID' }
        setLoading(true)
        try {
            const response = await fetch(`${API_BASE}/api/curriculum/${curriculumId}/modules`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            })
            if (!response.ok) {
                const err = await response.json()
                throw new Error(err.message || 'Failed to create module')
            }
            await fetchModules()
            return { success: true }
        } catch (err) {
            return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
        } finally {
            setLoading(false)
        }
    }

    const updateModule = async (moduleId: string, data: Partial<CurriculumModule>) => {
        setLoading(true)
        try {
            const response = await fetch(`${API_BASE}/api/curriculum/modules/${moduleId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            })
            if (!response.ok) {
                const err = await response.json()
                throw new Error(err.message || 'Failed to update module')
            }
            await fetchModules()
            return { success: true }
        } catch (err) {
            return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
        } finally {
            setLoading(false)
        }
    }

    const deleteModule = async (moduleId: string) => {
        setLoading(true)
        try {
            const response = await fetch(`${API_BASE}/api/curriculum/modules/${moduleId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (!response.ok) throw new Error('Failed to delete module')
            await fetchModules()
            return { success: true }
        } catch (err) {
            return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchModules()
    }, [fetchModules])

    return {
        modules,
        loading,
        error,
        fetchModules,
        createModule,
        updateModule,
        deleteModule
    }
}
