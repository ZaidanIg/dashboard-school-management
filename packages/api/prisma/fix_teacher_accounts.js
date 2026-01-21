import { PrismaClient } from '@prisma/client'
import { hashPassword } from 'better-auth/crypto'

const prisma = new PrismaClient()

const main = async () => {
    console.log('Fixing Teacher Accounts...')

    // 1. Get all Users with role TEACHER or PRINCIPAL
    const teachers = await prisma.user.findMany({
        where: {
            role: { in: ['TEACHER', 'PRINCIPAL'] }
        }
    })

    console.log(`Found ${teachers.length} teacher/principal users.`)

    const defaultPassword = '123456'
    const hashedPassword = await hashPassword(defaultPassword)

    for (const user of teachers) {
        try {
            // Check if credential account exists
            const existingAccount = await prisma.account.findFirst({
                where: {
                    userId: user.id,
                    providerId: 'credential'
                }
            })

            if (existingAccount) {
                // Should we reset it? 
                // Yes, to ensure standardized access as requested "for teacher to give access"
                // Assuming this is a seed fix, we force reset to known default.
                await prisma.account.update({
                    where: { id: existingAccount.id },
                    data: { password: hashedPassword }
                })
                // console.log(`Updated account for ${user.name}`)
            } else {
                // Create Account
                await prisma.account.create({
                    data: {
                        userId: user.id,
                        accountId: user.id,
                        providerId: 'credential',
                        password: hashedPassword,
                        scope: 'read:users'
                    }
                })
                // console.log(`Created account for ${user.name}`)
            }
            process.stdout.write('.')
        } catch (error) {
            console.error(`Error processing ${user.email}:`, error)
        }
    }

    console.log('\nDone! Default password for all teachers is: 123456')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
