import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import { useToast } from '@/contexts/ToastContext'

// ============================================
// SCHOOL STATS & PROFILE
// ============================================

export interface SchoolLiveStats {
    totalStudents: number
    totalTeachers: number
    totalClasses: number
    totalClassrooms: number
    totalAchievements: number
    totalFacilities: number
    totalOrganizations: number
    school: {
        id: string
        name: string
        npsn: string
        accreditation: string
        accreditationYear?: number | null
        curriculum: string
        status: string
    }
}

export function useSchoolStats() {
    const [stats, setStats] = useState<SchoolLiveStats | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true)
            const data = await api.get<SchoolLiveStats>('/api/profile/school/stats')
            if (data) setStats(data)
        } catch (err) {
            console.error('Failed to fetch school live stats:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchStats()
    }, [fetchStats])

    return { stats, loading, refetch: fetchStats }
}

// ============================================
// SCHOOL STRUCTURE
// ============================================

export type StructureCategory = 'LEADERSHIP' | 'DEPARTMENT' | 'COMMITTEE'

export interface SchoolStructureMember {
    id: string
    schoolId: string
    name: string
    position: string
    category: StructureCategory
    department?: string | null
    phone?: string | null
    email?: string | null
    photo?: string | null
    greeting?: string | null
    order: number
    teacherId?: string | null
    teacher?: { id: string; name: string; nip?: string | null; photo?: string | null } | null
    createdAt: string
    updatedAt: string
}

export interface StructureFormData {
    name: string
    position: string
    category: StructureCategory
    department?: string
    phone?: string
    email?: string
    photo?: string
    greeting?: string
    order?: number
    teacherId?: string
}

export function useSchoolStructures(category?: StructureCategory) {
    const [structures, setStructures] = useState<SchoolStructureMember[]>([])
    const [loading, setLoading] = useState(true)
    const { addToast } = useToast()

    const fetchStructures = useCallback(async () => {
        try {
            setLoading(true)
            const query: Record<string, string> = {}
            if (category) query.category = category
            const data = await api.get<SchoolStructureMember[]>('/api/profile/structure', query)
            if (Array.isArray(data)) setStructures(data)
        } catch (err) {
            console.error('Failed to fetch structures:', err)
        } finally {
            setLoading(false)
        }
    }, [category])

    useEffect(() => {
        fetchStructures()
    }, [fetchStructures])

    const createStructure = async (data: StructureFormData): Promise<boolean> => {
        try {
            const res = await api.post<SchoolStructureMember>('/api/profile/structure', data)
            if (res?.id) {
                addToast('success', 'Anggota struktur berhasil ditambahkan')
                await fetchStructures()
                return true
            }
            return false
        } catch (err: any) {
            addToast('error', err.response?.data?.message || 'Gagal menambahkan anggota struktur')
            return false
        }
    }

    const updateStructure = async (id: string, data: Partial<StructureFormData>): Promise<boolean> => {
        try {
            const res = await api.put<SchoolStructureMember>(`/api/profile/structure/${id}`, data)
            if (res?.id) {
                addToast('success', 'Anggota struktur berhasil diperbarui')
                await fetchStructures()
                return true
            }
            return false
        } catch (err: any) {
            addToast('error', err.response?.data?.message || 'Gagal memperbarui anggota struktur')
            return false
        }
    }

    const deleteStructure = async (id: string): Promise<boolean> => {
        try {
            await api.delete(`/api/profile/structure/${id}`)
            addToast('success', 'Anggota struktur berhasil dihapus')
            await fetchStructures()
            return true
        } catch (err: any) {
            addToast('error', err.response?.data?.message || 'Gagal menghapus anggota struktur')
            return false
        }
    }

    return {
        structures,
        loading,
        refetch: fetchStructures,
        createStructure,
        updateStructure,
        deleteStructure
    }
}

// ============================================
// FACILITIES
// ============================================

export type FacilityCondition = 'GOOD' | 'FAIR' | 'POOR'

export interface FacilityItem {
    id: string
    schoolId: string
    name: string
    category: string
    quantity: number
    area?: number | null
    condition: FacilityCondition
    description?: string | null
    createdAt: string
    updatedAt: string
}

