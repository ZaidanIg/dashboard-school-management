import React from 'react';
import { Link } from 'react-router-dom';
import { useLandingData, resolveAssetUrl } from './useLandingData';
import { officeHours } from './content';
import { Phone, Mail, MapPin, LogIn, GraduationCap } from 'lucide-react';

export const Footer: React.FC = () => {
    const { data } = useLandingData();
    const schoolProfile = data?.school;

    return (
        <footer id="kontak" className="bg-slate-900 text-slate-300 pt-16 pb-10 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-14">
                    {/* Brand Col */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center p-1.5 text-blue-600 border border-slate-700 shrink-0">
                                {schoolProfile?.logo ? (
                                    <img src={resolveAssetUrl(schoolProfile.logo)} alt="Logo" className="w-full h-full object-contain" />
                                ) : (
                                    <GraduationCap size={24} />
                                )}
                            </div>
                            <div>
                                <h3 className="font-heading font-bold text-lg text-white leading-tight">
                                    {schoolProfile?.name || 'Sekolah'}
                                </h3>
                                <p className="text-xs text-blue-400 font-medium">Portal Resmi Terpadu</p>
                            </div>
                        </div>
                        <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
                            Pusat informasi kegiatan akademik, layanan administrasi digital, dan pendaftaran peserta didik baru.
                        </p>
                    </div>

                    {/* Contact Col */}
                    <div className="lg:col-span-1">
                        <h4 className="font-heading font-bold text-sm sm:text-base text-white mb-4 uppercase tracking-wider">
                            Kontak Kami
                        </h4>
                        <ul className="space-y-3 text-xs sm:text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin size={16} className="text-blue-400 shrink-0 mt-0.5" />
                                <span className="leading-snug">{schoolProfile?.address || 'Alamat Kampus Sekolah'}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={16} className="text-blue-400 shrink-0" />
                                <span>{schoolProfile?.phone || '(021) 1234567'}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={16} className="text-blue-400 shrink-0" />
                                <span>{schoolProfile?.email || 'info@sekolah.sch.id'}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Office Hours Col */}
                    <div className="lg:col-span-1">
                        <h4 className="font-heading font-bold text-sm sm:text-base text-white mb-4 uppercase tracking-wider">
                            Jam Layanan
                        </h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm">
                            {officeHours.map((h, i) => (
                                <li key={i} className="flex justify-between border-b border-slate-800 pb-2">
                                    <span className="text-slate-400">{h.day}</span>
                                    <span className="text-white font-medium">{h.time}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Portal Link Col */}
                    <div className="lg:col-span-1">
                        <h4 className="font-heading font-bold text-sm sm:text-base text-white mb-4 uppercase tracking-wider">
                            Akses Portal
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-400 mb-5 leading-relaxed">
                            Akses akun siswa, guru, dan tenaga administrasi untuk layanan terintegrasi sekolah.
                        </p>
                        <Link 
                            to="/login" 
                            className="inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <LogIn size={16} />
                            Masuk ke Dashboard
                        </Link>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-500">
                    <p>&copy; {new Date().getFullYear()} {schoolProfile?.name || 'Sekolah'}. Hak Cipta Dilindungi.</p>
                    <div className="flex gap-4">
                        <a href="#beranda" className="hover:text-blue-400 transition-colors">Kembali ke Atas</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
