import { useState } from 'react'
import {
    Scale,
    Users,
    FileText,
    Target,
    Plus,
    Edit2,
    Trash2,
    X,
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

export default function MPK() {
    const {
        organizations,
        loading,
        upsertOrg,
        seedOrganization,
        addMember,
        updateMember,
        deleteMember
    } = useOrganizations('MPK')

    const mpk = organizations[0] as StudentOrganizationData | undefined

    // Modals
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false)
    const [editingMember, setEditingMember] = useState<OrgMemberItem | null>(null)
    const [deletingMember, setDeletingMember] = useState<OrgMemberItem | null>(null)
    const [submitting, setSubmitting] = useState(false)

    // Form states
    const [orgFormData, setOrgFormData] = useState({
        name: '',
        period: '',
        vision: '',
        mission: '',
        newProgram: ''
    })

    const [memberFormData, setMemberFormData] = useState({
        name: '',
        position: '',
        className: '',
        section: '',
        order: 1
    })

    const handleSeedMpk = async () => {
        setSubmitting(true)
        await seedOrganization('MPK')
        setSubmitting(false)
    }

    const handleOpenEditProfile = () => {
        if (!mpk) return
        setOrgFormData({
            name: mpk.name || 'MPK SMA Negeri 1',
            period: mpk.period || '2024/2025',
            vision: mpk.vision || '',
            mission: Array.isArray(mpk.mission) ? mpk.mission.join('\n') : '',
            newProgram: ''
        })
        setIsProfileModalOpen(true)
    }

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        const currentPrograms = Array.isArray(mpk?.programs) ? mpk.programs : []
        const missionsArray = orgFormData.mission
            .split('\n')
            .map(s => s.trim())
            .filter(Boolean)

        const ok = await upsertOrg({
            id: mpk?.id,
            type: 'MPK',
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
        if (!orgFormData.newProgram.trim() || !mpk) return
        const current: OrgProgram[] = Array.isArray(mpk.programs) ? [...mpk.programs] : []
        current.push({
            id: String(Date.now()),
            name: orgFormData.newProgram.trim(),
            status: 'upcoming'
        })
        setSubmitting(true)
        await upsertOrg({
            id: mpk.id,
            name: mpk.name,
            type: 'MPK',
            period: mpk.period,
            mission: mpk.mission,
            programs: current
        })
        setOrgFormData({ ...orgFormData, newProgram: '' })
        setSubmitting(false)
    }

    const handleRemoveProgram = async (indexToRemove: number) => {
        if (!mpk) return
        const current: OrgProgram[] = Array.isArray(mpk.programs) ? [...mpk.programs] : []
        current.splice(indexToRemove, 1)
        await upsertOrg({
            id: mpk.id,
            name: mpk.name,
            type: 'MPK',
            period: mpk.period,
            mission: mpk.mission,
            programs: current
        })
    }

    const handleOpenAddMember = () => {
        setEditingMember(null)
        setMemberFormData({
            name: '',
            position: '',
            className: '',
            section: 'Pimpinan Inti',
            order: (mpk?.members?.length || 0) + 1
        })
        setIsMemberModalOpen(true)
    }

    const handleOpenEditMember = (member: OrgMemberItem) => {
        setEditingMember(member)
        setMemberFormData({
            name: member.name || member.student?.name || '',
            position: member.position || '',
            className: member.className || '',
            section: member.section || 'Pimpinan Inti',
            order: member.order || 1
        })
        setIsMemberModalOpen(true)
    }

    const handleSaveMember = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!mpk || !memberFormData.name || !memberFormData.position) return

        setSubmitting(true)
        let ok = false
        if (editingMember) {
            ok = await updateMember(editingMember.id, memberFormData)
        } else {
            ok = await addMember({
                organizationId: mpk.id,
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

    if (!mpk) {
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
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center max-w-2xl mx-auto">
                    <Scale className="mx-auto text-purple-600 mb-4" size={56} />
                    <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">
                        Data MPK Belum Diinisialisasi
                    </h3>
                    <p className="text-text-secondary text-sm mb-6">
                        Belum ada struktur MPK yang tersimpan di sistem. Anda dapat langsung menginisialisasi dengan struktur default atau membuat data baru.
                    </p>
                    <button
                        onClick={handleSeedMpk}
                        disabled={submitting}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium shadow-md transition-all"
                    >
                        {submitting && <LoadingSpinner size="sm" />}
                        Inisialisasi Data Default MPK
                    </button>
                </div>
            </div>
        )
    }

    const members: OrgMemberItem[] = mpk.members || []
    const programsList: OrgProgram[] = Array.isArray(mpk.programs) ? mpk.programs : []
    const uniqueCommissions = Array.from(new Set(members.map(m => m.section).filter(Boolean))) as string[]

    return (
        <div className="space-y-6">
            <PageHeader
                title="MPK"
                subtitle="Majelis Perwakilan Kelas"
                breadcrumb={[
                    { label: 'Profil Sekolah', path: '/profile' },
                    { label: 'MPK' },
                ]}
                actions={
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleOpenEditProfile}
                            className="flex items-center gap-2 px-4 py-2 border border-border-color dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-800 text-text-main dark:text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            <Edit2 size={16} />
                            Edit Profil MPK
                        </button>
                        <button
                            onClick={handleOpenAddMember}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                        >
                            <Plus size={16} />
                            Tambah Anggota
                        </button>
                    </div>
                }
            />

            {/* Header Banner */}
            <div className="bg-gradient-to-r from-purple-700 via-violet-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
                        <Scale size={42} className="text-white" />
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                            <h2 className="text-2xl md:text-3xl font-extrabold">{mpk.name}</h2>
                            <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-white/20 border border-white/30 backdrop-blur-sm">
                                Periode {mpk.period || '2024/2025'}
                            </span>
                        </div>
                        <p className="text-purple-100 text-sm max-w-2xl mt-1 leading-relaxed">
                            Lembaga legislatif perwakilan siswa berwenang mengawasi OSIS, menampung aspirasi, dan merumuskan kebijakan siswa.
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                            <div className="px-3.5 py-1.5 bg-white/15 backdrop-blur-md rounded-lg text-xs font-medium border border-white/20">
                                ⚖️ <strong className="font-bold">{members.length}</strong> Anggota Legislatif
                            </div>
                            <div className="px-3.5 py-1.5 bg-white/15 backdrop-blur-md rounded-lg text-xs font-medium border border-white/20">
                                🏛️ <strong className="font-bold">{uniqueCommissions.length}</strong> Komisi & Pimpinan
                            </div>
                            <div className="px-3.5 py-1.5 bg-white/15 backdrop-blur-md rounded-lg text-xs font-medium border border-white/20">
                                📜 <strong className="font-bold">{programsList.length}</strong> Agenda & Kebijakan
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visi & Misi */}
            {(mpk.vision || (Array.isArray(mpk.mission) && mpk.mission.length > 0)) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mpk.vision && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6 shadow-sm">
                            <h3 className="flex items-center gap-2 font-bold text-text-main dark:text-white mb-2">
                                <Target size={18} className="text-purple-600" /> Visi MPK
                            </h3>
                            <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                                {mpk.vision}
                            </p>
                        </div>
                    )}
                    {Array.isArray(mpk.mission) && mpk.mission.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6 shadow-sm">
                            <h3 className="flex items-center gap-2 font-bold text-text-main dark:text-white mb-2">
                                <BookOpen size={18} className="text-purple-600" /> Misi MPK
                            </h3>
                            <ul className="text-sm text-text-secondary space-y-1 list-disc list-inside">
                                {mpk.mission.map((m, idx) => (
                                    <li key={idx}>{m}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Pimpinan & Anggota MPK */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="flex items-center gap-2 font-bold text-lg text-text-main dark:text-white">
                            <Users size={20} className="text-purple-600" /> Pimpinan & Anggota MPK
                        </h3>
                        <p className="text-xs text-text-secondary mt-0.5">Daftar perwakilan kelas dan fungsionaris MPK aktif</p>
                    </div>
                    <button
                        onClick={handleOpenAddMember}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-600 hover:text-white transition-colors"
                    >
                        <Plus size={14} /> Tambah
                    </button>
                </div>

                {members.length === 0 ? (
                    <div className="text-center py-10 text-text-secondary text-sm">
                        Belum ada anggota terdaftar. Klik "Tambah Anggota" untuk menambahkan.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {members.map((member: OrgMemberItem) => (
                            <div
                                key={member.id}
                                className="bg-slate-50 dark:bg-gray-700/40 rounded-xl p-4 text-center border border-border-color dark:border-gray-700 relative group hover:shadow-md transition-all"
                            >
                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 shadow-sm">
                                    {(member.name || member.student?.name || 'MP')
                                        .split(' ')
                                        .map((n: string) => n[0])
                                        .join('')
                                        .slice(0, 2)
                                        .toUpperCase()}
                                </div>
                                <p className="font-semibold text-text-main dark:text-white text-sm line-clamp-1">
                                    {member.name || member.student?.name}
                                </p>
                                <p className="text-xs text-purple-600 dark:text-purple-400 font-bold mt-0.5">
                                    {member.position}
                                </p>
                                <div className="flex items-center justify-center gap-2 text-xs text-text-secondary mt-1">
                                    {member.className && <span>{member.className}</span>}
                                    {member.section && (
                                        <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded text-[10px]">
                                            {member.section}
                                        </span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleOpenEditMember(member)}
                                        className="p-1 rounded bg-white dark:bg-gray-800 text-slate-600 hover:text-purple-600 shadow-sm"
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

            {/* Komisi & Agenda Kegiatan */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Komisi-Komisi */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6 shadow-sm">
                    <h3 className="flex items-center gap-2 font-bold text-text-main dark:text-white mb-4">
                        <Scale size={20} className="text-purple-600" /> Komisi Kerja MPK
                    </h3>
                    <div className="space-y-3">
                        {uniqueCommissions.length === 0 ? (
                            <p className="text-xs text-text-secondary">Belum ada komisi kerja yang dikonfigurasi.</p>
                        ) : (
                            uniqueCommissions.map((comName: string, idx: number) => {
                                const count = members.filter((m: OrgMemberItem) => m.section === comName).length
                                return (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-gray-700/50 rounded-xl border border-border-color dark:border-gray-700/80"
                                    >
                                        <div>
                                            <p className="font-semibold text-text-main dark:text-white text-sm">{comName}</p>
                                            <p className="text-xs text-text-secondary">Bidang Legislasi & Pengawasan</p>
                                        </div>
                                        <span className="px-2.5 py-1 bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-bold">
                                            {count} Anggota
                                        </span>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Agenda & Produk Hukum */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6 shadow-sm">
                    <h3 className="flex items-center gap-2 font-bold text-text-main dark:text-white mb-4">
                        <FileText size={20} className="text-purple-600" /> Agenda Kerja & Ketetapan
                    </h3>

                    <div className="space-y-2.5 mb-4 max-h-72 overflow-y-auto pr-1">
                        {programsList.length === 0 ? (
                            <p className="text-xs text-text-secondary">Belum ada agenda atau produk ketetapan.</p>
                        ) : (
                            programsList.map((prog: OrgProgram, index: number) => (
                                <div
                                    key={prog.id || index}
                                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-700/50 rounded-xl border border-border-color dark:border-gray-700/80 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 size={16} className="text-purple-500 flex-shrink-0" />
                                        <span className="text-sm font-medium text-text-main dark:text-white">
                                            {prog.name}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveProgram(index)}
                                        className="text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Hapus Agenda"
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
                            placeholder="Tambah agenda / produk regulasi baru..."
                            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white outline-none focus:ring-2 focus:ring-purple-500/20"
                        />
                        <button
                            type="button"
                            onClick={handleAddProgram}
                            disabled={!orgFormData.newProgram.trim()}
                            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
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
                            <h3 className="text-lg font-bold text-text-main dark:text-white">Edit Profil & Visi MPK</h3>
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
                                        Nama Lembaga *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={orgFormData.name}
                                        onChange={(e) => setOrgFormData({ ...orgFormData, name: e.target.value })}
                                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white outline-none focus:ring-2 focus:ring-purple-500/20"
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
                                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white outline-none focus:ring-2 focus:ring-purple-500/20"
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
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
                                    placeholder="Visi MPK..."
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
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
                                    placeholder="Daftar misi perwakilan siswa..."
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
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                                >
                                    {submitting && <LoadingSpinner size="sm" />}
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Member Modal */}
            {isMemberModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-xl border border-border-color dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-bold text-text-main dark:text-white">
                                {editingMember ? 'Edit Anggota MPK' : 'Tambah Anggota MPK'}
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
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white outline-none focus:ring-2 focus:ring-purple-500/20"
                                    placeholder="Contoh: Raffi Ahmad"
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
                                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white outline-none focus:ring-2 focus:ring-purple-500/20"
                                        placeholder="Ketua MPK / Ketua Komisi"
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
                                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white outline-none focus:ring-2 focus:ring-purple-500/20"
                                        placeholder="12 IPA 1"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">
                                        Komisi / Bidang
                                    </label>
                                    <input
                                        type="text"
                                        value={memberFormData.section}
                                        onChange={(e) => setMemberFormData({ ...memberFormData, section: e.target.value })}
                                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white outline-none focus:ring-2 focus:ring-purple-500/20"
                                        placeholder="Komisi A / Pimpinan"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">
                                        Urutan
                                    </label>
                                    <input
                                        type="number"
                                        value={memberFormData.order}
                                        onChange={(e) => setMemberFormData({ ...memberFormData, order: Number(e.target.value) })}
                                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-text-main dark:text-white outline-none focus:ring-2 focus:ring-purple-500/20"
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
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2"
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
                title="Hapus Anggota MPK"
                message={`Apakah Anda yakin ingin menghapus "${deletingMember?.name || deletingMember?.student?.name}" dari MPK?`}
                confirmLabel="Hapus"
                cancelLabel="Batal"
                variant="danger"
                onConfirm={handleDeleteMember}
                onClose={() => setDeletingMember(null)}
            />
        </div>
    )
}
