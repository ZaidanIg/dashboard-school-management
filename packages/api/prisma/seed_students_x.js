import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const rawData = `Kevin Maulana zakarya\t252610011\tX-1
Fajri Fauzan\t012\tX-1
ramdani maulana\t022\tX-1
bagas dwi aprian\t2526 10 002\tX-1
MUHAMAD RISKI FADILAH\t014\tX-1
VANESA BILQIS PRAMESTI\t2526-10-029\tX-1
FAHRI NAZRIL MULYADI\t2526-10-005\tX-1
Hasbie Ash Shiddiq\t2526-10-008\tX-1
Muhamad Rezza Awala Nur Syamsi\t2526-10-013\tX-1
Nazwa Zahira Sulistyawati\t2526.10.017\tX-1
sandiputraramdani\t2526.10.025\tX-1
tantry aprilianda\t2526-10-027\tX-1
Nuri maulida\t2526-10-018\tX-1
Nurul Alifah O\t2526-10-019\tX-1
Zahra rifa jauza\t2526.10.032\tX-1
Setiawati\t2526.10.026\tX-1
Tiara nur fadilah\t2526.10.028\tX-1
RAIHAN ABDULGHANI\t021\tX-1
REFI REFIAN ARDIANA\t023\tX-1
Riska aulia\t2526.10.024\tX-1
YUNITA FITRIANI PUTRI\t2526.10.031\tX-1
wina hartati\t2526.10.030\tX-1
citra wiliyanti\t004\tX-1
Rahma Aulia Nisa\t2526.10.020\tX-1
Fayza Aura Dinda Nadhifa\t2526-10-006\tX-1
ISTI ANNISA CINTA AZHARA\t2526-10-010\tX-1
cinta nur arofaj\t252610003\tX-1
Ghaisan Rahmanza Putra\t2526-10-007\tX-1
Iis Julaeha\t2526.10.009\tX-1
Naydra julianty\t2526 10 016\tX-1
Nabila Nurfarhani\t015\tX-1
Alia prisilia\t2526-10-001\tX-1
Rija lesmana\t2526 10 049\tX-2
Rima Septiani R\t2526-10-050\tX-2
siti yusviana fadilah\t2526-10-055\tX-2
Salma Riana putri\t2526-10-052\tX-2
sidik rizqi mauludin\t2526-10-054\tX-2
LINTANG ALDI LESMANA\t2526.10.041\tX-2
SHOFA.SHOFIYYATUS.SA'ADAH\t2526-10-053\tX-2
sri arniyanti\t2526.10.056\tX-2
Tiara sita dewi\t2526-10-057\tX-2
Tristan leondri canigia\t2526-10-058\tX-2
Rivki Hidayat\t2526-10-051\tX-2
Yuda jehansah\t060\tX-2
Yevina Candra\t2526 10 059\tX-2
zamzam alfa salam\t2526.10.061\tX-2
Reza\t10,048\tX-2
Alfian gunanja mustopa\t2526-10-033\tX-2
M Fadlan R.A\t2526-10-044\tX-2
Kiki Firmansyah\t2526.10.040\tX-2
Muhammad sendy febriansyah\t2526-10-045\tX-2
elano danar sugih sunarko\t2526-10-037\tX-2
Muhammad Aziz Syafi'i\t2526-10-043\tX-2
M Hasan Bangkit Arya Atmaja\t2526-10-042\tX-2
Desta Reski A\t2526.10.036\tX-2
Naswa Nur Aleesya\t2526-10-046\tX-2
ferdi maulana s\t2526-10-039\tX-2
Erik Davidtiansyah\t2526-10-038\tX-2
Annisa Nurul Fadilah\t2526.10.034\tX-2
Nayla Zaskia\t2526-10-047\tX-2
cinta aulia\t035\tX-2
Sherly Sifa Solihat\t2526.10.091\tX-3
Rehan Arya\t2526-10-086\tX-3
Robani abdul malik\t2526.10.088\tX-3
Selpi nurpitriani\t2526-10-090\tX-3
sri rahayu\t2426-10-092\tX-3
WINA QHOIRUNNISA\t095\tX-3
Teni sumarni\t094\tX-3
Zio Ramadan Putra\t2526-10-096\tX-3
REYZAN ROHNADIN YUSUF\t2526-10-087\tX-3
SYALFA DIKRIANSYAH RIZKIAN\t2526-10-093\tX-3
Muhammad Fadli Anjar saputra\t2526-10-080\tX-3
Naila azka aufa\t2526-10-082\tX-3
Sandy Algiansah octorio\t2526-10-089\tX-3
ZUITA SRI RAHAYU\t2526-10-097\tX-3
neta rahmawati\t2526.10.083\tX-3
Aldi nurhakim\t2526-10-066\tX-3
Nadine Cantika devi\t2526-10-081\tX-3
Nurdin wahid\t084\tX-3
ABDUL RAHIM\t2526-10-062\tX-3
RAPI AL-GHIFARI\t2526.10-085\tX-3
Hafizah Nurafifah\t2526-10-074\tX-3
MUHAMAD RIYAN\t2526-10-079\tX-3
ANISA AYU LESTARI\t2526-10-068\tX-3
Anggi Ilhammudin\t2525-10-067\tX-3
Azreal.Fariz.Rahman\t2526-10-070\tX-3
Azhar Zainul Muttaqin\t069\tX-3
Aditia\t2526-10-064\tX-3
Iwan hidayat\t2526-10-075\tX-3
kiki ahmad gojali\t077\tX-3
jayusman simamora\t252610076\tX-3
Adinda Melisa\t252610063\tX-3
Cecep Kusnadi\t2526.10.071\tX-3
Citra Lestari\t2526.10.072\tX-3
Dimas Pajar permana\t2526.10.073\tX-3
LISNA MUTIA NINGSIH\t078\tX-3
Aldi kusnawan\t252610065\tX-3
Rikal Nazar Fauzan\t2526.10.121\tX-4
Rio wahyu ramadan\t2526-10-122\tX-4
Tasya Maharani\t2526-10-129\tX-4
sinta nuraeni\t2526-10-125\tX-4
Rustandi\t2526.10.123\tX-4
Raffa Riandra Rahman\t2526.10.120\tX-4
syifa nuraisyah\t2526-10-127\tX-4
ryan,h\t2526,10,124\tX-4
jajang jaelani\t2525\tX-4
siti sarah ambami\t2526.10.126\tX-4
Gilang Ramadan\t252610110\tX-4
Ibrahim Setiawan\t2526 10 111\tX-4
Olivia Zahra\t2526.10.119\tX-4
Nurul purnamasani\t2526-10-118\tX-4
valent abner w\tvalent abner winata\tX-4
Alek Ali Rohman\t2526.10.101\tX-4
Fitri Siti Sofiah\t2526.10.109\tX-4
Zaskia alya medina\t2526-10-132\tX-4
Viera zaskia\t252610131\tX-4
dewi siti aminah\t2526-10-106\tX-4
adinda ulfa juniar\t252610098\tX-4
Ai Leni Widianti\t2526-10-100\tX-4
AHSAN ABDUL MANAN\t099\tX-4
ILA LENA LESTARI\t252610112\tX-4
ANNISA\t2526-10-103\tX-4
MUHAMMAD AZKA AL PADHIL\t2526-10-115\tX-4
Deca Anindia Syafira\t2526-10-105\tX-4
Bunga Regina Putri\t2526-10-104\tX-4
Nathasya chantika aprillia\t2526-10-117\tX-4
Taraono\t128\tX-4
anisa ramadhan\t2526.10.102\tX-4
FEBI WAHYUDI\t2526-10-108\tX-4
Dikri Maulana\t2526-10-0107\tX-4
Nagita Putriani\t2526-10-116\tX-4
KAISYA PUTRI KARINA\t2526-10-114\tX-4
amikal almisky\t2526-10-135\tX-5
Irham Arief Fauzi\t147\tX-5
Gilang ibrahim ramadhan\t145\tX-5
Raka Nur Sulaeman\t2526-10-156\tX-5
andi\t2526-10-136\tX-5
Daffa Milano Putra\t143\tX-5
putra islamy\t2526  10  154\tX-5
Avrilia Dewi Septiani Putri\t2526.10.140\tX-5
Ica Inriani\t2526-10-146\tX-5
APRILIANA PUTRA GINANJAR\t2526 - 10 - 139\tX-5
Anisa Herawati\t2526.10.137\tX-5
Sonia Maharani\t2626.10.164\tX-5
FEBI AMALIA H\t2526-10-144\tX-5
AHMAD ALIEF ZULFIKAR\t2526-10-134\tX-5
Kayla Yunianti\t2526-10-148\tX-5
YUNI NURFITRIYANI\t168\tX-5
Syifa Kesya Nabila\t165\tX-5
Salsabila Azahra\t2526-10-161\tX-5
CINCIN ELSIA JOYA\t142\tX-5
Anjani oktavia\t2526.10.138\tX-5
TEGUH ADY GITARA\t2526-10-166\tX-5
Nadia Oktaviani\t2526-10-151\tX-5
Nazla Salsabilla Lirabbiha\t153\tX-5
nadin maisya aqila\t2526.10.152\tX-5
MUHAMMAD FAIZ AL GHIFFARI\t2526.10.150\tX-5
Siti nurpatimah\t2526-10-163\tX-5
Sawitri gia mauladi\t2526-10-162\tX-5
Celsi Selani\t2526-10-141\tX-5
RASYA AULIA PUTRI\t2526-101-57\tX-5
Putri Siti Nurhawa\t2526.10.155\tX-5
Abiliana Adiani\t2526-10-133\tX-5
salsabila\t160\tX-5
MARSHYA MEGA ARYANTI\t2526-10-149\tX-5
Sawitri gia mauladi\t2526-10-162\tX-5
Rizal Permana\t159\tX-5
Riyan taryana\t2526.10.158\tX-5`

