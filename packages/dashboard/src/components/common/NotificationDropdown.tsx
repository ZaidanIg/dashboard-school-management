import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Bell,
    CheckCheck,
    BookOpen,
    FileCheck2,
    Megaphone,
    Info,
    ExternalLink,
    Loader2
} from 'lucide-react'
import { useNotifications } from '@/hooks/useNotifications'
import type { AppNotification } from '@/types'

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffSec < 60) return 'Baru saja'
    const diffMin = Math.floor(diffSec / 60)
    if (diffMin < 60) return `${diffMin} menit yang lalu`
    const diffHours = Math.floor(diffMin / 60)
    if (diffHours < 24) return `${diffHours} jam yang lalu`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays} hari yang lalu`

    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

function getNotificationVisuals(type: string) {
    switch (type) {
        case 'ASSIGNMENT':
            return {
                icon: BookOpen,
                bgColor: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
                badgeText: 'Tugas'
            }
        case 'SUBMISSION':
            return {
                icon: FileCheck2,
                bgColor: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
                badgeText: 'Pengumpulan'
            }
        case 'ANNOUNCEMENT':
            return {
                icon: Megaphone,
                bgColor: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
                badgeText: 'Pengumuman'
            }
        case 'INFO':
        default:
            return {
                icon: Info,
                bgColor: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400',
                badgeText: 'Info'
            }
    }
}

interface NotificationDropdownProps {
    className?: string
}

export default function NotificationDropdown({ className = '' }: NotificationDropdownProps) {
    const navigate = useNavigate()
    const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications()
    const [isOpen, setIsOpen] = useState(false)
    const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL')
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'UNREAD') return !n.isRead
        return true
    })

    const handleItemClick = (notification: AppNotification) => {
        if (!notification.isRead) {
            markAsRead(notification.id)
        }
        setIsOpen(false)
        if (notification.link) {
            navigate(notification.link)
        }
    }

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {/* Bell Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Notifikasi"
                className="relative p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-5 h-5 px-1 text-[11px] font-bold text-white bg-rose-500 rounded-full ring-2 ring-white dark:ring-gray-900 animate-in zoom-in-50 duration-200">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850/50">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-gray-900 dark:text-white text-base">Notifikasi</h3>
                                {unreadCount > 0 && (
                                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                                        {unreadCount} baru
                                    </span>
                                )}
                            </div>

                            {unreadCount > 0 && (
                                <button
                                    type="button"
                                    onClick={markAllAsRead}
                                    className="text-xs font-medium text-primary hover:text-primary/80 dark:text-blue-400 flex items-center gap-1 transition-colors hover:underline"
                                >
                                    <CheckCheck size={14} />
                                    Tandai semua dibaca
                                </button>
                            )}
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setFilter('ALL')}
                                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${filter === 'ALL'
                                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-xs'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                Semua ({notifications.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilter('UNREAD')}
                                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${filter === 'UNREAD'
                                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-xs'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                Belum Dibaca ({unreadCount})
                            </button>
                        </div>
                    </div>

                    {/* Notification List */}
                    <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800/60">
                        {loading && notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                                <Loader2 size={24} className="animate-spin mb-2 text-primary" />
                                <span className="text-xs">Memuat notifikasi...</span>
                            </div>
                        ) : filteredNotifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-3 text-gray-400">
                                    <Bell size={24} />
                                </div>
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                    {filter === 'UNREAD' ? 'Tidak ada notifikasi baru' : 'Belum ada notifikasi'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[220px]">
                                    Semua tugas, pengumuman, dan informasi penting akan muncul di sini.
                                </p>
                            </div>
                        ) : (
                            filteredNotifications.map((notification) => {
                                const visuals = getNotificationVisuals(notification.type)
                                const Icon = visuals.icon

                                return (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleItemClick(notification)}
                                        className={`p-4 flex gap-3 cursor-pointer transition-colors group relative ${!notification.isRead
                                            ? 'bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/80 dark:hover:bg-blue-950/40'
                                            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                            }`}
                                    >
                                        {/* Icon */}
                                        <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${visuals.bgColor}`}>
                                            <Icon size={18} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h4 className={`text-sm leading-tight truncate ${!notification.isRead
                                                    ? 'font-bold text-gray-900 dark:text-white'
                                                    : 'font-medium text-gray-700 dark:text-gray-300'
                                                    }`}>
                                                    {notification.title}
                                                </h4>
                                                {!notification.isRead && (
                                                    <span className="shrink-0 w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 mt-1" />
                                                )}
                                            </div>

                                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                                {notification.message}
                                            </p>

                                            <div className="flex items-center justify-between mt-2 pt-1">
                                                <span className="text-[11px] text-gray-400 dark:text-gray-500">
                                                    {formatTimeAgo(notification.createdAt)}
                                                </span>

                                                {notification.link && (
                                                    <span className="text-[11px] font-medium text-primary dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                                        Lihat detail <ExternalLink size={10} />
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
