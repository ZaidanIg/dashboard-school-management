import { X, Search, Check } from 'lucide-react'
import { useState, useMemo } from 'react'

interface Teacher {
    id: string
    name: string
    nip?: string
}

interface TeacherAssignmentModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (teacherId: string | null) => Promise<void>
    currentTeacherId?: string
    teachers: Teacher[]
    title?: string
    isLoading?: boolean
}

export default function TeacherAssignmentModal({
    isOpen,
    onClose,
    onConfirm,
    currentTeacherId,
    teachers,
    title = 'Pilih Guru Pengajar',
    isLoading = false
}: TeacherAssignmentModalProps) {
    const [search, setSearch] = useState('')
    const [selectedId, setSelectedId] = useState<string | null>(currentTeacherId || null)

    const filteredTeachers = useMemo(() => {
        if (!search) return teachers
        const lower = search.toLowerCase()
        return teachers.filter(t =>
            t.name.toLowerCase().includes(lower) ||
            t.nip?.includes(lower)
        )
    }, [teachers, search])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 transform transition-all animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 shrink-0">
                    <h3 className="text-lg font-semibold text-text-main dark:text-white">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-text-secondary"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 shrink-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari nama atau NIP..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="overflow-y-auto p-2 space-y-1 custom-scrollbar flex-1">
                    <button
                        onClick={() => setSelectedId(null)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors text-left ${selectedId === null
                            ? 'bg-primary/5 border border-primary/20'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                    >
                        <div>
                            <p className={`font-medium ${selectedId === null ? 'text-primary' : 'text-text-main dark:text-white'}`}>
                                Belum ada guru
                            </p>
                            <p className="text-xs text-text-secondary">Kosongkan jadwal ini</p>
                        </div>
                        {selectedId === null && <Check size={18} className="text-primary" />}
                    </button>

                    {filteredTeachers.map((teacher) => (
                        <button
                            key={teacher.id}
                            onClick={() => setSelectedId(teacher.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors text-left ${selectedId === teacher.id
                                ? 'bg-primary/5 border border-primary/20'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            <div>
                                <p className={`font-medium ${selectedId === teacher.id ? 'text-primary' : 'text-text-main dark:text-white'}`}>
                                    {teacher.name}
                                </p>
                                <p className="text-xs text-text-secondary">{teacher.nip || 'No NIP'}</p>
                            </div>
                            {selectedId === teacher.id && <Check size={18} className="text-primary" />}
                        </button>
                    ))}

                    {filteredTeachers.length === 0 && (
                        <div className="text-center py-8 text-text-secondary">
                            Tidak ada guru ditemukan
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-4 bg-slate-50 dark:bg-gray-800/50 rounded-b-xl border-t border-gray-100 dark:border-gray-700 shrink-0">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-main dark:text-gray-400 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all"
                    >
                        Batal
                    </button>
                    <button
                        onClick={() => onConfirm(selectedId)}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-all flex items-center gap-2 bg-primary hover:bg-blue-700 text-white disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading && (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        </div>
    )
}
