/**
 * Kurikulum Merdeka Hooks
 * Uses shared hooks patterns for consistency and code reuse
 */

import { useFetch, useMutations } from './useShared'
import type {
    CapaianPembelajaran,
    ModulAjar,
    PenilaianFormatif,
    PenilaianSumatif,
    PerformanceTask,
    DimensiP7,
    P7Proyek,
    TimP7,
    P7PenilaianTim,
    PortofolioSiswa,
    HeatmapEntry,
    Fase,
    TingkatPencapaian,
    JenisPenilaianFormatif,
    JenisPenilaianSumatif,
    StatusProyek
} from '../types'

// ============================================
// CAPAIAN PEMBELAJARAN HOOKS
// ============================================

interface CreateCPData {
    kodeCP: string
    fase: Fase
    mataPelajaranId: string
    deskripsi: string
}

interface UpdateCPData {
    kodeCP?: string
    fase?: Fase
    mataPelajaranId?: string
    deskripsi?: string
}

export function useCapaianPembelajaran(fase?: Fase, mataPelajaranId?: string) {
    const params: Record<string, string | undefined> = {}
    if (fase) params.fase = fase
    if (mataPelajaranId) params.mataPelajaranId = mataPelajaranId

    const { data, loading, error, refetch } = useFetch<CapaianPembelajaran[]>(
        '/api/kurikulum-merdeka/cp',
        params,
        { initialData: [] }
    )

    const mutations = useMutations<CapaianPembelajaran, CreateCPData, UpdateCPData>(
        '/api/kurikulum-merdeka/cp'
    )

    return {
        cpList: data,
        loading,
        error,
        refetch,
        ...mutations
    }
}

export function useCapaianPembelajaranDetail(id?: string) {
    const { data, loading, error, refetch } = useFetch<CapaianPembelajaran | null>(
        id ? `/api/kurikulum-merdeka/cp/${id}` : '',
        undefined,
        { initialData: null, fetchOnMount: !!id }
    )

    return { cp: data, loading, error, refetch }
}

// ============================================
// MODUL AJAR HOOKS
// ============================================

interface CreateModulAjarData {
    cpId: string
    guruId: string
    tahunAjaranId: string
    namaModul: string
    fase: Fase
    kelas: number
    deskripsiUmum?: string
    targetPesertaDidik?: string
    profilPelajarPancasila?: string[]
    kompetensiAwal?: string
    saranaPrasarana?: string[]
    modelPembelajaran?: string
    tujuanPembelajaran?: object[]
    alurTujuanPembelajaran?: string
    alokasiWaktuJam?: number
    jumlahPertemuan?: number
    pertanyaanPemantik?: string[]
    pemahamanBermakna?: string
    kegiatanPembelajaran?: object[]
    rencanaDiferensiasi?: object
    rencanaAsesmen?: object
    lkpd?: object[]
    bahanBacaan?: object[]
    glosarium?: object[]
    daftarPustaka?: string[]
    status?: string
}

interface UpdateModulAjarData {
    namaModul?: string
    fase?: Fase
    kelas?: number
    deskripsiUmum?: string
    targetPesertaDidik?: string
    profilPelajarPancasila?: string[]
    kompetensiAwal?: string
    saranaPrasarana?: string[]
    modelPembelajaran?: string
    tujuanPembelajaran?: object[]
    alurTujuanPembelajaran?: string
    alokasiWaktuJam?: number
    jumlahPertemuan?: number
    pertanyaanPemantik?: string[]
    pemahamanBermakna?: string
    kegiatanPembelajaran?: object[]
    rencanaDiferensiasi?: object
    rencanaAsesmen?: object
    lkpd?: object[]
    bahanBacaan?: object[]
    glosarium?: object[]
    daftarPustaka?: string[]
    status?: string
}

export function useModulAjar(cpId?: string, guruId?: string, tahunAjaranId?: string, status?: string) {
    const params: Record<string, string | undefined> = {}
    if (cpId) params.cpId = cpId
    if (guruId) params.guruId = guruId
    if (tahunAjaranId) params.tahunAjaranId = tahunAjaranId
    if (status) params.status = status

    const { data, loading, error, refetch } = useFetch<ModulAjar[]>(
        '/api/kurikulum-merdeka/modul-ajar',
        params,
        { initialData: [] }
    )

    const mutations = useMutations<ModulAjar, CreateModulAjarData, UpdateModulAjarData>(
        '/api/kurikulum-merdeka/modul-ajar'
    )

    return {
        modulAjarList: data,
        loading,
        error,
        refetch,
        ...mutations
    }
}

export function useModulAjarDetail(id?: string) {
    const { data, loading, error, refetch } = useFetch<ModulAjar | null>(
        id ? `/api/kurikulum-merdeka/modul-ajar/${id}` : '',
        undefined,
        { initialData: null, fetchOnMount: !!id }
    )

    return { modulAjar: data, loading, error, refetch }
}

// ============================================
// PENILAIAN FORMATIF HOOKS
// ============================================

