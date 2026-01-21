import { prisma } from '../plugins/prisma.js'
import { getSession } from '../plugins/auth.js'

/**
 * Mock Dapodik Sync
 */
export const syncDapodik = async (request, h) => {
    // Audit Log (simplified)
    const session = await getSession(request)
    const userId = session?.user?.id || 'system'

    console.log(`[Dapodik] Sync started by ${userId}`)

    // Simulate Network Delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock Data
    const mockStudents = [
        { nis: '1001', name: 'Budi Santoso', gender: 'L', class: 'X-IPA-1' },
        { nis: '1002', name: 'Siti Aminah', gender: 'P', class: 'X-IPA-1' },
        { nis: '1003', name: 'Rudi Hartono', gender: 'L', class: 'X-IPS-2' }
    ]

    let syncedCount = 0

    // Upsert Logic (Stub)
    // In real implementation, we would map fields to Prisma StudentCreateInput
    // Here we just update if exists or log
    for (const s of mockStudents) {
        // Check if student exists by NIS
        const existing = await prisma.student.findFirst({ where: { nis: s.nis } })
        if (!existing) {
            // We need classId, etc. This is complex stub.
            // For now, just Log.
            console.log(`[Dapodik] New student found: ${s.name}`)
        } else {
            console.log(`[Dapodik] Updating student: ${s.name}`)
            syncedCount++
        }
    }

    // Log Activity
    await prisma.activityLog.create({
        data: {
            userId,
            action: 'SYNC_DAPODIK',
            entity: 'System',
            details: JSON.stringify({ synced: syncedCount, total: mockStudents.length }),
            ipAddress: request.info.remoteAddress,
            userAgent: request.headers['user-agent']
        }
    })

    return {
        success: true,
        message: 'Sinkronisasi Dapodik selesai',
        details: {
            studentsSynced: syncedCount,
            teachersSynced: 0,
            timestamp: new Date()
        }
    }
}
