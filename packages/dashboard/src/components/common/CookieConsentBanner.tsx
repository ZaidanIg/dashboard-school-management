import { useState, useEffect } from 'react'
import { Cookie, ShieldCheck, X, Check, Info } from 'lucide-react'
import { getCookieConsent, setCookieConsent } from '../../lib/cookieConsent'

export default function CookieConsentBanner() {
    const [visible, setVisible] = useState(false)
    const [showDetails, setShowDetails] = useState(false)

    useEffect(() => {
        // Only show if user has not yet decided
        const consent = getCookieConsent()
        if (consent === null) {
            // Small delay so it smoothly slides in after initial page load
            const timer = setTimeout(() => {
                setVisible(true)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleAccept = () => {
        setCookieConsent('accepted')
        setVisible(false)
    }

    const handleDecline = () => {
        setCookieConsent('declined')
        setVisible(false)
    }

    if (!visible) return null

    return (
        <aside
            aria-label="Persetujuan Penggunaan Cookies"
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 animate-slide-up"
        >
            <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-2xl shadow-blue-900/15 p-5 text-slate-800 transition-all">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#5575FF] flex items-center justify-center shrink-0">
                            <Cookie size={22} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                                Persetujuan Penggunaan Cookies
                                <ShieldCheck size={14} className="text-blue-500" />
                            </h4>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Menjaga privasi & kenyamanan Anda
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleDecline}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
                        title="Tutup banner (Tolak)"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body Explanation */}
                <div className="mt-3 text-xs text-slate-600 leading-relaxed">
                    <p>
                        Website sekolah ini menggunakan <strong>cookies</strong> untuk menyimpan preferensi penelusuran serta mencatat jumlah pembaca artikel warta unik secara anonim (mencegah duplikasi saat memuat ulang halaman).
                    </p>

                    {showDetails && (
                        <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 space-y-1.5">
                            <div className="flex items-start gap-1.5 font-medium text-slate-700">
                                <Info size={13} className="text-[#5575FF] shrink-0 mt-0.5" />
                                <span>Bagaimana data digunakan?</span>
                            </div>
                            <p>
                                <strong>Cookies Analitik Artikel:</strong> Mencatat slug artikel yang pernah Anda baca dalam 24 jam terakhir agar angka pembaca tetap akurat tanpa mengumpulkan data pribadi atau identitas Anda.
                            </p>
                            <p>
                                <strong>Cookies Esensial:</strong> Menyimpan preferensi sesi login dan preferensi tampilan.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                    <button
                        type="button"
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-[11px] font-semibold text-[#5575FF] hover:underline text-left"
                    >
                        {showDetails ? 'Sembunyikan Rincian' : 'Rincian Penggunaan Cookies'}
                    </button>

                    <div className="flex items-center gap-2 justify-end">
                        <button
                            type="button"
                            onClick={handleDecline}
                            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                        >
                            Tolak
                        </button>
                        <button
                            type="button"
                            onClick={handleAccept}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#5575FF] hover:bg-blue-600 shadow-sm transition"
                        >
                            <Check size={14} />
                            Izinkan Cookies
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    )
}
