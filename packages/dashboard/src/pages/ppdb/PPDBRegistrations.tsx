import { useState, useEffect } from 'react'
import { Users, Search, CheckCircle, XCircle, Clock, Eye } from 'lucide-react'

interface PPDBRegistration {
    id: string
    registrationNo: string
    fullName: string
    email: string
    phone: string
    originSchool: string
    status: 'PENDING' | 'VERIFIED' | 'ACCEPTED' | 'REJECTED'
    createdAt: string
    batch: { name: string }
}

const statusConfig = {
    PENDING: { label: 'Menunggu', color: 'bg-amber-100 text-amber-700', icon: Clock },
    VERIFIED: { label: 'Terverifikasi', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
    ACCEPTED: { label: 'Diterima', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    REJECTED: { label: 'Ditolak', color: 'bg-red-100 text-red-700', icon: XCircle },
}

export default function PPDBRegistrations() {
    const [registrations, setRegistrations] = useState<PPDBRegistration[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')

    useEffect(() => {
        fetchRegistrations()
    }, [statusFilter])

    const fetchRegistrations = async () => {
        try {
            let url = 'http://localhost:3001/ppdb/registrations'
            if (statusFilter) url += `?status=${statusFilter}`
            const res = await fetch(url)
            const data = await res.json()
            setRegistrations(data)
        } catch (error) {
            console.error('Failed to fetch registrations', error)
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async (id: string, status: string) => {
        try {
            await fetch(`http://localhost:3001/ppdb/registrations/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            })
            fetchRegistrations()
        } catch (error) {
            console.error('Failed to update status', error)
        }
    }

    const filteredRegistrations = registrations.filter(r =>
        r.fullName.toLowerCase().includes(search.toLowerCase()) ||
        r.registrationNo.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Daftar Pendaftar PPDB</h1>
                    <p className="text-slate-500 dark:text-slate-400">Kelola data calon siswa baru</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari nama atau nomor pendaftaran..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none min-w-[150px]"
                >
                    <option value="">Semua Status</option>
                    <option value="PENDING">Menunggu</option>
                    <option value="VERIFIED">Terverifikasi</option>
                    <option value="ACCEPTED">Diterima</option>
                    <option value="REJECTED">Ditolak</option>
                </select>
            </div>

            {/* Table */}
            {loading ? (
                <div className="text-center py-12 text-slate-500">Memuat data...</div>
            ) : filteredRegistrations.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <Users size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500">Belum ada data pendaftar.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">No. Daftar</th>
                                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Nama</th>
                                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Asal Sekolah</th>
                                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Kontak</th>
                                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Batch</th>
                                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Status</th>
                                    <th className="text-center px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filteredRegistrations.map((reg) => {
                                    const StatusIcon = statusConfig[reg.status].icon
                                    return (
                                        <tr key={reg.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="px-4 py-3 text-sm font-mono text-primary font-semibold">{reg.registrationNo}</td>
                                            <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{reg.fullName}</td>
                                            <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{reg.originSchool}</td>
                                            <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                                                <div>{reg.email}</div>
                                                <div className="text-xs text-slate-400">{reg.phone}</div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{reg.batch.name}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full ${statusConfig[reg.status].color}`}>
                                                    <StatusIcon size={14} />
                                                    {statusConfig[reg.status].label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button className="p-1.5 text-slate-400 hover:text-primary transition-colors" title="Lihat Detail">
                                                        <Eye size={18} />
                                                    </button>
                                                    {reg.status === 'PENDING' && (
                                                        <>
                                                            <button
                                                                onClick={() => updateStatus(reg.id, 'ACCEPTED')}
                                                                className="p-1.5 text-slate-400 hover:text-green-600 transition-colors"
                                                                title="Terima"
                                                            >
                                                                <CheckCircle size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => updateStatus(reg.id, 'REJECTED')}
                                                                className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                                                                title="Tolak"
                                                            >
                                                                <XCircle size={18} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
