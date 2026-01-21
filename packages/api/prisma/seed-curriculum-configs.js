import { prisma } from '../src/plugins/prisma.js'

/**
 * Seed Curriculum Configurations
 * Creates default curriculum configs for Kurikulum Merdeka and K13
 */

const curriculumConfigs = [
    {
        code: 'MERDEKA_2024',
        name: 'Kurikulum Merdeka 2024',
        isActive: true,
        config: {
            // Terminology mapping
            terms: {
                competency: 'Capaian Pembelajaran',
                learningTarget: 'Tujuan Pembelajaran',
                phase: 'Fase',
                element: 'Elemen',
                module: 'Modul Ajar'
            },

            // Scoring system configuration
            scoring: {
                type: 'descriptive', // 'numeric' | 'descriptive' | 'rubric'
                scale: { min: 0, max: 100 },
                letterGrades: ['A', 'B', 'C', 'D'],
                descriptiveLevels: [
                    { code: 'BB', label: 'Belum Berkembang', minScore: 0, maxScore: 49, color: '#ef4444' },
                    { code: 'MB', label: 'Mulai Berkembang', minScore: 50, maxScore: 69, color: '#f97316' },
                    { code: 'BSH', label: 'Berkembang Sesuai Harapan', minScore: 70, maxScore: 84, color: '#22c55e' },
                    { code: 'BSB', label: 'Berkembang Sangat Baik', minScore: 85, maxScore: 100, color: '#3b82f6' }
                ],
                defaultLevel: 'MB'
            },

            // Assessment components configuration
            components: {
                formative: {
                    enabled: true,
                    weight: 0.4,
                    label: 'Penilaian Formatif',
                    types: ['OBSERVASI', 'KUIS', 'TUGAS', 'DISKUSI']
                },
                summative: {
                    enabled: true,
                    weight: 0.6,
                    label: 'Penilaian Sumatif',
                    types: ['STS', 'SAS', 'AKHIR_TAHUN']
                },
                project: {
                    enabled: true,
                    label: 'Proyek P5',
                    dimensions: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6']
                }
            },

            // Dynamic input fields for grade forms
            inputFields: [
                {
                    key: 'tingkatPencapaian',
                    label: 'Tingkat Pencapaian',
                    type: 'select',
                    options: ['BB', 'MB', 'BSH', 'BSB'],
                    required: true
                },
                {
                    key: 'catatan',
                    label: 'Catatan Perkembangan',
                    type: 'textarea',
                    required: false
                },
                {
                    key: 'evidenceLinks',
                    label: 'Bukti Karya',
                    type: 'file',
                    accept: 'image/*,application/pdf',
                    multiple: true,
                    required: false
                }
            ],

            // Report template reference
            reportTemplate: 'RAPOR_MERDEKA_2024',

            // Phase definitions
            phases: {
                A: { grades: [0], label: 'Fase A (PAUD-TK)' },
                B: { grades: [1, 2], label: 'Fase B (SD Kelas 1-2)' },
                C: { grades: [3, 4], label: 'Fase C (SD Kelas 3-4)' },
                D: { grades: [5, 6, 7, 8, 9], label: 'Fase D (SD 5-6, SMP 7-9)' },
                E: { grades: [10], label: 'Fase E (SMA Kelas 10)' },
                F: { grades: [11, 12], label: 'Fase F (SMA Kelas 11-12)' }
            }
        }
    },
    {
        code: 'K13_LEGACY',
        name: 'Kurikulum 2013 (K13)',
        isActive: false,
        config: {
            // Terminology mapping
            terms: {
                competency: 'Kompetensi Dasar',
                learningTarget: 'Indikator',
                coreCompetency: 'Kompetensi Inti',
                basicCompetency: 'Kompetensi Dasar'
            },

            // Scoring system configuration
            scoring: {
                type: 'numeric', // 'numeric' | 'descriptive' | 'rubric'
                scale: { min: 0, max: 100 },
                kkm: 75, // Kriteria Ketuntasan Minimal
                letterGrades: [
                    { letter: 'A', minScore: 90, maxScore: 100, predikat: 'Sangat Baik' },
                    { letter: 'B', minScore: 80, maxScore: 89, predikat: 'Baik' },
                    { letter: 'C', minScore: 70, maxScore: 79, predikat: 'Cukup' },
                    { letter: 'D', minScore: 60, maxScore: 69, predikat: 'Kurang' },
                    { letter: 'E', minScore: 0, maxScore: 59, predikat: 'Sangat Kurang' }
                ]
            },

            // Assessment components configuration
            components: {
                knowledge: {
                    enabled: true,
                    weight: 0.5,
                    label: 'Pengetahuan (KI-3)',
                    subComponents: ['tugas', 'uts', 'uas']
                },
                skills: {
                    enabled: true,
                    weight: 0.3,
                    label: 'Keterampilan (KI-4)',
                    subComponents: ['praktik', 'proyek', 'portofolio']
                },
                attitude: {
                    enabled: true,
                    weight: 0.2,
                    label: 'Sikap (KI-1 & KI-2)',
                    subComponents: ['spiritual', 'sosial']
                }
            },

            // Dynamic input fields for grade forms
            inputFields: [
                {
                    key: 'tugas1',
                    label: 'Nilai Tugas 1',
                    type: 'number',
                    min: 0,
                    max: 100,
                    required: false
                },
                {
                    key: 'tugas2',
                    label: 'Nilai Tugas 2',
                    type: 'number',
                    min: 0,
                    max: 100,
                    required: false
                },
                {
                    key: 'tugas3',
                    label: 'Nilai Tugas 3',
                    type: 'number',
                    min: 0,
                    max: 100,
                    required: false
                },
                {
                    key: 'uts',
                    label: 'Nilai UTS',
                    type: 'number',
                    min: 0,
                    max: 100,
                    required: false
                },
                {
                    key: 'uas',
                    label: 'Nilai UAS',
                    type: 'number',
                    min: 0,
                    max: 100,
                    required: false
                },
                {
                    key: 'remedial',
                    label: 'Perlu Remedial',
                    type: 'checkbox',
                    required: false
                }
            ],

            // Weight calculation
            weightCalculation: {
                tugas: 0.2,
                uts: 0.3,
                uas: 0.5
            },

            // Report template reference
            reportTemplate: 'RAPOR_K13'
        }
    }
]

