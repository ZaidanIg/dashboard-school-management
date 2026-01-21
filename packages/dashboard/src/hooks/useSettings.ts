import { useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'
import type { School, Facility, Role, User } from '../types'

// School Profile
export function useSchoolProfile() {
    const [school, setSchool] = useState<School | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchSchool = useCallback(async () => {
        setLoading(true)
        try {
            const data = await api.get<School>('/api/profile/school')
            setSchool(data)
        } catch (err: unknown) {
            const error = err as { message?: string }
            setError(error.message || 'Failed to fetch school profile')
        } finally {
            setLoading(false)
        }
    }, [])

    const updateSchool = async (data: Partial<School>) => {
        try {
            const updated = await api.put<School>('/api/profile/school', data)
            setSchool(updated)
            return updated
        } catch (err: unknown) {
            const error = err as { message?: string }
            setError(error.message || 'Failed to update school')
            return null
        }
    }

    useEffect(() => { fetchSchool() }, [fetchSchool])
    return { school, loading, error, updateSchool, refetch: fetchSchool }
}

// Facilities
export function useFacilities() {
    const [facilities, setFacilities] = useState<Facility[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                const data = await api.get<Facility[]>('/api/profile/facilities')
                setFacilities(data)
            } catch (err: unknown) {
                const error = err as { message?: string }
                setError(error.message || 'Failed to fetch facilities')
            } finally {
                setLoading(false)
            }
        }
        fetchFacilities()
    }, [])

    return { facilities, loading, error }
}

// Roles
export function useRoles() {
    const [roles, setRoles] = useState<Role[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchRoles = useCallback(async () => {
        setLoading(true)
        try {
            const data = await api.get<Role[]>('/api/settings/roles')
            setRoles(data)
        } catch (err: unknown) {
            const error = err as { message?: string }
            setError(error.message || 'Failed to fetch roles')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchRoles() }, [fetchRoles])
    return { roles, loading, error, refetch: fetchRoles }
}

// Users (Admin)
export function useUsers(options: { page?: number; limit?: number; role?: string; status?: string; search?: string } = {}) {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [meta, setMeta] = useState<{ page: number; limit: number; total: number; totalPages: number } | null>(null)

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        try {
            const response = await api.get<{ data: User[]; meta: typeof meta }>('/api/settings/users', options)
            setUsers(response.data)
            setMeta(response.meta || null)
        } catch (err: unknown) {
            const error = err as { message?: string }
            setError(error.message || 'Failed to fetch users')
        } finally {
            setLoading(false)
        }
    }, [options.page, options.limit, options.role, options.status, options.search])

    useEffect(() => { fetchUsers() }, [fetchUsers])
    return { users, loading, error, meta, refetch: fetchUsers }
}

// System Config
export function useSystemConfig() {
    const [config, setConfig] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchConfig = useCallback(async () => {
        setLoading(true)
        try {
            const data = await api.get<Record<string, string>>('/api/settings/config')
            setConfig(data)
        } catch (err: unknown) {
            const error = err as { message?: string }
            setError(error.message || 'Failed to fetch config')
        } finally {
            setLoading(false)
        }
    }, [])

    const updateConfig = async (data: Record<string, string>) => {
        try {
            await api.put('/api/settings/config', data)
            setConfig(prev => ({ ...prev, ...data }))
            return true
        } catch {
            return false
        }
    }

    useEffect(() => { fetchConfig() }, [fetchConfig])
    return { config, loading, error, updateConfig, refetch: fetchConfig }
}