const normalizeNIS = (raw) => {
    let digits = raw.replace(/\D/g, '')

    if (digits.length <= 4) {
        if (digits.length <= 3) {
            return `252610${digits.padStart(3, '0')}`
        }
    }

    if (digits.length === 5 && digits.startsWith('10')) {
        return `2526${digits}`
    }

    // Fallback for short NIS that doesn't match above patterns
    if (digits.length > 0 && digits.length < 5) {
        return `252610${digits.padStart(3, '0')}`
    }

    return digits
}

const inferGender = (name) => {
    const lower = name.toLowerCase()
    const femaleKeywords = [
        'putri', 'wati', 'nisa', 'sari', 'ayu', 'lestari', 'nur', 'zahra',
        'citra', 'fayza', 'isti', 'dinda', 'cantika', 'shofa', 'alifah',
        'bilqis', 'nazwa', 'tantry', 'rima', 'siti', 'salma', 'naswa',
        'sherly', 'selpi', 'wina', 'teni', 'zuita', 'neta', 'nadine', 'hafizah',
        'anisa', 'lisna', 'tasya', 'sinta', 'syifa', 'olivia', 'zaskia',
        'viera', 'dewi', 'adinda', 'ai leni', 'ila', 'bunga', 'nathasya',
        'nagita', 'kaisya', 'avrilia', 'ica', 'sonia', 'febi amalia', 'kayla',
        'yuni', 'cincin', 'anjani', 'nadia', 'nazla', 'nadin', 'celsi',
        'rasya aulia', 'marshya', 'aura', 'annisa', 'cinta', 'raha'
    ]

    if (femaleKeywords.some(k => lower.includes(k))) return 'FEMALE'
    return 'MALE'
}

