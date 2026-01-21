import { useState, useEffect, useRef } from 'react'
import { Camera, MapPin, CalendarCheck, History, Loader2, X, AlertTriangle, FileText, Plus, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import StatusBadge from '@/components/common/StatusBadge'
import { useToast } from '@/contexts/ToastContext'
import { api } from '@/lib/api'

interface AttendanceRecord {
    id: string
    date: string
    status: 'PRESENT' | 'SICK' | 'PERMITTED' | 'ABSENT' | 'LATE'
    checkInTime?: string
    checkOutTime?: string
    photoUrl?: string
}

interface PermitRecord {
    id: string
    type: 'SICK' | 'FAMILY' | 'OFFICIAL' | 'OTHER'
    startDate: string
    endDate: string
    reason: string
    document?: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
    createdAt: string
}

const permitTypeLabels: Record<string, string> = {
    'SICK': 'Sakit',
    'FAMILY': 'Keperluan Keluarga',
    'OFFICIAL': 'Tugas Resmi',
    'OTHER': 'Lainnya'
}

const permitStatusLabels: Record<string, string> = {
    'PENDING': 'Menunggu',
    'APPROVED': 'Disetujui',
    'REJECTED': 'Ditolak'
}

export default function TeacherAttendance() {
    const { addToast } = useToast()
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    // Tabs State
    const [activeTab, setActiveTab] = useState<'attendance' | 'permit'>('attendance')

    // Attendance State
    const [isCheckedIn, setIsCheckedIn] = useState(false)
    const [loading, setLoading] = useState(false)
    const [checkingToday, setCheckingToday] = useState(true)
    const [history, setHistory] = useState<AttendanceRecord[]>([])
    const [historyLoading, setHistoryLoading] = useState(true)

    // Camera State
    const [showCamera, setShowCamera] = useState(false)
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
    const [capturedPhoto, setCapturedPhoto] = useState<Blob | null>(null)
    const [photoPreview, setPhotoPreview] = useState<string | null>(null)

    // Location State
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
    const [locationError, setLocationError] = useState<string | null>(null)
    const [gettingLocation, setGettingLocation] = useState(false)

    // Permit State
    const [permits, setPermits] = useState<PermitRecord[]>([])
    const [permitsLoading, setPermitsLoading] = useState(true)
    const [showPermitForm, setShowPermitForm] = useState(false)
    const [submittingPermit, setSubmittingPermit] = useState(false)
    const [permitFormData, setPermitFormData] = useState({
        type: 'SICK' as 'SICK' | 'FAMILY' | 'OFFICIAL' | 'OTHER',
        startDate: '',
        endDate: '',
        reason: '',
        document: null as File | null
    })

    // Check if already checked in today
    useEffect(() => {
        const checkTodayAttendance = async () => {
            try {
                // Use localized date for Jakarta (WIB)
                const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })
                const res = await api.get<AttendanceRecord[]>(`/api/teachers/me/attendance`, {
                    startDate: today,
                    endDate: today
                })
                const records = Array.isArray(res) ? res : (res as any).data || []
                if (records.length > 0) {
                    setIsCheckedIn(records[0].status === 'PRESENT' || records[0].status === 'LATE')
                }
            } catch (error) {
                console.error('Failed to check today attendance', error)
            } finally {
                setCheckingToday(false)
            }
        }
        checkTodayAttendance()
    }, [])

    // Fetch attendance history
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Fetch last 30 days
                const endDate = new Date()
                const startDate = new Date()
                startDate.setDate(startDate.getDate() - 30)

                const res = await api.get<AttendanceRecord[]>(`/api/teachers/me/attendance`, {
                    startDate: startDate.toISOString().split('T')[0],
                    endDate: endDate.toISOString().split('T')[0]
                })
                const records = Array.isArray(res) ? res : (res as any).data || []
                setHistory(records)
            } catch (error) {
                console.error('Failed to fetch attendance history', error)
            } finally {
                setHistoryLoading(false)
            }
        }
        fetchHistory()
    }, [isCheckedIn])

    // Fetch permits
    useEffect(() => {
        if (activeTab === 'permit') {
            const fetchPermits = async () => {
                try {
                    const res = await api.get<PermitRecord[]>('/api/teachers/me/permits')
                    const data = Array.isArray(res) ? res : (res as any).data || []
                    setPermits(data)
                } catch (error) {
                    console.error('Failed to fetch permits', error)
                } finally {
                    setPermitsLoading(false)
                }
            }
            fetchPermits()
        }
    }, [activeTab])

    // Get current location
    const getLocation = () => {
        setGettingLocation(true)
        setLocationError(null)

        if (!navigator.geolocation) {
            setLocationError('Geolocation tidak didukung browser anda.')
            setGettingLocation(false)
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
                setLocationError(null)
                setGettingLocation(false)
            },
            (error) => {
                console.error('Geolocation error:', error)
                setLocationError('Gagal mendapatkan lokasi. Pastikan GPS aktif.')
                setGettingLocation(false)
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        )
    }

    // Start Camera
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 640, height: 480 }
            })
            setCameraStream(stream)
            setShowCamera(true)
        } catch (error) {
            console.error('Camera error:', error)
            addToast('error', 'Gagal mengakses kamera.')
        }
    }

    useEffect(() => {
        if (showCamera && cameraStream && videoRef.current) {
            videoRef.current.srcObject = cameraStream
        }
    }, [showCamera, cameraStream])

    // Capture Photo
    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current
            const canvas = canvasRef.current
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            const ctx = canvas.getContext('2d')
            if (ctx) {
                ctx.drawImage(video, 0, 0)
                canvas.toBlob((blob) => {
                    if (blob) {
                        setCapturedPhoto(blob)
                        setPhotoPreview(URL.createObjectURL(blob))
                        stopCamera()
                    }
                }, 'image/jpeg', 0.8)
            }
        }
    }

    const stopCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop())
            setCameraStream(null)
        }
        setShowCamera(false)
    }

    const resetPhoto = () => {
        setCapturedPhoto(null)
        setPhotoPreview(null)
    }

    // Handle Check-in
    const handleCheckIn = async () => {
        if (!capturedPhoto) {
            addToast('error', 'Mohon ambil foto terlebih dahulu')
            return
        }

        if (!location && !locationError) {
            addToast('warning', 'Mencoba tanpa lokasi...')
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('latitude', (location?.lat ?? 0).toString())
            formData.append('longitude', (location?.lng ?? 0).toString())
            formData.append('photo', capturedPhoto, 'selfie.jpg')

            await api.post('/api/teachers/attendance/self-checkin', formData)

            addToast('success', 'Berhasil melakukan presensi!')
            setIsCheckedIn(true)
            resetPhoto()
            setLocation(null)

            const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })
            const res = await api.get<AttendanceRecord[]>(`/api/teachers/me/attendance`, {
                startDate: today,
                endDate: today
            })
            // Also refresh full history list
            const endDate = new Date()
            const startDate = new Date()
            startDate.setDate(startDate.getDate() - 30)

            const historyRes = await api.get<AttendanceRecord[]>(`/api/teachers/me/attendance`, {
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0]
            })
            setHistory(Array.isArray(historyRes) ? historyRes : (historyRes as any).data || [])

        } catch (error: any) {
            const msg = error?.message || 'Gagal melakukan presensi'
            addToast('error', msg)
        } finally {
            setLoading(false)
        }
    }

    // Handle Permit Form
    const handlePermitChange = (field: string, value: string | File | null) => {
        setPermitFormData(prev => ({ ...prev, [field]: value }))
    }

    const handlePermitSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!permitFormData.startDate || !permitFormData.endDate || !permitFormData.reason) {
            addToast('error', 'Mohon lengkapi data')
            return
        }

        setSubmittingPermit(true)
        try {
            const data = new FormData()
            data.append('type', permitFormData.type)
            data.append('startDate', permitFormData.startDate)
            data.append('endDate', permitFormData.endDate)
            data.append('reason', permitFormData.reason)
            if (permitFormData.document) {
                data.append('document', permitFormData.document)
            }

            await api.post('/api/teachers/me/permits', data)

            addToast('success', 'Permohonan izin berhasil diajukan')
            setShowPermitForm(false)
            setPermitFormData({
                type: 'SICK',
                startDate: '',
                endDate: '',
                reason: '',
                document: null
            })

            const res = await api.get<PermitRecord[]>('/api/teachers/me/permits')
            setPermits(Array.isArray(res) ? res : (res as any).data || [])
        } catch (error: any) {
            addToast('error', error.message || 'Gagal mengajukan izin')
        } finally {
            setSubmittingPermit(false)
        }
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    const formatTime = (timeStr?: string) => {
        if (!timeStr) return '-'
        return new Date(timeStr).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusLabel = (status: string) => {
        const map: Record<string, string> = {
            'PRESENT': 'Hadir',
            'SICK': 'Sakit',
            'PERMITTED': 'Izin',
            'ABSENT': 'Alpha',
            'LATE': 'Terlambat'
        }
        return map[status] || status
    }

    const getStatusBadgeType = (status: string) => {
        const map: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
            'PRESENT': 'success',
            'LATE': 'warning',
            'SICK': 'info',
            'PERMITTED': 'info',
            'ABSENT': 'error'
        }
        return map[status] || 'error'
    }

    return (
        <div className="space-y-6 px-4 md:px-0 pb-20">
            <PageHeader
                title="Presensi & Izin Guru"
                subtitle="Kelola kehadiran dan pengajuan izin"
                breadcrumb={[{ label: 'Presensi' }]}
            />

            {/* Tabs */}
            <div className="flex border-b border-border-color dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('attendance')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'attendance'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-text-secondary hover:text-text-main hover:border-gray-300'
                        }`}
                >
                    <CalendarCheck size={18} />
                    Presensi Harian
                </button>
                <button
                    onClick={() => setActiveTab('permit')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'permit'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-text-secondary hover:text-text-main hover:border-gray-300'
                        }`}
                >
                    <FileText size={18} />
                    Pengajuan Izin
                </button>
            </div>

            {/* Attendance Content */}
            {activeTab === 'attendance' && (
                <div className="space-y-6 animate-in fade-in">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-8 shadow-sm">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-bold text-text-main dark:text-white mb-2">
                                {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </h2>
                            <p className="text-text-secondary dark:text-gray-400">
                                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>

                        <div className="max-w-lg mx-auto">
                            {checkingToday ? (
                                <div className="flex items-center justify-center py-8 text-primary">
                                    <Loader2 className="animate-spin mr-2" /> Memeriksa...
                                </div>
                            ) : isCheckedIn ? (
                                <div className="p-6 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-xl flex flex-col items-center justify-center gap-3">
                                    <CalendarCheck size={48} />
                                    <p className="font-bold text-lg">Anda sudah presensi hari ini</p>
                                </div>
                            ) : showCamera ? (
                                <div className="space-y-4">
                                    <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
                                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                                        <button onClick={stopCamera} className="absolute top-3 right-3 p-2 bg-black/50 rounded-full text-white">
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <button onClick={capturePhoto} className="w-full py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2">
                                        <Camera size={20} /> Ambil Foto
                                    </button>
                                    <canvas ref={canvasRef} className="hidden" />
                                </div>
                            ) : photoPreview ? (
                                <div className="space-y-4">
                                    <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
                                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                        <button onClick={resetPhoto} className="absolute top-3 right-3 p-2 bg-black/50 rounded-full text-white">
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <div className={`p-4 rounded-xl flex items-center gap-3 ${location ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                        {gettingLocation ? <Loader2 className="animate-spin" /> : <MapPin />}
                                        <span>{gettingLocation ? 'Mencari lokasi...' : location ? `Lokasi: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : locationError || 'Lokasi belum terdeteksi'}</span>
                                        {!location && !gettingLocation && <button onClick={getLocation} className="ml-auto underline text-sm">Coba lagi</button>}
                                    </div>

                                    <button onClick={handleCheckIn} disabled={loading} className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold">
                                        {loading ? 'Mengirim...' : 'Kirim Presensi'}
                                    </button>
                                    <button onClick={() => { resetPhoto(); startCamera() }} className="w-full py-3 border rounded-xl">Ambil Ulang</button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <button onClick={() => { getLocation(); startCamera() }} className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-3">
                                        <Camera size={24} /> Mulai Presensi
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* History List */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 overflow-hidden">
                        <div className="p-4 border-b border-border-color dark:border-gray-700 flex items-center gap-2">
                            <History size={18} className="text-primary" />
                            <h3 className="font-semibold text-text-main dark:text-white">Riwayat Kehadiran (30 Hari Terakhir)</h3>
                        </div>
                        {historyLoading ? (
                            <div className="p-8 text-center text-primary"><Loader2 className="animate-spin inline mr-2" /> Memuat...</div>
                        ) : history.length === 0 ? (
                            <div className="p-8 text-center text-text-secondary">Belum ada riwayat</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 dark:bg-gray-700/50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Tanggal</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-text-secondary uppercase">Masuk</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-text-secondary uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-color dark:divide-gray-700">
                                        {history.map((record) => (
                                            <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-gray-700/30">
                                                <td className="px-6 py-4 text-sm font-medium text-text-main dark:text-white whitespace-nowrap">
                                                    {formatDate(record.date)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-center text-text-secondary dark:text-gray-300">
                                                    {formatTime(record.checkInTime)}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <StatusBadge
                                                        status={getStatusBadgeType(record.status)}
                                                        label={getStatusLabel(record.status)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Permits Content */}
            {activeTab === 'permit' && (
                <div className="space-y-6 animate-in fade-in">
                    <div className="flex justify-end">
                        <button onClick={() => setShowPermitForm(!showPermitForm)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg">
                            <Plus size={18} /> Ajukan Izin
                        </button>
                    </div>

                    {showPermitForm && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 p-6">
                            <h3 className="font-semibold text-text-main dark:text-white mb-4">Formulir Permohonan Izin</h3>
                            <form onSubmit={handlePermitSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Jenis Izin</label>
                                    <select value={permitFormData.type} onChange={(e) => handlePermitChange('type', e.target.value)} className="w-full p-3 border rounded-lg bg-slate-50 dark:bg-gray-700">
                                        <option value="SICK">Sakit</option>
                                        <option value="FAMILY">Keperluan Keluarga</option>
                                        <option value="OFFICIAL">Tugas Resmi</option>
                                        <option value="OTHER">Lainnya</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Mulai</label>
                                        <input type="date" value={permitFormData.startDate} onChange={(e) => handlePermitChange('startDate', e.target.value)} className="w-full p-3 border rounded-lg bg-slate-50 dark:bg-gray-700" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Selesai</label>
                                        <input type="date" value={permitFormData.endDate} onChange={(e) => handlePermitChange('endDate', e.target.value)} className="w-full p-3 border rounded-lg bg-slate-50 dark:bg-gray-700" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Alasan</label>
                                    <textarea value={permitFormData.reason} onChange={(e) => handlePermitChange('reason', e.target.value)} rows={3} className="w-full p-3 border rounded-lg bg-slate-50 dark:bg-gray-700" placeholder="Keterangan..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Dokumen (Opsional)</label>
                                    <input type="file" accept=".pdf,.jpg,.png" onChange={(e) => handlePermitChange('document', e.target.files?.[0] || null)} className="w-full p-3 border rounded-lg bg-slate-50 dark:bg-gray-700" />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setShowPermitForm(false)} className="px-4 py-2 border rounded-lg">Batal</button>
                                    <button type="submit" disabled={submittingPermit} className="px-6 py-2 bg-primary text-white rounded-lg">
                                        {submittingPermit ? 'Mengirim...' : 'Kirim'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-color dark:border-gray-700 overflow-hidden">
                        <div className="p-4 border-b border-border-color dark:border-gray-700 flex items-center gap-2">
                            <Calendar size={18} className="text-primary" />
                            <h3 className="font-semibold text-text-main dark:text-white">Riwayat Izin</h3>
                        </div>
                        {permitsLoading ? (
                            <div className="p-8 text-center text-primary"><Loader2 className="animate-spin inline mr-2" /> Memuat...</div>
                        ) : permits.length === 0 ? (
                            <div className="p-8 text-center text-text-secondary">Belum ada data</div>
                        ) : (
                            <div className="divide-y divide-border-color dark:divide-gray-700">
                                {permits.map((permit) => (
                                    <div key={permit.id} className="p-4 hover:bg-slate-50 dark:hover:bg-gray-700/30">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium">{permitTypeLabels[permit.type]}</span>
                                                    <StatusBadge status={permit.status === 'APPROVED' ? 'success' : permit.status === 'REJECTED' ? 'error' : 'warning'} label={permitStatusLabels[permit.status]} />
                                                </div>
                                                <p className="text-sm text-text-secondary mb-2">{permit.reason}</p>
                                                <div className="flex items-center gap-4 text-xs text-text-secondary">
                                                    <span>{formatDate(permit.startDate)} - {formatDate(permit.endDate)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
