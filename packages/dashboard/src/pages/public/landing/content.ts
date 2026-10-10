/**
 * Static editorial content for the public landing page.
 *
 * Data that is managed from the dashboard (school profile, facilities, achievements,
 * gallery, extracurriculars, announcements) is fetched from `/public/landing`.
 * The `fallback*` values below are only shown while that data is still empty,
 * so a freshly installed school website never looks broken.
 */

export interface ProgramItem {
    icon: 'science' | 'language' | 'math' | 'arts' | 'tech' | 'sports'
    title: string
    desc: string
    highlights: string[]
}

export interface FallbackAchievement {
    title: string
    level: 'SEKOLAH' | 'KOTA' | 'PROVINSI' | 'NASIONAL' | 'INTERNASIONAL'
    year: number
    category: string
    studentName?: string
}

export interface FallbackGalleryItem {
    title: string
    category: string
    imageUrl: string
}

export const navItems = [
    { label: 'Profil', href: '#profil' },
    { label: 'Struktur', href: '#struktur' },
    { label: 'Akademik', href: '#akademik' },
    { label: 'Fasilitas', href: '#fasilitas' },
    { label: 'Organisasi', href: '#organisasi' },
    { label: 'Berita', href: '#berita' },
    { label: 'Prestasi', href: '#prestasi' },
    { label: 'Galeri', href: '#galeri' },
    { label: 'Kontak', href: '#kontak' },
] as const

export const officeHours = [
    { day: 'Senin – Kamis', time: '07.00 – 15.00 WIB' },
    { day: 'Jumat', time: '07.00 – 11.30 WIB' },
    { day: 'Sabtu', time: '08.00 – 12.00 WIB (Tata Usaha)' },
]

export const principal = {
    name: 'Drs. H. Ahmad Suryana, M.Pd.',
    title: 'Kepala Sekolah',
    photo: '/images/landing/principal.jpg',
    greeting: [
        'Assalamu’alaikum warahmatullahi wabarakatuh, salam sejahtera bagi kita semua.',
        'Selamat datang di website resmi sekolah kami. Website ini merupakan pusat informasi digital bagi siswa, orang tua, dan masyarakat luas.',
        'Kami terus berupaya meningkatkan kualitas layanan pendidikan dan fasilitas sekolah untuk mendukung proses belajar mengajar yang efektif, aman, dan nyaman.',
    ],
}

export const programs: ProgramItem[] = [
    { icon: 'science', title: 'Sains & Riset', desc: 'Praktikum rutin di laboratorium IPA dan pembinaan olimpiade sains secara berjenjang.', highlights: ['Lab Fisika, Kimia, Biologi', 'Pembinaan OSN'] },
    { icon: 'math', title: 'Matematika & Persiapan PTN', desc: 'Kelas pendalaman materi dan try out berkala untuk persiapan seleksi masuk perguruan tinggi.', highlights: ['Try out berkala', 'Kelas pendalaman'] },
    { icon: 'language', title: 'Bahasa & Literasi', desc: 'Penguatan Bahasa Indonesia, Inggris, dan bahasa daerah melalui klub debat dan gerakan literasi.', highlights: ['English Club', 'Gerakan Literasi'] },
    { icon: 'tech', title: 'Teknologi Informasi', desc: 'Pembelajaran informatika, dasar pemrograman, dan literasi digital di laboratorium komputer.', highlights: ['Lab Komputer', 'Klub Coding'] },
    { icon: 'arts', title: 'Seni & Budaya', desc: 'Pelestarian seni tradisi dan pengembangan kreativitas melalui tari, musik, dan seni rupa.', highlights: ['Tari Tradisional', 'Pentas Seni Tahunan'] },
    { icon: 'sports', title: 'Olahraga & Kesehatan', desc: 'Pembinaan cabang olahraga prestasi dan pembiasaan hidup sehat bagi seluruh warga sekolah.', highlights: ['Futsal & Basket', 'Bola Voli'] },
]

export const fallbackFacilities = [
    'Ruang kelas ber-proyektor',
    'Laboratorium Fisika, Kimia & Biologi',
    'Laboratorium Komputer',
    'Perpustakaan & Pojok Baca',
    'Masjid / Ruang Ibadah',
    'Lapangan Olahraga Serbaguna',
    'Unit Kesehatan Sekolah (UKS)',
    'Kantin Sehat',
]

export const fallbackExtracurriculars = [
    'Pramuka', 'Paskibra', 'PMR', 'OSIS', 'Rohis', 'Futsal', 'Basket', 'Bola Voli',
    'Tari Tradisional', 'Paduan Suara', 'English Club', 'KIR', 'Klub Coding', 'Jurnalistik',
]

