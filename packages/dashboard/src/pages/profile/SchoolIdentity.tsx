import { useState, useEffect } from 'react'
import { School, MapPin, Phone, Mail, Globe, Calendar, Award, Save, Loader2, Navigation } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import { api } from '@/lib/api'
import { useToast } from '@/contexts/ToastContext'

interface SchoolData {
    id: string | null
    name: string
    address: string
    phone: string
    email: string
    website: string
    latitude: number | null
    longitude: number | null
}

export default function SchoolIdentity() {
    const { addToast } = useToast()
    const [school, setSchool] = useState<SchoolData | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [formData, setFormData] = useState<SchoolData>({
        id: null,
        name: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        latitude: null,
        longitude: null
    })

    useEffect(() => {
        const fetchSchool = async () => {
            try {
                const res = await api.get<SchoolData>('/api/settings/school')
                setSchool(res)
                setFormData(res)
            } catch (error) {
                console.error('Failed to fetch school profile', error)
            } finally {
                setLoading(false)
            }
        }
        fetchSchool()
    }, [])

    const handleChange = (field: keyof SchoolData, value: string | number | null) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const [gettingLocation, setGettingLocation] = useState(false)

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            addToast('error', 'Geolocation tidak didukung browser anda. Silakan input koordinat manual.')
            return
        }

        setGettingLocation(true)
        addToast('info', 'Mengambil lokasi...')

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData(prev => ({
                    ...prev,
                    latitude: Math.round(position.coords.latitude * 1000000) / 1000000,
                    longitude: Math.round(position.coords.longitude * 1000000) / 1000000
                }))
                addToast('success', `Lokasi berhasil didapatkan: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`)
                setGettingLocation(false)
            },
            (error) => {
                setGettingLocation(false)
                let msg = 'Gagal mendapatkan lokasi. '
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        msg += 'Izin lokasi ditolak. Pastikan anda mengizinkan akses lokasi di browser.'
                        break
                    case error.POSITION_UNAVAILABLE:
                        msg += 'Lokasi tidak tersedia. Coba gunakan browser lain atau input manual.'
                        break
                    case error.TIMEOUT:
                        msg += 'Waktu permintaan habis. Coba lagi.'
                        break
                    default:
                        msg += 'Silakan input koordinat secara manual.'
                }
                addToast('error', msg)
                console.error('Geolocation error:', error)
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }
        )
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await api.put<SchoolData>('/api/settings/school', formData)
            setSchool(res)
            setFormData(res)
            setEditMode(false)
            addToast('success', 'Profil sekolah berhasil disimpan')
        } catch (error: any) {
            addToast('error', error.message || 'Gagal menyimpan profil sekolah')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Identitas Sekolah"
                subtitle="Informasi dasar dan profil sekolah"
                breadcrumb={[
                    { label: 'Profil Sekolah', path: '/profile' },
                    { label: 'Identitas Sekolah' },
                ]}
                actions={
                    editMode ? (
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setEditMode(false)
                                    setFormData(school || formData)
                                }}
                                className="px-4 py-2 border border-border-color dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                Simpan
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setEditMode(true)}
                            className="px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Edit Profil
                        </button>
                    )
                }
            />

            {/* School Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary to-blue-400 rounded-2xl flex items-center justify-center text-white shrink-0">
                        <School size={48} />
                    </div>
                    <div className="flex-1">
                        {editMode ? (
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="Nama Sekolah"
                                className="w-full text-2xl font-bold text-text-main dark:text-white mb-2 bg-transparent border-b border-border-color dark:border-gray-600 focus:border-primary focus:outline-none pb-1"
                            />
                        ) : (
                            <h2 className="text-2xl font-bold text-text-main dark:text-white mb-2">
                                {school?.name || 'Nama Sekolah Belum Diatur'}
                            </h2>
                        )}
                        <div className="flex flex-wrap gap-3">
                            <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium">
                                Terakreditasi A
                            </span>
                            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                                Kurikulum Merdeka
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact Info */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                    <h3 className="flex items-center gap-2 font-semibold text-text-main dark:text-white mb-4">
                        <Phone size={20} className="text-primary" /> Kontak
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <MapPin size={20} className="text-text-secondary mt-0.5" />
                            <div className="flex-1">
                                <p className="font-medium text-text-main dark:text-white">Alamat</p>
                                {editMode ? (
                                    <textarea
                                        value={formData.address}
                                        onChange={(e) => handleChange('address', e.target.value)}
                                        placeholder="Alamat lengkap sekolah"
                                        rows={2}
                                        className="w-full text-sm mt-1 p-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none"
                                    />
                                ) : (
                                    <p className="text-text-secondary text-sm">{school?.address || '-'}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone size={20} className="text-text-secondary mt-0.5" />
                            <div className="flex-1">
                                <p className="font-medium text-text-main dark:text-white">Telepon</p>
                                {editMode ? (
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        placeholder="Nomor telepon"
                                        className="w-full text-sm mt-1 p-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none"
                                    />
                                ) : (
                                    <p className="text-text-secondary text-sm">{school?.phone || '-'}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Mail size={20} className="text-text-secondary mt-0.5" />
                            <div className="flex-1">
                                <p className="font-medium text-text-main dark:text-white">Email</p>
                                {editMode ? (
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        placeholder="Email sekolah"
                                        className="w-full text-sm mt-1 p-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none"
                                    />
                                ) : (
                                    <p className="text-text-secondary text-sm">{school?.email || '-'}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Globe size={20} className="text-text-secondary mt-0.5" />
                            <div className="flex-1">
                                <p className="font-medium text-text-main dark:text-white">Website</p>
                                {editMode ? (
                                    <input
                                        type="text"
                                        value={formData.website}
                                        onChange={(e) => handleChange('website', e.target.value)}
                                        placeholder="Website sekolah"
                                        className="w-full text-sm mt-1 p-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none"
                                    />
                                ) : (
                                    <p className="text-primary text-sm">{school?.website || '-'}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                    <h3 className="flex items-center gap-2 font-semibold text-text-main dark:text-white mb-4">
                        <Navigation size={20} className="text-primary" /> Lokasi Sekolah (Untuk Presensi)
                    </h3>

                    {/* Rules/Instructions */}
                    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">📍 Panduan Pengaturan Lokasi:</h4>
                        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-2">
                            <li className="flex gap-2">
                                <span>1.</span>
                                <span>Koordinat ini digunakan untuk validasi lokasi saat siswa melakukan presensi.</span>
                            </li>
                            <li className="flex gap-2">
                                <span>2.</span>
                                <span>Siswa harus berada dalam <strong className="text-blue-900 dark:text-blue-200">radius 200 meter</strong> dari koordinat ini untuk dapat melakukan check-in.</span>
                            </li>
                            <li className="flex gap-2">
                                <span>3.</span>
                                <span>Jika siswa berada di luar radius, sistem akan menolak presensi dengan pesan "Lokasi terlalu jauh dari sekolah".</span>
                            </li>
                            <li className="flex gap-2">
                                <span>4.</span>
                                <span><strong>Cara mendapatkan koordinat:</strong></span>
                            </li>
                            <li className="ml-6 flex gap-2">
                                <span>•</span>
                                <span>Klik tombol "Gunakan Lokasi Saat Ini" jika Anda berada di lokasi sekolah, atau</span>
                            </li>
                            <li className="ml-6 flex gap-2">
                                <span>•</span>
                                <span>Buka <a href="https://maps.google.com" target="_blank" rel="noopener" className="underline">Google Maps</a>, cari sekolah Anda, klik kanan → "What's here?" → salin koordinat yang muncul</span>
                            </li>
                            <li className="flex gap-2">
                                <span>5.</span>
                                <span>Format koordinat: Latitude (misal: -6.208834), Longitude (misal: 106.845599)</span>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-white mb-1">Latitude</label>
                                {editMode ? (
                                    <input
                                        type="number"
                                        step="any"
                                        value={formData.latitude !== null && formData.latitude !== undefined ? formData.latitude : ''}
                                        onChange={(e) => handleChange('latitude', e.target.value ? parseFloat(e.target.value) : null)}
                                        placeholder="-6.2088"
                                        className="w-full text-sm p-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none"
                                    />
                                ) : (
                                    <p className="text-text-secondary">{school?.latitude ?? 'Belum diatur'}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-white mb-1">Longitude</label>
                                {editMode ? (
                                    <input
                                        type="number"
                                        step="any"
                                        value={formData.longitude !== null && formData.longitude !== undefined ? formData.longitude : ''}
                                        onChange={(e) => handleChange('longitude', e.target.value ? parseFloat(e.target.value) : null)}
                                        placeholder="106.8456"
                                        className="w-full text-sm p-2 bg-slate-50 dark:bg-gray-700 border border-border-color dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none"
                                    />
                                ) : (
                                    <p className="text-text-secondary">{school?.longitude ?? 'Belum diatur'}</p>
                                )}
                            </div>
                        </div>
                        {editMode && (
                            <div className="space-y-2">
                                <button
                                    type="button"
                                    onClick={handleGetCurrentLocation}
                                    disabled={gettingLocation}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    {gettingLocation ? (
                                        <>
                                            <Loader2 className="animate-spin" size={16} />
                                            Mengambil lokasi...
                                        </>
                                    ) : (
                                        <>
                                            <Navigation size={16} />
                                            Gunakan Lokasi Saat Ini
                                        </>
                                    )}
                                </button>
                                <p className="text-xs text-text-secondary">
                                    💡 Jika tombol tidak berfungsi, Anda dapat mencari koordinat sekolah di Google Maps,
                                    lalu salin dan tempel ke field Latitude dan Longitude di atas.
                                </p>
                            </div>
                        )}
                        {!editMode && school?.latitude && school?.longitude && (
                            <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                <p className="text-emerald-700 dark:text-emerald-400 text-sm font-medium">
                                    ✓ Lokasi presensi telah dikonfigurasi
                                </p>
                                <p className="text-emerald-600 dark:text-emerald-500 text-xs mt-1">
                                    Siswa harus berada dalam radius 200m dari koordinat ini untuk melakukan presensi
                                </p>
                            </div>
                        )}
                        {!editMode && (!school?.latitude || !school?.longitude) && (
                            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                <p className="text-amber-700 dark:text-amber-400 text-sm font-medium">
                                    ⚠ Lokasi presensi belum dikonfigurasi
                                </p>
                                <p className="text-amber-600 dark:text-amber-500 text-xs mt-1">
                                    Klik "Edit Profil" untuk mengatur koordinat sekolah
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
                    <p className="text-3xl font-bold">1,250</p>
                    <p className="text-blue-100 text-sm">Total Siswa</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white">
                    <p className="text-3xl font-bold">86</p>
                    <p className="text-emerald-100 text-sm">Guru & Staff</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
                    <p className="text-3xl font-bold">36</p>
                    <p className="text-purple-100 text-sm">Ruang Kelas</p>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white">
                    <p className="text-3xl font-bold">150+</p>
                    <p className="text-amber-100 text-sm">Prestasi</p>
                </div>
            </div>
        </div>
    )
}
