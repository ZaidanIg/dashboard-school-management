import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus, Pencil, Trash2, X } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import { useCalendar, type CalendarEvent } from '@/hooks/useCalendar'
import { useAcademicYears } from '@/hooks/useAcademicYears'
import { useToast } from '@/contexts/ToastContext'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, parseISO, isWithinInterval } from 'date-fns'
import { id } from 'date-fns/locale'

export default function AcademicCalendar() {
    const { events, loading, createEvent, updateEvent, deleteEvent } = useCalendar()
    const { years } = useAcademicYears()
    const { success, error } = useToast()

    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    // Form State
    const [formData, setFormData] = useState<Partial<CalendarEvent>>({
        title: '',
        description: '',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
        type: 'EVENT',
        academicYearId: ''
    })

    // Prepare active academic year
    const activeYear = years.find(y => y.isActive)

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate)
    })

    const startDay = startOfMonth(currentDate).getDay()
    const paddingDays = Array(startDay === 0 ? 6 : startDay - 1).fill(null)

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
    const goToToday = () => {
        const now = new Date()
        setCurrentDate(now)
        setSelectedDate(now)
    }

    const getEventsForDay = (date: Date) => {
        return events.filter(event => {
            const start = parseISO(event.startDate)
            const end = parseISO(event.endDate)
            return isWithinInterval(date, { start, end }) || isSameDay(date, start)
        })
    }

    const handleOpenModal = (event?: CalendarEvent, date?: Date) => {
        if (!activeYear) {
            error('Peringatan', 'Tidak ada tahun ajaran aktif. Silakan set tahun ajaran aktif terlebih dahulu.')
            return
        }

        if (event) {
            setEditingEvent(event)
            setFormData({
                title: event.title,
                description: event.description || '',
                startDate: format(parseISO(event.startDate), 'yyyy-MM-dd'),
                endDate: format(parseISO(event.endDate), 'yyyy-MM-dd'),
                type: event.type,
                academicYearId: event.academicYearId
            })
        } else {
            setEditingEvent(null)
            const d = date ? format(date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
            setFormData({
                title: '',
                description: '',
                startDate: d,
                endDate: d,
                type: 'EVENT',
                academicYearId: activeYear.id
            })
        }
        setIsModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Ensure dates are ISO strings for API (add time if needed or handling by backend)
        const payload = {
            ...formData,
            startDate: new Date(formData.startDate!).toISOString(),
            endDate: new Date(formData.endDate!).toISOString()
        }

        const result = editingEvent
            ? await updateEvent(editingEvent.id, payload)
            : await createEvent(payload)

        if (result.success) {
            success(editingEvent ? 'Berhasil Diperbarui' : 'Berhasil Ditambahkan',
                `Event ${formData.title} berhasil ${editingEvent ? 'diperbarui' : 'ditambahkan'}`)
            setIsModalOpen(false)
        } else {
            error('Gagal', result.error)
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return
        const result = await deleteEvent(deleteId)
        if (result.success) {
            success('Berhasil Dihapus', 'Event berhasil dihapus')
            setDeleteId(null)
            setEditingEvent(null) // Close detail if open (though we use modal)
        } else {
            error('Gagal Menghapus', result.error)
        }
    }

    const eventTypeColors = {
        HOLIDAY: 'bg-red-100 text-red-700 border-red-200',
        EXAM: 'bg-amber-100 text-amber-700 border-amber-200',
        EVENT: 'bg-blue-100 text-blue-700 border-blue-200',
        MEETING: 'bg-purple-100 text-purple-700 border-purple-200',
        OTHER: 'bg-gray-100 text-gray-700 border-gray-200'
    }

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <PageHeader
                title="Kalender Akademik"
                subtitle="Jadwal kegiatan sekolah tahun ajaran aktif"
                breadcrumb={[
                    { label: 'Akademik', path: '/academic' },
                    { label: 'Kalender' },
                ]}
                actions={
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Plus size={18} />
                        <span>Tambah Event</span>
                    </button>
                }
            />

            <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                {/* Calendar View */}
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-border-color dark:border-gray-700 flex flex-col min-h-0">
                    {/* Calendar Header */}
                    <div className="p-4 flex items-center justify-between border-b border-border-color dark:border-gray-700">
                        <h2 className="text-lg font-bold text-text-main dark:text-white flex items-center gap-2">
                            <CalendarIcon size={20} className="text-primary" />
                            {format(currentDate, 'MMMM yyyy', { locale: id })}
                        </h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={goToToday}
                                className="px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors mr-2"
                            >
                                Hari Ini
                            </button>
                            <button
                                onClick={prevMonth}
                                className="p-2 text-text-secondary hover:text-text-main dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={nextMonth}
                                className="p-2 text-text-secondary hover:text-text-main dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="flex-1 grid grid-cols-7 grid-rows-[auto_1fr] min-h-0">
                        {/* Day Headers */}
                        {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day) => (
                            <div key={day} className="p-3 text-center text-sm font-semibold text-text-secondary border-b border-border-color dark:border-gray-700 bg-slate-50 dark:bg-gray-700/30">
                                {day}
                            </div>
                        ))}

                        {/* Calendar Days */}
                        <div className="col-span-7 grid grid-cols-7 auto-rows-fr overflow-y-auto">
                            {paddingDays.map((_, i) => (
                                <div key={`padding-${i}`} className="bg-slate-50/30 dark:bg-gray-800 border-r border-b border-border-color dark:border-gray-700 min-h-[100px]" />
                            ))}

                            {daysInMonth.map((date) => {
                                const dayEvents = getEventsForDay(date)
                                const isSelected = isSameDay(date, selectedDate)
                                const isToday = isSameDay(date, new Date())

                                return (
                                    <div
                                        key={date.toISOString()}
                                        onClick={() => setSelectedDate(date)}
                                        className={`p-2 border-r border-b border-border-color dark:border-gray-700 min-h-[100px] cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-gray-700/50 ${isSelected ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span
                                                className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday
                                                    ? 'bg-primary text-white shadow-sm'
                                                    : isSelected
                                                        ? 'text-primary'
                                                        : 'text-text-secondary'
                                                    }`}
                                            >
                                                {format(date, 'd')}
                                            </span>
                                            {dayEvents.length > 0 && (
                                                <span className="text-xs font-medium text-text-secondary bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-md">
                                                    {dayEvents.length}
                                                </span>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            {dayEvents.slice(0, 3).map((event) => (
                                                <div
                                                    key={event.id}
                                                    onClick={(e) => { e.stopPropagation(); handleOpenModal(event); }}
                                                    className={`text-xs px-1.5 py-0.5 rounded border truncate ${eventTypeColors[event.type as keyof typeof eventTypeColors]
                                                        }`}
                                                    title={event.title}
                                                >
                                                    {event.title}
                                                </div>
                                            ))}
                                            {dayEvents.length > 3 && (
                                                <div className="text-xs text-text-secondary pl-1">
                                                    +{dayEvents.length - 3} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Sidebar (Details) */}
                <div className="w-full lg:w-80 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-border-color dark:border-gray-700 flex flex-col p-4">
                    <h3 className="font-bold text-lg mb-4 text-text-main dark:text-white border-b pb-2">
                        {format(selectedDate, 'd MMMM yyyy', { locale: id })}
                    </h3>

                    <div className="flex-1 overflow-y-auto space-y-3">
                        {getEventsForDay(selectedDate).length === 0 ? (
                            <div className="text-center py-8 text-text-secondary">
                                <p>Tidak ada kegiatan</p>
                                <button
                                    onClick={() => handleOpenModal(undefined, selectedDate)}
                                    className="mt-2 text-sm text-primary hover:underline"
                                >
                                    Tambah kegiatan
                                </button>
                            </div>
                        ) : (
                            getEventsForDay(selectedDate).map(event => (
                                <div key={event.id} className="p-3 rounded-lg border border-border-color dark:border-gray-700 bg-slate-50 dark:bg-gray-700/30 group">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${eventTypeColors[event.type as keyof typeof eventTypeColors]
                                            }`}>
                                            {event.type}
                                        </span>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleOpenModal(event)} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                                                <Pencil size={14} />
                                            </button>
                                            <button onClick={() => setDeleteId(event.id)} className="p-1 text-red-600 hover:bg-red-100 rounded">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <h4 className="font-semibold text-text-main dark:text-white mb-1">{event.title}</h4>
                                    {event.description && (
                                        <p className="text-sm text-text-secondary mb-2 line-clamp-2">{event.description}</p>
                                    )}
                                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                                        <Clock size={12} />
                                        <span>
                                            {format(parseISO(event.startDate), 'd MMM')} - {format(parseISO(event.endDate), 'd MMM yyyy')}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Event Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold">{editingEvent ? 'Edit Event' : 'Tambah Event'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Judul Event</label>
                                <input
                                    required
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Contoh: Ujian Tengah Semester"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Tipe</label>
                                <select
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                >
                                    <option value="EVENT">Event</option>
                                    <option value="HOLIDAY">Libur</option>
                                    <option value="EXAM">Ujian</option>
                                    <option value="MEETING">Rapat</option>
                                    <option value="OTHER">Lainnya</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Tanggal Mulai</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                        value={formData.startDate}
                                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Tanggal Selesai</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                        value={formData.endDate}
                                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
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
                title="Hapus Event"
                message="Apakah Anda yakin ingin menghapus event ini?"
                confirmLabel="Hapus"
                variant="danger"
                isLoading={loading}
            />
        </div>
    )
}
