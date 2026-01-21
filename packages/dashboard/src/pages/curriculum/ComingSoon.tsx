import { Link } from 'react-router-dom'
import { Construction, ArrowLeft } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'

interface ComingSoonProps {
    title: string
    description?: string
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
    return (
        <div className="space-y-6">
            <PageHeader
                title={title}
                subtitle={description || 'Fitur ini sedang dalam pengembangan'}
                breadcrumb={[
                    { label: 'Kurikulum', path: '/curriculum' },
                    { label: title }
                ]}
            />

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-12 text-center">
                <Construction className="h-16 w-16 text-amber-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-text-main dark:text-white mb-2">
                    Segera Hadir
                </h2>
                <p className="text-text-secondary mb-6 max-w-md mx-auto">
                    Fitur <strong>{title}</strong> sedang dalam pengembangan dan akan segera tersedia.
                </p>
                <Link
                    to="/curriculum"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                    <ArrowLeft size={18} />
                    Kembali ke Kurikulum
                </Link>
            </div>
        </div>
    )
}



export function PenilaianSumatif() {
    return <ComingSoon title="Penilaian Sumatif" description="Input penilaian STS dan SAS" />
}

export function Portofolio() {
    return <ComingSoon title="Portofolio" description="Lihat dan generate portofolio siswa" />
}
