
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding PPDB Data...')

    // 1. Get or Create Academic Year
    let academicYear = await prisma.academicYear.findFirst({
        where: { isActive: true }
    })

    if (!academicYear) {
        academicYear = await prisma.academicYear.create({
            data: {
                name: '2024/2025',
                startDate: new Date('2024-07-01'),
                endDate: new Date('2025-06-30'),
                isActive: true
            }
        })
        console.log('Created Academic Year:', academicYear.name)
    }

    // 2. Create Active PPDB Batch
    const batch = await prisma.pPDBBatch.create({
        data: {
            name: 'Gelombang 1',
            academicYearId: academicYear.id,
            startDate: new Date(), // Starts now
            endDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Ends in 30 days
            isActive: true,
            description: 'Pendaftaran Peserta Didik Baru Gelombang 1 Tahun Ajaran 2024/2025'
        }
    })

    console.log('Created Active PPDB Batch:', batch.name)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