export interface FacilityFormData {
    name: string
    category: string
    quantity: number
    area?: number | null
    condition: FacilityCondition
    description?: string
}

export function useFacilities() {
    const [facilities, setFacilities] = useState<FacilityItem[]>([])
    const [loading, setLoading] = useState(true)
    const { addToast } = useToast()

    const fetchFacilities = useCallback(async () => {
        try {
            setLoading(true)
            const data = await api.get<FacilityItem[]>('/api/profile/facilities')
            if (Array.isArray(data)) setFacilities(data)
        } catch (err) {
            console.error('Failed to fetch facilities:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchFacilities()
    }, [fetchFacilities])

    const createFacility = async (data: FacilityFormData): Promise<boolean> => {
        try {
            const res = await api.post<FacilityItem>('/api/profile/facilities', data)
            if (res?.id) {
                addToast('success', 'Fasilitas berhasil ditambahkan')
                await fetchFacilities()
                return true
            }
            return false
        } catch (err: any) {
            addToast('error', err.response?.data?.message || 'Gagal menambahkan fasilitas')
            return false
        }
    }

    const updateFacility = async (id: string, data: Partial<FacilityFormData>): Promise<boolean> => {
        try {
            const res = await api.put<FacilityItem>(`/api/profile/facilities/${id}`, data)
            if (res?.id) {
                addToast('success', 'Fasilitas berhasil diperbarui')
                await fetchFacilities()
                return true
            }
            return false
        } catch (err: any) {
            addToast('error', err.response?.data?.message || 'Gagal memperbarui fasilitas')
            return false
        }
    }

    const deleteFacility = async (id: string): Promise<boolean> => {
        try {
            await api.delete(`/api/profile/facilities/${id}`)
            addToast('success', 'Fasilitas berhasil dihapus')
            await fetchFacilities()
            return true
        } catch (err: any) {
            addToast('error', err.response?.data?.message || 'Gagal menghapus fasilitas')
            return false
        }
    }

    return {
        facilities,
        loading,
        refetch: fetchFacilities,
        createFacility,
        updateFacility,
        deleteFacility
    }
}

// ============================================
// GALLERY
// ============================================

export interface GalleryItem {
    id: string
    schoolId: string
    title: string
    category: string
    imageUrl: string
    description?: string | null
    date?: string | null
    createdAt: string
}

export interface GalleryItemFormData {
    title: string
    category: string
    imageUrl: string
    description?: string
    date?: string
}

export function useGallery(category?: string) {
    const [items, setItems] = useState<GalleryItem[]>([])
    const [loading, setLoading] = useState(true)
    const { addToast } = useToast()

    const fetchGallery = useCallback(async () => {
        try {
            setLoading(true)
            const queryParams: Record<string, string> = {}
            if (category && category !== 'Semua') {
                queryParams.category = category
            }
            const res = await api.get<GalleryItem[]>('/api/profile/gallery', queryParams)
            if (Array.isArray(res)) {
                setItems(res)
            }
        } catch (err: any) {
            console.error('Failed to fetch gallery:', err)
        } finally {
            setLoading(false)
        }
    }, [category])

    useEffect(() => {
        fetchGallery()
    }, [fetchGallery])

    const createItem = async (data: GalleryItemFormData): Promise<boolean> => {
        try {
            const res = await api.post<GalleryItem>('/api/profile/gallery', data)
            if (res && res.id) {
                addToast('success', 'Foto galeri berhasil ditambahkan')
                await fetchGallery()
                return true
            }
            return false
        } catch (err: any) {
            addToast('error', err.response?.data?.message || 'Gagal menambahkan foto galeri')
            return false
        }
    }

    const updateItem = async (id: string, data: Partial<GalleryItemFormData>): Promise<boolean> => {
        try {
            const res = await api.put<GalleryItem>(`/api/profile/gallery/${id}`, data)
            if (res && res.id) {
                addToast('success', 'Foto galeri berhasil diperbarui')
                await fetchGallery()
                return true
            }
            return false
        } catch (err: any) {
            addToast('error', err.response?.data?.message || 'Gagal memperbarui foto galeri')
            return false
        }
    }

    const deleteItem = async (id: string): Promise<boolean> => {
        try {
            await api.delete(`/api/profile/gallery/${id}`)
            addToast('success', 'Foto galeri berhasil dihapus')
            await fetchGallery()
            return true
        } catch (err: any) {
            addToast('error', err.response?.data?.message || 'Gagal menghapus foto galeri')
            return false
        }
    }

    return {
        items,
        loading,
        refetch: fetchGallery,
        createItem,
        updateItem,
        deleteItem
    }
}

// ============================================
// ACHIEVEMENTS
// ============================================

export interface Achievement {
    id: string
    schoolId: string
    title: string
    category: string
    level: 'SEKOLAH' | 'KOTA' | 'PROVINSI' | 'NASIONAL' | 'INTERNASIONAL'
    year: number
    description?: string | null
    studentId?: string | null
    teacherId?: string | null
    student?: { id: string; name: string } | null
    teacher?: { id: string; name: string } | null
    createdAt: string
}

export interface AchievementFormData {
    title: string
    category: string
    level: string
    year: number
    description?: string
    studentId?: string
    teacherId?: string
}

export function useAchievements(filters?: { category?: string; level?: string; year?: number }) {
    const [achievements, setAchievements] = useState<Achievement[]>([])
    const [loading, setLoading] = useState(true)
    const { addToast } = useToast()

    const fetchAchievements = useCallback(async () => {
        try {
            setLoading(true)
            const queryParams: Record<string, any> = {}
            if (filters?.category) queryParams.category = filters.category
            if (filters?.level) queryParams.level = filters.level
            if (filters?.year) queryParams.year = filters.year

            const res = await api.get<Achievement[]>('/api/profile/achievements', queryParams)
            if (Array.isArray(res)) {
                setAchievements(res)
            }
        } catch (err: any) {
            console.error('Failed to fetch achievements:', err)
        } finally {
            setLoading(false)
        }
    }, [filters?.category, filters?.level, filters?.year])

    useEffect(() => {
        fetchAchievements()
    }, [fetchAchievements])

    const createAchievement = async (data: AchievementFormData): Promise<boolean> => {
        try {
            const res = await api.post<Achievement>('/api/profile/achievements', data)
            if (res && res.id) {
                addToast('success', 'Prestasi berhasil ditambahkan')
                await fetchAchievements()
                return true
            }
            return false
        } catch (err: any) {
            addToast('error', err.response?.data?.message || 'Gagal menambahkan prestasi')
            return false
        }
    }

    const updateAchievement = async (id: string, data: Partial<AchievementFormData>): Promise<boolean> => {
        try {
            const res = await api.put<Achievement>(`/api/profile/achievements/${id}`, data)
            if (res && res.id) {
                addToast('success', 'Prestasi berhasil diperbarui')
                await fetchAchievements()
                return true
            }
            return false
        } catch (err: any) {
            addToast('error', err.response?.data?.message || 'Gagal memperbarui prestasi')
            return false
        }
    }

    const deleteAchievement = async (id: string): Promise<boolean> => {
        try {
            await api.delete(`/api/profile/achievements/${id}`)
            addToast('success', 'Prestasi berhasil dihapus')
            await fetchAchievements()
            return true
        } catch (err: any) {
            addToast('error', err.response?.data?.message || 'Gagal menghapus prestasi')
            return false
        }
    }

    return {
        achievements,
        loading,
        refetch: fetchAchievements,
        createAchievement,
        updateAchievement,
        deleteAchievement
    }
}

// ============================================
// ORGANIZATIONS (OSIS & MPK)
// ============================================

export interface OrgProgram {
    id: string
    name: string
    status: 'upcoming' | 'ongoing' | 'completed'
    date?: string
    coordinator?: string
    description?: string
}

export interface OrgMemberItem {
    id: string
    organizationId: string
    studentId?: string | null
    name?: string | null
    className?: string | null
    section?: string | null
    position: string
    photo?: string | null
    order: number
    student?: { id: string; name: string; nis?: string | null; photo?: string | null } | null
}

export interface StudentOrganizationData {
    id: string
    schoolId: string
    name: string
    type: 'OSIS' | 'MPK' | 'EXTRACURRICULAR'
    period: string
    advisorId?: string | null
    advisor?: { id: string; name: string; nip?: string | null; phone?: string | null } | null
    vision?: string | null
    mission: string[]
    programs?: OrgProgram[] | null
    members: OrgMemberItem[]
}

export interface OrgFormData {
    id?: string
    name: string
    type: 'OSIS' | 'MPK' | 'EXTRACURRICULAR'
    period: string
    advisorId?: string
    vision?: string
    mission?: string[]
    programs?: OrgProgram[]
}

export interface OrgMemberFormData {
    organizationId: string
    studentId?: string
    name?: string
    className?: string
    section?: string
    position: string
    photo?: string
    order?: number
}

export function useOrganizations(type?: 'OSIS' | 'MPK' | 'EXTRACURRICULAR') {
    const [organizations, setOrganizations] = useState<StudentOrganizationData[]>([])
    const [loading, setLoading] = useState(true)
    const { addToast } = useToast()

    const fetchOrgs = useCallback(async () => {
        try {
            setLoading(true)
            const query: Record<string, string> = {}
            if (type) query.type = type
            const data = await api.get<StudentOrganizationData[]>('/api/profile/organizations', query)
            if (Array.isArray(data)) setOrganizations(data)
        } catch (err) {
            console.error('Failed to fetch organizations:', err)
        } finally {
            setLoading(false)
        }
    }, [type])

    useEffect(() => {
        fetchOrgs()
    }, [fetchOrgs])

    const upsertOrg = async (data: OrgFormData): Promise<StudentOrganizationData | null> => {
        try {
            const url = data.id ? `/api/profile/organizations/${data.id}` : '/api/profile/organizations'
            const method = data.id ? api.put : api.post
            const res = await method<StudentOrganizationData>(url, data)
            if (res?.id) {
                addToast('success', 'Data organisasi berhasil disimpan')
                await fetchOrgs()
                return res
            }
            return null
        } catch (err: any) {
            addToast('error', err.response?.data?.message || 'Gagal menyimpan data organisasi')
            return null
        }
    }

    const addMember = async (memberData: OrgMemberFormData): Promise<boolean> => {
        try {
            const res = await api.post<OrgMemberItem>('/api/profile/organizations/members', memberData)
            if (res?.id) {
                addToast('success', 'Anggota berhasil ditambahkan')
                await fetchOrgs()
                return true
            }
            return false
        } catch (err: any) {
            addToast('error', err.response?.data?.message || 'Gagal menambahkan anggota')
            return false
        }
    }

    const updateMember = async (id: string, memberData: Partial<OrgMemberFormData>): Promise<boolean> => {
        try {
            const res = await api.put<OrgMemberItem>(`/api/profile/organizations/members/${id}`, memberData)
            if (res?.id) {
                addToast('success', 'Anggota berhasil diperbarui')
                await fetchOrgs()
                return true
            }
            return false
        } catch (err: any) {
            addToast('error', err.response?.data?.message || 'Gagal memperbarui anggota')
            return false
        }
    }

    const seedOrganization = async (orgType: 'OSIS' | 'MPK'): Promise<boolean> => {
        try {
            const res = await api.post<StudentOrganizationData>('/api/profile/organizations/seed', { type: orgType })
            if (res?.id) {
                addToast('success', `Data default ${orgType} berhasil diinisialisasi`)
                await fetchOrgs()
                return true
            }
            return false
        } catch (err: any) {
            addToast('error', err?.message || err?.response?.data?.message || `Gagal menginisialisasi ${orgType}`)
            return false
        }
    }

    const deleteMember = async (id: string): Promise<boolean> => {
        try {
            await api.delete(`/api/profile/organizations/members/${id}`)
            addToast('success', 'Anggota berhasil dihapus')
            await fetchOrgs()
            return true
        } catch (err: any) {
            addToast('error', err?.message || err?.response?.data?.message || 'Gagal menghapus anggota')
            return false
        }
    }

    return {
        organizations,
        loading,
        refetch: fetchOrgs,
        upsertOrg,
        seedOrganization,
        addMember,
        updateMember,
        deleteMember
    }
}
