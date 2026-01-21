import { useState } from 'react'
import { BookOpen, ClipboardList, PenTool } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import TeacherModulAjar from './grading/TeacherModulAjar'
import TeacherFormatif from './grading/TeacherFormatif'
import TeacherSumatif from './grading/TeacherSumatif'

type Tab = 'modul' | 'formatif' | 'sumatif'

export default function Grading() {
    const [activeTab, setActiveTab] = useState<Tab>('modul')

    const tabs: { id: Tab; label: string; icon: any }[] = [
        { id: 'modul', label: 'Modul Ajar', icon: BookOpen },
        { id: 'formatif', label: 'Penilaian Formatif', icon: ClipboardList },
        { id: 'sumatif', label: 'Penilaian Sumatif', icon: PenTool },
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title="Input Nilai / Penilaian"
                subtitle="Kelola modul ajar dan input penilaian siswa (Kurikulum Merdeka)"
                breadcrumb={[{ label: 'Penilaian' }]}
            />

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 border-b border-border-color dark:border-gray-700">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${isActive
                                    ? 'border-primary text-primary bg-primary/5 rounded-t-lg'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-t-lg'
                                }`}
                        >
                            <Icon size={18} />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Tab Content */}
            <div className="min-h-[500px]">
                {activeTab === 'modul' && <TeacherModulAjar />}
                {activeTab === 'formatif' && <TeacherFormatif />}
                {activeTab === 'sumatif' && <TeacherSumatif />}
            </div>
        </div>
    )
}
