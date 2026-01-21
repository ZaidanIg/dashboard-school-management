import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Codes mapped to Names (Must match Seed Teachers one)
const teacherCodes = {
    1: 'Dra. Hj. Entin Rohayatin',
    2: 'Tintin Sumartini, SP',
    3: 'Aih Nursasih, S.Pd',
    4: 'Dadan Darmanto, S.Pd',
    5: 'Herni Andriani, S.Pd',
    6: 'Wida Apriliani, S.Pd',
    7: 'Agus Budi Karsa, S.Sn.',
    8: 'Heti Rosilawati, S.Pd',
    9: 'Asri Puspitasari Kamilah, S.Pd',
    10: 'Dewi Lisna Sopha, S.Pd',
    11: 'Hani Nurhanipah, S.Sy',
    12: 'Rina Nurhayati, S.Pd',
    13: 'Ninda Permatasari, S.Pd',
    14: 'Agus Suranto, S.Pd.I.',
    15: 'Ajeng Aisyah Rahayu, S.Si.',
    16: 'Mila Karmila, S.Pd.',
    17: 'Wiwik Karmilah, S.Hut.',
    18: 'Sofi Sofiya, S.Ag.',
    19: 'Elsa Awalia Lesmana, S Pd.',
    20: 'Yuli Rahmayanti, SE.',
    21: 'Rizki Abdul Gani, S.Pd.',
    22: 'Hannifatun Fauziyah Setiawan, S.Psi.',
    23: 'Nur Santika, SE.',
    24: 'Agus Nata Praja, SE',
    25: 'Muhammad Iqbal, S.Li.',
    26: 'Rosa Komalasari, S.Sn.',
    27: 'Sendy Ali Baehaq, S.Si.',
    28: 'Muhammad Fikri Fajari, S.Kom.',
    29: 'Zaidan Ikhsan Gumilar, S.Kom.',
    30: 'Rohman R, S.Pd.'
}

// Homeroom Data: ClassName -> TeacherCode
const homerooms = {
    'X-1': 3,  // Aih Nursasih
    'X-2': 19, // Elsa Awalia
    'X-3': 23, // Nur Santika
    'X-4': 17, // Wiwik Karmilah
    'X-5': 27  // Sendy Ali Baehaq
}

// Schedule Grid (Row=Period, Col=Class X1..X5, Val=TeacherCode)
// Periods: 0=6.30-7.20, 1=7.20-8.00, etc.
const timeSlots = [
    { start: '06:30', end: '07:20' }, // 0
    { start: '07:20', end: '08:00' }, // 1
    { start: '08:00', end: '08:40' }, // 2
    { start: '08:40', end: '09:20' }, // 3
    { start: '09:20', end: '10:00' }, // 4
    { start: '10:00', end: '10:20' }, // Break 1
    { start: '10:20', end: '11:00' }, // 5
    { start: '11:00', end: '11:40' }, // 6
    { start: '11:40', end: '12:20' }, // 7
    { start: '12:20', end: '12:40' }, // Break 2
    { start: '12:40', end: '13:20' }, // 8
    { start: '13:20', end: '14:00' }, // 9
    { start: '14:00', end: '14:40' }, // 10
    { start: '14:40', end: '15:20' }, // 11
]

// Mapping: Day -> [ { period: index, codes: [X1, X2, X3, X4, X5] } ]
const scheduleData = {
    // 1 (Senin)
    1: [
        { p: 1, codes: [25, 12, 29, 23, 8] },
        { p: 2, codes: [25, 12, 29, 23, 8] },
        { p: 3, codes: [7, 19, 29, 8, 28] },
        { p: 4, codes: [7, 19, 29, 8, 28] },
        { p: 5, codes: [8, 30, 23, 7, 12] },
        { p: 6, codes: [8, 30, 23, 7, 12] },
        { p: 7, codes: [8, 23, 30, 17, 29] },
        { p: 8, codes: [13, 23, 30, 17, 19] },
        { p: 9, codes: [13, 17, 17, 30, 19] },
    ],
    // 2 (Selasa)
    2: [
        { p: 1, codes: [17, 8, 15, 19, 25] },
        { p: 2, codes: [17, 8, 15, 19, 25] },
        { p: 3, codes: [24, 19, 7, 25, 17] },
        { p: 4, codes: [24, 19, 7, 25, 17] },
        { p: 5, codes: [12, 3, 8, 24, 19] },
        { p: 6, codes: [12, 3, 8, 24, 19] },
        { p: 7, codes: [19, 3, 8, 12, 23] },
        { p: 8, codes: [19, 7, 3, 12, 23] },
        { p: 9, codes: [22, 7, 3, 12, 0] },
    ],
    // 3 (Rabu)
    3: [
        { p: 1, codes: [30, 13, 27, 29, 24] },
        { p: 2, codes: [30, 13, 27, 29, 24] },
        { p: 3, codes: [14, 17, 13, 27, 29] },
        { p: 4, codes: [14, 17, 13, 27, 29] },
        { p: 5, codes: [29, 24, 25, 13, 27] },
        { p: 6, codes: [29, 24, 25, 13, 27] },
        { p: 7, codes: [27, 25, 12, 14, 13] },
        { p: 8, codes: [27, 25, 12, 14, 13] },
    ],
    // 4 (Kamis)
    4: [
        { p: 1, codes: [16, 14, 24, 15, 3] },
        { p: 2, codes: [16, 14, 24, 15, 3] },
        { p: 3, codes: [23, 16, 14, 22, 3] },
        { p: 4, codes: [23, 16, 14, 3, 22] },
        { p: 5, codes: [27, 29, 16, 3, 15] },
        { p: 6, codes: [27, 29, 16, 3, 15] },
        { p: 7, codes: [27, 29, 16, 14, 19] },
        { p: 8, codes: [3, 27, 29, 16, 14] },
    ],
    // 5 (Jumat)
    5: [
        { p: 1, codes: [3, 25, 15, 19, 27] },
        { p: 2, codes: [3, 25, 15, 19, 27] },
        { p: 3, codes: [3, 25, 15, 19, 27] },
        { p: 4, codes: [27, 17, 19, 14, 12] },
        { p: 5, codes: [27, 17, 19, 14, 12] },
        { p: 6, codes: [23, 27, 13, 30, 12] },
    ]
}

