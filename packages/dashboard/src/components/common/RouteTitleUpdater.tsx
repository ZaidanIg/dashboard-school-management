import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const routeTitles: Record<string, string> = {
    '/': 'Portal Resmi Sekolah',
    '/home': 'Portal Resmi Sekolah',
    '/login': 'Masuk Portal',
    '/signup': 'Daftar Akun Baru',
    '/berita': 'Warta & Berita Sekolah',
    '/ppdb/register': 'Pendaftaran PPDB Online',
    '/dashboard': 'Dashboard Utama',
    '/news': 'Manajemen Berita & Artikel',
    '/students': 'Data Siswa',
    '/students/new': 'Tambah Siswa Baru',
    '/students/classes': 'Data Kelas & Jurusan',
    '/students/attendance': 'Presensi Siswa',
    '/students/extracurricular': 'Ekstrakurikuler Siswa',
    '/teachers': 'Data Guru & Staf',
    '/teachers/new': 'Tambah Guru Baru',
    '/teachers/schedule': 'Jadwal Mengajar Guru',
    '/teachers/attendance': 'Kehadiran Guru',
    '/teachers/performance': 'Evaluasi Kinerja Guru',
    '/finance': 'Dashboard Keuangan',
    '/finance/billing': 'Tagihan SPP',
    '/finance/income': 'Pemasukan Kas',
    '/finance/expenses': 'Pengeluaran Kas',
    '/finance/reports': 'Laporan Keuangan',
    '/academic/years': 'Tahun Ajaran',
    '/academic/subjects': 'Mata Pelajaran',
    '/academic/schedules': 'Jadwal Pelajaran',
    '/academic/lms': 'LMS & Tugas Kelas',
    '/academic/calendar': 'Kalender Akademik',
    '/curriculum': 'Manajemen Kurikulum',
    '/curriculum/cp': 'Capaian Pembelajaran',
    '/curriculum/modul-ajar': 'Modul Ajar',
    '/curriculum/penilaian-formatif': 'Penilaian Formatif',
    '/curriculum/penilaian-sumatif': 'Penilaian Sumatif',
    '/curriculum/p7': 'Proyek Profil Pelajar Pancasila',
    '/curriculum/portofolio': 'Portofolio Siswa',
    '/grading': 'Penilaian & Rapor',
    '/grading/input': 'Input Nilai Siswa',
    '/grading/reports': 'E-Rapor',
    '/grading/analytics': 'Analisis Nilai',
    '/grading/p5': 'Proyek P5',
    '/infrastructure/inventory': 'Inventaris Sarpras',
    '/infrastructure/booking': 'Peminjaman Ruang',
    '/infrastructure/maintenance': 'Pemeliharaan Sarpras',
    '/communication/announcements': 'Pengumuman Sekolah',
    '/communication/letters': 'Surat Menyurat',
    '/communication/whatsapp': 'WhatsApp Blast',
    '/settings/users': 'Manajemen Pengguna',
    '/settings/roles': 'Peran & Hak Akses',
    '/settings/backup': 'Cadangan Data',
    '/settings/config': 'Pengaturan Sistem',
    '/settings/curriculum': 'Konfigurasi Kurikulum',
    '/profile/identity': 'Identitas Sekolah',
    '/profile/organization': 'Struktur Organisasi',
    '/profile/facilities': 'Fasilitas Sekolah',
    '/profile/gallery': 'Galeri Kegiatan',
    '/profile/achievements': 'Prestasi Sekolah',
    '/profile/osis': 'Organisasi OSIS',
    '/profile/mpk': 'Organisasi MPK',
    '/ppdb/batches': 'Gelombang PPDB',
    '/ppdb/registrations': 'Data Pendaftar PPDB',
    '/student-portal': 'Portal Siswa - Beranda',
    '/student-portal/attendance': 'Portal Siswa - Presensi',
    '/student-portal/assignments': 'Portal Siswa - Tugas',
    '/student-portal/schedule': 'Portal Siswa - Jadwal Pelajaran',
    '/student-portal/grades': 'Portal Siswa - Nilai & Rapor',
    '/student-portal/announcements': 'Portal Siswa - Pengumuman',
    '/student-portal/enrollment': 'Portal Siswa - Pendaftaran Kelas',
    '/teacher-portal': 'Portal Guru - Beranda',
    '/teacher-portal/schedule': 'Portal Guru - Jadwal Mengajar',
    '/teacher-portal/assignments': 'Portal Guru - Tugas Siswa',
    '/teacher-portal/assignments/new': 'Portal Guru - Buat Tugas Baru',
    '/teacher-portal/grading': 'Portal Guru - Penilaian',
    '/teacher-portal/attendance': 'Portal Guru - Presensi Siswa',
    '/staff-portal': 'Portal Staf - Beranda',
    '/staff-portal/students': 'Portal Staf - Data Siswa',
    '/staff-portal/teachers': 'Portal Staf - Data Guru',
    '/staff-portal/inventory': 'Portal Staf - Inventaris',
    '/staff-portal/finance/salary': 'Portal Staf - Penggajian',
    '/staff-portal/finance/spp': 'Portal Staf - Tagihan SPP',
    '/staff-portal/finance/income': 'Portal Staf - Pemasukan Kas',
    '/staff-portal/finance/expenses': 'Portal Staf - Pengeluaran Kas',
    '/staff-portal/announcements': 'Portal Staf - Pengumuman',
}

function resolveTitleForPath(pathname: string): string {
    // Exact match
    if (routeTitles[pathname]) {
        return routeTitles[pathname]
    }

    // Pattern matching for nested routes
    if (pathname.startsWith('/berita/')) return 'Detail Berita'
    if (pathname.startsWith('/students/classes/')) return 'Detail Kelas'
    if (pathname.startsWith('/students/') && pathname.endsWith('/edit')) return 'Edit Siswa'
    if (pathname.startsWith('/students/')) return 'Detail Siswa'
    if (pathname.startsWith('/teachers/') && pathname.endsWith('/edit')) return 'Edit Guru'
    if (pathname.startsWith('/teachers/')) return 'Detail Guru'
    if (pathname.startsWith('/academic/lms/assignments/')) return 'Detail Tugas'
    if (pathname.startsWith('/teacher-portal/assignments/')) return 'Detail Tugas Guru'
    if (pathname.startsWith('/student-portal/assignments/')) return 'Detail Tugas Siswa'
    if (pathname.startsWith('/curriculum/detail/')) return 'Detail Kurikulum'

    return 'Portal Sekolah'
}

export default function RouteTitleUpdater() {
    const location = useLocation()

    useEffect(() => {
        // Landing page sets its own document.title with dynamic school profile name
        if (location.pathname === '/' || location.pathname === '/home') {
            return
        }

        const title = resolveTitleForPath(location.pathname)
        document.title = `${title} | EduManage`
    }, [location.pathname])

    return null
}
