import { Settings, Save, School, Bell, Palette } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'

export default function SystemConfig() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Konfigurasi Sistem"
                subtitle="Pengaturan umum sistem aplikasi"
                breadcrumb={[
                    { label: 'Pengaturan', path: '/settings' },
                    { label: 'Konfigurasi' },
                ]}
                actions={
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                        <Save size={18} />
                        Simpan Perubahan
                    </button>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* School Information */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                    <h3 className="flex items-center gap-2 font-semibold text-text-main dark:text-white mb-4">
                        <School size={20} className="text-primary" /> Informasi Sekolah
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-text-secondary mb-1">Nama Sekolah</label>
                            <input
                                type="text"
                                defaultValue="SMA Negeri 1 Jakarta"
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-text-secondary mb-1">NPSN</label>
                            <input
                                type="text"
                                defaultValue="20100001"
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-text-secondary mb-1">Alamat</label>
                            <textarea
                                defaultValue="Jl. Merdeka No. 123, Jakarta Pusat"
                                rows={2}
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm resize-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-text-secondary mb-1">Telepon</label>
                                <input
                                    type="text"
                                    defaultValue="021-12345678"
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-text-secondary mb-1">Email</label>
                                <input
                                    type="email"
                                    defaultValue="info@sman1jakarta.sch.id"
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                    <h3 className="flex items-center gap-2 font-semibold text-text-main dark:text-white mb-4">
                        <Settings size={20} className="text-primary" /> Pengaturan Sistem
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-text-secondary mb-1">Tahun Ajaran Aktif</label>
                            <select className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm">
                                <option>2024/2025</option>
                                <option>2023/2024</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-text-secondary mb-1">Semester Aktif</label>
                            <select className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm">
                                <option>Ganjil</option>
                                <option>Genap</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-text-secondary mb-1">Zona Waktu</label>
                            <select className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm">
                                <option>Asia/Jakarta (WIB)</option>
                                <option>Asia/Makassar (WITA)</option>
                                <option>Asia/Jayapura (WIT)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-text-secondary mb-1">Bahasa</label>
                            <select className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm">
                                <option>Bahasa Indonesia</option>
                                <option>English</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                    <h3 className="flex items-center gap-2 font-semibold text-text-main dark:text-white mb-4">
                        <Bell size={20} className="text-primary" /> Notifikasi
                    </h3>
                    <div className="space-y-4">
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-sm text-text-main dark:text-white">Notifikasi Email</span>
                            <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-primary" />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-sm text-text-main dark:text-white">Notifikasi WhatsApp</span>
                            <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-primary" />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-sm text-text-main dark:text-white">Pengingat SPP</span>
                            <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-primary" />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-sm text-text-main dark:text-white">Notifikasi Kehadiran</span>
                            <input type="checkbox" className="w-5 h-5 rounded text-primary" />
                        </label>
                    </div>
                </div>

                {/* Appearance */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                    <h3 className="flex items-center gap-2 font-semibold text-text-main dark:text-white mb-4">
                        <Palette size={20} className="text-primary" /> Tampilan
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-text-secondary mb-2">Tema</label>
                            <div className="flex gap-3">
                                <button className="flex-1 p-3 border-2 border-primary bg-primary/5 rounded-lg text-center">
                                    <div className="w-full h-8 bg-white rounded mb-2"></div>
                                    <span className="text-sm font-medium text-primary">Light</span>
                                </button>
                                <button className="flex-1 p-3 border border-border-color rounded-lg text-center hover:border-primary transition-colors">
                                    <div className="w-full h-8 bg-gray-800 rounded mb-2"></div>
                                    <span className="text-sm font-medium text-text-secondary">Dark</span>
                                </button>
                                <button className="flex-1 p-3 border border-border-color rounded-lg text-center hover:border-primary transition-colors">
                                    <div className="w-full h-8 bg-gradient-to-r from-white to-gray-800 rounded mb-2"></div>
                                    <span className="text-sm font-medium text-text-secondary">Auto</span>
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-text-secondary mb-1">Warna Utama</label>
                            <div className="flex gap-2">
                                <button className="w-8 h-8 rounded-full bg-blue-600 ring-2 ring-offset-2 ring-blue-600"></button>
                                <button className="w-8 h-8 rounded-full bg-emerald-600 hover:ring-2 hover:ring-offset-2 hover:ring-emerald-600"></button>
                                <button className="w-8 h-8 rounded-full bg-purple-600 hover:ring-2 hover:ring-offset-2 hover:ring-purple-600"></button>
                                <button className="w-8 h-8 rounded-full bg-rose-600 hover:ring-2 hover:ring-offset-2 hover:ring-rose-600"></button>
                                <button className="w-8 h-8 rounded-full bg-amber-600 hover:ring-2 hover:ring-offset-2 hover:ring-amber-600"></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
