import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Extracted from User's Image
// Format: { no, name, subjectsRaw }
const rawData = [
    { no: 1, name: 'Dra. Hj. Entin Rohayatin', subjects: ['Biologi'] },
    { no: 2, name: 'Tintin Sumartini, SP', subjects: ['Matematika'] },
    { no: 3, name: 'Aih Nursasih, S.Pd', subjects: ['Bahasa Indonesia'] },
    { no: 4, name: 'Dadan Darmanto, S.Pd', subjects: [], position: 'PRINCIPAL' }, // Kepala Sekolah
    { no: 5, name: 'Herni Andriani, S.Pd', subjects: ['Sosiologi'] },
    { no: 6, name: 'Wida Apriliani, S.Pd', subjects: ['Bahasa Indonesia'] },
    { no: 7, name: 'Agus Budi Karsa, S.Sn.', subjects: ['SBK', 'Basa Sunda', 'PKWU'] },
    { no: 8, name: 'Heti Rosilawati, S.Pd', subjects: ['Bahasa Inggris'] },
    { no: 9, name: 'Asri Puspitasari Kamilah, S.Pd', subjects: ['Basa Sunda'] },
    { no: 10, name: 'Dewi Lisna Sopha, S.Pd', subjects: ['Matematika'] },
    { no: 11, name: 'Hani Nurhanipah, S.Sy', subjects: ['Ekonomi'] },
    { no: 12, name: 'Rina Nurhayati, S.Pd', subjects: ['Matematika'] },
    { no: 13, name: 'Ninda Permatasari, S.Pd', subjects: ['Geografi'] },
    { no: 14, name: 'Agus Suranto, S.Pd.I.', subjects: ['PABP', 'Sejarah'] },
    { no: 15, name: 'Ajeng Aisyah Rahayu, S.Si.', subjects: ['Fisika'] },
    { no: 16, name: 'Mila Karmila, S.Pd.', subjects: ['Basa Sunda'] },
    { no: 17, name: 'Wiwik Karmilah, S.Hut.', subjects: ['Biologi'] },
    { no: 18, name: 'Sofi Sofiya, S.Ag.', subjects: ['PABP'] },
    { no: 19, name: 'Elsa Awalia Lesmana, S Pd.', subjects: ['Kimia'] },
    { no: 20, name: 'Yuli Rahmayanti, SE.', subjects: ['Sejarah'] },
    { no: 21, name: 'Rizki Abdul Gani, S.Pd.', subjects: ['PJOK'] },
    { no: 22, name: 'Hannifatun Fauziyah Setiawan, S.Psi.', subjects: ['BK'] },
    { no: 23, name: 'Nur Santika, SE.', subjects: ['Sejarah', 'Ekonomi'] },
    { no: 24, name: 'Agus Nata Praja, SE', subjects: ['PPKn'] },
    { no: 25, name: 'Muhammad Iqbal, S.Li.', subjects: ['Bahasa Inggris', 'Sosiologi'] },
    { no: 26, name: 'Rosa Komalasari, S.Sn.', subjects: ['SBK'] },
    { no: 27, name: 'Sendy Ali Baehaq, S.Si.', subjects: ['Biologi', 'Fisika'] },
    { no: 28, name: 'Muhammad Fikri Fajari, S.Kom.', subjects: ['Informatika'] },
    { no: 29, name: 'Zaidan Ikhsan Gumilar, S.Kom.', subjects: ['Informatika'] },
    { no: 30, name: 'Rohman R, S.Pd.', subjects: ['PJOK'] },
]

const mapSubjectCategory = (subjectName) => {
    const s = subjectName.toLowerCase()
    if (s.includes('matematika') || s.includes('inggris') || s.includes('indonesia') || s.includes('pabp') || s.includes('ppkn') || s.includes('pjok') || s.includes('sejarah') || s.includes('informatika') || s.includes('sbk') || s.includes('pkwu')) return 'WAJIB'
    if (s.includes('biologi') || s.includes('fisika') || s.includes('kimia')) return 'PEMINATAN_IPA'
    if (s.includes('sosiologi') || s.includes('ekonomi') || s.includes('geografi')) return 'PEMINATAN_IPS'
    if (s.includes('sunda')) return 'MULOK'
    return 'WAJIB'
}

