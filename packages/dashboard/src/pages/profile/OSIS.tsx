import { useState } from 'react'
import {
    Users,
    Star,
    Target,
    Award,
    Plus,
    Edit2,
    Trash2,
    X,
    Sparkles,
    CheckCircle2,
    BookOpen
} from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import {
    useOrganizations,
    type OrgMemberItem,
    type StudentOrganizationData,
    type OrgProgram
} from '@/hooks/useProfile'

export default function OSIS() {
    const {
        organizations,
        loading,
        upsertOrg,
        seedOrganization,
        addMember,
        updateMember,
        deleteMember
    } = useOrganizations('OSIS')

    const osis = organizations[0] as StudentOrganizationData | undefined

    // Modals
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false)
    const [editingMember, setEditingMember] = useState<OrgMemberItem | null>(null)
    const [deletingMember, setDeletingMember] = useState<OrgMemberItem | null>(null)
    const [submitting, setSubmitting] = useState(false)

    // Organization Form
    const [orgFormData, setOrgFormData] = useState({
        name: '',
        period: '',
        vision: '',
        mission: '',
        newProgram: ''
    })

    // Member Form
    const [memberFormData, setMemberFormData] = useState({
        name: '',
        position: '',
        className: '',
        section: '',
        order: 1
    })

    const handleSeedOsis = async () => {
        setSubmitting(true)
        await seedOrganization('OSIS')
        setSubmitting(false)
    }

    const handleOpenEditProfile = () => {
        if (!osis) return
        setOrgFormData({
            name: osis.name || 'OSIS SMA Negeri 1',
            period: osis.period || '2024/2025',
            vision: osis.vision || '',
            mission: Array.isArray(osis.mission) ? osis.mission.join('\n') : '',
            newProgram: ''
        })
        setIsProfileModalOpen(true)
    }

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        const currentPrograms = Array.isArray(osis?.programs) ? osis.programs : []
        const missionsArray = orgFormData.mission
            .split('\n')
            .map(s => s.trim())
            .filter(Boolean)

        const ok = await upsertOrg({
            id: osis?.id,
            type: 'OSIS',
            name: orgFormData.name,
            period: orgFormData.period,
            vision: orgFormData.vision,
            mission: missionsArray,
            programs: currentPrograms
        })
        setSubmitting(false)
        if (ok) {
            setIsProfileModalOpen(false)
        }
    }

    const handleAddProgram = async () => {
        if (!orgFormData.newProgram.trim() || !osis) return
        const current: OrgProgram[] = Array.isArray(osis.programs) ? [...osis.programs] : []
        current.push({
            id: String(Date.now()),
            name: orgFormData.newProgram.trim(),
            status: 'upcoming'
        })
        setSubmitting(true)
        await upsertOrg({
            id: osis.id,
            name: osis.name,
            type: 'OSIS',
            period: osis.period,
            mission: osis.mission,
            programs: current
        })
        setOrgFormData({ ...orgFormData, newProgram: '' })
        setSubmitting(false)
    }

    const handleRemoveProgram = async (indexToRemove: number) => {
        if (!osis) return
        const current: OrgProgram[] = Array.isArray(osis.programs) ? [...osis.programs] : []
        current.splice(indexToRemove, 1)
        await upsertOrg({
            id: osis.id,
            name: osis.name,
            type: 'OSIS',
            period: osis.period,
            mission: osis.mission,
            programs: current
        })
    }

    const handleOpenAddMember = () => {
        setEditingMember(null)
        setMemberFormData({
            name: '',
            position: '',
            className: '',
            section: 'BPH',
            order: (osis?.members?.length || 0) + 1
        })
        setIsMemberModalOpen(true)
    }

    const handleOpenEditMember = (member: OrgMemberItem) => {
        setEditingMember(member)
        setMemberFormData({
            name: member.name || member.student?.name || '',
            position: member.position || '',
            className: member.className || '',
            section: member.section || 'BPH',
            order: member.order || 1
        })
        setIsMemberModalOpen(true)
    }

    const handleSaveMember = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!osis || !memberFormData.name || !memberFormData.position) return

        setSubmitting(true)
        let ok = false
        if (editingMember) {
            ok = await updateMember(editingMember.id, memberFormData)
        } else {
            ok = await addMember({
                organizationId: osis.id,
                ...memberFormData
            })
        }
        setSubmitting(false)
        if (ok) {
            setIsMemberModalOpen(false)
            setEditingMember(null)
        }
    }

    const handleDeleteMember = async () => {
        if (!deletingMember) return
        await deleteMember(deletingMember.id)
        setDeletingMember(null)
    }

    if (loading) {
        return (
            <div className="py-24 flex justify-center">
                <LoadingSpinner />
            </div>
        )
    }

    if (!osis) {
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
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center max-w-2xl mx-auto">
                    <Users className="mx-auto text-primary mb-4" size={56} />
                    <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">
                        Data OSIS Belum Diinisialisasi
                    </h3>
                    <p className="text-text-secondary text-sm mb-6">
                        Belum ada struktur OSIS yang tersimpan di sistem. Anda dapat langsung menginisialisasi dengan data default atau membuat struktur kepengurusan baru.
                    </p>
                    <button
                        onClick={handleSeedOsis}
                        disabled={submitting}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-blue-700 text-white rounded-xl font-medium shadow-md transition-all"
                    >
                        {submitting ? <LoadingSpinner size="sm" /> : <Sparkles size={18} />}
                        Inisialisasi Data Default OSIS
                    </button>
                </div>
            </div>
        )
    }

    const members: OrgMemberItem[] = osis.members || []
    const programsList: OrgProgram[] = Array.isArray(osis.programs) ? osis.programs : []
    const uniqueSections = Array.from(new Set(members.map(m => m.section).filter(Boolean))) as string[]

    return (
        <div className="space-y-6">
            <PageHeader
                title="OSIS"
                subtitle="Organisasi Siswa Intra Sekolah"
                breadcrumb={[
                    { label: 'Profil Sekolah', path: '/profile' },
                    { label: 'OSIS' },
                ]}
                actions={
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleOpenEditProfile}
                            className="flex items-center gap-2 px-4 py-2 border border-border-color dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-800 text-text-main dark:text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            <Edit2 size={16} />
                            Edit Profil OSIS
                        </button>
                        <button
                            onClick={handleOpenAddMember}
                            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                        >
                            <Plus size={16} />
                            Tambah Pengurus
                        </button>
                    </div>
                }
            />

            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-primary rounded-2xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
                        <Users size={40} className="text-white" />
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                            <h2 className="text-2xl md:text-3xl font-extrabold">{osis.name}</h2>
                            <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-white/20 border border-white/30 backdrop-blur-sm">
                                Periode {osis.period || '2024/2025'}
                            </span>
                        </div>
                        <p className="text-blue-100 text-sm max-w-2xl mt-1 leading-relaxed">
                            Organisasi resmi penggerak kepemimpinan, karakter, dan kreativitas siswa di lingkungan sekolah.
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                            <div className="px-3.5 py-1.5 bg-white/15 backdrop-blur-md rounded-lg text-xs font-medium border border-white/20">
                                👥 <strong className="font-bold">{members.length}</strong> Pengurus Terdaftar
                            </div>
                            <div className="px-3.5 py-1.5 bg-white/15 backdrop-blur-md rounded-lg text-xs font-medium border border-white/20">
                                🎯 <strong className="font-bold">{uniqueSections.length}</strong> Seksi / Bidang
                            </div>
                            <div className="px-3.5 py-1.5 bg-white/15 backdrop-blur-md rounded-lg text-xs font-medium border border-white/20">
                                📋 <strong className="font-bold">{programsList.length}</strong> Program Kerja
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visi & Misi */}
            {(osis.vision || (Array.isArray(osis.mission) && osis.mission.length > 0)) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {osis.vision && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6 shadow-sm">
                            <h3 className="flex items-center gap-2 font-bold text-text-main dark:text-white mb-2">
                                <Target size={18} className="text-primary" /> Visi OSIS
                            </h3>
                            <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                                {osis.vision}
                            </p>
                        </div>
                    )}
                    {Array.isArray(osis.mission) && osis.mission.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6 shadow-sm">
                            <h3 className="flex items-center gap-2 font-bold text-text-main dark:text-white mb-2">
                                <BookOpen size={18} className="text-primary" /> Misi OSIS
                            </h3>
                            <ul className="text-sm text-text-secondary space-y-1 list-disc list-inside">
                                {osis.mission.map((m, idx) => (
                                    <li key={idx}>{m}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Pengurus Inti & Anggota */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="flex items-center gap-2 font-bold text-lg text-text-main dark:text-white">
                            <Star size={20} className="text-amber-500" /> Susunan Pengurus OSIS
                        </h3>
                        <p className="text-xs text-text-secondary mt-0.5">Daftar jajaran kepengurusan OSIS periode aktif</p>
                    </div>
                    <button
                        onClick={handleOpenAddMember}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg transition-colors"
                    >
                        <Plus size={14} /> Tambah
                    </button>
                </div>

                {members.length === 0 ? (
                    <div className="text-center py-10 text-text-secondary text-sm">
                        Belum ada pengurus terdaftar. Klik tombol "Tambah Pengurus" untuk menambahkan.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {members.map((member: OrgMemberItem) => (
                            <div
                                key={member.id}
                                className="bg-slate-50 dark:bg-gray-700/40 rounded-xl p-4 text-center border border-border-color dark:border-gray-700 relative group hover:shadow-md transition-all"
                            >
                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 shadow-sm">
                                    {(member.name || member.student?.name || 'OS')
                                        .split(' ')
                                        .map((n: string) => n[0])
                                        .join('')
                                        .slice(0, 2)
                                        .toUpperCase()}
                                </div>
                                <p className="font-semibold text-text-main dark:text-white text-sm line-clamp-1">
                                    {member.name || member.student?.name}
                                </p>
                                <p className="text-xs text-primary font-bold mt-0.5">
                                    {member.position}
                                </p>
                                <div className="flex items-center justify-center gap-2 text-xs text-text-secondary mt-1">
                                    {member.className && <span>{member.className}</span>}
                                    {member.section && (
                                        <span className="px-1.5 py-0.5 bg-slate-200 dark:bg-gray-600 rounded text-[10px]">
                                            {member.section}
                                        </span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleOpenEditMember(member)}
                                        className="p-1 rounded bg-white dark:bg-gray-800 text-slate-600 hover:text-primary shadow-sm"
                                        title="Edit"
                                    >
                                        <Edit2 size={12} />
                                    </button>
                                    <button
                                        onClick={() => setDeletingMember(member)}
                                        className="p-1 rounded bg-white dark:bg-gray-800 text-red-500 hover:bg-red-50 shadow-sm"
                                        title="Hapus"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Program Kerja & Seksi */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Seksi-Seksi */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6 shadow-sm">
                    <h3 className="flex items-center gap-2 font-bold text-text-main dark:text-white mb-4">
                        <Target size={20} className="text-primary" /> Seksi & Bidang Kepengurusan
                    </h3>
                    <div className="space-y-3">
                        {uniqueSections.length === 0 ? (
                            <p className="text-xs text-text-secondary">Belum ada seksi yang dikonfigurasi.</p>
                        ) : (
                            uniqueSections.map((secName: string, idx: number) => {
                                const count = members.filter((m: OrgMemberItem) => m.section === secName).length
                                return (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-gray-700/50 rounded-xl border border-border-color dark:border-gray-700/80"
                                    >
                                        <div>
                                            <p className="font-semibold text-text-main dark:text-white text-sm">{secName}</p>
                                            <p className="text-xs text-text-secondary">Bidang Koordinasi OSIS</p>
                                        </div>
                                        <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold">
                                            {count} Anggota
                                        </span>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Program Kerja */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="flex items-center gap-2 font-bold text-text-main dark:text-white">
                            <Award size={20} className="text-primary" /> Program Kerja Utama
                        </h3>
                    </div>

                    <div className="space-y-2.5 mb-4 max-h-72 overflow-y-auto pr-1">
                        {programsList.length === 0 ? (
                            <p className="text-xs text-text-secondary">Belum ada program kerja yang ditambahkan.</p>
                        ) : (
                            programsList.map((prog: OrgProgram, index: number) => (
                                <div
                                    key={prog.id || index}
                                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-700/50 rounded-xl border border-border-color dark:border-gray-700/80 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                                        <span className="text-sm font-medium text-text-main dark:text-white">
                                            {prog.name}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveProgram(index)}
                                        className="text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Hapus Program"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Quick Add Program */}
                    <div className="flex gap-2 pt-2 border-t border-border-color dark:border-gray-700">
                        <input
                            type="text"
                            value={orgFormData.newProgram}
                            onChange={(e) => setOrgFormData({ ...orgFormData, newProgram: e.target.value })}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    handleAddProgram()
                                }
                            }}
                            placeholder="Tambah program kerja baru..."
                            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <button
                            type="button"
                            onClick={handleAddProgram}
                            disabled={!orgFormData.newProgram.trim()}
                            className="px-3.5 py-2 bg-primary hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Tambah
                        </button>
                    </div>
                </div>
            </div>

            {/* Profile Edit Modal */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-border-color dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-bold text-text-main dark:text-white">Edit Profil & Visi OSIS</h3>
                            <button
                                onClick={() => setIsProfileModalOpen(false)}
                                className="text-text-secondary hover:text-text-main p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveProfile} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">
                                        Nama Organisasi *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={orgFormData.name}
                                        onChange={(e) => setOrgFormData({ ...orgFormData, name: e.target.value })}
                                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">
                                        Periode *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={orgFormData.period}
                                        onChange={(e) => setOrgFormData({ ...orgFormData, period: e.target.value })}
                                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="2024/2025"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">
                                    Visi
                                </label>
                                <textarea
                                    rows={2}
                                    value={orgFormData.vision}
                                    onChange={(e) => setOrgFormData({ ...orgFormData, vision: e.target.value })}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                    placeholder="Visi kepengurusan..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">
                                    Misi (Satu baris per misi)
                                </label>
                                <textarea
                                    rows={3}
                                    value={orgFormData.mission}
                                    onChange={(e) => setOrgFormData({ ...orgFormData, mission: e.target.value })}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                    placeholder="Contoh: Mengembangkan karakter siswa (tekan enter untuk baris berikutnya)"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-border-color dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setIsProfileModalOpen(false)}
                                    className="px-4 py-2 border border-border-color dark:border-gray-600 text-text-secondary hover:text-text-main rounded-lg text-sm font-medium"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                                >
                                    {submitting && <LoadingSpinner size="sm" />}
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Member Create/Edit Modal */}
            {isMemberModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-xl border border-border-color dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-bold text-text-main dark:text-white">
                                {editingMember ? 'Edit Pengurus OSIS' : 'Tambah Pengurus OSIS'}
                            </h3>
                            <button
                                onClick={() => setIsMemberModalOpen(false)}
                                className="text-text-secondary hover:text-text-main p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveMember} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">
                                    Nama Lengkap *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={memberFormData.name}
                                    onChange={(e) => setMemberFormData({ ...memberFormData, name: e.target.value })}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Contoh: Muhammad Farhan"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">
                                        Jabatan *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={memberFormData.position}
                                        onChange={(e) => setMemberFormData({ ...memberFormData, position: e.target.value })}
                                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="Ketua / Sekretaris"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">
                                        Kelas
                                    </label>
                                    <input
                                        type="text"
                                        value={memberFormData.className}
                                        onChange={(e) => setMemberFormData({ ...memberFormData, className: e.target.value })}
                                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="12 IPA 1"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">
                                        Seksi / Bidang
                                    </label>
                                    <input
                                        type="text"
                                        value={memberFormData.section}
                                        onChange={(e) => setMemberFormData({ ...memberFormData, section: e.target.value })}
                                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="BPH / Seksi Kesenian"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">
                                        Urutan Tampilan
                                    </label>
                                    <input
                                        type="number"
                                        value={memberFormData.order}
                                        onChange={(e) => setMemberFormData({ ...memberFormData, order: Number(e.target.value) })}
                                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-border-color dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setIsMemberModalOpen(false)}
                                    className="px-4 py-2 border border-border-color dark:border-gray-600 text-text-secondary hover:text-text-main rounded-lg text-sm font-medium"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                                >
                                    {submitting && <LoadingSpinner size="sm" />}
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            <ConfirmationModal
                isOpen={Boolean(deletingMember)}
                title="Hapus Pengurus OSIS"
                message={`Apakah Anda yakin ingin menghapus "${deletingMember?.name || deletingMember?.student?.name}" dari kepengurusan OSIS?`}
                confirmLabel="Hapus"
                cancelLabel="Batal"
                variant="danger"
                onConfirm={handleDeleteMember}
                onClose={() => setDeletingMember(null)}
            />
        </div>
    )
}
