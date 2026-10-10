import React, { useEffect } from 'react';
import { Header } from './Header';
import { Hero, QuickLinks } from './Hero';
import { About } from './About';
import { Structure } from './Structure';
import { Programs } from './Programs';
import { FacilitiesSection } from './FacilitiesSection';
import { Organizations } from './Organizations';
import { NewsSection } from './NewsSection';
import { TrendingNewsDocket } from './TrendingNewsDocket';
import { Achievements } from './Achievements';
import { Gallery } from './Gallery';
import { Footer } from './Footer';
import { useLandingData, useScrollSpy } from './useLandingData';
import { navItems } from './content';

class SectionErrorBoundary extends React.Component<{ children: React.ReactNode; name?: string }, { hasError: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(error: Error, info: any) {
        console.error(`[LandingPage] Error in section ${this.props.name || 'unknown'}:`, error, info);
    }
    render() {
        if (this.state.hasError) {
            return null;
        }
        return this.props.children;
    }
}

export const LandingPage: React.FC = () => {
    const { data, ppdb, loading } = useLandingData();
    const schoolProfile = data?.school;
    const stats = data?.stats;
    const title = schoolProfile?.name ? `${schoolProfile.name} - Portal Resmi` : 'Portal Resmi Sekolah';

    useEffect(() => {
        document.title = title;
    }, [title]);

    const activeId = useScrollSpy(navItems.map((n) => n.href.slice(1)));

    const handleNavigate = (href: string) => {
        const id = href.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-semibold text-blue-200">Memuat Portal Sekolah...</span>
                </div>
            </div>
        );
    }

    // Convert stats object to array format expected by QuickLinks
    const displayStats = stats ? [
        { value: String(stats.students), label: 'Siswa Aktif' },
        { value: String(stats.teachers), label: 'Guru & Staf' },
        { value: String(stats.extracurriculars), label: 'Ekstrakurikuler' },
        { value: String(stats.achievements), label: 'Prestasi' },
    ] : [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#5575FF] via-[#CFDAFF] to-white py-0 sm:py-6 lg:py-10 px-0 sm:px-4 lg:px-6 flex flex-col items-center justify-start font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white relative overflow-x-hidden w-full">
            {/* Ambient Radial Highlights */}
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(49, 128, 255, 0.18),transparent_70%)]" aria-hidden="true" />

            {/* STICKY NEWS DOCKET (Di Luar Body Utama, Menempel di Sisi Kiri & Sticky Mengikuti Scroll) */}
            <TrendingNewsDocket
                articles={data?.articles}
                trendingArticles={data?.trendingArticles}
            />

            {/* Main Card Body Container */}
            <div className="w-full max-w-[1400px] bg-gradient-to-b from-blue-900 via-blue-950 to-slate-950 sm:rounded-3xl shadow-2xl shadow-blue-950/80 border-0 sm:border sm:border-blue-800/40 overflow-hidden flex flex-col relative z-10">
                {/* Header Navbar */}
                <Header
                    school={schoolProfile || null}
                    schoolName={schoolProfile?.name || 'Sekolah'}
                    activeId={activeId}
                    ppdbOpen={ppdb?.isOpen || false}
                    onNavigate={handleNavigate}
                />

                {/* Landing Main Sections */}
                <main className="flex-1 bg-transparent pb-10">
                    <SectionErrorBoundary name="Hero">
                        <Hero
                            school={schoolProfile || null}
                            schoolName={schoolProfile?.name || 'Sekolah'}
                            ppdb={ppdb}
                            onNavigate={handleNavigate}
                        />
                    </SectionErrorBoundary>
                    <SectionErrorBoundary name="QuickLinks">
                        <QuickLinks
                            onNavigate={handleNavigate}
                            stats={displayStats}
                        />
                    </SectionErrorBoundary>
                    <SectionErrorBoundary name="About">
                        <About />
                    </SectionErrorBoundary>
                    <SectionErrorBoundary name="Structure">
                        <Structure />
                    </SectionErrorBoundary>
                    <SectionErrorBoundary name="Programs">
                        <Programs />
                    </SectionErrorBoundary>
                    <SectionErrorBoundary name="Facilities">
                        <FacilitiesSection />
                    </SectionErrorBoundary>
                    <SectionErrorBoundary name="Organizations">
                        <Organizations />
                    </SectionErrorBoundary>
                    <SectionErrorBoundary name="News">
                        <NewsSection />
                    </SectionErrorBoundary>
                    <SectionErrorBoundary name="Achievements">
                        <Achievements />
                    </SectionErrorBoundary>
                    <SectionErrorBoundary name="Gallery">
                        <Gallery />
                    </SectionErrorBoundary>
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};

export default LandingPage;
