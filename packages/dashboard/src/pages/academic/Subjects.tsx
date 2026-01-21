import { useState } from 'react'
import { Clock, X } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'
import DataTable, { type Column } from '@/components/common/DataTable'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import { useSubjects } from '@/hooks/useSubjects'
import { useToast } from '@/contexts/ToastContext'
import type { Subject } from '@/types'

export default function Subjects() {
    const { subjects, loading, createSubject, updateSubject, deleteSubject } = useSubjects()
    const { success, error } = useToast()

    // State
    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    // Form State
    const [formData, setFormData] = useState<Partial<Subject>>({
        code: '',
        name: '',
        category: 'WAJIB',
        hoursPerWeek: 2,
        description: ''
    })

    const filteredSubjects = subjects.filter(s => {
        const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.code.toLowerCase().includes(search.toLowerCase())
        const matchCategory = categoryFilter ? s.category === categoryFilter : true
        return matchSearch && matchCategory
    })

    const handleOpenModal = (subject?: Subject) => {
        if (subject) {
            setEditingSubject(subject)
            setFormData({
                code: subject.code,
                name: subject.name,
                category: subject.category,
                hoursPerWeek: subject.hoursPerWeek,
                description: subject.description || ''
            })
        } else {
            setEditingSubject(null)
            setFormData({
                code: '',
                name: '',
                category: 'WAJIB',
                hoursPerWeek: 2,
                description: ''
            })
        }
        setIsModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const result = editingSubject
            ? await updateSubject(editingSubject.id, formData)
            : await createSubject(formData)

        if (result.success) {
            success(editingSubject ? 'Berhasil Diperbarui' : 'Berhasil Ditambahkan',
                `Mata pelajaran ${formData.name} berhasil ${editingSubject ? 'diperbarui' : 'ditambahkan'}`)
            setIsModalOpen(false)
        } else {
            error('Gagal', result.error)
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return
        const result = await deleteSubject(deleteId)
        if (result.success) {
            success('Berhasil Dihapus', 'Mata pelajaran berhasil dihapus')
            setDeleteId(null)
        } else {
            error('Gagal Menghapus', result.error)
        }
    }

    const columns: Column<Subject>[] = [
        {
            key: 'code',
            header: 'Kode',
            render: (s) => (
                <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-bold">
                    {s.code}
                </span>
            ),
        },
        { key: 'name', header: 'Nama Mata Pelajaran', render: (s) => <span className="font-medium">{s.name}</span> },
        {
            key: 'category',
            header: 'Kategori',
            render: (s) => {
                let color = 'bg-slate-100 text-slate-700'
                if (s.category === 'WAJIB') color = 'bg-blue-50 text-blue-700'
                if (s.category.includes('PEMINATAN')) color = 'bg-purple-50 text-purple-700'
                if (s.category === 'MULOK') color = 'bg-amber-50 text-amber-700'

                return (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
                        {s.category.replace('_', ' ')}
                    </span>
                )
            },
        },
        {
            key: 'hoursPerWeek',
            header: 'Jam/Minggu',
            render: (s) => (
                <span className="flex items-center gap-1">
                    <Clock size={14} className="text-text-secondary" />
                    {s.hoursPerWeek} JP
                </span>
            ),
        },
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title="Mata Pelajaran"
                subtitle="Kelola daftar mata pelajaran"
                breadcrumb={[
                    { label: 'Akademik', path: '/academic' },
                    { label: 'Mata Pelajaran' },
                ]}
            />

            <FilterBar
                searchPlaceholder="Cari mata pelajaran..."
                onSearch={setSearch}
                filters={[
                    {
                        label: 'Semua Kategori',
                        options: [
                            { label: 'Wajib', value: 'WAJIB' },
                            { label: 'Peminatan IPA', value: 'PEMINATAN_IPA' },
                            { label: 'Peminatan IPS', value: 'PEMINATAN_IPS' },
                            { label: 'Mulok', value: 'MULOK' },
                            { label: 'Ekstrakurikuler', value: 'EKSTRA' },
                        ],
                        value: categoryFilter,
                        onChange: setCategoryFilter
                    },
                ]}
                onAdd={() => handleOpenModal()}
                addLabel="Tambah Mapel"
            />

            <DataTable
                columns={columns}
                data={filteredSubjects}
                isLoading={loading}
                currentPage={1}
                totalPages={1}
                totalItems={filteredSubjects.length}
                onEdit={(s) => handleOpenModal(s)}
                onDelete={(s) => setDeleteId(s.id)}
            />

            {/* Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold">{editingSubject ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Kode Mapel</label>
                                <input
                                    required
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    placeholder="Contoh: MTK"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Nama Mata Pelajaran</label>
                                <input
                                    required
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Contoh: Matematika Wajib"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Kategori</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                                    >
                                        <option value="WAJIB">Wajib</option>
                                        <option value="PEMINATAN_IPA">Peminatan IPA</option>
                                        <option value="PEMINATAN_IPS">Peminatan IPS</option>
                                        <option value="MULOK">Mulok</option>
                                        <option value="EKSTRA">Ekstrakurikuler</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Jam / Minggu</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                        value={formData.hoursPerWeek}
                                        onChange={e => setFormData({ ...formData, hoursPerWeek: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                                <textarea
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                    rows={3}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg">Batal</button>
                                <button type="submit" disabled={loading} className="px-4 py-2 text-white bg-blue-600 rounded-lg">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Hapus Mata Pelajaran"
                message="Apakah Anda yakin ingin menghapus mata pelajaran ini? Data yang dihapus tidak dapat dikembalikan."
                confirmLabel="Hapus"
                variant="danger"
                isLoading={loading}
            />
        </div>
    )
}
