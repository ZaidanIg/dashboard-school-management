import { auth } from '../src/plugins/auth.js'
import { prisma } from '../src/plugins/prisma.js'

async function main() {
    console.log('🌱 Seeding database...')

    // 1. Create School Profile
    const school = await prisma.school.upsert({
        where: { npsn: '20100001' },
        update: {},
        create: {
            npsn: '20100001',
            name: 'SMAS YKM Tanjungsari',
            status: 'NEGERI',
            educationType: 'SMA',
            accreditation: 'A',
            accreditationYear: 2023,
            foundedYear: 1965,
            curriculum: 'Kurikulum Merdeka',
            vision: 'Mewujudkan sekolah unggul yang menghasilkan lulusan berkarakter, berprestasi, berwawasan global.',
            mission: [
                'Menyelenggarakan pendidikan berkualitas',
                'Mengembangkan potensi siswa secara optimal',
                'Membangun karakter dan budi pekerti luhur'
            ],
            address: 'Jl. Raya Tannjungsari',
            city: 'Tanjungsari',
            province: 'Jawa Barat',
            postalCode: '45362',
            phone: '(022) 123-4567',
            email: 'info@smaykmtanjungsari.sch.id'
        }
    })
    console.log('✅ School profile created')

    // 2. Create Academic Year
    const academicYear = await prisma.academicYear.upsert({
        where: { id: 'ay-2024-2025' },
        update: {},
        create: {
            id: 'ay-2024-2025',
            name: '2024/2025',
            startDate: new Date('2024-07-15'),
            endDate: new Date('2025-06-30'),
            isActive: true
        }
    })
    console.log('✅ Academic year created')

    // 3. Create Users with Different Roles
    // Using better-auth API to ensure correct password hashing
    const users = [
        {
            email: 'admin@school.com',
            name: 'Super Admin',
            role: 'SUPER_ADMIN',
            status: 'ACTIVE'
        },
        {
            email: 'kepsek@school.com',
            name: 'Kepala Sekolah',
            role: 'PRINCIPAL',
            status: 'ACTIVE'
        },
        {
            email: 'guru@school.com',
            name: 'Budi Santoso (Guru)',
            role: 'TEACHER',
            status: 'ACTIVE'
        },
        {
            email: 'staff@school.com',
            name: 'Staff Administrasi',
            role: 'STAFF',
            status: 'ACTIVE'
        },
        {
            email: 'siswa@school.com',
            name: 'Ahmad Siswa',
            role: 'STUDENT',
            status: 'ACTIVE'
        },
        {
            email: 'ortu@school.com',
            name: 'Orang Tua Ahmad',
            role: 'PARENT',
            status: 'ACTIVE'
        }
    ]

    console.log('👤 Seeding users...')
    for (const userData of users) {
        try {
            // Check if user exists
            const existingUser = await prisma.user.findUnique({
                where: { email: userData.email }
            })

            let userId = existingUser?.id

            // If user doesn't exist, create using auth API to hash password
            if (!existingUser) {
                const res = await auth.api.signUpEmail({
                    body: {
                        email: userData.email,
                        password: 'password123',
                        name: userData.name
                    }
                })
                userId = res.user.id
                console.log(`   + Created user: ${userData.email}`)
            } else {
                // For existing users, if we wanted to reset password, we'd need to delete and recreate 
                // because hashing is internal. For now, assume existing is fine or manual delete needed.
                // Actually, let's delete and recreate to be sure the password is correct/reset.
                await prisma.user.delete({ where: { email: userData.email } })
                const res = await auth.api.signUpEmail({
                    body: {
                        email: userData.email,
                        password: 'password123',
                        name: userData.name
                    }
                })
                userId = res.user.id
                console.log(`   ~ Recreated user: ${userData.email}`)
            }

            // Update Role & Status directly in DB (since signUp doesn't allow setting role usually)
            if (userId) {
                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        role: userData.role,
                        status: userData.status,
                        emailVerified: true
                    }
                })
            }

        } catch (error) {
            console.error(`   ! Failed to seed user ${userData.email}:`, error)
        }
    }
    console.log('✅ Users & Roles created')

    // 4. Create Subjects
    const subjects = [
        { code: 'MTK', name: 'Matematika', category: 'WAJIB', hoursPerWeek: 5 },
        { code: 'BIN', name: 'Bahasa Indonesia', category: 'WAJIB', hoursPerWeek: 4 },
        { code: 'BIG', name: 'Bahasa Inggris', category: 'WAJIB', hoursPerWeek: 4 },
        { code: 'IPA', name: 'Ilmu Pengetahuan Alam', category: 'WAJIB', hoursPerWeek: 6 },
        { code: 'IPS', name: 'Ilmu Pengetahuan Sosial', category: 'WAJIB', hoursPerWeek: 4 },
        { code: 'FIS', name: 'Fisika', category: 'PEMINATAN_IPA', hoursPerWeek: 4 }
    ]

    for (const subject of subjects) {
        await prisma.subject.upsert({
            where: { code: subject.code },
            update: {},
            create: subject
        })
    }
    console.log('✅ Subjects created')

    // 5. Create Teacher Profiles
    const teacherData = [
        { nip: '198501012010011001', name: 'Budi Santoso, S.Pd', gender: 'MALE', position: 'PNS', isCertified: true },
        { nip: '198703152011012002', name: 'Siti Aminah, M.Pd', gender: 'FEMALE', position: 'PNS', isCertified: true },
        { nip: '199005202015011003', name: 'Ahmad Rizki, S.Pd', gender: 'MALE', position: 'HONORER' }
    ]

    for (const teacher of teacherData) {
        await prisma.teacher.upsert({
            where: { nip: teacher.nip },
            update: {},
            create: teacher
        })
    }
    console.log('✅ Teacher Profiles created')

    // 6. Create Classes
    const classes = [
        { name: '10-A', grade: 10, major: 'IPA' },
        { name: '10-B', grade: 10, major: 'IPS' },
        { name: '11-A', grade: 11, major: 'IPA' },
        { name: '12-A', grade: 12, major: 'IPA' }
    ]

    for (const cls of classes) {
        await prisma.class.upsert({
            where: { name_academicYearId: { name: cls.name, academicYearId: academicYear.id } },
            update: {},
            create: { ...cls, academicYearId: academicYear.id }
        })
    }
    console.log('✅ Classes created')

    console.log('🌱 Seeding COMPLETED!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
