import { Users, Calendar, Star, Target, Award } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'

const osisMembers = [
    { name: 'M. Farhan Rizki', position: 'Ketua OSIS', class: '12 IPA 1', photo: '' },
    { name: 'Anisa Putri', position: 'Wakil Ketua', class: '12 IPS 1', photo: '' },
    { name: 'Dimas Pratama', position: 'Sekretaris 1', class: '11 IPA 2', photo: '' },
    { name: 'Rina Wulandari', position: 'Sekretaris 2', class: '11 IPS 1', photo: '' },
    { name: 'Ahmad Fauzi', position: 'Bendahara 1', class: '12 IPA 2', photo: '' },
    { name: 'Siti Nurhaliza', position: 'Bendahara 2', class: '11 IPA 1', photo: '' },
]

const sections = [
    { name: 'Seksi Ketaqwaan', coordinator: 'Fajar Hidayat', members: 8 },
    { name: 'Seksi Pendidikan', coordinator: 'Mega Sari', members: 6 },
    { name: 'Seksi Kesenian', coordinator: 'Rizal Pratama', members: 10 },
    { name: 'Seksi Olahraga', coordinator: 'Doni Saputra', members: 8 },
    { name: 'Seksi Kebersihan', coordinator: 'Putri Ayu', members: 6 },
    { name: 'Seksi Humas', coordinator: 'Bayu Saputro', members: 7 },
]

const programs = [
    { name: 'LDKS (Latihan Dasar Kepemimpinan Siswa)', status: 'completed', date: 'Agustus 2024' },
    { name: 'Class Meeting', status: 'completed', date: 'Desember 2024' },
    { name: 'Pentas Seni', status: 'upcoming', date: 'Februari 2025' },
    { name: 'Bakti Sosial', status: 'upcoming', date: 'Maret 2025' },
    { name: 'Porseni', status: 'upcoming', date: 'April 2025' },
]

export default function OSIS() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="OSIS"
                subtitle="Organisasi Siswa Intra Sekolah"
                breadcrumb={[
                    { label: 'Profil Sekolah', path: '/profile' },
                    { label: 'OSIS' },
                ]}
            />

            {/* Header Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                        <Users size={40} />
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold mb-1">OSIS SMA Negeri 1 Jakarta</h2>
                        <p className="text-blue-100">Periode 2024/2025</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
                            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">45 Anggota</span>
                            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">6 Seksi</span>
                            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">12 Program Kerja</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Leadership */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                <h3 className="flex items-center gap-2 font-semibold text-text-main dark:text-white mb-4">
                    <Star size={20} className="text-primary" /> Pengurus Inti
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {osisMembers.map((member, index) => (
                        <div key={index} className="text-center">
                            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">
                                {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <p className="font-medium text-text-main dark:text-white text-sm">{member.name}</p>
                            <p className="text-xs text-primary font-medium">{member.position}</p>
                            <p className="text-xs text-text-secondary">{member.class}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sections */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                    <h3 className="flex items-center gap-2 font-semibold text-text-main dark:text-white mb-4">
                        <Target size={20} className="text-primary" /> Seksi-Seksi
                    </h3>
                    <div className="space-y-3">
                        {sections.map((section, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-700/50 rounded-lg">
                                <div>
                                    <p className="font-medium text-text-main dark:text-white">{section.name}</p>
                                    <p className="text-sm text-text-secondary">Koordinator: {section.coordinator}</p>
                                </div>
                                <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm font-medium">
                                    {section.members} orang
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Programs */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                    <h3 className="flex items-center gap-2 font-semibold text-text-main dark:text-white mb-4">
                        <Award size={20} className="text-primary" /> Program Kerja
                    </h3>
                    <div className="space-y-3">
                        {programs.map((program, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${program.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                    <div>
                                        <p className="font-medium text-text-main dark:text-white text-sm">{program.name}</p>
                                        <p className="text-xs text-text-secondary flex items-center gap-1">
                                            <Calendar size={10} /> {program.date}
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${program.status === 'completed'
                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                    : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                    }`}>
                                    {program.status === 'completed' ? 'Selesai' : 'Akan Datang'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
