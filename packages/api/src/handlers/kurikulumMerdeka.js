import { prisma } from '../plugins/prisma.js'

// ============================================
// CAPAIAN PEMBELAJARAN (CP) HANDLERS
// ============================================

export const listCP = async (request, h) => {
    const { fase, mataPelajaranId } = request.query

    const where = {}
    if (fase) where.fase = fase
    if (mataPelajaranId) where.mataPelajaranId = mataPelajaranId

    const capaianPembelajaran = await prisma.capaianPembelajaran.findMany({
        where,
        include: {
            mataPelajaran: true,
            _count: { select: { modulAjar: true } }
        },
        orderBy: [{ fase: 'asc' }, { kodeCP: 'asc' }]
    })

    return h.response(capaianPembelajaran).code(200)
}

export const getCP = async (request, h) => {
    const { id } = request.params

    const cp = await prisma.capaianPembelajaran.findUnique({
        where: { id },
        include: {
            mataPelajaran: true,
            modulAjar: {
                include: { guru: true }
            }
        }
    })

    if (!cp) {
        return h.response({ error: 'Capaian Pembelajaran not found' }).code(404)
    }

    return h.response(cp).code(200)
}

export const createCP = async (request, h) => {
    const { kodeCP, fase, mataPelajaranId, deskripsi } = request.payload

    const cp = await prisma.capaianPembelajaran.create({
        data: { kodeCP, fase, mataPelajaranId, deskripsi },
        include: { mataPelajaran: true }
    })

    return h.response(cp).code(201)
}

export const updateCP = async (request, h) => {
    const { id } = request.params
    const { kodeCP, fase, mataPelajaranId, deskripsi } = request.payload

    const cp = await prisma.capaianPembelajaran.update({
        where: { id },
        data: { kodeCP, fase, mataPelajaranId, deskripsi },
        include: { mataPelajaran: true }
    })

    return h.response(cp).code(200)
}

export const deleteCP = async (request, h) => {
    const { id } = request.params

    await prisma.capaianPembelajaran.delete({ where: { id } })

    return h.response({ message: 'Capaian Pembelajaran deleted successfully' }).code(200)
}

// ============================================
// MODUL AJAR HANDLERS
// ============================================