const main = async () => {
    console.log('Seeding Homerooms and Schedules...')

    // 1. Resolve Academic Year
    const academicYear = await prisma.academicYear.findFirst({ where: { isActive: true } })
    if (!academicYear) throw new Error('No active academic year')

    // 2. Resolve Teachers (Name -> ID)
    const teacherMap = new Map() // Code(Int) -> ID
    for (const [code, name] of Object.entries(teacherCodes)) {
        const t = await prisma.teacher.findFirst({ where: { name } })
        if (t) {
            teacherMap.set(parseInt(code), t.id)
            // Determine primary subject for this teacher to use for schedule
            const subjects = await prisma.teacherSubject.findMany({
                where: { teacherId: t.id },
                include: { subject: true }
            })
            // Map teacherId -> [subjects]
            t.subjects = subjects.map(s => s.subject)
        } else {
            console.warn(`Teacher not found: ${name}`)
        }
    }

    // 3. Resolve Classes (Name -> ID)
    const classMap = new Map() // Name -> ID
    const classNames = ['X-1', 'X-2', 'X-3', 'X-4', 'X-5']
    for (const name of classNames) {
        const c = await prisma.class.findFirst({
            where: {
                name,
                academicYearId: academicYear.id
            }
        })
        if (c) classMap.set(name, c.id)
    }

    // 4. Assign Homerooms
    for (const [clsName, tCode] of Object.entries(homerooms)) {
        const classId = classMap.get(clsName)
        const teacherId = teacherMap.get(tCode)

        if (classId && teacherId) {
            await prisma.class.update({
                where: { id: classId },
                data: { homeroomTeacherId: teacherId }
            })
            console.log(`Assigned Homeroom: ${clsName} -> Code ${tCode}`)
        }
    }

    // 5. Create Schedules
    // Wipe existing schedules for these classes first? Safer to avoid duplicates.
    const classIds = Array.from(classMap.values())

    // We'll deleteMany for these classes.
    try {
        await prisma.classSchedule.deleteMany({
            where: { classId: { in: classIds } }
        })
    } catch (e) {
        console.warn("Delete failed, likely empty table or constrain", e)
    }

    for (const day of [1, 2, 3, 4, 5]) {
        const data = scheduleData[day]
        if (!data) continue

        console.log(`Processing Day ${day}...`)

        for (const entry of data) {
            const periodIdx = entry.p

            let timeInfo
            if (periodIdx === 0) timeInfo = { start: '06:30', end: '07:20' }
            else if (periodIdx === 1) timeInfo = { start: '07:20', end: '08:00' }
            else if (periodIdx === 2) timeInfo = { start: '08:00', end: '08:40' }
            else if (periodIdx === 3) timeInfo = { start: '08:40', end: '09:20' }
            else if (periodIdx === 4) timeInfo = { start: '09:20', end: '10:00' }
            else if (periodIdx === 5) timeInfo = { start: '10:20', end: '11:00' }
            else if (periodIdx === 6) timeInfo = { start: '11:00', end: '11:40' }
            else if (periodIdx === 7) timeInfo = { start: '11:40', end: '12:20' }
            else if (periodIdx === 8) timeInfo = { start: '12:40', end: '13:20' }
            else if (periodIdx === 9) timeInfo = { start: '13:20', end: '14:00' }
            else if (periodIdx === 10) timeInfo = { start: '14:00', end: '14:40' }
            else timeInfo = { start: '00:00', end: '00:00' }

            // Iterate Classes in row
            for (let idx = 0; idx < entry.codes.length; idx++) {
                const tCode = entry.codes[idx]
                if (tCode === 0) continue // Empty

                const clsName = classNames[idx]
                const classId = classMap.get(clsName)
                const teacherId = teacherMap.get(tCode)

                if (classId && teacherId) {
                    // Pick Subject
                    // Re-fetch since we didn't store fully in map, or store map better
                    // Just quick fetch for now, performance is fine for seed
                    const teacherSubjects = await prisma.teacherSubject.findMany({
                        where: { teacherId },
                        include: { subject: true }
                    })

                    const subjectId = teacherSubjects[0]?.subjectId

                    if (subjectId) {
                        try {
                            await prisma.classSchedule.create({
                                data: {
                                    classId,
                                    subjectId,
                                    teacherId,
                                    dayOfWeek: day,
                                    startTime: timeInfo.start,
                                    endTime: timeInfo.end,
                                }
                            })
                        } catch (err) {
                            console.error(`Failed to create schedule for ${clsName} period ${periodIdx}:`, err.message)
                        }
                    } else {
                        console.warn(`No subject found for teacher ${tCode} assigned to ${clsName}`)
                    }
                }
            }
        }
    }

    console.log('Done seeding schedules')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
