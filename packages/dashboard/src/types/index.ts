// Student Types
export interface Student {
    id: string
    nis: string
    nisn?: string
    nik?: string
    name: string
    gender: 'MALE' | 'FEMALE'
    religion?: string
    birthPlace?: string
    birthDate?: string

    // Address Details
    address?: string
    rt?: string
    rw?: string
    village?: string
    district?: string
    city?: string
    province?: string
    postalCode?: string
    phone?: string
    email?: string
    photo?: string

    // Academic
    status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'TRANSFERRED' | 'DROPPED'
    enrollmentDate: string
    graduationDate?: string
    previousSchool?: string
    deletedAt?: string

    // Parents
    fatherName?: string
    fatherNik?: string
    fatherJob?: string
    fatherEducation?: string
    fatherPhone?: string

    motherName?: string
    motherNik?: string
    motherJob?: string
    motherEducation?: string
    motherPhone?: string

    guardianName?: string
    guardianNik?: string
    guardianJob?: string
    guardianEducation?: string
    guardianPhone?: string
    guardianRelation?: string

    parentAddress?: string
    parentCity?: string
    parentProvince?: string
    createdAt: string
    updatedAt: string
    classEnrollments?: ClassEnrollment[]
    grades?: Grade[]
    attendances?: StudentAttendance[]
    sppBillings?: SPPBilling[]
}

export interface ClassEnrollment {
    id: string
    studentId: string
    classId: string
    enrolledAt: string
    status: 'ACTIVE' | 'TRANSFERRED' | 'COMPLETED'
    class: Class
}

export interface StudentAttendance {
    id: string
    studentId: string
    date: string
    status: 'PRESENT' | 'SICK' | 'PERMITTED' | 'ABSENT' | 'LATE'
    checkInTime?: string
    checkOutTime?: string
    notes?: string
}

// Teacher Types
export interface Teacher {
    id: string
    userId?: string
    nip?: string
    nuptk?: string
    name: string
    gender: 'MALE' | 'FEMALE'
    birthPlace?: string
    birthDate?: string
    address?: string
    phone?: string
    email?: string
    photo?: string
    position: 'PNS' | 'HONORER' | 'P3K' | 'STAFF'
    status: 'ACTIVE' | 'INACTIVE' | 'RETIRED' | 'TRANSFERRED'
    isCertified: boolean
    certificationFile?: string

    // SOP Fields
    nik?: string
    religion?: string
    maritalStatus?: string
    educationDegree?: string
    university?: string
    major?: string

    joinDate: string
    subjects?: TeacherSubject[]
}

export interface TeacherSubject {
    id: string
    teacherId: string
    subjectId: string
    subject: Subject
}

// Academic Types
export interface AcademicYear {
    id: string
    name: string
    startDate: string
    endDate: string
    isActive: boolean
}

export interface Class {
    id: string
    name: string
    grade: number
    major?: string
    academicYearId: string
    homeroomTeacherId?: string
    capacity: number
    homeroomTeacher?: Teacher
    _count?: { enrollments: number }
}

export interface Subject {
    id: string
    code: string
    name: string
    category: 'WAJIB' | 'PEMINATAN_IPA' | 'PEMINATAN_IPS' | 'MULOK' | 'EKSTRA'
    hoursPerWeek: number
    description?: string
    teachers?: TeacherSubject[]
}

// Finance Types
export interface FeeType {
    id: string
    name: string
    amount: number
    frequency: 'MONTHLY' | 'SEMESTER' | 'YEARLY' | 'ONCE'
    description?: string
    isActive: boolean
}

export interface SPPBilling {
    id: string
    studentId: string
    feeTypeId: string
    academicYearId: string
    month?: number
    year: number
    amount: number
    dueDate: string
    status: 'PENDING' | 'PAID' | 'OVERDUE' | 'PARTIAL' | 'CANCELLED'
    paidAmount?: number
    paidAt?: string
    paymentMethod?: string
    receiptNumber?: string
    student?: Student
    feeType?: FeeType
}

export interface FinanceTransaction {
    id: string
    type: 'INCOME' | 'EXPENSE'
    category: string
    amount: number
    description: string
    date: string
    referenceNumber?: string
}

export interface FinanceDashboard {
    totalBillings: number
    paidAmount: number
    pendingAmount: number
    overdueAmount: number
    recentTransactions: FinanceTransaction[]
    totalIncome: number
    totalExpense: number
}

// Grade Types
export interface Grade {
    id: string
    studentId: string
    subjectId: string
    academicYearId: string
    semester: 'GANJIL' | 'GENAP'
    assignment1?: number
    assignment2?: number
    assignment3?: number
    midtermExam?: number
    finalExam?: number
    practicalScore?: number
    activityScore?: number
    finalGrade?: number
    letterGrade?: string
    subject?: Subject
    student?: Student
}

