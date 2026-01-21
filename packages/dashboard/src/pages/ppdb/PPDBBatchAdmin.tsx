import { useState, useEffect } from 'react'
import { CalendarDays, Plus, Edit, Trash2, X } from 'lucide-react'

interface PPDBBatch {
    id: string
    name: string
    academicYear: { id: string; name: string }
    startDate: string
    endDate: string
    isActive: boolean
    description?: string
    _count: { registrations: number }
}

interface AcademicYear {
    id: string
    name: string
}

export default function PPDBBatchAdmin() {
    const [batches, setBatches] = useState<PPDBBatch[]>([])
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingBatch, setEditingBatch] = useState<PPDBBatch | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        academicYearId: '',
        startDate: '',
        endDate: '',
        isActive: false,
        description: ''
    })

    useEffect(() => {
        fetchBatches()
        fetchAcademicYears()
    }, [])

    const fetchBatches = async () => {
        try {
            const res = await fetch('http://localhost:3001/ppdb/batches')
            const data = await res.json()
            setBatches(data)
        } catch (error) {
            console.error('Failed to fetch batches', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchAcademicYears = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/academic/years')
            const data = await res.json()
            setAcademicYears(data)
        } catch (error) {
            console.error('Failed to fetch academic years', error)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    const formatDateForInput = (dateString: string) => {
        return new Date(dateString).toISOString().split('T')[0]
    }

    const openCreateModal = () => {
        setEditingBatch(null)
        setFormData({
            name: '',
            academicYearId: academicYears[0]?.id || '',
            startDate: '',
            endDate: '',
            isActive: false,
            description: ''
        })
        setShowModal(true)
    }

    const openEditModal = (batch: PPDBBatch) => {
        setEditingBatch(batch)
        // Use academicYear.id if exists, otherwise try academicYearId directly from batch
        const yearId = batch.academicYear?.id || (batch as any).academicYearId || ''
        setFormData({
            name: batch.name,
            academicYearId: yearId,
            startDate: formatDateForInput(batch.startDate),
            endDate: formatDateForInput(batch.endDate),
            isActive: batch.isActive,
            description: batch.description || ''
        })
        setShowModal(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const payload = {
                ...formData,
                id: editingBatch?.id
            }
            const res = await fetch('http://localhost:3001/ppdb/batches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            if (res.ok) {
                setShowModal(false)
                fetchBatches()
            } else {
                alert('Gagal menyimpan data')
            }
        } catch (error) {
            console.error('Failed to save batch', error)
            alert('Terjadi kesalahan')
        }
    }

    const deleteBatch = async (id: string) => {
        if (!confirm('Yakin ingin menghapus batch ini?')) return
        try {
            await fetch(`http://localhost:3001/ppdb/batches/${id}`, { method: 'DELETE' })
            fetchBatches()
        } catch (error) {
            console.error('Failed to delete batch', error)
        }
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Jadwal PPDB</h1>
                    <p className="text-slate-500 dark:text-slate-400">Kelola jadwal pendaftaran peserta didik baru</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                    <Plus size={20} /> Tambah Batch
                </button>
            </div>

            {/* Batch List */}
            {loading ? (
                <div className="text-center py-12 text-slate-500">Memuat data...</div>
            ) : batches.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <CalendarDays size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500">Belum ada jadwal PPDB. Klik "Tambah Batch" untuk membuat.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {batches.map((batch) => (
                        <div
                            key={batch.id}
                            className={`bg-white dark:bg-slate-800 rounded-2xl border p-6 transition-shadow hover:shadow-lg ${batch.isActive ? 'border-green-500 ring-2 ring-green-500/20' : 'border-slate-200 dark:border-slate-700'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{batch.name}</h3>
                                    <p className="text-sm text-slate-500">{batch.academicYear.name}</p>
                                </div>
                                {batch.isActive ? (
                                    <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Aktif</span>
                                ) : (
                                    <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full">Nonaktif</span>
                                )}
                            </div>

                            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
                                <p><strong>Mulai:</strong> {formatDate(batch.startDate)}</p>
                                <p><strong>Selesai:</strong> {formatDate(batch.endDate)}</p>
                                <p className="text-primary font-semibold">{batch._count.registrations} Pendaftar</p>
                            </div>

                            <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                                <button
                                    onClick={() => openEditModal(batch)}
                                    className="flex-1 flex items-center justify-center gap-1 py-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors"
                                >
                                    <Edit size={16} /> Edit
                                </button>
                                <button
                                    onClick={() => deleteBatch(batch.id)}
                                    className="flex-1 flex items-center justify-center gap-1 py-2 text-sm font-medium text-slate-600 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={16} /> Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-xl">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                {editingBatch ? 'Edit Batch' : 'Tambah Batch Baru'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Nama Batch</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    placeholder="contoh: Gelombang 1"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Tahun Ajaran</label>
                                <select
                                    value={formData.academicYearId}
                                    onChange={(e) => setFormData({ ...formData, academicYearId: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    required
                                >
                                    <option value="">Pilih Tahun Ajaran</option>
                                    {academicYears.map((ay) => (
                                        <option key={ay.id} value={ay.id}>{ay.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Tanggal Mulai</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Tanggal Selesai</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Deskripsi (Opsional)</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    placeholder="Keterangan tambahan..."
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Aktifkan pendaftaran sekarang
                                </label>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                                >
                                    {editingBatch ? 'Simpan Perubahan' : 'Tambah Batch'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
