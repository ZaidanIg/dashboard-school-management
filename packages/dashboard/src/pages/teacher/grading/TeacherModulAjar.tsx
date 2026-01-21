import { useState, useEffect } from 'react'
import { Plus, FileText, BookOpen, Save, ChevronLeft, ChevronRight, Edit2, Trash2, X } from 'lucide-react'
import { api } from '@/lib/api'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import StatusBadge from '@/components/common/StatusBadge'
import { useModulAjar, useCapaianPembelajaran, useDimensiP7 } from '@/hooks/useKurikulumMerdeka'
import { useFetch } from '@/hooks/useShared'
import type {
    ModulAjar,
    Fase,
    TujuanPembelajaran,
    KegiatanPembelajaran,
    AcademicYear
} from '@/types'

// Form Steps
const STEPS = [
    { id: 'info', label: 'Informasi Umum', icon: '📋' },
    { id: 'tujuan', label: 'CP & Tujuan', icon: '🎯' },
    { id: 'kegiatan', label: 'Kegiatan', icon: '📝' },
    { id: 'asesmen', label: 'Asesmen', icon: '✅' },
    { id: 'lampiran', label: 'Lampiran', icon: '📎' }
]

const faseOptions: { value: Fase; label: string }[] = [
    { value: 'A', label: 'Fase A (SD/MI Kelas 1-2)' },
    { value: 'B', label: 'Fase B (SD/MI Kelas 3-4)' },
    { value: 'C', label: 'Fase C (SD/MI Kelas 5-6)' },
    { value: 'D', label: 'Fase D (SMP/MTs)' },
    { value: 'E', label: 'Fase E (SMA/MA Kelas 10)' },
    { value: 'F', label: 'Fase F (SMA/MA Kelas 11-12)' }
]

const modelOptions = [
    { value: 'TATAP_MUKA', label: 'Tatap Muka' },
    { value: 'DARING', label: 'Daring (Online)' },
    { value: 'CAMPURAN', label: 'Campuran (Blended)' }
]

type FormData = Partial<Omit<ModulAjar, 'id' | 'createdAt' | 'updatedAt'>>

const defaultFormData: FormData = {
    namaModul: '',
    fase: 'D',
    kelas: 7,
    deskripsiUmum: '',
    targetPesertaDidik: '',
    profilPelajarPancasila: [],
    kompetensiAwal: '',
    saranaPrasarana: [],
    modelPembelajaran: 'TATAP_MUKA',
    tujuanPembelajaran: [],
    alurTujuanPembelajaran: '',
    alokasiWaktuJam: 2,
    jumlahPertemuan: 1,
    pertanyaanPemantik: [],
    pemahamanBermakna: '',
    kegiatanPembelajaran: [],
    rencanaDiferensiasi: { konten: '', proses: '', produk: '' },
    rencanaAsesmen: { formatif: '' },
    lkpd: [],
    bahanBacaan: [],
    glosarium: [],
    daftarPustaka: [],
    status: 'DRAFT'
}

