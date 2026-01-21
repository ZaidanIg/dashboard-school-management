import { useState } from 'react'
import { Plus } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import FilterBar from '@/components/common/FilterBar'
import DataTable, { type Column } from '@/components/common/DataTable'
import StatusBadge from '@/components/common/StatusBadge'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useLetters } from '@/hooks/useCommunication'
import type { Letter } from '@/hooks/useCommunication'

export default function Letters() {
    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState({
        type: '',
        status: ''
    })

    const params: Record<string, string> = {}
    if (search) params.search = search
    if (filters.type) params.type = filters.type
    if (filters.status) params.status = filters.status

    const { letters, loading, error, refetch } = useLetters(params)

    const columns: Column<Letter>[] = [
        { key: 'referenceNumber', header: 'No. Surat', render: (l) => <span className="font-mono text-xs">{l.referenceNumber}</span> },
        { key: 'title', header: 'Perihal', render: (l) => <span className="font-medium">{l.title}</span> },
        {
            key: 'type',
            header: 'Tipe',
            render: (l) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${l.type === 'OFFICIAL' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {l.type}
                </span>
            ),
        },
        { key: 'recipient', header: 'Penerima' },
        { key: 'createdAt', header: 'Tanggal', render: (l) => new Date(l.createdAt).toLocaleDateString('id-ID') },
        {
            key: 'status',
            header: 'Status',
            render: (l) => (
                <StatusBadge
                    status={l.status === 'SENT' ? 'success' : 'warning'}
                    label={l.status}
                />
            ),
        },
    ]

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    // Stats calculation (mock for now as backend might not return aggregates yet)
    const stats = {
        total: letters.length,
        official: letters.filter(l => l.type === 'OFFICIAL').length,
        invitation: letters.filter(l => l.type === 'INVITATION').length,
        notice: letters.filter(l => l.type === 'NOTICE').length
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Surat Menyurat"
                subtitle="Kelola surat masuk dan keluar"
                breadcrumb={[
                    { label: 'Komunikasi', path: '/communication' },
                    { label: 'Surat Menyurat' },
                ]}
                actions={
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => refetch()}
                            className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            Refresh
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                            <Plus size={18} />
                            Buat Surat
                        </button>
                    </div>
                }
            />

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-border-color dark:border-gray-700">
                    <p className="text-2xl font-bold text-text-main dark:text-white">{stats.total}</p>
                    <p className="text-sm text-text-secondary">Total Surat</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-border-color dark:border-gray-700">
                    <p className="text-2xl font-bold text-blue-600">{stats.official}</p>
                    <p className="text-sm text-text-secondary">Surat Resmi</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-border-color dark:border-gray-700">
                    <p className="text-2xl font-bold text-emerald-600">{stats.invitation}</p>
                    <p className="text-sm text-text-secondary">Undangan</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-border-color dark:border-gray-700">
                    <p className="text-2xl font-bold text-amber-600">{stats.notice}</p>
                    <p className="text-sm text-text-secondary">Pemberitahuan</p>
                </div>
            </div>

            <FilterBar
                searchPlaceholder="Cari surat..."
                onSearch={setSearch}
                filters={[
                    {
                        label: 'Tipe',
                        options: [
                            { label: 'Resmi', value: 'OFFICIAL' },
                            { label: 'Undangan', value: 'INVITATION' },
                            { label: 'Pemberitahuan', value: 'NOTICE' },
                        ],
                        onChange: (val) => handleFilterChange('type', val)
                    },
                    {
                        label: 'Status',
                        options: [
                            { label: 'Draft', value: 'DRAFT' },
                            { label: 'Terkirim', value: 'SENT' },
                            { label: 'Arsip', value: 'ARCHIVED' },
                        ],
                        onChange: (val) => handleFilterChange('status', val)
                    },
                ]}
                onExport={() => { }}
            />

            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner />
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={letters}
                    onView={() => { }}
                    onEdit={() => { }}
                    onDelete={() => { }}
                    currentPage={1}
                    totalPages={1}
                    totalItems={letters.length}
                />
            )}
        </div>
    )
}
