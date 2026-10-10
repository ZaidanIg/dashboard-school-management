import { useState } from 'react'
import { Building, Monitor, BookOpen, Dumbbell, FlaskConical, Music, Leaf, Wifi, Plus, Edit2, Trash2, X, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import {
    useFacilities,
    type FacilityItem,
    type FacilityFormData,
    type FacilityCondition
} from '@/hooks/useProfile'

const defaultFacilities: FacilityFormData[] = [
    { name: 'Ruang Kelas Representatif', category: 'Ruang Kelas', quantity: 36, area: 72, condition: 'GOOD', description: 'Dilengkapi AC, LCD Proyektor, whiteboard, dan Smart TV' },
    { name: 'Laboratorium Komputer', category: 'Laboratorium', quantity: 3, area: 120, condition: 'GOOD', description: '120 unit PC Core i7, internet fiber 100 Mbps, switch gigabit' },
    { name: 'Laboratorium IPA Terpadu', category: 'Laboratorium', quantity: 4, area: 150, condition: 'GOOD', description: 'Lab Fisika, Kimia, Biologi lengkap dengan peralatan uji berstandar nasional' },
    { name: 'Perpustakaan & E-Library', category: 'Perpustakaan', quantity: 1, area: 200, condition: 'GOOD', description: 'Koleksi 15.000+ buku fisik, 50 tablet e-book, dan ruang baca ber-AC' },
    { name: 'Lapangan Olahraga Serbaguna', category: 'Olahraga', quantity: 3, area: 800, condition: 'GOOD', description: 'Lapangan basket, futsal outdoor, dan lapangan voli' },
    { name: 'Ruang Seni & Musik', category: 'Umum', quantity: 2, area: 90, condition: 'GOOD', description: 'Studio musik kedap suara dan ruang seni lukis/tari' },
    { name: 'Masjid Sekolah (Baitul Ilmi)', category: 'Ibadah', quantity: 1, area: 400, condition: 'GOOD', description: 'Kapasitas 1.000 jamaah untuk shalat berjamaah dan kajian keagamaan' },
    { name: 'Unit Kesehatan Sekolah (UKS)', category: 'Kesehatan', quantity: 2, area: 45, condition: 'GOOD', description: 'Fasilitas ranjang medis, tabung oksigen, dan tenaga medis jaga' },
    { name: 'Kantin Sehat & Higienis', category: 'Umum', quantity: 1, area: 180, condition: 'FAIR', description: '10 stan makanan bersertifikat higienis BPOM' },
    { name: 'Hotspot WiFi Seluruh Area', category: 'Teknologi', quantity: 12, condition: 'GOOD', description: 'Cakupan WiFi berkecepatan tinggi di seluruh sudut kampus sekolah' }
]

const getFacilityIcon = (category: string) => {
    const cat = category.toLowerCase()
    if (cat.includes('komputer') || cat.includes('teknologi')) return Monitor
    if (cat.includes('lab') || cat.includes('ipa')) return FlaskConical
    if (cat.includes('pustaka') || cat.includes('buku')) return BookOpen
    if (cat.includes('olahraga') || cat.includes('lapangan')) return Dumbbell
    if (cat.includes('musik') || cat.includes('seni')) return Music
    if (cat.includes('taman') || cat.includes('hijau')) return Leaf
    if (cat.includes('wifi') || cat.includes('hotspot')) return Wifi
    return Building
}

const conditionBadge = (condition: FacilityCondition) => {
    switch (condition) {
        case 'GOOD':
            return {
                label: 'Sangat Baik',
                icon: CheckCircle2,
                className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
            }
        case 'FAIR':
            return {
                label: 'Cukup',
                icon: AlertTriangle,
                className: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
            }
        case 'POOR':
            return {
                label: 'Perlu Perbaikan',
                icon: AlertCircle,
                className: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
            }
    }
}

export default function Facilities() {
    const { facilities, loading, createFacility, updateFacility, deleteFacility } = useFacilities()
    const [selectedCategory, setSelectedCategory] = useState<string>('Semua')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<FacilityItem | null>(null)
    const [deletingItem, setDeletingItem] = useState<FacilityItem | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [seeding, setSeeding] = useState(false)

    const [formData, setFormData] = useState<FacilityFormData>({
        name: '',
        category: 'Ruang Kelas',
        quantity: 1,
        area: 0,
        condition: 'GOOD',
        description: ''
    })

    const categories = ['Semua', ...Array.from(new Set(facilities.map(f => f.category)))]

    const handleOpenCreate = () => {
        setEditingItem(null)
        setFormData({
            name: '',
            category: selectedCategory === 'Semua' ? 'Ruang Kelas' : selectedCategory,
            quantity: 1,
            area: 0,
            condition: 'GOOD',
            description: ''
        })
        setIsModalOpen(true)
    }

    const handleOpenEdit = (item: FacilityItem) => {
        setEditingItem(item)
        setFormData({
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            area: item.area || 0,
            condition: item.condition,
            description: item.description || ''
        })
        setIsModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name) return

        setSubmitting(true)
        let ok = false
        if (editingItem) {
            ok = await updateFacility(editingItem.id, {
                ...formData,
                quantity: Number(formData.quantity),
                area: formData.area ? Number(formData.area) : null
            })
        } else {
            ok = await createFacility({
                ...formData,
                quantity: Number(formData.quantity),
                area: formData.area ? Number(formData.area) : null
            })
        }
        setSubmitting(false)

        if (ok) {
            setIsModalOpen(false)
            setEditingItem(null)
        }
    }

    const handleConfirmDelete = async () => {
        if (!deletingItem) return
        await deleteFacility(deletingItem.id)
        setDeletingItem(null)
    }

    const handleSeedDefaults = async () => {
        setSeeding(true)
        for (const item of defaultFacilities) {
            await createFacility(item)
        }
        setSeeding(false)
    }

    const filteredFacilities = facilities.filter(f => {
        if (selectedCategory === 'Semua') return true
        return f.category === selectedCategory
    })

    // Calculated Statistics
    const totalUnits = facilities.reduce((sum, f) => sum + (f.quantity || 1), 0)
    const goodConditionCount = facilities.filter(f => f.condition === 'GOOD').reduce((sum, f) => sum + (f.quantity || 1), 0)
    const fairConditionCount = facilities.filter(f => f.condition === 'FAIR').reduce((sum, f) => sum + (f.quantity || 1), 0)
    const poorConditionCount = facilities.filter(f => f.condition === 'POOR').reduce((sum, f) => sum + (f.quantity || 1), 0)

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
                title="Fasilitas Sekolah"
                subtitle="Kelola sarana dan prasarana sekolah yang ditampilkan di portal dan Landing Page"
                breadcrumb={[
                    { label: 'Profil Sekolah', path: '/profile' },
                    { label: 'Fasilitas' },
                ]}
                actions={
                    <div className="flex gap-2">
                        {facilities.length === 0 && (
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
                            Tambah Fasilitas
                        </button>
                    </div>
                }
            />

            {/* Summary Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-border-color dark:border-gray-700 shadow-sm text-center">
                    <p className="text-3xl font-bold text-primary">{totalUnits}</p>
                    <p className="text-xs text-text-secondary mt-1 font-medium">Total Unit Fasilitas</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-border-color dark:border-gray-700 shadow-sm text-center">
                    <p className="text-3xl font-bold text-emerald-600">{goodConditionCount}</p>
                    <p className="text-xs text-text-secondary mt-1 font-medium">Kondisi Sangat Baik</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-border-color dark:border-gray-700 shadow-sm text-center">
                    <p className="text-3xl font-bold text-amber-600">{fairConditionCount}</p>
                    <p className="text-xs text-text-secondary mt-1 font-medium">Kondisi Cukup / Terawat</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-border-color dark:border-gray-700 shadow-sm text-center">
                    <p className="text-3xl font-bold text-rose-600">{poorConditionCount}</p>
                    <p className="text-xs text-text-secondary mt-1 font-medium">Perlu Perbaikan</p>
                </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex border-b border-border-color dark:border-gray-700 gap-2 pb-1 overflow-x-auto">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                            selectedCategory === cat
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-text-secondary hover:text-text-main dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Facilities Cards */}
            {filteredFacilities.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-border-color dark:border-gray-700 p-12 text-center">
                    <Building className="mx-auto text-gray-400 mb-3" size={48} />
                    <h3 className="text-lg font-bold text-text-main dark:text-white">Belum Ada Data Fasilitas</h3>
                    <p className="text-sm text-text-secondary mt-1 max-w-md mx-auto">
                        Klik tombol Tambah Fasilitas atau klik Inisialisasi Data Standar untuk memuat fasilitas standar sekolah secara otomatis.
                    </p>
                    <div className="mt-6 flex justify-center gap-3">
                        <button
                            onClick={handleOpenCreate}
                            className="px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm"
                        >
                            Tambah Fasilitas
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredFacilities.map((facility) => {
                        const Icon = getFacilityIcon(facility.category)
                        const badge = conditionBadge(facility.condition)
                        const BadgeIcon = badge.icon

                        return (
                            <div
                                key={facility.id}
                                className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-5 hover:shadow-md transition-all flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
                                            <Icon size={24} />
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="px-2.5 py-1 bg-slate-100 dark:bg-gray-700 text-slate-800 dark:text-gray-200 rounded-md text-xs font-bold">
                                                {facility.quantity} Unit
                                            </span>
                                            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 ${badge.className}`}>
                                                <BadgeIcon size={12} />
                                                {badge.label}
                                            </span>
                                        </div>
                                    </div>

                                    <h4 className="font-bold text-text-main dark:text-white text-base leading-tight mb-1">
                                        {facility.name}
                                    </h4>

                                    <div className="flex items-center gap-2 text-xs text-text-secondary mb-3">
                                        <span className="bg-blue-50 dark:bg-blue-900/20 text-primary px-2 py-0.5 rounded font-medium">
                                            {facility.category}
                                        </span>
                                        {facility.area ? (
                                            <span>• Luas: {facility.area} m²</span>
                                        ) : null}
                                    </div>

                                    {facility.description && (
                                        <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                                            {facility.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-border-color dark:border-gray-700/60">
                                    <button
                                        onClick={() => handleOpenEdit(facility)}
                                        className="p-1.5 text-text-secondary hover:text-primary hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                        title="Edit fasilitas"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => setDeletingItem(facility)}
                                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                                        title="Hapus fasilitas"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Modal Create / Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-border-color dark:border-gray-700 overflow-y-auto max-h-[90vh]">
                        <div className="flex items-center justify-between pb-4 mb-4 border-b border-border-color dark:border-gray-700">
                            <h3 className="text-lg font-bold text-text-main dark:text-white">
                                {editingItem ? 'Edit Fasilitas Sekolah' : 'Tambah Fasilitas Sekolah'}
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
                                    Nama Fasilitas <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Contoh: Laboratorium Komputer Multimedia"
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:border-primary text-text-main dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-text-main dark:text-white mb-1">
                                        Kategori <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                        placeholder="Ruang Kelas, Laboratorium, dll"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:border-primary text-text-main dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-text-main dark:text-white mb-1">
                                        Jumlah Unit <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min={1}
                                        value={formData.quantity}
                                        onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:border-primary text-text-main dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-text-main dark:text-white mb-1">
                                        Kondisi <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        value={formData.condition}
                                        onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value as FacilityCondition }))}
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:border-primary text-text-main dark:text-white"
                                    >
                                        <option value="GOOD">Sangat Baik (Terawat)</option>
                                        <option value="FAIR">Cukup (Dapat Digunakan)</option>
                                        <option value="POOR">Rusak (Perlu Perbaikan)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-text-main dark:text-white mb-1">
                                        Perkiraan Luas (m²)
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={formData.area || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value ? Number(e.target.value) : null }))}
                                        placeholder="Contoh: 120"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:border-primary text-text-main dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-text-main dark:text-white mb-1">
                                    Deskripsi & Spesifikasi
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Jelaskan spesifikasi, fasilitas penunjang, atau peralatan yang tersedia..."
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
                title="Hapus Fasilitas"
                message={`Apakah Anda yakin ingin menghapus fasilitas "${deletingItem?.name}"?`}
                variant="danger"
            />
        </div>
    )
}