export default function TeacherModulAjar() {
    // Teacher State
    const [teacherId, setTeacherId] = useState<string | null>(null)
    const [teacherLoading, setTeacherLoading] = useState(true)

    const [showForm, setShowForm] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [formData, setFormData] = useState<FormData>(defaultFormData)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [filterStatus, setFilterStatus] = useState<string>('')
    const [filterCp, setFilterCp] = useState<string>('')

    // Hooks
    const { modulAjarList, create, update, remove, refetch } = useModulAjar(filterCp || undefined, teacherId || undefined)
    const { cpList } = useCapaianPembelajaran()
    const { dimensiList } = useDimensiP7()
    const { data: academicYears } = useFetch<AcademicYear[]>('/api/academic/years', undefined, { initialData: [] })

    const activeYear = academicYears.find(y => y.isActive)

    // Fetch Current Teacher
    useEffect(() => {
        const fetchMe = async () => {
            try {
                // Fetch schedule to get teacherId (fallback method)
                const schedules = await api.get<any[]>('/api/teachers/me/schedules')
                if (schedules.length > 0 && schedules[0]?.teacherId) {
                    setTeacherId(schedules[0].teacherId)
                } else {
                    // Try to fetch from auth context or generic teacher endpoint if needed
                    // for now we rely on schedule or assume context is enough
                    console.error("Could not auto-determine teacher ID from schedules")
                }
            } catch (err) {
                console.error(err)
            } finally {
                setTeacherLoading(false)
            }
        }
        fetchMe()
    }, [])

    // We need to ensure we have a teacherId before allowing create

    // Re-trigger fetch when teacherId changes
    useEffect(() => {
        if (teacherId) refetch()
    }, [teacherId])

    const handleOpenForm = (modul?: ModulAjar) => {
        if (modul) {
            setEditingId(modul.id)
            setFormData({
                cpId: modul.cpId,
                guruId: modul.guruId,
                tahunAjaranId: modul.tahunAjaranId,
                namaModul: modul.namaModul,
                fase: modul.fase,
                kelas: modul.kelas,
                deskripsiUmum: modul.deskripsiUmum || '',
                targetPesertaDidik: modul.targetPesertaDidik || '',
                profilPelajarPancasila: modul.profilPelajarPancasila || [],
                kompetensiAwal: modul.kompetensiAwal || '',
                saranaPrasarana: modul.saranaPrasarana || [],
                modelPembelajaran: modul.modelPembelajaran,
                tujuanPembelajaran: modul.tujuanPembelajaran || [],
                alurTujuanPembelajaran: modul.alurTujuanPembelajaran || '',
                alokasiWaktuJam: modul.alokasiWaktuJam,
                jumlahPertemuan: modul.jumlahPertemuan,
                pertanyaanPemantik: modul.pertanyaanPemantik || [],
                pemahamanBermakna: modul.pemahamanBermakna || '',
                kegiatanPembelajaran: modul.kegiatanPembelajaran || [],
                rencanaDiferensiasi: modul.rencanaDiferensiasi || { konten: '', proses: '', produk: '' },
                rencanaAsesmen: modul.rencanaAsesmen || { formatif: '' },
                lkpd: modul.lkpd || [],
                bahanBacaan: modul.bahanBacaan || [],
                glosarium: modul.glosarium || [],
                daftarPustaka: modul.daftarPustaka || [],
                status: modul.status
            })
        } else {
            setEditingId(null)
            setFormData({
                ...defaultFormData,
                guruId: teacherId || '', // Auto-set teacher ID
                tahunAjaranId: activeYear?.id || ''
            })
        }
        setCurrentStep(0)
        setShowForm(true)
    }

    const handleSubmit = async () => {
        if (!formData.cpId || !formData.namaModul) {
            alert('Silakan lengkapi Capaian Pembelajaran dan Nama Modul')
            return
        }

        // Ensure guruId is set
        const payload = { ...formData, guruId: teacherId }

        if (editingId) {
            await update(editingId, payload)
        } else {
            await create(payload as any)
        }

        setShowForm(false)
        refetch()
    }

    const handleDelete = async (id: string) => {
        if (confirm('Hapus modul ajar ini?')) {
            await remove(id)
            refetch()
        }
    }

    const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    // Array field helpers
    const addArrayItem = (key: keyof FormData, item: any) => {
        const current = formData[key] as any[] || []
        updateField(key, [...current, item] as any)
    }

    const removeArrayItem = (key: keyof FormData, index: number) => {
        const current = formData[key] as any[] || []
        updateField(key, current.filter((_, i) => i !== index) as any)
    }

    // Filter locally if needed, mainly by CP and Status
    const filteredModules = modulAjarList.filter(m => {
        if (filterStatus && m.status !== filterStatus) return false
        return true
    })

    if (teacherLoading) {
        return <div className="flex justify-center py-12"><LoadingSpinner /></div>
    }

    if (!teacherId) {
        return <div className="text-center py-12 text-red-500">Gagal memuat data guru. Silakan refresh.</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Daftar Modul Ajar</h2>
                    <p className="text-sm text-gray-500">Kelola modul pembelajaran Anda</p>
                </div>
                <button
                    onClick={() => handleOpenForm()}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                    <Plus size={18} />
                    Buat Modul Ajar
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 flex-wrap">
                <select
                    value={filterCp}
                    onChange={(e) => setFilterCp(e.target.value)}
                    className="px-3 py-2 border border-border-color rounded-lg dark:bg-gray-700 dark:border-gray-600 appearance-none bg-white min-w-[200px]"
                >
                    <option value="">Semua Mata Pelajaran (CP)</option>
                    {cpList.map(cp => (
                        <option key={cp.id} value={cp.id}>{cp.mataPelajaran?.name} - {cp.kodeCP}</option>
                    ))}
                </select>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-border-color rounded-lg dark:bg-gray-700 dark:border-gray-600 bg-white"
                >
                    <option value="">Semua Status</option>
                    <option value="DRAFT">Draft</option>
                    <option value="ACTIVE">Aktif</option>
                    <option value="ARCHIVED">Arsip</option>
                </select>
            </div>

            {/* Module List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredModules.map((modul) => (
                    <div key={modul.id} className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                <FileText size={20} />
                            </div>
                            <StatusBadge
                                status={modul.status === 'ACTIVE' ? 'active' : modul.status === 'DRAFT' ? 'pending' : 'inactive'}
                                label={modul.status}
                            />
                        </div>
                        <h4 className="font-semibold text-text-main dark:text-white mb-1 line-clamp-2">{modul.namaModul}</h4>
                        <p className="text-sm text-text-secondary mb-2 line-clamp-1">
                            {modul.cp?.mataPelajaran?.name} • Fase {modul.fase}
                        </p>
                        <p className="text-xs text-text-secondary mb-3">
                            Kelas {modul.kelas} • {modul.alokasiWaktuJam} JP
                        </p>
                        <div className="flex items-center justify-end pt-3 border-t border-border-color dark:border-gray-700 gap-2">
                            <button
                                onClick={() => handleOpenForm(modul)}
                                className="flex items-center gap-1 text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                            >
                                <Edit2 size={14} /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(modul.id)}
                                className="flex items-center gap-1 text-xs font-medium px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                            >
                                <Trash2 size={14} /> Hapus
                            </button>
                        </div>
                    </div>
                ))}

                {filteredModules.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                        <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Belum ada modul ajar.</p>
                    </div>
                )}
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border-color dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                            <div>
                                <h3 className="text-lg font-bold text-text-main dark:text-white">
                                    {editingId ? 'Edit Modul Ajar' : 'Buat Modul Ajar Baru'}
                                </h3>
                                <p className="text-xs text-gray-500">Lengkapi informasi modul ajar.</p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>

                        {/* Step Indicators */}
                        <div className="flex border-b border-border-color dark:border-gray-700 overflow-x-auto bg-white dark:bg-gray-800 scrollbar-hide">
                            {STEPS.map((step, idx) => (
                                <button
                                    key={step.id}
                                    onClick={() => setCurrentStep(idx)}
                                    className={`flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap transition-colors border-b-2 ${idx === currentStep
                                        ? 'border-primary text-primary bg-primary/5'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <span>{step.icon}</span>
                                    <span>{step.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Form Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white dark:bg-gray-800">
                            {currentStep === 0 && (
                                <StepInfoUmum
                                    formData={formData}
                                    updateField={updateField}
                                    cpList={cpList}
                                    dimensiList={dimensiList}
                                />
                            )}
                            {currentStep === 1 && (
                                <StepTujuan
                                    formData={formData}
                                    updateField={updateField}
                                    addArrayItem={addArrayItem}
                                    removeArrayItem={removeArrayItem}
                                />
                            )}
                            {currentStep === 2 && (
                                <StepKegiatan
                                    formData={formData}
                                    updateField={updateField}
                                    addArrayItem={addArrayItem}
                                    removeArrayItem={removeArrayItem}
                                />
                            )}
                            {currentStep === 3 && (
                                <StepAsesmen formData={formData} updateField={updateField} />
                            )}
                            {currentStep === 4 && (
                                <StepLampiran
                                    formData={formData}
                                    updateField={updateField}
                                    addArrayItem={addArrayItem}
                                    removeArrayItem={removeArrayItem}
                                />
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between p-4 border-t border-border-color dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                            <button
                                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                                disabled={currentStep === 0}
                                className="flex items-center gap-1 px-4 py-2 text-gray-600 disabled:opacity-50 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <ChevronLeft size={18} /> Sebelumnya
                            </button>
                            <div className="flex gap-2">
                                <select
                                    value={formData.status}
                                    onChange={(e) => updateField('status', e.target.value as any)}
                                    className="px-3 py-2 border border-border-color rounded-lg text-sm bg-white"
                                >
                                    <option value="DRAFT">Draft</option>
                                    <option value="ACTIVE">Aktif</option>
                                    <option value="ARCHIVED">Arsip</option>
                                </select>
                                {currentStep < STEPS.length - 1 ? (
                                    <button
                                        onClick={() => setCurrentStep(currentStep + 1)}
                                        className="flex items-center gap-1 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm transition-colors shadow-sm"
                                    >
                                        Selanjutnya <ChevronRight size={18} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        className="flex items-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition-colors shadow-sm"
                                    >
                                        <Save size={18} /> Simpan Modul
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Step 1: Info Umum
function StepInfoUmum({ formData, updateField, cpList, dimensiList }: any) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Nama Modul *</label>
                    <input
                        required
                        value={formData.namaModul}
                        onChange={(e) => updateField('namaModul', e.target.value)}
                        placeholder="Contoh: Aljabar Linear - Persamaan Kuadrat"
                        className="w-full px-3 py-2 border border-border-color rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Capaian Pembelajaran (CP) *</label>
                    <select
                        required
                        value={formData.cpId || ''}
                        onChange={(e) => updateField('cpId', e.target.value)}
                        className="w-full px-3 py-2 border border-border-color rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    >
                        <option value="">Pilih CP</option>
                        {cpList.map((cp: any) => (
                            <option key={cp.id} value={cp.id}>{cp.kodeCP} - {cp.mataPelajaran?.name}</option>
                        ))}
                    </select>
                </div>

                {/* Guru Selection Removed - Auto-assigned */}

                <div>
                    <label className="block text-sm font-medium mb-1">Fase</label>
                    <select
                        value={formData.fase}
                        onChange={(e) => updateField('fase', e.target.value)}
                        className="w-full px-3 py-2 border border-border-color rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    >
                        {faseOptions.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Kelas</label>
                    <input
                        type="number"
                        min="1"
                        max="12"
                        value={formData.kelas}
                        onChange={(e) => updateField('kelas', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-border-color rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Model Pembelajaran</label>
                    <select
                        value={formData.modelPembelajaran}
                        onChange={(e) => updateField('modelPembelajaran', e.target.value)}
                        className="w-full px-3 py-2 border border-border-color rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    >
                        {modelOptions.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Alokasi Waktu (JP)</label>
                    <input
                        type="number"
                        min="1"
                        value={formData.alokasiWaktuJam}
                        onChange={(e) => updateField('alokasiWaktuJam', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-border-color rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Profil Pelajar Pancasila</label>
                <div className="flex flex-wrap gap-2">
                    {dimensiList.map((d: any) => (
                        <label key={d.kode} className="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                            <input
                                type="checkbox"
                                checked={formData.profilPelajarPancasila?.includes(d.kode)}
                                onChange={(e) => {
                                    const current = formData.profilPelajarPancasila || []
                                    if (e.target.checked) {
                                        updateField('profilPelajarPancasila', [...current, d.kode])
                                    } else {
                                        updateField('profilPelajarPancasila', current.filter((k: string) => k !== d.kode))
                                    }
                                }}
                            />
                            <span className="text-sm">{d.kode} - {d.namaDimensi.split(',')[0]}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Deskripsi Umum</label>
                <textarea
                    rows={3}
                    value={formData.deskripsiUmum || ''}
                    onChange={(e) => updateField('deskripsiUmum', e.target.value)}
                    placeholder="Gambaran singkat tentang modul ajar ini..."
                    className="w-full px-3 py-2 border border-border-color rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
            </div>
        </div>
    )
}

// Step 2: CP & Tujuan (Simplified for brevity, similar to original)
function StepTujuan({ formData, updateField, addArrayItem, removeArrayItem }: any) {
    const [newTP, setNewTP] = useState({ kode: '', deskripsi: '' })

    const addTujuan = () => {
        if (newTP.kode && newTP.deskripsi) {
            addArrayItem('tujuanPembelajaran', newTP)
            setNewTP({ kode: '', deskripsi: '' })
        }
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-2">Tujuan Pembelajaran</label>
                <div className="flex gap-2 mb-2">
                    <input
                        value={newTP.kode}
                        onChange={(e) => setNewTP({ ...newTP, kode: e.target.value })}
                        placeholder="Kode (TP-1)"
                        className="w-24 px-3 py-2 border border-border-color rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    />
                    <input
                        value={newTP.deskripsi}
                        onChange={(e) => setNewTP({ ...newTP, deskripsi: e.target.value })}
                        placeholder="Deskripsi tujuan..."
                        className="flex-1 px-3 py-2 border border-border-color rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    />
                    <button onClick={addTujuan} className="px-4 py-2 bg-primary text-white rounded-lg"><Plus size={18} /></button>
                </div>
                <div className="space-y-2">
                    {(formData.tujuanPembelajaran || []).map((tp: TujuanPembelajaran, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm font-medium">{tp.kode}</span>
                            <p className="flex-1 text-sm">{tp.deskripsi}</p>
                            <button onClick={() => removeArrayItem('tujuanPembelajaran', idx)} className="text-red-500"><Trash2 size={16} /></button>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Alur Tujuan Pembelajaran (ATP)</label>
                <textarea
                    rows={4}
                    value={formData.alurTujuanPembelajaran || ''}
                    onChange={(e) => updateField('alurTujuanPembelajaran', e.target.value)}
                    placeholder="Rangkaian tujuan pembelajaran..."
                    className="w-full px-3 py-2 border border-border-color rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
            </div>
        </div>
    )
}

// Step 3: Kegiatan (Simplified)
function StepKegiatan({ formData, updateField, addArrayItem, removeArrayItem }: any) {
    // helpers consistent with original ...
    const addPertemuan = () => {
        const next = (formData.kegiatanPembelajaran?.length || 0) + 1
        addArrayItem('kegiatanPembelajaran', {
            pertemuan: next,
            durasiMenit: 90,
            pembuka: '',
            inti: '',
            penutup: ''
        })
    }

    const updatePertemuan = (idx: number, field: string, value: any) => {
        const updated = [...(formData.kegiatanPembelajaran || [])]
        updated[idx] = { ...updated[idx], [field]: value }
        updateField('kegiatanPembelajaran', updated)
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Jumlah Pertemuan</label>
                <input type="number" value={formData.jumlahPertemuan} onChange={(e) => updateField('jumlahPertemuan', parseInt(e.target.value))} className="w-32 px-3 py-2 border rounded-lg" />
            </div>
            {/* Same implementation as original */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Kegiatan Pembelajaran</label>
                    <button onClick={addPertemuan} className="text-sm text-primary flex items-center gap-1"><Plus size={14} /> Tambah</button>
                </div>
                <div className="space-y-4">
                    {(formData.kegiatanPembelajaran || []).map((kg: KegiatanPembelajaran, idx: number) => (
                        <div key={idx} className="p-4 border border-border-color rounded-lg space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium">Pertemuan {kg.pertemuan}</h4>
                                <button onClick={() => removeArrayItem('kegiatanPembelajaran', idx)} className="text-red-500"><Trash2 size={16} /></button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs mb-1">Pembuka</label>
                                    <textarea rows={3} value={kg.pembuka} onChange={(e) => updatePertemuan(idx, 'pembuka', e.target.value)} className="w-full text-sm border rounded" />
                                </div>
                                <div>
                                    <label className="block text-xs mb-1">Inti</label>
                                    <textarea rows={3} value={kg.inti} onChange={(e) => updatePertemuan(idx, 'inti', e.target.value)} className="w-full text-sm border rounded" />
                                </div>
                                <div>
                                    <label className="block text-xs mb-1">Penutup</label>
                                    <textarea rows={3} value={kg.penutup} onChange={(e) => updatePertemuan(idx, 'penutup', e.target.value)} className="w-full text-sm border rounded" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// Step 4: Asesmen (Simplified)
function StepAsesmen({ formData, updateField }: any) {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Asesmen Formatif (Wajib)</label>
                <textarea
                    rows={3}
                    value={formData.rencanaAsesmen?.formatif || ''}
                    onChange={(e) => updateField('rencanaAsesmen', { ...formData.rencanaAsesmen, formatif: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Contoh: Observasi, Kuis, Diskusi"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Asesmen Sumatif</label>
                <textarea
                    rows={3}
                    value={formData.rencanaAsesmen?.sumatif || ''}
                    onChange={(e) => updateField('rencanaAsesmen', { ...formData.rencanaAsesmen, sumatif: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Contoh: Tes Tulis, Projek"
                />
            </div>
        </div>
    )
}

// Step 5: Lampiran (Simplified)
function StepLampiran({ formData, addArrayItem, removeArrayItem }: any) {
    const [newRef, setNewRef] = useState('')
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-2">Daftar Pustaka</label>
                <div className="flex gap-2 mb-2">
                    <input value={newRef} onChange={(e) => setNewRef(e.target.value)} className="flex-1 px-3 py-2 border rounded-lg" placeholder="Tambah referensi..." />
                    <button onClick={() => { if (newRef) { addArrayItem('daftarPustaka', newRef); setNewRef('') } }} className="px-4 py-2 bg-primary text-white rounded-lg"><Plus size={18} /></button>
                </div>
                <ul className="space-y-1">
                    {(formData.daftarPustaka || []).map((ref: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                            <span>• {ref}</span>
                            <button onClick={() => removeArrayItem('daftarPustaka', idx)} className="text-red-500"><X size={14} /></button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