const main = async () => {
    console.log('Starting seed...')

    let academicYear = await prisma.academicYear.findFirst({
        where: { isActive: true }
    })

    if (!academicYear) {
        console.log('No active academic year found, creating one...')
        academicYear = await prisma.academicYear.create({
            data: {
                name: '2025/2026',
                startDate: new Date('2025-07-15'),
                endDate: new Date('2026-06-20'),
                isActive: true
            }
        })
    }

    const lines = rawData.split('\n')

    const students = []

    for (const line of lines) {
        if (!line.trim()) continue

        const parts = line.split('\t')
        if (parts.length < 3) continue

        const nameRaw = parts[0].trim()
        const nisRaw = parts[1].trim()
        const className = parts[2].trim()

        // Capitalize Name
        const name = nameRaw.toLowerCase().replace(/(^|\s)\S/g, l => l.toUpperCase())

        let nis = normalizeNIS(nisRaw)

        students.push({ name, nis, className, gender: inferGender(name) })
    }

    for (const student of students) {
        // Upsert Class
        const cls = await prisma.class.upsert({
            where: {
                name_academicYearId: {
                    name: student.className,
                    academicYearId: academicYear.id
                }
            },
            update: {},
            create: {
                name: student.className,
                grade: 10,
                major: 'UMUM',
                academicYearId: academicYear.id,
                capacity: 36
            }
        })

        const email = `${student.nis}@student.sch.id`

        // Upsert User
        const user = await prisma.user.upsert({
            where: { email },
            update: { name: student.name },
            create: {
                name: student.name,
                email,
                role: 'STUDENT',
                status: 'ACTIVE',
                image: `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`
            }
        })

        // Upsert Student
        const studentRecord = await prisma.student.upsert({
            where: { nis: student.nis },
            update: {
                name: student.name,
                email: user.email,
                status: 'ACTIVE'
            },
            create: {
                nis: student.nis,
                name: student.name,
                gender: student.gender,
                email: user.email,
                status: 'ACTIVE',
            }
        })

        // Handle Enrollment
        const existingEnrollment = await prisma.classEnrollment.findFirst({
            where: {
                studentId: studentRecord.id,
                status: 'ACTIVE'
            }
        })

        if (!existingEnrollment) {
            await prisma.classEnrollment.create({
                data: {
                    studentId: studentRecord.id,
                    classId: cls.id,
                    status: 'ACTIVE'
                }
            })
        } else if (existingEnrollment.classId !== cls.id) {
            await prisma.classEnrollment.update({
                where: { id: existingEnrollment.id },
                data: { classId: cls.id }
            })
        }

        console.log(`Processed: ${student.name} (${student.className})`)
    }

    console.log('Done!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