interface CreatePenilaianFormatifData {
    siswaId: string
    modulAjarId: string
    jenis: JenisPenilaianFormatif
    nilai?: string
    tingkatPencapaian: TingkatPencapaian
    catatan?: string
    tanggal?: string
}

export function usePenilaianFormatif(siswaId?: string, modulAjarId?: string, jenis?: JenisPenilaianFormatif) {
    const params: Record<string, string | undefined> = {}
    if (siswaId) params.siswaId = siswaId
    if (modulAjarId) params.modulAjarId = modulAjarId
    if (jenis) params.jenis = jenis

    const { data, loading, error, refetch } = useFetch<PenilaianFormatif[]>(
        '/api/kurikulum-merdeka/penilaian/formatif',
        params,
        { initialData: [] }
    )

    const mutations = useMutations<PenilaianFormatif, CreatePenilaianFormatifData, never>(
        '/api/kurikulum-merdeka/penilaian/formatif'
    )

    return {
        penilaianFormatifList: data,
        loading,
        error,
        refetch,
        create: mutations.create
    }
}

// ============================================
// PENILAIAN SUMATIF HOOKS
// ============================================

interface CreatePenilaianSumatifData {
    siswaId: string
    modulAjarId: string
    jenis: JenisPenilaianSumatif
    nilaiTes?: number
    nilaiPerformanceTask?: number
    nilaiAkhir?: number
    tingkatPencapaian?: TingkatPencapaian
    tanggal?: string
}

export function usePenilaianSumatif(siswaId?: string, modulAjarId?: string, jenis?: JenisPenilaianSumatif) {
    const params: Record<string, string | undefined> = {}
    if (siswaId) params.siswaId = siswaId
    if (modulAjarId) params.modulAjarId = modulAjarId
    if (jenis) params.jenis = jenis

    const { data, loading, error, refetch } = useFetch<PenilaianSumatif[]>(
        '/api/kurikulum-merdeka/penilaian/sumatif',
        params,
        { initialData: [] }
    )

    const mutations = useMutations<PenilaianSumatif, CreatePenilaianSumatifData, never>(
        '/api/kurikulum-merdeka/penilaian/sumatif'
    )

    return {
        penilaianSumatifList: data,
        loading,
        error,
        refetch,
        create: mutations.create
    }
}

// ============================================
// PERFORMANCE TASK HOOKS
// ============================================

interface CreatePerformanceTaskData {
    siswaId: string
    modulAjarId: string
    judulTugas: string
    rubrikId?: string
    fileEvidences?: object[]
}

interface GradePerformanceTaskData {
    nilai?: number
    komentarGuru?: string
    fileEvidences?: object[]
}

export function usePerformanceTasks(siswaId?: string, modulAjarId?: string) {
    const params: Record<string, string | undefined> = {}
    if (siswaId) params.siswaId = siswaId
    if (modulAjarId) params.modulAjarId = modulAjarId

    const { data, loading, error, refetch } = useFetch<PerformanceTask[]>(
        '/api/kurikulum-merdeka/performance-task',
        params,
        { initialData: [] }
    )

    const mutations = useMutations<PerformanceTask, CreatePerformanceTaskData, GradePerformanceTaskData>(
        '/api/kurikulum-merdeka/performance-task'
    )

    return {
        performanceTasks: data,
        loading,
        error,
        refetch,
        ...mutations
    }
}

// ============================================
// DIMENSI P7 HOOKS
// ============================================

interface CreateDimensiP7Data {
    kode: string
    namaDimensi: string
    deskripsi?: string
    elemen: string[]
}

export function useDimensiP7() {
    const { data, loading, error, refetch } = useFetch<DimensiP7[]>(
        '/api/kurikulum-merdeka/dimensi-p7',
        undefined,
        { initialData: [] }
    )

    const mutations = useMutations<DimensiP7, CreateDimensiP7Data, never>(
        '/api/kurikulum-merdeka/dimensi-p7'
    )

    return {
        dimensiP7List: data,
        dimensiList: data,  // Alias for convenience
        loading,
        error,
        refetch,
        create: mutations.create
    }
}

// ============================================
// P7 PROYEK HOOKS
// ============================================

interface CreateP7ProyekData {
    dimensiId: string
    tahunAjaranId: string
    namaProyek: string
    tema?: string
    fase: Fase
    durasiMinggu: number
    tanggalMulai?: string
    tanggalSelesai?: string
    status?: StatusProyek
}

interface UpdateP7ProyekStatusData {
    status: StatusProyek
    tanggalMulai?: string
    tanggalSelesai?: string
}

