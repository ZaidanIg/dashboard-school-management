import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Extracted from student data
const classes = [
    { name: 'X-1', grade: 10, major: 'UMUM' },
    { name: 'X-2', grade: 10, major: 'UMUM' },
    { name: 'X-3', grade: 10, major: 'UMUM' },
    { name: 'X-4', grade: 10, major: 'UMUM' },
    { name: 'X-5', grade: 10, major: 'UMUM' },
]

const main = async () => {
    console.log('Seeding Classes...')

    // Get Active Academic Year
    let academicYear = await prisma.academicYear.findFirst({
        where: { isActive: true }
    })

    if (!academicYear) {
        console.log('No active academic year found (checking 2025/2026)...')
        // Try to find by name, or create
        academicYear = await prisma.academicYear.upsert({
            where: { name: '2025/2026' }, // Assuming name is unique or we find best match
            update: {},
            create: {
                name: '2025/2026',
                startDate: new Date('2025-07-15'),
                endDate: new Date('2026-06-20'),
                isActive: true
            }
        })
    }

    // Check if unique on name wasn't possible on findFirst? 
    // Schema: @@unique([name, academicYearId]) in Class.
    // So we need correct academicYearId.

    for (const cls of classes) {
        const result = await prisma.class.upsert({
            where: {
                name_academicYearId: {
                    name: cls.name,
                    academicYearId: academicYear.id
                }
            },
            update: {
                grade: cls.grade,
                major: cls.major,
                capacity: 36
            },
            create: {
                name: cls.name,
                grade: cls.grade,
                major: cls.major,
                academicYearId: academicYear.id,
                capacity: 36
            }
        })
        console.log(`Class seeded: ${result.name} (Grade ${result.grade})`)
    }

    console.log('Class seeding completed.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
