import { useState } from 'react'
import { Users, User, Phone, Mail, Plus, Edit2, Trash2, X, Shield, BookOpen, UserCheck, MessageSquare, Upload } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import {
    useSchoolStructures,
    type SchoolStructureMember,
    type StructureFormData,
    type StructureCategory
} from '@/hooks/useProfile'

const defaultLeadership = [
    { name: 'Dr. H. Ahmad Suryana, M.Pd.', position: 'Kepala Sekolah', category: 'LEADERSHIP' as StructureCategory, phone: '081234567890', email: 'kepala@sman1jakarta.sch.id', photo: '/images/landing/principal.jpg', greeting: 'Assalamu’alaikum warahmatullahi wabarakatuh. Selamat datang di portal resmi sekolah kami. Kami berkomitmen memberikan layanan pendidikan unggul dan berkarakter.', order: 1 },
    { name: 'Drs. Bambang Susilo', position: 'Wakil Kepala Sekolah Bidang Kurikulum', category: 'LEADERSHIP' as StructureCategory, department: 'Kurikulum', phone: '081234567891', email: 'wakakur@sman1jakarta.sch.id', photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400', order: 2 },
    { name: 'Hj. Siti Rahayu, M.Pd', position: 'Wakil Kepala Sekolah Bidang Kesiswaan', category: 'LEADERSHIP' as StructureCategory, department: 'Kesiswaan', phone: '081234567892', email: 'wakasis@sman1jakarta.sch.id', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400', order: 3 },
    { name: 'Ir. Ahmad Fauzi', position: 'Wakil Kepala Sekolah Bidang Sarana Prasarana', category: 'LEADERSHIP' as StructureCategory, department: 'Sarpras', phone: '081234567893', email: 'wakasarpras@sman1jakarta.sch.id', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', order: 4 },
    { name: 'Dra. Endang Susilowati', position: 'Wakil Kepala Sekolah Bidang Humas', category: 'LEADERSHIP' as StructureCategory, department: 'Humas', phone: '081234567894', email: 'wakahumas@sman1jakarta.sch.id', photo: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=400', order: 5 },
    { name: 'Dr. Budi Santoso', position: 'Ketua MGMP MIPA', category: 'DEPARTMENT' as StructureCategory, department: 'MIPA', phone: '081298765431', email: 'mipa@sman1jakarta.sch.id', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400', order: 1 },
    { name: 'Dra. Sri Wahyuni', position: 'Ketua MGMP IPS', category: 'DEPARTMENT' as StructureCategory, department: 'IPS', phone: '081298765432', email: 'ips@sman1jakarta.sch.id', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400', order: 2 },
    { name: 'M. Rizki, S.Pd', position: 'Ketua MGMP Bahasa', category: 'DEPARTMENT' as StructureCategory, department: 'Bahasa', phone: '081298765433', email: 'bahasa@sman1jakarta.sch.id', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400', order: 3 },
    { name: 'H. Abdul Rahman, S.Ag', position: 'Ketua Komite Sekolah', category: 'COMMITTEE' as StructureCategory, department: 'Pengawasan & Komite', phone: '081255566677', email: 'komite@sman1jakarta.sch.id', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400', order: 1 },
    { name: 'Tim Pengembang Kurikulum', position: 'Koordinator Kurikulum Merdeka', category: 'COMMITTEE' as StructureCategory, department: 'Pengembangan Kurikulum', photo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400', order: 2 }
]

export default function OrganizationStructure() {
    const { structures, loading, createStructure, updateStructure, deleteStructure } = useSchoolStructures()
    const [activeTab, setActiveTab] = useState<'ALL' | StructureCategory>('ALL')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<SchoolStructureMember | null>(null)
    const [deletingItem, setDeletingItem] = useState<SchoolStructureMember | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [seeding, setSeeding] = useState(false)
    const [uploadingPhoto, setUploadingPhoto] = useState(false)

    const [formData, setFormData] = useState<StructureFormData>({
        name: '',
        position: '',
        category: 'LEADERSHIP',
        department: '',
        phone: '',
        email: '',
        photo: '',
        greeting: '',
        order: 1
    })

    const handleOpenCreate = () => {
        setEditingItem(null)
        setFormData({
            name: '',
            position: '',
            category: activeTab === 'ALL' ? 'LEADERSHIP' : activeTab,
            department: '',
            phone: '',
            email: '',
            photo: '',
            greeting: '',
            order: structures.length + 1
        })
        setIsModalOpen(true)
    }

    const handleOpenEdit = (item: SchoolStructureMember) => {
        setEditingItem(item)
        setFormData({
            name: item.name,
            position: item.position,
            category: item.category,
            department: item.department || '',
            phone: item.phone || '',
            email: item.email || '',
            photo: item.photo || '',
            greeting: item.greeting || '',
            order: item.order || 0
        })
        setIsModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name || !formData.position) return

        setSubmitting(true)
        let ok = false
        if (editingItem) {
            ok = await updateStructure(editingItem.id, formData)
        } else {
            ok = await createStructure(formData)
        }
        setSubmitting(false)

        if (ok) {
            setIsModalOpen(false)
            setEditingItem(null)
        }
    }

    const handleConfirmDelete = async () => {
        if (!deletingItem) return
        await deleteStructure(deletingItem.id)
        setDeletingItem(null)
    }

    const handlePhotoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploadingPhoto(true)
        try {
            const uploadData = new FormData()
            uploadData.append('file', file)
            const token = localStorage.getItem('token') || ''
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                body: uploadData
            })
            if (res.ok) {
                const data = await res.json()
                if (data.url) {
                    setFormData(prev => ({ ...prev, photo: data.url }))
                }
            } else {
                alert('Gagal mengupload foto.')
            }
        } catch (err) {
            console.error('Photo upload error:', err)
        } finally {
            setUploadingPhoto(false)
        }
    }

    const handleSeedDefaults = async () => {
        setSeeding(true)
        for (const item of defaultLeadership) {
            await createStructure(item)
        }
        setSeeding(false)
    }

    const filteredStructures = structures.filter(s => {
        if (activeTab === 'ALL') return true
        return s.category === activeTab
    })

    const leadershipList = structures.filter(s => s.category === 'LEADERSHIP')
    const departmentList = structures.filter(s => s.category === 'DEPARTMENT')
    const committeeList = structures.filter(s => s.category === 'COMMITTEE')

    // Find principal (Kepala Sekolah)
    const principal = leadershipList.find(s =>
        s.position.toLowerCase().includes('kepala sekolah') &&
        !s.position.toLowerCase().includes('wakil')
    ) || leadershipList[0]

    if (loading) {
        return (
            <div className="flex justify-center items-center py-24">
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Struktur Organisasi"
                subtitle="Kelola kepemimpinan, kaprodi mapel, dan komite sekolah yang ditampilkan di sistem dan Landing Page"
                breadcrumb={[
                    { label: 'Profil Sekolah', path: '/profile' },
                    { label: 'Struktur Organisasi' },
                ]}
                actions={
                    <div className="flex gap-2">
                        {structures.length === 0 && (
                            <button
                                onClick={handleSeedDefaults}
                                disabled={seeding}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
                            >
                                {seeding ? 'Memuat Data...' : 'Inisialisasi Data Standar'}
                            </button>
                        )}
                        <button
                            onClick={handleOpenCreate}
                            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                        >
                            <Plus size={18} />
                            Tambah Anggota Struktur
                        </button>
                    </div>
                }
            />

            {/* Filter Tabs */}
            <div className="flex border-b border-border-color dark:border-gray-700 gap-2 pb-1 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('ALL')}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                        activeTab === 'ALL'
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-text-secondary hover:text-text-main dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800'
                    }`}
                >
                    Semua ({structures.length})
                </button>
                <button
                    onClick={() => setActiveTab('LEADERSHIP')}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                        activeTab === 'LEADERSHIP'
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-text-secondary hover:text-text-main dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800'
                    }`}
                >
                    <UserCheck size={16} />
                    Pimpinan Sekolah ({leadershipList.length})
                </button>
                <button
                    onClick={() => setActiveTab('DEPARTMENT')}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                        activeTab === 'DEPARTMENT'
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-text-secondary hover:text-text-main dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800'
                    }`}
                >
                    <BookOpen size={16} />
                    Kelompok Mapel ({departmentList.length})
                </button>
                <button
                    onClick={() => setActiveTab('COMMITTEE')}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                        activeTab === 'COMMITTEE'
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-text-secondary hover:text-text-main dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800'
                    }`}
                >
                    <Shield size={16} />
                    Tim & Komite ({committeeList.length})
                </button>
            </div>

            {/* Principal Highlight Banner */}
            {principal && (activeTab === 'ALL' || activeTab === 'LEADERSHIP') && (
                <div className="bg-gradient-to-r from-primary via-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                        <div className="w-24 h-24 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                            {principal.photo ? (
                                <img src={principal.photo} alt={principal.name} className="w-full h-full object-cover" />
                            ) : (
                                <User size={48} className="text-white" />
                            )}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                                Pimpinan Utama
                            </div>
                            <h3 className="text-2xl font-bold">{principal.name}</h3>
                            <p className="text-blue-100 font-medium text-base">{principal.position}</p>
                            {principal.greeting && (
                                <p className="mt-3 text-sm text-blue-50 bg-black/10 p-3 rounded-xl border border-white/10 italic">
                                    "{principal.greeting}"
                                </p>
                            )}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-xs text-blue-100">
                                {principal.phone && (
                                    <span className="flex items-center gap-1"><Phone size={13} /> {principal.phone}</span>
                                )}
                                {principal.email && (
                                    <span className="flex items-center gap-1"><Mail size={13} /> {principal.email}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleOpenEdit(principal)}
                                className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors"
                            >
                                <Edit2 size={15} /> Edit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Structure List Cards */}
            {filteredStructures.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-border-color dark:border-gray-700 p-12 text-center">
                    <Users className="mx-auto text-gray-400 mb-3" size={48} />
                    <h3 className="text-lg font-bold text-text-main dark:text-white">Belum Ada Anggota Struktur</h3>
                    <p className="text-sm text-text-secondary mt-1 max-w-md mx-auto">
                        Mulai tambahkan pengurus sekolah atau klik tombol inisialisasi untuk membuat struktur standar secara otomatis.
                    </p>
                    <div className="mt-6 flex justify-center gap-3">
                        <button
                            onClick={handleOpenCreate}
                            className="px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm"
                        >
                            Tambah Anggota
                        </button>
                        <button
                            onClick={handleSeedDefaults}
                            disabled={seeding}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium shadow-sm"
                        >
                            Inisialisasi Data Standar
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStructures.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-5 hover:shadow-md transition-all flex flex-col justify-between group"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 overflow-hidden">
                                            {item.photo ? (
                                                <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={24} />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-text-main dark:text-white leading-tight">
                                                {item.name}
                                            </h4>
                                            <p className="text-xs text-primary font-semibold mt-0.5">
                                                {item.position}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                                        item.category === 'LEADERSHIP'
                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                            : item.category === 'DEPARTMENT'
                                            ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                            : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                    }`}>
                                        {item.category === 'LEADERSHIP' ? 'Pimpinan' : item.category === 'DEPARTMENT' ? 'Mapel' : 'Komite'}
                                    </span>
                                </div>

                                {item.department && (
                                    <p className="text-xs text-text-secondary bg-slate-50 dark:bg-gray-700/50 px-2.5 py-1 rounded-md mb-3 w-fit">
                                        Bidang: <span className="font-medium text-text-main dark:text-white">{item.department}</span>
                                    </p>
                                )}

                                {item.greeting && (
                                    <div className="text-xs text-text-secondary italic bg-slate-50 dark:bg-gray-700/30 p-2.5 rounded-lg border border-slate-100 dark:border-gray-700/60 mb-3 flex gap-1.5 items-start">
                                        <MessageSquare size={13} className="text-primary mt-0.5 shrink-0" />
                                        <span className="line-clamp-2">"{item.greeting}"</span>
                                    </div>
                                )}

                                <div className="space-y-1 text-xs text-text-secondary">
                                    {item.phone && (
                                        <div className="flex items-center gap-1.5">
                                            <Phone size={13} className="text-gray-400" />
                                            <span>{item.phone}</span>
                                        </div>
                                    )}
                                    {item.email && (
                                        <div className="flex items-center gap-1.5">
                                            <Mail size={13} className="text-gray-400" />
                                            <span className="truncate">{item.email}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-border-color dark:border-gray-700/60">
                                <button
                                    onClick={() => handleOpenEdit(item)}
                                    className="p-1.5 text-text-secondary hover:text-primary hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    title="Edit data"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => setDeletingItem(item)}
                                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                                    title="Hapus data"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Create / Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-border-color dark:border-gray-700 overflow-y-auto max-h-[90vh]">
                        <div className="flex items-center justify-between pb-4 mb-4 border-b border-border-color dark:border-gray-700">
                            <h3 className="text-lg font-bold text-text-main dark:text-white">
                                {editingItem ? 'Edit Anggota Struktur' : 'Tambah Anggota Struktur'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-text-main dark:text-white mb-1">
                                    Kategori Organisasi <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as StructureCategory }))}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:border-primary text-text-main dark:text-white"
                                >
                                    <option value="LEADERSHIP">Pimpinan Sekolah (Kepala Sekolah & Wakasek)</option>
                                    <option value="DEPARTMENT">Kelompok Mata Pelajaran (Kaprodi / MGMP)</option>
                                    <option value="COMMITTEE">Tim & Komite Sekolah</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-text-main dark:text-white mb-1">
                                    Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Contoh: Dr. H. Ahmad Suryana, M.Pd."
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:border-primary text-text-main dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-text-main dark:text-white mb-1">
                                    Jabatan <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.position}
                                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                                    placeholder="Contoh: Kepala Sekolah / Wakasek Kurikulum / Ketua Komite"
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:border-primary text-text-main dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-text-main dark:text-white mb-1">
                                        Bidang / Bagian
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.department}
                                        onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                                        placeholder="MIPA, IPS, Humas, dll"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:border-primary text-text-main dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-text-main dark:text-white mb-1">
                                        Urutan Tampilan
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={formData.order}
                                        onChange={(e) => setFormData(prev => ({ ...prev, order: Number(e.target.value) }))}
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:border-primary text-text-main dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-text-main dark:text-white mb-1">
                                        No. Telepon / WhatsApp
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                        placeholder="0812xxxx"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:border-primary text-text-main dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-text-main dark:text-white mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        placeholder="email@sekolah.sch.id"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:border-primary text-text-main dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-text-main dark:text-white mb-1">
                                    Foto Profil
                                </label>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-14 h-14 rounded-xl border border-border-color dark:border-gray-600 overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
                                        {formData.photo ? (
                                            <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLElement).style.display = 'none' }} />
                                        ) : (
                                            <User size={24} className="text-slate-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
                                            <Upload size={14} />
                                            <span>{uploadingPhoto ? 'Mengupload...' : 'Upload File Foto'}</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handlePhotoFileUpload}
                                                disabled={uploadingPhoto}
                                            />
                                        </label>
                                        <p className="text-[11px] text-text-secondary mt-1">Format: JPG, PNG, WebP (Maks. 2MB)</p>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    value={formData.photo}
                                    onChange={(e) => setFormData(prev => ({ ...prev, photo: e.target.value }))}
                                    placeholder="Atau masukkan URL foto (https://...)"
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-xs focus:outline-none focus:border-primary text-text-main dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-text-main dark:text-white mb-1 flex items-center justify-between">
                                    <span>Kata Sambutan (Khusus Kepala Sekolah)</span>
                                    <span className="text-[11px] text-primary font-normal">Ditampilkan di Landing Page</span>
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.greeting}
                                    onChange={(e) => setFormData(prev => ({ ...prev, greeting: e.target.value }))}
                                    placeholder="Kata sambutan kepala sekolah untuk pengunjung website resmi..."
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:border-primary text-text-main dark:text-white"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-border-color dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                >
                                    {submitting ? 'Menyimpan...' : 'Simpan Data'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={Boolean(deletingItem)}
                onClose={() => setDeletingItem(null)}
                onConfirm={handleConfirmDelete}
                title="Hapus Anggota Struktur"
                message={`Apakah Anda yakin ingin menghapus "${deletingItem?.name}" (${deletingItem?.position}) dari struktur organisasi?`}
                variant="danger"
            />
        </div>
    )
}
