import Joi from 'joi'

// Common validators
export const idParam = Joi.object({
    id: Joi.string().required()
})

export const paginationQuery = Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(20),
    search: Joi.string().allow('').optional()
})

// Student validators
export const studentValidators = {
    create: Joi.object({
        // Identity
        name: Joi.string().required(),
        nis: Joi.string().required(),
        nisn: Joi.string().optional().allow(null, ''),
        nik: Joi.string().optional().allow(null, ''),
        gender: Joi.string().valid('MALE', 'FEMALE').required(),
        religion: Joi.string().optional().allow(null, ''),
        birthPlace: Joi.string().optional().allow(null, ''),
        birthDate: Joi.date().optional(),

        // Contacts & Address
        email: Joi.string().email().optional().allow(null, ''),
        phone: Joi.string().optional().allow(null, ''),
        address: Joi.string().optional().allow(null, ''),
        rt: Joi.string().optional().allow(null, ''),
        rw: Joi.string().optional().allow(null, ''),
        village: Joi.string().optional().allow(null, ''),
        district: Joi.string().optional().allow(null, ''),
        city: Joi.string().optional().allow(null, ''),
        province: Joi.string().optional().allow(null, ''),
        postalCode: Joi.string().optional().allow(null, ''),
        photo: Joi.any().optional().allow(null, ''),

        // Academic
        status: Joi.string().valid('ACTIVE', 'INACTIVE', 'GRADUATED', 'TRANSFERRED', 'DROPPED').default('ACTIVE'),
        enrollmentDate: Joi.date().default(() => new Date()),
        previousSchool: Joi.string().optional().allow(null, ''),

        // Parents
        fatherName: Joi.string().optional().allow(null, ''),
        fatherNik: Joi.string().optional().allow(null, ''),
        fatherJob: Joi.string().optional().allow(null, ''),
        fatherEducation: Joi.string().optional().allow(null, ''),
        fatherPhone: Joi.string().optional().allow(null, ''),

        motherName: Joi.string().optional().allow(null, ''),
        motherNik: Joi.string().optional().allow(null, ''),
        motherJob: Joi.string().optional().allow(null, ''),
        motherEducation: Joi.string().optional().allow(null, ''),
        motherPhone: Joi.string().optional().allow(null, ''),

        guardianName: Joi.string().optional().allow(null, ''),
        guardianNik: Joi.string().optional().allow(null, ''),
        guardianJob: Joi.string().optional().allow(null, ''),
        guardianEducation: Joi.string().optional().allow(null, ''),
        guardianPhone: Joi.string().optional().allow(null, ''),
        guardianRelation: Joi.string().optional().allow(null, ''),

        parentAddress: Joi.string().optional().allow(null, ''),
        parentCity: Joi.string().optional().allow(null, ''),
        parentProvince: Joi.string().optional().allow(null, '')
    }),
    update: Joi.object({
        // Identity
        name: Joi.string().optional(),
        nis: Joi.string().optional(),
        nisn: Joi.string().optional().allow(null, ''),
        nik: Joi.string().optional().allow(null, ''),
        gender: Joi.string().valid('MALE', 'FEMALE').optional(),
        religion: Joi.string().optional().allow(null, ''),
        birthPlace: Joi.string().optional().allow(null, ''),
        birthDate: Joi.date().optional(),

        // Contacts & Address
        email: Joi.string().email().optional().allow(null, ''),
        phone: Joi.string().optional().allow(null, ''),
        address: Joi.string().optional().allow(null, ''),
        rt: Joi.string().optional().allow(null, ''),
        rw: Joi.string().optional().allow(null, ''),
        village: Joi.string().optional().allow(null, ''),
        district: Joi.string().optional().allow(null, ''),
        city: Joi.string().optional().allow(null, ''),
        province: Joi.string().optional().allow(null, ''),
        postalCode: Joi.string().optional().allow(null, ''),
        photo: Joi.any().optional().allow(null, ''),

        // Academic
        status: Joi.string().valid('ACTIVE', 'INACTIVE', 'GRADUATED', 'TRANSFERRED', 'DROPPED').optional(),
        enrollmentDate: Joi.date().optional(),
        graduationDate: Joi.date().optional().allow(null),
        previousSchool: Joi.string().optional().allow(null, ''),

        // Parents
        fatherName: Joi.string().optional().allow(null, ''),
        fatherNik: Joi.string().optional().allow(null, ''),
        fatherJob: Joi.string().optional().allow(null, ''),
        fatherEducation: Joi.string().optional().allow(null, ''),
        fatherPhone: Joi.string().optional().allow(null, ''),

        motherName: Joi.string().optional().allow(null, ''),
        motherNik: Joi.string().optional().allow(null, ''),
        motherJob: Joi.string().optional().allow(null, ''),
        motherEducation: Joi.string().optional().allow(null, ''),
        motherPhone: Joi.string().optional().allow(null, ''),

        guardianName: Joi.string().optional().allow(null, ''),
        guardianNik: Joi.string().optional().allow(null, ''),
        guardianJob: Joi.string().optional().allow(null, ''),
        guardianEducation: Joi.string().optional().allow(null, ''),
        guardianPhone: Joi.string().optional().allow(null, ''),
        guardianRelation: Joi.string().optional().allow(null, ''),

        parentAddress: Joi.string().optional().allow(null, ''),
        parentCity: Joi.string().optional().allow(null, ''),
        parentProvince: Joi.string().optional().allow(null, '')
    }),
    query: paginationQuery.keys({
        classId: Joi.string().optional(),
        status: Joi.string().valid('ACTIVE', 'INACTIVE', 'GRADUATED', 'TRANSFERRED', 'DROPPED').optional(),
        includeDeleted: Joi.boolean().default(false),
        email: Joi.string().email().optional()
    }),
    attendance: Joi.object({
        studentId: Joi.string().required(),
        date: Joi.date().required(),
        status: Joi.string().valid('PRESENT', 'SICK', 'PERMITTED', 'ABSENT', 'LATE').required(),
        checkInTime: Joi.date().optional(),
        checkOutTime: Joi.date().optional(),
        notes: Joi.string().optional()
    }),
    selfCheckIn: Joi.object({
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        photo: Joi.any().required().description('Photo file')
    })
}

