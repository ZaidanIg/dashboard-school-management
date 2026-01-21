import { Search, Filter, Download, Upload, Plus } from 'lucide-react'

interface FilterOption {
    label: string
    value: string
}

interface FilterBarProps {
    searchPlaceholder?: string
    onSearch?: (value: string) => void
    filters?: {
        label: string
        options: FilterOption[]
        value?: string
        onChange?: (value: string) => void
    }[]
    onAdd?: () => void
    addLabel?: string
    onExport?: () => void
    onImport?: () => void
}

export default function FilterBar({
    searchPlaceholder = 'Search...',
    onSearch,
    filters = [],
    onAdd,
    addLabel = 'Add New',
    onExport,
    onImport,
}: FilterBarProps) {
    return (
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl border border-border-color dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                    />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        onChange={(e) => onSearch?.(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-gray-700 border-none rounded-lg text-sm text-text-main dark:text-white placeholder:text-text-secondary focus:ring-2 focus:ring-primary/50 focus:outline-none"
                    />
                </div>

                {/* Filters */}
                {filters.map((filter, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Filter size={16} className="text-text-secondary hidden sm:block" />
                        <select
                            value={filter.value}
                            onChange={(e) => filter.onChange?.(e.target.value)}
                            className="px-3 py-2 bg-slate-50 dark:bg-gray-700 border-none rounded-lg text-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 focus:outline-none cursor-pointer"
                        >
                            <option value="">{filter.label}</option>
                            {filter.options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
                {onImport && (
                    <button
                        onClick={onImport}
                        className="flex items-center gap-2 px-3 py-2 text-text-secondary hover:text-text-main dark:hover:text-white hover:bg-slate-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
                    >
                        <Upload size={18} />
                        <span className="hidden sm:inline">Import</span>
                    </button>
                )}
                {onExport && (
                    <button
                        onClick={onExport}
                        className="flex items-center gap-2 px-3 py-2 text-text-secondary hover:text-text-main dark:hover:text-white hover:bg-slate-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
                    >
                        <Download size={18} />
                        <span className="hidden sm:inline">Export</span>
                    </button>
                )}
                {onAdd && (
                    <button
                        onClick={onAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                        <Plus size={18} />
                        <span>{addLabel}</span>
                    </button>
                )}
            </div>
        </div>
    )
}
