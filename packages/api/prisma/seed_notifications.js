import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding notifications and linking teacher/student...')

    // 1. Find teacher & user
    const teacherUser = await prisma.user.findUnique({ where: { email: 'guru@school.com' } })
    const teacher = await prisma.teacher.findFirst({ where: { name: { contains: 'Budi' } } })
    if (teacher && teacherUser) {
        await prisma.teacher.update({
            where: { id: teacher.id },
            data: {
                userId: teacherUser.id,
                email: teacherUser.email
            }
        })
        console.log('Linked teacher Budi Santoso to user guru@school.com')
    }

    // 2. Find or create student for siswa@school.com
    let siswaUser = await prisma.user.findUnique({ where: { email: 'siswa@school.com' } })
    let siswaStudent = await prisma.student.findFirst({ where: { email: 'siswa@school.com' } })
    if (!siswaStudent) {
        siswaStudent = await prisma.student.create({
            data: {
                nis: '10293847',
                name: 'Budi Siswa',
                email: 'siswa@school.com',
                gender: 'MALE',
                status: 'ACTIVE'
            }
        })
        console.log('Created Student record for siswa@school.com')
    }

    // 3. Find Class 10-A
    const class10A = await prisma.class.findFirst({ where: { name: '10-A' } })
    const studentAmira = await prisma.student.findFirst({ where: { email: 'amira@gmail.com' } })

    if (class10A) {
        // Enroll Amira in 10-A
        if (studentAmira) {
            const existingEnrollAmira = await prisma.classEnrollment.findFirst({
                where: { studentId: studentAmira.id, classId: class10A.id }
            })
            if (!existingEnrollAmira) {
                await prisma.classEnrollment.create({
                    data: {
                        studentId: studentAmira.id,
                        classId: class10A.id,
                        status: 'ACTIVE'
                    }
                })
                console.log('Enrolled Amira in 10-A')
            }
        }

        // Enroll siswa@school.com in 10-A
        if (siswaStudent) {
            const existingEnrollSiswa = await prisma.classEnrollment.findFirst({
                where: { studentId: siswaStudent.id, classId: class10A.id }
            })
            if (!existingEnrollSiswa) {
                await prisma.classEnrollment.create({
                    data: {
                        studentId: siswaStudent.id,
                        classId: class10A.id,
                        status: 'ACTIVE'
                    }
                })
                console.log('Enrolled siswa@school.com in 10-A')
            }
        }
    }

    // 4. Create sample Assignments
    const subjectMath = await prisma.subject.findFirst({ where: { name: 'Matematika' } })
    const subjectIndo = await prisma.subject.findFirst({ where: { name: 'Bahasa Indonesia' } })

    let assignment1 = null
    let assignment2 = null

    if (class10A && subjectMath && teacher) {
        assignment1 = await prisma.assignment.findFirst({ where: { title: 'Tugas 1: Aljabar Linear & Persamaan Kuadrat' } })
        if (!assignment1) {
            const due = new Date()
            due.setDate(due.getDate() + 7)
            assignment1 = await prisma.assignment.create({
                data: {
                    title: 'Tugas 1: Aljabar Linear & Persamaan Kuadrat',
                    description: 'Kerjakan soal latihan nomor 1 sampai 10 di buku paket halaman 45. Unggah jawaban dalam bentuk PDF.',
                    classId: class10A.id,
                    subjectId: subjectMath.id,
                    teacherId: teacher.id,
                    dueDate: due,
                    maxScore: 100
                }
            })
            console.log('Created assignment 1')
        }
    }

    if (class10A && subjectIndo && teacher) {
        assignment2 = await prisma.assignment.findFirst({ where: { title: 'Tugas 2: Analisis Struktur Teks Eksposisi' } })
        if (!assignment2) {
            const due = new Date()
            due.setDate(due.getDate() + 10)
            assignment2 = await prisma.assignment.create({
                data: {
                    title: 'Tugas 2: Analisis Struktur Teks Eksposisi',
                    description: 'Bacalah teks eksposisi di buku halaman 60 lalu tentukan tesis, argumentasi, dan rekomendasi.',
                    classId: class10A.id,
                    subjectId: subjectIndo.id,
                    teacherId: teacher.id,
                    dueDate: due,
                    maxScore: 100
                }
            })
            console.log('Created assignment 2')
        }
    }

    // 5. Seed notifications for STUDENT
    const studentNotifs = [
        {
            title: 'Tugas Baru: Aljabar Linear & Persamaan Kuadrat',
            message: 'Tugas baru matematika untuk kelas 10-A telah di-assign oleh Pak Budi. Tenggat pengumpulan: 7 hari lagi.',
            type: 'ASSIGNMENT',
            role: 'STUDENT',
            classId: class10A?.id || null,
            link: assignment1 ? `/student-portal/assignments/${assignment1.id}` : '/student-portal/assignments',
            metadata: {
                assignmentId: assignment1?.id,
                subject: 'Matematika'
            }
        },
        {
            title: 'Tugas Baru: Analisis Struktur Teks Eksposisi',
            message: 'Tugas baru Bahasa Indonesia telah di-assign. Silakan cek detail tugas dan tenggat pengumpulan.',
            type: 'ASSIGNMENT',
            role: 'STUDENT',
            classId: class10A?.id || null,
            link: assignment2 ? `/student-portal/assignments/${assignment2.id}` : '/student-portal/assignments',
            metadata: {
                assignmentId: assignment2?.id,
                subject: 'Bahasa Indonesia'
            }
        },
        {
            title: 'Pemberitahuan Operator: Kartu Peserta Ujian',
            message: 'Kartu tanda peserta ujian semester dapat diambil di ruang Tata Usaha pada jam operasional sekolah.',
            type: 'INFO',
            role: 'STUDENT',
            classId: null,
            link: '/student-portal/announcements',
            metadata: { source: 'Operator Tata Usaha' }
        }
    ]

    for (const notif of studentNotifs) {
        const exists = await prisma.notification.findFirst({
            where: { title: notif.title, role: 'STUDENT' }
        })
        if (!exists) {
            await prisma.notification.create({
                data: notif
            })
            console.log(`Created student notification: ${notif.title}`)
        }
    }

    // 6. Seed notifications for TEACHER
    const teacherNotifs = [
        {
            title: 'Tugas Dikumpulkan: Amira (10-A)',
            message: 'Amira (10-A) telah mengumpulkan tugas "Tugas 1: Aljabar Linear & Persamaan Kuadrat" (Tepat Waktu).',
            type: 'SUBMISSION',
            role: 'TEACHER',
            userId: teacherUser?.id || null,
            classId: class10A?.id || null,
            link: assignment1 ? `/teacher-portal/assignments/${assignment1.id}` : '/teacher-portal/assignments',
            metadata: {
                studentName: 'Amira',
                className: '10-A',
                isLate: false
            }
        },
        {
            title: 'Tugas Dikumpulkan: Ahmad Dapodik (10-A)',
            message: 'Ahmad Dapodik (10-A) telah mengumpulkan tugas "Tugas 1: Aljabar Linear & Persamaan Kuadrat" (Tepat Waktu).',
            type: 'SUBMISSION',
            role: 'TEACHER',
            userId: teacherUser?.id || null,
            classId: class10A?.id || null,
            link: assignment1 ? `/teacher-portal/assignments/${assignment1.id}` : '/teacher-portal/assignments',
            metadata: {
                studentName: 'Ahmad Dapodik',
                className: '10-A',
                isLate: false
            }
        },
        {
            title: 'Pemberitahuan Operator: Rapat Dewan Guru Evaluasi Bulanan',
            message: 'Diberitahukan kepada seluruh Bapak/Ibu Guru, rapat dewan guru evaluasi bulanan akan diadakan Jumat pukul 13.30 WIB di Ruang Guru.',
            type: 'INFO',
            role: 'TEACHER',
            userId: null,
            classId: null,
            link: '/teacher-portal',
            metadata: { source: 'Operator Tata Usaha' }
        }
    ]

    for (const notif of teacherNotifs) {
        const exists = await prisma.notification.findFirst({
            where: { title: notif.title, role: 'TEACHER' }
        })
        if (!exists) {
            await prisma.notification.create({
                data: notif
            })
            console.log(`Created teacher notification: ${notif.title}`)
        }
    }

    console.log('Notification seeding completed successfully!')
}

main()
    .catch(e => {
        console.error('Error seeding notifications:', e)
        process.exit(1)
    })
    .finally(() => {
        prisma.$disconnect()
    })
