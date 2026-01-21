import { Database, Download, Upload, Clock, Check, HardDrive } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import StatusBadge from '@/components/common/StatusBadge'

const backups = [
    { id: '1', name: 'backup_2024-01-13_full.sql', type: 'Full Backup', size: '256 MB', createdAt: '2024-01-13 02:00', status: 'completed' },
    { id: '2', name: 'backup_2024-01-12_full.sql', type: 'Full Backup', size: '254 MB', createdAt: '2024-01-12 02:00', status: 'completed' },
    { id: '3', name: 'backup_2024-01-11_full.sql', type: 'Full Backup', size: '252 MB', createdAt: '2024-01-11 02:00', status: 'completed' },
    { id: '4', name: 'backup_2024-01-10_incremental.sql', type: 'Incremental', size: '45 MB', createdAt: '2024-01-10 14:00', status: 'completed' },
    { id: '5', name: 'backup_2024-01-10_full.sql', type: 'Full Backup', size: '250 MB', createdAt: '2024-01-10 02:00', status: 'completed' },
]

export default function DataBackup() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Backup Data"
                subtitle="Kelola backup dan restore data sistem"
                breadcrumb={[
                    { label: 'Pengaturan', path: '/settings' },
                    { label: 'Backup Data' },
                ]}
                actions={
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                        <Database size={18} />
                        Backup Sekarang
                    </button>
                }
            />

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-border-color dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600">
                            <Check size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-text-secondary">Backup Terakhir</p>
                            <p className="font-bold text-text-main dark:text-white">13 Jan 2024, 02:00</p>
                            <p className="text-xs text-emerald-600">Berhasil</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-border-color dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-text-secondary">Backup Berikutnya</p>
                            <p className="font-bold text-text-main dark:text-white">14 Jan 2024, 02:00</p>
                            <p className="text-xs text-text-secondary">Terjadwal otomatis</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-border-color dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600">
                            <HardDrive size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-text-secondary">Total Penyimpanan</p>
                            <p className="font-bold text-text-main dark:text-white">1.2 GB / 5 GB</p>
                            <div className="w-24 h-1.5 bg-slate-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                                <div className="w-1/4 h-full bg-purple-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Backup Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                <h3 className="font-semibold text-text-main dark:text-white mb-4">Pengaturan Backup</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm text-text-secondary mb-2">Jadwal Backup Otomatis</label>
                        <select className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm">
                            <option>Setiap Hari (02:00)</option>
                            <option>Setiap Minggu</option>
                            <option>Setiap Bulan</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-text-secondary mb-2">Simpan Backup Selama</label>
                        <select className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm">
                            <option>30 Hari</option>
                            <option>60 Hari</option>
                            <option>90 Hari</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Backup History */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-border-color dark:border-gray-700 flex items-center justify-between">
                    <h3 className="font-semibold text-text-main dark:text-white">Riwayat Backup</h3>
                    <button className="flex items-center gap-2 px-3 py-1 text-sm text-primary font-medium hover:underline">
                        <Upload size={16} /> Restore dari File
                    </button>
                </div>
                <div className="divide-y divide-border-color dark:divide-gray-700">
                    {backups.map((backup) => (
                        <div key={backup.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-gray-700/50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                    <Database size={20} />
                                </div>
                                <div>
                                    <p className="font-medium text-text-main dark:text-white">{backup.name}</p>
                                    <p className="text-sm text-text-secondary">{backup.type} • {backup.size}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm text-text-main dark:text-white">{backup.createdAt}</p>
                                    <StatusBadge status="success" label="Selesai" />
                                </div>
                                <button className="p-2 text-text-secondary hover:text-primary hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg">
                                    <Download size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
