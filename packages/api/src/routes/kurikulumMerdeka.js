import Joi from 'joi'
import * as handlers from '../handlers/kurikulumMerdeka.js'

// Validation schemas
const faseSchema = Joi.string().valid('A', 'B', 'C', 'D', 'E', 'F')
const tingkatPencapaianSchema = Joi.string().valid('BB', 'MB', 'BSH', 'BSB')
const jenisPenilaianFormatifSchema = Joi.string().valid('OBSERVASI', 'KUIS', 'TUGAS', 'DISKUSI')
const jenisPenilaianSumatifSchema = Joi.string().valid('STS', 'SAS', 'AKHIR_TAHUN')
const statusProyekSchema = Joi.string().valid('PLANNING', 'ACTIVE', 'IN_PROGRESS', 'COMPLETED')

export const kurikulumMerdekaRoutes = [
    // ============================================
    // CAPAIAN PEMBELAJARAN (CP)
    // ============================================
    {
        method: 'GET',
        path: '/api/kurikulum-merdeka/cp',
        handler: handlers.listCP,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'cp'],
            description: 'List Capaian Pembelajaran',
            validate: {
                query: Joi.object({
                    fase: faseSchema.optional(),
                    mataPelajaranId: Joi.string().optional()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/kurikulum-merdeka/cp/{id}',
        handler: handlers.getCP,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'cp'],
            description: 'Get Capaian Pembelajaran by ID',
            validate: {
                params: Joi.object({
                    id: Joi.string().required()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/kurikulum-merdeka/cp',
        handler: handlers.createCP,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'cp'],
            description: 'Create Capaian Pembelajaran',
            validate: {
                payload: Joi.object({
                    kodeCP: Joi.string().required(),
                    fase: faseSchema.required(),
                    mataPelajaranId: Joi.string().required(),
                    deskripsi: Joi.string().required()
                })
            }
        }
    },
    {
        method: 'PUT',
        path: '/api/kurikulum-merdeka/cp/{id}',
        handler: handlers.updateCP,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'cp'],
            description: 'Update Capaian Pembelajaran',
            validate: {
                params: Joi.object({
                    id: Joi.string().required()
                }),
                payload: Joi.object({
                    kodeCP: Joi.string().optional(),
                    fase: faseSchema.optional(),
                    mataPelajaranId: Joi.string().optional(),
                    deskripsi: Joi.string().optional()
                })
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/kurikulum-merdeka/cp/{id}',
        handler: handlers.deleteCP,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'cp'],
            description: 'Delete Capaian Pembelajaran',
            validate: {
                params: Joi.object({
                    id: Joi.string().required()
                })
            }
        }
    },

    // ============================================
    // MODUL AJAR
    // ============================================
    {
        method: 'GET',
        path: '/api/kurikulum-merdeka/modul-ajar',
        handler: handlers.listModulAjar,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'modul-ajar'],
            description: 'List Modul Ajar',
            validate: {
                query: Joi.object({
                    cpId: Joi.string().optional(),
                    guruId: Joi.string().optional(),
                    tahunAjaranId: Joi.string().optional(),
                    status: Joi.string().valid('DRAFT', 'ACTIVE', 'ARCHIVED').optional()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/kurikulum-merdeka/modul-ajar/{id}',
        handler: handlers.getModulAjar,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'modul-ajar'],
            description: 'Get Modul Ajar by ID',
            validate: {
                params: Joi.object({
                    id: Joi.string().required()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/kurikulum-merdeka/modul-ajar',
        handler: handlers.createModulAjar,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'modul-ajar'],
            description: 'Create Modul Ajar',
            validate: {
                payload: Joi.object({
                    cpId: Joi.string().required(),
                    guruId: Joi.string().required(),
                    tahunAjaranId: Joi.string().required(),
                    // Info Umum
                    namaModul: Joi.string().required(),
                    fase: faseSchema.required(),
                    kelas: Joi.number().integer().required(),
                    deskripsiUmum: Joi.string().allow('').optional(),
                    targetPesertaDidik: Joi.string().allow('').optional(),
                    profilPelajarPancasila: Joi.array().items(Joi.string()).optional(),
                    kompetensiAwal: Joi.string().allow('').optional(),
                    saranaPrasarana: Joi.array().items(Joi.string()).optional(),
                    modelPembelajaran: Joi.string().valid('TATAP_MUKA', 'DARING', 'CAMPURAN').optional(),
                    // CP & Tujuan
                    tujuanPembelajaran: Joi.array().items(Joi.object()).optional(),
                    alurTujuanPembelajaran: Joi.string().allow('').optional(),
                    // Rancangan
                    alokasiWaktuJam: Joi.number().integer().min(1).required(),
                    jumlahPertemuan: Joi.number().integer().min(1).required(),
                    pertanyaanPemantik: Joi.array().items(Joi.string()).optional(),
                    pemahamanBermakna: Joi.string().allow('').optional(),
                    kegiatanPembelajaran: Joi.array().items(Joi.object()).optional(),
                    rencanaDiferensiasi: Joi.object().optional(),
                    rencanaAsesmen: Joi.object().optional(),
                    // Lampiran
                    lkpd: Joi.array().items(Joi.object()).optional(),
                    bahanBacaan: Joi.array().items(Joi.object()).optional(),
                    glosarium: Joi.array().items(Joi.object()).optional(),
                    daftarPustaka: Joi.array().items(Joi.string()).optional(),
                    // Meta
                    status: Joi.string().valid('DRAFT', 'ACTIVE', 'ARCHIVED').optional()
                })
            }
        }
    },
    {
        method: 'PUT',
        path: '/api/kurikulum-merdeka/modul-ajar/{id}',
        handler: handlers.updateModulAjar,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'modul-ajar'],
            description: 'Update Modul Ajar',
            validate: {
                params: Joi.object({
                    id: Joi.string().required()
                }),
                payload: Joi.object({
                    namaModul: Joi.string().optional(),
                    fase: faseSchema.optional(),
                    kelas: Joi.number().integer().optional(),
                    deskripsiUmum: Joi.string().allow('').optional(),
                    targetPesertaDidik: Joi.string().allow('').optional(),
                    profilPelajarPancasila: Joi.array().items(Joi.string()).optional(),
                    kompetensiAwal: Joi.string().allow('').optional(),
                    saranaPrasarana: Joi.array().items(Joi.string()).optional(),
                    modelPembelajaran: Joi.string().valid('TATAP_MUKA', 'DARING', 'CAMPURAN').optional(),
                    tujuanPembelajaran: Joi.array().items(Joi.object()).optional(),
                    alurTujuanPembelajaran: Joi.string().allow('').optional(),
                    alokasiWaktuJam: Joi.number().integer().min(1).optional(),
                    jumlahPertemuan: Joi.number().integer().min(1).optional(),
                    pertanyaanPemantik: Joi.array().items(Joi.string()).optional(),
                    pemahamanBermakna: Joi.string().allow('').optional(),
                    kegiatanPembelajaran: Joi.array().items(Joi.object()).optional(),
                    rencanaDiferensiasi: Joi.object().optional(),
                    rencanaAsesmen: Joi.object().optional(),
                    lkpd: Joi.array().items(Joi.object()).optional(),
                    bahanBacaan: Joi.array().items(Joi.object()).optional(),
                    glosarium: Joi.array().items(Joi.object()).optional(),
                    daftarPustaka: Joi.array().items(Joi.string()).optional(),
                    status: Joi.string().valid('DRAFT', 'ACTIVE', 'ARCHIVED').optional()
                })
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/kurikulum-merdeka/modul-ajar/{id}',
        handler: handlers.deleteModulAjar,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'modul-ajar'],
            description: 'Delete Modul Ajar',
            validate: {
                params: Joi.object({
                    id: Joi.string().required()
                })
            }
        }
    },

    // ============================================
    // PENILAIAN FORMATIF
    // ============================================
    {
        method: 'GET',
        path: '/api/kurikulum-merdeka/penilaian/formatif',
        handler: handlers.listPenilaianFormatif,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'penilaian'],
            description: 'List Penilaian Formatif',
            validate: {
                query: Joi.object({
                    siswaId: Joi.string().optional(),
                    modulAjarId: Joi.string().optional(),
                    jenis: jenisPenilaianFormatifSchema.optional()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/kurikulum-merdeka/penilaian/formatif',
        handler: handlers.createPenilaianFormatif,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'penilaian'],
            description: 'Create Penilaian Formatif',
            validate: {
                payload: Joi.object({
                    siswaId: Joi.string().required(),
                    modulAjarId: Joi.string().required(),
                    jenis: jenisPenilaianFormatifSchema.required(),
                    nilai: Joi.string().allow('').optional(),
                    tingkatPencapaian: tingkatPencapaianSchema.required(),
                    catatan: Joi.string().allow('').optional(),
                    tanggal: Joi.date().optional()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/kurikulum-merdeka/penilaian/formatif/bulk',
        handler: handlers.bulkCreatePenilaianFormatif,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'penilaian'],
            description: 'Bulk Create Penilaian Formatif',
            validate: {
                payload: Joi.object({
                    penilaianList: Joi.array().items(
                        Joi.object({
                            siswaId: Joi.string().required(),
                            modulAjarId: Joi.string().required(),
                            jenis: jenisPenilaianFormatifSchema.required(),
                            nilai: Joi.string().allow('').optional(),
                            tingkatPencapaian: tingkatPencapaianSchema.required(),
                            catatan: Joi.string().allow('').optional(),
                            tanggal: Joi.date().optional()
                        })
                    ).required()
                })
            }
        }
    },

    // ============================================
    // PENILAIAN SUMATIF
    // ============================================
    {
        method: 'GET',
        path: '/api/kurikulum-merdeka/penilaian/sumatif',
        handler: handlers.listPenilaianSumatif,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'penilaian'],
            description: 'List Penilaian Sumatif',
            validate: {
                query: Joi.object({
                    siswaId: Joi.string().optional(),
                    modulAjarId: Joi.string().optional(),
                    jenis: jenisPenilaianSumatifSchema.optional()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/kurikulum-merdeka/penilaian/sumatif',
        handler: handlers.createPenilaianSumatif,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'penilaian'],
            description: 'Create Penilaian Sumatif',
            validate: {
                payload: Joi.object({
                    siswaId: Joi.string().required(),
                    modulAjarId: Joi.string().required(),
                    jenis: jenisPenilaianSumatifSchema.required(),
                    nilaiTes: Joi.number().min(0).max(100).optional(),
                    nilaiPerformanceTask: Joi.number().min(0).max(100).optional(),
                    nilaiAkhir: Joi.number().min(0).max(100).optional(),
                    tingkatPencapaian: tingkatPencapaianSchema.optional(),
                    tanggal: Joi.date().optional()
                })
            }
        }
    },

    // ============================================
    // PERFORMANCE TASK
    // ============================================
    {
        method: 'GET',
        path: '/api/kurikulum-merdeka/performance-task',
        handler: handlers.listPerformanceTasks,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'performance-task'],
            description: 'List Performance Tasks',
            validate: {
                query: Joi.object({
                    siswaId: Joi.string().optional(),
                    modulAjarId: Joi.string().optional()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/kurikulum-merdeka/performance-task',
        handler: handlers.createPerformanceTask,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'performance-task'],
            description: 'Create Performance Task',
            validate: {
                payload: Joi.object({
                    siswaId: Joi.string().required(),
                    modulAjarId: Joi.string().required(),
                    judulTugas: Joi.string().required(),
                    rubrikId: Joi.string().optional(),
                    fileEvidences: Joi.array().items(Joi.object()).optional()
                })
            }
        }
    },
    {
        method: 'PUT',
        path: '/api/kurikulum-merdeka/performance-task/{id}',
        handler: handlers.gradePerformanceTask,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'performance-task'],
            description: 'Grade Performance Task',
            validate: {
                params: Joi.object({
                    id: Joi.string().required()
                }),
                payload: Joi.object({
                    nilai: Joi.number().min(0).max(100).optional(),
                    komentarGuru: Joi.string().allow('').optional(),
                    fileEvidences: Joi.array().items(Joi.object()).optional()
                })
            }
        }
    },

    // ============================================
    // DIMENSI P7
    // ============================================
    {
        method: 'GET',
        path: '/api/kurikulum-merdeka/dimensi-p7',
        handler: handlers.listDimensiP7,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'p7'],
            description: 'List Dimensi P7 (Profil Pelajar Pancasila)'
        }
    },
    {
        method: 'POST',
        path: '/api/kurikulum-merdeka/dimensi-p7',
        handler: handlers.createDimensiP7,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'p7'],
            description: 'Create Dimensi P7',
            validate: {
                payload: Joi.object({
                    kode: Joi.string().required(),
                    namaDimensi: Joi.string().required(),
                    deskripsi: Joi.string().allow('').optional(),
                    elemen: Joi.array().items(Joi.string()).required()
                })
            }
        }
    },

    // ============================================
    // P7 PROYEK
    // ============================================
    {
        method: 'GET',
        path: '/api/kurikulum-merdeka/p7-proyek',
        handler: handlers.listP7Proyek,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'p7'],
            description: 'List P7 Proyek',
            validate: {
                query: Joi.object({
                    tahunAjaranId: Joi.string().optional(),
                    fase: faseSchema.optional(),
                    status: statusProyekSchema.optional(),
                    dimensiId: Joi.string().optional()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/kurikulum-merdeka/p7-proyek/{id}',
        handler: handlers.getP7Proyek,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'p7'],
            description: 'Get P7 Proyek by ID',
            validate: {
                params: Joi.object({
                    id: Joi.string().required()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/kurikulum-merdeka/p7-proyek',
        handler: handlers.createP7Proyek,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'p7'],
            description: 'Create P7 Proyek',
            validate: {
                payload: Joi.object({
                    dimensiId: Joi.string().required(),
                    tahunAjaranId: Joi.string().required(),
                    namaProyek: Joi.string().required(),
                    tema: Joi.string().optional(),
                    fase: faseSchema.required(),
                    durasiMinggu: Joi.number().integer().min(1).required(),
                    tanggalMulai: Joi.date().optional(),
                    tanggalSelesai: Joi.date().optional(),
                    status: statusProyekSchema.optional()
                })
            }
        }
    },
    {
        method: 'PUT',
        path: '/api/kurikulum-merdeka/p7-proyek/{id}/status',
        handler: handlers.updateP7ProyekStatus,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'p7'],
            description: 'Update P7 Proyek Status',
            validate: {
                params: Joi.object({
                    id: Joi.string().required()
                }),
                payload: Joi.object({
                    status: statusProyekSchema.required(),
                    tanggalMulai: Joi.date().optional(),
                    tanggalSelesai: Joi.date().optional()
                })
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/kurikulum-merdeka/p7-proyek/{id}',
        handler: handlers.deleteP7Proyek,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'p7'],
            description: 'Delete P7 Proyek',
            validate: {
                params: Joi.object({
                    id: Joi.string().required()
                })
            }
        }
    },

    // ============================================
    // TIM P7
    // ============================================
    {
        method: 'POST',
        path: '/api/kurikulum-merdeka/p7-proyek/{proyekId}/tim',
        handler: handlers.createTimP7,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'p7'],
            description: 'Create Tim P7',
            validate: {
                params: Joi.object({
                    proyekId: Joi.string().required()
                }),
                payload: Joi.object({
                    guruFasilitatorId: Joi.string().required(),
                    namaTim: Joi.string().required(),
                    siswaIds: Joi.array().items(Joi.string()).required()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/kurikulum-merdeka/p7-proyek/{proyekId}/tim/generate',
        handler: handlers.generateTimP7,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'p7'],
            description: 'Auto-generate Tim P7',
            validate: {
                params: Joi.object({
                    proyekId: Joi.string().required()
                }),
                payload: Joi.object({
                    siswaIds: Joi.array().items(Joi.string()).required(),
                    teamSize: Joi.number().integer().min(2).max(10).required(),
                    guruFasilitatorId: Joi.string().required()
                })
            }
        }
    },
    {
        method: 'PUT',
        path: '/api/kurikulum-merdeka/p7-tim/{timId}',
        handler: handlers.updateTimP7,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'p7'],
            description: 'Update Tim P7',
            validate: {
                params: Joi.object({
                    timId: Joi.string().required()
                }),
                payload: Joi.object({
                    namaTim: Joi.string().optional(),
                    siswaIds: Joi.array().items(Joi.string()).optional(),
                    milestone: Joi.array().items(Joi.object()).optional()
                })
            }
        }
    },

    // ============================================
    // P7 PENILAIAN TIM
    // ============================================
    {
        method: 'POST',
        path: '/api/kurikulum-merdeka/p7-tim/{timId}/penilaian',
        handler: handlers.submitP7Penilaian,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'p7'],
            description: 'Submit P7 Penilaian for Student',
            validate: {
                params: Joi.object({
                    timId: Joi.string().required()
                }),
                payload: Joi.object({
                    siswaId: Joi.string().required(),
                    dimensiScores: Joi.object({
                        D1: Joi.number().min(1).max(4).required(),
                        D2: Joi.number().min(1).max(4).required(),
                        D3: Joi.number().min(1).max(4).required(),
                        D4: Joi.number().min(1).max(4).required(),
                        D5: Joi.number().min(1).max(4).required(),
                        D6: Joi.number().min(1).max(4).required()
                    }).required(),
                    catatan: Joi.string().allow('').optional()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/kurikulum-merdeka/p7-tim/{timId}/penilaian',
        handler: handlers.getP7PenilaianByTim,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'p7'],
            description: 'Get P7 Penilaian by Tim',
            validate: {
                params: Joi.object({
                    timId: Joi.string().required()
                })
            }
        }
    },

    // ============================================
    // PORTFOLIO
    // ============================================
    {
        method: 'POST',
        path: '/api/kurikulum-merdeka/portofolio/generate/{siswaId}',
        handler: handlers.generatePortofolio,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'portofolio'],
            description: 'Generate Student Portfolio',
            validate: {
                params: Joi.object({
                    siswaId: Joi.string().required()
                }),
                payload: Joi.object({
                    tahunAjaranId: Joi.string().required()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/kurikulum-merdeka/portofolio/{siswaId}',
        handler: handlers.getPortofolio,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'portofolio'],
            description: 'Get Student Portfolio',
            validate: {
                params: Joi.object({
                    siswaId: Joi.string().required()
                }),
                query: Joi.object({
                    tahunAjaranId: Joi.string().optional()
                })
            }
        }
    },

    // ============================================
    // ANALYTICS
    // ============================================
    {
        method: 'GET',
        path: '/api/kurikulum-merdeka/analytics/heatmap/{kelasId}/{tahunAjaranId}',
        handler: handlers.getHeatmapData,
        options: {
            tags: ['api', 'kurikulum-merdeka', 'analytics'],
            description: 'Get Heatmap Data for Class',
            validate: {
                params: Joi.object({
                    kelasId: Joi.string().required(),
                    tahunAjaranId: Joi.string().required()
                })
            }
        }
    }
]
