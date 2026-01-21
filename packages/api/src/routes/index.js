import { studentRoutes } from './students.js'
import { teacherRoutes } from './teachers.js'
import { academicRoutes } from './academic.js'
import { financeRoutes } from './finance.js'
import { gradingRoutes } from './grading.js'
import { infrastructureRoutes } from './infrastructure.js'
import { communicationRoutes } from './communication.js'
import { profileRoutes } from './profile.js'
import { settingsRoutes } from './settings.js'
import { extracurricularRoutes } from './extracurricular.js'
import { permitRoutes } from './permit.js'
import { teacherPermitRoutes } from './teacherPermit.js'
import { uploadRoutes } from './upload.js'
import { dapodikRoutes } from './dapodik.js'
import { lmsRoutes } from './lms.js'
import { curriculumRoutes } from './curriculum.js'
import { kurikulumMerdekaRoutes } from './kurikulumMerdeka.js'
import { systemSettingsRoutes } from './systemSettings.js'
import { ppdbRoutes } from './ppdb-routes.js'
import { curriculumAgnosticRoutes } from './curriculumAgnostic.js'


/**
 * Register all routes
 * @param {import('@hapi/hapi').Server} server 
 */
export const registerRoutes = (server) => {


    // Health check
    server.route({
        method: 'GET',
        path: '/health',
        handler: () => ({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        }),
        options: { tags: ['api', 'health'], description: 'Health check' }
    })

    // Register all module routes
    server.route(studentRoutes)
    server.route(teacherRoutes)
    server.route(academicRoutes)
    server.route(financeRoutes)
    server.route(gradingRoutes)
    server.route(infrastructureRoutes)
    server.route(communicationRoutes)
    server.route(profileRoutes)
    server.route(settingsRoutes)
    server.route(extracurricularRoutes)
    server.route(permitRoutes)
    server.route(teacherPermitRoutes)
    server.route(lmsRoutes)
    server.route(uploadRoutes)
    server.route(dapodikRoutes)
    server.route(curriculumRoutes)
    server.route(kurikulumMerdekaRoutes)
    server.route(systemSettingsRoutes)
    server.route(ppdbRoutes)
    server.route(curriculumAgnosticRoutes)

    console.log('✅ All routes registered')
}