const reportTemplates = [
    {
        code: 'RAPOR_MERDEKA_2024',
        name: 'Rapor Kurikulum Merdeka 2024',
        isActive: true,
        layoutHtml: `<!DOCTYPE html>
<html>
<head>
  <title>Rapor Siswa - {{student.name}}</title>
  <style>
    body { font-family: 'Segoe UI', sans-serif; }
    .header { text-align: center; margin-bottom: 20px; }
    .student-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .grade-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .grade-table th, .grade-table td { border: 1px solid #ddd; padding: 8px; }
    .level-BB { background: #fecaca; }
    .level-MB { background: #fed7aa; }
    .level-BSH { background: #bbf7d0; }
    .level-BSB { background: #bfdbfe; }
  </style>
</head>
<body>
  <div class="header">
    <h1>{{school.name}}</h1>
    <h2>RAPOR PESERTA DIDIK</h2>
    <p>Tahun Ajaran: {{academicYear.name}} - Semester {{semester}}</p>
  </div>
  
  <div class="student-info">
    <div><strong>Nama:</strong> {{student.name}}</div>
    <div><strong>NISN:</strong> {{student.nisn}}</div>
    <div><strong>Kelas:</strong> {{class.name}}</div>
    <div><strong>Fase:</strong> {{phase}}</div>
  </div>
  
  <table class="grade-table">
    <thead>
      <tr>
        <th>Mata Pelajaran</th>
        <th>Capaian Pembelajaran</th>
        <th>Tingkat Pencapaian</th>
        <th>Catatan</th>
      </tr>
    </thead>
    <tbody>
      {{#each grades}}
      <tr>
        <td>{{subject.name}}</td>
        <td>{{competency.description}}</td>
        <td class="level-{{scoreDescriptive}}">{{scoreDescriptive}}</td>
        <td>{{feedback}}</td>
      </tr>
      {{/each}}
    </tbody>
  </table>
</body>
</html>`,
        config: {
            fieldMapping: {
                studentName: 'student.name',
                studentNisn: 'student.nisn',
                className: 'class.name',
                grades: 'genericGrades',
                achievements: 'grades.scoreDescriptive'
            },
            paperSize: 'A4',
            orientation: 'portrait'
        }
    },
    {
        code: 'RAPOR_K13',
        name: 'Rapor Kurikulum 2013',
        isActive: true,
        layoutHtml: `<!DOCTYPE html>
<html>
<head>
  <title>Rapor Siswa K13 - {{student.name}}</title>
  <style>
    body { font-family: 'Times New Roman', serif; }
    .header { text-align: center; }
    .grade-table { width: 100%; border-collapse: collapse; }
    .grade-table th, .grade-table td { border: 1px solid black; padding: 5px; }
    .pass { color: green; }
    .fail { color: red; }
  </style>
</head>
<body>
  <div class="header">
    <h1>{{school.name}}</h1>
    <h2>LAPORAN HASIL BELAJAR</h2>
  </div>
  
  <table class="grade-table">
    <thead>
      <tr>
        <th>No</th>
        <th>Mata Pelajaran</th>
        <th>KKM</th>
        <th>Nilai</th>
        <th>Predikat</th>
        <th>Keterangan</th>
      </tr>
    </thead>
    <tbody>
      {{#each grades}}
      <tr>
        <td>{{@index}}</td>
        <td>{{subject.name}}</td>
        <td>75</td>
        <td class="{{#if (gte scoreNumeric 75)}}pass{{else}}fail{{/if}}">{{scoreNumeric}}</td>
        <td>{{scoreLetter}}</td>
        <td>{{feedback}}</td>
      </tr>
      {{/each}}
    </tbody>
  </table>
</body>
</html>`,
        config: {
            fieldMapping: {
                studentName: 'student.name',
                grades: 'genericGrades',
                finalScore: 'grades.scoreNumeric'
            },
            paperSize: 'A4',
            orientation: 'portrait'
        }
    }
]

