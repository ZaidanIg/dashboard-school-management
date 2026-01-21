import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, GraduationCap, AlertCircle, ArrowLeft } from 'lucide-react'
import { useAuthContext } from '@/contexts/AuthContext'

export default function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const location = useLocation()
    const { login, loginWithGoogle, loading, error } = useAuthContext()

    const from = (location.state as { from?: { pathname: string } })?.from?.pathname

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const loggedInUser = await login(email, password)
        if (loggedInUser) {
            // If there's a specific "from" path, use it. Otherwise, redirect based on role
            if (from && from !== '/' && from !== '/home') {
                navigate(from, { replace: true })
            } else {
                const role = loggedInUser.role?.toUpperCase()
                if (role === 'TEACHER') {
                    navigate('/teacher-portal', { replace: true })
                } else if (role === 'STUDENT') {
                    navigate('/student-portal', { replace: true })
                } else {
                    navigate('/dashboard', { replace: true })
                }
            }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary via-blue-600 to-indigo-700 flex items-center justify-center p-4">
            {/* Back Button */}
            <Link
                to="/home"
                className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
                <ArrowLeft size={20} />
                <span className="font-medium">Kembali</span>
            </Link>

            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
                        <GraduationCap size={32} className="text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Artefact</h1>
                    <p className="text-blue-100">Sistem Manajemen Sekolah</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-text-main">Selamat Datang</h2>
                        <p className="text-text-secondary">Masuk ke akun Anda</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-600 text-sm">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-main mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="nama@sekolah.sch.id"
                                className="w-full px-4 py-3 bg-slate-50 border border-border-color rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary focus:outline-none transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-main mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Masukkan password"
                                    className="w-full px-4 py-3 bg-slate-50 border border-border-color rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary focus:outline-none transition-colors pr-10"
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
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded text-primary" />
                                <span className="text-sm text-text-secondary">Ingat saya</span>
                            </label>
                            <a href="#" className="text-sm text-primary font-medium hover:underline">
                                Lupa password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-primary hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Memproses...
                                </>
                            ) : (
                                'Masuk'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border-color"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-text-secondary">atau</span>
                        </div>
                    </div>

                    {/* Google Login */}
                    <button
                        type="button"
                        onClick={loginWithGoogle}
                        className="w-full py-3 bg-white border border-border-color hover:bg-slate-50 rounded-lg font-medium transition-colors flex items-center justify-center gap-3"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Masuk dengan Google
                    </button>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-text-secondary">
                            Belum punya akun?{' '}
                            <Link to="/signup" className="text-primary font-medium hover:underline">
                                Daftar sekarang
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