export const listModulAjar = async (request, h) => {
    const { cpId, guruId, tahunAjaranId, status } = request.query

    const where = {}
    if (cpId) where.cpId = cpId
    if (guruId) where.guruId = guruId
    if (tahunAjaranId) where.tahunAjaranId = tahunAjaranId
    if (status) where.status = status

    const modulAjar = await prisma.modulAjar.findMany({
        where,
        include: {
            cp: { include: { mataPelajaran: true } },
            guru: true,
            tahunAjaran: true,
            _count: {
                select: {
                    penilaianFormatif: true,
                    penilaianSumatif: true,
                    performanceTasks: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return h.response(modulAjar).code(200)
}

export const getModulAjar = async (request, h) => {
    const { id } = request.params

    const modul = await prisma.modulAjar.findUnique({
        where: { id },
        include: {
            cp: { include: { mataPelajaran: true } },
            guru: true,
            tahunAjaran: true,
            penilaianFormatif: { include: { siswa: true } },
            penilaianSumatif: { include: { siswa: true } },
            performanceTasks: { include: { siswa: true } }
        }
    })

    if (!modul) {
        return h.response({ error: 'Modul Ajar not found' }).code(404)
    }

    return h.response(modul).code(200)
}

export const createModulAjar = async (request, h) => {
    const data = request.payload

    const modul = await prisma.modulAjar.create({
        data: {
            cpId: data.cpId,
            guruId: data.guruId,
            tahunAjaranId: data.tahunAjaranId,
            // Informasi Umum
            namaModul: data.namaModul,
            fase: data.fase,
            kelas: parseInt(data.kelas),
            deskripsiUmum: data.deskripsiUmum,
            targetPesertaDidik: data.targetPesertaDidik,
            profilPelajarPancasila: data.profilPelajarPancasila || [],
            kompetensiAwal: data.kompetensiAwal,
            saranaPrasarana: data.saranaPrasarana || [],
            modelPembelajaran: data.modelPembelajaran || 'TATAP_MUKA',
            // Capaian & Tujuan
            tujuanPembelajaran: data.tujuanPembelajaran,
            alurTujuanPembelajaran: data.alurTujuanPembelajaran,
            // Rancangan Pembelajaran
            alokasiWaktuJam: parseInt(data.alokasiWaktuJam) || 2,
            jumlahPertemuan: parseInt(data.jumlahPertemuan) || 1,
            pertanyaanPemantik: data.pertanyaanPemantik || [],
            pemahamanBermakna: data.pemahamanBermakna,
            kegiatanPembelajaran: data.kegiatanPembelajaran,
            rencanaDiferensiasi: data.rencanaDiferensiasi,
            rencanaAsesmen: data.rencanaAsesmen,
            // Lampiran
            lkpd: data.lkpd,
            bahanBacaan: data.bahanBacaan,
            glosarium: data.glosarium,
            daftarPustaka: data.daftarPustaka || [],
            // Meta
            status: data.status || 'DRAFT'
        },
        include: { cp: true, guru: true }
    })

    return h.response(modul).code(201)
}

export const updateModulAjar = async (request, h) => {
    const { id } = request.params
    const data = request.payload

    const modul = await prisma.modulAjar.update({
        where: { id },
        data: {
            // Informasi Umum
            namaModul: data.namaModul,
            fase: data.fase,
            kelas: data.kelas !== undefined ? parseInt(data.kelas) : undefined,
            deskripsiUmum: data.deskripsiUmum,
            targetPesertaDidik: data.targetPesertaDidik,
            profilPelajarPancasila: data.profilPelajarPancasila,
            kompetensiAwal: data.kompetensiAwal,
            saranaPrasarana: data.saranaPrasarana,
            modelPembelajaran: data.modelPembelajaran,
            // Capaian & Tujuan
            tujuanPembelajaran: data.tujuanPembelajaran,
            alurTujuanPembelajaran: data.alurTujuanPembelajaran,
            // Rancangan Pembelajaran
            alokasiWaktuJam: data.alokasiWaktuJam !== undefined ? parseInt(data.alokasiWaktuJam) : undefined,
            jumlahPertemuan: data.jumlahPertemuan !== undefined ? parseInt(data.jumlahPertemuan) : undefined,
            pertanyaanPemantik: data.pertanyaanPemantik,
            pemahamanBermakna: data.pemahamanBermakna,
            kegiatanPembelajaran: data.kegiatanPembelajaran,
            rencanaDiferensiasi: data.rencanaDiferensiasi,
            rencanaAsesmen: data.rencanaAsesmen,
            // Lampiran
            lkpd: data.lkpd,
            bahanBacaan: data.bahanBacaan,
            glosarium: data.glosarium,
            daftarPustaka: data.daftarPustaka,
            // Meta
            status: data.status
        },
        include: { cp: true, guru: true }
    })

    return h.response(modul).code(200)
}

export const deleteModulAjar = async (request, h) => {
    const { id } = request.params

    await prisma.modulAjar.delete({ where: { id } })

    return h.response({ message: 'Modul Ajar deleted successfully' }).code(200)
}

// ============================================
// PENILAIAN FORMATIF HANDLERS
// ============================================

export const listPenilaianFormatif = async (request, h) => {
    const { siswaId, modulAjarId, jenis } = request.query

    const where = {}
    if (siswaId) where.siswaId = siswaId
    if (modulAjarId) where.modulAjarId = modulAjarId
    if (jenis) where.jenis = jenis

    const penilaian = await prisma.penilaianFormatif.findMany({
        where,
        include: {
            siswa: true,
            modulAjar: { include: { cp: { include: { mataPelajaran: true } } } }
        },
        orderBy: { tanggal: 'desc' }
    })

    return h.response(penilaian).code(200)
}

export const createPenilaianFormatif = async (request, h) => {
    const data = request.payload

    const penilaian = await prisma.penilaianFormatif.create({
        data: {
            siswaId: data.siswaId,
            modulAjarId: data.modulAjarId,
            jenis: data.jenis,
            nilai: data.nilai,
            tingkatPencapaian: data.tingkatPencapaian,
            catatan: data.catatan,
            tanggal: data.tanggal ? new Date(data.tanggal) : new Date()
        },
        include: { siswa: true, modulAjar: true }
    })

    return h.response(penilaian).code(201)
}

export const bulkCreatePenilaianFormatif = async (request, h) => {
    const { penilaianList } = request.payload

    const results = await Promise.all(
        penilaianList.map(data =>
            prisma.penilaianFormatif.create({
                data: {
                    siswaId: data.siswaId,
                    modulAjarId: data.modulAjarId,
                    jenis: data.jenis,
                    nilai: data.nilai,
                    tingkatPencapaian: data.tingkatPencapaian,
                    catatan: data.catatan,
                    tanggal: data.tanggal ? new Date(data.tanggal) : new Date()
                }
            })
        )
    )

    return h.response({ created: results.length }).code(201)
}

// ============================================
// PENILAIAN SUMATIF HANDLERS
// ============================================

export const listPenilaianSumatif = async (request, h) => {
    const { siswaId, modulAjarId, jenis } = request.query

    const where = {}
    if (siswaId) where.siswaId = siswaId
    if (modulAjarId) where.modulAjarId = modulAjarId
    if (jenis) where.jenis = jenis

    const penilaian = await prisma.penilaianSumatif.findMany({
        where,
        include: {
            siswa: true,
            modulAjar: { include: { cp: { include: { mataPelajaran: true } } } }
        },
        orderBy: { tanggal: 'desc' }
    })

    return h.response(penilaian).code(200)
}

/**
 * Calculate tingkat pencapaian based on nilai akhir
 */
const calculateTingkatPencapaian = (nilaiAkhir) => {
    if (nilaiAkhir >= 90) return 'BSB'
    if (nilaiAkhir >= 75) return 'BSH'
    if (nilaiAkhir >= 60) return 'MB'
    return 'BB'
}

export const createPenilaianSumatif = async (request, h) => {
    const data = request.payload

    // Auto-calculate nilaiAkhir if both scores provided
    let nilaiAkhir = data.nilaiAkhir
    if (data.nilaiTes && data.nilaiPerformanceTask && !nilaiAkhir) {
        nilaiAkhir = (parseFloat(data.nilaiTes) * 0.6) + (parseFloat(data.nilaiPerformanceTask) * 0.4)
    }

    // Auto-determine tingkat pencapaian
    let tingkatPencapaian = data.tingkatPencapaian
    if (nilaiAkhir && !tingkatPencapaian) {
        tingkatPencapaian = calculateTingkatPencapaian(nilaiAkhir)
    }

    const penilaian = await prisma.penilaianSumatif.create({
        data: {
            siswaId: data.siswaId,
            modulAjarId: data.modulAjarId,
            jenis: data.jenis,
            nilaiTes: data.nilaiTes,
            nilaiPerformanceTask: data.nilaiPerformanceTask,
            nilaiAkhir,
            tingkatPencapaian,
            tanggal: data.tanggal ? new Date(data.tanggal) : new Date()
        },
        include: { siswa: true, modulAjar: true }
    })

    return h.response(penilaian).code(201)
}

// ============================================
// PERFORMANCE TASK HANDLERS
// ============================================

export const listPerformanceTasks = async (request, h) => {
    const { siswaId, modulAjarId } = request.query

    const where = {}
    if (siswaId) where.siswaId = siswaId
    if (modulAjarId) where.modulAjarId = modulAjarId

    const tasks = await prisma.performanceTask.findMany({
        where,
        include: {
            siswa: true,
            modulAjar: { include: { cp: { include: { mataPelajaran: true } } } }
        },
        orderBy: { createdAt: 'desc' }
    })

    return h.response(tasks).code(200)
}

export const createPerformanceTask = async (request, h) => {
    const data = request.payload

    const task = await prisma.performanceTask.create({
        data: {
            siswaId: data.siswaId,
            modulAjarId: data.modulAjarId,
            judulTugas: data.judulTugas,
            rubrikId: data.rubrikId,
            fileEvidences: data.fileEvidences
        },
        include: { siswa: true, modulAjar: true }
    })

    return h.response(task).code(201)
}

export const gradePerformanceTask = async (request, h) => {
    const { id } = request.params
    const { nilai, komentarGuru, fileEvidences } = request.payload

    const task = await prisma.performanceTask.update({
        where: { id },
        data: {
            nilai,
            komentarGuru,
            fileEvidences
        },
        include: { siswa: true, modulAjar: true }
    })

    return h.response(task).code(200)
}

// ============================================
// DIMENSI P7 HANDLERS
// ============================================

export const listDimensiP7 = async (request, h) => {
    const dimensi = await prisma.dimensiP7.findMany({
        orderBy: { kode: 'asc' },
        include: {
            _count: { select: { proyek: true } }
        }
    })

    return h.response(dimensi).code(200)
}

export const createDimensiP7 = async (request, h) => {
    const { kode, namaDimensi, deskripsi, elemen } = request.payload

    const dimensi = await prisma.dimensiP7.create({
        data: { kode, namaDimensi, deskripsi, elemen }
    })

    return h.response(dimensi).code(201)
}

// ============================================
// P7 PROYEK HANDLERS
// ============================================

export const listP7Proyek = async (request, h) => {
    const { tahunAjaranId, fase, status, dimensiId } = request.query

    const where = {}
    if (tahunAjaranId) where.tahunAjaranId = tahunAjaranId
    if (fase) where.fase = fase
    if (status) where.status = status
    if (dimensiId) where.dimensiId = dimensiId

    const proyek = await prisma.p7Proyek.findMany({
        where,
        include: {
            dimensi: true,
            tahunAjaran: true,
            _count: { select: { tim: true } }
        },
        orderBy: { createdAt: 'desc' }
    })

    return h.response(proyek).code(200)
}

export const getP7Proyek = async (request, h) => {
    const { id } = request.params

    const proyek = await prisma.p7Proyek.findUnique({
        where: { id },
        include: {
            dimensi: true,
            tahunAjaran: true,
            tim: {
                include: {
                    guruFasilitator: true,
                    penilaian: { include: { siswa: true } }
                }
            }
        }
    })

    if (!proyek) {
        return h.response({ error: 'P7 Proyek not found' }).code(404)
    }

    return h.response(proyek).code(200)
}

export const createP7Proyek = async (request, h) => {
    const data = request.payload

    const proyek = await prisma.p7Proyek.create({
        data: {
            dimensiId: data.dimensiId,
            tahunAjaranId: data.tahunAjaranId,
            namaProyek: data.namaProyek,
            tema: data.tema,
            fase: data.fase,
            durasiMinggu: data.durasiMinggu,
            tanggalMulai: data.tanggalMulai ? new Date(data.tanggalMulai) : null,
            tanggalSelesai: data.tanggalSelesai ? new Date(data.tanggalSelesai) : null,
            status: data.status || 'PLANNING'
        },
        include: { dimensi: true, tahunAjaran: true }
    })

    return h.response(proyek).code(201)
}

export const updateP7ProyekStatus = async (request, h) => {
    const { id } = request.params
    const { status, tanggalMulai, tanggalSelesai } = request.payload

    const updateData = { status }
    if (tanggalMulai) updateData.tanggalMulai = new Date(tanggalMulai)
    if (tanggalSelesai) updateData.tanggalSelesai = new Date(tanggalSelesai)

    // Auto-set dates based on status
    if (status === 'ACTIVE' && !tanggalMulai) {
        updateData.tanggalMulai = new Date()
    }
    if (status === 'COMPLETED' && !tanggalSelesai) {
        updateData.tanggalSelesai = new Date()
    }

    const proyek = await prisma.p7Proyek.update({
        where: { id },
        data: updateData,
        include: { dimensi: true }
    })

    return h.response(proyek).code(200)
}

export const deleteP7Proyek = async (request, h) => {
    const { id } = request.params

    await prisma.p7Proyek.delete({ where: { id } })

    return h.response({ message: 'P7 Proyek deleted successfully' }).code(200)
}

// ============================================
// TIM P7 HANDLERS
// ============================================

export const createTimP7 = async (request, h) => {
    const { proyekId } = request.params
    const { guruFasilitatorId, namaTim, siswaIds } = request.payload

    const tim = await prisma.timP7.create({
        data: {
            proyekId,
            guruFasilitatorId,
            namaTim,
            siswaIds
        },
        include: { guruFasilitator: true, proyek: true }
    })

    return h.response(tim).code(201)
}

export const generateTimP7 = async (request, h) => {
    const { proyekId } = request.params
    const { siswaIds, teamSize, guruFasilitatorId } = request.payload

    // Shuffle students randomly
    const shuffled = [...siswaIds].sort(() => Math.random() - 0.5)

    // Split into teams
    const teams = []
    for (let i = 0; i < shuffled.length; i += teamSize) {
        teams.push(shuffled.slice(i, i + teamSize))
    }

    // Create teams
    const createdTeams = await Promise.all(
        teams.map((memberIds, index) =>
            prisma.timP7.create({
                data: {
                    proyekId,
                    guruFasilitatorId,
                    namaTim: `Tim ${index + 1}`,
                    siswaIds: memberIds
                }
            })
        )
    )

    return h.response({ created: createdTeams.length, teams: createdTeams }).code(201)
}

export const updateTimP7 = async (request, h) => {
    const { timId } = request.params
    const { namaTim, siswaIds, milestone } = request.payload

    const tim = await prisma.timP7.update({
        where: { id: timId },
        data: { namaTim, siswaIds, milestone },
        include: { guruFasilitator: true }
    })

    return h.response(tim).code(200)
}

// ============================================
// P7 PENILAIAN TIM HANDLERS
// ============================================

export const submitP7Penilaian = async (request, h) => {
    const { timId } = request.params
    const { siswaId, dimensiScores, catatan } = request.payload

    // Calculate total score (average of all dimensions)
    const scores = Object.values(dimensiScores)
    const nilaiTotal = scores.reduce((a, b) => a + b, 0) / scores.length * 25 // Scale to 100

    const penilaian = await prisma.p7PenilaianTim.upsert({
        where: {
            timId_siswaId: { timId, siswaId }
        },
        update: {
            dimensiScores,
            nilaiTotal,
            catatan,
            evaluatedAt: new Date()
        },
        create: {
            timId,
            siswaId,
            dimensiScores,
            nilaiTotal,
            catatan
        },
        include: { siswa: true, tim: true }
    })

    return h.response(penilaian).code(200)
}

export const getP7PenilaianByTim = async (request, h) => {
    const { timId } = request.params

    const penilaian = await prisma.p7PenilaianTim.findMany({
        where: { timId },
        include: { siswa: true }
    })

    return h.response(penilaian).code(200)
}

// ============================================
// PORTFOLIO HANDLERS
// ============================================

export const generatePortofolio = async (request, h) => {
    const { siswaId } = request.params
    const { tahunAjaranId } = request.payload

    // Aggregate all data for the student
    const [formatif, sumatif, p7, student] = await Promise.all([
        prisma.penilaianFormatif.findMany({
            where: { siswaId },
            include: { modulAjar: { include: { cp: { include: { mataPelajaran: true } } } } }
        }),
        prisma.penilaianSumatif.findMany({
            where: { siswaId },
            include: { modulAjar: { include: { cp: { include: { mataPelajaran: true } } } } }
        }),
        prisma.p7PenilaianTim.findMany({
            where: { siswaId },
            include: { tim: { include: { proyek: { include: { dimensi: true } } } } }
        }),
        prisma.student.findUnique({
            where: { id: siswaId },
            include: { achievements: true }
        })
    ])

    const dataJson = {
        formatif: formatif.map(p => ({
            id: p.id,
            tanggal: p.tanggal,
            jenis: p.jenis,
            tingkatPencapaian: p.tingkatPencapaian,
            mataPelajaran: p.modulAjar?.cp?.mataPelajaran?.name,
            modulAjar: p.modulAjar?.namaModul
        })),
        sumatif: sumatif.map(p => ({
            id: p.id,
            tanggal: p.tanggal,
            jenis: p.jenis,
            nilaiAkhir: p.nilaiAkhir,
            tingkatPencapaian: p.tingkatPencapaian,
            mataPelajaran: p.modulAjar?.cp?.mataPelajaran?.name
        })),
        p7: p7.map(p => ({
            id: p.id,
            namaProyek: p.tim?.proyek?.namaProyek,
            dimensi: p.tim?.proyek?.dimensi?.namaDimensi,
            nilaiTotal: p.nilaiTotal,
            evaluatedAt: p.evaluatedAt
        })),
        achievements: student?.achievements || []
    }

    const portofolio = await prisma.portofolioSiswa.upsert({
        where: {
            siswaId_tahunAjaranId: { siswaId, tahunAjaranId }
        },
        update: {
            dataJson,
            generatedAt: new Date()
        },
        create: {
            siswaId,
            tahunAjaranId,
            dataJson
        },
        include: { siswa: true, tahunAjaran: true }
    })

    return h.response(portofolio).code(200)
}

export const getPortofolio = async (request, h) => {
    const { siswaId } = request.params
    const { tahunAjaranId } = request.query

    const where = { siswaId }
    if (tahunAjaranId) where.tahunAjaranId = tahunAjaranId

    const portofolio = await prisma.portofolioSiswa.findFirst({
        where,
        include: { siswa: true, tahunAjaran: true },
        orderBy: { generatedAt: 'desc' }
    })

    if (!portofolio) {
        return h.response({ error: 'Portfolio not found' }).code(404)
    }

    return h.response(portofolio).code(200)
}

// ============================================
// ANALYTICS HANDLERS
// ============================================

export const getHeatmapData = async (request, h) => {
    const { kelasId, tahunAjaranId } = request.params

    // Get all students in the class
    const enrollments = await prisma.classEnrollment.findMany({
        where: { classId: kelasId, status: 'ACTIVE' },
        include: { student: true }
    })

    const studentIds = enrollments.map(e => e.studentId)

    // Get all formatif assessments for these students
    const formatif = await prisma.penilaianFormatif.findMany({
        where: { siswaId: { in: studentIds } },
        include: {
            siswa: true,
            modulAjar: { include: { cp: { include: { mataPelajaran: true } } } }
        }
    })

    // Group by student and subject
    const heatmapData = {}
    for (const p of formatif) {
        const studentId = p.siswaId
        const subjectName = p.modulAjar?.cp?.mataPelajaran?.name || 'Unknown'

        if (!heatmapData[studentId]) {
            heatmapData[studentId] = {
                student: p.siswa,
                subjects: {}
            }
        }

        if (!heatmapData[studentId].subjects[subjectName]) {
            heatmapData[studentId].subjects[subjectName] = {
                count: 0,
                levels: { BB: 0, MB: 0, BSH: 0, BSB: 0 }
            }
        }

        heatmapData[studentId].subjects[subjectName].count++
        heatmapData[studentId].subjects[subjectName].levels[p.tingkatPencapaian]++
    }

    return h.response(Object.values(heatmapData)).code(200)
}