export function useP7Proyek(tahunAjaranId?: string, fase?: Fase, status?: StatusProyek, dimensiId?: string) {
    const params: Record<string, string | undefined> = {}
    if (tahunAjaranId) params.tahunAjaranId = tahunAjaranId
    if (fase) params.fase = fase
    if (status) params.status = status
    if (dimensiId) params.dimensiId = dimensiId

    const { data, loading, error, refetch } = useFetch<P7Proyek[]>(
        '/api/kurikulum-merdeka/p7-proyek',
        params,
        { initialData: [] }
    )

    const mutations = useMutations<P7Proyek, CreateP7ProyekData, UpdateP7ProyekStatusData>(
        '/api/kurikulum-merdeka/p7-proyek'
    )

    return {
        p7ProyekList: data,
        loading,
        error,
        refetch,
        ...mutations
    }
}

export function useP7ProyekDetail(id?: string) {
    const { data, loading, error, refetch } = useFetch<P7Proyek | null>(
        id ? `/api/kurikulum-merdeka/p7-proyek/${id}` : '',
        undefined,
        { initialData: null, fetchOnMount: !!id }
    )

    return { proyek: data, loading, error, refetch }
}

// ============================================
// TIM P7 HOOKS
// ============================================

import { useState, useCallback } from 'react'
import { api } from '../lib/api'

interface CreateTimP7Data {
    guruFasilitatorId: string
    namaTim: string
    siswaIds: string[]
}

interface GenerateTimP7Data {
    siswaIds: string[]
    teamSize: number
    guruFasilitatorId: string
}

export function useTimP7(proyekId: string) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const createTim = useCallback(async (data: CreateTimP7Data) => {
        setLoading(true)
        setError(null)
        try {
            const result = await api.post<TimP7>(
                `/api/kurikulum-merdeka/p7-proyek/${proyekId}/tim`,
                data
            )
            return result
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to create team'
            setError(message)
            return null
        } finally {
            setLoading(false)
        }
    }, [proyekId])

    const generateTim = useCallback(async (data: GenerateTimP7Data) => {
        setLoading(true)
        setError(null)
        try {
            const result = await api.post<{ created: number; teams: TimP7[] }>(
                `/api/kurikulum-merdeka/p7-proyek/${proyekId}/tim/generate`,
                data
            )
            return result
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to generate teams'
            setError(message)
            return null
        } finally {
            setLoading(false)
        }
    }, [proyekId])

    return { createTim, generateTim, loading, error }
}

// ============================================
// P7 PENILAIAN HOOKS
// ============================================

interface SubmitP7PenilaianData {
    siswaId: string
    dimensiScores: { D1: number; D2: number; D3: number; D4: number; D5: number; D6: number }
    catatan?: string
}

export function useP7Penilaian(timId: string) {
    const { data, loading, error, refetch } = useFetch<P7PenilaianTim[]>(
        `/api/kurikulum-merdeka/p7-tim/${timId}/penilaian`,
        undefined,
        { initialData: [] }
    )

    const [submitLoading, setSubmitLoading] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    const submitPenilaian = useCallback(async (penilaianData: SubmitP7PenilaianData) => {
        setSubmitLoading(true)
        setSubmitError(null)
        try {
            const result = await api.post<P7PenilaianTim>(
                `/api/kurikulum-merdeka/p7-tim/${timId}/penilaian`,
                penilaianData
            )
            return result
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to submit penilaian'
            setSubmitError(message)
            return null
        } finally {
            setSubmitLoading(false)
        }
    }, [timId])

    return {
        penilaianList: data,
        loading,
        error,
        refetch,
        submitPenilaian,
        submitLoading,
        submitError
    }
}

// ============================================
// PORTFOLIO HOOKS
// ============================================

export function usePortofolio(siswaId: string, tahunAjaranId?: string) {
    const params: Record<string, string | undefined> = {}
    if (tahunAjaranId) params.tahunAjaranId = tahunAjaranId

    const { data, loading, error, refetch } = useFetch<PortofolioSiswa | null>(
        `/api/kurikulum-merdeka/portofolio/${siswaId}`,
        params,
        { initialData: null }
    )

    const [generateLoading, setGenerateLoading] = useState(false)
    const [generateError, setGenerateError] = useState<string | null>(null)

    const generatePortofolio = useCallback(async (tahunAjaranIdToGenerate: string) => {
        setGenerateLoading(true)
        setGenerateError(null)
        try {
            const result = await api.post<PortofolioSiswa>(
                `/api/kurikulum-merdeka/portofolio/generate/${siswaId}`,
                { tahunAjaranId: tahunAjaranIdToGenerate }
            )
            return result
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to generate portfolio'
            setGenerateError(message)
            return null
        } finally {
            setGenerateLoading(false)
        }
    }, [siswaId])

    return {
        portofolio: data,
        loading,
        error,
        refetch,
        generatePortofolio,
        generateLoading,
        generateError
    }
}

// ============================================
// ANALYTICS HOOKS
// ============================================

export function useHeatmapData(kelasId: string, tahunAjaranId: string) {
    const { data, loading, error, refetch } = useFetch<HeatmapEntry[]>(
        `/api/kurikulum-merdeka/analytics/heatmap/${kelasId}/${tahunAjaranId}`,
        undefined,
        { initialData: [] }
    )

    return { heatmapData: data, loading, error, refetch }
}