// Teacher validators
// Teacher validators
export const teacherValidators = {
    create: Joi.object({
        nip: Joi.string().optional().allow('', null),
        nuptk: Joi.string().optional().allow('', null),
        nik: Joi.string().optional().allow('', null),
        name: Joi.string().required(),
        gender: Joi.string().valid('MALE', 'FEMALE').required(),
        birthPlace: Joi.string().optional().allow('', null),
        birthDate: Joi.date().optional(),
        address: Joi.string().optional().allow('', null),
        phone: Joi.string().optional().allow('', null),
        email: Joi.string().email().optional().allow('', null),
        position: Joi.string().valid('PNS', 'HONORER', 'P3K', 'STAFF').default('HONORER'),
        status: Joi.string().valid('ACTIVE', 'INACTIVE', 'RETIRED', 'TRANSFERRED').default('ACTIVE'),
        joinDate: Joi.date().optional(),
        isCertified: Joi.boolean().default(false),
        certificationFile: Joi.string().optional().allow('', null),

        // SOP Fields
        religion: Joi.string().optional().allow('', null),
        maritalStatus: Joi.string().optional().allow('', null),
        educationDegree: Joi.string().optional().allow('', null),
        university: Joi.string().optional().allow('', null),
        major: Joi.string().optional().allow('', null),

        // User & Relations
        password: Joi.string().optional(),
        subjectIds: Joi.array().items(Joi.string()).optional()
    }),
    update: Joi.object({
        nip: Joi.string().optional().allow('', null),
        nuptk: Joi.string().optional().allow('', null),
        nik: Joi.string().optional().allow('', null),
        name: Joi.string().optional(),
        gender: Joi.string().valid('MALE', 'FEMALE').optional(),
        birthPlace: Joi.string().optional().allow('', null),
        birthDate: Joi.date().optional(),
        address: Joi.string().optional().allow('', null),
        phone: Joi.string().optional().allow('', null),
        email: Joi.string().email().optional().allow('', null),
        position: Joi.string().valid('PNS', 'HONORER', 'P3K', 'STAFF').optional(),
        status: Joi.string().valid('ACTIVE', 'INACTIVE', 'RETIRED', 'TRANSFERRED').optional(),
        joinDate: Joi.date().optional(),
        isCertified: Joi.boolean().optional(),
        certificationFile: Joi.string().optional().allow('', null),

        // SOP Fields
        religion: Joi.string().optional().allow('', null),
        maritalStatus: Joi.string().optional().allow('', null),
        educationDegree: Joi.string().optional().allow('', null),
        university: Joi.string().optional().allow('', null),
        major: Joi.string().optional().allow('', null),

        subjectIds: Joi.array().items(Joi.string()).optional()
    }),
    query: paginationQuery.keys({
        position: Joi.string().valid('PNS', 'HONORER', 'P3K', 'STAFF').optional(),
        status: Joi.string().valid('ACTIVE', 'INACTIVE', 'RETIRED', 'TRANSFERRED').optional()
    })
}