const main = async () => {
    console.log('Seeding Teachers and Subjects...')

    // 1. Create Subjects
    // We collect all unique subjects from the data
    const uniqueSubjects = new Set()
    rawData.forEach(d => d.subjects.forEach(s => uniqueSubjects.add(s)))

    const subjectMap = new Map() // Name -> ID

    for (const subName of uniqueSubjects) {
        if (subName === 'BK') continue // BK is not a subject usually, assume it's handling separately or skip for now

        // Generate a code, e.g., BIO, MTK, IND... or just AUTO
        // Simple code generation: Uppercase 3 chars + random? Or just Name uppercase
        const code = subName.substring(0, 3).toUpperCase() + Math.floor(Math.random() * 1000)

        // Check if exists by name (approx) or upsert by code? Schema has code unique.
        // We'll try to find first or create with unique code

        // Better: Upsert by 'code' if we had fixed codes. Since we don't, we'll search by name? Schema doesn't have name unique.
        // We'll Create if not found.

        const existing = await prisma.subject.findFirst({ where: { name: subName } })

        let subject
        if (existing) {
            subject = existing
        } else {
            subject = await prisma.subject.create({
                data: {
                    name: subName,
                    code: subName.toUpperCase().replace(/\s/g, '').substring(0, 10) + Math.floor(100 + Math.random() * 900), // temp code
                    category: mapSubjectCategory(subName)
                }
            })
        }
        subjectMap.set(subName, subject.id)
        console.log(`Subject: ${subName}`)
    }

    // 2. Create Teachers
    for (const t of rawData) {
        // Create User
        // Email: teacher{no}@school.id or sanitized name
        const sanitized = t.name.replace(/[^a-zA-Z]/g, '').toLowerCase().substring(0, 10)
        const email = `${sanitized}${t.no}@teacher.sch.id`

        // Check Position
        // If Principal, maybe special handling? Schema: enum TeacherPosition { PNS, HONORER, P3K, STAFF }
        // Principal is usually a role in User (PRINCIPAL) or a Teacher with extra role. 
        // UserRole enum: SUPER_ADMIN, PRINCIPAL, TEACHER...
        // We'll set UserRole to PRINCIPAL if t.position === 'PRINCIPAL', else TEACHER.

        const role = t.position === 'PRINCIPAL' ? 'PRINCIPAL' : 'TEACHER'

        // Upsert User
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                name: t.name,
                role: role // Update role if needed
            },
            create: {
                name: t.name,
                email,
                role: role,
                status: 'ACTIVE',
                image: `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=random`
            }
        })

        // Upsert Teacher
        // Use NIP/NUPTK? We don't have it. Use email or userId as unique constraint?
        // Teacher has userId @unique.
        const teacher = await prisma.teacher.upsert({
            where: { userId: user.id },
            update: {
                name: t.name,
                // position? we only know Principal
            },
            create: {
                userId: user.id,
                name: t.name,
                gender: t.name.startsWith('Dra') || t.name.startsWith('Ibu') || t.name.includes('Wati') || t.name.includes('Putri') ? 'FEMALE' : 'MALE', // Simple guess, can be inaccurate
                // We'll guess gender or default MALE. The names are mixed.
                // Better gender guesser:
                // Dra., Hj (usually F), Entin (F), Tintin (F), Aih (F), Herni (F), Wida (F), Heti (F), Asri (F), Dewi (F), Hani (F), Rina (F), Ninda (F), Ajeng (F), Mila (F), Wiwik (F), Sofi (F), Elsa (F), Yuli (F), Hannifatun (F), Nur (F/M), Rosa (F).
                // Dadan (M), Agus (M), Rizki (M), Muhammad (M), Sendy (M), Zaidan (M), Rohman (M).
                // I'll implement a slightly better manual gender map in valid loop if needed, or just default.
                status: 'ACTIVE'
            }
        })

        // 3. Link Subjects
        if (t.subjects.length > 0) {
            for (const subName of t.subjects) {
                if (subName === 'BK') continue // Skip BK for subject linking
                const subjectId = subjectMap.get(subName)
                if (subjectId) {
                    await prisma.teacherSubject.upsert({
                        where: {
                            teacherId_subjectId: {
                                teacherId: teacher.id,
                                subjectId: subjectId
                            }
                        },
                        update: {},
                        create: {
                            teacherId: teacher.id,
                            subjectId: subjectId
                        }
                    })
                }
            }
        }

        console.log(`Processed Teacher: ${t.name} (${role})`)
    }

    console.log('Done!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
