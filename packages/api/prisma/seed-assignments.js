import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding Assignments...')

    // 1. Find a Class (Any active class)
    const cls = await prisma.class.findFirst({
        where: { deletedAt: null }
    })

    if (!cls) {
        console.log('No class found.')
        return
    }
    console.log(`Seeding assignments for Class: ${cls.name}`)

    // 2. Find Subjects
    const mtk = await prisma.subject.findUnique({ where: { code: 'MTK' } })
    const indo = await prisma.subject.findUnique({ where: { code: 'IND' } })

    if (!mtk || !indo) {
        console.log('Subjects not found.')
        return
    }

    // 3. Find or Create Teacher
    let teacher = await prisma.teacher.findFirst()
    if (!teacher) {
        console.log('Creating dummy teacher...')
        teacher = await prisma.teacher.create({
            data: {
                name: 'Budi Santoso',
                nip: '198001012005011001',
                gender: 'MALE',
                position: 'PNS',
                status: 'ACTIVE',
                isCertified: true,
                joinDate: new Date('2010-01-01')
            }
        })
    }

    // 4. Create Assignments
    const assignments = [
        {
            title: 'Latihan Soal Aljabar Linear',
            description: 'Kerjakan halaman 20-22 no 1-10',
            dueDate: new Date(new Date().setDate(new Date().getDate() + 2)), // Due in 2 days
            maxScore: 100,
            classId: cls.id,
            subjectId: mtk.id,
            teacherId: teacher.id
        },
        {
            title: 'Analisis Cerpen',
            description: 'Buat analisis intrinsik cerpen pilihan',
            dueDate: new Date(new Date().setDate(new Date().getDate() - 1)), // Due yesterday
            maxScore: 100,
            classId: cls.id,
            subjectId: indo.id,
            teacherId: teacher.id
        }
    ]

    for (const a of assignments) {
        await prisma.assignment.create({
            data: a
        })
    }

    console.log('Seeding Assignments Completed.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