// Academic validators
export const academicValidators = {
    year: Joi.object({
        name: Joi.string().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
        isActive: Joi.boolean().default(false)
    }),
    class: Joi.object({
        name: Joi.string().required(),
        grade: Joi.number().required(),
        major: Joi.string().optional(),
        academicYearId: Joi.string().required(),
        homeroomTeacherId: Joi.string().optional(),
        capacity: Joi.number().default(36)
    }),
    subject: Joi.object({
        code: Joi.string().required(),
        name: Joi.string().required(),
        category: Joi.string().valid('WAJIB', 'PEMINATAN_IPA', 'PEMINATAN_IPS', 'MULOK', 'EKSTRA').required(),
        hoursPerWeek: Joi.number().default(2),
        description: Joi.string().optional()
    })
}

// Finance validators
export const financeValidators = {
    transaction: Joi.object({
        type: Joi.string().valid('INCOME', 'EXPENSE').required(),
        category: Joi.string().required(),
        amount: Joi.number().required(),
        description: Joi.string().required(),
        date: Joi.date().default(() => new Date()),
        referenceNumber: Joi.string().optional(),
        attachmentUrl: Joi.string().optional()
    }).options({ stripUnknown: true }),
    payment: Joi.object({
        amount: Joi.number().required(),
        paymentMethod: Joi.string().required(),
        receiptNumber: Joi.string().optional()
    })
}

// Grade validators
export const gradeValidators = {
    create: Joi.object({
        studentId: Joi.string().required(),
        subjectId: Joi.string().required(),
        academicYearId: Joi.string().required(),
        semester: Joi.string().valid('GANJIL', 'GENAP').required(),
        assignment1: Joi.number().min(0).max(100).optional(),
        assignment2: Joi.number().min(0).max(100).optional(),
        assignment3: Joi.number().min(0).max(100).optional(),
        midtermExam: Joi.number().min(0).max(100).optional(),
        finalExam: Joi.number().min(0).max(100).optional(),
        practicalScore: Joi.number().min(0).max(100).optional(),
        activityScore: Joi.number().min(0).max(100).optional(),
        description: Joi.string().optional()
    }),
    bulk: Joi.object({
        grades: Joi.array().items(Joi.object({
            studentId: Joi.string().required(),
            subjectId: Joi.string().required(),
            academicYearId: Joi.string().required(),
            semester: Joi.string().valid('GANJIL', 'GENAP').required(),
            assignment1: Joi.number().optional(),
            assignment2: Joi.number().optional(),
            assignment3: Joi.number().optional(),
            midtermExam: Joi.number().optional(),
            finalExam: Joi.number().optional(),
            practicalScore: Joi.number().optional(),
            activityScore: Joi.number().optional()
        })).required()
    })
}

// LMS validators
export const lmsValidators = {
    createAssignment: Joi.object({
        classId: Joi.string().required(),
        subjectId: Joi.string().required(),
        teacherId: Joi.string().required(),
        title: Joi.string().required(),
        description: Joi.string().optional().allow(null, ''),
        dueDate: Joi.date().optional(),
        maxScore: Joi.number().min(0).max(100).default(100),
        attachmentUrl: Joi.string().optional().allow(null, ''),
        attachments: Joi.array().items(Joi.object({
            type: Joi.string().valid('FILE', 'LINK', 'IMAGE', 'VIDEO').required(),
            url: Joi.string().required(),
            filename: Joi.string().optional().allow(null, ''),
            mimeType: Joi.string().optional().allow(null, ''),
            size: Joi.number().optional()
        })).optional()
    }),
    submitAssignment: Joi.object({
        studentId: Joi.string().required(),
        fileUrl: Joi.string().optional().allow(null, ''),
        content: Joi.string().optional().allow(null, '')
    }).or('fileUrl', 'content'),
    gradeSubmission: Joi.object({
        grade: Joi.number().min(0).max(100).required(),
        feedback: Joi.string().optional().allow(null, '')
    })
}
