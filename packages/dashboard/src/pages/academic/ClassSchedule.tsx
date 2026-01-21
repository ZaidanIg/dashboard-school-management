import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Clock, MapPin, X } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import { useSchedules, type Schedule } from '@/hooks/useSchedules'
import { useClasses } from '@/hooks/useClasses'
import { useSubjects } from '@/hooks/useSubjects'
import { useToast } from '@/contexts/ToastContext'

export default function ClassSchedule() {
    const [selectedClassId, setSelectedClassId] = useState('')

    // Only fetch schedules if a class is selected
    const { schedules, loading, createSchedule, updateSchedule, deleteSchedule } = useSchedules(selectedClassId)
    const { classes } = useClasses()
    const { subjects } = useSubjects()
    const { success, error } = useToast()

    // Auto-select first class
    useEffect(() => {
        if (classes.length > 0 && !selectedClassId) {
            setSelectedClassId(classes[0].id)
        }
    }, [classes, selectedClassId])

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        subjectId: '',
        dayOfWeek: 1, // Senin
        startTime: '07:00',
        endTime: '08:30',
        room: ''
    })

    const days = [
        { value: 1, label: 'Senin' },
        { value: 2, label: 'Selasa' },
        { value: 3, label: 'Rabu' },
        { value: 4, label: 'Kamis' },
        { value: 5, label: 'Jumat' },
        { value: 6, label: 'Sabtu' },
    ]

    const handleOpenModal = (schedule?: Schedule, day?: number) => {
        if (!selectedClassId) {
            error('Peringatan', 'Silakan pilih kelas terlebih dahulu')
            return
        }

        if (schedule) {
            setEditingSchedule(schedule)
            setFormData({
                subjectId: schedule.subjectId,
                dayOfWeek: schedule.dayOfWeek,
                startTime: schedule.startTime,
                endTime: schedule.endTime,
                room: schedule.room || ''
            })
        } else {
            setEditingSchedule(null)
            setFormData({
                subjectId: '',
                dayOfWeek: day || 1,
                startTime: '07:00',
                endTime: '08:30',
                room: ''
            })
        }
        setIsModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const payload = {
            ...formData,
            classId: selectedClassId,
            dayOfWeek: parseInt(formData.dayOfWeek.toString())
        }

        const result = editingSchedule
            ? await updateSchedule(editingSchedule.id, payload)
            : await createSchedule(payload)

        if (result.success) {
            success(editingSchedule ? 'Berhasil Diperbarui' : 'Berhasil Ditambahkan',
                `Jadwal berhasil ${editingSchedule ? 'diperbarui' : 'ditambahkan'}`)
            setIsModalOpen(false)
        } else {
            error('Gagal', result.error)
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return
        const result = await deleteSchedule(deleteId)
        if (result.success) {
            success('Berhasil Dihapus', 'Jadwal berhasil dihapus')
            setDeleteId(null)
        } else {
            error('Gagal Menghapus', result.error)
        }
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Jadwal Pelajaran"
                subtitle="Lihat dan kelola jadwal pelajaran per kelas"
                breadcrumb={[
                    { label: 'Akademik', path: '/academic' },
                    { label: 'Jadwal Pelajaran' },
                ]}
            />

            <FilterBar
                filters={[
                    {
                        label: 'Pilih Kelas',
                        options: classes.map(c => ({ label: `${c.grade} ${c.name}`, value: c.id })),
                        value: selectedClassId,
                        onChange: setSelectedClassId
                    }
                ]}
                searchPlaceholder="Cari jadwal..."
                onAdd={() => handleOpenModal()}
                addLabel="Tambah Jadwal"
            />

            {!selectedClassId ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <Clock size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pilih Kelas Terlebih Dahulu</h3>
                    <p className="text-gray-500 dark:text-gray-400">Silakan pilih kelas pada filter di atas untuk melihat jadwal.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {days.map(day => {
                        const daySchedules = schedules.filter(s => s.dayOfWeek === day.value)

                        return (
                            <div key={day.value} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-border-color dark:border-gray-700 flex flex-col">
                                <div className="p-4 border-b border-border-color dark:border-gray-700 flex justify-between items-center bg-slate-50 dark:bg-gray-700/50 rounded-t-xl opacity-90 backdrop-blur-sm sticky top-0">
                                    <h3 className="font-bold text-lg text-text-main dark:text-white">{day.label}</h3>
                                    <button
                                        onClick={() => handleOpenModal(undefined, day.value)}
                                        className="p-1.5 text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                <div className="p-4 space-y-3 min-h-[150px]">
                                    {daySchedules.length === 0 ? (
                                        <div className="text-center py-8 text-gray-400 italic text-sm">
                                            Belum ada jadwal
                                        </div>
                                    ) : (
                                        daySchedules.map(schedule => (
                                            <div key={schedule.id} className="group relative bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg p-3 hover:shadow-md transition-all hover:border-primary/30">
                                                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleOpenModal(schedule)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button onClick={() => setDeleteId(schedule.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>

                                                <div className="flex items-start justify-between mb-2 pr-12">
                                                    <div>
                                                        <h4 className="font-bold text-text-main dark:text-white line-clamp-1">{schedule.subject?.name}</h4>
                                                        <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded mr-2 font-medium">
                                                            {schedule.subject?.code}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 text-xs text-text-secondary mt-3">
                                                    <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded">
                                                        <Clock size={12} />
                                                        <span>{schedule.startTime} - {schedule.endTime}</span>
                                                    </div>
                                                    {schedule.room && (
                                                        <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded">
                                                            <MapPin size={12} />
                                                            <span>{schedule.room}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold">{editingSchedule ? 'Edit Jadwal' : 'Tambah Jadwal'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Mata Pelajaran</label>
                                <select
                                    required
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                    value={formData.subjectId}
                                    onChange={e => setFormData({ ...formData, subjectId: e.target.value })}
                                >
                                    <option value="">Pilih Mapel</option>
                                    {subjects.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.code}) - {s.hoursPerWeek} JP</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Hari</label>
                                    <select
                                        required
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                        value={formData.dayOfWeek}
                                        onChange={e => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })}
                                    >
                                        {days.map(d => (
                                            <option key={d.value} value={d.value}>{d.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Ruangan</label>
                                    <input
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                        value={formData.room}
                                        onChange={e => setFormData({ ...formData, room: e.target.value })}
                                        placeholder="Opsional"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Jam Mulai</label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                        value={formData.startTime}
                                        onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Jam Selesai</label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                        value={formData.endTime}
                                        onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                                    />
                                </div>
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
                title="Hapus Jadwal"
                message="Apakah Anda yakin ingin menghapus jadwal ini?"
                confirmLabel="Hapus"
                variant="danger"
                isLoading={loading}
            />
        </div>
    )
}
