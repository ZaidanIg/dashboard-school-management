import { prisma } from '../plugins/prisma.js'
import Boom from '@hapi/boom'

/**
 * Finance dashboard stats
 */
export const getDashboard = async (request, h) => {
    const [totalBillings, paidBillings, pendingBillings, overdueBillings, recentTransactions, income, expense] = await Promise.all([
        prisma.sPPBilling.aggregate({ _sum: { amount: true } }),
        prisma.sPPBilling.aggregate({ _sum: { paidAmount: true }, where: { status: 'PAID' } }),
        prisma.sPPBilling.aggregate({ _sum: { amount: true }, where: { status: 'PENDING' } }),
        prisma.sPPBilling.aggregate({ _sum: { amount: true }, where: { status: 'OVERDUE' } }),
        prisma.financeTransaction.findMany({ orderBy: { date: 'desc' }, take: 10 }),
        prisma.financeTransaction.aggregate({ _sum: { amount: true }, where: { type: 'INCOME' } }),
        prisma.financeTransaction.aggregate({ _sum: { amount: true }, where: { type: 'EXPENSE' } })
    ])

    return {
        totalBillings: totalBillings._sum.amount || 0,
        paidAmount: paidBillings._sum.paidAmount || 0,
        pendingAmount: pendingBillings._sum.amount || 0,
        overdueAmount: overdueBillings._sum.amount || 0,
        recentTransactions,
        totalIncome: income._sum.amount || 0,
        totalExpense: expense._sum.amount || 0
    }
}

/**
 * Export finance reports
 */
export const exportReports = async (request, h) => {
    const { startDate, endDate, type, category } = request.query

    const where = {}
    if (type) where.type = type
    if (category) where.category = category
    if (startDate || endDate) {
        where.date = {}
        if (startDate) where.date.gte = new Date(startDate)
        if (endDate) where.date.lte = new Date(endDate)
    }

    const transactions = await prisma.financeTransaction.findMany({
        where,
        orderBy: { date: 'desc' }
    })

    let csv = 'Tanggal,Tipe,Kategori,Deskripsi,Jumlah,Referensi\n'
    transactions.forEach(t => {
        csv += `${t.date.toISOString().split('T')[0]},${t.type},${t.category},"${t.description}",${t.amount},${t.referenceNumber || '-'}\n`
    })

    return h.response(csv)
        .type('text/csv')
        .header('Content-Disposition', `attachment; filename=laporan-keuangan-${new Date().toISOString().split('T')[0]}.csv`)
}

/**
 * List billings
 */
export const listBillings = async (request, h) => {
    const { page, limit, studentId, status, month, year } = request.query

    const where = {}
    if (studentId) where.studentId = studentId
    if (status) where.status = status
    if (month) where.month = parseInt(month)
    if (year) where.year = parseInt(year)

    const [billings, total] = await Promise.all([
        prisma.sPPBilling.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            include: { student: true, feeType: true },
            orderBy: { dueDate: 'desc' }
        }),
        prisma.sPPBilling.count({ where })
    ])

    return {
        data: billings,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
    }
}

/**
 * Record payment
 */
export const recordPayment = async (request, h) => {
    const { id } = request.params
    const { amount, paymentMethod, receiptNumber } = request.payload

    const billing = await prisma.sPPBilling.update({
        where: { id },
        data: {
            status: 'PAID',
            paidAmount: amount,
            paidAt: new Date(),
            paymentMethod,
            receiptNumber: receiptNumber || `RCP-${Date.now()}`
        }
    })

    // Record transaction
    await prisma.financeTransaction.create({
        data: {
            type: 'INCOME',
            category: 'SPP',
            amount,
            description: `Pembayaran SPP - ${billing.id}`,
            referenceNumber: billing.receiptNumber
        }
    })

    return billing
}

/**
 * List transactions
 */
export const listTransactions = async (request, h) => {
    const { page, limit, type, category, startDate, endDate, search } = request.query

    const where = {}
    if (type) where.type = type
    if (category) where.category = category
    if (startDate || endDate) {
        where.date = {}
        if (startDate) where.date.gte = new Date(startDate)
        if (endDate) where.date.lte = new Date(endDate)
    }
    if (search) {
        where.OR = [
            { description: { contains: search, mode: 'insensitive' } },
            { referenceNumber: { contains: search, mode: 'insensitive' } }
        ]
    }

    const [transactions, total] = await Promise.all([
        prisma.financeTransaction.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { date: 'desc' }
        }),
        prisma.financeTransaction.count({ where })
    ])

    return {
        data: transactions,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
    }
}

/**
 * Create transaction
 */
export const createTransaction = async (request, h) => {
    const transaction = await prisma.financeTransaction.create({ data: request.payload })
    return h.response(transaction).code(201)
}

/**
 * Send billing notification
 */
export const sendBillingNotification = async (request, h) => {
    const { id } = request.params

    const billing = await prisma.sPPBilling.findUnique({
        where: { id },
        include: { student: true, feeType: true }
    })

    if (!billing) return Boom.notFound('Tagihan tidak ditemukan')

    // Determine phone number (Father > Mother > Guardian > Student)
    const phone = billing.student.fatherPhone || billing.student.motherPhone || billing.student.guardianPhone || billing.student.phone

    if (!phone) {
        return Boom.badRequest('Nomor telepon orang tua/wali tidak tersedia')
    }

    const parentName = billing.student.fatherName || billing.student.motherName || billing.student.guardianName || 'Bapak/Ibu'
    const feeName = billing.feeType ? billing.feeType.name : 'SPP'

    const message = `Yth. ${parentName},

Diberitahukan bahwa tagihan ${feeName} ananda ${billing.student.name}
Periode: ${billing.month}/${billing.year}
Jumlah: Rp ${new Intl.NumberFormat('id-ID').format(Number(billing.amount))}
Status: ${billing.status === 'OVERDUE' ? 'TERTUNGGAK' : 'BELUM DIBAYAR'}

Mohon untuk segera melakukan pembayaran. Abaikan pesan ini jika sudah membayar.
Terima kasih.

- Keuangan Sekolah`

    // Create WhatsApp message queue
    await prisma.whatsAppMessage.create({
        data: {
            recipients: [phone],
            message,
            status: 'PENDING',
            sentBy: 'SYSTEM'
        }
    })

    return { success: true, message: 'Notifikasi berhasil dikirim' }
}

/**
 * List fee types
 */
export const listFeeTypes = async (request, h) => {
    return prisma.feeType.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
    })
}
