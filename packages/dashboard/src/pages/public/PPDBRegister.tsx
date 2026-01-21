import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    User,
    MapPin,
    Phone,
    ArrowRight,
    ArrowLeft,
    Check,
    School,
    GraduationCap,
    Upload
} from 'lucide-react'
import { useSchoolProfile } from '../../hooks/useSettings'

export default function PPDBRegister() {
    const { school } = useSchoolProfile()
    const [loading, setLoading] = useState(false)
    const [ppdbConfig, setPpdbConfig] = useState<any>(null)
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        // Personal Info
        fullName: '',
        nisn: '',
        nik: '',
        gender: 'L',
        birthPlace: '',
        birthDate: '',
        religion: '',

        // Contact Info
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',

        // Parent Info
        fatherName: '',
        fatherPhone: '',
        motherName: '',
        motherPhone: '',

        // Previous School
        originSchool: '',
        graduationYear: ''
    })

    useEffect(() => {
        // Fetch PPDB Config
        const fetchConfig = async () => {
            try {
                const res = await fetch('http://localhost:3001/public/ppdb/config')
                const data = await res.json()
                setPpdbConfig(data)
            } catch (error) {
                console.error('Failed to fetch PPDB config', error)
            }
        }
        fetchConfig()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const nextStep = () => setStep(prev => prev + 1)
    const prevStep = () => setStep(prev => prev - 1)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('http://localhost:3001/public/ppdb/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || 'Terjadi kesalahan')
            }

            alert('Pendaftaran berhasil! Nomor Pendaftaran Anda: ' + data.data.registrationNo)
            // Reset or redirect
            window.location.href = '/home'
        } catch (error: any) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    const steps = [
        { number: 1, title: 'Data Diri', icon: User },
        { number: 2, title: 'Kontak', icon: Phone },
        { number: 3, title: 'Data Orang Tua', icon: User },
        { number: 4, title: 'Asal Sekolah', icon: School },
    ]

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans selection:bg-sky-500/30">
            {/* Header */}
            <header className="fixed top-0 z-40 w-full border-b border-white/50 dark:border-white/5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-sm h-20">
                <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 text-white shadow-lg shadow-sky-500/20">
                            <GraduationCap size={24} />
                        </div>
                        <div>
                            <span className="text-lg font-extrabold tracking-tight block text-slate-900 dark:text-white">{school?.name || 'SEKOLAH UNGGULAN'}</span>
                            <span className="text-xs text-slate-500">PPDB Online</span>
                        </div>
                    </div>
                    <Link to="/home" className="text-sm font-semibold text-slate-500 hover:text-sky-500 transition-colors">
                        Kembali ke Beranda
                    </Link>
                </div>
            </header>

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Status Check */}
                    {ppdbConfig && !ppdbConfig.isOpen && (
                        <div className="mb-8 p-6 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-2xl text-center">
                            <h2 className="text-xl font-bold text-amber-800 dark:text-amber-400 mb-2">Pendaftaran Belum Dibuka</h2>
                            <p className="text-amber-700 dark:text-amber-300">{ppdbConfig.message}</p>
                            <Link to="/home" className="inline-block mt-4 text-sm font-semibold text-amber-900 dark:text-amber-100 underline">Kembali ke Beranda</Link>
                        </div>
                    )}

                    {ppdbConfig && ppdbConfig.isOpen ? (
                        <>
                            {/* Title */}
                            <div className="text-center mb-12">
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Formulir Pendaftaran Siswa Baru</h1>
                                <p className="text-slate-500">Tahun Ajaran {ppdbConfig.academicYear} - {ppdbConfig.name}</p>
                            </div>

                            {/* Progress Steps */}
                            <div className="mb-12">
                                <div className="flex items-center justify-center w-full">
                                    {steps.map((s, idx) => (
                                        <div key={s.number} className="flex items-center">
                                            <div className={`
                                        flex flex-col items-center gap-2 relative z-10
                                        ${step >= s.number ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}
                                    `}>
                                                <div className={`
                                            w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                            ${step >= s.number
                                                        ? 'bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-500/30'
                                                        : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                                                    }
                                        `}>
                                                    {step > s.number ? <Check size={24} /> : <s.icon size={20} />}
                                                </div>
                                                <span className="text-xs font-bold uppercase tracking-wide hidden sm:block">{s.title}</span>
                                            </div>
                                            {idx < steps.length - 1 && (
                                                <div className={`
                                            w-full h-1 mx-2 sm:w-24 lg:w-32 transition-colors duration-300
                                            ${step > s.number ? 'bg-sky-500' : 'bg-slate-200 dark:bg-slate-700'}
                                        `} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Form Card */}
                            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-white/5 p-8 lg:p-12">
                                <form onSubmit={handleSubmit}>
                                    {/* Step 1: Data Diri */}
                                    {step === 1 && (
                                        <div className="space-y-6 animate-slideIn">
                                            <h3 className="text-xl font-bold flex items-center gap-2 mb-6 border-b pb-4 dark:border-gray-700">
                                                <User className="text-sky-500" /> Informasi Pribadi
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Nama Lengkap</label>
                                                    <input
                                                        type="text"
                                                        name="fullName"
                                                        value={formData.fullName}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                                        placeholder="Sesuai Ijazah"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">NISN</label>
                                                    <input
                                                        type="text"
                                                        name="nisn"
                                                        value={formData.nisn}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                                        placeholder="10 Digit NISN"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Jenis Kelamin</label>
                                                    <select
                                                        name="gender"
                                                        value={formData.gender}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                                    >
                                                        <option value="L">Laki-laki</option>
                                                        <option value="P">Perempuan</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Agama</label>
                                                    <select
                                                        name="religion"
                                                        value={formData.religion}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                                    >
                                                        <option value="">Pilih Agama</option>
                                                        <option value="Islam">Islam</option>
                                                        <option value="Kristen">Kristen</option>
                                                        <option value="Katolik">Katolik</option>
                                                        <option value="Hindu">Hindu</option>
                                                        <option value="Buddha">Buddha</option>
                                                        <option value="Konghucu">Konghucu</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Tempat Lahir</label>
                                                    <input
                                                        type="text"
                                                        name="birthPlace"
                                                        value={formData.birthPlace}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Tanggal Lahir</label>
                                                    <input
                                                        type="date"
                                                        name="birthDate"
                                                        value={formData.birthDate}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 2: Kontak */}
                                    {step === 2 && (
                                        <div className="space-y-6 animate-slideIn">
                                            <h3 className="text-xl font-bold flex items-center gap-2 mb-6 border-b pb-4 dark:border-gray-700">
                                                <MapPin className="text-sky-500" /> Alamat & Kontak
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2 md:col-span-2">
                                                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Alamat Lengkap</label>
                                                    <textarea
                                                        name="address"
                                                        value={formData.address}
                                                        onChange={handleChange}
                                                        rows={3}
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                                        placeholder="Nama Jalan, RT/RW, Kelurahan, Kecamatan"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Kota/Kabupaten</label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        value={formData.city}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Kode Pos</label>
                                                    <input
                                                        type="text"
                                                        name="postalCode"
                                                        value={formData.postalCode}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Email</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                                        placeholder="contoh@email.com"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">No. Handphone (WA)</label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                                        placeholder="08xxxxxxxxxx"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 3: Data Orang Tua */}
                                    {step === 3 && (
                                        <div className="space-y-6 animate-slideIn">
                                            <h3 className="text-xl font-bold flex items-center gap-2 mb-6 border-b pb-4 dark:border-gray-700">
                                                <User className="text-sky-500" /> Data Orang Tua / Wali
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Nama Ayah</label>
                                                    <input
                                                        type="text"
                                                        name="fatherName"
                                                        value={formData.fatherName}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">No. HP Ayah</label>
                                                    <input
                                                        type="tel"
                                                        name="fatherPhone"
                                                        value={formData.fatherPhone}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Nama Ibu</label>
                                                    <input
                                                        type="text"
                                                        name="motherName"
                                                        value={formData.motherName}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">No. HP Ibu</label>
                                                    <input
                                                        type="tel"
                                                        name="motherPhone"
                                                        value={formData.motherPhone}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 4: Asal Sekolah & Dokumen */}
                                    {step === 4 && (
                                        <div className="space-y-6 animate-slideIn">
                                            <h3 className="text-xl font-bold flex items-center gap-2 mb-6 border-b pb-4 dark:border-gray-700">
                                                <School className="text-sky-500" /> Data Pendidikan Sebelumnya
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2 md:col-span-2">
                                                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Nama Sekolah Asal</label>
                                                    <input
                                                        type="text"
                                                        name="originSchool"
                                                        value={formData.originSchool}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                                        placeholder="SMP / MTs ....."
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Tahun Lulus</label>
                                                    <input
                                                        type="number"
                                                        name="graduationYear"
                                                        value={formData.graduationYear}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                                                        placeholder="2024"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-8 p-6 bg-sky-50 dark:bg-sky-900/20 rounded-2xl border border-sky-100 dark:border-sky-800">
                                                <h4 className="font-bold flex items-center gap-2 mb-4 text-sky-800 dark:text-sky-400">
                                                    <Upload size={20} /> Upload Dokumen
                                                </h4>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                                    Dokumen dapat diupload nanti setelah pendaftaran berhasil dibuat. Siapkan berkas berikut:
                                                </p>
                                                <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1 ml-2">
                                                    <li>Scan Ijazah / SKL</li>
                                                    <li>Scan Kartu Keluarga</li>
                                                    <li>Scan Akta Kelahiran</li>
                                                    <li>Pas Foto 3x4</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {/* Navigation Buttons */}
                                    <div className="flex justify-between items-center mt-12 pt-6 border-t dark:border-gray-700">
                                        {step > 1 ? (
                                            <button
                                                type="button"
                                                onClick={prevStep}
                                                className="px-6 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                                            >
                                                <ArrowLeft size={20} /> Kembali
                                            </button>
                                        ) : (
                                            <div></div>
                                        )}

                                        {step < 4 ? (
                                            <button
                                                type="button"
                                                onClick={nextStep}
                                                className="px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-lg shadow-sky-500/30 hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                                            >
                                                Selanjutnya <ArrowRight size={20} />
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30 hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loading ? 'Mengirim...' : <><Check size={20} /> Kirim Pendaftaran</>}
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </>
                    ) : null}
                </div>
            </main>
        </div>
    )
}
