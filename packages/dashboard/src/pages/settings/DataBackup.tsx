import { Database, Download, Upload, Clock, HardDrive, Trash2, RefreshCw, X, FileJson, CheckCircle } from 'lucide-react'
import { useState, useRef } from 'react'
import PageHeader from '@/components/common/PageHeader'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import { useBackups, type DataBackupItem } from '@/hooks/useSettings'
import { useToast } from '@/contexts/ToastContext'

const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

export default function DataBackup() {
    const { backups, loading, createBackup, deleteBackup, restoreBackup, refetch } = useBackups()
    const { addToast } = useToast()

    const [creating, setCreating] = useState(false)
    const [deletingItem, setDeletingItem] = useState<DataBackupItem | null>(null)
    const [isRestoreOpen, setIsRestoreOpen] = useState(false)
    const [restoreFileContent, setRestoreFileContent] = useState<any | null>(null)
    const [restoring, setRestoring] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleCreateBackup = async () => {
        setCreating(true)
        const res = await createBackup('MANUAL')
        setCreating(false)
        if (res) {
            addToast('success', `Backup database berhasil dibuat: ${res.filename}`)
        } else {
            addToast('error', 'Gagal membuat backup data')
        }
    }

    const handleDelete = async () => {
        if (!deletingItem) return
        const ok = await deleteBackup(deletingItem.id)
        setDeletingItem(null)
        if (ok) {
            addToast('success', 'File backup berhasil dihapus')
        } else {
            addToast('error', 'Gagal menghapus file backup')
        }
    }

    const handleDownload = async (item: DataBackupItem) => {
        try {
            window.open(`/api/settings/backups/${item.id}/download`, '_blank')
            addToast('info', `Mengunduh ${item.filename}...`)
        } catch (err) {
            addToast('error', 'Gagal mengunduh file backup')
        }
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target?.result as string)
                setRestoreFileContent(parsed)
            } catch (err) {
                addToast('error', 'File JSON tidak valid atau rusak')
            }
        }
        reader.readAsText(file)
    }

    const handleExecuteRestore = async () => {
        if (!restoreFileContent) return
        setRestoring(true)
        const ok = await restoreBackup(restoreFileContent)
        setRestoring(false)
        if (ok) {
            addToast('success', 'Sistem berhasil dipulihkan dari data backup!')
            setIsRestoreOpen(false)
            setRestoreFileContent(null)
            await refetch()
        } else {
            addToast('error', 'Gagal memulihkan sistem dari file backup')
        }
    }

    // Dynamic Stats
    const totalStorage = backups.reduce((acc, curr) => acc + (curr.size || 0), 0)
    const latestBackup = backups[0]

    return (
        <div className="space-y-6">
            <PageHeader
                title="Backup & Restore Data"
                subtitle="Kelola salinan basis data dan pemulihan sistem sekolah"
                breadcrumb={[
                    { label: 'Pengaturan', path: '/settings' },
                    { label: 'Backup Data' },
                ]}
                actions={
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsRestoreOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 border border-border-color dark:border-gray-600 hover:bg-slate-50 dark:hover:bg-gray-700 text-text-main dark:text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            <Upload size={16} />
                            Restore Data
                        </button>
                        <button
                            onClick={handleCreateBackup}
                            disabled={creating}
                            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
                        >
                            {creating ? <RefreshCw size={18} className="animate-spin" /> : <Database size={18} />}
                            {creating ? 'Membuat Backup...' : 'Backup Sekarang'}
                        </button>
                    </div>
                }
            />

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-border-color dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
                            <CheckCircle size={26} />
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">Backup Terakhir</p>
                            <p className="font-bold text-text-main dark:text-white text-base">
                                {latestBackup
                                    ? new Date(latestBackup.createdAt).toLocaleDateString('id-ID', {
                                          day: 'numeric',
                                          month: 'short',
                                          year: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                      })
                                    : 'Belum ada'}
                            </p>
                            <p className="text-xs text-emerald-600 font-medium">
                                {latestBackup ? `Status: ${latestBackup.status}` : 'Silakan buat backup pertama'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-border-color dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600">
                            <HardDrive size={26} />
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">Total Penyimpanan</p>
                            <p className="font-bold text-text-main dark:text-white text-base">
                                {formatBytes(totalStorage)}
                            </p>
                            <p className="text-xs text-text-secondary">
                                Dari {backups.length} file snapshot tersimpan
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-border-color dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600">
                            <Clock size={26} />
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">Jadwal Otomatis</p>
                            <p className="font-bold text-text-main dark:text-white text-base">Tiap Minggu (02:00)</p>
                            <p className="text-xs text-purple-600 font-medium">Cron task aktif</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Backup History */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-border-color dark:border-gray-700 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-text-main dark:text-white">Riwayat Snapshot Backup</h3>
                        <p className="text-xs text-text-secondary">Daftar arsip database sekolah yang siap diunduh atau dipulihkan.</p>
                    </div>
                    <button
                        onClick={() => refetch()}
                        className="p-1.5 text-text-secondary hover:text-text-main hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg"
                        title="Segarkan data"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>

                {loading && backups.length === 0 ? (
                    <div className="py-12 flex justify-center">
                        <LoadingSpinner />
                    </div>
                ) : backups.length === 0 ? (
                    <div className="p-10 text-center text-text-secondary">
                        <Database className="mx-auto text-gray-300 mb-2" size={40} />
                        <p className="font-medium text-text-main dark:text-white">Belum ada riwayat backup</p>
                        <p className="text-xs mt-1">Klik tombol "Backup Sekarang" untuk membuat salinan data pertama Anda.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border-color dark:divide-gray-700">
                        {backups.map((backup) => (
                            <div
                                key={backup.id}
                                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                                        <FileJson size={22} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-text-main dark:text-white">
                                            {backup.filename}
                                        </p>
                                        <p className="text-xs text-text-secondary flex items-center gap-2 mt-0.5">
                                            <span className="font-medium text-primary uppercase text-[10px] bg-primary/10 px-1.5 py-0.5 rounded">
                                                {backup.type}
                                            </span>
                                            <span>•</span>
                                            <span>{formatBytes(backup.size)}</span>
                                            <span>•</span>
                                            <span>
                                                {new Date(backup.createdAt).toLocaleString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-center">
                                    <button
                                        onClick={() => handleDownload(backup)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                                        title="Unduh File"
                                    >
                                        <Download size={14} /> Unduh JSON
                                    </button>
                                    <button
                                        onClick={() => setDeletingItem(backup)}
                                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                                        title="Hapus Backup"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Restore Modal */}
            {isRestoreOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-border-color dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-text-main dark:text-white">Restore Sistem dari Backup</h3>
                            <button
                                onClick={() => {
                                    setIsRestoreOpen(false)
                                    setRestoreFileContent(null)
                                }}
                                className="text-text-secondary hover:text-text-main p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm text-text-secondary">
                                Pilih file snapshot JSON backup yang telah diunduh sebelumnya untuk memulihkan konfigurasi dan identitas sekolah.
                            </p>

                            <input
                                type="file"
                                accept=".json"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                className="hidden"
                            />

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full border-2 border-dashed border-border-color dark:border-gray-600 hover:border-primary p-6 rounded-xl text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-slate-50 dark:bg-gray-700/30"
                            >
                                <Upload className="text-primary" size={32} />
                                <span className="text-sm font-semibold text-text-main dark:text-white">
                                    {restoreFileContent ? 'File Siap: Ganti File' : 'Klik untuk Pilih File Backup (.json)'}
                                </span>
                                <span className="text-xs text-text-secondary">Maksimum ukuran 50 MB</span>
                            </button>

                            {restoreFileContent && (
                                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs space-y-1">
                                    <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                                        Metadata Backup Terbaca:
                                    </p>
                                    <p className="text-emerald-700 dark:text-emerald-400">
                                        Tanggal Export: {restoreFileContent.metadata?.exportedAt || 'Tidak diketahui'}
                                    </p>
                                    <p className="text-emerald-700 dark:text-emerald-400">
                                        Versi: {restoreFileContent.metadata?.version || '1.0'}
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-3 border-t border-border-color dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsRestoreOpen(false)
                                        setRestoreFileContent(null)
                                    }}
                                    className="px-4 py-2 border border-border-color dark:border-gray-600 text-text-secondary hover:text-text-main rounded-lg text-sm font-medium"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    disabled={!restoreFileContent || restoring}
                                    onClick={handleExecuteRestore}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                                >
                                    {restoring && <LoadingSpinner size="sm" />}
                                    {restoring ? 'Memulihkan Data...' : 'Mulai Restore'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            <ConfirmationModal
                isOpen={!!deletingItem}
                title="Hapus File Backup"
                message={`Apakah Anda yakin ingin menghapus arsip backup "${deletingItem?.filename}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Hapus"
                cancelLabel="Batal"
                variant="danger"
                onConfirm={handleDelete}
                onClose={() => setDeletingItem(null)}
            />
        </div>
    )
}
