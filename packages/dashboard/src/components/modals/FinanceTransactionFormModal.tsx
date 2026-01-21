import { useState, useEffect } from 'react'
import { X, Calendar, DollarSign, FileText, Tag, Hash } from 'lucide-react'

interface FinanceTransactionFormData {
    type: 'INCOME' | 'EXPENSE'
    date: string
    amount: number
    category: string
    description: string
    referenceNumber?: string
    paymentMethod?: string
}

interface FinanceTransactionFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: FinanceTransactionFormData) => Promise<void>
    isLoading?: boolean
    defaultType?: 'INCOME' | 'EXPENSE'
}

export default function FinanceTransactionFormModal({
    isOpen,
    onClose,
    onSubmit,
    isLoading,
    defaultType = 'INCOME'
}: FinanceTransactionFormModalProps) {
    const [formData, setFormData] = useState<FinanceTransactionFormData>({
        type: defaultType,
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        category: '',
        description: '',
        referenceNumber: '',
        paymentMethod: 'CASH'
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    // Pre-defined categories
    const INCOME_CATEGORIES = ['SPP', 'Pendaftaran', 'Dana BOS', 'Donasi', 'Lainnya']
    const EXPENSE_CATEGORIES = ['Gaji', 'ATK', 'Utilitas', 'Pemeliharaan', 'Konsumsi', 'Lainnya']

    // Sync default type
    useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({ ...prev, type: defaultType }))
        }
    }, [isOpen, defaultType])

    if (!isOpen) return null

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}
        if (!formData.date) newErrors.date = 'Tanggal wajib diisi'
        if (formData.amount <= 0) newErrors.amount = 'Jumlah harus lebih dari 0'
        if (!formData.category) newErrors.category = 'Kategori wajib dipilih'
        if (!formData.description.trim()) newErrors.description = 'Deskripsi wajib diisi'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return
        await onSubmit(formData)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-border-color dark:border-gray-700">
                    <h2 className="text-lg font-bold text-text-main dark:text-white">
                        {formData.type === 'INCOME' ? 'Tambah Pemasukan' : 'Tambah Pengeluaran'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg">
                        <X size={20} className="text-text-secondary" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
                    {/* Type Toggle */}
                    <div className="flex p-1 bg-slate-100 dark:bg-gray-700 rounded-lg">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'INCOME', category: '' })}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${formData.type === 'INCOME'
                                ? 'bg-white dark:bg-gray-600 text-emerald-600 shadow-sm'
                                : 'text-text-secondary'
                                }`}
                        >
                            Pemasukan
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'EXPENSE', category: '' })}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${formData.type === 'EXPENSE'
                                ? 'bg-white dark:bg-gray-600 text-rose-600 shadow-sm'
                                : 'text-text-secondary'
                                }`}
                        >
                            Pengeluaran
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                                <Calendar size={14} className="inline mr-1" /> Tanggal
                            </label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                            />
                            {errors.date && <p className="text-xs text-rose-500 mt-1">{errors.date}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                                <DollarSign size={14} className="inline mr-1" /> Jumlah
                            </label>
                            <input
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                                className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                                min="0"
                            />
                            {errors.amount && <p className="text-xs text-rose-500 mt-1">{errors.amount}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                            <Tag size={14} className="inline mr-1" /> Kategori
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                        >
                            <option value="">Pilih Kategori</option>
                            {(formData.type === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        {errors.category && <p className="text-xs text-rose-500 mt-1">{errors.category}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                            <FileText size={14} className="inline mr-1" /> Deskripsi
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                            placeholder={formData.type === 'INCOME' ? "Contoh: Pemasukan dari donatarium" : "Contoh: Pembelian spidol 5 kotak"}
                        />
                        {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                                <Hash size={14} className="inline mr-1" /> No. Referensi (Opsional)
                            </label>
                            <input
                                type="text"
                                value={formData.referenceNumber}
                                onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                                className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                                placeholder="Ref-123"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                                Metode
                            </label>
                            <select
                                value={formData.paymentMethod}
                                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                className="w-full px-3 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                            >
                                <option value="CASH">Tunai</option>
                                <option value="TRANSFER">Transfer</option>
                                <option value="CHECK">Cek</option>
                                <option value="OTHER">Lainnya</option>
                            </select>
                        </div>
                    </div>
                </form>

                <div className="flex items-center justify-end gap-3 p-6 border-t border-border-color dark:border-gray-700">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-gray-700"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={`px-6 py-2 text-white rounded-lg text-sm font-medium flex items-center gap-2 ${formData.type === 'INCOME' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                            }`}
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : null}
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    )
}
