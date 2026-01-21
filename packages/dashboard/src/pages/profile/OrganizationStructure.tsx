import { Users, User, Phone, Mail } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'

const leadership = [
    { name: 'Dr. Suharto, M.Pd', position: 'Kepala Sekolah', photo: '', phone: '081234567890', email: 'kepala@sman1jakarta.sch.id' },
    { name: 'Drs. Bambang Susilo', position: 'Wakil Kepala Sekolah Bidang Kurikulum', photo: '', phone: '081234567891', email: 'wakakur@sman1jakarta.sch.id' },
    { name: 'Hj. Siti Rahayu, M.Pd', position: 'Wakil Kepala Sekolah Bidang Kesiswaan', photo: '', phone: '081234567892', email: 'wakasis@sman1jakarta.sch.id' },
    { name: 'Ir. Ahmad Fauzi', position: 'Wakil Kepala Sekolah Bidang Sarana Prasarana', photo: '', phone: '081234567893', email: 'wakasarpras@sman1jakarta.sch.id' },
    { name: 'Dra. Endang Susilowati', position: 'Wakil Kepala Sekolah Bidang Humas', photo: '', phone: '081234567894', email: 'wakahumas@sman1jakarta.sch.id' },
]

const departments = [
    { name: 'MIPA', head: 'Dr. Budi Santoso', members: 15 },
    { name: 'IPS', head: 'Dra. Sri Wahyuni', members: 12 },
    { name: 'Bahasa', head: 'M. Rizki, S.Pd', members: 10 },
    { name: 'Agama & PKN', head: 'H. Abdul Rahman', members: 8 },
    { name: 'Seni & Olahraga', head: 'Agus Purnomo, S.Pd', members: 6 },
]

const committees = [
    { name: 'Komite Sekolah', role: 'Pengawasan & Pendampingan' },
    { name: 'Tim Pengembang Kurikulum', role: 'Penyusunan Kurikulum' },
    { name: 'Tim Penjaminan Mutu', role: 'Quality Assurance' },
    { name: 'Tim BOS', role: 'Pengelolaan Dana BOS' },
]

export default function OrganizationStructure() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Struktur Organisasi"
                subtitle="Struktur kepemimpinan dan organisasi sekolah"
                breadcrumb={[
                    { label: 'Profil Sekolah', path: '/profile' },
                    { label: 'Struktur Organisasi' },
                ]}
            />

            {/* Leadership */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                <h3 className="flex items-center gap-2 font-semibold text-text-main dark:text-white mb-6">
                    <Users size={20} className="text-primary" /> Pimpinan Sekolah
                </h3>

                {/* Principal Card */}
                <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-6 text-white mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                            <User size={40} />
                        </div>
                        <div>
                            <p className="text-lg font-bold">{leadership[0].name}</p>
                            <p className="text-blue-100">{leadership[0].position}</p>
                            <div className="flex gap-4 mt-2 text-sm text-blue-100">
                                <span className="flex items-center gap-1"><Phone size={14} /> {leadership[0].phone}</span>
                                <span className="flex items-center gap-1"><Mail size={14} /> {leadership[0].email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vice Principals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {leadership.slice(1).map((person, index) => (
                        <div key={index} className="border border-border-color dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                    <User size={24} />
                                </div>
                                <div>
                                    <p className="font-semibold text-text-main dark:text-white">{person.name}</p>
                                    <p className="text-sm text-text-secondary">{person.position}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Departments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                    <h3 className="font-semibold text-text-main dark:text-white mb-4">Kelompok Mata Pelajaran</h3>
                    <div className="space-y-3">
                        {departments.map((dept, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-700/50 rounded-lg">
                                <div>
                                    <p className="font-medium text-text-main dark:text-white">{dept.name}</p>
                                    <p className="text-sm text-text-secondary">Ketua: {dept.head}</p>
                                </div>
                                <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm font-medium">
                                    {dept.members} Guru
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                    <h3 className="font-semibold text-text-main dark:text-white mb-4">Tim & Komite</h3>
                    <div className="space-y-3">
                        {committees.map((committee, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-700/50 rounded-lg">
                                <div>
                                    <p className="font-medium text-text-main dark:text-white">{committee.name}</p>
                                    <p className="text-sm text-text-secondary">{committee.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Organization Chart Placeholder */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                <h3 className="font-semibold text-text-main dark:text-white mb-4">Bagan Struktur Organisasi</h3>
                <div className="h-64 bg-slate-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-center">
                    <div className="text-center text-text-secondary">
                        <Users size={48} className="mx-auto mb-2 opacity-50" />
                        <p>Bagan struktur organisasi akan ditampilkan di sini</p>
                        <button className="mt-2 text-sm text-primary font-medium hover:underline">Upload Bagan</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
