import { MessageCircle, Send, Users, Check, Clock, Plus } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'
import StatusBadge from '@/components/common/StatusBadge'

const blasts = [
    {
        id: '1',
        title: 'Pengingat Pembayaran SPP',
        message: 'Yth. Bapak/Ibu Wali Murid, mohon untuk segera melunasi pembayaran SPP bulan Januari...',
        recipients: 'Orang Tua Kelas 10',
        sentAt: '2024-01-13 08:00',
        totalRecipients: 120,
        delivered: 118,
        read: 95,
        status: 'sent',
    },
    {
        id: '2',
        title: 'Undangan Rapat Wali Murid',
        message: 'Dengan hormat, kami mengundang Bapak/Ibu untuk hadir dalam rapat wali murid...',
        recipients: 'Semua Orang Tua',
        sentAt: '2024-01-10 10:30',
        totalRecipients: 450,
        delivered: 445,
        read: 380,
        status: 'sent',
    },
    {
        id: '3',
        title: 'Info Libur Semester',
        message: 'Diberitahukan kepada seluruh siswa bahwa libur semester akan dimulai...',
        recipients: 'Semua Siswa & Orang Tua',
        sentAt: '-',
        totalRecipients: 1200,
        delivered: 0,
        read: 0,
        status: 'draft',
    },
]

const templates = [
    { id: '1', name: 'Pengingat SPP', category: 'Keuangan' },
    { id: '2', name: 'Undangan Rapat', category: 'Umum' },
    { id: '3', name: 'Info Kegiatan', category: 'Akademik' },
    { id: '4', name: 'Pemberitahuan Libur', category: 'Umum' },
]

export default function WhatsAppBlast() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="WhatsApp Blast"
                subtitle="Kirim pesan massal melalui WhatsApp"
                breadcrumb={[
                    { label: 'Komunikasi', path: '/communication' },
                    { label: 'WhatsApp Blast' },
                ]}
                actions={
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors">
                        <Plus size={18} />
                        Buat Pesan Baru
                    </button>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-border-color dark:border-gray-700 flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600">
                        <MessageCircle size={24} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-text-main dark:text-white">25</p>
                        <p className="text-sm text-text-secondary">Total Broadcast</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-border-color dark:border-gray-700 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600">
                        <Send size={24} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-text-main dark:text-white">8,500</p>
                        <p className="text-sm text-text-secondary">Pesan Terkirim</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-border-color dark:border-gray-700 flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        <Check size={24} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-text-main dark:text-white">98%</p>
                        <p className="text-sm text-text-secondary">Delivery Rate</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-border-color dark:border-gray-700 flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-text-main dark:text-white">1,234</p>
                        <p className="text-sm text-text-secondary">Total Kontak</p>
                    </div>
                </div>
            </div>

            <FilterBar
                searchPlaceholder="Cari broadcast..."
                filters={[
                    {
                        label: 'Status',
                        options: [
                            { label: 'Terkirim', value: 'sent' },
                            { label: 'Draft', value: 'draft' },
                            { label: 'Terjadwal', value: 'scheduled' },
                        ],
                    },
                ]}
            />

            {/* Recent Broadcasts */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700">
                <div className="p-4 border-b border-border-color dark:border-gray-700">
                    <h3 className="font-semibold text-text-main dark:text-white">Riwayat Broadcast</h3>
                </div>
                <div className="divide-y divide-border-color dark:divide-gray-700">
                    {blasts.map((blast) => (
                        <div key={blast.id} className="p-4 hover:bg-slate-50 dark:hover:bg-gray-700/50">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium text-text-main dark:text-white">{blast.title}</h4>
                                        <StatusBadge
                                            status={blast.status === 'sent' ? 'success' : 'warning'}
                                            label={blast.status === 'sent' ? 'Terkirim' : 'Draft'}
                                        />
                                    </div>
                                    <p className="text-sm text-text-secondary line-clamp-1">{blast.message}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 text-sm text-text-secondary mt-3">
                                <span className="flex items-center gap-1">
                                    <Users size={14} /> {blast.recipients}
                                </span>
                                {blast.status === 'sent' && (
                                    <>
                                        <span className="flex items-center gap-1">
                                            <Send size={14} /> {blast.delivered}/{blast.totalRecipients} terkirim
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Check size={14} /> {blast.read} dibaca
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} /> {blast.sentAt}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Templates */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-text-main dark:text-white">Template Pesan</h3>
                    <button className="text-sm text-primary font-medium hover:underline">Kelola Template</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {templates.map((template) => (
                        <button
                            key={template.id}
                            className="p-3 border border-border-color dark:border-gray-700 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
                        >
                            <p className="font-medium text-text-main dark:text-white text-sm">{template.name}</p>
                            <p className="text-xs text-text-secondary">{template.category}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
