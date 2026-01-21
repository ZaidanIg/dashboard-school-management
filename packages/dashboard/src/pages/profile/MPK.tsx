import { Users, Scale, FileText, Calendar, CheckCircle } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'

const mpkMembers = [
    { name: 'Raffi Ahmad', position: 'Ketua MPK', class: '12 IPA 1', photo: '' },
    { name: 'Nabila Putri', position: 'Wakil Ketua', class: '12 IPS 2', photo: '' },
    { name: 'Kevin Pratama', position: 'Sekretaris', class: '11 IPA 1', photo: '' },
    { name: 'Zahra Aulia', position: 'Wakil Sekretaris', class: '11 IPA 2', photo: '' },
]

const commissions = [
    { name: 'Komisi A (Bidang Kebijakan)', head: 'Bima Sakti', members: 5, focus: 'Pengawasan kebijakan sekolah' },
    { name: 'Komisi B (Bidang Aspirasi)', head: 'Dinda Permata', members: 5, focus: 'Penampungan aspirasi siswa' },
    { name: 'Komisi C (Bidang Pengawasan)', head: 'Aldo Pratama', members: 5, focus: 'Pengawasan OSIS' },
]

const recentActivities = [
    { title: 'Rapat Pleno Anggota MPK', date: '2024-01-10', status: 'completed' },
    { title: 'Forum Aspirasi Siswa', date: '2024-01-08', status: 'completed' },
    { title: 'Evaluasi Kinerja OSIS Semester 1', date: '2024-01-05', status: 'completed' },
    { title: 'Sidang Paripurna', date: '2024-02-15', status: 'upcoming' },
    { title: 'Pemilihan OSIS Baru', date: '2024-06-01', status: 'upcoming' },
]

const legislations = [
    { title: 'Tata Tertib Siswa 2024', status: 'ratified', date: '2024-01-01' },
    { title: 'Aturan Penggunaan Fasilitas', status: 'ratified', date: '2023-08-15' },
    { title: 'Pedoman Kegiatan Ekstrakurikuler', status: 'review', date: '2024-01-12' },
    { title: 'Anggaran Dasar OSIS', status: 'ratified', date: '2023-07-20' },
]

export default function MPK() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="MPK"
                subtitle="Majelis Perwakilan Kelas"
                breadcrumb={[
                    { label: 'Profil Sekolah', path: '/profile' },
                    { label: 'MPK' },
                ]}
            />

            {/* Header Card */}
            <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl p-6 text-white">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                        <Scale size={40} />
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold mb-1">MPK SMA Negeri 1 Jakarta</h2>
                        <p className="text-purple-100">Periode 2024/2025</p>
                        <p className="text-purple-200 text-sm mt-2 max-w-lg">
                            Lembaga legislatif siswa yang bertugas mengawasi OSIS, menampung aspirasi siswa, dan menetapkan kebijakan organisasi.
                        </p>
                    </div>
                </div>
            </div>

            {/* Leadership */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                <h3 className="flex items-center gap-2 font-semibold text-text-main dark:text-white mb-4">
                    <Users size={20} className="text-primary" /> Pimpinan MPK
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {mpkMembers.map((member, index) => (
                        <div key={index} className="text-center p-4 bg-slate-50 dark:bg-gray-700/50 rounded-xl">
                            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">
                                {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <p className="font-medium text-text-main dark:text-white">{member.name}</p>
                            <p className="text-sm text-primary font-medium">{member.position}</p>
                            <p className="text-xs text-text-secondary">{member.class}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Commissions */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                    <h3 className="flex items-center gap-2 font-semibold text-text-main dark:text-white mb-4">
                        <Scale size={20} className="text-primary" /> Komisi
                    </h3>
                    <div className="space-y-3">
                        {commissions.map((commission, index) => (
                            <div key={index} className="p-4 border border-border-color dark:border-gray-700 rounded-lg">
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-medium text-text-main dark:text-white">{commission.name}</h4>
                                    <span className="px-2 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-xs font-medium">
                                        {commission.members} anggota
                                    </span>
                                </div>
                                <p className="text-sm text-text-secondary mb-1">Ketua: {commission.head}</p>
                                <p className="text-xs text-text-secondary">{commission.focus}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legislations */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                    <h3 className="flex items-center gap-2 font-semibold text-text-main dark:text-white mb-4">
                        <FileText size={20} className="text-primary" /> Produk Hukum
                    </h3>
                    <div className="space-y-3">
                        {legislations.map((legislation, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-700/50 rounded-lg">
                                <div>
                                    <p className="font-medium text-text-main dark:text-white text-sm">{legislation.title}</p>
                                    <p className="text-xs text-text-secondary">{legislation.date}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${legislation.status === 'ratified'
                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                    : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                    }`}>
                                    {legislation.status === 'ratified' ? 'Disahkan' : 'Review'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                <h3 className="flex items-center gap-2 font-semibold text-text-main dark:text-white mb-4">
                    <Calendar size={20} className="text-primary" /> Aktivitas Terkini
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                    {recentActivities.map((activity, index) => (
                        <div key={index} className={`p-3 rounded-lg ${activity.status === 'completed'
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
                            }`}>
                            <div className="flex items-start gap-2 mb-2">
                                <CheckCircle size={16} className={activity.status === 'completed' ? 'text-emerald-600' : 'text-amber-600'} />
                                <p className="font-medium text-text-main dark:text-white text-sm leading-tight">{activity.title}</p>
                            </div>
                            <p className="text-xs text-text-secondary">{activity.date}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
