import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, GraduationCap, Check, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuthContext } from '@/contexts/AuthContext'

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate()
    const { signup, loading, error } = useAuthContext()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) return

        const result = await signup(formData.name, formData.email, formData.password)
        if (result) {
            setSuccess(true)
            setTimeout(() => navigate('/login'), 3000)
        }
    }

    const passwordRequirements = [
        { text: 'Minimal 8 karakter', met: formData.password.length >= 8 },
        { text: 'Mengandung huruf besar', met: /[A-Z]/.test(formData.password) },
        { text: 'Mengandung angka', met: /[0-9]/.test(formData.password) },
    ]

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary via-blue-600 to-indigo-700 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle size={32} className="text-emerald-600" />
                        </div>
                        <h2 className="text-xl font-bold text-text-main mb-2">Registrasi Berhasil!</h2>
                        <p className="text-text-secondary mb-4">
                            Silakan cek email Anda untuk verifikasi akun.
                        </p>
                        <Link to="/login" className="text-primary font-medium hover:underline">
                            Kembali ke halaman login →
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary via-blue-600 to-indigo-700 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
                        <GraduationCap size={32} className="text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Artefact</h1>
                    <p className="text-blue-100">Sistem Manajemen Sekolah</p>
                </div>

                {/* Signup Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-text-main">Buat Akun Baru</h2>
                        <p className="text-text-secondary">Daftarkan diri Anda ke sistem</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-600 text-sm">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-main mb-1">Nama Lengkap</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Masukkan nama lengkap"
                                className="w-full px-4 py-3 bg-slate-50 border border-border-color rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-main mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="nama@sekolah.sch.id"
                                className="w-full px-4 py-3 bg-slate-50 border border-border-color rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-main mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Buat password"
                                    className="w-full px-4 py-3 bg-slate-50 border border-border-color rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary focus:outline-none pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {formData.password && (
                                <div className="mt-2 space-y-1">
                                    {passwordRequirements.map((req, index) => (
                                        <div key={index} className={`flex items-center gap-2 text-xs ${req.met ? 'text-emerald-600' : 'text-text-secondary'}`}>
                                            <Check size={12} className={req.met ? '' : 'opacity-30'} />
                                            {req.text}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-main mb-1">Konfirmasi Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Ulangi password"
                                className="w-full px-4 py-3 bg-slate-50 border border-border-color rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary focus:outline-none"
                                required
                            />
                            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                <p className="mt-1 text-xs text-rose-500">Password tidak cocok</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || formData.password !== formData.confirmPassword || !passwordRequirements.every(r => r.met)}
                            className="w-full py-3 bg-primary hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Memproses...
                                </>
                            ) : (
                                'Daftar'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-text-secondary">
                            Sudah punya akun?{' '}
                            <Link to="/login" className="text-primary font-medium hover:underline">
                                Masuk di sini
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-blue-100 text-sm mt-6">
                    © 2024 Artefact. All rights reserved.
                </p>
            </div>
        </div>
    )
}
