
import { prisma } from '../src/plugins/prisma.js'

async function main() {
    console.log('🌱 Seeding Ikhsan...')

    // 1. Academic Year
    const academicYear = await prisma.academicYear.upsert({
        where: { id: 'ay-2024-2025' },
        update: {},
        create: {
            id: 'ay-2024-2025',
            name: '2024/2025',
            startDate: new Date('2024-07-15'),
            endDate: new Date('2025-06-15'),
            isActive: true
        }
    })

    // 2. Class 12 IPA 1
    const cls = await prisma.class.upsert({
        where: { name_academicYearId: { name: '12 IPA 1', academicYearId: academicYear.id } },
        update: {},
        create: {
            name: '12 IPA 1',
            grade: 12,
            major: 'IPA',
            capacity: 36,
            academicYearId: academicYear.id
        }
    })

    // 3. User
    const email = 'ikhsan@school.com'
    const name = 'Ikhsan Santoso'

    console.log('   - Cleaning up old data...')
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            await prisma.user.delete({ where: { email } })
        }
        await prisma.student.deleteMany({ where: { email } })
    } catch (e) {
        console.log('   ! Cleanup warning:', e.message)
    }

    // Create User via Prisma Direct
    console.log('   - Creating user account (Direct)...')

    // Import hash password dynamically
    // Note: ensure better-auth is installed. Should be if handlers work.
    let hashedPassword
    try {
        const crypto = await import('better-auth/crypto')
        hashedPassword = await crypto.hashPassword('password123')
    } catch (e) {
        console.warn('   ! Failed to import hashPassword, using plain/placeholder (Login might fail if hashing verified). Error:', e.message)
        // Fallback or exit? If hashing is required by better-auth runtime, this User won't be able to login.
        // But handlers/students.js used it, so it should work.
        process.exit(1)
    }

    const user = await prisma.user.create({
        data: {
            email,
            name,
            role: 'STUDENT',
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

    const userId = user.id

    // 4. Student Profile
    console.log('   - Creating student profile...')
    const student = await prisma.student.create({
        data: {
            name,
            email,
            nis: '20241201',
            nisn: '0012345678',
            gender: 'MALE',
            birthPlace: 'Jakarta',
            birthDate: new Date('2006-05-20'),
            address: 'Jl. Sudirman No. 1',
            phone: '081234567890',
            status: 'ACTIVE',
            classEnrollments: {
                create: {
                    classId: cls.id,
                    status: 'ACTIVE'
                }
            }
        }
    })

    // 5. Subjects
    const subjectList = [
        { code: 'MTK', name: 'Matematika', cat: 'WAJIB' },
        { code: 'BIN', name: 'Bahasa Indonesia', cat: 'WAJIB' },
        { code: 'BIG', name: 'Bahasa Inggris', cat: 'WAJIB' },
        { code: 'FIS', name: 'Fisika', cat: 'PEMINATAN_IPA' },
        { code: 'KIM', name: 'Kimia', cat: 'PEMINATAN_IPA' },
        { code: 'BIO', name: 'Biologi', cat: 'PEMINATAN_IPA' },
        { code: 'PAI', name: 'Pendidikan Agama Islam', cat: 'WAJIB' },
        { code: 'PKN', name: 'Pendidikan Kewarganegaraan', cat: 'WAJIB' }
    ]

    const subjects = []
    for (const s of subjectList) {
        const sub = await prisma.subject.upsert({
            where: { code: s.code },
            update: {},
            create: {
                code: s.code,
                name: s.name,
                category: s.cat,
                hoursPerWeek: 2
            }
        })
        subjects.push(sub)
    }

    // 6. Grades (Mock Data)
    const gradesSmt1 = {
        'MTK': 84, 'BIN': 90, 'BIG': 86, 'FIS': 78, 'KIM': 82, 'BIO': 85, 'PAI': 92, 'PKN': 88
    }
    const gradesSmt2 = {
        'MTK': 86, 'BIN': 92, 'BIG': 88, 'FIS': 80, 'KIM': 85, 'BIO': 88, 'PAI': 94, 'PKN': 90
    }

    function getLetter(score) {
        if (score >= 90) return 'A'
        if (score >= 80) return 'B'
        if (score >= 70) return 'C'
        return 'D'
    }

    console.log('   - Creating grades...')
    for (const sub of subjects) {
        // Semester 1
        await prisma.grade.upsert({
            where: {
                studentId_subjectId_academicYearId_semester: {
                    studentId: student.id,
                    subjectId: sub.id,
                    academicYearId: academicYear.id,
                    semester: 'GANJIL'
                }
            },
            update: {},
            create: {
                studentId: student.id,
                subjectId: sub.id,
                academicYearId: academicYear.id,
                semester: 'GANJIL',
                finalGrade: gradesSmt1[sub.code] || 80,
                letterGrade: getLetter(gradesSmt1[sub.code] || 80),
                assignment1: (gradesSmt1[sub.code] || 80) - 2,
                midtermExam: (gradesSmt1[sub.code] || 80) - 1,
                finalExam: (gradesSmt1[sub.code] || 80) + 1
            }
        })
        // Semester 2
        await prisma.grade.upsert({
            where: {
                studentId_subjectId_academicYearId_semester: {
                    studentId: student.id,
                    subjectId: sub.id,
                    academicYearId: academicYear.id,
                    semester: 'GENAP'
                }
            },
            update: {},
            create: {
                studentId: student.id,
                subjectId: sub.id,
                academicYearId: academicYear.id,
                semester: 'GENAP',
                finalGrade: gradesSmt2[sub.code] || 82,
                letterGrade: getLetter(gradesSmt2[sub.code] || 82),
                assignment1: (gradesSmt2[sub.code] || 82) - 2,
                midtermExam: (gradesSmt2[sub.code] || 82) - 1,
                finalExam: (gradesSmt2[sub.code] || 82) + 1
            }
        })
    }

    // 7. Attendance
    console.log('   - Creating attendance...')
    const now = new Date()
    for (let i = 0; i < 30; i++) {
        const d = new Date()
        d.setDate(now.getDate() - i)
        if (d.getDay() === 0 || d.getDay() === 6) continue // Skip weekend

        // Check exists
        const exists = await prisma.studentAttendance.findUnique({
            where: {
                studentId_date: {
                    studentId: student.id,
                    date: d
                }
            }
        })

        if (!exists) {
            await prisma.studentAttendance.create({
                data: {
                    studentId: student.id,
                    date: d,
                    status: Math.random() > 0.1 ? 'PRESENT' : 'LATE',
                    checkInTime: new Date(d.setHours(7, 0, 0))
                }
            })
        }
    }

    // 8. Bills (SPP)
    let ft = await prisma.feeType.findFirst({ where: { name: 'SPP Bulanan' } })
    if (!ft) {
        ft = await prisma.feeType.create({
            data: { name: 'SPP Bulanan', amount: 500000, frequency: 'MONTHLY' }
        })
    }

    console.log('   - Creating bills...')
    await prisma.sPPBilling.create({
        data: {
            studentId: student.id,
            feeTypeId: ft.id,
            academicYearId: academicYear.id,
            year: 2024,
            month: 1, // Jan
            amount: 500000,
            dueDate: new Date('2024-01-20'),
            status: 'PAID',
            paidAmount: 500000,
            paidAt: new Date('2024-01-19')
        }
    })
    await prisma.sPPBilling.create({
        data: {
            studentId: student.id,
            feeTypeId: ft.id,
            academicYearId: academicYear.id,
            year: 2024,
            month: 2, // Feb
            amount: 500000,
            dueDate: new Date('2024-02-20'),
            status: 'PENDING'
        }
    })

    console.log('✅ Seed Finished Successfully!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
