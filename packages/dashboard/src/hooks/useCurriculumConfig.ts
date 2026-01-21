import { useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'
import type { CurriculumConfig, ActiveCurriculumResponse, ReportTemplate } from '../types'

const API_BASE = '/api'

/**
 * Hook for fetching and managing curriculum configurations
 */
export const useCurriculumConfig = () => {
    const [configs, setConfigs] = useState<CurriculumConfig[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchConfigs = useCallback(async (isActive?: boolean) => {
        setLoading(true)
        setError(null)
        try {
            const params = new URLSearchParams()
            if (isActive !== undefined) params.set('isActive', String(isActive))

            const response = await api.get<CurriculumConfig[]>(
                `${API_BASE}/curriculum-configs${params.toString() ? `?${params}` : ''}`
            )
            setConfigs(response.data || [])
            return response.data
        } catch (err) {
            setError('Failed to fetch curriculum configs')
            console.error(err)
            return []
        } finally {
            setLoading(false)
        }
    }, [])

    const getConfig = useCallback(async (idOrCode: string) => {
        setLoading(true)
        setError(null)
        try {
            const response = await api.get<CurriculumConfig>(
                `${API_BASE}/curriculum-configs/${idOrCode}`
            )
            return response.data
        } catch (err) {
            setError('Failed to fetch curriculum config')
            console.error(err)
            return null
        } finally {
            setLoading(false)
        }
    }, [])

    const getActiveConfig = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await api.get<CurriculumConfig[]>(
                `${API_BASE}/curriculum-configs?isActive=true`
            )
            return response.data?.[0] || null
        } catch (err) {
            setError('Failed to fetch active curriculum config')
            console.error(err)
            return null
        } finally {
            setLoading(false)
        }
    }, [])

    const getConfigForClass = useCallback(async (classId: string) => {
        setLoading(true)
        setError(null)
        try {
            const response = await api.get<ActiveCurriculumResponse>(
                `${API_BASE}/curriculum-configs/class/${classId}`
            )
            return response.data
        } catch (err) {
            setError('Failed to fetch curriculum config for class')
            console.error(err)
            return null
        } finally {
            setLoading(false)
        }
    }, [])

    const createConfig = useCallback(async (data: Partial<CurriculumConfig>) => {
        setLoading(true)
        setError(null)
        try {
            const response = await api.post<CurriculumConfig>(
                `${API_BASE}/curriculum-configs`,
                data
            )
            await fetchConfigs()
            return response.data
        } catch (err) {
            setError('Failed to create curriculum config')
            console.error(err)
            return null
        } finally {
            setLoading(false)
        }
    }, [fetchConfigs])

    const updateConfig = useCallback(async (id: string, data: Partial<CurriculumConfig>) => {
        setLoading(true)
        setError(null)
        try {
            const response = await api.put<CurriculumConfig>(
                `${API_BASE}/curriculum-configs/${id}`,
                data
            )
            await fetchConfigs()
            return response.data
        } catch (err) {
            setError('Failed to update curriculum config')
            console.error(err)
            return null
        } finally {
            setLoading(false)
        }
    }, [fetchConfigs])

    const setActiveConfig = useCallback(async (id: string) => {
        setLoading(true)
        setError(null)
        try {
            const response = await api.post<CurriculumConfig>(
                `${API_BASE}/curriculum-configs/${id}/activate`
            )
            await fetchConfigs()
            return response.data
        } catch (err) {
            setError('Failed to set active curriculum')
            console.error(err)
            return null
        } finally {
            setLoading(false)
        }
    }, [fetchConfigs])

    const linkToAcademicYear = useCallback(async (
        curriculumId: string,
        academicYearId: string,
        gradeLevel?: number
    ) => {
        setLoading(true)
        setError(null)
        try {
            const response = await api.post(
                `${API_BASE}/curriculum-configs/link-academic-year`,
                { curriculumId, academicYearId, gradeLevel }
            )
            return response.data
        } catch (err) {
            setError('Failed to link curriculum to academic year')
            console.error(err)
            return null
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchConfigs()
    }, [fetchConfigs])

    return {
        configs,
        loading,
        error,
        fetchConfigs,
        getConfig,
        getActiveConfig,
        getConfigForClass,
        createConfig,
        updateConfig,
        setActiveConfig,
        linkToAcademicYear
    }
}

/**
 * Hook for fetching report templates
 */
export const useReportTemplates = () => {
    const [templates, setTemplates] = useState<ReportTemplate[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchTemplates = useCallback(async (isActive?: boolean) => {
        setLoading(true)
        setError(null)
        try {
            const params = new URLSearchParams()
            if (isActive !== undefined) params.set('isActive', String(isActive))

            const response = await api.get<ReportTemplate[]>(
                `${API_BASE}/report-templates${params.toString() ? `?${params}` : ''}`
            )
            setTemplates(response.data || [])
            return response.data
        } catch (err) {
            setError('Failed to fetch report templates')
            console.error(err)
            return []
        } finally {
            setLoading(false)
        }
    }, [])

    const getTemplate = useCallback(async (code: string) => {
        setLoading(true)
        setError(null)
        try {
            const response = await api.get<ReportTemplate>(
                `${API_BASE}/report-templates/${code}`
            )
            return response.data
        } catch (err) {
            setError('Failed to fetch report template')
            console.error(err)
            return null
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchTemplates()
    }, [fetchTemplates])

    return {
        templates,
        loading,
        error,
        fetchTemplates,
        getTemplate
    }
}
