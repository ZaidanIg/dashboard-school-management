import { useState, useEffect } from 'react'
import { X, Search, User, Loader2, CheckCircle2 } from 'lucide-react'
import { api } from '@/lib/api'
import { useDebounce } from '@/hooks/useShared'

interface Student {
    id: string
    name: string
    nis: string
    nisn: string
    gender: string
}

interface StudentSelectorModalProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (student: Student) => void
    title?: string
    excludeStudentIds?: string[]
}

export default function StudentSelectorModal({ isOpen, onClose, onSelect, title = 'Pilih Siswa', excludeStudentIds = [] }: StudentSelectorModalProps) {
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, 300)
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isOpen) {
            // Auto search if search term exists, or search 'all' (empty) if desired?
            // Usually search is needed to avoid loading 1000s students.
            if (debouncedSearch) {
                searchStudents()
            } else {
                setStudents([])
            }
        } else {
            setSearch('')
            setStudents([])
        }
    }, [isOpen, debouncedSearch])

    const searchStudents = async () => {
        setLoading(true)
        try {
            // Helper to handle response structure
            const response = await api.get<{ data: Student[] }>('/api/students', {
                search: debouncedSearch,
                limit: 20
            })
            setStudents(response.data || [])
        } catch (error) {
            console.error('Failed to search students', error)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-border-color dark:border-gray-700 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-text-main dark:text-white">{title}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <X size={20} className="text-text-secondary" />
                    </button>
                </div>

                <div className="p-4">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                        <input
                            type="text"
                            placeholder="Cari nama, NIS, atau email siswa..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-gray-700/50 border border-border-color dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            autoFocus
                        />
                    </div>

                    <div className="min-h-[200px] max-h-[300px] overflow-y-auto space-y-2">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-40 text-text-secondary">
                                <Loader2 size={24} className="animate-spin mb-2" />
                                <span className="text-sm">Mencari siswa...</span>
                            </div>
                        ) : students.filter(s => !excludeStudentIds.includes(s.id)).length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-text-secondary">
                                {search ? (
                                    <>
                                        <User size={32} className="mb-2 opacity-50" />
                                        <span className="text-sm">Tidak ada siswa ditemukan</span>
                                    </>
                                ) : (
                                    <>
                                        <Search size={32} className="mb-2 opacity-50" />
                                        <span className="text-sm">Ketik untuk mencari siswa</span>
                                    </>
                                )}
                            </div>
                        ) : (
                            students.filter(s => !excludeStudentIds.includes(s.id)).map(student => (
                                <button
                                    key={student.id}
                                    onClick={() => onSelect(student)}
                                    className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors flex items-center gap-3 group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                        {student.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-text-main dark:text-white group-hover:text-primary transition-colors">
                                            {student.name}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                                            <span>NIS: {student.nis}</span>
                                            <span>•</span>
                                            <span>{student.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'}</span>
                                        </div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                                        <CheckCircle2 size={20} />
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