export const fallbackAchievements: FallbackAchievement[] = [
    { title: 'Medali Perak OSN Biologi', level: 'NASIONAL', year: 2024, category: 'Akademik' },
    { title: 'Juara 1 Lomba Debat Bahasa Inggris', level: 'PROVINSI', year: 2024, category: 'Bahasa' },
    { title: 'Juara 2 FLS2N Tari Kreasi', level: 'PROVINSI', year: 2024, category: 'Seni' },
    { title: 'Juara 1 Turnamen Basket Pelajar', level: 'KOTA', year: 2024, category: 'Olahraga' },
    { title: 'Juara Umum Lomba Tingkat Pramuka', level: 'KOTA', year: 2023, category: 'Kepramukaan' },
    { title: 'Finalis Kompetisi Karya Tulis Ilmiah', level: 'NASIONAL', year: 2023, category: 'Riset' },
]

export const fallbackGallery: FallbackGalleryItem[] = [
    { title: 'Upacara Bendera Hari Senin', category: 'Kegiatan', imageUrl: '/images/landing/flag-ceremony.jpg' },
    { title: 'Praktikum Kimia', category: 'Akademik', imageUrl: '/images/landing/science-lab.jpg' },
    { title: 'Pentas Seni Tari Tradisional', category: 'Seni', imageUrl: '/images/landing/arts.jpg' },
    { title: 'Kelas Informatika', category: 'Akademik', imageUrl: '/images/landing/computer-lab.jpg' },
    { title: 'Latihan Ekstrakurikuler Basket', category: 'Olahraga', imageUrl: '/images/landing/basketball.jpg' },
    { title: 'Lingkungan Sekolah', category: 'Fasilitas', imageUrl: '/images/school-hero.png' },
]

export const testimonials = [
    { name: 'Aisyah Putri', role: 'Siswi Kelas XII', quote: 'Guru-guru sangat sabar membimbing kami, terutama saat persiapan olimpiade. Suasana belajarnya membuat saya betah.' },
    { name: 'Bapak Hendra', role: 'Orang Tua Siswa', quote: 'Komunikasi sekolah dengan orang tua terbuka. Perkembangan nilai dan kehadiran anak bisa saya pantau lewat portal.' },
    { name: 'Dinda Maharani', role: 'Alumni 2023', quote: 'Kegiatan OSIS dan ekstrakurikuler melatih saya berorganisasi. Bekal itu sangat terasa ketika masuk kuliah.' },
]

export const ppdbSteps = [
    { title: 'Isi Formulir Online', desc: 'Lengkapi data calon siswa, orang tua, dan sekolah asal melalui formulir PPDB.' },
    { title: 'Verifikasi Berkas', desc: 'Panitia memeriksa kelengkapan data. Status dikirim melalui email terdaftar.' },
    { title: 'Seleksi & Pengumuman', desc: 'Calon siswa mengikuti tahapan seleksi sesuai jalur yang dipilih.' },
    { title: 'Daftar Ulang', desc: 'Siswa yang diterima melakukan daftar ulang dan mengikuti MPLS.' },
]

export const ppdbRequirements = [
    'Ijazah / Surat Keterangan Lulus SMP/MTs',
    'Rapor semester 1 – 5',
    'Kartu Keluarga dan Akta Kelahiran',
    'Pas foto terbaru ukuran 3×4',
    'NISN yang masih aktif',
    'Sertifikat prestasi (jika ada)',
]

export const faqs = [
    { q: 'Kapan pendaftaran PPDB dibuka?', a: 'Jadwal PPDB mengikuti gelombang yang ditetapkan panitia. Status pendaftaran terbaru selalu ditampilkan pada bagian PPDB di halaman ini.' },
    { q: 'Apakah pendaftaran bisa dilakukan sepenuhnya secara online?', a: 'Ya. Formulir diisi secara online. Berkas fisik hanya dibawa saat verifikasi atau daftar ulang sesuai jadwal dari panitia.' },
    { q: 'Berapa biaya pendidikan di sekolah ini?', a: 'Rincian biaya disampaikan saat daftar ulang. Silakan hubungi bagian Tata Usaha untuk informasi lebih lanjut. Tersedia keringanan bagi siswa berprestasi dan kurang mampu.' },
    { q: 'Kurikulum apa yang digunakan?', a: 'Sekolah menerapkan Kurikulum Merdeka dengan pembelajaran berbasis proyek (P5), asesmen formatif, dan pilihan mata pelajaran sesuai minat siswa.' },
    { q: 'Bagaimana orang tua memantau perkembangan siswa?', a: 'Orang tua mendapatkan akun portal untuk melihat jadwal, kehadiran, nilai, tugas, dan pengumuman sekolah secara langsung.' },
]
