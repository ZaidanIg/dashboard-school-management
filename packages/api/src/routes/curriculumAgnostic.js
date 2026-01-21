import {
    listCurriculumConfigs,
    getCurriculumConfig,
    getActiveCurriculumForClass,
    createCurriculumConfig,
    updateCurriculumConfig,
    setActiveCurriculum,
    linkCurriculumToAcademicYear,
    listReportTemplates,
    getReportTemplate
} from '../handlers/curriculumConfig.js'

import {
    listGenericGrades,
    saveGenericGrade,
    bulkSaveGenericGrades,
    getStudentGradeSummary,
    deleteGenericGrade
} from '../handlers/genericGrading.js'

/**
 * Curriculum-Agnostic System Routes
 * Config-driven curriculum and grading endpoints
 */
export const curriculumAgnosticRoutes = [
    // ============================================
    // CURRICULUM CONFIG ROUTES
    // ============================================

    {
        method: 'GET',
        path: '/api/curriculum-configs',
        handler: listCurriculumConfigs,
        options: {
            tags: ['api', 'curriculum-config'],
            description: 'List all curriculum configurations'
        }
    },
    {
        method: 'GET',
        path: '/api/curriculum-configs/{id}',
        handler: getCurriculumConfig,
        options: {
            tags: ['api', 'curriculum-config'],
            description: 'Get a curriculum configuration by ID or code'
        }
    },
    {
        method: 'GET',
        path: '/api/curriculum-configs/class/{classId}',
        handler: getActiveCurriculumForClass,
        options: {
            tags: ['api', 'curriculum-config'],
            description: 'Get active curriculum config for a specific class'
        }
    },
    {
        method: 'POST',
        path: '/api/curriculum-configs',
        handler: createCurriculumConfig,
        options: {
            tags: ['api', 'curriculum-config'],
            description: 'Create a new curriculum configuration'
        }
    },
    {
        method: 'PUT',
        path: '/api/curriculum-configs/{id}',
        handler: updateCurriculumConfig,
        options: {
            tags: ['api', 'curriculum-config'],
            description: 'Update a curriculum configuration'
        }
    },
    {
        method: 'POST',
        path: '/api/curriculum-configs/{id}/activate',
        handler: setActiveCurriculum,
        options: {
            tags: ['api', 'curriculum-config'],
            description: 'Set a curriculum as active (deactivates others)'
        }
    },
    {
        method: 'POST',
        path: '/api/curriculum-configs/link-academic-year',
        handler: linkCurriculumToAcademicYear,
        options: {
            tags: ['api', 'curriculum-config'],
            description: 'Link curriculum to academic year (optionally per grade)'
        }
    },

    // ============================================
    // REPORT TEMPLATE ROUTES
    // ============================================

    {
        method: 'GET',
        path: '/api/report-templates',
        handler: listReportTemplates,
        options: {
            tags: ['api', 'report-template'],
            description: 'List all report templates'
        }
    },
    {
        method: 'GET',
        path: '/api/report-templates/{code}',
        handler: getReportTemplate,
        options: {
            tags: ['api', 'report-template'],
            description: 'Get a report template by code'
        }
    },

    // ============================================
    // GENERIC GRADING ROUTES
    // ============================================

    {
        method: 'GET',
        path: '/api/generic-grades',
        handler: listGenericGrades,
        options: {
            tags: ['api', 'generic-grading'],
            description: 'List generic grades with flexible filtering'
        }
    },
    {
        method: 'POST',
        path: '/api/generic-grades',
        handler: saveGenericGrade,
        options: {
            tags: ['api', 'generic-grading'],
            description: 'Save a generic grade (config-driven)'
        }
    },
    {
        method: 'POST',
        path: '/api/generic-grades/bulk',
        handler: bulkSaveGenericGrades,
        options: {
            tags: ['api', 'generic-grading'],
            description: 'Bulk save generic grades'
        }
    },
    {
        method: 'GET',
        path: '/api/generic-grades/student/{studentId}/summary/{academicYearId}',
        handler: getStudentGradeSummary,
        options: {
            tags: ['api', 'generic-grading'],
            description: 'Get grade summary for a student'
        }
    },
    {
        method: 'GET',
        path: '/api/generic-grades/student/{studentId}/summary/{academicYearId}/{semester}',
        handler: getStudentGradeSummary,
        options: {
            tags: ['api', 'generic-grading'],
            description: 'Get grade summary for a student by semester'
        }
    },
    {
        method: 'DELETE',
        path: '/api/generic-grades/{id}',
        handler: deleteGenericGrade,
        options: {
            tags: ['api', 'generic-grading'],
            description: 'Delete a generic grade'
        }
    }
]
