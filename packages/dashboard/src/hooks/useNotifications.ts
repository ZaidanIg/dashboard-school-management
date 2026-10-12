import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '@/lib/api'
import { useAuthContext } from '@/contexts/AuthContext'
import type { AppNotification } from '@/types'

interface NotificationsResponse {
    data: AppNotification[]
    meta: {
        total: number
        unreadCount: number
    }
}

export function useNotifications(pollIntervalMs = 25000) {
    const { user } = useAuthContext()
    const [notifications, setNotifications] = useState<AppNotification[]>([])
    const [unreadCount, setUnreadCount] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(true)
    const isMounted = useRef(true)

    const fetchNotifications = useCallback(async (showLoading = false) => {
        if (!user) return
        if (showLoading) setLoading(true)
        try {
            const params: Record<string, string> = {}
            if (user.role) params.role = user.role
            if (user.id) params.userId = user.id

            const res = await api.get<NotificationsResponse>('/api/notifications', params)
            if (isMounted.current && res) {
                const list = Array.isArray(res.data) ? res.data : []
                setNotifications(list)
                setUnreadCount(typeof res.meta?.unreadCount === 'number' ? res.meta.unreadCount : list.filter(n => !n.isRead).length)
            }
        } catch (error) {
            console.error('Failed to load notifications:', error)
        } finally {
            if (isMounted.current && showLoading) {
                setLoading(false)
            }
        }
    }, [user])

    useEffect(() => {
        isMounted.current = true
        fetchNotifications(true)

        if (pollIntervalMs > 0) {
            const interval = setInterval(() => {
                fetchNotifications(false)
            }, pollIntervalMs)
            return () => {
                isMounted.current = false
                clearInterval(interval)
            }
        }

        return () => {
            isMounted.current = false
        }
    }, [fetchNotifications, pollIntervalMs])

    const markAsRead = async (id: string) => {
        // Optimistic update
        setNotifications(prev =>
            prev.map(item =>
                item.id === id ? { ...item, isRead: true, readAt: new Date().toISOString() } : item
            )
        )
        setUnreadCount(prev => Math.max(0, prev - 1))

        try {
            await api.patch(`/api/notifications/${id}/read`)
        } catch (err) {
            console.error('Failed to mark notification as read:', err)
            // Revert on error
            fetchNotifications(false)
        }
    }

    const markAllAsRead = async () => {
        // Optimistic update
        setNotifications(prev =>
            prev.map(item => ({ ...item, isRead: true, readAt: new Date().toISOString() }))
        )
        setUnreadCount(0)

        try {
            const params = new URLSearchParams()
            if (user?.role) params.append('role', user.role)
            if (user?.id) params.append('userId', user.id)
            const qs = params.toString() ? `?${params.toString()}` : ''
            await api.patch(`/api/notifications/read-all${qs}`)
        } catch (err) {
            console.error('Failed to mark all notifications as read:', err)
            fetchNotifications(false)
        }
    }

    return {
        notifications,
        unreadCount,
        loading,
        refetch: () => fetchNotifications(false),
        markAsRead,
        markAllAsRead
    }
}
