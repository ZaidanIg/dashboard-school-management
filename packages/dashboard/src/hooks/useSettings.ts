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
            // Clean empty strings from options
            const cleanOptions = Object.fromEntries(
                Object.entries(options).filter(([_, v]) => v !== undefined && v !== '')
            )
            const response = await api.get<{ data: User[]; meta: typeof meta }>('/api/settings/users', cleanOptions)
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

export function useUserMutations() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const createUser = async (data: { name: string; email: string; password?: string; role?: string; status?: string }) => {
        setLoading(true)
        setError(null)
        try {
            const res = await api.post<User>('/api/settings/users', data)
            return res
        } catch (err: any) {
            setError(err.message || 'Gagal menambahkan user')
            return null
        } finally {
            setLoading(false)
        }
    }

    const updateUser = async (id: string, data: Partial<User>) => {
        setLoading(true)
        setError(null)
        try {
            const res = await api.put<User>(`/api/settings/users/${id}`, data)
            return res
        } catch (err: any) {
            setError(err.message || 'Gagal memperbarui user')
            return null
        } finally {
            setLoading(false)
        }
    }

    const deleteUser = async (id: string) => {
        setLoading(true)
        setError(null)
        try {
            await api.delete(`/api/settings/users/${id}`)
            return true
        } catch (err: any) {
            setError(err.message || 'Gagal menghapus user')
            return false
        } finally {
            setLoading(false)
        }
    }

    return { createUser, updateUser, deleteUser, loading, error }
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

// Role Mutations
export function useRoleMutations() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const createRole = async (data: { name: string; description?: string; permissions: string[] }) => {
        setLoading(true)
        setError(null)
        try {
            const res = await api.post<Role>('/api/settings/roles', data)
            return res
        } catch (err: any) {
            setError(err.message || 'Gagal membuat role')
            return null
        } finally {
            setLoading(false)
        }
    }

    const updateRole = async (id: string, data: { name?: string; description?: string; permissions?: string[] }) => {
        setLoading(true)
        setError(null)
        try {
            const res = await api.put<Role>(`/api/settings/roles/${id}`, data)
            return res
        } catch (err: any) {
            setError(err.message || 'Gagal memperbarui role')
            return null
        } finally {
            setLoading(false)
        }
    }

    const deleteRole = async (id: string) => {
        setLoading(true)
        setError(null)
        try {
            await api.delete(`/api/settings/roles/${id}`)
            return true
        } catch (err: any) {
            setError(err.message || 'Gagal menghapus role')
            return false
        } finally {
            setLoading(false)
        }
    }

    return { createRole, updateRole, deleteRole, loading, error }
}

export interface DataBackupItem {
    id: string
    filename: string
    size: number
    type: string
    status: string
    storageUrl?: string
    createdAt: string
    completedAt?: string
}

// Data Backups
export function useBackups() {
    const [backups, setBackups] = useState<DataBackupItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchBackups = useCallback(async () => {
        setLoading(true)
        try {
            const data = await api.get<DataBackupItem[]>('/api/settings/backups')
            if (Array.isArray(data)) {
                setBackups(data)
            }
        } catch (err: any) {
            setError(err.message || 'Gagal memuat riwayat backup')
        } finally {
            setLoading(false)
        }
    }, [])

    const createBackup = async (type = 'MANUAL') => {
        try {
            const res = await api.post<DataBackupItem>('/api/settings/backups', { type })
            await fetchBackups()
            return res
        } catch (err: any) {
            setError(err.message || 'Gagal membuat backup')
            return null
        }
    }

    const deleteBackup = async (id: string) => {
        try {
            await api.delete(`/api/settings/backups/${id}`)
            await fetchBackups()
            return true
        } catch (err: any) {
            setError(err.message || 'Gagal menghapus backup')
            return false
        }
    }

    const restoreBackup = async (backupData: any) => {
        try {
            await api.post('/api/settings/backups/restore', { backupData })
            return true
        } catch (err: any) {
            setError(err.message || 'Gagal memulihkan backup')
            return false
        }
    }

    useEffect(() => {
        fetchBackups()
    }, [fetchBackups])

    return {
        backups,
        loading,
        error,
        refetch: fetchBackups,
        createBackup,
        deleteBackup,
        restoreBackup
    }
}