async function seedCurriculumConfigs() {
    console.log('🌱 Seeding curriculum configurations...')

    for (const config of curriculumConfigs) {
        const existing = await prisma.curriculumConfig.findUnique({
            where: { code: config.code }
        })

        if (existing) {
            console.log(`  ⏭️  Curriculum config "${config.code}" already exists, updating...`)
            await prisma.curriculumConfig.update({
                where: { code: config.code },
                data: config
            })
        } else {
            console.log(`  ✅ Creating curriculum config "${config.code}"...`)
            await prisma.curriculumConfig.create({ data: config })
        }
    }

    console.log('🌱 Seeding report templates...')

    for (const template of reportTemplates) {
        const existing = await prisma.reportTemplate.findUnique({
            where: { code: template.code }
        })

        if (existing) {
            console.log(`  ⏭️  Report template "${template.code}" already exists, updating...`)
            await prisma.reportTemplate.update({
                where: { code: template.code },
                data: template
            })
        } else {
            console.log(`  ✅ Creating report template "${template.code}"...`)
            await prisma.reportTemplate.create({ data: template })
        }
    }

    console.log('✅ Curriculum configurations seeded successfully!')
}

seedCurriculumConfigs()
    .catch((e) => {
        console.error('❌ Error seeding curriculum configs:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