// School Profile Types
export interface School {
    id: string
    npsn: string
    name: string
    status: 'NEGERI' | 'SWASTA'
    educationType: string
    accreditation?: string
    accreditationYear?: number
    foundedYear?: number
    curriculum?: string
    vision?: string
    mission: string[]
    address?: string
    city?: string
    province?: string
    postalCode?: string
    phone?: string
    email?: string
    website?: string
    logo?: string
    facilities?: Facility[]
    _count?: {
        gallery: number
        achievements: number
        organizations: number
    }
}

export interface Facility {
    id: string
    schoolId: string
    name: string
    category: string
    quantity: number
    area?: number
    condition: 'GOOD' | 'FAIR' | 'POOR'
    description?: string
}

// User Types
export interface User {
    id: string
    email: string
    name: string
    emailVerified: boolean
    image?: string
    role: 'SUPER_ADMIN' | 'PRINCIPAL' | 'TEACHER' | 'STAFF' | 'PARENT' | 'STUDENT'
    status: 'ACTIVE' | 'INACTIVE'
    createdAt: string
}

export interface Session {
    user: User
    session: {
        id: string
        userId: string
        expiresAt: string
    }
}

// Role Types
export interface Role {
    id: string
    name: string
    description?: string
    permissions: string[]
}

// Communication Types
export interface Announcement {
    id: string
    title: string
    content: string
    category?: string
    targetAudience: string[]
    isPinned: boolean
    publishedAt: string
    expiresAt?: string
    createdBy?: string
}

// LMS Types


export interface AssignmentAttachment {
    id: string
    assignmentId: string
    type: 'FILE' | 'LINK' | 'IMAGE' | 'VIDEO'
    url: string
    filename?: string
    size?: number
    mimeType?: string
    createdAt: string
}

export interface Assignment {
    id: string
    classId: string
    subjectId: string
    teacherId: string
    title: string
    description?: string
    dueDate?: string
    maxScore: number
    attachmentUrl?: string
    createdAt: string

    class?: Class
    subject?: Subject
    teacher?: Teacher
    submissions?: AssignmentSubmission[]
    attachments?: AssignmentAttachment[]
    _count?: { submissions: number }
}

export interface AssignmentSubmission {
    id: string
    assignmentId: string
    studentId: string
    fileUrl?: string
    content?: string
    grade?: number
    feedback?: string
    status: 'DRAFT' | 'SUBMITTED' | 'LATE' | 'GRADED' | 'RETURNED'
    submittedAt: string
    gradedAt?: string

    student?: Student
}

// ============================================
// KURIKULUM MERDEKA TYPES
// ============================================

// Fase pembelajaran
export type Fase = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

// Tingkat pencapaian kompetensi
export type TingkatPencapaian = 'BB' | 'MB' | 'BSH' | 'BSB'

// Jenis penilaian
export type JenisPenilaianFormatif = 'OBSERVASI' | 'KUIS' | 'TUGAS' | 'DISKUSI'
export type JenisPenilaianSumatif = 'STS' | 'SAS' | 'AKHIR_TAHUN'

// Status proyek
export type StatusProyek = 'PLANNING' | 'ACTIVE' | 'IN_PROGRESS' | 'COMPLETED'

// Capaian Pembelajaran (CP)
export interface CapaianPembelajaran {
    id: string
    kodeCP: string
    fase: Fase
    mataPelajaranId: string
    deskripsi: string
    createdAt: string
    updatedAt: string
    mataPelajaran?: Subject
    modulAjar?: ModulAjar[]
    _count?: { modulAjar: number }
}

// Modul Ajar - Format lengkap Kurikulum Merdeka
export interface TujuanPembelajaran {
    kode: string       // TP-1, TP-2, etc
    deskripsi: string
}

export interface KegiatanPembelajaran {
    pertemuan: number
    durasiMenit: number
    pembuka: string
    inti: string
    penutup: string
    refleksi?: string
}

export interface RencanaDiferensiasi {
    konten?: string
    proses?: string
    produk?: string
}

export interface RencanaAsesmen {
    diagnostik?: string
    formatif: string
    sumatif?: string
}

export interface LKPDItem {
    judul: string
    deskripsi?: string
    fileUrl?: string
}

export interface BahanBacaan {
    judul: string
    url?: string
}

export interface GlosariumItem {
    istilah: string
    definisi: string
}

export interface ModulAjar {
    id: string
    cpId: string
    guruId: string
    tahunAjaranId: string

    // Informasi Umum
    namaModul: string
    fase: Fase
    kelas: number
    deskripsiUmum?: string
    targetPesertaDidik?: string
    profilPelajarPancasila: string[]  // Array kode dimensi P7
    kompetensiAwal?: string
    saranaPrasarana: string[]
    modelPembelajaran: 'TATAP_MUKA' | 'DARING' | 'CAMPURAN'

