import { PrismaClient } from '@prisma/client'
import { hashPassword } from 'better-auth/crypto'

const prisma = new PrismaClient()

const main = async () => {
    console.log('Fixing Student Accounts...')

    // 1. Get all Users with role STUDENT
    const students = await prisma.user.findMany({
        where: { role: 'STUDENT' }
    })

    console.log(`Found ${students.length} student users.`)

    for (const user of students) {
        try {
            // 2. Find corresponding Student record to get NIS (Password)
            // Match by email
            const studentRecord = await prisma.student.findFirst({
                where: { email: user.email }
            })

            if (!studentRecord) {
                console.warn(`No student record found for user ${user.email}`)
                continue
            }

            const passwordPlain = studentRecord.nis

            // 3. Hash Password
            const hashedPassword = await hashPassword(passwordPlain)

            // 4. Create/Update Account
            // Check if credential account exists
            const existingAccount = await prisma.account.findFirst({
                where: {
                    userId: user.id,
                    providerId: 'credential'
                }
            })

            if (existingAccount) {
                // Update password
                await prisma.account.update({
                    where: { id: existingAccount.id },
                    data: { password: hashedPassword }
                })
                // console.log(`Updated account for ${user.name} (${passwordPlain})`)
            } else {
                // Create Account
                // Matching handlers/teachers.js logic: accountId = user.id
                await prisma.account.create({
                    data: {
                        userId: user.id,
                        accountId: user.id,
                        providerId: 'credential',
                        password: hashedPassword,
                        scope: 'read:users' // optional
                    }
                })
                // console.log(`Created account for ${user.name} (${passwordPlain})`)
            }
            process.stdout.write('.')
        } catch (error) {
            console.error(`Error processing ${user.email}:`, error)
        }
    }

    console.log('\nDone!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
