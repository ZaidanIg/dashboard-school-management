import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding Schedules and Subjects...')

    // 1. Ensure Active Academic Year
    let academicYear = await prisma.academicYear.findFirst({
        where: { isActive: true }
    })

    if (!academicYear) {
        console.log('No active academic year found. Creating one...')
        academicYear = await prisma.academicYear.create({
            data: {
                name: '2025/2026',
                startDate: new Date('2025-07-01'),
                endDate: new Date('2026-06-30'),
                isActive: true
            }
        })
    }

    // 2. Create/Find Subjects
    const subjectsData = [
        { code: 'MTK', name: 'Matematika', category: 'WAJIB' },
        { code: 'IND', name: 'Bahasa Indonesia', category: 'WAJIB' },
        { code: 'ING', name: 'Bahasa Inggris', category: 'WAJIB' },
        { code: 'IPA', name: 'Ilmu Pengetahuan Alam', category: 'WAJIB' },
        { code: 'IPS', name: 'Ilmu Pengetahuan Sosial', category: 'WAJIB' },
        { code: 'PJK', name: 'Penjaskes', category: 'WAJIB' },
    ]

    for (const s of subjectsData) {
        await prisma.subject.upsert({
            where: { code: s.code },
            update: {},
            create: s
        })
    }

    // 3. Find a Class to assign schedule to (or create)
    let cls = await prisma.class.findFirst({
        where: {
            academicYearId: academicYear.id,
            deletedAt: null
        }
    })

    if (!cls) {
        console.log('No class found. Creating "X-A"...')
        cls = await prisma.class.create({
            data: {
                name: 'X-A',
                grade: 10,
                major: 'UMUM',
                academicYearId: academicYear.id
            }
        })
    }

    console.log(`Assigning schedule to Class ${cls.name} (${cls.id})`)

    // 4. Create Schedule for Monday (1) & Tuesday (2)
    // Clear existing schedule
    await prisma.classSchedule.deleteMany({
        where: { classId: cls.id }
    })

    const mtk = await prisma.subject.findUnique({ where: { code: 'MTK' } })
    const indo = await prisma.subject.findUnique({ where: { code: 'IND' } })
    const ipa = await prisma.subject.findUnique({ where: { code: 'IPA' } })

    // Monday
    await prisma.classSchedule.create({
        data: {
            classId: cls.id,
            subjectId: mtk.id,
            dayOfWeek: 1, // Monday
            startTime: '07:00',
            endTime: '08:30',
            room: '101'
        }
    })
    await prisma.classSchedule.create({
        data: {
            classId: cls.id,
            subjectId: indo.id,
            dayOfWeek: 1,
            startTime: '08:30',
            endTime: '10:00',
            room: '101'
        }
    })

    // Tuesday (Tomorrow/Today depending on when run, we assume today might be any day)
    // We add schedules for all days to be safe for demo
    for (let day = 1; day <= 5; day++) {
        if (day === 1) continue // already done
        await prisma.classSchedule.create({
            data: {
                classId: cls.id,
                subjectId: ipa.id,
                dayOfWeek: day,
                startTime: '07:00',
                endTime: '09:00',
                room: 'Lab IPA'
            }
        })
    }

    // 5. Create Calendar Events
    console.log('Seeding Calendar Events...')
    const events = [
        {
            title: 'Ujian Tengah Semester',
            startDate: new Date(), // Today
            endDate: new Date(new Date().setDate(new Date().getDate() + 5)),
            type: 'EXAM'
        },
        {
            title: 'Libur Nasional',
            startDate: new Date(new Date().setDate(new Date().getDate() + 10)),
            endDate: new Date(new Date().setDate(new Date().getDate() + 10)),
            type: 'HOLIDAY'
        }
    ]

    for (const evt of events) {
        await prisma.academicCalendarEvent.create({
            data: {
                academicYearId: academicYear.id,
                ...evt
            }
        })
    }

    console.log('Seeding completed.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
