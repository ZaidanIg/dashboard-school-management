import { useState, useEffect } from 'react'
import { Settings, Save, School, Bell, Loader2 } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useSchoolProfile, useSystemConfig } from '@/hooks/useSettings'
import { useToast } from '@/contexts/ToastContext'

export default function SystemConfig() {
    const { school, loading: schoolLoading, updateSchool } = useSchoolProfile()
    const { config, loading: configLoading, updateConfig } = useSystemConfig()
    const { addToast } = useToast()

    const [saving, setSaving] = useState(false)

    // School Form State
    const [schoolForm, setSchoolForm] = useState({
        name: '',
        npsn: '',
        status: 'NEGERI',
        educationType: 'SMA',
        accreditation: 'A',
        accreditationYear: 2023,
        address: '',
        city: 'Tanjungsari',
        province: 'Jawa Barat',
        phone: '',
        email: '',
        website: '',
        vision: '',
    })

    // System Settings Form State
    const [settingsForm, setSettingsForm] = useState({
        timezone: 'Asia/Jakarta',
        language: 'id',
        academicSemester: '1',
        emailNotification: true,
        whatsappNotification: true,
        sppReminder: true,
        attendanceNotification: false,
    })

    useEffect(() => {
        if (school) {
            setSchoolForm({
                name: school.name || '',
                npsn: school.npsn || '',
                status: (school.status as string) || 'NEGERI',
                educationType: (school.educationType as string) || 'SMA',
                accreditation: school.accreditation || 'A',
                accreditationYear: school.accreditationYear || 2023,
                address: school.address || '',
                city: school.city || 'Tanjungsari',
                province: school.province || 'Jawa Barat',
                phone: school.phone || '',
                email: school.email || '',
                website: school.website || '',
                vision: school.vision || '',
            })
        }
    }, [school])

    useEffect(() => {
        if (config) {
            setSettingsForm(prev => ({
                ...prev,
                timezone: config.timezone || prev.timezone,
                language: config.language || prev.language,
                academicSemester: config.academicSemester || prev.academicSemester,
                emailNotification: config.emailNotification ? config.emailNotification === 'true' : prev.emailNotification,
                whatsappNotification: config.whatsappNotification ? config.whatsappNotification === 'true' : prev.whatsappNotification,
                sppReminder: config.sppReminder ? config.sppReminder === 'true' : prev.sppReminder,
                attendanceNotification: config.attendanceNotification ? config.attendanceNotification === 'true' : prev.attendanceNotification,
            }))
        }
    }, [config])

    const handleSave = async () => {
        setSaving(true)
        try {
            // Update School Info
            const schoolRes = await updateSchool({
                ...schoolForm,
                accreditationYear: Number(schoolForm.accreditationYear)
            } as any)

            // Update System Config
            const configPayload = {
                timezone: settingsForm.timezone,
                language: settingsForm.language,
                academicSemester: settingsForm.academicSemester,
                emailNotification: String(settingsForm.emailNotification),
                whatsappNotification: String(settingsForm.whatsappNotification),
                sppReminder: String(settingsForm.sppReminder),
                attendanceNotification: String(settingsForm.attendanceNotification),
            }
            const configRes = await updateConfig(configPayload)

            if (schoolRes !== null || configRes) {
                addToast('success', 'Konfigurasi sekolah dan sistem berhasil disimpan!')
            } else {
                addToast('error', 'Gagal menyimpan konfigurasi')
            }
        } catch (error) {
            console.error('Failed to save config:', error)
            addToast('error', 'Terjadi kesalahan saat menyimpan data')
        } finally {
            setSaving(false)
        }
    }

    if (schoolLoading || configLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Konfigurasi Sistem & Sekolah"
                subtitle="Kelola identitas resmi sekolah, kalender operasional, dan parameter sistem"
                breadcrumb={[
                    { label: 'Pengaturan', path: '/settings' },
                    { label: 'Konfigurasi Sistem' },
                ]}
                actions={
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {saving ? 'Menyimpan...' : 'Simpan Seluruh Perubahan'}
                    </button>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* School Information */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-border-color dark:border-gray-700 p-6 shadow-sm space-y-5">
                    <div className="flex items-center gap-2 pb-3 border-b border-border-color dark:border-gray-700">
                        <School size={22} className="text-primary" />
                        <div>
                            <h3 className="font-bold text-text-main dark:text-white text-base">Identitas Resmi Sekolah</h3>
                            <p className="text-xs text-text-secondary">Data referensi untuk kop surat, rapor, dan dokumen resmi</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-text-main dark:text-gray-300 mb-1">
                                Nama Resmi Lembaga Sekolah *
                            </label>
                            <input
                                type="text"
                                value={schoolForm.name}
                                onChange={e => setSchoolForm({ ...schoolForm, name: e.target.value })}
                                placeholder="Contoh: SMAS YKM Tanjungsari"
                                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-text-main dark:text-gray-300 mb-1">
                                    NPSN (Nomor Pokok Sekolah)
                                </label>
                                <input
                                    type="text"
                                    value={schoolForm.npsn}
                                    onChange={e => setSchoolForm({ ...schoolForm, npsn: e.target.value })}
                                    placeholder="Contoh: 20100001"
                                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-text-main dark:text-gray-300 mb-1">
                                    Jenjang Pendidikan
                                </label>
                                <select
                                    value={schoolForm.educationType}
                                    onChange={e => setSchoolForm({ ...schoolForm, educationType: e.target.value })}
                                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                >
                                    <option value="SMA">SMA (Sekolah Menengah Atas)</option>
                                    <option value="SMK">SMK (Sekolah Menengah Kejuruan)</option>
                                    <option value="SMP">SMP (Sekolah Menengah Pertama)</option>
                                    <option value="SD">SD (Sekolah Dasar)</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-text-main dark:text-gray-300 mb-1">
                                    Status
                                </label>
                                <select
                                    value={schoolForm.status}
                                    onChange={e => setSchoolForm({ ...schoolForm, status: e.target.value })}
                                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                >
                                    <option value="NEGERI">Negeri</option>
                                    <option value="SWASTA">Swasta</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-text-main dark:text-gray-300 mb-1">
                                    Akreditasi
                                </label>
                                <select
                                    value={schoolForm.accreditation}
                                    onChange={e => setSchoolForm({ ...schoolForm, accreditation: e.target.value })}
                                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                >
                                    <option value="A">A (Unggul)</option>
                                    <option value="B">B (Baik)</option>
                                    <option value="C">C (Cukup)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-text-main dark:text-gray-300 mb-1">
                                    Tahun Akreditasi
                                </label>
                                <input
                                    type="number"
                                    value={schoolForm.accreditationYear}
                                    onChange={e => setSchoolForm({ ...schoolForm, accreditationYear: Number(e.target.value) })}
                                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-text-main dark:text-gray-300 mb-1">
                                Alamat Lengkap
                            </label>
                            <textarea
                                value={schoolForm.address}
                                onChange={e => setSchoolForm({ ...schoolForm, address: e.target.value })}
                                placeholder="Jalan, kelurahan, kecamatan..."
                                rows={2}
                                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-text-main dark:text-gray-300 mb-1">
                                    Kota / Kabupaten
                                </label>
                                <input
                                    type="text"
                                    value={schoolForm.city}
                                    onChange={e => setSchoolForm({ ...schoolForm, city: e.target.value })}
                                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-text-main dark:text-gray-300 mb-1">
                                    Provinsi
                                </label>
                                <input
                                    type="text"
                                    value={schoolForm.province}
                                    onChange={e => setSchoolForm({ ...schoolForm, province: e.target.value })}
                                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-text-main dark:text-gray-300 mb-1">
                                    Telepon Kantor
                                </label>
                                <input
                                    type="text"
                                    value={schoolForm.phone}
                                    onChange={e => setSchoolForm({ ...schoolForm, phone: e.target.value })}
                                    placeholder="(022) 123-4567"
                                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-text-main dark:text-gray-300 mb-1">
                                    Email Resmi
                                </label>
                                <input
                                    type="email"
                                    value={schoolForm.email}
                                    onChange={e => setSchoolForm({ ...schoolForm, email: e.target.value })}
                                    placeholder="info@sekolah.sch.id"
                                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-text-main dark:text-gray-300 mb-1">
                                Visi Sekolah
                            </label>
                            <input
                                type="text"
                                value={schoolForm.vision}
                                onChange={e => setSchoolForm({ ...schoolForm, vision: e.target.value })}
                                placeholder="Visi sekolah..."
                                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* System & Notification Settings */}
                <div className="space-y-6">
                    {/* System Parameters */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-border-color dark:border-gray-700 p-6 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-border-color dark:border-gray-700">
                            <Settings size={22} className="text-primary" />
                            <div>
                                <h3 className="font-bold text-text-main dark:text-white text-base">Parameter Operasional</h3>
                                <p className="text-xs text-text-secondary">Waktu, bahasa, dan periode semester aktif</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-text-main dark:text-gray-300 mb-1">
                                    Zona Waktu
                                </label>
                                <select
                                    value={settingsForm.timezone}
                                    onChange={e => setSettingsForm({ ...settingsForm, timezone: e.target.value })}
                                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                >
                                    <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                                    <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                                    <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-text-main dark:text-gray-300 mb-1">
                                    Bahasa Antarmuka
                                </label>
                                <select
                                    value={settingsForm.language}
                                    onChange={e => setSettingsForm({ ...settingsForm, language: e.target.value })}
                                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                >
                                    <option value="id">Bahasa Indonesia</option>
                                    <option value="en">English</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-text-main dark:text-gray-300 mb-1">
                                Semester Berjalan
                            </label>
                            <select
                                value={settingsForm.academicSemester}
                                onChange={e => setSettingsForm({ ...settingsForm, academicSemester: e.target.value })}
                                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                            >
                                <option value="1">Semester 1 (Ganjil)</option>
                                <option value="2">Semester 2 (Genap)</option>
                            </select>
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-border-color dark:border-gray-700 p-6 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-border-color dark:border-gray-700">
                            <Bell size={22} className="text-primary" />
                            <div>
                                <h3 className="font-bold text-text-main dark:text-white text-base">Saluran Notifikasi Otomatis</h3>
                                <p className="text-xs text-text-secondary">Pemicu pesan gateway ke wali murid & guru</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-border-color">
                                <div>
                                    <p className="text-sm font-semibold text-text-main dark:text-white">Notifikasi Email</p>
                                    <p className="text-xs text-text-secondary">Kirim pengumuman penting & laporan ke email siswa/guru</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settingsForm.emailNotification}
                                    onChange={e => setSettingsForm({ ...settingsForm, emailNotification: e.target.checked })}
                                    className="w-5 h-5 rounded text-primary accent-primary"
                                />
                            </label>

                            <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-border-color">
                                <div>
                                    <p className="text-sm font-semibold text-text-main dark:text-white">WhatsApp Gateway Blast</p>
                                    <p className="text-xs text-text-secondary">Integrasi pesan instan WhatsApp pengingat kegiatan</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settingsForm.whatsappNotification}
                                    onChange={e => setSettingsForm({ ...settingsForm, whatsappNotification: e.target.checked })}
                                    className="w-5 h-5 rounded text-primary accent-primary"
                                />
                            </label>

                            <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-border-color">
                                <div>
                                    <p className="text-sm font-semibold text-text-main dark:text-white">Pengingat Tagihan SPP</p>
                                    <p className="text-xs text-text-secondary">Otomatis kirim pengingat tagihan sebelum jatuh tempo tanggal 10</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settingsForm.sppReminder}
                                    onChange={e => setSettingsForm({ ...settingsForm, sppReminder: e.target.checked })}
                                    className="w-5 h-5 rounded text-primary accent-primary"
                                />
                            </label>

                            <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-border-color">
                                <div>
                                    <p className="text-sm font-semibold text-text-main dark:text-white">Alert Presensi Siswa</p>
                                    <p className="text-xs text-text-secondary">Kirim peringatan otomatis jika siswa alpha tanpa keterangan</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settingsForm.attendanceNotification}
                                    onChange={e => setSettingsForm({ ...settingsForm, attendanceNotification: e.target.checked })}
                                    className="w-5 h-5 rounded text-primary accent-primary"
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
