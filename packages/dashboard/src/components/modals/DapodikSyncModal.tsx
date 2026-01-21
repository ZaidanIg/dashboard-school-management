import { useState } from 'react'
import { X, RefreshCw, CheckCircle, AlertCircle, Users, Database, Cloud } from 'lucide-react'
import { syncFromDapodik } from '@/services/studentApi'

interface DapodikSyncModalProps {
    isOpen: boolean
    onClose: () => void
    onSync: () => void
}

type SyncStep = 'idle' | 'syncing' | 'success' | 'error'

interface SyncResult {
    totalFound: number
    imported: number
    skipped: number
    failed: number
    students: object[]
}

export default function DapodikSyncModal({ isOpen, onClose, onSync }: DapodikSyncModalProps) {
    const [step, setStep] = useState<SyncStep>('idle')
    const [result, setResult] = useState<SyncResult | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [npsn, setNpsn] = useState('20100001') // Default NPSN
    const [selectedClass, setSelectedClass] = useState('all')

    if (!isOpen) return null

    const handleSync = async () => {
        setError(null)
        setStep('syncing')

        try {
            const syncResult = await syncFromDapodik({
                npsn,
                tingkat: selectedClass !== 'all' ? selectedClass : undefined,
            })

            if (!syncResult.success) {
                throw new Error('Sinkronisasi gagal')
            }

            setResult({
                totalFound: syncResult.totalFound,
                imported: syncResult.imported,
                skipped: syncResult.skipped,
                failed: syncResult.failed,
                students: syncResult.students,
            })
            setStep('success')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
            setStep('error')
        }
    }

    const handleComplete = () => {
        onSync()
        onClose()
    }

    const resetModal = () => {
        setStep('idle')
        setResult(null)
        setError(null)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border-color dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600">
                            <Database size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-text-main dark:text-white">Sinkronisasi Dapodik</h2>
                            <p className="text-sm text-text-secondary">Tarik data siswa dari Dapodik</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg">
                        <X size={20} className="text-text-secondary" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Info Box */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <Cloud size={20} className="text-purple-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-text-main dark:text-white">Integrasi Dapodik</p>
                                <p className="text-xs text-text-secondary">
                                    Data akan ditarik dari sistem Dapodik menggunakan NPSN sekolah.
                                    Pastikan data di Dapodik sudah terupdate.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    {step === 'idle' && (
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">
                                    NPSN Sekolah
                                </label>
                                <input
                                    type="text"
                                    value={npsn}
                                    onChange={(e) => setNpsn(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm"
                                    placeholder="Masukkan NPSN sekolah"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">
                                    Filter Tingkat
                                </label>
                                <select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm"
                                >
                                    <option value="all">Semua Tingkat</option>
                                    <option value="10">Kelas 10</option>
                                    <option value="11">Kelas 11</option>
                                    <option value="12">Kelas 12</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Progress */}
                    {step === 'syncing' && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <RefreshCw size={32} className="text-purple-600 animate-spin" />
                            </div>
                            <p className="font-medium text-text-main dark:text-white">Sedang menarik data dari Dapodik...</p>
                            <p className="text-sm text-text-secondary mt-2">NPSN: {npsn}</p>
                        </div>
                    )}

                    {/* Success */}
                    {step === 'success' && result && (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                <CheckCircle size={32} className="text-emerald-600" />
                            </div>
                            <p className="font-bold text-text-main dark:text-white text-lg mb-2">Sinkronisasi Berhasil!</p>

                            <div className="grid grid-cols-3 gap-4 mt-6 mb-4">
                                <div className="bg-slate-50 dark:bg-gray-700/50 rounded-lg p-3">
                                    <p className="text-2xl font-bold text-primary">{result.totalFound}</p>
                                    <p className="text-xs text-text-secondary">Ditemukan</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-gray-700/50 rounded-lg p-3">
                                    <p className="text-2xl font-bold text-emerald-600">{result.imported}</p>
                                    <p className="text-xs text-text-secondary">Ditambahkan</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-gray-700/50 rounded-lg p-3">
                                    <p className="text-2xl font-bold text-amber-600">{result.skipped}</p>
                                    <p className="text-xs text-text-secondary">Dilewati</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {step === 'error' && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                                <AlertCircle size={32} className="text-rose-600" />
                            </div>
                            <p className="font-bold text-text-main dark:text-white text-lg mb-2">Sinkronisasi Gagal</p>
                            <p className="text-sm text-text-secondary">{error}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-border-color dark:border-gray-700">
                    {step === 'idle' && (
                        <>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-gray-700"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSync}
                                disabled={!npsn}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                            >
                                <RefreshCw size={16} />
                                Mulai Sinkronisasi
                            </button>
                        </>
                    )}

                    {step === 'success' && (
                        <>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-gray-700"
                            >
                                Tutup
                            </button>
                            <button
                                onClick={handleComplete}
                                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                            >
                                <Users size={16} />
                                Selesai
                            </button>
                        </>
                    )}

                    {step === 'error' && (
                        <>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-gray-700"
                            >
                                Tutup
                            </button>
                            <button
                                onClick={resetModal}
                                className="px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                            >
                                <RefreshCw size={16} />
                                Coba Lagi
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