    // Capaian & Tujuan
    tujuanPembelajaran?: TujuanPembelajaran[]
    alurTujuanPembelajaran?: string

    // Rancangan Pembelajaran
    alokasiWaktuJam: number
    jumlahPertemuan: number
    pertanyaanPemantik: string[]
    pemahamanBermakna?: string
    kegiatanPembelajaran?: KegiatanPembelajaran[]
    rencanaDiferensiasi?: RencanaDiferensiasi
    rencanaAsesmen?: RencanaAsesmen

    // Lampiran
    lkpd?: LKPDItem[]
    bahanBacaan?: BahanBacaan[]
    glosarium?: GlosariumItem[]
    daftarPustaka: string[]

    // Meta
    status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
    createdAt: string
    updatedAt: string

    // Relations
    cp?: CapaianPembelajaran
    guru?: Teacher
    tahunAjaran?: AcademicYear
    _count?: {
        penilaianFormatif: number
        penilaianSumatif: number
        performanceTasks: number
    }
}

// Penilaian Formatif
export interface PenilaianFormatif {
    id: string
    siswaId: string
    modulAjarId: string
    jenis: JenisPenilaianFormatif
    nilai?: string
    tingkatPencapaian: TingkatPencapaian
    catatan?: string
    tanggal: string
    createdAt: string
    siswa?: Student
    modulAjar?: ModulAjar
}

// Penilaian Sumatif
export interface PenilaianSumatif {
    id: string
    siswaId: string
    modulAjarId: string
    jenis: JenisPenilaianSumatif
    nilaiTes?: number
    nilaiPerformanceTask?: number
    nilaiAkhir?: number
    tingkatPencapaian?: TingkatPencapaian
    tanggal: string
    createdAt: string
    siswa?: Student
    modulAjar?: ModulAjar
}

// Performance Task
export interface PerformanceTask {
    id: string
    siswaId: string
    modulAjarId: string
    judulTugas: string
    rubrikId?: string
    fileEvidences?: { filename: string; url: string; uploadedAt: string }[]
    nilai?: number
    komentarGuru?: string
    createdAt: string
    updatedAt: string
    siswa?: Student
    modulAjar?: ModulAjar
}

// Dimensi P7 (Profil Pelajar Pancasila)
export interface DimensiP7 {
    id: string
    kode: string
    namaDimensi: string
    deskripsi?: string
    elemen: string[]
    _count?: { proyek: number }
}

// P7 Proyek
export interface P7Proyek {
    id: string
    dimensiId: string
    tahunAjaranId: string
    namaProyek: string
    tema?: string
    fase: Fase
    durasiMinggu: number
    tanggalMulai?: string
    tanggalSelesai?: string
    status: StatusProyek
    createdAt: string
    updatedAt: string
    dimensi?: DimensiP7
    tahunAjaran?: AcademicYear
    tim?: TimP7[]
    _count?: { tim: number }
}

// Tim P7
export interface TimP7 {
    id: string
    proyekId: string
    guruFasilitatorId: string
    namaTim: string
    siswaIds: string[]
    milestone?: { name: string; status: string; dueDate: string; evidences?: string[] }[]
    createdAt: string
    updatedAt: string
    proyek?: P7Proyek
    guruFasilitator?: Teacher
    penilaian?: P7PenilaianTim[]
}

// Penilaian Tim P7
export interface P7PenilaianTim {
    id: string
    timId: string
    siswaId: string
    dimensiScores: { D1: number; D2: number; D3: number; D4: number; D5: number; D6: number }
    nilaiTotal: number
    catatan?: string
    evaluatedAt: string
    tim?: TimP7
    siswa?: Student
}

// Portfolio Siswa
export interface PortofolioSiswa {
    id: string
    siswaId: string
    tahunAjaranId: string
    dataJson: {
        formatif?: { id: string; tanggal: string; jenis: string; tingkatPencapaian: string; mataPelajaran?: string }[]
        sumatif?: { id: string; tanggal: string; jenis: string; nilaiAkhir?: number; tingkatPencapaian?: string; mataPelajaran?: string }[]
        p7?: { id: string; namaProyek?: string; dimensi?: string; nilaiTotal: number; evaluatedAt: string }[]
        achievements?: Achievement[]
    }
    generatedAt: string
    updatedAt: string
    siswa?: Student
    tahunAjaran?: AcademicYear
}

// Heatmap Data
export interface HeatmapEntry {
    student: Student
    subjects: {
        [subjectName: string]: {
            count: number
            levels: { BB: number; MB: number; BSH: number; BSB: number }
        }
    }
}
