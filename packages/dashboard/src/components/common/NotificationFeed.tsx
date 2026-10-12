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
    if (diffMin < 60) return `${diffMin}m yang lalu`
    const diffHours = Math.floor(diffMin / 60)
    if (diffHours < 24) return `${diffHours}j yang lalu`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays}h yang lalu`

    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

function getNotificationVisuals(type: string) {
    switch (type) {
        case 'ASSIGNMENT':
            return {
                icon: BookOpen,
                bgColor: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
                badgeText: 'Tugas'
            }
        case 'SUBMISSION':
            return {
                icon: FileCheck2,
                bgColor: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
                badgeText: 'Pengumpulan'
            }
        case 'ANNOUNCEMENT':
            return {
                icon: Megaphone,
                bgColor: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
                badgeText: 'Pengumuman'
            }
        case 'INFO':
        default:
            return {
                icon: Info,
                bgColor: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
                badgeText: 'Info'
            }
    }
}

interface NotificationFeedProps {
    title?: string
    subtitle?: string
    maxItems?: number
    className?: string
}

export default function NotificationFeed({
    title = 'Notifikasi & Pemberitahuan',
    subtitle = 'Update tugas, informasi sekolah, dan pengumuman',
    maxItems = 5,
    className = ''
}: NotificationFeedProps) {
    const navigate = useNavigate()
    const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications()

    const displayItems = notifications.slice(0, maxItems)

    const handleItemClick = (notification: AppNotification) => {
        if (!notification.isRead) {
            markAsRead(notification.id)
        }
        if (notification.link) {
            navigate(notification.link)
        }
    }

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-2xl border border-border-color dark:border-gray-700 p-6 shadow-sm ${className}`}>
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                        <Bell size={22} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-text-main dark:text-white leading-tight">{title}</h2>
                            {unreadCount > 0 && (
                                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
                                    {unreadCount} baru
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-text-secondary dark:text-gray-400 mt-0.5">{subtitle}</p>
                    </div>
                </div>

                {unreadCount > 0 && (
                    <button
                        type="button"
                        onClick={markAllAsRead}
                        className="text-xs font-semibold text-primary hover:text-primary/80 dark:text-blue-400 flex items-center gap-1 transition-colors hover:underline"
                    >
                        <CheckCheck size={14} />
                        <span className="hidden sm:inline">Tandai semua dibaca</span>
                    </button>
                )}
            </div>

            {loading && notifications.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-gray-400">
                    <Loader2 size={20} className="animate-spin mr-2 text-primary" />
                    <span className="text-xs">Memuat notifikasi...</span>
                </div>
            ) : displayItems.length === 0 ? (
                <div className="p-8 text-center text-slate-500 border border-dashed rounded-xl border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Belum ada notifikasi baru</p>
                    <p className="text-xs text-gray-400 mt-1">Notifikasi tugas dan pengumuman akan ditampilkan di sini.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {displayItems.map((notification) => {
                        const visuals = getNotificationVisuals(notification.type)
                        const Icon = visuals.icon

                        return (
                            <div
                                key={notification.id}
                                onClick={() => handleItemClick(notification)}
                                className={`p-3.5 rounded-xl border transition-all cursor-pointer group relative flex gap-3 ${!notification.isRead
                                    ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-950/40 shadow-2xs'
                                    : 'border-border-color dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700/30'
                                    }`}
                            >
                                <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${visuals.bgColor}`}>
                                    <Icon size={18} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 shrink-0">
                                                {visuals.badgeText}
                                            </span>
                                            <h4 className={`text-sm truncate leading-snug ${!notification.isRead
                                                ? 'font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors'
                                                : 'font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary transition-colors'
                                                }`}>
                                                {notification.title}
                                            </h4>
                                        </div>
                                        <span className="text-[11px] text-gray-400 shrink-0 whitespace-nowrap">
                                            {formatTimeAgo(notification.createdAt)}
                                        </span>
                                    </div>

                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                                        {notification.message}
                                    </p>

                                    {notification.link && (
                                        <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-primary dark:text-blue-400">
                                            <span>Lihat detail</span>
                                            <ExternalLink size={10} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
