import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, ChevronDown, Menu, LogOut, User, Settings, Users, GraduationCap, X, Loader2 } from 'lucide-react'
import { useAuthContext } from '@/contexts/AuthContext'

interface HeaderProps {
    onMenuClick?: () => void
}

interface AcademicYear {
    id: string
    name: string
    isActive: boolean
}

interface SearchResult {
    type: 'student' | 'teacher'
    id: string
    name: string
    subtitle: string
}

export default function Header({ onMenuClick }: HeaderProps) {
    const { user, logout } = useAuthContext()
    const navigate = useNavigate()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [activeYear, setActiveYear] = useState<AcademicYear | null>(null)

    // Search state
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [showSearchResults, setShowSearchResults] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchActiveYear = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/academic/years')
                const data = await res.json()
                const active = data.find((y: AcademicYear) => y.isActive)
                if (active) setActiveYear(active)
            } catch (error) {
                console.error('Failed to fetch academic years', error)
            }
        }
        fetchActiveYear()
    }, [])

    // Debounced search
    useEffect(() => {
        if (searchQuery.length < 2) {
            setSearchResults([])
            setShowSearchResults(false)
            return
        }

        const timer = setTimeout(async () => {
            setIsSearching(true)
            setShowSearchResults(true)
            try {
                const results: SearchResult[] = []

                // Search students
                const studentsRes = await fetch(`http://localhost:3001/api/students?search=${encodeURIComponent(searchQuery)}`)
                if (studentsRes.ok) {
                    const response = await studentsRes.json()
                    const students = response.data || response
                    if (Array.isArray(students)) {
                        students.slice(0, 5).forEach((s: any) => {
                            results.push({
                                type: 'student',
                                id: s.id,
                                name: s.name,
                                subtitle: `NIS: ${s.nis || '-'}`
                            })
                        })
                    }
                }

                // Search teachers
                const teachersRes = await fetch(`http://localhost:3001/api/teachers?search=${encodeURIComponent(searchQuery)}`)
                if (teachersRes.ok) {
                    const response = await teachersRes.json()
                    const teachers = response.data || response
                    if (Array.isArray(teachers)) {
                        teachers.slice(0, 5).forEach((t: any) => {
                            results.push({
                                type: 'teacher',
                                id: t.id,
                                name: t.name,
                                subtitle: `NIP: ${t.nip || '-'}`
                            })
                        })
                    }
                }

                setSearchResults(results)
            } catch (error) {
                console.error('Search failed', error)
            } finally {
                setIsSearching(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQuery])

    // Close search results on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearchResults(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleResultClick = (result: SearchResult) => {
        setShowSearchResults(false)
        setSearchQuery('')
        if (result.type === 'student') {
            navigate(`/students/${result.id}`)
        } else {
            navigate(`/teachers/${result.id}`)
        }
    }

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-gray-800 border-b border-border-color dark:border-gray-700 shrink-0">
            {/* Mobile Menu Button */}
            <div className="flex items-center gap-4 lg:hidden">
                <button
                    onClick={onMenuClick}
                    className="text-text-secondary hover:text-primary"
                >
                    <Menu size={24} />
                </button>
                <h2 className="text-lg font-bold text-text-main dark:text-white">
                    Dashboard
                </h2>
            </div>

            {/* Search Bar */}
            <div className="hidden lg:flex items-center flex-1 max-w-xl" ref={searchRef}>
                <div className="relative w-full">
                    <Search
                        size={20}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                    />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                        placeholder="Search students, teachers..."
                        className="w-full pl-10 pr-10 py-2 bg-slate-50 dark:bg-gray-700 border-none rounded-lg text-sm text-text-main dark:text-white placeholder:text-text-secondary focus:ring-2 focus:ring-primary/50 focus:outline-none"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => { setSearchQuery(''); setShowSearchResults(false) }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main"
                        >
                            <X size={16} />
                        </button>
                    )}

                    {/* Search Results Dropdown */}
                    {showSearchResults && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-slate-200 dark:border-gray-700 overflow-hidden z-50">
                            {isSearching ? (
                                <div className="flex items-center justify-center py-8 text-text-secondary">
                                    <Loader2 size={20} className="animate-spin mr-2" />
                                    Mencari...
                                </div>
                            ) : searchResults.length === 0 ? (
                                <div className="py-8 text-center text-text-secondary text-sm">
                                    Tidak ada hasil untuk "{searchQuery}"
                                </div>
                            ) : (
                                <div className="max-h-80 overflow-y-auto">
                                    {searchResults.map((result) => (
                                        <button
                                            key={`${result.type}-${result.id}`}
                                            onClick={() => handleResultClick(result)}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors text-left"
                                        >
                                            <div className={`p-2 rounded-lg ${result.type === 'student' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                {result.type === 'student' ? <Users size={18} /> : <GraduationCap size={18} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-text-main dark:text-white truncate">{result.name}</p>
                                                <p className="text-xs text-text-secondary truncate">{result.subtitle}</p>
                                            </div>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${result.type === 'student' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                {result.type === 'student' ? 'Siswa' : 'Guru'}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
                {/* Notifications */}
                <button className="relative p-2 text-text-secondary hover:text-primary hover:bg-slate-50 dark:hover:bg-gray-700 rounded-full transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                </button>

                {/* Academic Year Selector */}
                <button className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-color dark:border-gray-600 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors">
                    <span className="text-sm font-medium text-text-main dark:text-white">
                        TA {activeYear?.name || 'Loading...'}
                    </span>
                    <ChevronDown size={18} />
                </button>

                {/* User Menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-semibold text-sm">
                            {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-medium text-text-main dark:text-white">
                                {user?.name || 'User'}
                            </p>
                            <p className="text-xs text-text-secondary">
                                {user?.role || 'Role'}
                            </p>
                        </div>
                        <ChevronDown size={16} className="hidden md:block text-text-secondary" />
                    </button>

                    {/* Dropdown Menu */}
                    {showUserMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowUserMenu(false)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-border-color dark:border-gray-700 py-1 z-50">
                                <button
                                    onClick={() => { navigate('/settings/users'); setShowUserMenu(false) }}
                                    className="w-full px-4 py-2 text-left text-sm text-text-main dark:text-white hover:bg-slate-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                >
                                    <User size={16} />
                                    Profil Saya
                                </button>
                                <button
                                    onClick={() => { navigate('/settings/config'); setShowUserMenu(false) }}
                                    className="w-full px-4 py-2 text-left text-sm text-text-main dark:text-white hover:bg-slate-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                >
                                    <Settings size={16} />
                                    Pengaturan
                                </button>
                                <hr className="my-1 border-border-color dark:border-gray-700" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-2"
                                >
                                    <LogOut size={16} />
                                    Keluar
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
