import { useFetch, useMutations } from './useShared'


export interface Announcement {
    id: string
    title: string
    content: string
    type: 'INFO' | 'MEETING' | 'EXAM' | 'URGENT'
    target: 'ALL' | 'STUDENTS' | 'TEACHERS' | 'PARENTS'
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
    authorId: string
    createdAt: string
    updatedAt: string
    author?: {
        name: string
    }
}

export interface Letter {
    id: string
    referenceNumber: string
    title: string
    type: 'OFFICIAL' | 'INVITATION' | 'NOTICE'
    recipient: string
    status: 'DRAFT' | 'SENT' | 'ARCHIVED'
    createdAt: string
    fileUrl?: string
}

export type AnnouncementFormData = Omit<Announcement, 'id' | 'createdAt' | 'updatedAt' | 'author'>
export type LetterFormData = Omit<Letter, 'id' | 'createdAt' | 'status'>

export function useAnnouncements(params?: Record<string, string | number | undefined>) {
    const { data: rawData, loading, error, refetch } = useFetch<any>('/api/communication/announcements', params, {
        initialData: []
    })

    const announcements: Announcement[] = Array.isArray(rawData)
        ? rawData
        : (Array.isArray(rawData?.data) ? rawData.data : [])

    const { create, update, remove, loading: mutationLoading } = useMutations<Announcement, AnnouncementFormData, Partial<AnnouncementFormData>>('/api/communication/announcements')

    return {
        announcements,
        meta: rawData?.meta,
        loading,
        mutationLoading,
        error,
        refetch,
        create,
        update,
        remove
    }
}

export function useLetters(params?: Record<string, string | number | undefined>) {
    const { data: rawData, loading, error, refetch } = useFetch<any>('/api/communication/letters', params, {
        initialData: []
    })

    const letters: Letter[] = Array.isArray(rawData)
        ? rawData
        : (Array.isArray(rawData?.data) ? rawData.data : [])

    const { create, update, remove, loading: mutationLoading } = useMutations<Letter, LetterFormData, Partial<LetterFormData>>('/api/communication/letters')

    return {
        letters,
        meta: rawData?.meta,
        loading,
        mutationLoading,
        error,
        refetch,
        create,
        update,
        remove
    }
}
