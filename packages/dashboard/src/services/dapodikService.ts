// Mock Dapodik API Service
// In production, this would connect to the actual Dapodik web service

export interface DapodikStudent {
    peserta_didik_id: string
    nisn: string
    nik: string
    nama: string
    tempat_lahir: string
    tanggal_lahir: string
    jenis_kelamin: 'L' | 'P'
    agama: string
    alamat_jalan: string
    rt: string
    rw: string
    dusun: string
    kelurahan: string
    kecamatan: string
    kode_pos: string
    nama_ayah: string
    nama_ibu: string
    pekerjaan_ayah: string
    pekerjaan_ibu: string
    no_telepon: string
    email: string
}

export interface DapodikSyncResult {
    success: boolean
    message: string
    totalFound: number
    totalImported: number
    totalSkipped: number
    totalFailed: number
    students: DapodikStudent[]
    errors: string[]
}

// Mock data simulating Dapodik response
const mockDapodikStudents: DapodikStudent[] = [
    {
        peserta_didik_id: 'DP001',
        nisn: '0012345678',
        nik: '3171012345678901',
        nama: 'Ahmad Dapodik',
        tempat_lahir: 'Jakarta',
        tanggal_lahir: '2008-05-15',
        jenis_kelamin: 'L',
        agama: 'Islam',
        alamat_jalan: 'Jl. Pendidikan No. 1',
        rt: '001',
        rw: '002',
        dusun: '-',
        kelurahan: 'Menteng',
        kecamatan: 'Menteng',
        kode_pos: '10310',
        nama_ayah: 'Budi Santoso',
        nama_ibu: 'Siti Rahayu',
        pekerjaan_ayah: 'PNS',
        pekerjaan_ibu: 'Guru',
        no_telepon: '081234567890',
        email: 'ahmad.dapodik@email.com',
    },
    {
        peserta_didik_id: 'DP002',
        nisn: '0012345679',
        nik: '3171012345678902',
        nama: 'Putri Dapodik',
        tempat_lahir: 'Bandung',
        tanggal_lahir: '2008-08-20',
        jenis_kelamin: 'P',
        agama: 'Islam',
        alamat_jalan: 'Jl. Sekolah No. 5',
        rt: '003',
        rw: '004',
        dusun: '-',
        kelurahan: 'Gambir',
        kecamatan: 'Gambir',
        kode_pos: '10110',
        nama_ayah: 'Ahmad Wijaya',
        nama_ibu: 'Dewi Lestari',
        pekerjaan_ayah: 'Wiraswasta',
        pekerjaan_ibu: 'Ibu Rumah Tangga',
        no_telepon: '081234567891',
        email: 'putri.dapodik@email.com',
    },
    {
        peserta_didik_id: 'DP003',
        nisn: '0012345680',
        nik: '3171012345678903',
        nama: 'Budi Dapodik',
        tempat_lahir: 'Surabaya',
        tanggal_lahir: '2008-03-10',
        jenis_kelamin: 'L',
        agama: 'Kristen',
        alamat_jalan: 'Jl. Belajar No. 10',
        rt: '005',
        rw: '006',
        dusun: '-',
        kelurahan: 'Senen',
        kecamatan: 'Senen',
        kode_pos: '10410',
        nama_ayah: 'Joko Susilo',
        nama_ibu: 'Maria Kristina',
        pekerjaan_ayah: 'Dokter',
        pekerjaan_ibu: 'Apoteker',
        no_telepon: '081234567892',
        email: 'budi.dapodik@email.com',
    },
]

class DapodikService {
    // These are used in production for actual API calls
    private _baseUrl = 'https://dapodik.example.com/api/v1'
    private _npsn = '20100001'
    private _token: string | null = null

    constructor() {
        // In production, these would be loaded from environment
        console.log('DapodikService initialized')
    }

    // Authenticate with Dapodik
    async authenticate(_username: string, _password: string): Promise<boolean> {
        // In production, this would make actual API call
        console.log('Authenticating with Dapodik...')
        await this.delay(1000) // Simulate network delay

        // Mock authentication success
        this._token = 'mock-dapodik-token-' + Date.now()
        return true
    }

    // Sync students from Dapodik
    async syncStudents(options?: {
        tingkat?: string
        kelas?: string
        rombelId?: string
    }): Promise<DapodikSyncResult> {
        console.log('Syncing students from Dapodik...', options)
        await this.delay(2000) // Simulate network delay

        // Filter mock data based on options
        let students = [...mockDapodikStudents]

        // In production, this would fetch from actual Dapodik API
        // const response = await fetch(`${this.baseUrl}/peserta_didik?npsn=${this.npsn}`, {
        //   headers: { Authorization: `Bearer ${this.token}` }
        // })

        return {
            success: true,
            message: 'Sinkronisasi berhasil',
            totalFound: students.length,
            totalImported: students.length,
            totalSkipped: 0,
            totalFailed: 0,
            students,
            errors: [],
        }
    }

    // Get single student by NISN
    async getStudentByNISN(nisn: string): Promise<DapodikStudent | null> {
        await this.delay(500)
        return mockDapodikStudents.find(s => s.nisn === nisn) || null
    }

    // Check connection to Dapodik
    async checkConnection(): Promise<boolean> {
        await this.delay(500)
        return true
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}

export const dapodikService = new DapodikService()
export default dapodikService
