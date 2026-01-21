// Student API service for import/export operations
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export interface ImportStudentData {
    nis: string
    nisn?: string
    nik?: string
    name: string
    gender?: 'MALE' | 'FEMALE'
    birthPlace?: string
    birthDate?: string
    address?: string
    phone?: string
    email?: string
}

export interface ImportResult {
    message: string
    success: number
    failed: number
    skipped: number
    errors: string[]
}

export interface DapodikSyncResult {
    success: boolean
    message: string
    totalFound: number
    imported: number
    skipped: number
    failed: number
    students: object[]
}

/**
 * Download import template
 */
export async function downloadImportTemplate(): Promise<void> {
    const response = await fetch(`${API_BASE}/api/students/import/template`)

    if (!response.ok) {
        throw new Error('Failed to download template')
    }

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'template_import_siswa.csv'
    a.click()
    URL.revokeObjectURL(url)
}

/**
 * Import students from parsed data
 */
export async function importStudents(
    students: ImportStudentData[],
    updateExisting = false
): Promise<ImportResult> {
    const response = await fetch(`${API_BASE}/api/students/import`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ students, updateExisting }),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Import failed')
    }

    return response.json()
}

/**
 * Export students to CSV or JSON
 */
export async function exportStudents(options: {
    format: 'csv' | 'json'
    classFilter?: string
    fields?: string[]
}): Promise<void> {
    const params = new URLSearchParams()
    params.set('format', options.format)
    if (options.classFilter) params.set('classFilter', options.classFilter)
    if (options.fields?.length) params.set('fields', options.fields.join(','))

    const response = await fetch(`${API_BASE}/api/students/export?${params}`)

    if (!response.ok) {
        throw new Error('Export failed')
    }

    if (options.format === 'json') {
        const data = await response.json()
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `data_siswa_${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
    } else {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `data_siswa_${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }
}

/**
 * Sync students from Dapodik
 */
export async function syncFromDapodik(options: {
    npsn: string
    tingkat?: string
}): Promise<DapodikSyncResult> {
    const response = await fetch(`${API_BASE}/api/students/dapodik/sync`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Dapodik sync failed')
    }

    return response.json()
}

/**
 * Parse CSV content to student data
 */
export function parseCSV(csvContent: string): ImportStudentData[] {
    const lines = csvContent.split('\n')
    if (lines.length < 2) return []

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const students: ImportStudentData[] = []

    // Map CSV headers to field names
    const headerMap: Record<string, string> = {
        'nis': 'nis',
        'nisn': 'nisn',
        'nik': 'nik',
        'nama lengkap': 'name',
        'nama': 'name',
        'jenis kelamin': 'gender',
        'jenis kelamin (male/female)': 'gender',
        'tempat lahir': 'birthPlace',
        'tanggal lahir': 'birthDate',
        'tanggal lahir (yyyy-mm-dd)': 'birthDate',
        'alamat': 'address',
        'no hp': 'phone',
        'email': 'email',
    }

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        const values = line.split(',').map(v => v.replace(/^"|"$/g, '').trim())
        const student: Record<string, string> = {}

        headers.forEach((header, index) => {
            const fieldName = headerMap[header] || header
            if (values[index]) {
                student[fieldName] = values[index]
            }
        })

        // Validate required fields
        if (student.nis && student.name) {
            // Convert gender format
            if (student.gender) {
                student.gender = student.gender.toUpperCase() === 'L' || student.gender.toUpperCase() === 'MALE'
                    ? 'MALE'
                    : 'FEMALE'
            }

            students.push(student as unknown as ImportStudentData)
        }
    }

    return students
}
