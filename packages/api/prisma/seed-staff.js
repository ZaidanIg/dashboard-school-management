
import { prisma } from '../src/plugins/prisma.js'

async function main() {
    console.log('🌱 Seeding Staff Account...')

    const email = 'staff@school.com'
    const name = 'Admin TU'

    // Cleanup existing
    console.log('   - Cleaning up old data...')
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            await prisma.account.deleteMany({ where: { userId: existingUser.id } })
            await prisma.user.delete({ where: { email } })
        }
    } catch (e) {
        console.log('   ! Cleanup warning:', e.message)
    }

    // Hash password
    console.log('   - Creating user account...')
    let hashedPassword
    try {
        const crypto = await import('better-auth/crypto')
        hashedPassword = await crypto.hashPassword('staff123')
    } catch (e) {
        console.error('   ! Failed to import hashPassword:', e.message)
        process.exit(1)
    }

    // Create User with STAFF role
    const user = await prisma.user.create({
        data: {
            email,
            name,
            role: 'STAFF',
            status: 'ACTIVE',
            emailVerified: true
        }
    })

    console.log('   - Creating account credential...')
    await prisma.account.create({
        data: {
            userId: user.id,
            accountId: user.id,
            providerId: 'credential',
            password: hashedPassword
        }
    })

    console.log('')
    console.log('✅ Staff Account Created Successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('   Email:    staff@school.com')
    console.log('   Password: staff123')
    console.log('   Role:     STAFF')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
}

main().catch(console.error).finally(() => prisma.$disconnect())
