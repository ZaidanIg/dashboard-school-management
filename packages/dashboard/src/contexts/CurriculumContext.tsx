import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { api } from '@/lib/api'

export type CurriculumType = 'K13' | 'MERDEKA'

interface CurriculumContextType {
    curriculumType: CurriculumType
    loading: boolean
    error: string | null
    setCurriculumType: (type: CurriculumType) => Promise<boolean>
    refresh: () => void
}

const CurriculumContext = createContext<CurriculumContextType | null>(null)

export function CurriculumProvider({ children }: { children: React.ReactNode }) {
    const [curriculumType, setCurriculumTypeState] = useState<CurriculumType>('MERDEKA')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchCurriculumType = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await api.get<{ curriculumType: CurriculumType }>('/api/settings/curriculum')
            setCurriculumTypeState(data.curriculumType)
        } catch (err) {
            console.error('Failed to fetch curriculum type:', err)
            setError('Gagal memuat pengaturan kurikulum')
            // Default to MERDEKA on error
            setCurriculumTypeState('MERDEKA')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchCurriculumType()
    }, [fetchCurriculumType])

    const setCurriculumType = async (type: CurriculumType): Promise<boolean> => {
        try {
            setError(null)
            await api.put('/api/settings/curriculum', { curriculumType: type })
            setCurriculumTypeState(type)
            return true
        } catch (err) {
            console.error('Failed to set curriculum type:', err)
            setError('Gagal menyimpan pengaturan kurikulum')
            return false
        }
    }

    return (
        <CurriculumContext.Provider
            value={{
                curriculumType,
                loading,
                error,
                setCurriculumType,
                refresh: fetchCurriculumType
            }}
        >
            {children}
        </CurriculumContext.Provider>
    )
}

export function useCurriculumType() {
    const ctx = useContext(CurriculumContext)
    if (!ctx) {
        throw new Error('useCurriculumType must be used within CurriculumProvider')
    }
    return ctx
}

// Re-export for convenience
export { CurriculumContext }
