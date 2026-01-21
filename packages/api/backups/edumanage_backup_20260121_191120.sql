--
-- PostgreSQL database dump
--

\restrict uPiMUxcLOK9IRfvMara4gXxaczLGx46rhiJU3alR3btnQUmDYlgnbrhUlPh7Tdq

-- Dumped from database version 15.15 (Homebrew)
-- Dumped by pg_dump version 17.7 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: AchievementLevel; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."AchievementLevel" AS ENUM (
    'SEKOLAH',
    'KOTA',
    'PROVINSI',
    'NASIONAL',
    'INTERNASIONAL'
);


ALTER TYPE public."AchievementLevel" OWNER TO zaidan;

--
-- Name: AttachmentType; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."AttachmentType" AS ENUM (
    'FILE',
    'LINK',
    'IMAGE',
    'VIDEO'
);


ALTER TYPE public."AttachmentType" OWNER TO zaidan;

--
-- Name: AttendanceStatus; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."AttendanceStatus" AS ENUM (
    'PRESENT',
    'SICK',
    'PERMITTED',
    'ABSENT',
    'LATE'
);


ALTER TYPE public."AttendanceStatus" OWNER TO zaidan;

--
-- Name: BackupJobStatus; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."BackupJobStatus" AS ENUM (
    'PENDING',
    'IN_PROGRESS',
    'COMPLETED',
    'FAILED'
);


ALTER TYPE public."BackupJobStatus" OWNER TO zaidan;

--
-- Name: BackupType; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."BackupType" AS ENUM (
    'FULL',
    'INCREMENTAL',
    'MANUAL'
);


ALTER TYPE public."BackupType" OWNER TO zaidan;

--
-- Name: BillingStatus; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."BillingStatus" AS ENUM (
    'PENDING',
    'PAID',
    'OVERDUE',
    'PARTIAL',
    'CANCELLED'
);


ALTER TYPE public."BillingStatus" OWNER TO zaidan;

--
-- Name: BookingStatus; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."BookingStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED',
    'CANCELLED'
);


ALTER TYPE public."BookingStatus" OWNER TO zaidan;

--
-- Name: CalendarEventType; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."CalendarEventType" AS ENUM (
    'HOLIDAY',
    'EXAM',
    'EVENT',
    'MEETING',
    'OTHER'
);


ALTER TYPE public."CalendarEventType" OWNER TO zaidan;

--
-- Name: CurriculumType; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."CurriculumType" AS ENUM (
    'K13',
    'MERDEKA'
);


ALTER TYPE public."CurriculumType" OWNER TO zaidan;

--
-- Name: EnrollmentStatus; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."EnrollmentStatus" AS ENUM (
    'ACTIVE',
    'TRANSFERRED',
    'COMPLETED'
);


ALTER TYPE public."EnrollmentStatus" OWNER TO zaidan;

--
-- Name: FacilityCondition; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."FacilityCondition" AS ENUM (
    'GOOD',
    'FAIR',
    'POOR'
);


ALTER TYPE public."FacilityCondition" OWNER TO zaidan;

--
-- Name: Fase; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."Fase" AS ENUM (
    'A',
    'B',
    'C',
    'D',
    'E',
    'F'
);


ALTER TYPE public."Fase" OWNER TO zaidan;

--
-- Name: FeeFrequency; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."FeeFrequency" AS ENUM (
    'MONTHLY',
    'SEMESTER',
    'YEARLY',
    'ONCE'
);


ALTER TYPE public."FeeFrequency" OWNER TO zaidan;

--
-- Name: Gender; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."Gender" AS ENUM (
    'MALE',
    'FEMALE'
);


ALTER TYPE public."Gender" OWNER TO zaidan;

--
-- Name: ItemCondition; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."ItemCondition" AS ENUM (
    'GOOD',
    'FAIR',
    'POOR',
    'DAMAGED'
);


ALTER TYPE public."ItemCondition" OWNER TO zaidan;

--
-- Name: JenisPenilaianFormatif; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."JenisPenilaianFormatif" AS ENUM (
    'OBSERVASI',
    'KUIS',
    'TUGAS',
    'DISKUSI'
);


ALTER TYPE public."JenisPenilaianFormatif" OWNER TO zaidan;

--
-- Name: JenisPenilaianSumatif; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."JenisPenilaianSumatif" AS ENUM (
    'STS',
    'SAS',
    'AKHIR_TAHUN'
);


ALTER TYPE public."JenisPenilaianSumatif" OWNER TO zaidan;

--
-- Name: LetterStatus; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."LetterStatus" AS ENUM (
    'DRAFT',
    'SENT',
    'RECEIVED',
    'ARCHIVED'
);


ALTER TYPE public."LetterStatus" OWNER TO zaidan;

--
-- Name: LetterType; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."LetterType" AS ENUM (
    'INCOMING',
    'OUTGOING',
    'INTERNAL'
);


ALTER TYPE public."LetterType" OWNER TO zaidan;

--
-- Name: MaintenanceStatus; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."MaintenanceStatus" AS ENUM (
    'PENDING',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."MaintenanceStatus" OWNER TO zaidan;

--
-- Name: MaintenanceType; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."MaintenanceType" AS ENUM (
    'REPAIR',
    'REPLACEMENT',
    'INSPECTION',
    'CLEANING'
);


ALTER TYPE public."MaintenanceType" OWNER TO zaidan;

--
-- Name: MemberStatus; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."MemberStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE'
);


ALTER TYPE public."MemberStatus" OWNER TO zaidan;

--
-- Name: MessageStatus; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."MessageStatus" AS ENUM (
    'PENDING',
    'SENT',
    'FAILED'
);


ALTER TYPE public."MessageStatus" OWNER TO zaidan;

--
-- Name: OrgType; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."OrgType" AS ENUM (
    'OSIS',
    'MPK',
    'EXTRACURRICULAR'
);


ALTER TYPE public."OrgType" OWNER TO zaidan;

--
-- Name: PPDBStatus; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."PPDBStatus" AS ENUM (
    'PENDING',
    'VERIFIED',
    'ACCEPTED',
    'REJECTED'
);


ALTER TYPE public."PPDBStatus" OWNER TO zaidan;

--
-- Name: PermitStatus; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."PermitStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public."PermitStatus" OWNER TO zaidan;

--
-- Name: PermitType; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."PermitType" AS ENUM (
    'SICK',
    'FAMILY',
    'OFFICIAL',
    'OTHER'
);


ALTER TYPE public."PermitType" OWNER TO zaidan;

--
-- Name: ProjectStatus; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."ProjectStatus" AS ENUM (
    'PLANNING',
    'IN_PROGRESS',
    'COMPLETED',
    'ACTIVE'
);


ALTER TYPE public."ProjectStatus" OWNER TO zaidan;

--
-- Name: RoomType; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."RoomType" AS ENUM (
    'CLASSROOM',
    'LAB',
    'LIBRARY',
    'MEETING',
    'SPORTS',
    'AUDITORIUM',
    'OTHER'
);


ALTER TYPE public."RoomType" OWNER TO zaidan;

--
-- Name: SchoolStatus; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."SchoolStatus" AS ENUM (
    'NEGERI',
    'SWASTA'
);


ALTER TYPE public."SchoolStatus" OWNER TO zaidan;

--
-- Name: Semester; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."Semester" AS ENUM (
    'GANJIL',
    'GENAP'
);


ALTER TYPE public."Semester" OWNER TO zaidan;

--
-- Name: StudentStatus; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."StudentStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'GRADUATED',
    'TRANSFERRED',
    'DROPPED'
);


ALTER TYPE public."StudentStatus" OWNER TO zaidan;

--
-- Name: SubjectCategory; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."SubjectCategory" AS ENUM (
    'WAJIB',
    'PEMINATAN_IPA',
    'PEMINATAN_IPS',
    'MULOK',
    'EKSTRA'
);


ALTER TYPE public."SubjectCategory" OWNER TO zaidan;

--
-- Name: SubmissionStatus; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."SubmissionStatus" AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'LATE',
    'GRADED',
    'RETURNED'
);


ALTER TYPE public."SubmissionStatus" OWNER TO zaidan;

--
-- Name: TeacherPosition; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."TeacherPosition" AS ENUM (
    'PNS',
    'HONORER',
    'P3K',
    'STAFF'
);


ALTER TYPE public."TeacherPosition" OWNER TO zaidan;

--
-- Name: TeacherStatus; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."TeacherStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'RETIRED',
    'TRANSFERRED'
);


ALTER TYPE public."TeacherStatus" OWNER TO zaidan;

--
-- Name: TingkatPencapaian; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."TingkatPencapaian" AS ENUM (
    'BB',
    'MB',
    'BSH',
    'BSB'
);


ALTER TYPE public."TingkatPencapaian" OWNER TO zaidan;

--
-- Name: TransactionType; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."TransactionType" AS ENUM (
    'INCOME',
    'EXPENSE'
);


ALTER TYPE public."TransactionType" OWNER TO zaidan;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."UserRole" AS ENUM (
    'SUPER_ADMIN',
    'PRINCIPAL',
    'TEACHER',
    'STAFF',
    'PARENT',
    'STUDENT'
);


ALTER TYPE public."UserRole" OWNER TO zaidan;

--
-- Name: UserStatus; Type: TYPE; Schema: public; Owner: zaidan
--

CREATE TYPE public."UserStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE'
);


ALTER TYPE public."UserStatus" OWNER TO zaidan;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO zaidan;

--
-- Name: academic_calendar_events; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.academic_calendar_events (
    id text NOT NULL,
    "academicYearId" text NOT NULL,
    title text NOT NULL,
    description text,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    type public."CalendarEventType" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public.academic_calendar_events OWNER TO zaidan;

--
-- Name: academic_years; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.academic_years (
    id text NOT NULL,
    name text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "isActive" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.academic_years OWNER TO zaidan;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.accounts (
    id text NOT NULL,
    "userId" text NOT NULL,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "accessToken" text,
    "refreshToken" text,
    "accessTokenExpiresAt" timestamp(3) without time zone,
    "refreshTokenExpiresAt" timestamp(3) without time zone,
    scope text,
    "idToken" text,
    password text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.accounts OWNER TO zaidan;

--
-- Name: achievements; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.achievements (
    id text NOT NULL,
    "schoolId" text NOT NULL,
    title text NOT NULL,
    category text NOT NULL,
    level public."AchievementLevel" NOT NULL,
    year integer NOT NULL,
    description text,
    "studentId" text,
    "teacherId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.achievements OWNER TO zaidan;

--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.activity_logs (
    id text NOT NULL,
    "userId" text NOT NULL,
    action text NOT NULL,
    entity text NOT NULL,
    "entityId" text,
    details jsonb,
    "ipAddress" text,
    "userAgent" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.activity_logs OWNER TO zaidan;

--
-- Name: announcements; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.announcements (
    id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    category text,
    "targetAudience" text[],
    "isPinned" boolean DEFAULT false NOT NULL,
    "publishedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expiresAt" timestamp(3) without time zone,
    "createdBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.announcements OWNER TO zaidan;

--
-- Name: assignment_attachments; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.assignment_attachments (
    id text NOT NULL,
    "assignmentId" text NOT NULL,
    type public."AttachmentType" NOT NULL,
    url text NOT NULL,
    filename text,
    size integer,
    "mimeType" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.assignment_attachments OWNER TO zaidan;

--
-- Name: assignment_submissions; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.assignment_submissions (
    id text NOT NULL,
    "assignmentId" text NOT NULL,
    "studentId" text NOT NULL,
    "fileUrl" text,
    content text,
    grade double precision,
    feedback text,
    status public."SubmissionStatus" DEFAULT 'SUBMITTED'::public."SubmissionStatus" NOT NULL,
    "submittedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "gradedAt" timestamp(3) without time zone,
    late boolean DEFAULT false NOT NULL
);


ALTER TABLE public.assignment_submissions OWNER TO zaidan;

--
-- Name: assignments; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.assignments (
    id text NOT NULL,
    "classId" text NOT NULL,
    "subjectId" text NOT NULL,
    "teacherId" text NOT NULL,
    title text NOT NULL,
    description text,
    "dueDate" timestamp(3) without time zone,
    "maxScore" integer DEFAULT 100 NOT NULL,
    "attachmentUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.assignments OWNER TO zaidan;

--
-- Name: capaian_pembelajaran; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.capaian_pembelajaran (
    id text NOT NULL,
    "kodeCP" text NOT NULL,
    fase public."Fase" NOT NULL,
    "mataPelajaranId" text NOT NULL,
    deskripsi text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.capaian_pembelajaran OWNER TO zaidan;

--
-- Name: class_enrollments; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.class_enrollments (
    id text NOT NULL,
    "studentId" text NOT NULL,
    "classId" text NOT NULL,
    "enrolledAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status public."EnrollmentStatus" DEFAULT 'ACTIVE'::public."EnrollmentStatus" NOT NULL
);


ALTER TABLE public.class_enrollments OWNER TO zaidan;

--
-- Name: class_schedules; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.class_schedules (
    id text NOT NULL,
    "classId" text NOT NULL,
    "subjectId" text NOT NULL,
    "teacherId" text,
    "dayOfWeek" integer NOT NULL,
    "startTime" text NOT NULL,
    "endTime" text NOT NULL,
    room text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public.class_schedules OWNER TO zaidan;

--
-- Name: classes; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.classes (
    id text NOT NULL,
    name text NOT NULL,
    grade integer NOT NULL,
    major text,
    "academicYearId" text NOT NULL,
    "homeroomTeacherId" text,
    capacity integer DEFAULT 36 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public.classes OWNER TO zaidan;

--
-- Name: curriculum_modules; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.curriculum_modules (
    id text NOT NULL,
    "curriculumId" text NOT NULL,
    "subjectCode" text NOT NULL,
    grade integer NOT NULL,
    semester public."Semester" NOT NULL,
    title text NOT NULL,
    description text,
    competencies text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public.curriculum_modules OWNER TO zaidan;

--
-- Name: curriculums; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.curriculums (
    id text NOT NULL,
    name text NOT NULL,
    year integer NOT NULL,
    description text,
    "isActive" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public.curriculums OWNER TO zaidan;

--
-- Name: data_backups; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.data_backups (
    id text NOT NULL,
    filename text NOT NULL,
    size integer NOT NULL,
    type public."BackupType" NOT NULL,
    status public."BackupJobStatus" DEFAULT 'PENDING'::public."BackupJobStatus" NOT NULL,
    "storageUrl" text,
    "createdBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "completedAt" timestamp(3) without time zone
);


ALTER TABLE public.data_backups OWNER TO zaidan;

--
-- Name: dimensi_p7; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.dimensi_p7 (
    id text NOT NULL,
    kode text NOT NULL,
    "namaDimensi" text NOT NULL,
    deskripsi text,
    elemen jsonb NOT NULL
);


ALTER TABLE public.dimensi_p7 OWNER TO zaidan;

--
-- Name: extracurricular_members; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.extracurricular_members (
    id text NOT NULL,
    "extracurricularId" text NOT NULL,
    "studentId" text NOT NULL,
    role text,
    "joinedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status public."MemberStatus" DEFAULT 'ACTIVE'::public."MemberStatus" NOT NULL
);


ALTER TABLE public.extracurricular_members OWNER TO zaidan;

--
-- Name: extracurriculars; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.extracurriculars (
    id text NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    description text,
    schedule text,
    location text,
    "advisorId" text,
    "maxMembers" integer,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.extracurriculars OWNER TO zaidan;

--
-- Name: facilities; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.facilities (
    id text NOT NULL,
    "schoolId" text NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    area double precision,
    condition public."FacilityCondition" DEFAULT 'GOOD'::public."FacilityCondition" NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.facilities OWNER TO zaidan;

--
-- Name: fee_types; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.fee_types (
    id text NOT NULL,
    name text NOT NULL,
    amount numeric(15,2) NOT NULL,
    frequency public."FeeFrequency" DEFAULT 'MONTHLY'::public."FeeFrequency" NOT NULL,
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.fee_types OWNER TO zaidan;

--
-- Name: finance_transactions; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.finance_transactions (
    id text NOT NULL,
    type public."TransactionType" NOT NULL,
    category text NOT NULL,
    amount numeric(15,2) NOT NULL,
    description text NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "referenceNumber" text,
    "attachmentUrl" text,
    "createdBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.finance_transactions OWNER TO zaidan;

--
-- Name: gallery_items; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.gallery_items (
    id text NOT NULL,
    "schoolId" text NOT NULL,
    title text NOT NULL,
    category text NOT NULL,
    "imageUrl" text NOT NULL,
    description text,
    date timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.gallery_items OWNER TO zaidan;

--
-- Name: grades; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.grades (
    id text NOT NULL,
    "studentId" text NOT NULL,
    "subjectId" text NOT NULL,
    "academicYearId" text NOT NULL,
    semester public."Semester" NOT NULL,
    assignment1 double precision,
    assignment2 double precision,
    assignment3 double precision,
    "midtermExam" double precision,
    "finalExam" double precision,
    "practicalScore" double precision,
    "activityScore" double precision,
    "finalGrade" double precision,
    "letterGrade" text,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.grades OWNER TO zaidan;

--
-- Name: inventory_items; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.inventory_items (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    location text,
    quantity integer DEFAULT 1 NOT NULL,
    unit text DEFAULT 'unit'::text NOT NULL,
    condition public."ItemCondition" DEFAULT 'GOOD'::public."ItemCondition" NOT NULL,
    "acquisitionDate" timestamp(3) without time zone,
    "acquisitionPrice" numeric(15,2),
    "lastCheckDate" timestamp(3) without time zone,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.inventory_items OWNER TO zaidan;

--
-- Name: letters; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.letters (
    id text NOT NULL,
    "letterNumber" text NOT NULL,
    type public."LetterType" NOT NULL,
    subject text NOT NULL,
    content text,
    sender text,
    recipient text,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "attachmentUrl" text,
    status public."LetterStatus" DEFAULT 'DRAFT'::public."LetterStatus" NOT NULL,
    "createdBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.letters OWNER TO zaidan;

--
-- Name: maintenance_records; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.maintenance_records (
    id text NOT NULL,
    "itemId" text,
    type public."MaintenanceType" NOT NULL,
    description text NOT NULL,
    cost numeric(15,2),
    status public."MaintenanceStatus" DEFAULT 'PENDING'::public."MaintenanceStatus" NOT NULL,
    "reportedBy" text,
    "assignedTo" text,
    "reportedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "scheduledAt" timestamp(3) without time zone,
    "completedAt" timestamp(3) without time zone,
    notes text
);


ALTER TABLE public.maintenance_records OWNER TO zaidan;

--
-- Name: modul_ajar; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.modul_ajar (
    id text NOT NULL,
    "cpId" text NOT NULL,
    "guruId" text NOT NULL,
    "tahunAjaranId" text NOT NULL,
    "namaModul" text NOT NULL,
    "alokasiWaktuJam" integer DEFAULT 2 NOT NULL,
    status text DEFAULT 'DRAFT'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "alurTujuanPembelajaran" text,
    "bahanBacaan" jsonb,
    "daftarPustaka" text[],
    "deskripsiUmum" text,
    fase public."Fase" NOT NULL,
    glosarium jsonb,
    "jumlahPertemuan" integer DEFAULT 1 NOT NULL,
    "kegiatanPembelajaran" jsonb,
    kelas integer NOT NULL,
    "kompetensiAwal" text,
    lkpd jsonb,
    "modelPembelajaran" text DEFAULT 'TATAP_MUKA'::text NOT NULL,
    "pemahamanBermakna" text,
    "pertanyaanPemantik" text[],
    "profilPelajarPancasila" text[],
    "rencanaAsesmen" jsonb,
    "rencanaDiferensiasi" jsonb,
    "saranaPrasarana" text[],
    "targetPesertaDidik" text,
    "tujuanPembelajaran" jsonb
);


ALTER TABLE public.modul_ajar OWNER TO zaidan;

--
-- Name: org_members; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.org_members (
    id text NOT NULL,
    "organizationId" text NOT NULL,
    "studentId" text NOT NULL,
    "position" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.org_members OWNER TO zaidan;

--
-- Name: p5_participants; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.p5_participants (
    id text NOT NULL,
    "projectId" text NOT NULL,
    "studentId" text NOT NULL,
    role text,
    score double precision,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.p5_participants OWNER TO zaidan;

--
-- Name: p5_projects; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.p5_projects (
    id text NOT NULL,
    title text NOT NULL,
    theme text NOT NULL,
    description text,
    "academicYearId" text,
    "startDate" timestamp(3) without time zone,
    "endDate" timestamp(3) without time zone,
    status public."ProjectStatus" DEFAULT 'PLANNING'::public."ProjectStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.p5_projects OWNER TO zaidan;

--
-- Name: p7_penilaian_tim; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.p7_penilaian_tim (
    id text NOT NULL,
    "timId" text NOT NULL,
    "siswaId" text NOT NULL,
    "dimensiScores" jsonb NOT NULL,
    "nilaiTotal" numeric(5,2) NOT NULL,
    catatan text,
    "evaluatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.p7_penilaian_tim OWNER TO zaidan;

--
-- Name: p7_proyek; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.p7_proyek (
    id text NOT NULL,
    "dimensiId" text NOT NULL,
    "tahunAjaranId" text NOT NULL,
    "namaProyek" text NOT NULL,
    tema text,
    fase public."Fase" NOT NULL,
    "durasiMinggu" integer NOT NULL,
    "tanggalMulai" timestamp(3) without time zone,
    "tanggalSelesai" timestamp(3) without time zone,
    status public."ProjectStatus" DEFAULT 'PLANNING'::public."ProjectStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.p7_proyek OWNER TO zaidan;

--
-- Name: penilaian_formatif; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.penilaian_formatif (
    id text NOT NULL,
    "siswaId" text NOT NULL,
    "modulAjarId" text NOT NULL,
    jenis public."JenisPenilaianFormatif" NOT NULL,
    nilai text,
    "tingkatPencapaian" public."TingkatPencapaian" NOT NULL,
    catatan text,
    tanggal timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.penilaian_formatif OWNER TO zaidan;

--
-- Name: penilaian_sumatif; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.penilaian_sumatif (
    id text NOT NULL,
    "siswaId" text NOT NULL,
    "modulAjarId" text NOT NULL,
    jenis public."JenisPenilaianSumatif" NOT NULL,
    "nilaiTes" numeric(5,2),
    "nilaiPerformanceTask" numeric(5,2),
    "nilaiAkhir" numeric(5,2),
    "tingkatPencapaian" public."TingkatPencapaian",
    tanggal timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.penilaian_sumatif OWNER TO zaidan;

--
-- Name: performance_tasks; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.performance_tasks (
    id text NOT NULL,
    "siswaId" text NOT NULL,
    "modulAjarId" text NOT NULL,
    "judulTugas" text NOT NULL,
    "rubrikId" text,
    "fileEvidences" jsonb,
    nilai numeric(5,2),
    "komentarGuru" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.performance_tasks OWNER TO zaidan;

--
-- Name: portofolio_siswa; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.portofolio_siswa (
    id text NOT NULL,
    "siswaId" text NOT NULL,
    "tahunAjaranId" text NOT NULL,
    "dataJson" jsonb NOT NULL,
    "generatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.portofolio_siswa OWNER TO zaidan;

--
-- Name: ppdb_batches; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.ppdb_batches (
    id text NOT NULL,
    name text NOT NULL,
    "academicYearId" text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "isActive" boolean DEFAULT false NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.ppdb_batches OWNER TO zaidan;

--
-- Name: ppdb_registrations; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.ppdb_registrations (
    id text NOT NULL,
    "batchId" text NOT NULL,
    "registrationNo" text NOT NULL,
    "fullName" text NOT NULL,
    nisn text,
    nik text,
    gender public."Gender" NOT NULL,
    "birthPlace" text NOT NULL,
    "birthDate" timestamp(3) without time zone NOT NULL,
    religion text,
    email text NOT NULL,
    phone text NOT NULL,
    address text,
    city text,
    "postalCode" text,
    "fatherName" text,
    "fatherPhone" text,
    "motherName" text,
    "motherPhone" text,
    "originSchool" text NOT NULL,
    "graduationYear" integer NOT NULL,
    status public."PPDBStatus" DEFAULT 'PENDING'::public."PPDBStatus" NOT NULL,
    notes text,
    "ijazahUrl" text,
    "kkUrl" text,
    "aktaUrl" text,
    "photoUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.ppdb_registrations OWNER TO zaidan;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.roles (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    permissions text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.roles OWNER TO zaidan;

--
-- Name: room_bookings; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.room_bookings (
    id text NOT NULL,
    "roomId" text NOT NULL,
    title text NOT NULL,
    description text,
    "bookedBy" text NOT NULL,
    date date NOT NULL,
    "startTime" text NOT NULL,
    "endTime" text NOT NULL,
    status public."BookingStatus" DEFAULT 'PENDING'::public."BookingStatus" NOT NULL,
    "approvedBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.room_bookings OWNER TO zaidan;

--
-- Name: rooms; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.rooms (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    type public."RoomType" NOT NULL,
    capacity integer,
    floor integer,
    building text,
    facilities text[],
    "isAvailable" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.rooms OWNER TO zaidan;

--
-- Name: schools; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.schools (
    id text NOT NULL,
    npsn text NOT NULL,
    name text NOT NULL,
    status public."SchoolStatus" DEFAULT 'NEGERI'::public."SchoolStatus" NOT NULL,
    "educationType" text NOT NULL,
    accreditation text,
    "accreditationYear" integer,
    "foundedYear" integer,
    curriculum text,
    vision text,
    mission text[],
    address text,
    city text,
    province text,
    "postalCode" text,
    phone text,
    email text,
    website text,
    logo text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    latitude double precision,
    longitude double precision
);


ALTER TABLE public.schools OWNER TO zaidan;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.sessions (
    id text NOT NULL,
    "userId" text NOT NULL,
    token text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO zaidan;

--
-- Name: spp_billings; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.spp_billings (
    id text NOT NULL,
    "studentId" text NOT NULL,
    "feeTypeId" text NOT NULL,
    "academicYearId" text NOT NULL,
    month integer,
    year integer NOT NULL,
    amount numeric(15,2) NOT NULL,
    "dueDate" timestamp(3) without time zone NOT NULL,
    status public."BillingStatus" DEFAULT 'PENDING'::public."BillingStatus" NOT NULL,
    "paidAmount" numeric(15,2),
    "paidAt" timestamp(3) without time zone,
    "paymentMethod" text,
    "receiptNumber" text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.spp_billings OWNER TO zaidan;

--
-- Name: student_attendances; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.student_attendances (
    id text NOT NULL,
    "studentId" text NOT NULL,
    date date NOT NULL,
    status public."AttendanceStatus" NOT NULL,
    "checkInTime" timestamp(3) without time zone,
    "checkOutTime" timestamp(3) without time zone,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "checkInLat" double precision,
    "checkInLong" double precision,
    "photoUrl" text
);


ALTER TABLE public.student_attendances OWNER TO zaidan;

--
-- Name: student_organizations; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.student_organizations (
    id text NOT NULL,
    "schoolId" text NOT NULL,
    name text NOT NULL,
    type public."OrgType" NOT NULL,
    period text NOT NULL,
    "advisorId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.student_organizations OWNER TO zaidan;

--
-- Name: student_permits; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.student_permits (
    id text NOT NULL,
    "studentId" text NOT NULL,
    type public."PermitType" NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    reason text NOT NULL,
    document text,
    status public."PermitStatus" DEFAULT 'PENDING'::public."PermitStatus" NOT NULL,
    "approvedBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.student_permits OWNER TO zaidan;

--
-- Name: students; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.students (
    id text NOT NULL,
    nis text NOT NULL,
    nisn text,
    name text NOT NULL,
    gender public."Gender" NOT NULL,
    religion text,
    "birthPlace" text,
    "birthDate" timestamp(3) without time zone,
    address text,
    phone text,
    email text,
    photo text,
    status public."StudentStatus" DEFAULT 'ACTIVE'::public."StudentStatus" NOT NULL,
    "enrollmentDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "graduationDate" timestamp(3) without time zone,
    "fatherName" text,
    "fatherJob" text,
    "motherName" text,
    "motherJob" text,
    "guardianName" text,
    "guardianPhone" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    city text,
    "deletedAt" timestamp(3) without time zone,
    district text,
    "fatherEducation" text,
    "fatherNik" text,
    "fatherPhone" text,
    "guardianEducation" text,
    "guardianJob" text,
    "guardianNik" text,
    "guardianRelation" text,
    "motherEducation" text,
    "motherNik" text,
    "motherPhone" text,
    nik text,
    "parentAddress" text,
    "parentCity" text,
    "parentProvince" text,
    "postalCode" text,
    "previousSchool" text,
    province text,
    rt text,
    rw text,
    village text
);


ALTER TABLE public.students OWNER TO zaidan;

--
-- Name: subjects; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.subjects (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    category public."SubjectCategory" NOT NULL,
    "hoursPerWeek" integer DEFAULT 2 NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public.subjects OWNER TO zaidan;

--
-- Name: system_configs; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.system_configs (
    id text NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    description text,
    "updatedBy" text,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.system_configs OWNER TO zaidan;

--
-- Name: system_settings; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.system_settings (
    id text NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.system_settings OWNER TO zaidan;

--
-- Name: teacher_attendances; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.teacher_attendances (
    id text NOT NULL,
    "teacherId" text NOT NULL,
    date date NOT NULL,
    status public."AttendanceStatus" NOT NULL,
    "checkInTime" timestamp(3) without time zone,
    "checkOutTime" timestamp(3) without time zone,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "checkInLat" double precision,
    "checkInLong" double precision,
    "photoUrl" text
);


ALTER TABLE public.teacher_attendances OWNER TO zaidan;

--
-- Name: teacher_performances; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.teacher_performances (
    id text NOT NULL,
    "teacherId" text NOT NULL,
    "academicYearId" text NOT NULL,
    semester public."Semester" NOT NULL,
    "teachingScore" double precision,
    "attendanceScore" double precision,
    "professionalScore" double precision,
    "socialScore" double precision,
    "overallScore" double precision,
    notes text,
    "evaluatedBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.teacher_performances OWNER TO zaidan;

--
-- Name: teacher_permits; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.teacher_permits (
    id text NOT NULL,
    "teacherId" text NOT NULL,
    type public."PermitType" NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    reason text NOT NULL,
    document text,
    status public."PermitStatus" DEFAULT 'PENDING'::public."PermitStatus" NOT NULL,
    "approvedBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.teacher_permits OWNER TO zaidan;

--
-- Name: teacher_subjects; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.teacher_subjects (
    id text NOT NULL,
    "teacherId" text NOT NULL,
    "subjectId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.teacher_subjects OWNER TO zaidan;

--
-- Name: teachers; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.teachers (
    id text NOT NULL,
    "userId" text,
    nip text,
    nuptk text,
    name text NOT NULL,
    gender public."Gender" NOT NULL,
    "birthPlace" text,
    "birthDate" timestamp(3) without time zone,
    address text,
    phone text,
    email text,
    photo text,
    "position" public."TeacherPosition" DEFAULT 'HONORER'::public."TeacherPosition" NOT NULL,
    status public."TeacherStatus" DEFAULT 'ACTIVE'::public."TeacherStatus" NOT NULL,
    "isCertified" boolean DEFAULT false NOT NULL,
    "joinDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "certificationFile" text,
    "educationDegree" text,
    major text,
    "maritalStatus" text,
    nik text,
    religion text,
    university text
);


ALTER TABLE public.teachers OWNER TO zaidan;

--
-- Name: teaching_schedules; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.teaching_schedules (
    id text NOT NULL,
    "teacherId" text NOT NULL,
    "dayOfWeek" integer NOT NULL,
    "startTime" text NOT NULL,
    "endTime" text NOT NULL,
    "classId" text,
    "subjectId" text,
    room text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.teaching_schedules OWNER TO zaidan;

--
-- Name: tim_p7; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.tim_p7 (
    id text NOT NULL,
    "proyekId" text NOT NULL,
    "guruFasilitatorId" text NOT NULL,
    "namaTim" text NOT NULL,
    "siswaIds" jsonb NOT NULL,
    milestone jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.tim_p7 OWNER TO zaidan;

--
-- Name: users; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    "emailVerified" boolean DEFAULT false NOT NULL,
    image text,
    role public."UserRole" DEFAULT 'STAFF'::public."UserRole" NOT NULL,
    status public."UserStatus" DEFAULT 'ACTIVE'::public."UserStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO zaidan;

--
-- Name: verifications; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.verifications (
    id text NOT NULL,
    identifier text NOT NULL,
    value text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.verifications OWNER TO zaidan;

--
-- Name: whatsapp_messages; Type: TABLE; Schema: public; Owner: zaidan
--

CREATE TABLE public.whatsapp_messages (
    id text NOT NULL,
    recipients text[],
    message text NOT NULL,
    template text,
    "sentAt" timestamp(3) without time zone,
    status public."MessageStatus" DEFAULT 'PENDING'::public."MessageStatus" NOT NULL,
    "sentBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.whatsapp_messages OWNER TO zaidan;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
47396519-df64-4051-af4a-e38c4597b2d5	8f3611aa91340cb70e39ab59b5070f5f1572ecbe2a93f6b2888f6562b210992d	2026-01-13 22:08:28.464929+07	20260113150828_edumanage	\N	\N	2026-01-13 22:08:28.247328+07	1
ed5aaa1f-7cd8-4bdc-a58b-aca0676d35ae	f057c5d8c4247274cdbb64ada28389858ec15eda669fe26c9fab6c5ce2d672dd	2026-01-14 00:06:08.503328+07	20260113170608_update_student_schema	\N	\N	2026-01-14 00:06:08.490641+07	1
\.


--
-- Data for Name: academic_calendar_events; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.academic_calendar_events (id, "academicYearId", title, description, "startDate", "endDate", type, "createdAt", "deletedAt") FROM stdin;
cmkjmbwl5000jwtgjvrv22ja6	cmkgtzeh00000wt0hszjuewk2	Ujian Tengah Semester	\N	2026-01-18 10:53:41.17	2026-01-23 10:53:41.17	EXAM	2026-01-18 10:53:41.177	\N
cmkjmbwlm000lwtgjdlljpjoa	cmkgtzeh00000wt0hszjuewk2	Libur Nasional	\N	2026-01-28 10:53:41.175	2026-01-28 10:53:41.175	HOLIDAY	2026-01-18 10:53:41.194	\N
\.


--
-- Data for Name: academic_years; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.academic_years (id, name, "startDate", "endDate", "isActive", "createdAt", "updatedAt") FROM stdin;
ay-2024-2025	2024/2025	2024-07-15 00:00:00	2025-06-30 00:00:00	f	2026-01-13 15:10:10.057	2026-01-16 12:04:36.197
cmkgtzeh00000wt0hszjuewk2	2026/2027	2026-01-01 00:00:00	2027-01-01 00:00:00	t	2026-01-16 12:04:36.228	2026-01-16 12:04:36.228
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.accounts (id, "userId", "accountId", "providerId", "accessToken", "refreshToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, "idToken", password, "createdAt", "updatedAt") FROM stdin;
WgoeSarH8DqJ7s7cY3ldhba8Q5WvdN1H	LTbMedQIHomObquQ0f8Z69FKGTFb89lo	LTbMedQIHomObquQ0f8Z69FKGTFb89lo	credential	\N	\N	\N	\N	\N	\N	78191d37ab8efa5fcac26ca1573aff3d:ba73e388cbd8ce211343aab4b2c003b88c514f4debf636e4bbff103dd4ab94acf10c0d0cb7ca558d332bd09ff72054c5b0547b21846e9ed32df9248878a1a133	2026-01-13 15:54:50.727	2026-01-13 15:54:50.727
FHyTkJ5WGlAOpdvE9rmLyRb9XBOgZTOO	rnLr0kJ70gWNWQDvRJzU7mRj0OJgUgVq	rnLr0kJ70gWNWQDvRJzU7mRj0OJgUgVq	credential	\N	\N	\N	\N	\N	\N	cd5a14394e04f79342fe610a64634e72:4757f1de5be8218e4364ddfee1663e627a33cbfd85202df43c31f94974170c13dcdd6d2d44a8dd7b19d17f94074396f09993fd187331812b50fd111269d36ce4	2026-01-13 15:58:47.293	2026-01-13 15:58:47.293
F0r68oQ7j3g92VWQ9XXEgiFk6cA8frar	r4BO1lU0gcl9VCRZo9B2PGeZWELisoZX	r4BO1lU0gcl9VCRZo9B2PGeZWELisoZX	credential	\N	\N	\N	\N	\N	\N	2ea39e771f1c7b0578fa27d7fc804b8c:28e684c94a660786959e24533ebb2e0e91e932df656d7a23691934feffe8a5b428e8612d744ca84f851cf9568db3565c1fdb6c322ea8695c772d44b04e457b58	2026-01-13 16:05:37.251	2026-01-13 16:05:37.251
cRtZn9W8lHsrY7quC2zYHTPz7O8f7UJW	xZ8cdeXTZaUCiRVTvGWcdhQEFbfGdz6f	xZ8cdeXTZaUCiRVTvGWcdhQEFbfGdz6f	credential	\N	\N	\N	\N	\N	\N	0d2e86be56cd6b9364d3edfbac715e2e:c3d5f7dd2ee5a6bf58cdf144cba9c30833895135e41f3f7afe58fc1ab3521294a74f9642944db295e5eb7aed292ec7943d18234cd18ddf3db422b9ff7516ea55	2026-01-17 01:54:38.765	2026-01-17 01:54:38.765
2YnUbOH92ywEdYGD5278BMwJF1GdjWQX	FqDLKtj2vkU43TiXAsqvNfc84cEp9BXo	FqDLKtj2vkU43TiXAsqvNfc84cEp9BXo	credential	\N	\N	\N	\N	\N	\N	f770d6a8d0bbd238414c743bd272dabe:7e51fddb253743113debdd2ec05f3db0e2a3139376afa88bbdfdf128b7c9dfbc79a9550032a8d06969c20ad4a2f838fc3ede286acc8b3c6a2df757158526a379	2026-01-17 01:54:39.689	2026-01-17 01:54:39.689
evCpUJWiCuioKhKLDAuyq9Q1nQV33928	ybWvJoqHiXVxCJneMmUFElTw3qNSIasn	ybWvJoqHiXVxCJneMmUFElTw3qNSIasn	credential	\N	\N	\N	\N	\N	\N	a2fb64091a9941f6e531b21ebde5dad6:eb4c658e33aa582688f33aa2fe9f4c1c479ec0070b98b7e21d976abfb2ac72a18cdcc61d9cca3cfe64a2833690f0139682dcefe664c8845091454fc88c4d0067	2026-01-17 01:54:39.912	2026-01-17 01:54:39.912
cmkndk0g20007wtowd5rwo1w7	cmkncrcl7000kwtwo1qcdaa33	cmkncrcl7000kwtwo1qcdaa33	credential	\N	\N	\N	\N	read:users	\N	4d3819cc7d3c577d6e192c65755a1451:f00b3d380a9074b05134fe7609d21350073c417d583851041af67246e4099f5f5a568a7c8b0100c751a1e314808627929d70fdf410254d44cd3991e81dac4c31	2026-01-21 01:59:07.586	2026-01-21 01:59:07.586
cmkndk0mw0009wtow04vcwcwb	cmkncrcpq000qwtwobng3sb36	cmkncrcpq000qwtwobng3sb36	credential	\N	\N	\N	\N	read:users	\N	cbaaebb6ba437ff7133a3e5a4086a179:bcc320cc4f8bbe33673e0031896d217b56f49bc2f6285718b6ad746809c788130396ddb1c565b0854a0037f96c96222da245096e57033b19f099b2ac59e7514e	2026-01-21 01:59:07.833	2026-01-21 01:59:07.833
cmkjk0j6f0002wttfor7lhjrb	cmkjk0j590000wttfxkm0lbms	cmkjk0j590000wttfxkm0lbms	credential	\N	\N	\N	\N	\N	\N	e36d28fda38bf870e3ee63f01893f3b4:79edd8d0bdd212067dfc9bb6e01a0761eecd3ccc20ed393e9a9331d408fa322564ef1d6628c25bc79b3b53dc265bb867820a201b0489a16fd10a01d1f161bf67	2026-01-18 09:48:51.351	2026-01-21 01:59:06.365
cmkm3xy6f0004wtucrq5qhikh	cmkm3xy4x0002wtucfs30vdnh	cmkm3xy4x0002wtucfs30vdnh	credential	\N	\N	\N	\N	\N	\N	97dcda9e5505785cc71568c59913b510:e25985b68ee1b3ddf8e09ef3cd320b62716e7ee119be147f6b576b66b95c0a5af534f97711d1a33d816072ea6732a792af806122bbbc119f13d65c16b667ca96	2026-01-20 04:42:15.496	2026-01-21 01:59:06.677
cmkndk0000001wtowu95nvr44	cmkncnzgv0002wtppjpnpwvi8	cmkncnzgv0002wtppjpnpwvi8	credential	\N	\N	\N	\N	read:users	\N	f00ac4e5546c2492fd346341cb22b147:dd17868b8386ccec4167fd252ec5cb157f1c3ebad7f7ec98bc9648577698d6645c7206c1fb43dabcda2ef2eec376d2a714cd9bb572d6ef2d98329a2569cebbd8	2026-01-21 01:59:07.008	2026-01-21 01:59:07.008
cmkndk04f0003wtowsbisj8fh	cmkncrcjl0008wtwotx2sg0qm	cmkncrcjl0008wtwotx2sg0qm	credential	\N	\N	\N	\N	read:users	\N	234c673b2d194ef6ce18baae84b52fdc:4c8d44ab79a75552c953a6b1194525025cf94ece3e2036bc7d500f6538e1016f0127f77cec6a1f25fa473a579ab3073abe6a1286c53af4955e05586fa4f9ecc6	2026-01-21 01:59:07.167	2026-01-21 01:59:07.167
cmkndk09n0005wtowbqe2krhn	cmkncrck7000ewtwogh7i973t	cmkncrck7000ewtwogh7i973t	credential	\N	\N	\N	\N	read:users	\N	a7294ab4210a03fac7938db705140fa9:d066cea5d8e94f05610941af2d101f90d463fc8559b85d8a47c64541a49cfb37b60470972f6da018e13c126a5b004b5ca1cac3462a66dcd4b1a3657a1b2bfdee	2026-01-21 01:59:07.355	2026-01-21 01:59:07.355
cmkndk0qt000bwtowi71rxhkj	cmkncrcq8000wwtwo18oiwkyy	cmkncrcq8000wwtwo18oiwkyy	credential	\N	\N	\N	\N	read:users	\N	b01af03b45fe08884d9b3a00677e4b09:c4d1cf1d3774a7e424184dcff79a68bec90618a5c6f245982ce3b421351b7833a631a6e8fac26476b45b88fb702059987de5e32d96605396aff75d7e8d86e21c	2026-01-21 01:59:07.974	2026-01-21 01:59:07.974
cmkndk0v9000dwtowo4tx5v4u	cmkncrcqo0012wtwo7kxqxuc4	cmkncrcqo0012wtwo7kxqxuc4	credential	\N	\N	\N	\N	read:users	\N	5062fc266169b2945d61e4af650efa54:d2bacafa031544543e6a04110bc7cfa634fcbbcaa97b51e6ef0c81f5c3ad38d9fc2356abfac5214d1f4b7704db0b92f6936569f23fe3338ff539be749c411da7	2026-01-21 01:59:08.134	2026-01-21 01:59:08.134
cmkndk0zx000fwtowldo5zthi	cmkncrcwi0018wtwo0gvw10qv	cmkncrcwi0018wtwo0gvw10qv	credential	\N	\N	\N	\N	read:users	\N	bc7a98c9829451c6719097ecadd54355:63388047c0711581bb566b5c3e798015a12d75a829ea124d228165747506a7d36dd7a392f70afc42a0c2f436db7467694c64df81f20fce6ebb5a4ad4e14e6aea	2026-01-21 01:59:08.302	2026-01-21 01:59:08.302
cmkndk14v000hwtowt7mee4by	cmkncrcxa001ewtwo43qfede9	cmkncrcxa001ewtwo43qfede9	credential	\N	\N	\N	\N	read:users	\N	9c7acc99f47fb0f42380fab044d4d64a:35f55c073a59a6ecf17d9a2d95ebdfe831c42f122e81a74c3657fcf2fe4d6b55103fdaae08251b6dd2e2de6dae1d4abf262f1b3c623dd7d12114096a09761997	2026-01-21 01:59:08.479	2026-01-21 01:59:08.479
cmkndk198000jwtowi33hq99e	cmkncrcxt001kwtwow9ua9lxc	cmkncrcxt001kwtwow9ua9lxc	credential	\N	\N	\N	\N	read:users	\N	23db867e6051fe878aa588559366ba97:7ba1479f97777c6e2d1c1b0ec24c81349aa61d955a7dceefe3598a090b49a603109754fe6e77fcf65964d4b75cc2549160685d4cdfdeba755b99c34f2dadc772	2026-01-21 01:59:08.636	2026-01-21 01:59:08.636
cmkndk1dq000lwtowb07x8izd	cmkncrd20001qwtwoquvz7b29	cmkncrd20001qwtwoquvz7b29	credential	\N	\N	\N	\N	read:users	\N	c951be60560c5319994eaed3a6b5a035:99e527ab1f7345b3ac5d4a648063fabf7d23238294496eb33673cedc5558f03546d5444e7df5583a09f6689d06a8c2f0ef7c8c4152f96f374abbc1d6e70874ef	2026-01-21 01:59:08.798	2026-01-21 01:59:08.798
cmkndk1hp000nwtow8dkiwnm8	cmkncrd39001wwtwovzrz6rxl	cmkncrd39001wwtwovzrz6rxl	credential	\N	\N	\N	\N	read:users	\N	75207e8e33d3a90b28166bccd3d13f20:05262319b0a2aca85c7ac48b96773342adba3064929fa1abc9dd87c120e1ced12101cf6152d84816b202d94e03bb6ac30e35249b15ca35675f4ce2e0f3e1dfe8	2026-01-21 01:59:08.942	2026-01-21 01:59:08.942
4nChrAm2ed8Fm2t4DTNNdf5UjI51U1OR	wl78V5uxrQq3rZKouvn2Ztoi48od98Dp	wl78V5uxrQq3rZKouvn2Ztoi48od98Dp	credential	\N	\N	\N	\N	\N	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-17 01:54:39.3	2026-01-21 02:02:14.866
cmkm58pml0002wt26wbd6j4q5	cmkm58pme0000wt26mn77ke7v	cmkm58pme0000wt26mn77ke7v	credential	\N	\N	\N	\N	\N	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-20 05:18:37.245	2026-01-21 02:02:14.87
cmkndk1mq000pwtowfmjq94nx	cmkncrd480022wtwofkqe22zo	cmkncrd480022wtwofkqe22zo	credential	\N	\N	\N	\N	read:users	\N	9744a3933850b5aaa8b671def3f1acbc:3eb7ebc024f2bc3ed046b9835211d6e1323a5eafd176ae5d26dcf366d81bba08f95882401fa8aecc5d047f23163ea4ab0aad140ec93846900dc9132877222488	2026-01-21 01:59:09.122	2026-01-21 01:59:09.122
cmkndk1tv000rwtowq0o5744r	cmkncrd520028wtwoa3fwozr6	cmkncrd520028wtwoa3fwozr6	credential	\N	\N	\N	\N	read:users	\N	302947852c8bc0fe9f423fdca2380457:7aa21cc3be13a97ee13344c70a6ec1dbf512100d7475dd3148d221060974dbed23697ad25e4bc8ffe2b16bc1a254307d52a569f283d46e114213b46690ce033f	2026-01-21 01:59:09.38	2026-01-21 01:59:09.38
cmkndk1yk000twtowyifigr8a	cmkncrd5k002ewtwokfav4zrr	cmkncrd5k002ewtwokfav4zrr	credential	\N	\N	\N	\N	read:users	\N	302255d6046387dfad4f381f8c33d022:79c23b464bace8ff7fe8ec2ff21c6981b453a12efa9c681dab7d0e5a50647ac5eab5fea049da9654ce101b78f77dea035d6239258fc3139ac47e8e993960d831	2026-01-21 01:59:09.548	2026-01-21 01:59:09.548
cmkndk22p000vwtow4a3bhcmo	cmkncrd5z002kwtwo4une9uv8	cmkncrd5z002kwtwo4une9uv8	credential	\N	\N	\N	\N	read:users	\N	fb6c65a4f40fc2feb76bea1b0cf8e3ec:ea48e8c797be39d7b557ab583f2d02348291b2db5359c044c6b6071be88ae0eb6c183d68c667181600e5d93b4a9d6cbb2de43b07ec3dc93cea0498601672fbbd	2026-01-21 01:59:09.697	2026-01-21 01:59:09.697
cmkndk2ms000xwtow9ovbjnv6	cmkncrd6b002qwtwot9621bjt	cmkncrd6b002qwtwot9621bjt	credential	\N	\N	\N	\N	read:users	\N	ffbff9bcad6808cad1b1bf3929de92dd:3b79f18e40cf697e765efde2485487413dd92bd698262e6a8f6aee78954623c354beac619d0bf8317ac0aa367c0717f8555b1f5df1f29da0d0478df76c77ac18	2026-01-21 01:59:10.421	2026-01-21 01:59:10.421
cmkndk2xu000zwtownhn7ia0z	cmkncrd6o002wwtwooxvaqsza	cmkncrd6o002wwtwooxvaqsza	credential	\N	\N	\N	\N	read:users	\N	79c28bd979f5c068d9f1f45d519fe5ff:1a711cefc8c8e719cfc10a6155c0747eff0d987324cc42e8c4c40e0f2632361bd1af9f688d379ced509f93b460f8bc76c1faac3949cdabe2b9a4a86b9bf3d19e	2026-01-21 01:59:10.818	2026-01-21 01:59:10.818
cmkndk35x0011wtowmqgk80e7	cmkncrd730032wtwoju2nm3y3	cmkncrd730032wtwoju2nm3y3	credential	\N	\N	\N	\N	read:users	\N	73f4c907c0de26c237ea9ded4a68d8c6:2e4a0a82611eded4385124950887a6939a6221e3827af7120a9baf3c0d535d2ecfb927ea9b21477621586d06f147ec7a77a3bd2422bc40e7b4028eedb7bfb450	2026-01-21 01:59:11.109	2026-01-21 01:59:11.109
cmkndk3g00013wtowcejzu8yg	cmkncrd7f0038wtwotcz4r2t3	cmkncrd7f0038wtwotcz4r2t3	credential	\N	\N	\N	\N	read:users	\N	3d9a5030b14c371e50043fc04d6d9da8:aecbd251bcfc0ddade4bae1afe6177acd9d66cdf17f2e65227a9290aafcf1b27e3ed58d042b260e47430ab5a570cdd4433a48d7103c1aba5bfc6d5083e083b00	2026-01-21 01:59:11.472	2026-01-21 01:59:11.472
cmkndk3r30015wtowsr5aryfb	cmkncrd7t003ewtwot2y2c2mp	cmkncrd7t003ewtwot2y2c2mp	credential	\N	\N	\N	\N	read:users	\N	769379f3bf9b1627606eb7ecf8915519:86863af02dee3fe28cdf4f7e6ad008c6de62055618adb2c7d5cd45eaa83d333133ffe4825cea86c1b5c7afa77459703cf2f095a3177c216f049ff292d6cf5c12	2026-01-21 01:59:11.871	2026-01-21 01:59:11.871
cmkndk4280017wtow25ssmgcf	cmkncrd83003kwtwosvruwy83	cmkncrd83003kwtwosvruwy83	credential	\N	\N	\N	\N	read:users	\N	f14288cc2381eb1e7635604469621eee:53ea6e1882db5879ebf401098e7555a70c33357acb63e87edd02fa319af6649b32c506714fc21753e40b7c08bf3423910d45954efa637671b0c0d2eb23beeaf9	2026-01-21 01:59:12.273	2026-01-21 01:59:12.273
cmkndk47j0019wtow14tlni5g	cmkncrd90003qwtwor438kw6i	cmkncrd90003qwtwor438kw6i	credential	\N	\N	\N	\N	read:users	\N	57c949c0031ba6f18e42a71f869e84c8:64dd9a8c5ab02ef918e7303c020e2019bd9c52e53588ab924262ffe7b954227c2a82f6cfcabcb206de46291b45999070a4f10db5bbfa10ed30c472bd66bbd8cc	2026-01-21 01:59:12.464	2026-01-21 01:59:12.464
cmkndk4df001bwtowtxh1ubyq	cmkncrd9y003wwtwoych2mbv9	cmkncrd9y003wwtwoych2mbv9	credential	\N	\N	\N	\N	read:users	\N	9d5042ed36657f765ead2c4606ba86c9:244977cc68d4edb39ebe3a808b13a0094831da1a3fd4c6be21133b92d84a08e3011967651c74d08239d4b93fe29dcd5fd259ded6befc5437845aa2f6d51c8bd2	2026-01-21 01:59:12.675	2026-01-21 01:59:12.675
cmkndk4i5001dwtow2m53b4eh	cmkncrdak0042wtwo72t2b2i7	cmkncrdak0042wtwo72t2b2i7	credential	\N	\N	\N	\N	read:users	\N	ecef84c67c1e0af8f1ebc143629ac79b:73082eeb570735d1e06fad11f5beead2b2562c3d30ea06f1a6d5b05e38fd25392c44cdaee120d46e06becab3f3e4ac692ffdd3685407855fdf0f03b6d3fe72f8	2026-01-21 01:59:12.845	2026-01-21 01:59:12.845
cmkndk4n9001fwtowlsnfk46l	cmkncrdb70048wtwohxb97zbb	cmkncrdb70048wtwohxb97zbb	credential	\N	\N	\N	\N	read:users	\N	07a3a54e3ab9fce94636bb63c494a30d:005015faebc448dac65e52ad2a076f7db7f507bfc0452b1f577b58bf538bf26afc6ac31c791ab9daeb0cc562789a025ef47183fc4681887fbcc3a5c8e472274f	2026-01-21 01:59:13.029	2026-01-21 01:59:13.029
cmkndk4w8001hwtowf5xlnt8y	cmkncrdbm004ewtwot8op1d3w	cmkncrdbm004ewtwot8op1d3w	credential	\N	\N	\N	\N	read:users	\N	39317f4620bf56a1af1b886c2827dfb0:8c2600fb83268427f9c8574d84ffae992e0283a4f21cc76f51be27db6f6e991323c0203f54a1945d0b4f154575ed85785f7efe0eec81d36bb541946a8387ee20	2026-01-21 01:59:13.352	2026-01-21 01:59:13.352
cmkndk51a001jwtow4iayv9gp	cmkncrdc1004kwtwo9vdvzjsv	cmkncrdc1004kwtwo9vdvzjsv	credential	\N	\N	\N	\N	read:users	\N	6ba4e36a9e644ff899611ee60ee100da:605552ebc8b42b7a4f9eae2facdb6bdace9160d4180a9e13d475ad01fa8dbc461498396c99ebcb84fe24ecc7f9d500a4933d971aceb6caa9a80d479ebb07febc	2026-01-21 01:59:13.534	2026-01-21 01:59:13.534
cmkndk564001lwtowapiqbaak	cmkncrdcc004qwtwosptm8t0k	cmkncrdcc004qwtwosptm8t0k	credential	\N	\N	\N	\N	read:users	\N	28c7a84c97b34958ce1d2c6753f52001:7abb093e5330c03bb042822ceaf314081aff65b44a80c0259432d88ddad8d9686c4e172487d2eee793143ad019820ff97e6704668c5b3f1a2609e58ce0972502	2026-01-21 01:59:13.708	2026-01-21 01:59:13.708
cmkndk5da001nwtowh0gnv1dw	cmkncrdcn004wwtwotm3o8xeo	cmkncrdcn004wwtwotm3o8xeo	credential	\N	\N	\N	\N	read:users	\N	b28345909b62c22155f632f2e6602475:148cd87002536ed7e73566f3d5f840400dd20d76e526bac3f8426c7082b7a5fd910fd823dc2bb14247d321999665771c56d242190feaa8eaa4ba067cbdd110b9	2026-01-21 01:59:13.967	2026-01-21 01:59:13.967
cmkndk5hu001pwtow9dfy3s9p	cmkncrdd10052wtwo8jghzcki	cmkncrdd10052wtwo8jghzcki	credential	\N	\N	\N	\N	read:users	\N	7cef71e9ab7c83565d376f81f711d8fd:f1a04e96726697e62b31aa30e10648c1f1a277433634dcc734c970300583f5c7192446c4c6c54eef475ab194cd754612cd84b339526627a5bd8ae8c10b395b31	2026-01-21 01:59:14.13	2026-01-21 01:59:14.13
cmkndk5mm001rwtow8o7dnfs9	cmkncrddd0058wtwo6ux741dy	cmkncrddd0058wtwo6ux741dy	credential	\N	\N	\N	\N	read:users	\N	e2024fd7de026e3285f01281da864dc9:9596dbdb166dd28352b5327a1e97d48ce4536d806fbafc4b441c579500a0255faa31db3169a542f807cd53e827832756dd34accb84d69bb86d9c0d5199fb82da	2026-01-21 01:59:14.303	2026-01-21 01:59:14.303
cmkndk5up001twtowk1kk46y7	cmkncrddq005ewtwo9a979ysg	cmkncrddq005ewtwo9a979ysg	credential	\N	\N	\N	\N	read:users	\N	61a2b972dac8fe0a3ca4ef5852017be1:f9169a2106211ef54f272af04997db73dd2f1cf94662322fd18ba7ec123b156b5b55c505a521ffb8c53d73c0427ffdccd3e8def0ff67d19c75e5e6132407c2a9	2026-01-21 01:59:14.593	2026-01-21 01:59:14.593
cmkndk5z6001vwtow5ypm2t0y	cmkncrde3005kwtwoi4mc63ai	cmkncrde3005kwtwoi4mc63ai	credential	\N	\N	\N	\N	read:users	\N	ba40b109c6334dc959463d94fda50694:6b3584c58a21d138a076374d4aa00275b2ca594c8b9ad61a82fda8b792915c7a74c8e115c77827bfaba8283bc26c24db5eb3cbe5e544a7e7bcd0274212b14d3b	2026-01-21 01:59:14.754	2026-01-21 01:59:14.754
cmkndk68c001xwtowbfqcuwkb	cmkncrdel005qwtwod46wz1la	cmkncrdel005qwtwod46wz1la	credential	\N	\N	\N	\N	read:users	\N	951f2814415c4fc44f285e5e23c797af:cf63f2e581c010ebfb6d2de0f510305d9ebfd9bc538cc8ae84f681b492963733ba7b0f141e83192e9ecac91913d781bf9b1a70b65b250e32fc5950cd37373dd3	2026-01-21 01:59:15.085	2026-01-21 01:59:15.085
cmkndk6cv001zwtowg8e4ihan	cmkncrdf3005wwtwo8c2opchn	cmkncrdf3005wwtwo8c2opchn	credential	\N	\N	\N	\N	read:users	\N	b92183056d846a5fe201e7ace9456160:3997f325f78e5f3be500a5529348415b12bd403473e1262cce6dac1fbc5cc31eb19c064a3a75db5cca9155a104eb55489e807921e50c8f66e3e47733f4b788e5	2026-01-21 01:59:15.248	2026-01-21 01:59:15.248
cmkndk6hq0021wtowj5eu8gbi	cmkncrdfk0062wtwohum72vof	cmkncrdfk0062wtwohum72vof	credential	\N	\N	\N	\N	read:users	\N	37c876a2ff00e6332b66c0f5727a4f96:c225d93df03b116e2426fcad279cca5f5a6c491b79c341bf7690a73cc9b8b31924b3a6755fde7650c2282047e731e80cfa55ca0c054db24cec1d2cc5c88866a6	2026-01-21 01:59:15.422	2026-01-21 01:59:15.422
cmkndk6pj0023wtowa3lhuzac	cmkncrdfy0068wtwo41neolpb	cmkncrdfy0068wtwo41neolpb	credential	\N	\N	\N	\N	read:users	\N	69d5361f9e6e2002abcc5ab545047496:105a113486bd2bc34c170766dd311c96c14ae373ea4a1a05a96a84c1f60e47d2df566b20daee12cbd2b91f96ee3c24a5f6e129620133b6fbcf4b0c5aa3d48047	2026-01-21 01:59:15.703	2026-01-21 01:59:15.703
cmkndk6u30025wtowb5l5lbtc	cmkncrdgf006ewtwolyjdm46i	cmkncrdgf006ewtwolyjdm46i	credential	\N	\N	\N	\N	read:users	\N	58be8b0d15e223d2a3c0c8ca6a7a9da0:4467af7b76773e99c706bdedfcc05552bfee87f4d2063f174ba5f89c4d7c247d23255f40b44fefc78580f480befb74e1c9506f088ac7cd87533718a117f88791	2026-01-21 01:59:15.867	2026-01-21 01:59:15.867
cmkndk6yx0027wtown5k8ol7p	cmkncrdh8006kwtwout1d17zl	cmkncrdh8006kwtwout1d17zl	credential	\N	\N	\N	\N	read:users	\N	078bb1f1951aaf77c39a91acf31a9a8b:1f16fd695d6d21ec513511b61058a39cf1cab69b0a3d2219cb3513ed629cc17ff5051e96c8130c0c99e998c46e6c6fc5e2eebb2aa5d49a0c5c23120db0e02ea3	2026-01-21 01:59:16.042	2026-01-21 01:59:16.042
cmkndk73u0029wtowypa7dtcd	cmkncrdhn006qwtwogthdm3jg	cmkncrdhn006qwtwogthdm3jg	credential	\N	\N	\N	\N	read:users	\N	1d9f93aa68eb9f9ebc8047c4f335e0bf:46aed258efcaced9a47f695562adc64337b9f1275d3ec03d3359a69bf8253f49978baea8d9ca3f5f7e5beed06981c3b47dc448f4e9bc82049aef0e41a5fbe6d2	2026-01-21 01:59:16.218	2026-01-21 01:59:16.218
cmkndk78u002bwtowujr6s3vy	cmkncrdi7006wwtwormss1tsr	cmkncrdi7006wwtwormss1tsr	credential	\N	\N	\N	\N	read:users	\N	7b8951e97b2ac9b69106f66896c0ec87:ada235491bae90189a586a187ab2daf20b364865b85dc69f077f3d1b68e91264c2c038d0ceb98b7c5d8a0a97f30d40e0b36a5964b8f4f96f1760ae31b209ef1d	2026-01-21 01:59:16.398	2026-01-21 01:59:16.398
cmkndk7dn002dwtowhlr8v7xl	cmkncrdin0072wtwolovnk9ir	cmkncrdin0072wtwolovnk9ir	credential	\N	\N	\N	\N	read:users	\N	c0adba5855631328f02bcc0d6195c735:a37e3bfa538cde1926ae5b3a63863a6eb80eb6ff5147b1f8302d6aebfb1e4f519dd9c09deaefbd814d532a2e7ce4f5637729953bf6ff0303d5f38b0291f2e739	2026-01-21 01:59:16.572	2026-01-21 01:59:16.572
cmkndk7km002fwtowuro4xjzt	cmkncrdje0078wtwoy5phen07	cmkncrdje0078wtwoy5phen07	credential	\N	\N	\N	\N	read:users	\N	669687fec623e2df1d1d2ccb53496a42:1485c51d81450e805999a713ddaaca4b720f8fa9ed5c2547590e0cdec2a0057e38d4cb5a53e5130dbea66f7bdd830069590f5796823cd0161c079cfb149fbb56	2026-01-21 01:59:16.823	2026-01-21 01:59:16.823
cmkndk7pt002hwtowkx2wnrm9	cmkncrdjr007ewtwoz9ww29v2	cmkncrdjr007ewtwoz9ww29v2	credential	\N	\N	\N	\N	read:users	\N	6166dfdea6849e625ff403c6cd01d2c3:9b79f4c05f6f30bcaaa7d97ddf0b799cdff773c3837674220f5f6d76ecfae9e0ec4d007667acd727e926622e7ad69ba3678f396539e8e76f3b7cf8e193057fe8	2026-01-21 01:59:17.009	2026-01-21 01:59:17.009
cmkndk7yq002jwtowe6f6uxzk	cmkncrdk6007kwtwoik3yhyje	cmkncrdk6007kwtwoik3yhyje	credential	\N	\N	\N	\N	read:users	\N	33a80e8a18fa9880d7b651c74e0c9e81:f8087054e1319bf3579bd853e7878c980aa46857b398b18b4ebae087756acab6dd1ee5e39192dac31f587a22c3e54d252910204420c677c317af5933c515d2a8	2026-01-21 01:59:17.33	2026-01-21 01:59:17.33
cmkndk872002lwtowx19vussk	cmkncrdkj007qwtwo9xvfszpx	cmkncrdkj007qwtwo9xvfszpx	credential	\N	\N	\N	\N	read:users	\N	a82537d14db9b9180f62d54777b0dbc6:52c906e53129408eb3eed0162425c715f8ad481ca7b8282c8a8bceff46e780a7e0828a13e557e3624f89cb46be12eb440223133b74d8f970f95129db24e233be	2026-01-21 01:59:17.63	2026-01-21 01:59:17.63
cmkndk8ba002nwtowkmyzpian	cmkncrdkt007wwtwo6294lbl3	cmkncrdkt007wwtwo6294lbl3	credential	\N	\N	\N	\N	read:users	\N	fe82c792573dd00deecc5da6ba402d8f:dd68adeca92084552828cab1787d5679e86e74b6a0b349da56a3a73d1f6d5b363431270a13436fe0abc95b1e69e7a9ba80b89448217d6495ad29055a7b94fdbf	2026-01-21 01:59:17.782	2026-01-21 01:59:17.782
cmkndk8h0002pwtowb6l8a3o6	cmkncrdl40082wtwo1hku2dn0	cmkncrdl40082wtwo1hku2dn0	credential	\N	\N	\N	\N	read:users	\N	59f94f6dc5a1a8ec2d8c486ad00108a4:ac4357f112b24cf87d02cf046557acfa1b6a376a54d31c43ef7a1eb03112caa48bacd6ec81a25688b6d951bbbb0b82b1789749fbffbb3169d45530bc1cfd1218	2026-01-21 01:59:17.988	2026-01-21 01:59:17.988
cmkndk8oc002rwtowm8vedp85	cmkncrdlq0088wtwocatvxifv	cmkncrdlq0088wtwocatvxifv	credential	\N	\N	\N	\N	read:users	\N	20939a3a5c59f3e18299bf87f265b3c0:073a3479ea62e20792ed595b52f490319529cc68b5f40ae15411a6b4fc38299991357639e984ab21588029108c38c9349b4ffd3558a22f0b247f17b87e78d952	2026-01-21 01:59:18.253	2026-01-21 01:59:18.253
cmkndk8ss002twtowudurogwl	cmkncrdmd008ewtwoyyhbui0p	cmkncrdmd008ewtwoyyhbui0p	credential	\N	\N	\N	\N	read:users	\N	a90d47b5bafab70cd57881acdc863dac:1d52a2e581f13a87874ef85cf81e0eb2086dffe908f551aa44d6a4dbf652a6a83acd1bcc71c24c4797a47935d55404a66371eed5be7af575901af82d23a9382c	2026-01-21 01:59:18.412	2026-01-21 01:59:18.412
cmkndk8yi002vwtow36rnknok	cmkncrdmt008kwtwog7yuoern	cmkncrdmt008kwtwog7yuoern	credential	\N	\N	\N	\N	read:users	\N	819796ab11113f5517410d2abea3382f:5bce02ce3a09bd93cd0b9709f30b6e98a95be21f3ba97449057b791860c33094a75954f219abd025a95e8b4ec9763d1a20644c20ca5f838034415d6b9c082164	2026-01-21 01:59:18.618	2026-01-21 01:59:18.618
cmkndk96v002xwtowyutqpn9h	cmkncrdn9008qwtwobywmsrqw	cmkncrdn9008qwtwobywmsrqw	credential	\N	\N	\N	\N	read:users	\N	495a67ad9810bb91061c4a75cc219104:1fc3b88c0f995a232fd9d8f70ae6d8c1bebc548cfc864dab653fc40b4cd709b470d5149832b96ea598b73cf2d55b3ec308f4dec6d5de6acb4a3ad7c4289b6179	2026-01-21 01:59:18.92	2026-01-21 01:59:18.92
cmkndk9ba002zwtowutjukcgk	cmkncrdnk008wwtwot3h2frek	cmkncrdnk008wwtwot3h2frek	credential	\N	\N	\N	\N	read:users	\N	c94a047932ed90d4c60167906c4c0074:79cdc0a118b07fea808f330426a2680e25349f881c1394db3f1a0ff1f82ab65110d26faeb093b9120c59c0fc10603271f695af46df316aea39c44a613befc52f	2026-01-21 01:59:19.079	2026-01-21 01:59:19.079
cmkndk9o30031wtowjoxgete2	cmkncrdo00092wtwoy5fysbpl	cmkncrdo00092wtwoy5fysbpl	credential	\N	\N	\N	\N	read:users	\N	73ec41a3039d47fc8fec51411676c7e6:7ce320400d03a137ea0d11900425549b14aa4278cba992ddc92622722c189bda022071633248f287d23e2d59f35f28a46ef82f0cc2e68bfe163275d13c3eba8b	2026-01-21 01:59:19.539	2026-01-21 01:59:19.539
cmkndk9t70033wtow2yktxbb3	cmkncrdom0098wtwokji0roh6	cmkncrdom0098wtwokji0roh6	credential	\N	\N	\N	\N	read:users	\N	32dd690f85376a738c99f3cd3764c6be:c60f0ca9d5b359be885c3c0058bab3da698bf3469923a6035c20ebc53732866ccac6e1e5528fd4855fb2eeb62e0e5a080683c57fba4bf7315cb14077a6dcf0a3	2026-01-21 01:59:19.723	2026-01-21 01:59:19.723
cmkndk9zz0035wtowytf22lko	cmkncrdox009ewtwo4yn31mze	cmkncrdox009ewtwo4yn31mze	credential	\N	\N	\N	\N	read:users	\N	796c1e396c696cc7cfb747a6ceb7fef1:8347dcc0debf40771dcd648206b7454c4f48eeecc02ec4a488a25a0f50d5d8cdb151ae118ac2bc5b45efce5e088c3b151fd2ca8f69747cacb2083808f915f1bf	2026-01-21 01:59:19.967	2026-01-21 01:59:19.967
cmkndka8n0037wtowc2v598l2	cmkncrdpe009kwtwo5lw3ovgx	cmkncrdpe009kwtwo5lw3ovgx	credential	\N	\N	\N	\N	read:users	\N	4516f8a37b7f9f7cbe9daae1533fc74f:a5e6813a070b9b1af3e04fde36b7f3a2867a92e4a9624d97a14027046f052edf770b3b48a96b1548576a4598f5984784e561f4bdd5d871d9632767d37f08410b	2026-01-21 01:59:20.279	2026-01-21 01:59:20.279
cmkndkael0039wtowpbe9pka8	cmkncrdpq009qwtwojlyuqkvi	cmkncrdpq009qwtwojlyuqkvi	credential	\N	\N	\N	\N	read:users	\N	fa4e5b10ee25383ea29158158652a8a7:695a86cca43aa7fb73988c9d0717aa110c18c92b6f3050348beaac76db4b9f10e99847537896bcc85aa7f0afd3bd164703a96d96f73300954ab63dabae6a8df0	2026-01-21 01:59:20.494	2026-01-21 01:59:20.494
cmkndkak0003bwtow0sshos8l	cmkncrds0009wwtwor1yhbghs	cmkncrds0009wwtwor1yhbghs	credential	\N	\N	\N	\N	read:users	\N	cc6a2679ac3ccc2bbcb0b0abb41e5034:667e45149d105b8fcf9582dc4e9307c50b4729d237608a9213d2c461e954bc447f713001cd5d86ff95fa7ec00cc818caf7b18f2937747253038aa36a607b9e15	2026-01-21 01:59:20.688	2026-01-21 01:59:20.688
cmkndkav4003dwtow7qslbhvb	cmkncrdsx00a2wtwocu3v8nbk	cmkncrdsx00a2wtwocu3v8nbk	credential	\N	\N	\N	\N	read:users	\N	438e5f3c803f669783082988f2009df9:46523352a75d859bc0e54ad5df36a07dd239668b7ae9c17902196870ef862de3b59debb04456127fd24cb2b0a6c0f895fb0af19a24471585c0ccd7789730cc22	2026-01-21 01:59:21.089	2026-01-21 01:59:21.089
cmkndkb0s003fwtowbg57kk0c	cmkncrdtx00a8wtwo3e9k0ljl	cmkncrdtx00a8wtwo3e9k0ljl	credential	\N	\N	\N	\N	read:users	\N	de0da9e95ffbb6de0c01e3b1d2473a94:488d5ed64b941144f03edbb832192408d6c3f926882a11215286637770ccad49b879b1edac0159ab45273f82134e9ff3673ab4856af660c2dc59f3f41fbe439a	2026-01-21 01:59:21.293	2026-01-21 01:59:21.293
cmkndkb5l003hwtowkqj8faw5	cmkncrdut00aewtwoq66360pr	cmkncrdut00aewtwoq66360pr	credential	\N	\N	\N	\N	read:users	\N	0d2a26e731fd5d5e7f33045564a5108c:b755894f74898e236bd35b405efb8cc61e473126bb6624ecb0655948b882164f40dcc41fb49b9db43dae12e9aec0aa81c8a77a088c342be23075aab77f86bf03	2026-01-21 01:59:21.465	2026-01-21 01:59:21.465
cmkndkbb1003jwtow0guabav7	cmkncrdvl00akwtwoy12r3bq1	cmkncrdvl00akwtwoy12r3bq1	credential	\N	\N	\N	\N	read:users	\N	f07f624d7853de4e12029ad359501a42:4ec5e04ec5245face502eeecd04e6560db1b32e6c5ef649e261ad85f03bc73df64935ec87edbd22247d08f22ca1efe6b9352f71c195beabc86e0db5af6ee96a4	2026-01-21 01:59:21.661	2026-01-21 01:59:21.661
cmkndkbjl003lwtow46zq453k	cmkncrdw700aqwtwopg4cvb2h	cmkncrdw700aqwtwopg4cvb2h	credential	\N	\N	\N	\N	read:users	\N	739128224e8e59e7834061ae155a52cf:a30377aaa200f01da47dc8a9980e53cc92c75dca0d4fa5b5beeca029d992a34f2c7370c5b767dc8fe712e82f433044af9db636ff27b08c60e49d9eb6bf4b8fb5	2026-01-21 01:59:21.97	2026-01-21 01:59:21.97
cmkndkbo0003nwtow7brbpf2e	cmkncrdwy00awwtwoqp91b6vr	cmkncrdwy00awwtwoqp91b6vr	credential	\N	\N	\N	\N	read:users	\N	e4f6f4c10f294336dffa2e575369fffe:42baed70531e6174a345aa9a737efae22deef9eb9d4ff5a074414e596d4477725c149ee59515269d35585be5420d1560c2b36f83671d2ce50d5fc1281dad0ffc	2026-01-21 01:59:22.129	2026-01-21 01:59:22.129
cmkndkbx9003pwtowgtifwd9o	cmkncrdxi00b2wtwo0iy7q3x9	cmkncrdxi00b2wtwo0iy7q3x9	credential	\N	\N	\N	\N	read:users	\N	d3b1a16e19e77fe94f0049cb36cc4b30:df74b8736baee8e984db9da1dfc3c28dd79531a05720ab90fd3d3bd9a6cad1dab9d4f87645e5a57aae40e0a316f528183a9fd1cea172ef1d44e1cedab2cb0797	2026-01-21 01:59:22.461	2026-01-21 01:59:22.461
cmkndkc7m003rwtow1pj655rb	cmkncrdxz00b8wtwou54y23pq	cmkncrdxz00b8wtwou54y23pq	credential	\N	\N	\N	\N	read:users	\N	033443d443742f8982dedd374b829ea7:d7077466a6d8e3258333e42b95f86769d04ee5a29d101721e00a8c6dc6bd4e9cde7c6dfc0e5c804c4443efd1a7bc29017507c4ebad7ae0449e29ae7cffa2ffda	2026-01-21 01:59:22.834	2026-01-21 01:59:22.834
cmkndkcey003twtowv7n6j1j3	cmkncrdyx00bewtwoe00587sv	cmkncrdyx00bewtwoe00587sv	credential	\N	\N	\N	\N	read:users	\N	1db74146882f77df0ad9e1bdc06fc8a2:a7a15211497ae477cdf3ac51441e26c7ce2abdcd0ac1d9d33f56217858643cd82f519cd494e4ebf0390789f12be2abf4149a2ab39f8e9aeca908105dad89b895	2026-01-21 01:59:23.099	2026-01-21 01:59:23.099
cmkndkcjj003vwtowenngqv2f	cmkncrdze00bkwtwo8zvlyukx	cmkncrdze00bkwtwo8zvlyukx	credential	\N	\N	\N	\N	read:users	\N	c4bb57579181ac00493461d777d7d166:36e0b55501a8695c408a91c9ce9573f807b8f206415a30d0e787c165ff6ef55b4d923df599b5a7e9271f1667ef5af317d97f481144c33275b4c84cdefd007d0c	2026-01-21 01:59:23.263	2026-01-21 01:59:23.263
cmkndkcu5003xwtow8y7y8ren	cmkncrdzy00bqwtwo7xncbem0	cmkncrdzy00bqwtwo7xncbem0	credential	\N	\N	\N	\N	read:users	\N	8467d3e3d296577ce6b22505d486e281:a8080cd11c2919dcd8d5a3833e6d02ad60b0dd66507955b773844393bef70620b1cd9d9a98c7eb601aa1fc5230c21e633531820f18e8c6a4321340a394c812dd	2026-01-21 01:59:23.645	2026-01-21 01:59:23.645
cmkndkczg003zwtowcf7km2n8	cmkncre2z00bwwtworp4vcgtc	cmkncre2z00bwwtworp4vcgtc	credential	\N	\N	\N	\N	read:users	\N	2570ad800de1836c50b192e9daec5836:aec0baf06f9e7784367505225eed27dbfa71061c447c40aeac00a8ca74261904cedd89bc0e92bcd35aa6cf5a2544992970646a902cc67c752a37085468d7775a	2026-01-21 01:59:23.836	2026-01-21 01:59:23.836
cmkndkdag0041wtowz5z5p850	cmkncre3p00c2wtwo666w1i5t	cmkncre3p00c2wtwo666w1i5t	credential	\N	\N	\N	\N	read:users	\N	02b08c1cdd607ad599859470afb44d49:4e6b2f232c402364601ce3650cc0e3f6eb28432967b911dd72af6e4fd6aba6ffbec2f35cde0543537a65c371332cc9126ec9c1d50c2dabbe981343c698f4a979	2026-01-21 01:59:24.233	2026-01-21 01:59:24.233
cmkndkdkr0043wtowrc85ogy3	cmkncre4500c8wtwo7hiuxsn4	cmkncre4500c8wtwo7hiuxsn4	credential	\N	\N	\N	\N	read:users	\N	c5c39bb80cdc909cb1457e8cf630a35e:c9cd27b182cebfda52d384204b34a2bac81dcee5c26060c95dd7e0e694cd5faa9c3b05f67e2da54d28e6916af39dc7daa0e0cbd811a2ea37ed791395cc331d69	2026-01-21 01:59:24.604	2026-01-21 01:59:24.604
cmkndkdqa0045wtow9a1otmmv	cmkncre4g00cewtwoqkkkuz4a	cmkncre4g00cewtwoqkkkuz4a	credential	\N	\N	\N	\N	read:users	\N	551424be9a431362f5cf474332013317:b732214c32c7ef640c8eb3e4511cdfc1e835a778a3f1bcf96301f36b9a12a0f4ebc6a01ddd1d45f4d4c6d8e9573f44f0967278ed02b2f77f23ab5930c882042f	2026-01-21 01:59:24.802	2026-01-21 01:59:24.802
cmkndkdw00047wtowix9kjsve	cmkncre5w00ckwtwozhey7nog	cmkncre5w00ckwtwozhey7nog	credential	\N	\N	\N	\N	read:users	\N	a36a0534ebdfb15e7f49c0ba3d817cd0:010993700e5c1c86bcf665c7bbdaa311b35d6d0907f0b9955ad78c6de1781cccd3cfbc5bf1035726db838406d392885eeac1e8160200ee1871fe329406818ff6	2026-01-21 01:59:25.009	2026-01-21 01:59:25.009
cmkndke0n0049wtowvxk2hirh	cmkncre7a00cqwtwowx1q72x5	cmkncre7a00cqwtwowx1q72x5	credential	\N	\N	\N	\N	read:users	\N	35a9c2c7ca643b1a3bd9129180528325:7d20e4a7de4f840fb6f54a8af6d2ba2124f688e6b79d2e3d1efcc8131d1bc96fa85a2ff6720c7d831f3212a7abb4af65f8e46ec0229ea0c5161ac5697bfcce22	2026-01-21 01:59:25.176	2026-01-21 01:59:25.176
cmkndke99004bwtowz9k7wqso	cmkncre7x00cwwtwonaqig5ht	cmkncre7x00cwwtwonaqig5ht	credential	\N	\N	\N	\N	read:users	\N	e28ba7dbf948272d75fd48c98b477ad3:651e32b777287d923480763691d06737ddefc4e64000478cfa92d571739c6e5de46147d7fe73d95db4889c73f3b48137facf6565a01b7e464cf993f9324746f1	2026-01-21 01:59:25.486	2026-01-21 01:59:25.486
cmkndkedt004dwtow3tc5g5hv	cmkncre8d00d2wtwocyzv5seo	cmkncre8d00d2wtwocyzv5seo	credential	\N	\N	\N	\N	read:users	\N	37e8b6fa6fbf37c7145c327b94ecdf11:e3a074beb122983476806ca062e8b660382a7eec0bb263ad95c5d562aaedfb974242206b5eba13129cf77c19a3fe7156fb2372b0ae9aef78e89bc6b348c2dce3	2026-01-21 01:59:25.649	2026-01-21 01:59:25.649
cmkndkejv004fwtowoc5wuci2	cmkncre9300d8wtwomy5d2yeo	cmkncre9300d8wtwomy5d2yeo	credential	\N	\N	\N	\N	read:users	\N	ce5866769d1e8dba60b43148c61ca91e:00bb67f435b68aaf33a01ff0465c7a13241946642a01f8578297d49345f3c494c9fb95c31e3601fa2f491ce277757c24f226e06c025baa0ca3ba9f4812f822ec	2026-01-21 01:59:25.867	2026-01-21 01:59:25.867
cmkndkety004hwtow9tmavvn4	cmkncre9i00dewtwosurzbo3l	cmkncre9i00dewtwosurzbo3l	credential	\N	\N	\N	\N	read:users	\N	d66be47ec44e5e6d720f583e93b720ee:b13879d35747c10e2d7b8d678ca373cad25b4276bbc3c89ce9e5f568b6882a20c836742bbc92f5f590ab6415244102d41369097414b7ffa72ce6f9446276d81c	2026-01-21 01:59:26.231	2026-01-21 01:59:26.231
cmkndkf06004jwtowz0tggyz7	cmkncreaj00dkwtwof0odq2zt	cmkncreaj00dkwtwof0odq2zt	credential	\N	\N	\N	\N	read:users	\N	584d43f7651e81f1df9274b400c08e14:8e5f00637bd554ba86fc19b8fc281bfa83478f82ba7f631c017515c008ed9e47e10dec2d7803097cfcd1aac3f74f88e811273dd9070d87b7722732a43de8f0ca	2026-01-21 01:59:26.454	2026-01-21 01:59:26.454
cmkndkf58004lwtowi1f4nqlj	cmkncreb100dqwtwok6u78ku4	cmkncreb100dqwtwok6u78ku4	credential	\N	\N	\N	\N	read:users	\N	be1d10e6e96917e5d0a6dfea28afd855:3a7fb3a2679271bd1dde54b529716b76a6e0ac5e125c5abc3d3bbb5a219d42681c67501a2049f9a6a3191ba8d9ccbbc220c2b06c6ae56da1fc3ae272c5751a5f	2026-01-21 01:59:26.636	2026-01-21 01:59:26.636
cmkndkfat004nwtow9ancjkqb	cmkncrebf00dwwtwohiiaxy4g	cmkncrebf00dwwtwohiiaxy4g	credential	\N	\N	\N	\N	read:users	\N	923b5baec1900cd6a99e31b7ea828c16:d271c4c949eb7ffca985f3dc0ae226aa423166430c2a1bc6b105cf6db905b9287baea85cea464d4b28f12a24673ee64343937270d7ce85eaebaa47cd830ef452	2026-01-21 01:59:26.838	2026-01-21 01:59:26.838
cmkndkffl004pwtowgbgyazfp	cmkncrebv00e2wtwo3vhb8gfr	cmkncrebv00e2wtwo3vhb8gfr	credential	\N	\N	\N	\N	read:users	\N	d6850da006f1b5be0b41bfe10355f429:bf4f9cea5c2666a02876b940ef7e4f664d6fe4bf844a56b577af9f3587566c24d5a33f6198016422dde7a1ece22b1b093e4a876b466e5885c05f8a724f99274c	2026-01-21 01:59:27.01	2026-01-21 01:59:27.01
cmkndkfl1004rwtowoqgzthqo	cmkncreca00e8wtwoq2zn2ifk	cmkncreca00e8wtwoq2zn2ifk	credential	\N	\N	\N	\N	read:users	\N	f3e77c42f17fa133c9682890b3a58b33:f331b461d7c840554ce63132a5301c9dc5637a9d2bcd0995a8cea90bb255ea5e4814ea8585df2088efff4aa853d9d5b1270881ea16f397c3bf4276dd834de2c6	2026-01-21 01:59:27.206	2026-01-21 01:59:27.206
cmkndkfq3004twtow70y6ccdi	cmkncrecn00eewtwot2tqp5yi	cmkncrecn00eewtwot2tqp5yi	credential	\N	\N	\N	\N	read:users	\N	0d1e62b12463e922e27eebcc8e8a101f:5617e757e2c350ba9e2dd2a2e5e24f8ca665a75d647d7ff66ca9b18d1f6111e384a3de8bcb25f257ac13195e1974c8eb0142aea6a4369a97d35f7f16affdcf74	2026-01-21 01:59:27.387	2026-01-21 01:59:27.387
cmkndkfwj004vwtowlzfcq1yw	cmkncrehj00ekwtwo248gj7xd	cmkncrehj00ekwtwo248gj7xd	credential	\N	\N	\N	\N	read:users	\N	3f55219ec6f9eb172ecf677ba6a97e17:b13843e5aa3528487a27bb4afddbdca44ebf600732af1284f2f0f619d2297e4fd480a4c285f4618bf4e159f20faae672c53dd9439a3df82bd9c349b5da521409	2026-01-21 01:59:27.62	2026-01-21 01:59:27.62
cmkndkg1g004xwtowzjxryfc3	cmkncrejb00eqwtwo1hyifcte	cmkncrejb00eqwtwo1hyifcte	credential	\N	\N	\N	\N	read:users	\N	f89dec1cbda03981568a254ba5be1d0c:166776440d8abd89dc085cca8581468055ecb71f6920bfae58281cfe9a0d4377bb3533a79740e58e009c5ac019d0153bb5ab58a96bc9affbbfb424f9760f0d14	2026-01-21 01:59:27.797	2026-01-21 01:59:27.797
cmkndkg9q004zwtown3yju52l	cmkncrek300ewwtwownl7wr1z	cmkncrek300ewwtwownl7wr1z	credential	\N	\N	\N	\N	read:users	\N	1f4215d7ba06756799618aaf0b1e1eb6:1b6e2b8f626e99e197ccb810eee0ca6803b6c2e55d04f59470ce437603a6fc29d4e53cc3163c021523dd16ae4b168ca0f1c607c211e5121f3af3c986fae624fb	2026-01-21 01:59:28.095	2026-01-21 01:59:28.095
cmkndkgeh0051wtowga5to4ev	cmkncrekq00f2wtwod6sanv0o	cmkncrekq00f2wtwod6sanv0o	credential	\N	\N	\N	\N	read:users	\N	d6f440f29301c1d6971a65ff654d5b13:d660122cc8470fd595ab6db9cb54411aac69970fccb7c2c1ea8f6740ea22ed4dec30169d2f4ea0fb493fdddafd6c47dc197e8957ad8d3a5f448f95538cc99b1c	2026-01-21 01:59:28.266	2026-01-21 01:59:28.266
cmkndkgnq0053wtowpqwyrvfd	cmkncrele00f8wtwod2ntn562	cmkncrele00f8wtwod2ntn562	credential	\N	\N	\N	\N	read:users	\N	76ff873877a6421c89ba7c201b5a63f7:7cdfc1cac6efac3faa9161ef53214a086d4c96e011335b0b60ba41e69ff5bd80a149d130bf31af02bd5c76b6d2a49808275007b941b83fe29d89394f0e6faba7	2026-01-21 01:59:28.599	2026-01-21 01:59:28.599
cmkndkgs30055wtowwtalc2fo	cmkncrelv00fewtwox08k5htf	cmkncrelv00fewtwox08k5htf	credential	\N	\N	\N	\N	read:users	\N	b062a9ba378ba19d145463dfa0fa466e:e84bb2289161fcf7e9628e50300df0ca0a474793fc391d85a97d5402bbfeabde16323d700ef3ce3525523687d2ca5b46c68ce0a92d7474bf4107bdb30b48baf9	2026-01-21 01:59:28.756	2026-01-21 01:59:28.756
cmkndkgxd0057wtowgv3x2365	cmkncremn00fkwtwou70x69en	cmkncremn00fkwtwou70x69en	credential	\N	\N	\N	\N	read:users	\N	b0f56c377757b42fd8d2547800926626:77c5b3438e86ff5f465d952549fe726572fd8e567cb772df67d356fe90ed0438b8c18120df6b24d6ccee61f946cf87df6000d1a991cd0bc45c1472ad17c1b7e9	2026-01-21 01:59:28.946	2026-01-21 01:59:28.946
cmkndkh560059wtowbuhgl4vn	cmkncremy00fqwtwo6wzeix76	cmkncremy00fqwtwo6wzeix76	credential	\N	\N	\N	\N	read:users	\N	5226be9ff3d8980af9c1c336738df0cf:3896555f8644dec5fff3576110a57dbd7edc972e5a7f35c68aa3e729312de425e57765d37cc5557dd9d3418322117ab949db1e695aad03e400128b79695bd790	2026-01-21 01:59:29.226	2026-01-21 01:59:29.226
cmkndkhcm005bwtowvu77pv87	cmkncrenb00fwwtwo00d9hzns	cmkncrenb00fwwtwo00d9hzns	credential	\N	\N	\N	\N	read:users	\N	1ec253256edd09923eb2d65c47c6a25f:15dad346574c53767a1901f03fe2a9abfccd684c10d05ac852fb08a36374e3d7749bf50afbf1eb8bde42d1b0b5ce31379195354017d662a7ef899ff7cfcf080f	2026-01-21 01:59:29.494	2026-01-21 01:59:29.494
cmkndkhjm005dwtow1beqi2f3	cmkncrenm00g2wtwocqtkrfid	cmkncrenm00g2wtwocqtkrfid	credential	\N	\N	\N	\N	read:users	\N	2cc5d9f6a0dfe4465473eb5cfea4eac2:0ef7b7e881d0bae77eeee6ae13d4e9dd287dc9e4b1d9b3b84684230a22efbef5b667a6e37e48aff85e49e703d1f6a5e42c0d37fccb4ea74acde2722ab8e3c5de	2026-01-21 01:59:29.746	2026-01-21 01:59:29.746
cmkndkhro005fwtowlft3wu5h	cmkncreo000g8wtwo2l6izqd5	cmkncreo000g8wtwo2l6izqd5	credential	\N	\N	\N	\N	read:users	\N	6f6f141f597186ce8d63b224bea9fa44:6de6de105eadcc71383363ccda92f6d282b9bc8732c6d1d2820cb4555a6686543b1504c0d1f5b7ac472bc4ee0b10f05378d273c627082d19ae3187e4ad08e5b8	2026-01-21 01:59:30.036	2026-01-21 01:59:30.036
cmkndkhyy005hwtowg14fk41g	cmkncreoa00gewtwocl3lmtgh	cmkncreoa00gewtwocl3lmtgh	credential	\N	\N	\N	\N	read:users	\N	2a989766a3c304775b30f97237991d00:b67d2c35ce34736c59eaeaaa962fd7bee632ff0d4a4f506f7f99d0402bf3cde3860581d0690eb65becd5adac36d603047b218dffd627ecccf72887b90a6dc17b	2026-01-21 01:59:30.298	2026-01-21 01:59:30.298
cmkndki5i005jwtowme4siyf7	cmkncreok00gkwtwoulhmbf0t	cmkncreok00gkwtwoulhmbf0t	credential	\N	\N	\N	\N	read:users	\N	6bff479339702fb563ab2d30bf3efa7c:9e3710c28fefd9dedbf831db48100e5cf2303668d2c48861f40d1d0a3473dc73c5404222c8993f4782f8e63f9f161e5991cf8aa8f96afba361361c3c98b5748f	2026-01-21 01:59:30.535	2026-01-21 01:59:30.535
cmkndkib6005lwtows8e2floo	cmkncreow00gqwtwofcae5dyh	cmkncreow00gqwtwofcae5dyh	credential	\N	\N	\N	\N	read:users	\N	5e0eb099715a3e8a2200881e6ee58d22:a0c3c5c181b1c8ceba9df81e67bddad391c6625d8e4b69399d899adf09bc3f9121339748ca06de88c346ad1eb460a958e788d2345e6a964cc16e08c3a63272f2	2026-01-21 01:59:30.739	2026-01-21 01:59:30.739
cmkndkig9005nwtowpjktntnk	cmkncrepe00gwwtwobx1wgcbw	cmkncrepe00gwwtwobx1wgcbw	credential	\N	\N	\N	\N	read:users	\N	6b39570abd82140a2d3d38ca11a4c671:7999f72737e970b177170b9ab22bfe66ee8849b20ab62782fbba78e8ca031c935efffb4474793286b434e802b4c3aabb5f6dcb4c5700b06ac2b3bdcdec46c79d	2026-01-21 01:59:30.922	2026-01-21 01:59:30.922
cmkndkior005pwtowgjcpndgo	cmkncreq700h2wtwo05qhvt8f	cmkncreq700h2wtwo05qhvt8f	credential	\N	\N	\N	\N	read:users	\N	66d752cc55178c21149bdb9222e8bdc8:04bac9e368e7efdbc4a38e9d919b4f12dd8dc8a0b926aafb4382f14d841c9538362f1fdb1772611b03d5013b31c9c3146258cbffb90751e361f8d27dc7758ad2	2026-01-21 01:59:31.227	2026-01-21 01:59:31.227
cmkndkiuz005rwtowkp2u4zpx	cmkncrer000h8wtwoc2c9t9bm	cmkncrer000h8wtwoc2c9t9bm	credential	\N	\N	\N	\N	read:users	\N	b38a4a874775eef2982419b85d5b65a5:f165a8d6a412eaf8fe77245e2909ab910edaa97730473dbb4e884adcc89fa2699bc95bc5a81f13b19836eb60cb5ecd79fae21bcd000b6fc0d01b9c5826170579	2026-01-21 01:59:31.451	2026-01-21 01:59:31.451
cmkndkj13005twtowj0xks8sl	cmkncrerp00hewtwozfli4kpi	cmkncrerp00hewtwozfli4kpi	credential	\N	\N	\N	\N	read:users	\N	c75edc7e0800517dd74828174ef865cd:7e4af8bf98ea1764eaa65c5375044dd4cb059e79a29f2f59cf780baf5fa6acdae3973f4ea81cae2d649652202ed2a4a82c736120d74442bc2a5abfc0b087b23a	2026-01-21 01:59:31.671	2026-01-21 01:59:31.671
cmkndkj6f005vwtowswh0bw2p	cmkncrevq00hkwtwoztp9azej	cmkncrevq00hkwtwoztp9azej	credential	\N	\N	\N	\N	read:users	\N	5f785e53431bac52f768a40782e9d95b:48ab63428c8567615364b11b68aad285ea8dfcad67497f403f5af597959491f41196663826a9901903a6b5253b6b1248eb02b3102ca12328fe1e9f7e79d4098e	2026-01-21 01:59:31.864	2026-01-21 01:59:31.864
cmkndkjda005xwtowjrbpdfnn	cmkncrevz00hqwtwock4bswv6	cmkncrevz00hqwtwock4bswv6	credential	\N	\N	\N	\N	read:users	\N	410765de05639cc8afd9e93d920d845c:1c84e7c4912daf3657c0dbf355a61adb34335258b2bbce2e2f4f9d1ae84eb1c9a53a7aba11a1ac5ad7664e4bd709c385ef20a15c63bfb07967eeae908d5c1b9a	2026-01-21 01:59:32.11	2026-01-21 01:59:32.11
cmkndkjjy005zwtowf9q5e676	cmkncrew800hwwtwoyjt84m24	cmkncrew800hwwtwoyjt84m24	credential	\N	\N	\N	\N	read:users	\N	be956dd11aba129d21032f6459138325:e1f87f65201c53b96511022b4d2a543dcd4567948ed09c5a80f22f250748e22710ddfab4f75894e567ff28f932fbb6626c85c577a5b7181ac368a01adb9f0ab5	2026-01-21 01:59:32.351	2026-01-21 01:59:32.351
cmkndkjug0061wtowsga4wcoi	cmkncrewi00i2wtwo6mqy68mf	cmkncrewi00i2wtwo6mqy68mf	credential	\N	\N	\N	\N	read:users	\N	e7364705a1f3a9bc4fd9d68a358efc63:28d5feb01dcf5a7234a67d5216e344b91ba89500f3f80b0c39ab280381f72a40afe3a18c1e48d153b8188f614a518c8c24fe30f060dfb701dc835e3ea7b335a8	2026-01-21 01:59:32.729	2026-01-21 01:59:32.729
cmkndkjzm0063wtowkqnh9g20	cmkncrewr00i8wtwo6cnaimyj	cmkncrewr00i8wtwo6cnaimyj	credential	\N	\N	\N	\N	read:users	\N	6db2acca277ae82f6568f3799b574d72:841e6e646b6c74e8999500f0a2dd66f7aadd83f5ac19eabcfe213cd9d4aef0ee1119f3680373a1a1550a603a3a2a90e0343f332b5432b8abc58bb5625be10c10	2026-01-21 01:59:32.914	2026-01-21 01:59:32.914
cmkndkk8z0065wtowznti3esm	cmkncrex200iewtwoj4uyvfhm	cmkncrex200iewtwoj4uyvfhm	credential	\N	\N	\N	\N	read:users	\N	c3c25cae6b01573c5196e996e19a811c:57339d9e06c7f1caceb1dbcbf49b6668abb9ff2d2c20316a5bc39815d1a388d9ea674f8c0402cd65d2ba3385863e5ac60fa2f9000ef9ecc90eb7f459a834aaac	2026-01-21 01:59:33.251	2026-01-21 01:59:33.251
cmkndkkdl0067wtowj4kq5ac7	cmkncrexa00ikwtwouioneuc1	cmkncrexa00ikwtwouioneuc1	credential	\N	\N	\N	\N	read:users	\N	412514341e8f1c29a5d631f13c26728e:b904ed2c4a8d0a6ef2fc947fe7cd480f43f13a6cc39460d4733a6b26f171c17938c8185ee33d4902950987d577a7cc09e2dc67c8158064adac7f7d84c1264ba0	2026-01-21 01:59:33.418	2026-01-21 01:59:33.418
cmkndkkmt0069wtowfkfk42xv	cmkncrexj00iqwtwowuhzeymc	cmkncrexj00iqwtwowuhzeymc	credential	\N	\N	\N	\N	read:users	\N	991cdace573ff54e0d4f184606a6af43:e977198215d5d452c95eba85b3f37e0b203213b500c0983ace96954cd7c56848b6ad0982358aa10a5a0e102428cb5dd342863314c53ae1a2ec7bebbe6e4da159	2026-01-21 01:59:33.747	2026-01-21 01:59:33.747
cmkndkksf006bwtowk30v7ati	cmkncrexu00iwwtwoqib24wf2	cmkncrexu00iwwtwoqib24wf2	credential	\N	\N	\N	\N	read:users	\N	d3e11bc3b0e7a16278b8aaa1aeb33299:468240678af87e8477c1f53a2a6e714fbd8f1b8ab8bfd8c5f6de365812208d4d7f6aace1d425737a9e177a49dfb1be863420788dca088aadbfcffb195dcffc78	2026-01-21 01:59:33.951	2026-01-21 01:59:33.951
cmkndkkx9006dwtowylhqhzea	cmkncrey300j2wtwokhp5vquv	cmkncrey300j2wtwokhp5vquv	credential	\N	\N	\N	\N	read:users	\N	1910adb2970108edaa7bbce68e588da5:21db9ff419dba554ba3aab19de29ade0648ac8b23b47e4ee8586f3c2cc9fec6dd8a5c7505fce57384f263db645fc8d5f707854d5be6b0ea6cb399c59ffd24bf1	2026-01-21 01:59:34.126	2026-01-21 01:59:34.126
cmkndkl6n006fwtow9ot2yvg9	cmkncreyf00j8wtwo0fqld060	cmkncreyf00j8wtwo0fqld060	credential	\N	\N	\N	\N	read:users	\N	7df371b3658ff09ad7db7a17f07fa625:27fbc3827eafe195c1cb342ba48d5414e7d767b96444e66b5c37ec291a8eaeba933125d8bc2a4a1fb0081023b19a56a26df4d237a12e86b6144f2925b372ac2d	2026-01-21 01:59:34.464	2026-01-21 01:59:34.464
cmkndklb5006hwtowog5szmwk	cmkncreyu00jewtwo6ff3rxfe	cmkncreyu00jewtwo6ff3rxfe	credential	\N	\N	\N	\N	read:users	\N	4e391c51bc40add9976e570fc69d98f1:685ff3361bd9a1ca67974f1e7e94f67e80a989064af0fc89009a6d53192a26772a8caed068727bb61fb0b2ca70f9a7d2666eb17714cba9f681125f42956670ab	2026-01-21 01:59:34.625	2026-01-21 01:59:34.625
cmkndklkb006jwtow78cnsj7g	cmkncrf0b00jkwtwod91fh92n	cmkncrf0b00jkwtwod91fh92n	credential	\N	\N	\N	\N	read:users	\N	239e62fb7799e4d1616329e91681cc89:bd8d7ebb21ebb69fc09c177c4972c8067b11156fa246acac3b9437f7891db4e42b7308d5dd877d41ef7bceb8d2397ad97d8c0c5bb6494a7b81c44a3fa038bce7	2026-01-21 01:59:34.956	2026-01-21 01:59:34.956
cmkndklpm006lwtow6s3lnr3r	cmkncrf0j00jqwtwoco8s7qed	cmkncrf0j00jqwtwoco8s7qed	credential	\N	\N	\N	\N	read:users	\N	95e62182cbcd7ef1915070d6661df0d8:f891ffda6d573691bb882218824510e72b4d1d14ff1474fd197c0049fd4838565c2638a5b1a8dbb35700750701b0ac17b59419891a5860d4fa1880db98e74e6a	2026-01-21 01:59:35.146	2026-01-21 01:59:35.146
cmkndklyn006nwtowh0c6mb5e	cmkncrf0s00jwwtwokyswpxam	cmkncrf0s00jwwtwokyswpxam	credential	\N	\N	\N	\N	read:users	\N	eb868dbc0fda074cc60a0b6a10130439:06a771a21b3965d9c9394f68c33c5fd228031a2582aee14d6cbc7c73f6ccffb50e6e92295f32ee669aadc83f1c9d338007cc7c5f0bc3e4acfd0cc871e663fb5a	2026-01-21 01:59:35.472	2026-01-21 01:59:35.472
cmkndkmdg006pwtowz55pvbug	cmkncrf1100k2wtwolgdc9x9k	cmkncrf1100k2wtwolgdc9x9k	credential	\N	\N	\N	\N	read:users	\N	9ff021adbc68821cc18bad667076da1e:c1943edadd202ab0fe2c3267e1a8fe5fc1b9294e70b26bb0be2c13b60c60b777dedf01c089817860a0952da2b9c8c39aeca7a7f06d933dcdd142fea866508858	2026-01-21 01:59:36.005	2026-01-21 01:59:36.005
cmkndkmm4006rwtowjfq3jxe4	cmkncrf1c00k8wtwoi9glg4qw	cmkncrf1c00k8wtwoi9glg4qw	credential	\N	\N	\N	\N	read:users	\N	c569eb1a7fa908d1ec970618311fda93:352837cbfdf534f2f7b1c2fe99f9a883b3ae5a7f8eac9dda214be273d7f704ba027acd4370d2d92ab95a27776759e928ea1907bb5b24b41a391a4b766139cd6d	2026-01-21 01:59:36.316	2026-01-21 01:59:36.316
cmkndkmrr006twtowwy8rhoj2	cmkncrf7d00kewtwoypyyxt84	cmkncrf7d00kewtwoypyyxt84	credential	\N	\N	\N	\N	read:users	\N	dd0d87192f2e45c03971a8ab79134880:1917a7d378e99ada0a257cf6b224526afc80c80fd2c46651b6096c95d17a4b193d205694c9ed9c2705e5cbf16c8623278357be21862b291523c53bb2953aac2c	2026-01-21 01:59:36.519	2026-01-21 01:59:36.519
cmkndkmwv006vwtowt6357wfe	cmkncrf7x00kkwtwowajpjzu0	cmkncrf7x00kkwtwowajpjzu0	credential	\N	\N	\N	\N	read:users	\N	95ecabf92e50f6cfc65c35c9096ee1ea:e4d8cb2a7c6622cd83ef3bd9a8dd65a2f5f1937bfb1f4d196f520e36c8f3b054531b0b30e35d2f10069eb3f69ac77676cb87632f14f98aaf21f297cf3c22cfc6	2026-01-21 01:59:36.703	2026-01-21 01:59:36.703
cmkndkn7c006xwtowq2id9nnv	cmkncrf8500kqwtwoy5zt7lvb	cmkncrf8500kqwtwoy5zt7lvb	credential	\N	\N	\N	\N	read:users	\N	0348d0bc6d15a06d81fa8ebefbfc1930:6978616232ef73e64cdc64d7f0381459165223ed9a6709677a7ec98ce6119d84ec405950eac02485283fef75b74aecca4077399fa19f1c41af5c76757ce15729	2026-01-21 01:59:37.08	2026-01-21 01:59:37.08
cmkndknc6006zwtowbzyclzzn	cmkncrf8f00kwwtwof76elslp	cmkncrf8f00kwwtwof76elslp	credential	\N	\N	\N	\N	read:users	\N	43c2d7c9252704e1ff925cf32ed1e3d5:78b7b2791ea109fcc5b3d7380af712426788c683918d78d6e409fc06dfc1ef775dfabc3e1c0e8309d5c1d08ac546783ed77c549f19f46ce12d8c46a55c3f75a5	2026-01-21 01:59:37.255	2026-01-21 01:59:37.255
cmkndknh50071wtowawil0d5f	cmkncrf8y00l2wtwo0ek3al8j	cmkncrf8y00l2wtwo0ek3al8j	credential	\N	\N	\N	\N	read:users	\N	6e1fdb5739564ed5079359abe6153625:15e6e8d80d9d4f9bb6115f4bd73ce56fea5cc953e770059204d27a01b157bc9d26d7c8199759ec464fd6f808a61305b7f76bac6c3cae5b294cfb9575113c8d67	2026-01-21 01:59:37.434	2026-01-21 01:59:37.434
cmkndkns60073wtowejg11j7d	cmkncrfax00l8wtwo1oe3u7hj	cmkncrfax00l8wtwo1oe3u7hj	credential	\N	\N	\N	\N	read:users	\N	00606c7f20b6f9486d5f593de336d81c:cbec3a88fb87f6bbe3c6f176fd37a3a182bdb7ea4c0a9fd7e12b79c9cacc1e2ba9e4fc11ad046c74b29094ee1b712042456a1d9d1d4d4e5ef3c3a7bdf74d976e	2026-01-21 01:59:37.83	2026-01-21 01:59:37.83
cmkndknx40075wtowc03xw94j	cmkncrfba00lewtwo275x6ztd	cmkncrfba00lewtwo275x6ztd	credential	\N	\N	\N	\N	read:users	\N	5213abd76c18d7a4fe7de48d1658abb9:764ae70d814fe08bcc807806f5b5c261591716db82006fd161132b67906089ef237c72f25aa363c4166b71743eb162c080bbe942200333d1c7b4469a8208de9f	2026-01-21 01:59:38.009	2026-01-21 01:59:38.009
cmkndko8v0077wtowqnmmuenq	cmkncrfbl00lkwtwoh1uspm1e	cmkncrfbl00lkwtwoh1uspm1e	credential	\N	\N	\N	\N	read:users	\N	3cd20ae58343b3c4dca96a2b70e53dd6:7394c0d51c90a005b7936e6b768233bbdfa8471e9b260447762a462f8265312822b836c598eb9afe0630f4b3876e7153eb34f0469f3e6202cb2d6bb3439269f2	2026-01-21 01:59:38.431	2026-01-21 01:59:38.431
cmkndkofn0079wtowmet2pi75	cmkncrfca00lqwtwofxd0dzbh	cmkncrfca00lqwtwofxd0dzbh	credential	\N	\N	\N	\N	read:users	\N	01d3f7bb8daed118a3626887a84369cf:c2f7a3a93de700a4e492ab358f8ee4be92e056a2f1b2c6de34b0b1d88403f0f8f22996134f43ab6e85360cb15b0c5fd2d2cec684728f6736080a11d4bbfc9f7c	2026-01-21 01:59:38.675	2026-01-21 01:59:38.675
cmkndkoqs007bwtowddd8cc7f	cmkncrfcl00lwwtwo5r8q0wxd	cmkncrfcl00lwwtwo5r8q0wxd	credential	\N	\N	\N	\N	read:users	\N	51c995220bee946ca3b950705083a3ee:15ef582390b6836b6f44597ad13678779a2d38064ea4935a352baf9de20a756ae9149425078e9e7c7291fd3c596249bc995f9d18371fc671420b03ad04b9b4d6	2026-01-21 01:59:39.076	2026-01-21 01:59:39.076
cmkndkowx007dwtow66fp1zjm	cmkncrfdp00m2wtwod04ajujo	cmkncrfdp00m2wtwod04ajujo	credential	\N	\N	\N	\N	read:users	\N	c34c91acb428fe041ff487d98e5f1cb7:f4923bdcbb49ffad171136680b0825bbce12b7c0101c7d333102235470d81497fb8473192ebecf05ac04346145b7fc29023338fa1d0bb5932b43fb662a96a976	2026-01-21 01:59:39.298	2026-01-21 01:59:39.298
cmkndkp8x007fwtoww8u728ga	cmkncrfe100m8wtwo0l1j8mub	cmkncrfe100m8wtwo0l1j8mub	credential	\N	\N	\N	\N	read:users	\N	0eb61f04796f95e976eae3d773019767:6827546943a8d92a9b096ee96e3b91772cd84059dcb4752f4619439cc215046ff8cc6abd5a2aa8ffb400bf77d9abc7ba57186510fdbd8a2212498ad6c4e5337c	2026-01-21 01:59:39.729	2026-01-21 01:59:39.729
cmkndkpff007hwtowl4e909c6	cmkncrfea00mewtwo2uhaxmm5	cmkncrfea00mewtwo2uhaxmm5	credential	\N	\N	\N	\N	read:users	\N	7cf90c0217d701b6bdeb341217c3182d:994edd44faddf56a7cdc1b366f0b40ac747f954933e22f05d1d32a4379b62a9075bf564b5ae1e60cd04dae3a79b592d6c0f7b0f4f3e4eac1d30a1b75b16fd470	2026-01-21 01:59:39.964	2026-01-21 01:59:39.964
cmkndkpq1007jwtowuiyaf3z6	cmkncrfej00mkwtwop11c5t87	cmkncrfej00mkwtwop11c5t87	credential	\N	\N	\N	\N	read:users	\N	bc315c721379432914d23c3696370017:eac0339f1f170fb6c1664c9220be37558e04a254793c840299dbb3d07af4ddbd7fbb74c1a1305ebaecc0bad96a7abad338b23a598ec91a72862e5ad6846ef473	2026-01-21 01:59:40.345	2026-01-21 01:59:40.345
cmkndkpvm007lwtow9o8jg9vx	cmkncrfey00mqwtworv35qqn4	cmkncrfey00mqwtworv35qqn4	credential	\N	\N	\N	\N	read:users	\N	94a338bc68fbc16e05fc82d9b85b52af:f2d14e61158bfbf22056a291eadf0f4f78d4ebb0e595f2de8f5659c91005f62c8217b2b7ad1fac604a4805bb4203327eb2b887615371231c8de8afff89708fd6	2026-01-21 01:59:40.546	2026-01-21 01:59:40.546
cmkndkq5p007nwtowmum3i221	cmkncrffe00mwwtwo6jxpwjp5	cmkncrffe00mwwtwo6jxpwjp5	credential	\N	\N	\N	\N	read:users	\N	35c8d46f1aeceb91d088f24c81c999e1:75d47d3eeb04949ff053cee5a48ce7e1f14517949c71721e18f815a9fc2f5eda1d297a6450df4f8092b121a43e461ae828aed10e800d56220ca492c43de5e29d	2026-01-21 01:59:40.91	2026-01-21 01:59:40.91
cmkndkqe5007pwtow5hi23vs0	cmkncrffs00n2wtwon0x8jstj	cmkncrffs00n2wtwon0x8jstj	credential	\N	\N	\N	\N	read:users	\N	d65aebee59dc67cf430a0c9f8ac36831:945a094715dff8a5bd43b14b0edba4d6d1a51cdbb2e47f483e545ff485a08537e7fc1e31c6725e7301b60c07ed665627271213f3ef645ecf77345d35e76fd5a7	2026-01-21 01:59:41.213	2026-01-21 01:59:41.213
cmkndkqjm007rwtow45zy76st	cmkncrfg500n8wtwourc44o8p	cmkncrfg500n8wtwourc44o8p	credential	\N	\N	\N	\N	read:users	\N	1bfed16cad44b2248879fdda89e6df24:5a5bc3c352ba68bb052c1c09e05c2eb4f4f5c4af8df56d0d735a8cc86b4b9801c285699f05c91d88320c89d1ebbb223edd1a9c556971c5383cb0770e0c698b0e	2026-01-21 01:59:41.41	2026-01-21 01:59:41.41
cmkndkqvr007twtowa784iwjy	cmkncrfgt00newtwo84pnpm7e	cmkncrfgt00newtwo84pnpm7e	credential	\N	\N	\N	\N	read:users	\N	48def5c66da7cb7bbabf33568ccc7299:2f259dd6dcfdfc6f3f03f56a3d477bce4c792777feef58d6f64d0b7196e082109e3f8b8ca79e836532e4cf3f73ba9971408f7e470d0b930be96f9fa0a0f3d301	2026-01-21 01:59:41.847	2026-01-21 01:59:41.847
cmkndkr10007vwtow2vcqa1sv	cmkncrfha00nkwtwoklohhru1	cmkncrfha00nkwtwoklohhru1	credential	\N	\N	\N	\N	read:users	\N	5eeba760b88108bd96885a0954a2f4d4:12cc0aff0f35269a1ca56745ef0828d82e8b3aa39ceb1d64fa7f0b6f8adca62959ef89ad5ea2eddad10d153e5f9b7f273115fc9d223937dc566124dca2c20751	2026-01-21 01:59:42.036	2026-01-21 01:59:42.036
cmkndkr6s007xwtow159pqa9e	cmkncrfhk00nqwtwovzuuedj6	cmkncrfhk00nqwtwovzuuedj6	credential	\N	\N	\N	\N	read:users	\N	80ceb63d3d56f938577a5db4c99563c6:37f828588e82fef74b554b441f4e0a608f9ef8778f33bc635d8a0a3f57d03f08a0a5d6e37258a8e9f1c7c709ef619c2c9cb8b37c4e7536488ca0ed2dbb1ab7ad	2026-01-21 01:59:42.244	2026-01-21 01:59:42.244
cmkndkrf2007zwtowpunsupi6	cmkncrfht00nwwtwoj6qepu7x	cmkncrfht00nwwtwoj6qepu7x	credential	\N	\N	\N	\N	read:users	\N	9cfeee2c7bac46995ce9995671ffb467:921769a4cbb7990d17b3bb4fee87f43eb2804392c356cc251bf0f5df6bb20ef5fd74ee5eb2094d3d45bae9a2b03f2adf0eae5e69fbe5818b1dd638469ab749ce	2026-01-21 01:59:42.542	2026-01-21 01:59:42.542
cmkndkrm00081wtowlct9h1aq	cmkncrfi400o2wtwo85mfunm5	cmkncrfi400o2wtwo85mfunm5	credential	\N	\N	\N	\N	read:users	\N	84da7ff056265d9ba52cd2cac2610bbc:65ab250eef5d741ff14bcc0ee8dc4e53506da61d3da389201314cfff62975e88e2078bb711dd8b80962590a05fd5436f1f0f05650533c6f715c1b897203bb7fe	2026-01-21 01:59:42.792	2026-01-21 01:59:42.792
cmkndkrs40083wtowwafx3msq	cmkncrfik00o8wtwo11zipgsc	cmkncrfik00o8wtwo11zipgsc	credential	\N	\N	\N	\N	read:users	\N	3a609298fc853a8ef4e859a03b4db75f:107273d15f9009e29cf3c105bf16afdeb5a0b36c7372629f1065db6954ffcfa7f12b5d9174d51ae981be26292251361c8d904abe21702d33dcce15dbda10c4d3	2026-01-21 01:59:43.012	2026-01-21 01:59:43.012
cmkndks0n0085wtownjut3vf5	cmkncrfit00oewtwoa2zoztjz	cmkncrfit00oewtwoa2zoztjz	credential	\N	\N	\N	\N	read:users	\N	1556f1c1c30ddadc64b4365efbb916b0:87092c9596310db9148008b90e997c402cf1363b188f6119f9a83ecba9e40e6c97825cb2fa43a2ff93f0917d4517458c5da937c3f6aa84e255b345e881b8fb7b	2026-01-21 01:59:43.319	2026-01-21 01:59:43.319
cmkndks670087wtowld0e1anv	cmkncrfj700okwtwo744ujxtr	cmkncrfj700okwtwo744ujxtr	credential	\N	\N	\N	\N	read:users	\N	7b7a011cc4481e944d08491e3cbb47e1:27d59fbb52897b8abccbf1ae5c11fd6ddd50da30ee8fd19cfceb51278ea5c327b6a1038ccf88514b1d35602509d0545d1760e351a95a893a25679792e00b3dee	2026-01-21 01:59:43.52	2026-01-21 01:59:43.52
cmkndksb20089wtowzqm63p39	cmkncrfji00oqwtwosm0hn4rf	cmkncrfji00oqwtwosm0hn4rf	credential	\N	\N	\N	\N	read:users	\N	d15b28f4c559fd1d92667e7e06372b89:6d2210624bde8e690c0d95ba888719d8503c83bcb745a7fff4948637d1c99a542b532edbc8d3f14482dbd641a29e3b8bffc929bd2ba1153b9dc9576dc9b4eed9	2026-01-21 01:59:43.694	2026-01-21 01:59:43.694
cmkndksh4008bwtowmrebdquw	cmkncrfjw00owwtwoh89u756b	cmkncrfjw00owwtwoh89u756b	credential	\N	\N	\N	\N	read:users	\N	a614e435b6a41c810bff04af60fe5597:28728ad7f25001c8c9155a95e73c2525802f359194914e7cec8e9b3436bd9a7c04831b6124991ca6b99795c481bf6f535bb5ef4e05d6b9ef5908d56d9f8b8d1f	2026-01-21 01:59:43.913	2026-01-21 01:59:43.913
cmkndksnr008dwtowordu7k7a	cmkncrfkj00p2wtwo4qe8yd33	cmkncrfkj00p2wtwo4qe8yd33	credential	\N	\N	\N	\N	read:users	\N	fe3048506e3e86988dcf88e38919c3ca:442a14b00b1788819cfdb98b9e901b8e95a8d07c45d63d981377b95914515e477931569ed82231bb89652a1bf06d8a030fa99598236de483c72e1196f8ff2bff	2026-01-21 01:59:44.151	2026-01-21 01:59:44.151
cmkndksvk008fwtow55q9cap5	cmkncrfl000p8wtwolbvs8zan	cmkncrfl000p8wtwolbvs8zan	credential	\N	\N	\N	\N	read:users	\N	081750a9241b20b4b50cc5cf9d0abe80:c8159e874b3f14eb0e583319819aa1563e680f62f5c055b90c29cf56e67320de0da6a480e570222626c6bb37e9b63e873ac3eee6896cbefa58e7e3521300b548	2026-01-21 01:59:44.432	2026-01-21 01:59:44.432
cmkndkt07008hwtow968lu0mt	cmkncrfla00pewtwo2eq524u7	cmkncrfla00pewtwo2eq524u7	credential	\N	\N	\N	\N	read:users	\N	c9624306b9982a49555cc972e82dc000:0d963967e8e1e807105c537a591bf4031dedbda4d5a1bcdd81a08418a0be52fb6b7b5d27368510a2830fb9e02d06855629433911a251e737137f3955af855c36	2026-01-21 01:59:44.599	2026-01-21 01:59:44.599
cmkndkt96008jwtowh1viy1uz	cmkncrflj00pkwtwox9kqk6cq	cmkncrflj00pkwtwox9kqk6cq	credential	\N	\N	\N	\N	read:users	\N	3d2b50543ccece5b5fc34817e838c988:83852e6c0a2028fad70daf0bf9ee163b7c93ea96f23a6471067645aceacb554831e720195d1de88d75c90ac63edd156e8d81f98a670e8f2af61df02a1c6d5f8f	2026-01-21 01:59:44.922	2026-01-21 01:59:44.922
cmkndktef008lwtow5g0di4v3	cmkncrfly00pqwtwop438mbw3	cmkncrfly00pqwtwop438mbw3	credential	\N	\N	\N	\N	read:users	\N	7d5467977895bb41579128e7fb779834:7f08d38e53c9ff38782e83c4449111da3e23095f86cd02754eded49a2d3885c68b509edd6976d272c06d2af90f231eff68b310436c1eb11c82659d09297aff42	2026-01-21 01:59:45.112	2026-01-21 01:59:45.112
cmkndktjg008nwtowlqu4nuob	cmkncrfmo00pwwtwoxy7pm14e	cmkncrfmo00pwwtwoxy7pm14e	credential	\N	\N	\N	\N	read:users	\N	0e4dd1e22c1f66f3c3ea0a888d5f3a86:8d7d9df95555b4de34b14267712931a39b16b8a80c3e19675e1918c08605912051e4ff947dbb03265f0971524324daa6d6c5c425028eeb8faa786fdd68d3ed90	2026-01-21 01:59:45.292	2026-01-21 01:59:45.292
cmkndktro008pwtow4mz9zkge	cmkncrfn700q2wtwogpsgqd8y	cmkncrfn700q2wtwogpsgqd8y	credential	\N	\N	\N	\N	read:users	\N	599c6966a51901026f51747242556649:3c036d0ea6f6812315bb8e80cf057b99817b7d2e06b9027dcdb18876cfcb28371f6be8698c76d02c9f74469a126a92d4f4050845f6293d045501e42a290b6265	2026-01-21 01:59:45.588	2026-01-21 01:59:45.588
cmkndktwm008rwtowo9eop00j	cmkncrftx00q8wtwotinieya6	cmkncrftx00q8wtwotinieya6	credential	\N	\N	\N	\N	read:users	\N	866e000b344513ac9d1911e1d4aa195f:8938d61c4dc0e2d3de5e734f9cb7497aed9873f9ccca4bbbf58c42b44bfdd3390901a3f62d40e92b5ee6b6ab6ed072dcbc588dde1923a1fadc1a79a911e879ed	2026-01-21 01:59:45.766	2026-01-21 01:59:45.766
cmkndku1l008twtowb9mh1kb0	cmkncrfwq00qkwtwou2ir2nkb	cmkncrfwq00qkwtwou2ir2nkb	credential	\N	\N	\N	\N	read:users	\N	e6817d3ddd42c23ddbbdb4bfab286507:0d429149493f1bd6159f999e1a4abfc4bd6010e7a9982e42e0358b8f1227a68f85d52345551078cace73193a3546bd600f36aaec8fa3776e0a748346c70a5cb4	2026-01-21 01:59:45.945	2026-01-21 01:59:45.945
cmkndkubl008vwtowr5gk09oy	cmkncrfxj00qqwtwo76lww988	cmkncrfxj00qqwtwo76lww988	credential	\N	\N	\N	\N	read:users	\N	c0951908de06a91f6bc9f5c76fee1c1f:0742b36d139103c8afe2fcb98eb3d457cf28d502441e43c7f9d0af5c429577ef24f25d0f4f3489d8eabb7aaed32a0688f4de100c690c4f01b22f1459270f3a0d	2026-01-21 01:59:46.305	2026-01-21 01:59:46.305
cmkndkuhb008xwtow94tpavw0	cmkncrg0800qwwtwog6pdyq1j	cmkncrg0800qwwtwog6pdyq1j	credential	\N	\N	\N	\N	read:users	\N	e6486542620006a42ca32ce7721a5cd1:cbdff3b57aa3537cf7db0c93d4ed95f215e9e50c28dd32f210a841a0538a7c5597785f9634e777b862595c91102f95e9a852c095ba216b18c42a7d3131efd2b6	2026-01-21 01:59:46.512	2026-01-21 01:59:46.512
cmkndkumn008zwtowl06xue8j	cmkncrg0k00r2wtwouce7uqw9	cmkncrg0k00r2wtwouce7uqw9	credential	\N	\N	\N	\N	read:users	\N	0e1ca245d058eb35868eac777e3620bf:6ea423b8dcffa2a9ab8f7a12c79ae4e1172cf3ea486b3a842b601bab59ace9de99f8e3bc72bce5220c25c27dd1854461f68396dc2c4d2eb0839f55d3f1818407	2026-01-21 01:59:46.703	2026-01-21 01:59:46.703
cmkndkusx0091wtow3yhyp1rg	cmkncrg1100r8wtwo0668kqd5	cmkncrg1100r8wtwo0668kqd5	credential	\N	\N	\N	\N	read:users	\N	da257b64eca68d527b0dd6bde71300cf:1068b24543d2f749a1906b076445f8ae4181511de421664b25d6f07f1107a3427347e39a1bac67120fa1f6ec5eaf127d40e8d244d891eaf16f008f9a1af4703f	2026-01-21 01:59:46.93	2026-01-21 01:59:46.93
cmkndkuzu0093wtow2kxm0t6c	cmkncrg2a00rewtwo82kapdpd	cmkncrg2a00rewtwo82kapdpd	credential	\N	\N	\N	\N	read:users	\N	43aff43a1195844b3794a9788407c4ff:be0eebdd61b9341673159bf5791aed91a96f59ec2ef2e655054924acb256960fb99b7e8dffa066aec7486e791715822d653cdeb5bb8b637eac06798e78497e88	2026-01-21 01:59:47.178	2026-01-21 01:59:47.178
cmkndkv7g0095wtow9ypbet66	cmkncrfus00qewtwozf5t41am	cmkncrfus00qewtwozf5t41am	credential	\N	\N	\N	\N	read:users	\N	41eacad98a65bfdf70aae9b47045edf3:30b9db40fea9a009d245a6ec0fc62a7d535177f14759414972425d488840960cb116fa177c373edf0888f97a367eb4e130df492b7bd8b341e8ba47cee58fdb38	2026-01-21 01:59:47.452	2026-01-21 01:59:47.452
cmkndkvdp0097wtow1qc6yws8	cmkncrg3v00rowtwoerjqrlp1	cmkncrg3v00rowtwoerjqrlp1	credential	\N	\N	\N	\N	read:users	\N	08115e2e556ba44b037dd0dca76c07dc:13e23e0c21c493209ff30a4b2784de595ab3910d15e0467e17d18e76d895e06dbb3c25e75ece5ade94a6369e758742eff4257e3f9e98dcf257e39908ac8aa2f0	2026-01-21 01:59:47.677	2026-01-21 01:59:47.677
cmkndkvix0099wtowuki0q7bu	cmkncrg4q00ruwtwoip0ky6cn	cmkncrg4q00ruwtwoip0ky6cn	credential	\N	\N	\N	\N	read:users	\N	529aa86be50a5a7f3187a84fa6ff5e39:dc877653f64dbd63b158d20f233f2b2bc797b88d6cf68cf89ccb6e29cd685363255099c3842eedbf702bc264e70dfd380cd0ec60118fa0c8f8fa1ef672810387	2026-01-21 01:59:47.865	2026-01-21 01:59:47.865
3XiKXiK21OB8B59ueAkVnxdWJous6ofH	3dy7Zx6HOcNfjftmqAJ2Gy9UOuuWzIkQ	3dy7Zx6HOcNfjftmqAJ2Gy9UOuuWzIkQ	credential	\N	\N	\N	\N	\N	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-17 01:54:39.136	2026-01-21 02:02:14.86
cmkndo0yi0001wtu0byyy21mm	cmknczvoi000awt5ve02adbh0	cmknczvoi000awt5ve02adbh0	credential	\N	\N	\N	\N	read:users	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-21 02:02:14.874	2026-01-21 02:02:14.874
cmkndo0yl0003wtu0zc8zwsyw	cmknczvp8000fwt5vkdjkjd26	cmknczvp8000fwt5vkdjkjd26	credential	\N	\N	\N	\N	read:users	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-21 02:02:14.878	2026-01-21 02:02:14.878
cmkndo0yo0005wtu0pskg93h3	cmknczvpm000kwt5v75tdm739	cmknczvpm000kwt5v75tdm739	credential	\N	\N	\N	\N	read:users	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-21 02:02:14.88	2026-01-21 02:02:14.88
cmkndo0ys0007wtu0ejvtls5h	cmknczvpv000pwt5v6jlauuta	cmknczvpv000pwt5v6jlauuta	credential	\N	\N	\N	\N	read:users	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-21 02:02:14.885	2026-01-21 02:02:14.885
cmkndo0yw0009wtu08xq8vuvl	cmknczvq3000swt5vdb397dp0	cmknczvq3000swt5vdb397dp0	credential	\N	\N	\N	\N	read:users	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-21 02:02:14.888	2026-01-21 02:02:14.888
cmkndo12j000bwtu0h2hbo1i4	cmknczvqc000xwt5v9zaa7bv2	cmknczvqc000xwt5v9zaa7bv2	credential	\N	\N	\N	\N	read:users	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-21 02:02:15.019	2026-01-21 02:02:15.019
cmkndo12m000dwtu0m5ozgca2	cmknczvsw0012wt5vytli75eu	cmknczvsw0012wt5vytli75eu	credential	\N	\N	\N	\N	read:users	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-21 02:02:15.022	2026-01-21 02:02:15.022
cmkndo12o000fwtu0f9pu35sz	cmknczvyf001bwt5vmu85xqcu	cmknczvyf001bwt5vmu85xqcu	credential	\N	\N	\N	\N	read:users	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-21 02:02:15.025	2026-01-21 02:02:15.025
cmkndo12y000hwtu0m3cefe45	cmknczvyq001gwt5vgphiqwl3	cmknczvyq001gwt5vgphiqwl3	credential	\N	\N	\N	\N	read:users	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-21 02:02:15.034	2026-01-21 02:02:15.034
cmkndo134000jwtu018xan4cs	cmknczvyx001lwt5v921qyil5	cmknczvyx001lwt5v921qyil5	credential	\N	\N	\N	\N	read:users	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-21 02:02:15.04	2026-01-21 02:02:15.04
cmkndo137000lwtu0xhzxcgew	cmknczvz9001qwt5v3r96aiam	cmknczvz9001qwt5v3r96aiam	credential	\N	\N	\N	\N	read:users	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-21 02:02:15.043	2026-01-21 02:02:15.043
cmkndo13a000nwtu0pve0bdbu	cmknczvzh001vwt5vp68uh6pw	cmknczvzh001vwt5vp68uh6pw	credential	\N	\N	\N	\N	read:users	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-21 02:02:15.046	2026-01-21 02:02:15.046
cmkndo13d000pwtu08cvjwmki	cmknczvzo0020wt5vg25rl83l	cmknczvzo0020wt5vg25rl83l	credential	\N	\N	\N	\N	read:users	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-21 02:02:15.049	2026-01-21 02:02:15.049
cmkndo13f000rwtu05zwbx50o	cmknczvzw0025wt5vio1jn1ie	cmknczvzw0025wt5vio1jn1ie	credential	\N	\N	\N	\N	read:users	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-21 02:02:15.052	2026-01-21 02:02:15.052
cmkndo13k000twtu08uay0qzu	cmknczw0b002cwt5vxm2nl753	cmknczw0b002cwt5vxm2nl753	credential	\N	\N	\N	\N	read:users	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-21 02:02:15.056	2026-01-21 02:02:15.056
cmkndo13n000vwtu0csije9xp	cmknczw0j002hwt5vh162sv7a	cmknczw0j002hwt5vh162sv7a	credential	\N	\N	\N	\N	read:users	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-21 02:02:15.06	2026-01-21 02:02:15.06
cmkndo13q000xwtu0cfcpkulb	cmknczw0s002mwt5vuobsbvep	cmknczw0s002mwt5vuobsbvep	credential	\N	\N	\N	\N	read:users	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-21 02:02:15.062	2026-01-21 02:02:15.062
cmkndo13t000zwtu0uold66n1	cmknczw1k002rwt5vn3ra5gfw	cmknczw1k002rwt5vn3ra5gfw	credential	\N	\N	\N	\N	read:users	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-21 02:02:15.066	2026-01-21 02:02:15.066
cmkndo13w0011wtu0dzkozv0c	cmknczw23002wwt5vne8rs7p8	cmknczw23002wwt5vne8rs7p8	credential	\N	\N	\N	\N	read:users	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-21 02:02:15.069	2026-01-21 02:02:15.069
cmkndo1400013wtu0kifc13dy	cmknczw2a0031wt5vudmxq4o5	cmknczw2a0031wt5vudmxq4o5	credential	\N	\N	\N	\N	read:users	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-21 02:02:15.072	2026-01-21 02:02:15.072
cmkndo1450015wtu00zlitv2i	cmknczw2i0036wt5vweoto4vx	cmknczw2i0036wt5vweoto4vx	credential	\N	\N	\N	\N	read:users	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-21 02:02:15.077	2026-01-21 02:02:15.077
cmkndo1470017wtu0fjhbru25	cmknczw2p003bwt5vfkewkc67	cmknczw2p003bwt5vfkewkc67	credential	\N	\N	\N	\N	read:users	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-21 02:02:15.08	2026-01-21 02:02:15.08
cmkndo14c0019wtu0oxc567v8	cmknczw2t003ewt5v82cfjgpo	cmknczw2t003ewt5v82cfjgpo	credential	\N	\N	\N	\N	read:users	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-21 02:02:15.084	2026-01-21 02:02:15.084
cmkndo14g001bwtu0emmkceib	cmknczw35003lwt5vr5a4o3fg	cmknczw35003lwt5vr5a4o3fg	credential	\N	\N	\N	\N	read:users	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-21 02:02:15.088	2026-01-21 02:02:15.088
cmkndo14j001dwtu0d51buwfe	cmknczw3e003qwt5v7vnq9z3l	cmknczw3e003qwt5v7vnq9z3l	credential	\N	\N	\N	\N	read:users	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-21 02:02:15.092	2026-01-21 02:02:15.092
cmkndo14n001fwtu0z8vv3moe	cmknczw3u003xwt5vnw66xcqe	cmknczw3u003xwt5vnw66xcqe	credential	\N	\N	\N	\N	read:users	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-21 02:02:15.096	2026-01-21 02:02:15.096
cmkndo14q001hwtu01jd8ehlt	cmknczw460042wt5v4n5ac2aw	cmknczw460042wt5v4n5ac2aw	credential	\N	\N	\N	\N	read:users	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-21 02:02:15.099	2026-01-21 02:02:15.099
cmkndo14t001jwtu072vg24gb	cmknczw5v0049wt5v0zzpqz1a	cmknczw5v0049wt5v0zzpqz1a	credential	\N	\N	\N	\N	read:users	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-21 02:02:15.101	2026-01-21 02:02:15.101
cmkndo14w001lwtu0tasqnzyn	cmknczw6e004ewt5vnym52e51	cmknczw6e004ewt5vnym52e51	credential	\N	\N	\N	\N	read:users	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-21 02:02:15.104	2026-01-21 02:02:15.104
cmkndo14z001nwtu027gvhchc	cmknczw6x004jwt5vmpj9qus9	cmknczw6x004jwt5vmpj9qus9	credential	\N	\N	\N	\N	read:users	\N	e07fe8819e315f0a59d530b0b2b20a97:7d39082fcae7b6e26c866427c09e2633cee145021974e4ecb3a42196e98daac8938f08fa76a2054b0e9e23251982ab45268626cb4e5756156edc1b202fd156ba	2026-01-21 02:02:15.107	2026-01-21 02:02:15.107
cmknlridu0002wteah7s6izy9	cmknlrid00000wteac8xtcfh7	cmknlrid00000wteac8xtcfh7	credential	\N	\N	\N	\N	\N	\N	1de169e72d18ddf7cc3a034414020e69:d275fe243f1e80afe6bebb2d4a2c86c14cf5c853a0af2a268c946998a018f799ce2672c05033571826d8afdbc5fb05a9c018f6be9c7384aa8d3a41536da2bd8a	2026-01-21 05:48:54.354	2026-01-21 05:48:54.354
\.


--
-- Data for Name: achievements; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.achievements (id, "schoolId", title, category, level, year, description, "studentId", "teacherId", "createdAt") FROM stdin;
\.


--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.activity_logs (id, "userId", action, entity, "entityId", details, "ipAddress", "userAgent", "createdAt") FROM stdin;
cmkhhqn0a0004wt3qr65erlaq	r4BO1lU0gcl9VCRZo9B2PGeZWELisoZX	CREATE_ASSIGNMENT	Assignment	cmkhhqmzm0001wt3q8k4sis2l	"{\\"title\\":\\"Kimia\\"}"	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	2026-01-16 23:09:38.171
cmklsdlgk0009wtwwo1tdzo0m	cmkjk0j590000wttfxkm0lbms	SUBMIT_ASSIGNMENT	AssignmentSubmission	cmklsdlfa0007wtwwc2a20jy7	"{\\"assignmentId\\":\\"cmkjmmzys0003wtq27x4movm5\\",\\"late\\":true}"	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15	2026-01-19 23:18:30.116
cmklsezjp000bwtww0tkak9wc	xZ8cdeXTZaUCiRVTvGWcdhQEFbfGdz6f	GRADE_ASSIGNMENT	AssignmentSubmission	cmklsdlfa0007wtwwc2a20jy7	"{\\"grade\\":10}"	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	2026-01-19 23:19:35.029
cmklslyd7000fwtwwr1tyct0g	cmkjk0j590000wttfxkm0lbms	SUBMIT_ASSIGNMENT	AssignmentSubmission	cmklslycg000dwtwwpo91n5iw	"{\\"assignmentId\\":\\"cmkjmmzxl0001wtq2z5sno4q1\\",\\"late\\":false}"	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15	2026-01-19 23:25:00.091
cmklsm8sc000jwtwwda4fepn6	cmkjk0j590000wttfxkm0lbms	SUBMIT_ASSIGNMENT	AssignmentSubmission	cmklsm8rt000hwtww80cmk50n	"{\\"assignmentId\\":\\"cmkhhqmzm0001wt3q8k4sis2l\\",\\"late\\":false}"	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15	2026-01-19 23:25:13.597
cmkltaejz0001wt37r483ag2a	xZ8cdeXTZaUCiRVTvGWcdhQEFbfGdz6f	GRADE_ASSIGNMENT	AssignmentSubmission	cmklslycg000dwtwwpo91n5iw	"{\\"grade\\":100}"	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	2026-01-19 23:44:00.816
cmkltano60003wt37lg4saese	xZ8cdeXTZaUCiRVTvGWcdhQEFbfGdz6f	GRADE_ASSIGNMENT	AssignmentSubmission	cmklsm8rt000hwtww80cmk50n	"{\\"grade\\":100}"	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	2026-01-19 23:44:12.63
cmklubrhh0005wtakaxnbez40	xZ8cdeXTZaUCiRVTvGWcdhQEFbfGdz6f	CREATE_ASSIGNMENT	Assignment	cmklubrfz0003wtakufme5tw3	"{\\"title\\":\\"Tes\\"}"	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	2026-01-20 00:13:03.845
cmklucfu20009wtak4o4paz5d	cmkjk0j590000wttfxkm0lbms	SUBMIT_ASSIGNMENT	AssignmentSubmission	cmklucftg0007wtakfvfbop1j	"{\\"assignmentId\\":\\"cmklubrfz0003wtakufme5tw3\\",\\"late\\":false}"	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15	2026-01-20 00:13:35.401
cmknc5j4q0004wtay7ssihz1g	cmkm58pme0000wt26mn77ke7v	CREATE_ASSIGNMENT	Assignment	cmknc5izu0001wtay7jiep2cb	"{\\"title\\":\\"Tes tugas\\"}"	127.0.0.1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36	2026-01-21 01:19:52.342
cmkndrp8u0005wtiuk4pfxo2v	cmknczvpm000kwt5v75tdm739	CREATE_ASSIGNMENT	Assignment	cmkndrp3a0002wtiuj7dwzepw	"{\\"title\\":\\"Analisis Cerpen\\"}"	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	2026-01-21 02:05:06.318
\.


--
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.announcements (id, title, content, category, "targetAudience", "isPinned", "publishedAt", "expiresAt", "createdBy", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: assignment_attachments; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.assignment_attachments (id, "assignmentId", type, url, filename, size, "mimeType", "createdAt") FROM stdin;
cmkhhqmzo0002wt3qa48d0szs	cmkhhqmzm0001wt3q8k4sis2l	IMAGE	http://0.0.0.0:3001/uploads/d89f8ce2-4d36-4952-883a-edc88b9675ba.png	Screenshot 2025-12-13 at 05.29.46.png	\N	image/png	2026-01-16 23:09:38.146
cmkncawr50000wtiu1urgidsa	cmknc5izu0001wtay7jiep2cb	FILE	http://0.0.0.0:3001/uploads/4b4a4921-7eeb-40bc-82e1-eaea50152342.png	Screenshot 2025-12-05 at 19.27.47.png	\N	\N	2026-01-21 01:24:03.281
cmkndrp3a0003wtiuujc3m767	cmkndrp3a0002wtiuj7dwzepw	FILE	http://0.0.0.0:3001/uploads/36cd5124-c01f-48de-86ac-fe027bc9a320.png	Screenshot 2025-12-04 at 13.13.29.png	\N	\N	2026-01-21 02:05:06.118
\.


--
-- Data for Name: assignment_submissions; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.assignment_submissions (id, "assignmentId", "studentId", "fileUrl", content, grade, feedback, status, "submittedAt", "gradedAt", late) FROM stdin;
cmklsdlfa0007wtwwc2a20jy7	cmkjmmzys0003wtq27x4movm5	cmkcw4dsm0000wt6kjnjepaic	http://0.0.0.0:3001/uploads/59211145-18f2-4271-ac3a-6e7dda5ca12c.pdf	<p>here</p>	10	bagus kamu telat nilaina 10	GRADED	2026-01-19 23:18:30.065	2026-01-19 23:19:34.992	t
cmklslycg000dwtwwpo91n5iw	cmkjmmzxl0001wtq2z5sno4q1	cmkcw4dsm0000wt6kjnjepaic	http://0.0.0.0:3001/uploads/ba719c3f-b4eb-4309-a359-b15783ea4d06.pdf		100		GRADED	2026-01-19 23:25:00.063	2026-01-19 23:44:00.798	f
cmklsm8rt000hwtww80cmk50n	cmkhhqmzm0001wt3q8k4sis2l	cmkcw4dsm0000wt6kjnjepaic	http://0.0.0.0:3001/uploads/e125e78c-4212-4b14-9bfc-fe7e69b5cb17.pdf		100	good	GRADED	2026-01-19 23:25:13.577	2026-01-19 23:44:12.615	f
cmklucftg0007wtakfvfbop1j	cmklubrfz0003wtakufme5tw3	cmkcw4dsm0000wt6kjnjepaic		<p>udah</p>	\N	\N	SUBMITTED	2026-01-20 00:13:35.378	\N	f
\.


--
-- Data for Name: assignments; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.assignments (id, "classId", "subjectId", "teacherId", title, description, "dueDate", "maxScore", "attachmentUrl", "createdAt", "updatedAt") FROM stdin;
cmkhhqmzm0001wt3q8k4sis2l	cmkgu0a2j0002wt0huwitza0g	cmkcqahef0002wtnukb544l3q	cmkcqahf10009wtnup7lo37kp	Kimia	<p>Soal</p><ol><li>inin</li></ol>	2026-01-30 23:09:00	100	\N	2026-01-16 23:09:38.146	2026-01-16 23:09:38.146
cmkjmmzxl0001wtq2z5sno4q1	cmkgu0a2j0002wt0huwitza0g	cmkcqahe60001wtnu5tdpajsw	cmkcqahes0007wtnumwa03r5h	Latihan Soal Aljabar Linear	Kerjakan halaman 20-22 no 1-10	2026-01-20 11:02:18.727	100	\N	2026-01-18 11:02:18.73	2026-01-18 11:02:18.73
cmkjmmzys0003wtq27x4movm5	cmkgu0a2j0002wt0huwitza0g	cmkjmbwes0001wtgj0uhxx0uy	cmkcqahes0007wtnumwa03r5h	Analisis Cerpen	Buat analisis intrinsik cerpen pilihan	2026-01-17 11:02:18.728	100	\N	2026-01-18 11:02:18.773	2026-01-18 11:02:18.773
cmklubrfz0003wtakufme5tw3	cmkgu14bw0006wt0hxl6v0d7t	cmkjmbwes0001wtgj0uhxx0uy	cmkcqahf10009wtnup7lo37kp	Tes	<p>buat nasi</p>	2026-01-24 00:12:00	100	\N	2026-01-20 00:13:03.792	2026-01-20 00:13:03.792
cmknc5izu0001wtay7jiep2cb	cmkgttvek0001wtnnsaxnweyf	cmkhi95c10000wthvv9x97v0s	cmkm58pms0004wt26m94ljfjj	Tes tugas	Tes	2026-01-21 18:19:00	100	\N	2026-01-21 01:19:52.167	2026-01-21 01:24:03.281
cmkndrp3a0002wtiuj7dwzepw	cmkncnze00001wtppqb2g9djj	cmkcqahef0002wtnukb544l3q	cmknczvpp000mwt5vwf0ylf90	Analisis Cerpen	Analisis Cerpen diatas 	2026-01-22 02:04:00	100	\N	2026-01-21 02:05:06.118	2026-01-21 02:05:06.118
\.


--
-- Data for Name: capaian_pembelajaran; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.capaian_pembelajaran (id, "kodeCP", fase, "mataPelajaranId", deskripsi, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: class_enrollments; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.class_enrollments (id, "studentId", "classId", "enrolledAt", status) FROM stdin;
cmkjkcxma0005wtzw1eibdhk1	cmkcw4dsm0000wt6kjnjepaic	cmkhknckf000dwt1hkbz4vjzg	2026-01-18 09:58:29.938	TRANSFERRED
cmkjkcvb10003wtzwnv9ehc54	cmkcw4dsm0000wt6kjnjepaic	cmkhknck6000bwt1htyqozs35	2026-01-18 10:01:50.919	TRANSFERRED
cmkjkafla0001wtzwlmxn5dwc	cmkcw4dsm0000wt6kjnjepaic	cmkgttvek0001wtnnsaxnweyf	2026-01-18 10:35:14.472	TRANSFERRED
cmkjlntrk0001wt3idfvlq2w0	cmkcw4dsm0000wt6kjnjepaic	cmkgu0a2j0002wt0huwitza0g	2026-01-18 10:35:17.483	TRANSFERRED
cmkjlo43g0005wt3i3filwcyi	cmkcw4dsm0000wt6kjnjepaic	cmkgu14bw0006wt0hxl6v0d7t	2026-01-18 10:40:46.207	ACTIVE
cmkjlo28z0003wt3iyasodjg2	cmkcw4dsm0000wt6kjnjepaic	cmkgu0svq0004wt0hycu7eo2r	2026-01-18 10:41:11.933	TRANSFERRED
cmkm3xy870007wtucw2xtuz9t	cmkm3xy870005wtuc8d6uen86	cmkm3wc730001wtmh685mwitb	2026-01-20 04:42:15.559	ACTIVE
cmkncrcij0005wtwoe8dg8s3v	cmkncrchs0003wtwobvox3mhz	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:50.204	ACTIVE
cmkncrcjw000bwtwoupyux27v	cmkncrcjr0009wtwovm9zrgch	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:50.252	ACTIVE
cmkncrckv000hwtwog31t61pv	cmkncrcka000fwtwol3djdeoe	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:50.287	ACTIVE
cmkncrcok000nwtwog9mu4amy	cmkncrcnh000lwtwo41zplppw	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:50.421	ACTIVE
cmkncrcq0000twtwo23gjc6vy	cmkncrcpt000rwtwo4y8b0eqc	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:50.472	ACTIVE
cmkncrcqf000zwtwovg4mhyae	cmkncrcqb000xwtwodm3ij0nz	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:50.488	ACTIVE
cmkncrcqu0015wtwo2536n8fm	cmkncrcqr0013wtwoh8xhe0gv	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:50.503	ACTIVE
cmkncrcx4001bwtwofg7g24mb	cmkncrcwz0019wtwo6npg85zy	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:50.729	ACTIVE
cmkncrcxn001hwtwoxhcm8917	cmkncrcxf001fwtwot0iqfyx7	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:50.748	ACTIVE
cmkncrcyv001nwtwocqzvq76m	cmkncrcyk001lwtwojuxnm072	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:50.792	ACTIVE
cmkncrd2q001twtwoqz0gtqoc	cmkncrd2c001rwtwoy3m1ol7h	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:50.93	ACTIVE
cmkncrd3q001zwtwo0byj7e73	cmkncrd3f001xwtwocp7x9wrt	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:50.966	ACTIVE
cmkncrd4r0025wtwo00zoenq7	cmkncrd4g0023wtwooushzwcz	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:51.003	ACTIVE
cmkncrd5c002bwtwo7gmxvem4	cmkncrd550029wtwofkdu8356	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:51.024	ACTIVE
cmkncrd5s002hwtwo0ggrlijn	cmkncrd5m002fwtwobqrof8fb	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:51.041	ACTIVE
cmkncrd66002nwtwo8xxrotz5	cmkncrd62002lwtwoyb2s9aw2	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:51.055	ACTIVE
cmkncrd6j002twtwowxphvef8	cmkncrd6f002rwtwo3t8a1gdr	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:51.067	ACTIVE
cmkncrd6y002zwtwosebopx3b	cmkncrd6t002xwtwoktb4va1o	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:51.083	ACTIVE
cmkncrd7b0035wtwojnmfqvro	cmkncrd760033wtwogapqdkyr	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:51.095	ACTIVE
cmkncrd7p003bwtwoncjfz9ct	cmkncrd7i0039wtwogo16459u	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:51.109	ACTIVE
cmkncrd7z003hwtwoir159nvw	cmkncrd7v003fwtwolx931hlv	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:51.119	ACTIVE
cmkncrd88003nwtwof1grum1u	cmkncrd84003lwtwo0a9ijufj	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:51.129	ACTIVE
cmkncrd9j003twtwo5bw5d4y9	cmkncrd9d003rwtwotk1kiwhh	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:51.175	ACTIVE
cmkncrdaf003zwtwofzfbinf0	cmkncrda4003xwtwoqmq3m8tp	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:51.207	ACTIVE
cmkncrdb10045wtwozi7pryst	cmkncrdan0043wtwooxsaz9pz	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:51.229	ACTIVE
cmkncrdbi004bwtwoyosxny4g	cmkncrdbd0049wtwok3czp8rq	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:51.246	ACTIVE
cmkncrdbu004hwtwow36o7l17	cmkncrdbn004fwtwohzd8racn	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:51.258	ACTIVE
cmkncrdc8004nwtwopzthoqwd	cmkncrdc4004lwtwoqhnlr3as	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:51.272	ACTIVE
cmkncrdck004twtwoe1kklabo	cmkncrdce004rwtwo65saz3p1	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:51.284	ACTIVE
cmkncrdct004zwtwoh3y8zeux	cmkncrdcp004xwtwofzdwije5	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:51.293	ACTIVE
cmkncrdd70055wtwo66x0qibp	cmkncrdd40053wtwobv3sntg1	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:51.307	ACTIVE
cmkncrddl005bwtwoe5gjq6ep	cmkncrddi0059wtwogvr2bjv0	cmkncnze00001wtppqb2g9djj	2026-01-21 01:36:51.322	ACTIVE
cmkncrddz005hwtwonxphrrhr	cmkncrddu005fwtwoxxf4bbqg	cmkncrddn005dwtwoych0bxpy	2026-01-21 01:36:51.335	ACTIVE
cmkncrdeb005nwtwo52x2a56m	cmkncrde5005lwtwo8yu1nqa0	cmkncrddn005dwtwoych0bxpy	2026-01-21 01:36:51.348	ACTIVE
cmkncrdez005twtwo8b8z2tvi	cmkncrdeo005rwtwoecdcn33k	cmkncrddn005dwtwoych0bxpy	2026-01-21 01:36:51.371	ACTIVE
cmkncrdfd005zwtwov8tz2lak	cmkncrdf7005xwtwosanyzrs8	cmkncrddn005dwtwoych0bxpy	2026-01-21 01:36:51.385	ACTIVE
cmkncrdfu0065wtwoa7wmco0z	cmkncrdfp0063wtwoz9lckoye	cmkncrddn005dwtwoych0bxpy	2026-01-21 01:36:51.403	ACTIVE
cmkncrdgb006bwtwoo2492f0f	cmkncrdg00069wtwolhrbj9dw	cmkncrddn005dwtwoych0bxpy	2026-01-21 01:36:51.419	ACTIVE
cmkncrdgt006hwtwo0fngmyvr	cmkncrdgi006fwtwo7f6nqqkj	cmkncrddn005dwtwoych0bxpy	2026-01-21 01:36:51.431	ACTIVE
cmkncrdhf006nwtwo7rimq7yn	cmkncrdha006lwtwo65jm5jk8	cmkncrddn005dwtwoych0bxpy	2026-01-21 01:36:51.46	ACTIVE
cmkncrdi2006twtwoj9nght8v	cmkncrdhv006rwtwocrrhupp0	cmkncrddn005dwtwoych0bxpy	2026-01-21 01:36:51.482	ACTIVE
cmkncrdid006zwtwohkrem63m	cmkncrdi9006xwtwoof5kbk7e	cmkncrddn005dwtwoych0bxpy	2026-01-21 01:36:51.494	ACTIVE
cmkncrdj70075wtwohgp6ungh	cmkncrdiq0073wtwogp1yft20	cmkncrddn005dwtwoych0bxpy	2026-01-21 01:36:51.524	ACTIVE
cmkncrdjn007bwtwoj52guljc	cmkncrdjg0079wtwoalas2kco	cmkncrddn005dwtwoych0bxpy	2026-01-21 01:36:51.539	ACTIVE
cmkncrdk2007hwtwoda452va1	cmkncrdjv007fwtwodtkbwh4g	cmkncrddn005dwtwoych0bxpy	2026-01-21 01:36:51.555	ACTIVE
cmkncrdkd007nwtwo4psbw904	cmkncrdka007lwtwon3vkdazn	cmkncrddn005dwtwoych0bxpy	2026-01-21 01:36:51.565	ACTIVE
cmkncrdko007twtwo2yg7had3	cmkncrdkl007rwtwoo8w7rxfj	cmkncrddn005dwtwoych0bxpy	2026-01-21 01:36:51.577	ACTIVE
cmkncrdl0007zwtwooaw0g8mu	cmkncrdkw007xwtwox3e5mhl3	cmkncrddn005dwtwoych0bxpy	2026-01-21 01:36:51.589	ACTIVE
cmkncrdlg0085wtwoqd1fj9a5	cmkncrdl90083wtwoegc4x4o5	cmkncrddn005dwtwoych0bxpy	2026-01-21 01:36:51.605	ACTIVE
cmkncrdm7008bwtwo2csrqbw3	cmkncrdm10089wtwo2tm4hdye	cmkncrddn005dwtwoych0bxpy	2026-01-21 01:36:51.631	ACTIVE
cmkncrdmo008hwtwopj5jzxrl	cmkncrdmk008fwtwo1fx9wr8s	cmkncrddn005dwtwoych0bxpy	2026-01-21 01:36:51.648	ACTIVE
cmkncrdn0008nwtwo4ov4nvyy	cmkncrdmv008lwtwog2asb8hv	cmkncrddn005dwtwoych0bxpy	2026-01-21 01:36:51.66	ACTIVE
cmkncrdne008twtwof9n2svi6	cmkncrdnb008rwtwofghq31yr	cmkncrddn005dwtwoych0bxpy	2026-01-21 01:36:51.675	ACTIVE
cmkncrdnv008zwtwoocw1uw5f	cmkncrdnp008xwtwo7s24ofuu	cmkncrddn005dwtwoych0bxpy	2026-01-21 01:36:51.691	ACTIVE
cmkncrdod0095wtwoo4qu0ypv	cmkncrdo50093wtwor9papdro	cmkncrddn005dwtwoych0bxpy	2026-01-21 01:36:51.709	ACTIVE
cmkncrdos009bwtwov4utbzsd	cmkncrdoo0099wtwo3po63yfz	cmkncrddn005dwtwoych0bxpy	2026-01-21 01:36:51.724	ACTIVE
cmkncrdp9009hwtwojsd3nmfy	cmkncrdp2009fwtwof780v2w1	cmkncrddn005dwtwoych0bxpy	2026-01-21 01:36:51.742	ACTIVE
cmkncrdpm009nwtwoqslufanp	cmkncrdpi009lwtwol76yik9u	cmkncrddn005dwtwoych0bxpy	2026-01-21 01:36:51.754	ACTIVE
cmkncrdq9009twtwofrq8e9xq	cmkncrdps009rwtwoot441fj5	cmkncrddn005dwtwoych0bxpy	2026-01-21 01:36:51.778	ACTIVE
cmkncrdsj009zwtwo38oqaw6l	cmkncrdsb009xwtwo3yowg0k3	cmkncrddn005dwtwoych0bxpy	2026-01-21 01:36:51.859	ACTIVE
cmkncrdtq00a5wtwocrxumlbb	cmkncrdt500a3wtwontdoyfo8	cmkncrddn005dwtwoych0bxpy	2026-01-21 01:36:51.903	ACTIVE
cmkncrduo00abwtwoq1xhjm07	cmkncrdu900a9wtwotz3rkdef	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:51.936	ACTIVE
cmkncrdv700ahwtwoz8uivoeo	cmkncrduw00afwtwoni5t19bm	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:51.955	ACTIVE
cmkncrdw200anwtwolgr6ks6t	cmkncrdvo00alwtwoj6fqy5x3	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:51.987	ACTIVE
cmkncrdwo00atwtwolfq1rf1h	cmkncrdwf00arwtwog5k38kks	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.008	ACTIVE
cmkncrdx400azwtwo4qv11xcz	cmkncrdx100axwtwojfvmvhm3	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.024	ACTIVE
cmkncrdxv00b5wtwoxooc602h	cmkncrdxl00b3wtwolzyz8bal	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.051	ACTIVE
cmkncrdyn00bbwtwo6323e4fn	cmkncrdy100b9wtwo9ccevohk	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.078	ACTIVE
cmkncrdza00bhwtwonlfe98d9	cmkncrdyy00bfwtwonzlktxxe	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.102	ACTIVE
cmkncrdzt00bnwtwo19xg93qz	cmkncrdzg00blwtwoyo9cszxf	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.122	ACTIVE
cmkncre2300btwtwojo5otded	cmkncre1n00brwtwoki50wcb3	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.204	ACTIVE
cmkncre3k00bzwtwogg0xyzma	cmkncre3i00bxwtwolxw65m9f	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.257	ACTIVE
cmkncre4100c5wtwoqtaekkua	cmkncre3t00c3wtwodun6cu6w	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.273	ACTIVE
cmkncre4d00cbwtwo3ifoi2fm	cmkncre4800c9wtwow3m0dcwh	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.285	ACTIVE
cmkncre5d00chwtwodh3c9ox3	cmkncre5900cfwtwoe224kqjh	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.322	ACTIVE
cmkncre6q00cnwtwo250t9h16	cmkncre6j00clwtwoz2tjodxq	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.37	ACTIVE
cmkncre7p00ctwtwod77v0ywq	cmkncre7e00crwtwoth3bmlba	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.406	ACTIVE
cmkncre8600czwtwofrshgdc0	cmkncre7z00cxwtwosw5gghwe	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.423	ACTIVE
cmkncre8q00d5wtwowqtqcns6	cmkncre8j00d3wtwo0i6ugkm7	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.442	ACTIVE
cmkncre9b00dbwtwoeak0rql5	cmkncre9500d9wtwoj7m3cq9g	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.463	ACTIVE
cmkncreae00dhwtwo87k8ebw7	cmkncre9k00dfwtwoum5a9rs8	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.503	ACTIVE
cmkncreat00dnwtwod8nspgxb	cmkncream00dlwtwomnaj7310	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.517	ACTIVE
cmkncreb900dtwtwow4nw8lhk	cmkncreb400drwtwofvi9wmrd	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.533	ACTIVE
cmkncrebo00dzwtwoauf5rodr	cmkncrebi00dxwtwokzn4ishq	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.548	ACTIVE
cmkncrec400e5wtwokg69jx1s	cmkncrebx00e3wtwom873alza	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.564	ACTIVE
cmkncrech00ebwtwoxzm2rykl	cmkncrecc00e9wtwo6tw5b18g	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.577	ACTIVE
cmkncree100ehwtwoos7lr53n	cmkncredn00efwtwoo8io1z1e	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.633	ACTIVE
cmkncrej000enwtwo7mq4vjub	cmkncrehn00elwtwojurig18e	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.812	ACTIVE
cmkncrejr00etwtwoksz2uh12	cmkncreji00erwtwoexqbqgk7	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.839	ACTIVE
cmkncreke00ezwtwotxzdqqkg	cmkncrek700exwtwo0dmwm6sk	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.862	ACTIVE
cmkncrel700f5wtwotsjvhfpr	cmkncrel000f3wtwolv6q07as	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.892	ACTIVE
cmkncreln00fbwtwo3bg8xlse	cmkncrelg00f9wtwo7ycx4h3i	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.908	ACTIVE
cmkncremg00fhwtwox38omgjy	cmkncrelx00ffwtwogyih6oyo	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.937	ACTIVE
cmkncremu00fnwtwotumao2qf	cmkncremq00flwtwo6kfgpsrb	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.95	ACTIVE
cmkncren600ftwtwoyruexnuq	cmkncremz00frwtwo0pvjr70p	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.962	ACTIVE
cmkncrenh00fzwtwo4l8iys7k	cmkncrend00fxwtwo0ci1zwds	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.974	ACTIVE
cmkncrenr00g5wtwoycptpzfr	cmkncreno00g3wtwoq7nld4mc	cmkncrdts00a7wtwoelzag7t7	2026-01-21 01:36:52.984	ACTIVE
cmkncreo600gbwtwolpmj3mke	cmkncreo200g9wtwoy7wb8jpb	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:52.998	ACTIVE
cmkncreof00ghwtwo70nwgg3b	cmkncreoc00gfwtwoe5xwxdnk	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.007	ACTIVE
cmkncreoo00gnwtwoiecti9f4	cmkncreol00glwtwoj3s31jv1	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.017	ACTIVE
cmkncrep600gtwtwo4f123n17	cmkncrep300grwtwobx50bby3	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.034	ACTIVE
cmkncrepn00gzwtwowih2e5os	cmkncrepg00gxwtwoszjq73yp	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.051	ACTIVE
cmkncreqp00h5wtwo0ixayq0l	cmkncreqa00h3wtwopqt60s9r	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.089	ACTIVE
cmkncrerh00hbwtwo0b7y6m1g	cmkncrerd00h9wtwofuhulp6l	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.118	ACTIVE
cmkncrevi00hhwtwonws5gy91	cmkncrers00hfwtwozqldv1ni	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.262	ACTIVE
cmkncrevv00hnwtwoy640d16v	cmkncrevr00hlwtwotom9sijj	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.275	ACTIVE
cmkncrew500htwtwo3aq36yok	cmkncrew200hrwtwor219i2mj	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.285	ACTIVE
cmkncrewd00hzwtwo2etpmbs3	cmkncrewa00hxwtwof14v8tvz	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.294	ACTIVE
cmkncrewo00i5wtwoy2ia1lx6	cmkncrewk00i3wtwovwgksd6j	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.304	ACTIVE
cmkncrewy00ibwtwon5lidra2	cmkncrews00i9wtwos1ic13bp	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.314	ACTIVE
cmkncrex600ihwtwoev1ap9o0	cmkncrex300ifwtwo1ey3feh8	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.322	ACTIVE
cmkncrexf00inwtwor8f3k1mx	cmkncrexc00ilwtwoe34oec80	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.332	ACTIVE
cmkncrexn00itwtwoebhzwnvs	cmkncrexk00irwtwopv5nhytn	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.339	ACTIVE
cmkncrexz00izwtwofly39ky1	cmkncrexw00ixwtwookxw6hrm	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.352	ACTIVE
cmkncrey700j5wtwou6zhwgel	cmkncrey400j3wtwovy9ic5oz	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.36	ACTIVE
cmkncreyl00jbwtwo8tvv590o	cmkncreyg00j9wtwoocd09818	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.373	ACTIVE
cmkncrf0800jhwtwoxai2j57y	cmkncrezr00jfwtwo1et7do00	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.433	ACTIVE
cmkncrf0g00jnwtwom3ld927y	cmkncrf0d00jlwtwouev3whlj	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.44	ACTIVE
cmkncrf0o00jtwtwo211aktot	cmkncrf0l00jrwtwoxpbl5258	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.449	ACTIVE
cmkncrf0x00jzwtwok886x8sl	cmkncrf0u00jxwtwo5mny3bkw	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.458	ACTIVE
cmkncrf1600k5wtwoipqyhllq	cmkncrf1300k3wtwo3hpl8b8q	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.467	ACTIVE
cmkncrf2300kbwtwogx9nu4ta	cmkncrf1z00k9wtwovyro8o1a	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.499	ACTIVE
cmkncrf7m00khwtwovpdn5zjv	cmkncrf7f00kfwtwo1l0a1idd	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.698	ACTIVE
cmkncrf8200knwtwo6tvhg6qy	cmkncrf7z00klwtwo7qcrsdu0	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.714	ACTIVE
cmkncrf8a00ktwtwo500qrneq	cmkncrf8700krwtwovezwlje2	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.722	ACTIVE
cmkncrf8r00kzwtwo6xklulwf	cmkncrf8h00kxwtwoya7tz5ni	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.739	ACTIVE
cmkncrf9d00l5wtwodabhyq6a	cmkncrf8z00l3wtwosx9cix9v	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.762	ACTIVE
cmkncrfb700lbwtwovn8j2zqt	cmkncrfb300l9wtworva46isf	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.827	ACTIVE
cmkncrfbi00lhwtwosqc67qq8	cmkncrfbg00lfwtwoa2afxmvk	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.839	ACTIVE
cmkncrfc200lnwtwoune96urm	cmkncrfbn00llwtwoxu402nmg	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.858	ACTIVE
cmkncrfcg00ltwtwo3y3d9u8r	cmkncrfcd00lrwtwoqyjcw2rd	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.872	ACTIVE
cmkncrfcq00lzwtwodg4w8z5r	cmkncrfcn00lxwtwoz3nw9w10	cmkncrent00g7wtwoyjt0ew6i	2026-01-21 01:36:53.883	ACTIVE
cmkncrfdv00m5wtwo9kalg49l	cmkncrfds00m3wtwo1w77nwdp	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:53.923	ACTIVE
cmkncrfe500mbwtwoievkt90c	cmkncrfe200m9wtwo329iqsqn	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:53.933	ACTIVE
cmkncrfef00mhwtwokdba7bzq	cmkncrfeb00mfwtwoty4lv49f	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:53.943	ACTIVE
cmkncrfeu00mnwtwo4ttfsw3n	cmkncrfeo00mlwtwozs6zqrdi	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:53.958	ACTIVE
cmkncrff700mtwtwo7n26bqt9	cmkncrfez00mrwtwoybbc6vfx	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:53.972	ACTIVE
cmkncrffi00mzwtwopij0kliu	cmkncrfff00mxwtwo61mfss50	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:53.982	ACTIVE
cmkncrfg200n5wtwo7vgvozrp	cmkncrfft00n3wtwo21xky9p5	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:54.002	ACTIVE
cmkncrfgc00nbwtwostub7x63	cmkncrfg700n9wtwohu3iez1l	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:54.012	ACTIVE
cmkncrfh500nhwtwod7777eia	cmkncrfgx00nfwtwo24njsfud	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:54.042	ACTIVE
cmkncrfhg00nnwtwovyik8hw9	cmkncrfhe00nlwtwomc4vkt6k	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:54.053	ACTIVE
cmkncrfhq00ntwtwovl6cbxl6	cmkncrfhl00nrwtwo4ws6ngyf	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:54.062	ACTIVE
cmkncrfhy00nzwtwonpbcv8j8	cmkncrfhv00nxwtwow3sde2uu	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:54.07	ACTIVE
cmkncrfia00o5wtwo5beo3jon	cmkncrfi700o3wtwo9hpinpt6	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:54.082	ACTIVE
cmkncrfiq00obwtwooom1i8ql	cmkncrfin00o9wtwosa31yqxt	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:54.098	ACTIVE
cmkncrfj100ohwtwoj3pzcpmi	cmkncrfiz00ofwtwowe41schg	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:54.11	ACTIVE
cmkncrfjc00onwtwo0j8hvs64	cmkncrfj900olwtwoeunvtgmu	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:54.12	ACTIVE
cmkncrfjn00otwtwohdg8vmut	cmkncrfjk00orwtwovtueacx1	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:54.132	ACTIVE
cmkncrfk900ozwtwowo1on92s	cmkncrfk200oxwtwoa9jd0066	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:54.153	ACTIVE
cmkncrfkq00p5wtwocbsbsjjk	cmkncrfkm00p3wtwovyzjc5vp	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:54.17	ACTIVE
cmkncrfl600pbwtwo4ffkb19q	cmkncrfl200p9wtwoxxcj4rie	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:54.187	ACTIVE
cmkncrflg00phwtwogtn4xbku	cmkncrflb00pfwtwo7zt6sbcm	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:54.197	ACTIVE
cmkncrflv00pnwtwo2b08nyx3	cmkncrflm00plwtwom5t4pupv	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:54.211	ACTIVE
cmkncrfmi00ptwtwo7lg8ka7k	cmkncrfmd00prwtwogkfvpoe6	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:54.234	ACTIVE
cmkncrfmv00pzwtwo1xeyouag	cmkncrfmr00pxwtwo1zpg8bzw	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:54.248	ACTIVE
cmkncrfto00q5wtwo7biq1e23	cmkncrfqn00q3wtwo1c59701y	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:54.493	ACTIVE
cmkncrfu300qbwtwo1y93i242	cmkncrfu000q9wtwo89iv7vr0	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:54.508	ACTIVE
cmkncrfvy00qhwtwozy61dwr6	cmkncrfux00qfwtwou2twnxwj	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:54.574	ACTIVE
cmkncrfxb00qnwtworzv2q7me	cmkncrfwt00qlwtwoyv3ujy8c	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:54.623	ACTIVE
cmkncrfzt00qtwtwo44qb57al	cmkncrfxq00qrwtwo0fu1v1jc	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:54.714	ACTIVE
cmkncrg0g00qzwtwolle2r4gf	cmkncrg0b00qxwtwo0kz4t44l	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:54.737	ACTIVE
cmkncrg0x00r5wtwo8snp8t90	cmkncrg0m00r3wtwoc3ya0kj1	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:54.753	ACTIVE
cmkncrg1y00rbwtwons3zgv4m	cmkncrg1u00r9wtwonxo0w4uw	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:54.791	ACTIVE
cmkncrg2y00rhwtwowpqa4ux3	cmkncrg2d00rfwtwot0gzc9sg	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:54.826	ACTIVE
cmkncrg4700rrwtwole01m5ft	cmkncrg4000rpwtwooayyhqxr	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:54.87	ACTIVE
cmkncrg7600rxwtworcz79l5g	cmkncrg6v00rvwtwou9voj4ax	cmkncrfcr00m1wtwoqku9nb4c	2026-01-21 01:36:54.978	ACTIVE
\.


--
-- Data for Name: class_schedules; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.class_schedules (id, "classId", "subjectId", "teacherId", "dayOfWeek", "startTime", "endTime", room, "createdAt", "updatedAt", "deletedAt") FROM stdin;
cmkhifgv80004wthv77mi4xtw	cmkgttvek0001wtnnsaxnweyf	cmkcqaheh0003wtnunw60rohw	\N	1	08:30	09:30		2026-01-16 23:28:56.612	2026-01-16 23:28:56.612	\N
cmkjmbwkj0009wtgjpsif9qgm	cmkgu0a2j0002wt0huwitza0g	cmkjmbwes0001wtgj0uhxx0uy	\N	1	08:30	10:00	101	2026-01-18 10:53:41.155	2026-01-18 10:53:41.155	\N
cmkjmbwkt000hwtgjwav1hiuz	cmkgu0a2j0002wt0huwitza0g	cmkhnjlju000zwtvsfacf271e	\N	5	07:00	09:00	Lab IPA	2026-01-18 10:53:41.165	2026-01-19 22:47:01.794	\N
cmkjmbwkr000fwtgjazhiwu0r	cmkgu0a2j0002wt0huwitza0g	cmkcqahe60001wtnu5tdpajsw	\N	4	07:00	09:00	Lab IPA	2026-01-18 10:53:41.164	2026-01-19 22:47:10.857	\N
cmkjmbwkq000dwtgjw4fkvitw	cmkgu0a2j0002wt0huwitza0g	cmkjmbwf20002wtgj0w18lygx	\N	3	07:00	09:00	Lab IPA	2026-01-18 10:53:41.162	2026-01-19 22:47:16.594	\N
cmknd6gxx0003wthqudwlu0lo	cmkncrddn005dwtwoych0bxpy	cmkcqahe60001wtnu5tdpajsw	cmknczvyk001dwt5vi7rkbxo5	1	07:20	08:00	\N	2026-01-21 01:48:35.781	2026-01-21 01:53:20.416	\N
cmklrjz9h0001wtwwt4ru57dn	cmkgu14bw0006wt0hxl6v0d7t	cmkjmbwes0001wtgj0uhxx0uy	\N	1	07:00	08:30		2026-01-19 22:55:28.324	2026-01-19 22:55:28.324	\N
cmklrkfvz0003wtwwhtvrwjm0	cmkgu14bw0006wt0hxl6v0d7t	cmkjmbwf20002wtgj0w18lygx	\N	1	08:30	10:30		2026-01-19 22:55:49.87	2026-01-19 22:55:49.87	\N
cmklrrhya0005wtwwjsccsanq	cmkgu14bw0006wt0hxl6v0d7t	cmkjmbwes0001wtgj0uhxx0uy	\N	2	07:00	08:30		2026-01-19 23:01:19.138	2026-01-19 23:01:19.138	\N
cmkmklvwa0001wt53846x3u7l	cmkgttvek0001wtnnsaxnweyf	cmkhi95c10000wthvv9x97v0s	\N	2	07:00	08:30		2026-01-20 12:28:46.136	2026-01-20 12:28:46.136	\N
cmkmkm0pu0003wt537f8vnm7k	cmkgttvek0001wtnnsaxnweyf	cmkhi95c10000wthvv9x97v0s	\N	3	07:00	08:30		2026-01-20 12:28:52.386	2026-01-20 12:28:52.386	\N
cmkmkm9w20005wt53m9kc0npw	cmkgttvek0001wtnnsaxnweyf	cmkhi95c10000wthvv9x97v0s	\N	4	07:00	08:30		2026-01-20 12:29:04.274	2026-01-20 12:29:04.274	\N
cmkm40ruw0001wtf0crinc2d2	cmkm3wc730001wtmh685mwitb	cmkcqahel0005wtnuaznbt7gi	cmkm58pms0004wt26m94ljfjj	1	07:00	08:30		2026-01-20 04:44:27.273	2026-01-20 12:53:23.959	\N
cmkhif5kt0002wthvlzrfgjyh	cmkgttvek0001wtnnsaxnweyf	cmkcqahef0002wtnukb544l3q	cmkm58pms0004wt26m94ljfjj	1	07:00	08:30		2026-01-16 23:28:41.98	2026-01-20 13:13:03.268	\N
cmkjmbwgv0007wtgjap64gaxq	cmkgu0a2j0002wt0huwitza0g	cmkcqahe60001wtnu5tdpajsw	cmkm58pms0004wt26m94ljfjj	1	07:00	08:30	101	2026-01-18 10:53:41.024	2026-01-20 13:13:28.556	\N
cmkjmbwkn000bwtgjf9c5ob8p	cmkgu0a2j0002wt0huwitza0g	cmkcqahef0002wtnukb544l3q	cmkm58pms0004wt26m94ljfjj	2	07:00	09:00	Lab IPA	2026-01-18 10:53:41.16	2026-01-20 13:13:37.851	\N
cmknd6gxq0001wthqefvi8obq	cmkncnze00001wtppqb2g9djj	cmkcqaheh0003wtnunw60rohw	cmknczw3f003swt5vk9vd4h9a	1	07:20	08:00	\N	2026-01-21 01:48:35.774	2026-01-21 01:48:35.774	\N
cmknd6gy00005wthqwycd4o9d	cmkncrdts00a7wtwoelzag7t7	cmkhi95c10000wthvv9x97v0s	cmknczw6g004gwt5vwxny9ms2	1	07:20	08:00	\N	2026-01-21 01:48:35.785	2026-01-21 01:48:35.785	\N
cmknd6gy40007wthqp0fyu32y	cmkncrent00g7wtwoyjt0ew6i	cmknczvo40007wt5v54238qlg	cmknczw2v003gwt5vm245x3nn	1	07:20	08:00	\N	2026-01-21 01:48:35.788	2026-01-21 01:48:35.788	\N
cmknd6gy80009wthqg5qmxshn	cmkncrfcr00m1wtwoqku9nb4c	cmkcqaheh0003wtnunw60rohw	cmknczvyk001dwt5vi7rkbxo5	1	07:20	08:00	\N	2026-01-21 01:48:35.792	2026-01-21 01:48:35.792	\N
cmknd6gys000bwthq8rm1fh8s	cmkncnze00001wtppqb2g9djj	cmkcqaheh0003wtnunw60rohw	cmknczw3f003swt5vk9vd4h9a	1	08:00	08:40	\N	2026-01-21 01:48:35.812	2026-01-21 01:48:35.812	\N
cmknd6gyz000dwthq2mo7m1rx	cmkncrddn005dwtwoych0bxpy	cmkcqahe60001wtnu5tdpajsw	cmknczvzj001xwt5vuzuu9n7w	1	08:00	08:40	\N	2026-01-21 01:48:35.82	2026-01-21 01:48:35.82	\N
cmknd6gz2000fwthq77i0ep9r	cmkncrdts00a7wtwoelzag7t7	cmkhi95c10000wthvv9x97v0s	cmknczw6g004gwt5vwxny9ms2	1	08:00	08:40	\N	2026-01-21 01:48:35.823	2026-01-21 01:48:35.823	\N
cmknd6gz5000hwthq1x6hi0lo	cmkncrent00g7wtwoyjt0ew6i	cmknczvo40007wt5v54238qlg	cmknczw2v003gwt5vm245x3nn	1	08:00	08:40	\N	2026-01-21 01:48:35.826	2026-01-21 01:48:35.826	\N
cmknd6gza000jwthqh27idlrv	cmkncrfcr00m1wtwoqku9nb4c	cmkcqaheh0003wtnunw60rohw	cmknczvyk001dwt5vi7rkbxo5	1	08:00	08:40	\N	2026-01-21 01:48:35.83	2026-01-21 01:48:35.83	\N
cmknd6gze000lwthqbyfi5dxe	cmkncnze00001wtppqb2g9djj	cmknczvnd0001wt5vvyfsdh3h	cmknczvth0014wt5vqlzfp61s	1	08:40	09:20	\N	2026-01-21 01:48:35.834	2026-01-21 01:48:35.834	\N
cmknd6gzh000nwthqscthdr1j	cmkncrddn005dwtwoych0bxpy	cmkcqahel0005wtnuaznbt7gi	cmknczw25002ywt5vbj6isuhg	1	08:40	09:20	\N	2026-01-21 01:48:35.837	2026-01-21 01:48:35.837	\N
cmknd6gzl000pwthql8cs6tmm	cmkncrdts00a7wtwoelzag7t7	cmkhi95c10000wthvv9x97v0s	cmknczw6g004gwt5vwxny9ms2	1	08:40	09:20	\N	2026-01-21 01:48:35.841	2026-01-21 01:48:35.841	\N
cmknd6gzn000rwthqh1d6fof9	cmkncrent00g7wtwoyjt0ew6i	cmkcqaheh0003wtnunw60rohw	cmknczvyk001dwt5vi7rkbxo5	1	08:40	09:20	\N	2026-01-21 01:48:35.844	2026-01-21 01:48:35.844	\N
cmknd6gzq000twthqjdqcbdwz	cmkncrfcr00m1wtwoqku9nb4c	cmkhi95c10000wthvv9x97v0s	cmknczw68004bwt5vj867dkbe	1	08:40	09:20	\N	2026-01-21 01:48:35.846	2026-01-21 01:48:35.846	\N
cmknd6gzt000vwthqt2elh337	cmkncnze00001wtppqb2g9djj	cmknczvnd0001wt5vvyfsdh3h	cmknczvth0014wt5vqlzfp61s	1	09:20	10:00	\N	2026-01-21 01:48:35.849	2026-01-21 01:48:35.849	\N
cmknd6gzv000xwthq6tplpcip	cmkncrddn005dwtwoych0bxpy	cmkcqahel0005wtnuaznbt7gi	cmknczw25002ywt5vbj6isuhg	1	09:20	10:00	\N	2026-01-21 01:48:35.852	2026-01-21 01:48:35.852	\N
cmknd6gzy000zwthqpztqdjjk	cmkncrdts00a7wtwoelzag7t7	cmkhi95c10000wthvv9x97v0s	cmknczw6g004gwt5vwxny9ms2	1	09:20	10:00	\N	2026-01-21 01:48:35.854	2026-01-21 01:48:35.854	\N
cmknd6h000011wthqq9cadp4b	cmkncrent00g7wtwoyjt0ew6i	cmkcqaheh0003wtnunw60rohw	cmknczvyk001dwt5vi7rkbxo5	1	09:20	10:00	\N	2026-01-21 01:48:35.857	2026-01-21 01:48:35.857	\N
cmknd6h030013wthqgxb8zhba	cmkncrfcr00m1wtwoqku9nb4c	cmkhi95c10000wthvv9x97v0s	cmknczw68004bwt5vj867dkbe	1	09:20	10:00	\N	2026-01-21 01:48:35.859	2026-01-21 01:48:35.859	\N
cmknd6h080015wthq6a03xpve	cmkncnze00001wtppqb2g9djj	cmkcqaheh0003wtnunw60rohw	cmknczvyk001dwt5vi7rkbxo5	1	10:20	11:00	\N	2026-01-21 01:48:35.864	2026-01-21 01:48:35.864	\N
cmknd6h0b0017wthq1wythsbj	cmkncrddn005dwtwoych0bxpy	cmknczvob0008wt5vbcaiveme	cmknczw79004lwt5vo99xasgc	1	10:20	11:00	\N	2026-01-21 01:48:35.867	2026-01-21 01:48:35.867	\N
cmknd6h0e0019wthq3t3qlbog	cmkncrdts00a7wtwoelzag7t7	cmknczvo40007wt5v54238qlg	cmknczw2v003gwt5vm245x3nn	1	10:20	11:00	\N	2026-01-21 01:48:35.871	2026-01-21 01:48:35.871	\N
cmknd6h32001bwthqy8iitsjd	cmkncrent00g7wtwoyjt0ew6i	cmknczvnd0001wt5vvyfsdh3h	cmknczvth0014wt5vqlzfp61s	1	10:20	11:00	\N	2026-01-21 01:48:35.967	2026-01-21 01:48:35.967	\N
cmknd6h46001dwthqkao24nyx	cmkncrfcr00m1wtwoqku9nb4c	cmkcqahe60001wtnu5tdpajsw	cmknczvzj001xwt5vuzuu9n7w	1	10:20	11:00	\N	2026-01-21 01:48:36.007	2026-01-21 01:48:36.007	\N
cmknd6h4d001fwthqaw3q9ph9	cmkncnze00001wtppqb2g9djj	cmkcqaheh0003wtnunw60rohw	cmknczvyk001dwt5vi7rkbxo5	1	11:00	11:40	\N	2026-01-21 01:48:36.014	2026-01-21 01:48:36.014	\N
cmknd6h4j001hwthq63avzoiw	cmkncrddn005dwtwoych0bxpy	cmknczvob0008wt5vbcaiveme	cmknczw79004lwt5vo99xasgc	1	11:00	11:40	\N	2026-01-21 01:48:36.019	2026-01-21 01:48:36.019	\N
cmknd6h4n001jwthq3bw3rglz	cmkncrdts00a7wtwoelzag7t7	cmknczvo40007wt5v54238qlg	cmknczw2v003gwt5vm245x3nn	1	11:00	11:40	\N	2026-01-21 01:48:36.024	2026-01-21 01:48:36.024	\N
cmknd6h52001lwthqzwrrdxti	cmkncrent00g7wtwoyjt0ew6i	cmknczvnd0001wt5vvyfsdh3h	cmknczvth0014wt5vqlzfp61s	1	11:00	11:40	\N	2026-01-21 01:48:36.038	2026-01-21 01:48:36.038	\N
cmknd6h56001nwthqy09rpsj9	cmkncrfcr00m1wtwoqku9nb4c	cmkcqahe60001wtnu5tdpajsw	cmknczvzj001xwt5vuzuu9n7w	1	11:00	11:40	\N	2026-01-21 01:48:36.042	2026-01-21 01:48:36.042	\N
cmknd6h6v001pwthq10jass27	cmkncnze00001wtppqb2g9djj	cmkcqaheh0003wtnunw60rohw	cmknczvyk001dwt5vi7rkbxo5	1	11:40	12:20	\N	2026-01-21 01:48:36.103	2026-01-21 01:48:36.103	\N
cmknd6h7u001rwthqpg88rzjg	cmkncrddn005dwtwoych0bxpy	cmknczvo40007wt5v54238qlg	cmknczw2v003gwt5vm245x3nn	1	11:40	12:20	\N	2026-01-21 01:48:36.139	2026-01-21 01:48:36.139	\N
cmknd6h82001twthqtj888b9a	cmkncrdts00a7wtwoelzag7t7	cmknczvob0008wt5vbcaiveme	cmknczw79004lwt5vo99xasgc	1	11:40	12:20	\N	2026-01-21 01:48:36.146	2026-01-21 01:48:36.146	\N
cmknd6h8r001vwthqhhzyr0rk	cmkncrent00g7wtwoyjt0ew6i	cmkcqahep0006wtnudtj6yy13	cmknczw19002owt5vg64ofn11	1	11:40	12:20	\N	2026-01-21 01:48:36.171	2026-01-21 01:48:36.171	\N
cmknd6h91001xwthqikeckae3	cmkncrfcr00m1wtwoqku9nb4c	cmkhi95c10000wthvv9x97v0s	cmknczw6g004gwt5vwxny9ms2	1	11:40	12:20	\N	2026-01-21 01:48:36.181	2026-01-21 01:48:36.181	\N
cmknd6h9a001zwthqkp3mkk8d	cmkncnze00001wtppqb2g9djj	cmknczvny0005wt5v52hgd4it	cmknczvzr0022wt5v81347bdf	1	12:40	13:20	\N	2026-01-21 01:48:36.191	2026-01-21 01:48:36.191	\N
cmknd6h9f0021wthqgdvconb4	cmkncrddn005dwtwoych0bxpy	cmknczvo40007wt5v54238qlg	cmknczw2v003gwt5vm245x3nn	1	12:40	13:20	\N	2026-01-21 01:48:36.195	2026-01-21 01:48:36.195	\N
cmknd6h9p0023wthqsomucafp	cmkncrdts00a7wtwoelzag7t7	cmknczvob0008wt5vbcaiveme	cmknczw79004lwt5vo99xasgc	1	12:40	13:20	\N	2026-01-21 01:48:36.205	2026-01-21 01:48:36.205	\N
cmknd6h9z0025wthqfveklhs2	cmkncrent00g7wtwoyjt0ew6i	cmkcqahep0006wtnudtj6yy13	cmknczw19002owt5vg64ofn11	1	12:40	13:20	\N	2026-01-21 01:48:36.215	2026-01-21 01:48:36.215	\N
cmknd6ha80027wthqg7qx7huf	cmkncrfcr00m1wtwoqku9nb4c	cmkcqahel0005wtnuaznbt7gi	cmknczw25002ywt5vbj6isuhg	1	12:40	13:20	\N	2026-01-21 01:48:36.224	2026-01-21 01:48:36.224	\N
cmknd6hac0029wthq7js39yll	cmkncnze00001wtppqb2g9djj	cmknczvny0005wt5v52hgd4it	cmknczvzr0022wt5v81347bdf	1	13:20	14:00	\N	2026-01-21 01:48:36.228	2026-01-21 01:48:36.228	\N
cmknd6hap002bwthqtapcm2ed	cmkncrddn005dwtwoych0bxpy	cmkcqahep0006wtnudtj6yy13	cmknczw19002owt5vg64ofn11	1	13:20	14:00	\N	2026-01-21 01:48:36.241	2026-01-21 01:48:36.241	\N
cmknd6haw002dwthq10o4cxzt	cmkncrdts00a7wtwoelzag7t7	cmkcqahep0006wtnudtj6yy13	cmknczw19002owt5vg64ofn11	1	13:20	14:00	\N	2026-01-21 01:48:36.248	2026-01-21 01:48:36.248	\N
cmknd6hba002fwthqkiycf17f	cmkncrent00g7wtwoyjt0ew6i	cmknczvob0008wt5vbcaiveme	cmknczw79004lwt5vo99xasgc	1	13:20	14:00	\N	2026-01-21 01:48:36.262	2026-01-21 01:48:36.262	\N
cmknd6hbn002hwthq2yqm1z2r	cmkncrfcr00m1wtwoqku9nb4c	cmkcqahel0005wtnuaznbt7gi	cmknczw25002ywt5vbj6isuhg	1	13:20	14:00	\N	2026-01-21 01:48:36.275	2026-01-21 01:48:36.275	\N
cmknd6hbr002jwthqverc2q4w	cmkncnze00001wtppqb2g9djj	cmkcqahep0006wtnudtj6yy13	cmknczw19002owt5vg64ofn11	2	07:20	08:00	\N	2026-01-21 01:48:36.279	2026-01-21 01:48:36.279	\N
cmknd6hc5002lwthqkrcj3xjt	cmkncrddn005dwtwoych0bxpy	cmkcqaheh0003wtnunw60rohw	cmknczvyk001dwt5vi7rkbxo5	2	07:20	08:00	\N	2026-01-21 01:48:36.294	2026-01-21 01:48:36.294	\N
cmknd6hfs002nwthq18d5c3o2	cmkncrdts00a7wtwoelzag7t7	cmkcqahej0004wtnufju43j2i	cmknczw0d002ewt5vh94dfbbj	2	07:20	08:00	\N	2026-01-21 01:48:36.424	2026-01-21 01:48:36.424	\N
cmknd6hfv002pwthqocbjbbja	cmkncrent00g7wtwoyjt0ew6i	cmkcqahel0005wtnuaznbt7gi	cmknczw25002ywt5vbj6isuhg	2	07:20	08:00	\N	2026-01-21 01:48:36.428	2026-01-21 01:48:36.428	\N
cmknd6hfz002rwthq8xcqo57v	cmkncrfcr00m1wtwoqku9nb4c	cmkcqaheh0003wtnunw60rohw	cmknczw3f003swt5vk9vd4h9a	2	07:20	08:00	\N	2026-01-21 01:48:36.431	2026-01-21 01:48:36.431	\N
cmknd6hg4002twthq4jyjmvie	cmkncnze00001wtppqb2g9djj	cmkcqahep0006wtnudtj6yy13	cmknczw19002owt5vg64ofn11	2	08:00	08:40	\N	2026-01-21 01:48:36.436	2026-01-21 01:48:36.436	\N
cmknd6hg7002vwthqqbf88gqd	cmkncrddn005dwtwoych0bxpy	cmkcqaheh0003wtnunw60rohw	cmknczvyk001dwt5vi7rkbxo5	2	08:00	08:40	\N	2026-01-21 01:48:36.44	2026-01-21 01:48:36.44	\N
cmknd6hgb002xwthqfzf1oy1e	cmkncrdts00a7wtwoelzag7t7	cmkcqahej0004wtnufju43j2i	cmknczw0d002ewt5vh94dfbbj	2	08:00	08:40	\N	2026-01-21 01:48:36.443	2026-01-21 01:48:36.443	\N
cmknd6hge002zwthq6rzov93n	cmkncrent00g7wtwoyjt0ew6i	cmkcqahel0005wtnuaznbt7gi	cmknczw25002ywt5vbj6isuhg	2	08:00	08:40	\N	2026-01-21 01:48:36.447	2026-01-21 01:48:36.447	\N
cmknd6hgi0031wthqelttz0yh	cmkncrfcr00m1wtwoqku9nb4c	cmkcqaheh0003wtnunw60rohw	cmknczw3f003swt5vk9vd4h9a	2	08:00	08:40	\N	2026-01-21 01:48:36.45	2026-01-21 01:48:36.45	\N
cmknd6hgl0033wthqvhdtsufy	cmkncnze00001wtppqb2g9djj	cmknczvoe0009wt5vlgeecis5	cmknczw37003nwt5var7s947b	2	08:40	09:20	\N	2026-01-21 01:48:36.454	2026-01-21 01:48:36.454	\N
cmknd6hgp0035wthq1jdsow69	cmkncrddn005dwtwoych0bxpy	cmkcqahel0005wtnuaznbt7gi	cmknczw25002ywt5vbj6isuhg	2	08:40	09:20	\N	2026-01-21 01:48:36.457	2026-01-21 01:48:36.457	\N
cmknd6hgs0037wthqbmyguid9	cmkncrdts00a7wtwoelzag7t7	cmknczvnd0001wt5vvyfsdh3h	cmknczvth0014wt5vqlzfp61s	2	08:40	09:20	\N	2026-01-21 01:48:36.46	2026-01-21 01:48:36.46	\N
cmknd6hgv0039wthq0b6v0zxg	cmkncrent00g7wtwoyjt0ew6i	cmkcqaheh0003wtnunw60rohw	cmknczw3f003swt5vk9vd4h9a	2	08:40	09:20	\N	2026-01-21 01:48:36.464	2026-01-21 01:48:36.464	\N
cmknd6hgz003bwthqysz45nic	cmkncrfcr00m1wtwoqku9nb4c	cmkcqahep0006wtnudtj6yy13	cmknczw19002owt5vg64ofn11	2	08:40	09:20	\N	2026-01-21 01:48:36.468	2026-01-21 01:48:36.468	\N
cmknd6hh3003dwthqvcf1li4c	cmkncnze00001wtppqb2g9djj	cmknczvoe0009wt5vlgeecis5	cmknczw37003nwt5var7s947b	2	09:20	10:00	\N	2026-01-21 01:48:36.471	2026-01-21 01:48:36.471	\N
cmknd6hh6003fwthqhci3d1bu	cmkncrddn005dwtwoych0bxpy	cmkcqahel0005wtnuaznbt7gi	cmknczw25002ywt5vbj6isuhg	2	09:20	10:00	\N	2026-01-21 01:48:36.475	2026-01-21 01:48:36.475	\N
cmknd6hhd003hwthqayt3unv9	cmkncrdts00a7wtwoelzag7t7	cmknczvnd0001wt5vvyfsdh3h	cmknczvth0014wt5vqlzfp61s	2	09:20	10:00	\N	2026-01-21 01:48:36.481	2026-01-21 01:48:36.481	\N
cmknd6hhh003jwthq7dbzgsxo	cmkncrent00g7wtwoyjt0ew6i	cmkcqaheh0003wtnunw60rohw	cmknczw3f003swt5vk9vd4h9a	2	09:20	10:00	\N	2026-01-21 01:48:36.485	2026-01-21 01:48:36.485	\N
cmknd6hhk003lwthqdbqesqx3	cmkncrfcr00m1wtwoqku9nb4c	cmkcqahep0006wtnudtj6yy13	cmknczw19002owt5vg64ofn11	2	09:20	10:00	\N	2026-01-21 01:48:36.488	2026-01-21 01:48:36.488	\N
cmknd6hhn003nwthqfgr0q93d	cmkncnze00001wtppqb2g9djj	cmkcqahe60001wtnu5tdpajsw	cmknczvzj001xwt5vuzuu9n7w	2	10:20	11:00	\N	2026-01-21 01:48:36.491	2026-01-21 01:48:36.491	\N
cmknd6hhq003pwthqxfzmtc6h	cmkncrddn005dwtwoych0bxpy	cmkcqahef0002wtnukb544l3q	cmknczvpp000mwt5vwf0ylf90	2	10:20	11:00	\N	2026-01-21 01:48:36.494	2026-01-21 01:48:36.494	\N
cmknd6hhu003rwthqkku4mw8o	cmkncrdts00a7wtwoelzag7t7	cmkcqaheh0003wtnunw60rohw	cmknczvyk001dwt5vi7rkbxo5	2	10:20	11:00	\N	2026-01-21 01:48:36.498	2026-01-21 01:48:36.498	\N
cmknd6hhy003twthqmm11h0mi	cmkncrent00g7wtwoyjt0ew6i	cmknczvoe0009wt5vlgeecis5	cmknczw37003nwt5var7s947b	2	10:20	11:00	\N	2026-01-21 01:48:36.502	2026-01-21 01:48:36.502	\N
cmknd6hi2003vwthqfaehhh33	cmkncrfcr00m1wtwoqku9nb4c	cmkcqahel0005wtnuaznbt7gi	cmknczw25002ywt5vbj6isuhg	2	10:20	11:00	\N	2026-01-21 01:48:36.506	2026-01-21 01:48:36.506	\N
cmknd6hi6003xwthqjvjyd4a1	cmkncnze00001wtppqb2g9djj	cmkcqahe60001wtnu5tdpajsw	cmknczvzj001xwt5vuzuu9n7w	2	11:00	11:40	\N	2026-01-21 01:48:36.51	2026-01-21 01:48:36.51	\N
cmknd6hi9003zwthqbmxa65ux	cmkncrddn005dwtwoych0bxpy	cmkcqahef0002wtnukb544l3q	cmknczvpp000mwt5vwf0ylf90	2	11:00	11:40	\N	2026-01-21 01:48:36.513	2026-01-21 01:48:36.513	\N
cmknd6hid0041wthqmmknr4ls	cmkncrdts00a7wtwoelzag7t7	cmkcqaheh0003wtnunw60rohw	cmknczvyk001dwt5vi7rkbxo5	2	11:00	11:40	\N	2026-01-21 01:48:36.518	2026-01-21 01:48:36.518	\N
cmknd6him0043wthq4xuxse9x	cmkncrent00g7wtwoyjt0ew6i	cmknczvoe0009wt5vlgeecis5	cmknczw37003nwt5var7s947b	2	11:00	11:40	\N	2026-01-21 01:48:36.526	2026-01-21 01:48:36.526	\N
cmknd6hip0045wthqq13h8jai	cmkncrfcr00m1wtwoqku9nb4c	cmkcqahel0005wtnuaznbt7gi	cmknczw25002ywt5vbj6isuhg	2	11:00	11:40	\N	2026-01-21 01:48:36.529	2026-01-21 01:48:36.529	\N
cmknd6his0047wthqbj2jhozz	cmkncnze00001wtppqb2g9djj	cmkcqahel0005wtnuaznbt7gi	cmknczw25002ywt5vbj6isuhg	2	11:40	12:20	\N	2026-01-21 01:48:36.533	2026-01-21 01:48:36.533	\N
cmknd6hix0049wthq4l2vjaqk	cmkncrddn005dwtwoych0bxpy	cmkcqahef0002wtnukb544l3q	cmknczvpp000mwt5vwf0ylf90	2	11:40	12:20	\N	2026-01-21 01:48:36.537	2026-01-21 01:48:36.537	\N
cmknd6hj0004bwthqmdyslebu	cmkncrdts00a7wtwoelzag7t7	cmkcqaheh0003wtnunw60rohw	cmknczvyk001dwt5vi7rkbxo5	2	11:40	12:20	\N	2026-01-21 01:48:36.54	2026-01-21 01:48:36.54	\N
cmknd6hj3004dwthqkpomdkfe	cmkncrent00g7wtwoyjt0ew6i	cmkcqahe60001wtnu5tdpajsw	cmknczvzj001xwt5vuzuu9n7w	2	11:40	12:20	\N	2026-01-21 01:48:36.543	2026-01-21 01:48:36.543	\N
cmknd6hja004fwthqtr6z3jbw	cmkncrfcr00m1wtwoqku9nb4c	cmknczvo40007wt5v54238qlg	cmknczw2v003gwt5vm245x3nn	2	11:40	12:20	\N	2026-01-21 01:48:36.55	2026-01-21 01:48:36.55	\N
cmknd6hjh004hwthq2cdg0ps3	cmkncnze00001wtppqb2g9djj	cmkcqahel0005wtnuaznbt7gi	cmknczw25002ywt5vbj6isuhg	2	12:40	13:20	\N	2026-01-21 01:48:36.557	2026-01-21 01:48:36.557	\N
cmknd6hjp004jwthq3zt8p71f	cmkncrddn005dwtwoych0bxpy	cmknczvnd0001wt5vvyfsdh3h	cmknczvth0014wt5vqlzfp61s	2	12:40	13:20	\N	2026-01-21 01:48:36.565	2026-01-21 01:48:36.565	\N
cmknd6hjx004lwthqviltsyx0	cmkncrdts00a7wtwoelzag7t7	cmkcqahef0002wtnukb544l3q	cmknczvpp000mwt5vwf0ylf90	2	12:40	13:20	\N	2026-01-21 01:48:36.573	2026-01-21 01:48:36.573	\N
cmknd6hk4004nwthqgmwto9gm	cmkncrent00g7wtwoyjt0ew6i	cmkcqahe60001wtnu5tdpajsw	cmknczvzj001xwt5vuzuu9n7w	2	12:40	13:20	\N	2026-01-21 01:48:36.581	2026-01-21 01:48:36.581	\N
cmknd6hkb004pwthq679nmxfv	cmkncrfcr00m1wtwoqku9nb4c	cmknczvo40007wt5v54238qlg	cmknczw2v003gwt5vm245x3nn	2	12:40	13:20	\N	2026-01-21 01:48:36.587	2026-01-21 01:48:36.587	\N
cmknd6hkj004rwthqczuzchvl	cmkncrddn005dwtwoych0bxpy	cmknczvnd0001wt5vvyfsdh3h	cmknczvth0014wt5vqlzfp61s	2	13:20	14:00	\N	2026-01-21 01:48:36.596	2026-01-21 01:48:36.596	\N
cmknd6hkr004twthqaw6ib7ls	cmkncrdts00a7wtwoelzag7t7	cmkcqahef0002wtnukb544l3q	cmknczvpp000mwt5vwf0ylf90	2	13:20	14:00	\N	2026-01-21 01:48:36.603	2026-01-21 01:48:36.603	\N
cmknd6hkx004vwthq5zclxc4a	cmkncrent00g7wtwoyjt0ew6i	cmkcqahe60001wtnu5tdpajsw	cmknczvzj001xwt5vuzuu9n7w	2	13:20	14:00	\N	2026-01-21 01:48:36.609	2026-01-21 01:48:36.609	\N
cmknd6hl4004xwthqokvm77to	cmkncnze00001wtppqb2g9djj	cmknczvob0008wt5vbcaiveme	cmknczw79004lwt5vo99xasgc	3	07:20	08:00	\N	2026-01-21 01:48:36.616	2026-01-21 01:48:36.616	\N
cmknd6hlc004zwthqq446vbyy	cmkncrddn005dwtwoych0bxpy	cmknczvny0005wt5v52hgd4it	cmknczvzr0022wt5v81347bdf	3	07:20	08:00	\N	2026-01-21 01:48:36.624	2026-01-21 01:48:36.624	\N
cmknd6hlj0051wthq8kx2q6xa	cmkncrdts00a7wtwoelzag7t7	cmkcqahep0006wtnudtj6yy13	cmknczw4a0044wt5vvzahvk8g	3	07:20	08:00	\N	2026-01-21 01:48:36.631	2026-01-21 01:48:36.631	\N
cmknd6hlp0053wthqmmm25vl5	cmkncrent00g7wtwoyjt0ew6i	cmkhi95c10000wthvv9x97v0s	cmknczw6g004gwt5vwxny9ms2	3	07:20	08:00	\N	2026-01-21 01:48:36.637	2026-01-21 01:48:36.637	\N
cmknd6hlx0055wthqezk7stw7	cmkncrfcr00m1wtwoqku9nb4c	cmknczvoe0009wt5vlgeecis5	cmknczw37003nwt5var7s947b	3	07:20	08:00	\N	2026-01-21 01:48:36.645	2026-01-21 01:48:36.645	\N
cmknd6hm50057wthqfmhr007g	cmkncnze00001wtppqb2g9djj	cmknczvob0008wt5vbcaiveme	cmknczw79004lwt5vo99xasgc	3	08:00	08:40	\N	2026-01-21 01:48:36.653	2026-01-21 01:48:36.653	\N
cmknd6hma0059wthq10efwnjq	cmkncrddn005dwtwoych0bxpy	cmknczvny0005wt5v52hgd4it	cmknczvzr0022wt5v81347bdf	3	08:00	08:40	\N	2026-01-21 01:48:36.658	2026-01-21 01:48:36.658	\N
cmknd6hmc005bwthq2wk5wu8j	cmkncrdts00a7wtwoelzag7t7	cmkcqahep0006wtnudtj6yy13	cmknczw4a0044wt5vvzahvk8g	3	08:00	08:40	\N	2026-01-21 01:48:36.66	2026-01-21 01:48:36.66	\N
cmknd6hmi005dwthqh8q2rns9	cmkncrent00g7wtwoyjt0ew6i	cmkhi95c10000wthvv9x97v0s	cmknczw6g004gwt5vwxny9ms2	3	08:00	08:40	\N	2026-01-21 01:48:36.666	2026-01-21 01:48:36.666	\N
cmknd6hnz005fwthqwpp9i5jx	cmkncrfcr00m1wtwoqku9nb4c	cmknczvoe0009wt5vlgeecis5	cmknczw37003nwt5var7s947b	3	08:00	08:40	\N	2026-01-21 01:48:36.719	2026-01-21 01:48:36.719	\N
cmknd6hon005hwthqrc8m6e1o	cmkncnze00001wtppqb2g9djj	cmknczvo10006wt5v92jjgqe7	cmknczw030027wt5vsztmofy7	3	08:40	09:20	\N	2026-01-21 01:48:36.743	2026-01-21 01:48:36.743	\N
cmknd6hoq005jwthqybgbua7g	cmkncrddn005dwtwoych0bxpy	cmkcqahep0006wtnudtj6yy13	cmknczw19002owt5vg64ofn11	3	08:40	09:20	\N	2026-01-21 01:48:36.746	2026-01-21 01:48:36.746	\N
cmknd6hot005lwthqjg1kmn0r	cmkncrdts00a7wtwoelzag7t7	cmknczvny0005wt5v52hgd4it	cmknczvzr0022wt5v81347bdf	3	08:40	09:20	\N	2026-01-21 01:48:36.749	2026-01-21 01:48:36.749	\N
cmknd6how005nwthqkbbo6221	cmkncrent00g7wtwoyjt0ew6i	cmkcqahep0006wtnudtj6yy13	cmknczw4a0044wt5vvzahvk8g	3	08:40	09:20	\N	2026-01-21 01:48:36.752	2026-01-21 01:48:36.752	\N
cmknd6hoy005pwthqkp355udh	cmkncrfcr00m1wtwoqku9nb4c	cmkhi95c10000wthvv9x97v0s	cmknczw6g004gwt5vwxny9ms2	3	08:40	09:20	\N	2026-01-21 01:48:36.755	2026-01-21 01:48:36.755	\N
cmknd6hp0005rwthquzbdjyn3	cmkncnze00001wtppqb2g9djj	cmknczvo10006wt5v92jjgqe7	cmknczw030027wt5vsztmofy7	3	09:20	10:00	\N	2026-01-21 01:48:36.757	2026-01-21 01:48:36.757	\N
cmknd6hp4005twthqmjf4tdqh	cmkncrddn005dwtwoych0bxpy	cmkcqahep0006wtnudtj6yy13	cmknczw19002owt5vg64ofn11	3	09:20	10:00	\N	2026-01-21 01:48:36.76	2026-01-21 01:48:36.76	\N
cmknd6hpc005vwthqobyscb6k	cmkncrdts00a7wtwoelzag7t7	cmknczvny0005wt5v52hgd4it	cmknczvzr0022wt5v81347bdf	3	09:20	10:00	\N	2026-01-21 01:48:36.769	2026-01-21 01:48:36.769	\N
cmknd6hpf005xwthqtss2neni	cmkncrent00g7wtwoyjt0ew6i	cmkcqahep0006wtnudtj6yy13	cmknczw4a0044wt5vvzahvk8g	3	09:20	10:00	\N	2026-01-21 01:48:36.771	2026-01-21 01:48:36.771	\N
cmknd6hph005zwthqctkbvz3t	cmkncrfcr00m1wtwoqku9nb4c	cmkhi95c10000wthvv9x97v0s	cmknczw6g004gwt5vwxny9ms2	3	09:20	10:00	\N	2026-01-21 01:48:36.773	2026-01-21 01:48:36.773	\N
cmknd6hpr0061wthqk08126rp	cmkncnze00001wtppqb2g9djj	cmkhi95c10000wthvv9x97v0s	cmknczw6g004gwt5vwxny9ms2	3	10:20	11:00	\N	2026-01-21 01:48:36.783	2026-01-21 01:48:36.783	\N
cmknd6hpv0063wthq2ombd6oo	cmkncrddn005dwtwoych0bxpy	cmknczvoe0009wt5vlgeecis5	cmknczw37003nwt5var7s947b	3	10:20	11:00	\N	2026-01-21 01:48:36.787	2026-01-21 01:48:36.787	\N
cmknd6hpz0065wthqwtvtkekr	cmkncrdts00a7wtwoelzag7t7	cmkcqaheh0003wtnunw60rohw	cmknczw3f003swt5vk9vd4h9a	3	10:20	11:00	\N	2026-01-21 01:48:36.792	2026-01-21 01:48:36.792	\N
cmknd6hq30067wthq8jpl5psm	cmkncrent00g7wtwoyjt0ew6i	cmknczvny0005wt5v52hgd4it	cmknczvzr0022wt5v81347bdf	3	10:20	11:00	\N	2026-01-21 01:48:36.795	2026-01-21 01:48:36.795	\N
cmknd6hq60069wthq3rrd7qdv	cmkncrfcr00m1wtwoqku9nb4c	cmkcqahep0006wtnudtj6yy13	cmknczw4a0044wt5vvzahvk8g	3	10:20	11:00	\N	2026-01-21 01:48:36.798	2026-01-21 01:48:36.798	\N
cmknd6hqb006bwthqpy7tw9f5	cmkncnze00001wtppqb2g9djj	cmkhi95c10000wthvv9x97v0s	cmknczw6g004gwt5vwxny9ms2	3	11:00	11:40	\N	2026-01-21 01:48:36.803	2026-01-21 01:48:36.803	\N
cmknd6hqp006dwthq4j7q1kqp	cmkncrddn005dwtwoych0bxpy	cmknczvoe0009wt5vlgeecis5	cmknczw37003nwt5var7s947b	3	11:00	11:40	\N	2026-01-21 01:48:36.817	2026-01-21 01:48:36.817	\N
cmknd6hqt006fwthq3f66g735	cmkncrdts00a7wtwoelzag7t7	cmkcqaheh0003wtnunw60rohw	cmknczw3f003swt5vk9vd4h9a	3	11:00	11:40	\N	2026-01-21 01:48:36.821	2026-01-21 01:48:36.821	\N
cmknd6hqx006hwthqfiik6uvg	cmkncrent00g7wtwoyjt0ew6i	cmknczvny0005wt5v52hgd4it	cmknczvzr0022wt5v81347bdf	3	11:00	11:40	\N	2026-01-21 01:48:36.826	2026-01-21 01:48:36.826	\N
cmknd6hr4006jwthqnodswqta	cmkncrfcr00m1wtwoqku9nb4c	cmkcqahep0006wtnudtj6yy13	cmknczw4a0044wt5vvzahvk8g	3	11:00	11:40	\N	2026-01-21 01:48:36.833	2026-01-21 01:48:36.833	\N
cmknd6hr9006lwthqo1f8s2en	cmkncnze00001wtppqb2g9djj	cmkcqahep0006wtnudtj6yy13	cmknczw4a0044wt5vvzahvk8g	3	11:40	12:20	\N	2026-01-21 01:48:36.837	2026-01-21 01:48:36.837	\N
cmknd6hrd006nwthqcu5n9owt	cmkncrddn005dwtwoych0bxpy	cmkcqaheh0003wtnunw60rohw	cmknczw3f003swt5vk9vd4h9a	3	11:40	12:20	\N	2026-01-21 01:48:36.842	2026-01-21 01:48:36.842	\N
cmknd6hrh006pwthqxku5hpum	cmkncrdts00a7wtwoelzag7t7	cmkcqahe60001wtnu5tdpajsw	cmknczvzj001xwt5vuzuu9n7w	3	11:40	12:20	\N	2026-01-21 01:48:36.846	2026-01-21 01:48:36.846	\N
cmknd6hrl006rwthqc8c8w19t	cmkncrent00g7wtwoyjt0ew6i	cmknczvo10006wt5v92jjgqe7	cmknczw030027wt5vsztmofy7	3	11:40	12:20	\N	2026-01-21 01:48:36.849	2026-01-21 01:48:36.849	\N
cmknd6hro006twthqdj6r8bim	cmkncrfcr00m1wtwoqku9nb4c	cmknczvny0005wt5v52hgd4it	cmknczvzr0022wt5v81347bdf	3	11:40	12:20	\N	2026-01-21 01:48:36.853	2026-01-21 01:48:36.853	\N
cmknd6hrr006vwthqeumcm384	cmkncnze00001wtppqb2g9djj	cmkcqahep0006wtnudtj6yy13	cmknczw4a0044wt5vvzahvk8g	3	12:40	13:20	\N	2026-01-21 01:48:36.855	2026-01-21 01:48:36.855	\N
cmknd6hrv006xwthqfawcnwzt	cmkncrddn005dwtwoych0bxpy	cmkcqaheh0003wtnunw60rohw	cmknczw3f003swt5vk9vd4h9a	3	12:40	13:20	\N	2026-01-21 01:48:36.859	2026-01-21 01:48:36.859	\N
cmknd6hry006zwthq3wq7gt60	cmkncrdts00a7wtwoelzag7t7	cmkcqahe60001wtnu5tdpajsw	cmknczvzj001xwt5vuzuu9n7w	3	12:40	13:20	\N	2026-01-21 01:48:36.862	2026-01-21 01:48:36.862	\N
cmknd6hs20071wthqwmf9bqqh	cmkncrent00g7wtwoyjt0ew6i	cmknczvo10006wt5v92jjgqe7	cmknczw030027wt5vsztmofy7	3	12:40	13:20	\N	2026-01-21 01:48:36.866	2026-01-21 01:48:36.866	\N
cmknd6hs70073wthqal1cj3r4	cmkncrfcr00m1wtwoqku9nb4c	cmknczvny0005wt5v52hgd4it	cmknczvzr0022wt5v81347bdf	3	12:40	13:20	\N	2026-01-21 01:48:36.871	2026-01-21 01:48:36.871	\N
cmknd6hsb0075wthqzs3erypp	cmkncnze00001wtppqb2g9djj	cmknczvni0002wt5v3c1sz6fa	cmknczw0l002jwt5vur6yuipa	4	07:20	08:00	\N	2026-01-21 01:48:36.875	2026-01-21 01:48:36.875	\N
cmknd6hsh0077wthqrq1a8tnh	cmkncrddn005dwtwoych0bxpy	cmknczvo10006wt5v92jjgqe7	cmknczw030027wt5vsztmofy7	4	07:20	08:00	\N	2026-01-21 01:48:36.881	2026-01-21 01:48:36.881	\N
cmknd6hsl0079wthqngsvp1c0	cmkncrdts00a7wtwoelzag7t7	cmknczvoe0009wt5vlgeecis5	cmknczw37003nwt5var7s947b	4	07:20	08:00	\N	2026-01-21 01:48:36.885	2026-01-21 01:48:36.885	\N
cmknd6hso007bwthq2awwsg6x	cmkncrent00g7wtwoyjt0ew6i	cmkcqahej0004wtnufju43j2i	cmknczw0d002ewt5vh94dfbbj	4	07:20	08:00	\N	2026-01-21 01:48:36.888	2026-01-21 01:48:36.888	\N
cmknd6hsw007dwthqhw6dw5cz	cmkncrfcr00m1wtwoqku9nb4c	cmkcqahef0002wtnukb544l3q	cmknczvpp000mwt5vwf0ylf90	4	07:20	08:00	\N	2026-01-21 01:48:36.897	2026-01-21 01:48:36.897	\N
cmknd6ht5007fwthqfq727fzv	cmkncnze00001wtppqb2g9djj	cmknczvni0002wt5v3c1sz6fa	cmknczw0l002jwt5vur6yuipa	4	08:00	08:40	\N	2026-01-21 01:48:36.905	2026-01-21 01:48:36.905	\N
cmknd6htd007hwthq05av29yz	cmkncrddn005dwtwoych0bxpy	cmknczvo10006wt5v92jjgqe7	cmknczw030027wt5vsztmofy7	4	08:00	08:40	\N	2026-01-21 01:48:36.913	2026-01-21 01:48:36.913	\N
cmknd6hth007jwthqve09eoeg	cmkncrdts00a7wtwoelzag7t7	cmknczvoe0009wt5vlgeecis5	cmknczw37003nwt5var7s947b	4	08:00	08:40	\N	2026-01-21 01:48:36.917	2026-01-21 01:48:36.917	\N
cmknd6htl007lwthqdvwh32i6	cmkncrent00g7wtwoyjt0ew6i	cmkcqahej0004wtnufju43j2i	cmknczw0d002ewt5vh94dfbbj	4	08:00	08:40	\N	2026-01-21 01:48:36.922	2026-01-21 01:48:36.922	\N
cmknd6hx6007nwthqpc36tgmg	cmkncrfcr00m1wtwoqku9nb4c	cmkcqahef0002wtnukb544l3q	cmknczvpp000mwt5vwf0ylf90	4	08:00	08:40	\N	2026-01-21 01:48:37.05	2026-01-21 01:48:37.05	\N
cmknd6hxe007pwthq6ec9l46x	cmkncnze00001wtppqb2g9djj	cmknczvo40007wt5v54238qlg	cmknczw2v003gwt5vm245x3nn	4	08:40	09:20	\N	2026-01-21 01:48:37.058	2026-01-21 01:48:37.058	\N
cmknd6hxi007rwthqeobmewbk	cmkncrddn005dwtwoych0bxpy	cmknczvni0002wt5v3c1sz6fa	cmknczw0l002jwt5vur6yuipa	4	08:40	09:20	\N	2026-01-21 01:48:37.062	2026-01-21 01:48:37.062	\N
cmknd6hxl007twthqxrfdcpi9	cmkncrdts00a7wtwoelzag7t7	cmknczvo10006wt5v92jjgqe7	cmknczw030027wt5vsztmofy7	4	08:40	09:20	\N	2026-01-21 01:48:37.065	2026-01-21 01:48:37.065	\N
cmknd6hxv007vwthqozydrwga	cmkncrfcr00m1wtwoqku9nb4c	cmkcqahef0002wtnukb544l3q	cmknczvpp000mwt5vwf0ylf90	4	08:40	09:20	\N	2026-01-21 01:48:37.076	2026-01-21 01:48:37.076	\N
cmknd6hy5007xwthqjkfuovx8	cmkncnze00001wtppqb2g9djj	cmknczvo40007wt5v54238qlg	cmknczw2v003gwt5vm245x3nn	4	09:20	10:00	\N	2026-01-21 01:48:37.085	2026-01-21 01:48:37.085	\N
cmknd6hya007zwthqffw9r5lq	cmkncrddn005dwtwoych0bxpy	cmknczvni0002wt5v3c1sz6fa	cmknczw0l002jwt5vur6yuipa	4	09:20	10:00	\N	2026-01-21 01:48:37.09	2026-01-21 01:48:37.09	\N
cmknd6hyi0081wthq6gxwmrte	cmkncrdts00a7wtwoelzag7t7	cmknczvo10006wt5v92jjgqe7	cmknczw030027wt5vsztmofy7	4	09:20	10:00	\N	2026-01-21 01:48:37.099	2026-01-21 01:48:37.099	\N
cmknd6hym0083wthqsb0lvfmj	cmkncrent00g7wtwoyjt0ew6i	cmkcqahef0002wtnukb544l3q	cmknczvpp000mwt5vwf0ylf90	4	09:20	10:00	\N	2026-01-21 01:48:37.102	2026-01-21 01:48:37.102	\N
cmknd6hyq0085wthq8sjbj8wh	cmkncnze00001wtppqb2g9djj	cmkcqahep0006wtnudtj6yy13	cmknczw4a0044wt5vvzahvk8g	4	10:20	11:00	\N	2026-01-21 01:48:37.106	2026-01-21 01:48:37.106	\N
cmknd6hyy0087wthqnok624bz	cmkncrddn005dwtwoych0bxpy	cmkhi95c10000wthvv9x97v0s	cmknczw6g004gwt5vwxny9ms2	4	10:20	11:00	\N	2026-01-21 01:48:37.114	2026-01-21 01:48:37.114	\N
cmknd6hz40089wthqruw6fhhc	cmkncrdts00a7wtwoelzag7t7	cmknczvni0002wt5v3c1sz6fa	cmknczw0l002jwt5vur6yuipa	4	10:20	11:00	\N	2026-01-21 01:48:37.121	2026-01-21 01:48:37.121	\N
cmknd6hz8008bwthqmyqlnwvo	cmkncrent00g7wtwoyjt0ew6i	cmkcqahef0002wtnukb544l3q	cmknczvpp000mwt5vwf0ylf90	4	10:20	11:00	\N	2026-01-21 01:48:37.123	2026-01-21 01:48:37.123	\N
cmknd6hzd008dwthqtlvnpl0l	cmkncrfcr00m1wtwoqku9nb4c	cmkcqahej0004wtnufju43j2i	cmknczw0d002ewt5vh94dfbbj	4	10:20	11:00	\N	2026-01-21 01:48:37.129	2026-01-21 01:48:37.129	\N
cmknd6hzl008fwthqr8tdnzut	cmkncnze00001wtppqb2g9djj	cmkcqahep0006wtnudtj6yy13	cmknczw4a0044wt5vvzahvk8g	4	11:00	11:40	\N	2026-01-21 01:48:37.137	2026-01-21 01:48:37.137	\N
cmknd6hzn008hwthqfq40mjef	cmkncrddn005dwtwoych0bxpy	cmkhi95c10000wthvv9x97v0s	cmknczw6g004gwt5vwxny9ms2	4	11:00	11:40	\N	2026-01-21 01:48:37.14	2026-01-21 01:48:37.14	\N
cmknd6hzp008jwthqllwojziv	cmkncrdts00a7wtwoelzag7t7	cmknczvni0002wt5v3c1sz6fa	cmknczw0l002jwt5vur6yuipa	4	11:00	11:40	\N	2026-01-21 01:48:37.142	2026-01-21 01:48:37.142	\N
cmknd6hzs008lwthqwkd1cqkn	cmkncrent00g7wtwoyjt0ew6i	cmkcqahef0002wtnukb544l3q	cmknczvpp000mwt5vwf0ylf90	4	11:00	11:40	\N	2026-01-21 01:48:37.144	2026-01-21 01:48:37.144	\N
cmknd6hzw008nwthqelxsdfkx	cmkncrfcr00m1wtwoqku9nb4c	cmkcqahej0004wtnufju43j2i	cmknczw0d002ewt5vh94dfbbj	4	11:00	11:40	\N	2026-01-21 01:48:37.148	2026-01-21 01:48:37.148	\N
cmknd6hzz008pwthqdk55n7m1	cmkncnze00001wtppqb2g9djj	cmkcqahep0006wtnudtj6yy13	cmknczw4a0044wt5vvzahvk8g	4	11:40	12:20	\N	2026-01-21 01:48:37.152	2026-01-21 01:48:37.152	\N
cmknd6i02008rwthqv316uvwc	cmkncrddn005dwtwoych0bxpy	cmkhi95c10000wthvv9x97v0s	cmknczw6g004gwt5vwxny9ms2	4	11:40	12:20	\N	2026-01-21 01:48:37.154	2026-01-21 01:48:37.154	\N
cmknd6i04008twthqqrd4c38e	cmkncrdts00a7wtwoelzag7t7	cmknczvni0002wt5v3c1sz6fa	cmknczw0l002jwt5vur6yuipa	4	11:40	12:20	\N	2026-01-21 01:48:37.156	2026-01-21 01:48:37.156	\N
cmknd6i07008vwthq542cdcje	cmkncrent00g7wtwoyjt0ew6i	cmknczvo10006wt5v92jjgqe7	cmknczw030027wt5vsztmofy7	4	11:40	12:20	\N	2026-01-21 01:48:37.159	2026-01-21 01:48:37.159	\N
cmknd6i0b008xwthqf6jaz3vb	cmkncrfcr00m1wtwoqku9nb4c	cmkcqahel0005wtnuaznbt7gi	cmknczw25002ywt5vbj6isuhg	4	11:40	12:20	\N	2026-01-21 01:48:37.163	2026-01-21 01:48:37.163	\N
cmknd6i0e008zwthq2ko1jag8	cmkncnze00001wtppqb2g9djj	cmkcqahef0002wtnukb544l3q	cmknczvpp000mwt5vwf0ylf90	4	12:40	13:20	\N	2026-01-21 01:48:37.166	2026-01-21 01:48:37.166	\N
cmknd6i0h0091wthqeacuk2ka	cmkncrddn005dwtwoych0bxpy	cmkcqahep0006wtnudtj6yy13	cmknczw4a0044wt5vvzahvk8g	4	12:40	13:20	\N	2026-01-21 01:48:37.169	2026-01-21 01:48:37.169	\N
cmknd6i0j0093wthqgl0ukua5	cmkncrdts00a7wtwoelzag7t7	cmkhi95c10000wthvv9x97v0s	cmknczw6g004gwt5vwxny9ms2	4	12:40	13:20	\N	2026-01-21 01:48:37.171	2026-01-21 01:48:37.171	\N
cmknd6i0n0095wthq7q2df688	cmkncrent00g7wtwoyjt0ew6i	cmknczvni0002wt5v3c1sz6fa	cmknczw0l002jwt5vur6yuipa	4	12:40	13:20	\N	2026-01-21 01:48:37.176	2026-01-21 01:48:37.176	\N
cmknd6i0x0097wthq4nw2o4a2	cmkncrfcr00m1wtwoqku9nb4c	cmknczvo10006wt5v92jjgqe7	cmknczw030027wt5vsztmofy7	4	12:40	13:20	\N	2026-01-21 01:48:37.178	2026-01-21 01:48:37.178	\N
cmknd6i150099wthqbnemgb5c	cmkncnze00001wtppqb2g9djj	cmkcqahef0002wtnukb544l3q	cmknczvpp000mwt5vwf0ylf90	5	07:20	08:00	\N	2026-01-21 01:48:37.194	2026-01-21 01:48:37.194	\N
cmknd6i18009bwthqy5lsa0ki	cmkncrddn005dwtwoych0bxpy	cmkcqaheh0003wtnunw60rohw	cmknczw3f003swt5vk9vd4h9a	5	07:20	08:00	\N	2026-01-21 01:48:37.197	2026-01-21 01:48:37.197	\N
cmknd6i2n009dwthqpb7hmkog	cmkncrdts00a7wtwoelzag7t7	cmkcqahej0004wtnufju43j2i	cmknczw0d002ewt5vh94dfbbj	5	07:20	08:00	\N	2026-01-21 01:48:37.247	2026-01-21 01:48:37.247	\N
cmknd6i2u009fwthqzac49nkx	cmkncrent00g7wtwoyjt0ew6i	cmkcqahel0005wtnuaznbt7gi	cmknczw25002ywt5vbj6isuhg	5	07:20	08:00	\N	2026-01-21 01:48:37.254	2026-01-21 01:48:37.254	\N
cmknd6i32009hwthqe6ytr3ww	cmkncrfcr00m1wtwoqku9nb4c	cmkcqahep0006wtnudtj6yy13	cmknczw4a0044wt5vvzahvk8g	5	07:20	08:00	\N	2026-01-21 01:48:37.263	2026-01-21 01:48:37.263	\N
cmknd6i3a009jwthq0ntxfrn3	cmkncnze00001wtppqb2g9djj	cmkcqahef0002wtnukb544l3q	cmknczvpp000mwt5vwf0ylf90	5	08:00	08:40	\N	2026-01-21 01:48:37.27	2026-01-21 01:48:37.27	\N
cmknd6i3h009lwthq2edeqnjc	cmkncrddn005dwtwoych0bxpy	cmkcqaheh0003wtnunw60rohw	cmknczw3f003swt5vk9vd4h9a	5	08:00	08:40	\N	2026-01-21 01:48:37.278	2026-01-21 01:48:37.278	\N
cmknd6i3r009nwthqrcaaqbwa	cmkncrdts00a7wtwoelzag7t7	cmkcqahej0004wtnufju43j2i	cmknczw0d002ewt5vh94dfbbj	5	08:00	08:40	\N	2026-01-21 01:48:37.288	2026-01-21 01:48:37.288	\N
cmknd6i43009pwthqykmh9kpb	cmkncrent00g7wtwoyjt0ew6i	cmkcqahel0005wtnuaznbt7gi	cmknczw25002ywt5vbj6isuhg	5	08:00	08:40	\N	2026-01-21 01:48:37.299	2026-01-21 01:48:37.299	\N
cmknd6i48009rwthqufrknewu	cmkncrfcr00m1wtwoqku9nb4c	cmkcqahep0006wtnudtj6yy13	cmknczw4a0044wt5vvzahvk8g	5	08:00	08:40	\N	2026-01-21 01:48:37.304	2026-01-21 01:48:37.304	\N
cmknd6i4c009twthqr1sz38y9	cmkncnze00001wtppqb2g9djj	cmkcqahef0002wtnukb544l3q	cmknczvpp000mwt5vwf0ylf90	5	08:40	09:20	\N	2026-01-21 01:48:37.308	2026-01-21 01:48:37.308	\N
cmknd6i4g009vwthq8ve7y4ij	cmkncrddn005dwtwoych0bxpy	cmkcqaheh0003wtnunw60rohw	cmknczw3f003swt5vk9vd4h9a	5	08:40	09:20	\N	2026-01-21 01:48:37.312	2026-01-21 01:48:37.312	\N
cmknd6i4k009xwthqpb28em45	cmkncrdts00a7wtwoelzag7t7	cmkcqahej0004wtnufju43j2i	cmknczw0d002ewt5vh94dfbbj	5	08:40	09:20	\N	2026-01-21 01:48:37.316	2026-01-21 01:48:37.316	\N
cmknd6i4p009zwthqny5dgk4j	cmkncrent00g7wtwoyjt0ew6i	cmkcqahel0005wtnuaznbt7gi	cmknczw25002ywt5vbj6isuhg	5	08:40	09:20	\N	2026-01-21 01:48:37.321	2026-01-21 01:48:37.321	\N
cmknd6i4t00a1wthqyxhbnnb5	cmkncrfcr00m1wtwoqku9nb4c	cmkcqahep0006wtnudtj6yy13	cmknczw4a0044wt5vvzahvk8g	5	08:40	09:20	\N	2026-01-21 01:48:37.325	2026-01-21 01:48:37.325	\N
cmknd6i4x00a3wthqu8qac24l	cmkncnze00001wtppqb2g9djj	cmkcqahep0006wtnudtj6yy13	cmknczw4a0044wt5vvzahvk8g	5	09:20	10:00	\N	2026-01-21 01:48:37.329	2026-01-21 01:48:37.329	\N
cmknd6i5100a5wthqtu90kty0	cmkncrddn005dwtwoych0bxpy	cmkcqahep0006wtnudtj6yy13	cmknczw19002owt5vg64ofn11	5	09:20	10:00	\N	2026-01-21 01:48:37.333	2026-01-21 01:48:37.333	\N
cmknd6i5500a7wthqa56b3e7s	cmkncrdts00a7wtwoelzag7t7	cmkcqahel0005wtnuaznbt7gi	cmknczw25002ywt5vbj6isuhg	5	09:20	10:00	\N	2026-01-21 01:48:37.338	2026-01-21 01:48:37.338	\N
cmknd6i5a00a9wthq1wh1gidm	cmkncrent00g7wtwoyjt0ew6i	cmknczvo10006wt5v92jjgqe7	cmknczw030027wt5vsztmofy7	5	09:20	10:00	\N	2026-01-21 01:48:37.342	2026-01-21 01:48:37.342	\N
cmknd6i5e00abwthqcntybd3n	cmkncrfcr00m1wtwoqku9nb4c	cmkcqahe60001wtnu5tdpajsw	cmknczvzj001xwt5vuzuu9n7w	5	09:20	10:00	\N	2026-01-21 01:48:37.346	2026-01-21 01:48:37.346	\N
cmknd6i5h00adwthq4txau2i2	cmkncnze00001wtppqb2g9djj	cmkcqahep0006wtnudtj6yy13	cmknczw4a0044wt5vvzahvk8g	5	10:20	11:00	\N	2026-01-21 01:48:37.35	2026-01-21 01:48:37.35	\N
cmknd6i5q00afwthqmcsym4ix	cmkncrddn005dwtwoych0bxpy	cmkcqahep0006wtnudtj6yy13	cmknczw19002owt5vg64ofn11	5	10:20	11:00	\N	2026-01-21 01:48:37.358	2026-01-21 01:48:37.358	\N
cmknd6i5w00ahwthqnjiw2u6j	cmkncrdts00a7wtwoelzag7t7	cmkcqahel0005wtnuaznbt7gi	cmknczw25002ywt5vbj6isuhg	5	10:20	11:00	\N	2026-01-21 01:48:37.364	2026-01-21 01:48:37.364	\N
cmknd6i6000ajwthq1m9cz8y6	cmkncrent00g7wtwoyjt0ew6i	cmknczvo10006wt5v92jjgqe7	cmknczw030027wt5vsztmofy7	5	10:20	11:00	\N	2026-01-21 01:48:37.369	2026-01-21 01:48:37.369	\N
cmknd6i6400alwthqrbcp4mc9	cmkncrfcr00m1wtwoqku9nb4c	cmkcqahe60001wtnu5tdpajsw	cmknczvzj001xwt5vuzuu9n7w	5	10:20	11:00	\N	2026-01-21 01:48:37.372	2026-01-21 01:48:37.372	\N
cmknd6i6d00anwthqpl7gm8kh	cmkncnze00001wtppqb2g9djj	cmknczvo40007wt5v54238qlg	cmknczw2v003gwt5vm245x3nn	5	11:00	11:40	\N	2026-01-21 01:48:37.381	2026-01-21 01:48:37.381	\N
cmknd6i6m00apwthqn7uoe39s	cmkncrddn005dwtwoych0bxpy	cmkcqahep0006wtnudtj6yy13	cmknczw4a0044wt5vvzahvk8g	5	11:00	11:40	\N	2026-01-21 01:48:37.39	2026-01-21 01:48:37.39	\N
cmknd6i6q00arwthq64dzpu99	cmkncrdts00a7wtwoelzag7t7	cmknczvny0005wt5v52hgd4it	cmknczvzr0022wt5v81347bdf	5	11:00	11:40	\N	2026-01-21 01:48:37.394	2026-01-21 01:48:37.394	\N
cmknd6i6u00atwthqghi5xvzg	cmkncrent00g7wtwoyjt0ew6i	cmknczvob0008wt5vbcaiveme	cmknczw79004lwt5vo99xasgc	5	11:00	11:40	\N	2026-01-21 01:48:37.398	2026-01-21 01:48:37.398	\N
cmknd6i6y00avwthqoeycqokh	cmkncrfcr00m1wtwoqku9nb4c	cmkcqahe60001wtnu5tdpajsw	cmknczvzj001xwt5vuzuu9n7w	5	11:00	11:40	\N	2026-01-21 01:48:37.402	2026-01-21 01:48:37.402	\N
\.


--
-- Data for Name: classes; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.classes (id, name, grade, major, "academicYearId", "homeroomTeacherId", capacity, "createdAt", "updatedAt", "deletedAt") FROM stdin;
cmkgu14bw0006wt0hxl6v0d7t	12-1	12	IPA	cmkgtzeh00000wt0hszjuewk2	cmkcqahex0008wtnut4douddi	36	2026-01-16 12:05:56.396	2026-01-16 12:23:42.68	\N
cmkguoavv0001wtt3y16n81eu	X-IPS	10	IPS	cmkgtzeh00000wt0hszjuewk2	cmkcqahes0007wtnumwa03r5h	36	2026-01-16 12:23:57.979	2026-01-16 12:24:12.114	2026-01-16 12:24:12.107
cmkhknck6000bwt1htyqozs35	10-A	10	IPA	ay-2024-2025	\N	36	2026-01-17 00:31:03.51	2026-01-18 10:30:20.848	2026-01-18 10:30:20.845
cmkhknckf000dwt1hkbz4vjzg	10-B	10	IPS	ay-2024-2025	\N	36	2026-01-17 00:31:03.519	2026-01-18 10:30:27.96	2026-01-18 10:30:27.958
cmkhkncki000fwt1hvd6l7v4f	11-A	11	IPA	ay-2024-2025	\N	36	2026-01-17 00:31:03.522	2026-01-18 10:30:35.808	2026-01-18 10:30:35.807
cmkhknckk000hwt1hm6hqrte9	12-A	12	IPA	ay-2024-2025	\N	36	2026-01-17 00:31:03.525	2026-01-18 10:30:44.945	2026-01-18 10:30:44.945
cmkm3wc730001wtmh685mwitb	12 IPA 1	12	IPA	ay-2024-2025	\N	36	2026-01-20 04:41:00.351	2026-01-20 04:41:00.351	\N
cmkmmk2j10001wti30abq0f3j	10-2	10	UMUM	cmkgtzeh00000wt0hszjuewk2	cmkm58pms0004wt26m94ljfjj	36	2026-01-20 13:23:20.65	2026-01-21 01:50:21.162	2026-01-21 01:50:21.161
cmkgu0a2j0002wt0huwitza0g	11-1	11	IPA	cmkgtzeh00000wt0hszjuewk2	cmkcqahes0007wtnumwa03r5h	36	2026-01-16 12:05:17.179	2026-01-20 13:24:04.368	\N
cmkgu0svq0004wt0hycu7eo2r	11-2	11	IPA	cmkgtzeh00000wt0hszjuewk2	cmkcqahes0007wtnumwa03r5h	36	2026-01-16 12:05:41.558	2026-01-20 13:24:09.707	\N
cmkncnze00001wtppqb2g9djj	X-1	10	UMUM	cmkgtzeh00000wt0hszjuewk2	cmknczvpp000mwt5vwf0ylf90	36	2026-01-21 01:34:13.224	2026-01-21 01:48:35.756	\N
cmkncrddn005dwtwoych0bxpy	X-2	10	UMUM	cmkgtzeh00000wt0hszjuewk2	cmknczw25002ywt5vbj6isuhg	36	2026-01-21 01:36:51.323	2026-01-21 01:48:35.76	\N
cmkncrdts00a7wtwoelzag7t7	X-3	10	UMUM	cmkgtzeh00000wt0hszjuewk2	cmknczw2v003gwt5vm245x3nn	36	2026-01-21 01:36:51.905	2026-01-21 01:48:35.763	\N
cmkncrent00g7wtwoyjt0ew6i	X-4	10	UMUM	cmkgtzeh00000wt0hszjuewk2	cmknczw19002owt5vg64ofn11	36	2026-01-21 01:36:52.985	2026-01-21 01:48:35.765	\N
cmkncrfcr00m1wtwoqku9nb4c	X-5	10	UMUM	cmkgtzeh00000wt0hszjuewk2	cmknczw4a0044wt5vvzahvk8g	36	2026-01-21 01:36:53.884	2026-01-21 01:48:35.768	\N
cmkgttvek0001wtnnsaxnweyf	10-1	10	UMUM	cmkgtzeh00000wt0hszjuewk2	cmkcqahf10009wtnup7lo37kp	36	2026-01-16 12:00:18.234	2026-01-21 01:50:17.341	2026-01-21 01:50:17.339
\.


--
-- Data for Name: curriculum_modules; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.curriculum_modules (id, "curriculumId", "subjectCode", grade, semester, title, description, competencies, "createdAt", "deletedAt") FROM stdin;
cmkhizvgl0002wthuazmta7i9	cmkhix7sq0000wthu7m8g6kwp	TIK	10	GANJIL	Berfikir Komputasional	Berfikir Komputasional	{}	2026-01-16 23:44:48.643	\N
\.


--
-- Data for Name: curriculums; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.curriculums (id, name, year, description, "isActive", "createdAt", "updatedAt", "deletedAt") FROM stdin;
cmkhix7sq0000wthu7m8g6kwp	Kurikulum Merdeka	2026		t	2026-01-16 23:42:44.66	2026-01-16 23:42:44.66	\N
\.


--
-- Data for Name: data_backups; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.data_backups (id, filename, size, type, status, "storageUrl", "createdBy", "createdAt", "completedAt") FROM stdin;
\.


--
-- Data for Name: dimensi_p7; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.dimensi_p7 (id, kode, "namaDimensi", deskripsi, elemen) FROM stdin;
cmkhknclc000mwt1hpdc6ahtx	D1	Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia	Pelajar Indonesia yang beriman dan bertakwa kepada Tuhan YME serta berakhlak mulia.	["Akhlak beragama", "Akhlak pribadi", "Akhlak kepada manusia", "Akhlak kepada alam", "Akhlak bernegara"]
cmkhknclj000nwt1hmd5b1zj9	D2	Berkebinekaan Global	Pelajar Indonesia mempertahankan budaya luhur, lokalitas dan identitasnya, dan tetap berpikiran terbuka dalam berinteraksi dengan budaya lain.	["Mengenal dan menghargai budaya", "Kemampuan komunikasi interkultural", "Refleksi dan tanggung jawab terhadap pengalaman kebinekaan", "Berkeadilan sosial"]
cmkhknclm000owt1hb6cgwbvu	D3	Bergotong Royong	Pelajar Indonesia memiliki kemampuan bergotong-royong, yaitu kemampuan untuk melakukan kegiatan secara bersama-sama.	["Kolaborasi", "Kepedulian", "Berbagi"]
cmkhknclo000pwt1h6p2gt4jq	D4	Mandiri	Pelajar Indonesia merupakan pelajar mandiri, yaitu pelajar yang bertanggung jawab atas proses dan hasil belajarnya.	["Kesadaran akan diri dan situasi yang dihadapi", "Regulasi diri"]
cmkhknclq000qwt1hyfdjuji3	D5	Bernalar Kritis	Pelajar yang bernalar kritis mampu secara objektif memproses informasi baik kualitatif maupun kuantitatif.	["Memperoleh dan memproses informasi dan gagasan", "Menganalisis dan mengevaluasi penalaran", "Merefleksi pemikiran dan proses berpikir"]
cmkhkncls000rwt1hrqa3rohb	D6	Kreatif	Pelajar yang kreatif mampu memodifikasi dan menghasilkan sesuatu yang orisinal, bermakna, bermanfaat, dan berdampak.	["Menghasilkan gagasan yang orisinal", "Menghasilkan karya dan tindakan yang orisinal", "Memiliki keluwesan berpikir dalam mencari alternatif solusi"]
\.


--
-- Data for Name: extracurricular_members; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.extracurricular_members (id, "extracurricularId", "studentId", role, "joinedAt", status) FROM stdin;
\.


--
-- Data for Name: extracurriculars; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.extracurriculars (id, name, category, description, schedule, location, "advisorId", "maxMembers", "isActive", "createdAt", "updatedAt") FROM stdin;
cmkgvm9bz0001wtlh68zd8mpg	Informatika 1	Teknologi	test	Kamis, 15:00	Lab Komputer	cmkcqahes0007wtnumwa03r5h	\N	t	2026-01-16 12:50:22.266	2026-01-16 12:50:50.156
cmkgvnkvg0003wtlhnmqv7b0f	Basket	Olahraga	Basket	Jumat, 14:00	Lapangan	cmkcqahes0007wtnumwa03r5h	\N	t	2026-01-16 12:51:23.884	2026-01-16 12:51:23.884
\.


--
-- Data for Name: facilities; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.facilities (id, "schoolId", name, category, quantity, area, condition, description, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: fee_types; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.fee_types (id, name, amount, frequency, description, "isActive", "createdAt", "updatedAt") FROM stdin;
spp-monthly	SPP Bulanan	1500000.00	MONTHLY	\N	t	2026-01-13 15:10:10.14	2026-01-13 15:10:10.14
\.


--
-- Data for Name: finance_transactions; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.finance_transactions (id, type, category, amount, description, date, "referenceNumber", "attachmentUrl", "createdBy", "createdAt") FROM stdin;
cmkhep88d0000wtflnt9n57o4	INCOME	Dana BOS	1500000000.00	Pemasukan dari dana bos	2026-01-16 00:00:00	ref	\N	\N	2026-01-16 21:44:33.517
cmkhepx7b0001wtflfyqt81lh	EXPENSE	Pemeliharaan	1000000.00	Pemeliharaann sistem	2026-01-16 00:00:00	Ref-123	\N	\N	2026-01-16 21:45:05.879
\.


--
-- Data for Name: gallery_items; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.gallery_items (id, "schoolId", title, category, "imageUrl", description, date, "createdAt") FROM stdin;
\.


--
-- Data for Name: grades; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.grades (id, "studentId", "subjectId", "academicYearId", semester, assignment1, assignment2, assignment3, "midtermExam", "finalExam", "practicalScore", "activityScore", "finalGrade", "letterGrade", description, "createdAt", "updatedAt") FROM stdin;
cmkm3xy9r000hwtucmp9w6svk	cmkm3xy870005wtuc8d6uen86	cmkcqahe60001wtnu5tdpajsw	ay-2024-2025	GANJIL	82	\N	\N	83	85	\N	\N	84	B	\N	2026-01-20 04:42:15.615	2026-01-20 04:42:15.615
cmkm3xyat000jwtucps10qoz6	cmkm3xy870005wtuc8d6uen86	cmkcqahe60001wtnu5tdpajsw	ay-2024-2025	GENAP	84	\N	\N	85	87	\N	\N	86	B	\N	2026-01-20 04:42:15.653	2026-01-20 04:42:15.653
cmkm3xyaz000lwtucs57w23te	cmkm3xy870005wtuc8d6uen86	cmkcqahef0002wtnukb544l3q	ay-2024-2025	GANJIL	88	\N	\N	89	91	\N	\N	90	A	\N	2026-01-20 04:42:15.659	2026-01-20 04:42:15.659
cmkm3xyb5000nwtuckabodot9	cmkm3xy870005wtuc8d6uen86	cmkcqahef0002wtnukb544l3q	ay-2024-2025	GENAP	90	\N	\N	91	93	\N	\N	92	A	\N	2026-01-20 04:42:15.666	2026-01-20 04:42:15.666
cmkm3xyb9000pwtucr3jzcqeh	cmkm3xy870005wtuc8d6uen86	cmkcqaheh0003wtnunw60rohw	ay-2024-2025	GANJIL	84	\N	\N	85	87	\N	\N	86	B	\N	2026-01-20 04:42:15.67	2026-01-20 04:42:15.67
cmkm3xybf000rwtuclp8jxny0	cmkm3xy870005wtuc8d6uen86	cmkcqaheh0003wtnunw60rohw	ay-2024-2025	GENAP	86	\N	\N	87	89	\N	\N	88	B	\N	2026-01-20 04:42:15.675	2026-01-20 04:42:15.675
cmkm3xybl000twtuc49nvd2n9	cmkm3xy870005wtuc8d6uen86	cmkcqahej0004wtnufju43j2i	ay-2024-2025	GANJIL	76	\N	\N	77	79	\N	\N	78	C	\N	2026-01-20 04:42:15.681	2026-01-20 04:42:15.681
cmkm3xyc1000vwtuc8l7h43mi	cmkm3xy870005wtuc8d6uen86	cmkcqahej0004wtnufju43j2i	ay-2024-2025	GENAP	78	\N	\N	79	81	\N	\N	80	B	\N	2026-01-20 04:42:15.697	2026-01-20 04:42:15.697
cmkm3xycm000xwtuc84g9k1tf	cmkm3xy870005wtuc8d6uen86	cmkcqahel0005wtnuaznbt7gi	ay-2024-2025	GANJIL	80	\N	\N	81	83	\N	\N	82	B	\N	2026-01-20 04:42:15.718	2026-01-20 04:42:15.718
cmkm3xycs000zwtuc99gv6v4u	cmkm3xy870005wtuc8d6uen86	cmkcqahel0005wtnuaznbt7gi	ay-2024-2025	GENAP	83	\N	\N	84	86	\N	\N	85	B	\N	2026-01-20 04:42:15.724	2026-01-20 04:42:15.724
cmkm3xycy0011wtuc5b8somjy	cmkm3xy870005wtuc8d6uen86	cmkcqahep0006wtnudtj6yy13	ay-2024-2025	GANJIL	83	\N	\N	84	86	\N	\N	85	B	\N	2026-01-20 04:42:15.73	2026-01-20 04:42:15.73
cmkm3xyd40013wtuc0wfsvj2h	cmkm3xy870005wtuc8d6uen86	cmkcqahep0006wtnudtj6yy13	ay-2024-2025	GENAP	86	\N	\N	87	89	\N	\N	88	B	\N	2026-01-20 04:42:15.737	2026-01-20 04:42:15.737
cmkm3xyde0015wtucrar8q6m6	cmkm3xy870005wtuc8d6uen86	cmkm3xy9i000ewtuc7rsuzw61	ay-2024-2025	GANJIL	90	\N	\N	91	93	\N	\N	92	A	\N	2026-01-20 04:42:15.747	2026-01-20 04:42:15.747
cmkm3xydt0017wtucx6b2t6ls	cmkm3xy870005wtuc8d6uen86	cmkm3xy9i000ewtuc7rsuzw61	ay-2024-2025	GENAP	92	\N	\N	93	95	\N	\N	94	A	\N	2026-01-20 04:42:15.761	2026-01-20 04:42:15.761
cmkm3xye40019wtucq09rgw1h	cmkm3xy870005wtuc8d6uen86	cmkm3xy9k000fwtuctjej5fm0	ay-2024-2025	GANJIL	86	\N	\N	87	89	\N	\N	88	B	\N	2026-01-20 04:42:15.773	2026-01-20 04:42:15.773
cmkm3xyeg001bwtucarave8rd	cmkm3xy870005wtuc8d6uen86	cmkm3xy9k000fwtuctjej5fm0	ay-2024-2025	GENAP	88	\N	\N	89	91	\N	\N	90	A	\N	2026-01-20 04:42:15.785	2026-01-20 04:42:15.785
\.


--
-- Data for Name: inventory_items; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.inventory_items (id, code, name, category, location, quantity, unit, condition, "acquisitionDate", "acquisitionPrice", "lastCheckDate", notes, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: letters; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.letters (id, "letterNumber", type, subject, content, sender, recipient, date, "attachmentUrl", status, "createdBy", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: maintenance_records; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.maintenance_records (id, "itemId", type, description, cost, status, "reportedBy", "assignedTo", "reportedAt", "scheduledAt", "completedAt", notes) FROM stdin;
\.


--
-- Data for Name: modul_ajar; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.modul_ajar (id, "cpId", "guruId", "tahunAjaranId", "namaModul", "alokasiWaktuJam", status, "createdAt", "updatedAt", "alurTujuanPembelajaran", "bahanBacaan", "daftarPustaka", "deskripsiUmum", fase, glosarium, "jumlahPertemuan", "kegiatanPembelajaran", kelas, "kompetensiAwal", lkpd, "modelPembelajaran", "pemahamanBermakna", "pertanyaanPemantik", "profilPelajarPancasila", "rencanaAsesmen", "rencanaDiferensiasi", "saranaPrasarana", "targetPesertaDidik", "tujuanPembelajaran") FROM stdin;
\.


--
-- Data for Name: org_members; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.org_members (id, "organizationId", "studentId", "position", "createdAt") FROM stdin;
\.


--
-- Data for Name: p5_participants; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.p5_participants (id, "projectId", "studentId", role, score, notes, "createdAt") FROM stdin;
\.


--
-- Data for Name: p5_projects; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.p5_projects (id, title, theme, description, "academicYearId", "startDate", "endDate", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: p7_penilaian_tim; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.p7_penilaian_tim (id, "timId", "siswaId", "dimensiScores", "nilaiTotal", catatan, "evaluatedAt") FROM stdin;
\.


--
-- Data for Name: p7_proyek; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.p7_proyek (id, "dimensiId", "tahunAjaranId", "namaProyek", tema, fase, "durasiMinggu", "tanggalMulai", "tanggalSelesai", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: penilaian_formatif; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.penilaian_formatif (id, "siswaId", "modulAjarId", jenis, nilai, "tingkatPencapaian", catatan, tanggal, "createdAt") FROM stdin;
\.


--
-- Data for Name: penilaian_sumatif; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.penilaian_sumatif (id, "siswaId", "modulAjarId", jenis, "nilaiTes", "nilaiPerformanceTask", "nilaiAkhir", "tingkatPencapaian", tanggal, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: performance_tasks; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.performance_tasks (id, "siswaId", "modulAjarId", "judulTugas", "rubrikId", "fileEvidences", nilai, "komentarGuru", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: portofolio_siswa; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.portofolio_siswa (id, "siswaId", "tahunAjaranId", "dataJson", "generatedAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ppdb_batches; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.ppdb_batches (id, name, "academicYearId", "startDate", "endDate", "isActive", description, "createdAt", "updatedAt") FROM stdin;
cmkid7dtu0001wt2smumpbpoc	Gelombang 1	cmkgtzeh00000wt0hszjuewk2	2026-01-17 00:00:00	2026-03-31 00:00:00	t	Pendaftaran Peserta Didik Baru Gelombang 1 Tahun Ajaran 2024/2025	2026-01-17 13:50:27.522	2026-01-18 08:14:57.836
\.


--
-- Data for Name: ppdb_registrations; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.ppdb_registrations (id, "batchId", "registrationNo", "fullName", nisn, nik, gender, "birthPlace", "birthDate", religion, email, phone, address, city, "postalCode", "fatherName", "fatherPhone", "motherName", "motherPhone", "originSchool", "graduationYear", status, notes, "ijazahUrl", "kkUrl", "aktaUrl", "photoUrl", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.roles (id, name, description, permissions, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: room_bookings; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.room_bookings (id, "roomId", title, description, "bookedBy", date, "startTime", "endTime", status, "approvedBy", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.rooms (id, code, name, type, capacity, floor, building, facilities, "isAvailable", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: schools; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.schools (id, npsn, name, status, "educationType", accreditation, "accreditationYear", "foundedYear", curriculum, vision, mission, address, city, province, "postalCode", phone, email, website, logo, "createdAt", "updatedAt", latitude, longitude) FROM stdin;
cmkcqahds0000wtnuij7bnvlg	20100001	SMAS YKM Tanjungsari	NEGERI	SMA	A	2023	1965	Kurikulum Merdeka	Mewujudkan sekolah unggul yang menghasilkan lulusan berkarakter, berprestasi, berwawasan global.	{"Menyelenggarakan pendidikan berkualitas","Mengembangkan potensi siswa secara optimal","Membangun karakter dan budi pekerti luhur"}	Jl. Raya Tannjungsari	Tanjungsari	Jawa Barat	xxxx	(021) 123-4567	info@smaykmtanjungsari.sch.id	-	\N	2026-01-13 15:10:10.048	2026-01-19 12:54:57.171	-6.862036	107.932669
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.sessions (id, "userId", token, "expiresAt", "ipAddress", "userAgent", "createdAt", "updatedAt") FROM stdin;
aB7TQJEAYSZ4XkOaeosKh5HdrLtRhUp1	r4BO1lU0gcl9VCRZo9B2PGeZWELisoZX	szH8MwPAnJ8hhQdZABuXwbsr532iuAgy	2026-01-20 16:05:37.259	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2026-01-13 16:05:37.259	2026-01-13 16:05:37.259
ybDEh3wc8vIYGURzMsX6DFhSIX7ycCTM	r4BO1lU0gcl9VCRZo9B2PGeZWELisoZX	EcOYkO9bX36fmMHyGtME8sjEtxqbdQdE	2026-01-20 16:06:15.46	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2026-01-13 16:06:15.46	2026-01-13 16:06:15.46
WkumthUSIifNCcmfmOd3vzlBIZxoTZCx	r4BO1lU0gcl9VCRZo9B2PGeZWELisoZX	HwlwjuvJL0Ac5TfMPln1XJQBfzqO7lGJ	2026-01-23 11:25:03.385	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2026-01-13 17:45:56.587	2026-01-16 11:25:03.385
F73IS9ittc0SMZXASWg7j6psUzvBB1TN	xZ8cdeXTZaUCiRVTvGWcdhQEFbfGdz6f	vFRMH4pFvdhvMGsSZpitvAHsQpPuJ1Kw	2026-01-24 01:54:38.77			2026-01-17 01:54:38.77	2026-01-17 01:54:38.77
Quud7xOfsnBcrS9dlm85yBR0m7rZDYI4	3dy7Zx6HOcNfjftmqAJ2Gy9UOuuWzIkQ	UMwOPEPwhbgHGkmi9B3uypYN1usIqL3z	2026-01-24 01:54:39.14			2026-01-17 01:54:39.14	2026-01-17 01:54:39.14
hromnVszMcaR15gwNMTorHBo3CiYlAfv	wl78V5uxrQq3rZKouvn2Ztoi48od98Dp	6ce76kkOLnbTD56lnO1pOTFK414l8xb0	2026-01-24 01:54:39.302			2026-01-17 01:54:39.302	2026-01-17 01:54:39.302
QcsQyQMUaXdjxks5GHrY3qLcMSCy2CeS	FqDLKtj2vkU43TiXAsqvNfc84cEp9BXo	YYiRUwjuxl739VGwtUCVm7b6DhNCMbxI	2026-01-24 01:54:39.69			2026-01-17 01:54:39.69	2026-01-17 01:54:39.69
w7en1Wq8mLctAPlO1b3SQh1FzRCAzUmG	ybWvJoqHiXVxCJneMmUFElTw3qNSIasn	ZcXJoXAaW2fSOy4t8ylujHO7tgsqQgTW	2026-01-24 01:54:39.914			2026-01-17 01:54:39.914	2026-01-17 01:54:39.914
6dTfkPM1WLydBuucdDvHXmxexyUv2tvb	FqDLKtj2vkU43TiXAsqvNfc84cEp9BXo	eZ5MS7rRM7vOGUbf0Pjew6d0qsBpI2gt	2026-01-24 07:44:12.331	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	2026-01-17 07:44:12.339	2026-01-17 07:44:12.339
yNgLa8tIQfvGnOaQtizg80yajPTkWPEM	cmkm58pme0000wt26mn77ke7v	K9vMliKChHIxfL5LfqnHPmB77QI3a3MF	2026-01-27 12:35:36.76	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15	2026-01-20 12:35:36.76	2026-01-20 12:35:36.76
DPi2rpa8luNgEi7CSseQF8a4grQKPZ3j	xZ8cdeXTZaUCiRVTvGWcdhQEFbfGdz6f	DpHEa3CNCMjrUjGzyD6Jt9MIN5Evn3QX	2026-01-27 14:49:06	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15	2026-01-20 14:49:06.002	2026-01-20 14:49:06.002
AEZLWBaB7cB8Zs1kFFYzfOHdS1loD3Cw	xZ8cdeXTZaUCiRVTvGWcdhQEFbfGdz6f	69kiFGp0C9stlwLocQi1xOW5gv3Onhpq	2026-01-25 07:52:27.931	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	2026-01-18 07:52:27.942	2026-01-18 07:52:27.942
TxULyHITZB2OOFiwPTvFGs0WtZsT5W9S	xZ8cdeXTZaUCiRVTvGWcdhQEFbfGdz6f	urCALWLbcMAQXSgmhK4qEdfIA6xk3UEq	2026-01-26 12:14:37.157	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	2026-01-19 12:14:37.157	2026-01-19 12:14:37.157
sScXGBiP17Jo6B0en8difaIUzB7co9Yb	xZ8cdeXTZaUCiRVTvGWcdhQEFbfGdz6f	47uVv5gjCmur81pz6Q6U8bQa05sb2Sgy	2026-01-26 12:14:50.581	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	2026-01-19 12:14:50.581	2026-01-19 12:14:50.581
6WLejN6iIHd1eoBJ02p23cpdPeEuLsLs	cmkjk0j590000wttfxkm0lbms	4LITepR8sBynfeCda9ojQzV0BlRdaJ5B	2026-01-26 23:36:16.89	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15	2026-01-19 23:36:16.891	2026-01-19 23:36:16.891
CqLrx7pOC8GRWbtBXZyeihU8Whorc5rJ	cmkjk0j590000wttfxkm0lbms	6ZZaB8mvpcmbNXtTO7TvEHYMCERex8io	2026-01-27 00:01:17.042	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15	2026-01-20 00:01:17.042	2026-01-20 00:01:17.042
mx5QYfUMYxUkA70px2rauoCkt9oqTy0c	cmkjk0j590000wttfxkm0lbms	JgprIXII4dj0srQiATuXl354IE1uuNZp	2026-01-27 00:42:03.239	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	2026-01-20 00:42:03.241	2026-01-20 00:42:03.241
MmoMpB5elkLAP2y8QJXP5nrHyXtL09Gc	cmkjk0j590000wttfxkm0lbms	lymTVxJjTeIyW052LsiR5Qr6XP3clufU	2026-01-27 04:06:35.18	127.0.0.1	Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36	2026-01-20 04:06:35.194	2026-01-20 04:06:35.194
\.


--
-- Data for Name: spp_billings; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.spp_billings (id, "studentId", "feeTypeId", "academicYearId", month, year, amount, "dueDate", status, "paidAmount", "paidAt", "paymentMethod", "receiptNumber", notes, "createdAt", "updatedAt") FROM stdin;
cmkm3xyhi002lwtucasmtb3fz	cmkm3xy870005wtuc8d6uen86	spp-monthly	ay-2024-2025	1	2024	500000.00	2024-01-20 00:00:00	PAID	500000.00	2024-01-19 00:00:00	\N	\N	\N	2026-01-20 04:42:15.894	2026-01-20 04:42:15.894
cmkm3xyhw002nwtucjnj1uooj	cmkm3xy870005wtuc8d6uen86	spp-monthly	ay-2024-2025	2	2024	500000.00	2024-02-20 00:00:00	PENDING	\N	\N	\N	\N	\N	2026-01-20 04:42:15.909	2026-01-20 04:42:15.909
\.


--
-- Data for Name: student_attendances; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.student_attendances (id, "studentId", date, status, "checkInTime", "checkOutTime", notes, "createdAt", "checkInLat", "checkInLong", "photoUrl") FROM stdin;
cmkl6dgfn0001wt0dxsoxeg8k	cmkcw4dsm0000wt6kjnjepaic	2026-01-18	PRESENT	2026-01-19 13:02:32.047	\N	\N	2026-01-19 13:02:32.048	-6.861854654496901	107.9329907525836	/uploads/757150f0-6f1b-44ba-83a1-84ac1a399d81.jpg
cmklragbp0003wt5jbsgvxatv	cmkcw4dsm0000wt6kjnjepaic	2026-01-19	PRESENT	2026-01-19 22:48:03.874	\N	\N	2026-01-19 22:48:03.875	-6.861675705084998	107.9328333237414	/uploads/fbf4eeb2-6495-4c9b-ad14-8a9e3840abcc.jpg
cmklu1e8f0001wtak96bjepye	cmkcw4dsm0000wt6kjnjepaic	2026-01-20	PRESENT	2026-01-20 00:04:59.91	\N	\N	2026-01-20 00:05:00.11	-6.861448085708097	107.9329881626127	/uploads/90c28f5d-3ce1-4ab7-a2a4-f0828453e481.jpg
cmkm3xyem001dwtuct2sawdx0	cmkm3xy870005wtuc8d6uen86	2026-01-20	LATE	2026-01-20 00:00:00.787	\N	\N	2026-01-20 04:42:15.79	\N	\N	\N
cmkm3xyeu001fwtucp7eaij42	cmkm3xy870005wtuc8d6uen86	2026-01-19	PRESENT	2026-01-19 00:00:00.796	\N	\N	2026-01-20 04:42:15.798	\N	\N	\N
cmkm3xyex001hwtucfuld2rki	cmkm3xy870005wtuc8d6uen86	2026-01-16	PRESENT	2026-01-16 00:00:00.799	\N	\N	2026-01-20 04:42:15.801	\N	\N	\N
cmkm3xyf0001jwtuc4xjqw2mm	cmkm3xy870005wtuc8d6uen86	2026-01-15	PRESENT	2026-01-15 00:00:00.803	\N	\N	2026-01-20 04:42:15.805	\N	\N	\N
cmkm3xyf2001lwtucyb6syqm0	cmkm3xy870005wtuc8d6uen86	2026-01-14	PRESENT	2026-01-14 00:00:00.805	\N	\N	2026-01-20 04:42:15.807	\N	\N	\N
cmkm3xyf6001nwtuctpldr8fo	cmkm3xy870005wtuc8d6uen86	2026-01-13	PRESENT	2026-01-13 00:00:00.808	\N	\N	2026-01-20 04:42:15.81	\N	\N	\N
cmkm3xyff001pwtuczogm4xr1	cmkm3xy870005wtuc8d6uen86	2026-01-12	PRESENT	2026-01-12 00:00:00.816	\N	\N	2026-01-20 04:42:15.82	\N	\N	\N
cmkm3xyfk001rwtucvijyap3r	cmkm3xy870005wtuc8d6uen86	2026-01-09	PRESENT	2026-01-09 00:00:00.822	\N	\N	2026-01-20 04:42:15.824	\N	\N	\N
cmkm3xyfm001twtucj8xhregv	cmkm3xy870005wtuc8d6uen86	2026-01-08	PRESENT	2026-01-08 00:00:00.825	\N	\N	2026-01-20 04:42:15.827	\N	\N	\N
cmkm3xyfp001vwtucnhh4gq9i	cmkm3xy870005wtuc8d6uen86	2026-01-07	PRESENT	2026-01-07 00:00:00.827	\N	\N	2026-01-20 04:42:15.829	\N	\N	\N
cmkm3xyfy001xwtucor8emh3b	cmkm3xy870005wtuc8d6uen86	2026-01-06	PRESENT	2026-01-06 00:00:00.835	\N	\N	2026-01-20 04:42:15.839	\N	\N	\N
cmkm3xyg5001zwtuc8oevca2t	cmkm3xy870005wtuc8d6uen86	2026-01-05	PRESENT	2026-01-05 00:00:00.842	\N	\N	2026-01-20 04:42:15.846	\N	\N	\N
cmkm3xyg90021wtuc4rgxe1h4	cmkm3xy870005wtuc8d6uen86	2026-01-02	LATE	2026-01-02 00:00:00.847	\N	\N	2026-01-20 04:42:15.849	\N	\N	\N
cmkm3xygc0023wtucmjf6ofy2	cmkm3xy870005wtuc8d6uen86	2026-01-01	PRESENT	2026-01-01 00:00:00.85	\N	\N	2026-01-20 04:42:15.852	\N	\N	\N
cmkm3xygi0025wtucaua9gqye	cmkm3xy870005wtuc8d6uen86	2025-12-31	PRESENT	2025-12-31 00:00:00.853	\N	\N	2026-01-20 04:42:15.858	\N	\N	\N
cmkm3xygl0027wtuchyun3jmu	cmkm3xy870005wtuc8d6uen86	2025-12-30	PRESENT	2025-12-30 00:00:00.859	\N	\N	2026-01-20 04:42:15.862	\N	\N	\N
cmkm3xygo0029wtuc86tgunm2	cmkm3xy870005wtuc8d6uen86	2025-12-29	PRESENT	2025-12-29 00:00:00.863	\N	\N	2026-01-20 04:42:15.865	\N	\N	\N
cmkm3xygr002bwtuclufwkxbh	cmkm3xy870005wtuc8d6uen86	2025-12-26	PRESENT	2025-12-26 00:00:00.866	\N	\N	2026-01-20 04:42:15.867	\N	\N	\N
cmkm3xygv002dwtucq2l34bxd	cmkm3xy870005wtuc8d6uen86	2025-12-25	PRESENT	2025-12-25 00:00:00.87	\N	\N	2026-01-20 04:42:15.871	\N	\N	\N
cmkm3xygx002fwtucueqf094d	cmkm3xy870005wtuc8d6uen86	2025-12-24	PRESENT	2025-12-24 00:00:00.872	\N	\N	2026-01-20 04:42:15.874	\N	\N	\N
cmkm3xyh0002hwtucgw2nmwwy	cmkm3xy870005wtuc8d6uen86	2025-12-23	PRESENT	2025-12-23 00:00:00.874	\N	\N	2026-01-20 04:42:15.876	\N	\N	\N
cmkm3xyh2002jwtucioarqmo8	cmkm3xy870005wtuc8d6uen86	2025-12-22	PRESENT	2025-12-22 00:00:00.877	\N	\N	2026-01-20 04:42:15.879	\N	\N	\N
cmknjyowy0007wtiusgfkfe5z	cmkncrddi0059wtwogvr2bjv0	2026-01-21	PRESENT	2026-01-21 04:58:30.087	\N	\N	2026-01-21 04:58:30.177	-6.861737040089274	107.9330808791736	/uploads/72697aa4-f79c-422c-94b1-91d8ea238bf8.jpg
\.


--
-- Data for Name: student_organizations; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.student_organizations (id, "schoolId", name, type, period, "advisorId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: student_permits; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.student_permits (id, "studentId", type, "startDate", "endDate", reason, document, status, "approvedBy", "createdAt", "updatedAt") FROM stdin;
cmkgvym9x0001wtoeck6w6ri0	cmkcw4dsm0000wt6kjnjepaic	SICK	2026-01-16 00:00:00	2026-01-17 00:00:00	Ke Jepang	\N	APPROVED	\N	2026-01-16 12:59:58.915	2026-01-16 13:00:04.888
cmkl72qg70001wt5jlpv41gy0	cmkcw4dsm0000wt6kjnjepaic	FAMILY	2026-01-21 00:00:00	2026-01-22 00:00:00	ingin ke german	\N	APPROVED	\N	2026-01-19 13:22:11.431	2026-01-19 13:22:42.619
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.students (id, nis, nisn, name, gender, religion, "birthPlace", "birthDate", address, phone, email, photo, status, "enrollmentDate", "graduationDate", "fatherName", "fatherJob", "motherName", "motherJob", "guardianName", "guardianPhone", "createdAt", "updatedAt", city, "deletedAt", district, "fatherEducation", "fatherNik", "fatherPhone", "guardianEducation", "guardianJob", "guardianNik", "guardianRelation", "motherEducation", "motherNik", "motherPhone", nik, "parentAddress", "parentCity", "parentProvince", "postalCode", "previousSchool", province, rt, rw, village) FROM stdin;
cmkcqahfv000jwtnu0adc8xn7	12345002	0012345002	Siti Aminah	FEMALE	Islam	\N	\N	\N	\N	\N	\N	ACTIVE	2026-01-13 15:10:10.123	\N	\N	\N	\N	\N	\N	\N	2026-01-13 15:10:10.123	2026-01-13 15:10:10.123	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkcvf5120000wtvegl8k49yn	21837891	2139189	zaskia nur aida nisa	MALE	\N	\N	\N	\N	\N	\N	/uploads/81a5c3cb-ed3e-44a3-aaa6-8a351f424f5b.png	ACTIVE	2026-01-13 17:33:45.39	\N	\N	\N	\N	\N	\N	\N	2026-01-13 17:33:45.397	2026-01-13 17:55:56.44	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2193829183	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkcqahfm000iwtnu31bc83yf	12345001	0012345001	Ahmad Rizki Pratama	MALE	Islam	\N	\N	\N	\N	\N	\N	ACTIVE	2026-01-13 15:10:10.114	\N	\N	\N	\N	\N	\N	\N	2026-01-13 15:10:10.114	2026-01-13 18:01:43.269	\N	2026-01-13 18:01:43.269	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkcqahfz000kwtnu397ln305	12345003	0012345003	Budi Santoso	MALE	Islam	\N	\N	\N	\N	\N	\N	ACTIVE	2026-01-13 15:10:10.127	\N	\N	\N	\N	\N	\N	\N	2026-01-13 15:10:10.127	2026-01-13 18:05:57.111	\N	2026-01-13 18:05:57.11	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkcqahg2000lwtnu4w0wy4th	12345004	0012345004	Dewi Lestari	FEMALE	Islam	\N	\N	\N	\N	\N	/uploads/757fef21-49ea-4402-92d6-d03f267a16cc.png	ACTIVE	2026-01-13 15:10:10.13	\N	\N	\N	\N	\N	\N	\N	2026-01-13 15:10:10.13	2026-01-13 18:06:16.474	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkgt80ur0000wt8gb2nl5op9	21837892	0012345681	Ahmad Dapodik Sync	MALE	\N	Jakarta	2008-05-15 00:00:00	Jl. Dapodik No. 1	\N	\N	\N	ACTIVE	2026-01-16 11:43:18.851	\N	\N	\N	\N	\N	\N	\N	2026-01-16 11:43:18.851	2026-01-16 11:43:18.851	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3171012345678904	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkgt80vw0001wt8gv4mcn177	21837893	0012345682	Siti Dapodik Sync	FEMALE	\N	Bandung	2008-08-20 00:00:00	Jl. Dapodik No. 2	\N	\N	\N	ACTIVE	2026-01-16 11:43:18.909	\N	\N	\N	\N	\N	\N	\N	2026-01-16 11:43:18.909	2026-01-16 11:43:18.909	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3171012345678905	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrddi0059wtwogvr2bjv0	252610001	\N	Alia Prisilia	MALE	\N	\N	\N	\N	\N	252610001@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.318	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.318	2026-01-21 01:36:51.318	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkcw4dsm0000wt6kjnjepaic	21387	\N	Zaidan Ikhsan Gumilar	MALE	\N	\N	\N	\N	\N	zaidan@school.com	/uploads/c386f801-51ef-4de2-bda3-b621d02e6360.png	ACTIVE	2026-01-13 17:53:23.153	\N	\N	\N	\N	\N	\N	\N	2026-01-13 17:53:23.157	2026-01-18 09:47:43.626	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkm3xy870005wtuc8d6uen86	20241201	0012345678	Ikhsan Santoso	MALE	\N	Jakarta	2006-05-20 00:00:00	Jl. Sudirman No. 1	081234567890	ikhsan@school.com	\N	ACTIVE	2026-01-20 04:42:15.559	\N	\N	\N	\N	\N	\N	\N	2026-01-20 04:42:15.559	2026-01-20 04:42:15.559	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrchs0003wtwobvox3mhz	252610011	\N	Kevin Maulana Zakarya	MALE	\N	\N	\N	\N	\N	252610011@student.sch.id	\N	ACTIVE	2026-01-21 01:36:50.176	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:50.176	2026-01-21 01:36:50.176	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrcjr0009wtwovm9zrgch	252610012	\N	Fajri Fauzan	MALE	\N	\N	\N	\N	\N	252610012@student.sch.id	\N	ACTIVE	2026-01-21 01:36:50.247	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:50.247	2026-01-21 01:36:50.247	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrcka000fwtwol3djdeoe	252610022	\N	Ramdani Maulana	MALE	\N	\N	\N	\N	\N	252610022@student.sch.id	\N	ACTIVE	2026-01-21 01:36:50.266	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:50.266	2026-01-21 01:36:50.266	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrcnh000lwtwo41zplppw	252610002	\N	Bagas Dwi Aprian	MALE	\N	\N	\N	\N	\N	252610002@student.sch.id	\N	ACTIVE	2026-01-21 01:36:50.381	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:50.381	2026-01-21 01:36:50.381	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrcpt000rwtwo4y8b0eqc	252610014	\N	Muhamad Riski Fadilah	FEMALE	\N	\N	\N	\N	\N	252610014@student.sch.id	\N	ACTIVE	2026-01-21 01:36:50.465	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:50.465	2026-01-21 01:36:50.465	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrcqb000xwtwodm3ij0nz	252610029	\N	Vanesa Bilqis Pramesti	FEMALE	\N	\N	\N	\N	\N	252610029@student.sch.id	\N	ACTIVE	2026-01-21 01:36:50.483	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:50.483	2026-01-21 01:36:50.483	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrcqr0013wtwoh8xhe0gv	252610005	\N	Fahri Nazril Mulyadi	MALE	\N	\N	\N	\N	\N	252610005@student.sch.id	\N	ACTIVE	2026-01-21 01:36:50.499	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:50.499	2026-01-21 01:36:50.499	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrcwz0019wtwo6npg85zy	252610008	\N	Hasbie Ash Shiddiq	MALE	\N	\N	\N	\N	\N	252610008@student.sch.id	\N	ACTIVE	2026-01-21 01:36:50.723	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:50.723	2026-01-21 01:36:50.723	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrcxf001fwtwot0iqfyx7	252610013	\N	Muhamad Rezza Awala Nur Syamsi	FEMALE	\N	\N	\N	\N	\N	252610013@student.sch.id	\N	ACTIVE	2026-01-21 01:36:50.739	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:50.739	2026-01-21 01:36:50.739	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrcyk001lwtwojuxnm072	252610017	\N	Nazwa Zahira Sulistyawati	FEMALE	\N	\N	\N	\N	\N	252610017@student.sch.id	\N	ACTIVE	2026-01-21 01:36:50.78	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:50.78	2026-01-21 01:36:50.78	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrd2c001rwtwoy3m1ol7h	252610025	\N	Sandiputraramdani	MALE	\N	\N	\N	\N	\N	252610025@student.sch.id	\N	ACTIVE	2026-01-21 01:36:50.916	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:50.916	2026-01-21 01:36:50.916	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrd3f001xwtwocp7x9wrt	252610027	\N	Tantry Aprilianda	FEMALE	\N	\N	\N	\N	\N	252610027@student.sch.id	\N	ACTIVE	2026-01-21 01:36:50.955	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:50.955	2026-01-21 01:36:50.955	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrd4g0023wtwooushzwcz	252610018	\N	Nuri Maulida	FEMALE	\N	\N	\N	\N	\N	252610018@student.sch.id	\N	ACTIVE	2026-01-21 01:36:50.992	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:50.992	2026-01-21 01:36:50.992	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrd550029wtwofkdu8356	252610019	\N	Nurul Alifah O	FEMALE	\N	\N	\N	\N	\N	252610019@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.017	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.017	2026-01-21 01:36:51.017	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrd5m002fwtwobqrof8fb	252610032	\N	Zahra Rifa Jauza	FEMALE	\N	\N	\N	\N	\N	252610032@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.034	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.034	2026-01-21 01:36:51.034	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrd62002lwtwoyb2s9aw2	252610026	\N	Setiawati	FEMALE	\N	\N	\N	\N	\N	252610026@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.05	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.05	2026-01-21 01:36:51.05	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrd6f002rwtwo3t8a1gdr	252610028	\N	Tiara Nur Fadilah	FEMALE	\N	\N	\N	\N	\N	252610028@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.063	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.063	2026-01-21 01:36:51.063	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrd6t002xwtwoktb4va1o	252610021	\N	Raihan Abdulghani	MALE	\N	\N	\N	\N	\N	252610021@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.076	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.076	2026-01-21 01:36:51.076	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrd760033wtwogapqdkyr	252610023	\N	Refi Refian Ardiana	MALE	\N	\N	\N	\N	\N	252610023@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.09	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.09	2026-01-21 01:36:51.09	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrd7i0039wtwogo16459u	252610024	\N	Riska Aulia	MALE	\N	\N	\N	\N	\N	252610024@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.102	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.102	2026-01-21 01:36:51.102	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrd7v003fwtwolx931hlv	252610031	\N	Yunita Fitriani Putri	FEMALE	\N	\N	\N	\N	\N	252610031@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.115	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.115	2026-01-21 01:36:51.115	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrd84003lwtwo0a9ijufj	252610030	\N	Wina Hartati	FEMALE	\N	\N	\N	\N	\N	252610030@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.125	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.125	2026-01-21 01:36:51.125	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrd9d003rwtwotk1kiwhh	252610004	\N	Citra Wiliyanti	FEMALE	\N	\N	\N	\N	\N	252610004@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.169	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.169	2026-01-21 01:36:51.169	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrda4003xwtwoqmq3m8tp	252610020	\N	Rahma Aulia Nisa	FEMALE	\N	\N	\N	\N	\N	252610020@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.196	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.196	2026-01-21 01:36:51.196	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdan0043wtwooxsaz9pz	252610006	\N	Fayza Aura Dinda Nadhifa	FEMALE	\N	\N	\N	\N	\N	252610006@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.215	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.215	2026-01-21 01:36:51.215	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdbd0049wtwok3czp8rq	252610010	\N	Isti Annisa Cinta Azhara	FEMALE	\N	\N	\N	\N	\N	252610010@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.241	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.241	2026-01-21 01:36:51.241	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdbn004fwtwohzd8racn	252610003	\N	Cinta Nur Arofaj	FEMALE	\N	\N	\N	\N	\N	252610003@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.252	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.252	2026-01-21 01:36:51.252	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdc4004lwtwoqhnlr3as	252610007	\N	Ghaisan Rahmanza Putra	MALE	\N	\N	\N	\N	\N	252610007@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.268	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.268	2026-01-21 01:36:51.268	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdce004rwtwo65saz3p1	252610009	\N	Iis Julaeha	MALE	\N	\N	\N	\N	\N	252610009@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.279	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.279	2026-01-21 01:36:51.279	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdcp004xwtwofzdwije5	252610016	\N	Naydra Julianty	MALE	\N	\N	\N	\N	\N	252610016@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.289	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.289	2026-01-21 01:36:51.289	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdd40053wtwobv3sntg1	252610015	\N	Nabila Nurfarhani	FEMALE	\N	\N	\N	\N	\N	252610015@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.304	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.304	2026-01-21 01:36:51.304	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrddu005fwtwoxxf4bbqg	252610049	\N	Rija Lesmana	MALE	\N	\N	\N	\N	\N	252610049@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.33	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.33	2026-01-21 01:36:51.33	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrde5005lwtwo8yu1nqa0	252610050	\N	Rima Septiani R	FEMALE	\N	\N	\N	\N	\N	252610050@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.341	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.341	2026-01-21 01:36:51.341	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdeo005rwtwoecdcn33k	252610055	\N	Siti Yusviana Fadilah	FEMALE	\N	\N	\N	\N	\N	252610055@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.36	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.36	2026-01-21 01:36:51.36	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdf7005xwtwosanyzrs8	252610052	\N	Salma Riana Putri	FEMALE	\N	\N	\N	\N	\N	252610052@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.379	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.379	2026-01-21 01:36:51.379	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdfp0063wtwoz9lckoye	252610054	\N	Sidik Rizqi Mauludin	MALE	\N	\N	\N	\N	\N	252610054@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.397	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.397	2026-01-21 01:36:51.397	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdg00069wtwolhrbj9dw	252610041	\N	Lintang Aldi Lesmana	MALE	\N	\N	\N	\N	\N	252610041@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.408	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.408	2026-01-21 01:36:51.408	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdha006lwtwo65jm5jk8	252610056	\N	Sri Arniyanti	MALE	\N	\N	\N	\N	\N	252610056@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.454	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.454	2026-01-21 01:36:51.454	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdhv006rwtwocrrhupp0	252610057	\N	Tiara Sita Dewi	FEMALE	\N	\N	\N	\N	\N	252610057@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.475	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.475	2026-01-21 01:36:51.475	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdi9006xwtwoof5kbk7e	252610058	\N	Tristan Leondri Canigia	MALE	\N	\N	\N	\N	\N	252610058@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.489	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.489	2026-01-21 01:36:51.489	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdiq0073wtwogp1yft20	252610051	\N	Rivki Hidayat	MALE	\N	\N	\N	\N	\N	252610051@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.505	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.505	2026-01-21 01:36:51.505	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdjg0079wtwoalas2kco	252610060	\N	Yuda Jehansah	MALE	\N	\N	\N	\N	\N	252610060@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.533	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.533	2026-01-21 01:36:51.533	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdjv007fwtwodtkbwh4g	252610059	\N	Yevina Candra	MALE	\N	\N	\N	\N	\N	252610059@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.548	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.548	2026-01-21 01:36:51.548	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdka007lwtwon3vkdazn	252610061	\N	Zamzam Alfa Salam	MALE	\N	\N	\N	\N	\N	252610061@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.56	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.56	2026-01-21 01:36:51.56	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdkl007rwtwoo8w7rxfj	252610048	\N	Reza	MALE	\N	\N	\N	\N	\N	252610048@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.573	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.573	2026-01-21 01:36:51.573	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdkw007xwtwox3e5mhl3	252610033	\N	Alfian Gunanja Mustopa	MALE	\N	\N	\N	\N	\N	252610033@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.584	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.584	2026-01-21 01:36:51.584	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdl90083wtwoegc4x4o5	252610044	\N	M Fadlan R.a	MALE	\N	\N	\N	\N	\N	252610044@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.598	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.598	2026-01-21 01:36:51.598	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdm10089wtwo2tm4hdye	252610040	\N	Kiki Firmansyah	MALE	\N	\N	\N	\N	\N	252610040@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.625	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.625	2026-01-21 01:36:51.625	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdo50093wtwor9papdro	252610036	\N	Desta Reski A	MALE	\N	\N	\N	\N	\N	252610036@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.701	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.701	2026-01-21 01:36:51.701	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdoo0099wtwo3po63yfz	252610046	\N	Naswa Nur Aleesya	FEMALE	\N	\N	\N	\N	\N	252610046@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.72	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.72	2026-01-21 01:36:51.72	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdp2009fwtwof780v2w1	252610039	\N	Ferdi Maulana S	MALE	\N	\N	\N	\N	\N	252610039@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.734	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.734	2026-01-21 01:36:51.734	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdpi009lwtwol76yik9u	252610038	\N	Erik Davidtiansyah	MALE	\N	\N	\N	\N	\N	252610038@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.75	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.75	2026-01-21 01:36:51.75	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdps009rwtwoot441fj5	252610034	\N	Annisa Nurul Fadilah	FEMALE	\N	\N	\N	\N	\N	252610034@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.76	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.76	2026-01-21 01:36:51.76	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdsb009xwtwo3yowg0k3	252610047	\N	Nayla Zaskia	FEMALE	\N	\N	\N	\N	\N	252610047@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.85	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.85	2026-01-21 01:36:51.85	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdt500a3wtwontdoyfo8	252610035	\N	Cinta Aulia	FEMALE	\N	\N	\N	\N	\N	252610035@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.881	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.881	2026-01-21 01:36:51.881	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdu900a9wtwotz3rkdef	252610091	\N	Sherly Sifa Solihat	FEMALE	\N	\N	\N	\N	\N	252610091@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.921	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.921	2026-01-21 01:36:51.921	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrduw00afwtwoni5t19bm	252610086	\N	Rehan Arya	MALE	\N	\N	\N	\N	\N	252610086@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.943	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.943	2026-01-21 01:36:51.943	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrf7f00kfwtwo1l0a1idd	252610115	\N	Muhammad Azka Al Padhil	MALE	\N	\N	\N	\N	\N	252610115@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.691	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.691	2026-01-21 01:36:53.691	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrf7z00klwtwo7qcrsdu0	252610105	\N	Deca Anindia Syafira	MALE	\N	\N	\N	\N	\N	252610105@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.711	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.711	2026-01-21 01:36:53.711	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrf8700krwtwovezwlje2	252610104	\N	Bunga Regina Putri	FEMALE	\N	\N	\N	\N	\N	252610104@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.719	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.719	2026-01-21 01:36:53.719	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrf8h00kxwtwoya7tz5ni	252610117	\N	Nathasya Chantika Aprillia	FEMALE	\N	\N	\N	\N	\N	252610117@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.729	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.729	2026-01-21 01:36:53.729	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrf8z00l3wtwosx9cix9v	252610128	\N	Taraono	MALE	\N	\N	\N	\N	\N	252610128@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.747	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.747	2026-01-21 01:36:53.747	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfb300l9wtworva46isf	252610102	\N	Anisa Ramadhan	FEMALE	\N	\N	\N	\N	\N	252610102@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.824	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.824	2026-01-21 01:36:53.824	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfbg00lfwtwoa2afxmvk	252610108	\N	Febi Wahyudi	MALE	\N	\N	\N	\N	\N	252610108@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.836	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.836	2026-01-21 01:36:53.836	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfbn00llwtwoxu402nmg	2526100107	\N	Dikri Maulana	MALE	\N	\N	\N	\N	\N	2526100107@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.843	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.843	2026-01-21 01:36:53.843	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfcd00lrwtwoqyjcw2rd	252610116	\N	Nagita Putriani	FEMALE	\N	\N	\N	\N	\N	252610116@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.87	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.87	2026-01-21 01:36:53.87	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfcn00lxwtwoz3nw9w10	252610114	\N	Kaisya Putri Karina	FEMALE	\N	\N	\N	\N	\N	252610114@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.879	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.879	2026-01-21 01:36:53.879	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfds00m3wtwo1w77nwdp	252610135	\N	Amikal Almisky	MALE	\N	\N	\N	\N	\N	252610135@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.92	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.92	2026-01-21 01:36:53.92	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfe200m9wtwo329iqsqn	252610147	\N	Irham Arief Fauzi	MALE	\N	\N	\N	\N	\N	252610147@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.93	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.93	2026-01-21 01:36:53.93	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfeb00mfwtwoty4lv49f	252610145	\N	Gilang Ibrahim Ramadhan	FEMALE	\N	\N	\N	\N	\N	252610145@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.939	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.939	2026-01-21 01:36:53.939	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfeo00mlwtwozs6zqrdi	252610156	\N	Raka Nur Sulaeman	FEMALE	\N	\N	\N	\N	\N	252610156@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.952	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.952	2026-01-21 01:36:53.952	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfez00mrwtwoybbc6vfx	252610136	\N	Andi	MALE	\N	\N	\N	\N	\N	252610136@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.964	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.964	2026-01-21 01:36:53.964	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfff00mxwtwo61mfss50	252610143	\N	Daffa Milano Putra	FEMALE	\N	\N	\N	\N	\N	252610143@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.98	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.98	2026-01-21 01:36:53.98	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfft00n3wtwo21xky9p5	252610154	\N	Putra Islamy	MALE	\N	\N	\N	\N	\N	252610154@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.994	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.994	2026-01-21 01:36:53.994	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfg700n9wtwohu3iez1l	252610140	\N	Avrilia Dewi Septiani Putri	FEMALE	\N	\N	\N	\N	\N	252610140@student.sch.id	\N	ACTIVE	2026-01-21 01:36:54.007	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:54.007	2026-01-21 01:36:54.007	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfgx00nfwtwo24njsfud	252610146	\N	Ica Inriani	FEMALE	\N	\N	\N	\N	\N	252610146@student.sch.id	\N	ACTIVE	2026-01-21 01:36:54.033	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:54.033	2026-01-21 01:36:54.033	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfhe00nlwtwomc4vkt6k	252610139	\N	Apriliana Putra Ginanjar	MALE	\N	\N	\N	\N	\N	252610139@student.sch.id	\N	ACTIVE	2026-01-21 01:36:54.05	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:54.05	2026-01-21 01:36:54.05	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfhl00nrwtwo4ws6ngyf	252610137	\N	Anisa Herawati	FEMALE	\N	\N	\N	\N	\N	252610137@student.sch.id	\N	ACTIVE	2026-01-21 01:36:54.058	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:54.058	2026-01-21 01:36:54.058	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfhv00nxwtwow3sde2uu	262610164	\N	Sonia Maharani	FEMALE	\N	\N	\N	\N	\N	262610164@student.sch.id	\N	ACTIVE	2026-01-21 01:36:54.067	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:54.067	2026-01-21 01:36:54.067	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfi700o3wtwo9hpinpt6	252610144	\N	Febi Amalia H	FEMALE	\N	\N	\N	\N	\N	252610144@student.sch.id	\N	ACTIVE	2026-01-21 01:36:54.079	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:54.079	2026-01-21 01:36:54.079	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfin00o9wtwosa31yqxt	252610134	\N	Ahmad Alief Zulfikar	MALE	\N	\N	\N	\N	\N	252610134@student.sch.id	\N	ACTIVE	2026-01-21 01:36:54.096	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:54.096	2026-01-21 01:36:54.096	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfiz00ofwtwowe41schg	252610148	\N	Kayla Yunianti	FEMALE	\N	\N	\N	\N	\N	252610148@student.sch.id	\N	ACTIVE	2026-01-21 01:36:54.107	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:54.107	2026-01-21 01:36:54.107	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfj900olwtwoeunvtgmu	252610168	\N	Yuni Nurfitriyani	FEMALE	\N	\N	\N	\N	\N	252610168@student.sch.id	\N	ACTIVE	2026-01-21 01:36:54.117	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:54.117	2026-01-21 01:36:54.117	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfjk00orwtwovtueacx1	252610165	\N	Syifa Kesya Nabila	FEMALE	\N	\N	\N	\N	\N	252610165@student.sch.id	\N	ACTIVE	2026-01-21 01:36:54.129	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:54.129	2026-01-21 01:36:54.129	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfk200oxwtwoa9jd0066	252610161	\N	Salsabila Azahra	FEMALE	\N	\N	\N	\N	\N	252610161@student.sch.id	\N	ACTIVE	2026-01-21 01:36:54.146	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:54.146	2026-01-21 01:36:54.146	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfkm00p3wtwovyzjc5vp	252610142	\N	Cincin Elsia Joya	FEMALE	\N	\N	\N	\N	\N	252610142@student.sch.id	\N	ACTIVE	2026-01-21 01:36:54.166	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:54.166	2026-01-21 01:36:54.166	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfl200p9wtwoxxcj4rie	252610138	\N	Anjani Oktavia	FEMALE	\N	\N	\N	\N	\N	252610138@student.sch.id	\N	ACTIVE	2026-01-21 01:36:54.182	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:54.182	2026-01-21 01:36:54.182	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrflb00pfwtwo7zt6sbcm	252610166	\N	Teguh Ady Gitara	MALE	\N	\N	\N	\N	\N	252610166@student.sch.id	\N	ACTIVE	2026-01-21 01:36:54.192	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:54.192	2026-01-21 01:36:54.192	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrflm00plwtwom5t4pupv	252610151	\N	Nadia Oktaviani	FEMALE	\N	\N	\N	\N	\N	252610151@student.sch.id	\N	ACTIVE	2026-01-21 01:36:54.202	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:54.202	2026-01-21 01:36:54.202	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfmd00prwtwogkfvpoe6	252610153	\N	Nazla Salsabilla Lirabbiha	FEMALE	\N	\N	\N	\N	\N	252610153@student.sch.id	\N	ACTIVE	2026-01-21 01:36:54.23	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:54.23	2026-01-21 01:36:54.23	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfmr00pxwtwo1zpg8bzw	252610152	\N	Nadin Maisya Aqila	FEMALE	\N	\N	\N	\N	\N	252610152@student.sch.id	\N	ACTIVE	2026-01-21 01:36:54.243	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:54.243	2026-01-21 01:36:54.243	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfqn00q3wtwo1c59701y	252610150	\N	Muhammad Faiz Al Ghiffari	MALE	\N	\N	\N	\N	\N	252610150@student.sch.id	\N	ACTIVE	2026-01-21 01:36:54.384	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:54.384	2026-01-21 01:36:54.384	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfu000q9wtwo89iv7vr0	252610163	\N	Siti Nurpatimah	FEMALE	\N	\N	\N	\N	\N	252610163@student.sch.id	\N	ACTIVE	2026-01-21 01:36:54.505	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:54.505	2026-01-21 01:36:54.505	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdmk008fwtwo1fx9wr8s	252610045	\N	Muhammad Sendy Febriansyah	MALE	\N	\N	\N	\N	\N	252610045@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.643	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.643	2026-01-21 01:36:51.643	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdmv008lwtwog2asb8hv	252610037	\N	Elano Danar Sugih Sunarko	MALE	\N	\N	\N	\N	\N	252610037@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.655	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.655	2026-01-21 01:36:51.655	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdnb008rwtwofghq31yr	252610043	\N	Muhammad Aziz Syafi'i	MALE	\N	\N	\N	\N	\N	252610043@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.671	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.671	2026-01-21 01:36:51.671	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdnp008xwtwo7s24ofuu	252610042	\N	M Hasan Bangkit Arya Atmaja	MALE	\N	\N	\N	\N	\N	252610042@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.685	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.685	2026-01-21 01:36:51.685	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdvo00alwtwoj6fqy5x3	252610088	\N	Robani Abdul Malik	MALE	\N	\N	\N	\N	\N	252610088@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.972	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.972	2026-01-21 01:36:51.972	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdwf00arwtwog5k38kks	252610090	\N	Selpi Nurpitriani	FEMALE	\N	\N	\N	\N	\N	252610090@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.999	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.999	2026-01-21 01:36:51.999	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdx100axwtwojfvmvhm3	242610092	\N	Sri Rahayu	FEMALE	\N	\N	\N	\N	\N	242610092@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.021	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.021	2026-01-21 01:36:52.021	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdxl00b3wtwolzyz8bal	252610095	\N	Wina Qhoirunnisa	FEMALE	\N	\N	\N	\N	\N	252610095@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.041	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.041	2026-01-21 01:36:52.041	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdy100b9wtwo9ccevohk	252610094	\N	Teni Sumarni	FEMALE	\N	\N	\N	\N	\N	252610094@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.057	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.057	2026-01-21 01:36:52.057	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdyy00bfwtwonzlktxxe	252610096	\N	Zio Ramadan Putra	MALE	\N	\N	\N	\N	\N	252610096@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.09	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.09	2026-01-21 01:36:52.09	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdzg00blwtwoyo9cszxf	252610087	\N	Reyzan Rohnadin Yusuf	FEMALE	\N	\N	\N	\N	\N	252610087@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.108	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.108	2026-01-21 01:36:52.108	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncre1n00brwtwoki50wcb3	252610093	\N	Syalfa Dikriansyah Rizkian	MALE	\N	\N	\N	\N	\N	252610093@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.187	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.187	2026-01-21 01:36:52.187	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncre3i00bxwtwolxw65m9f	252610080	\N	Muhammad Fadli Anjar Saputra	MALE	\N	\N	\N	\N	\N	252610080@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.254	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.254	2026-01-21 01:36:52.254	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncre3t00c3wtwodun6cu6w	252610082	\N	Naila Azka Aufa	FEMALE	\N	\N	\N	\N	\N	252610082@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.264	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.264	2026-01-21 01:36:52.264	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncre4800c9wtwow3m0dcwh	252610089	\N	Sandy Algiansah Octorio	MALE	\N	\N	\N	\N	\N	252610089@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.281	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.281	2026-01-21 01:36:52.281	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncre5900cfwtwoe224kqjh	252610097	\N	Zuita Sri Rahayu	FEMALE	\N	\N	\N	\N	\N	252610097@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.317	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.317	2026-01-21 01:36:52.317	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncre6j00clwtwoz2tjodxq	252610083	\N	Neta Rahmawati	FEMALE	\N	\N	\N	\N	\N	252610083@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.363	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.363	2026-01-21 01:36:52.363	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncre7e00crwtwoth3bmlba	252610066	\N	Aldi Nurhakim	FEMALE	\N	\N	\N	\N	\N	252610066@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.393	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.393	2026-01-21 01:36:52.393	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncre7z00cxwtwosw5gghwe	252610081	\N	Nadine Cantika Devi	FEMALE	\N	\N	\N	\N	\N	252610081@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.416	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.416	2026-01-21 01:36:52.416	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncre8j00d3wtwo0i6ugkm7	252610084	\N	Nurdin Wahid	FEMALE	\N	\N	\N	\N	\N	252610084@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.435	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.435	2026-01-21 01:36:52.435	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncre9500d9wtwoj7m3cq9g	252610062	\N	Abdul Rahim	MALE	\N	\N	\N	\N	\N	252610062@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.457	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.457	2026-01-21 01:36:52.457	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncre9k00dfwtwoum5a9rs8	252610085	\N	Rapi Al-ghifari	MALE	\N	\N	\N	\N	\N	252610085@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.472	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.472	2026-01-21 01:36:52.472	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncream00dlwtwomnaj7310	252610074	\N	Hafizah Nurafifah	FEMALE	\N	\N	\N	\N	\N	252610074@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.51	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.51	2026-01-21 01:36:52.51	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncreb400drwtwofvi9wmrd	252610079	\N	Muhamad Riyan	MALE	\N	\N	\N	\N	\N	252610079@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.528	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.528	2026-01-21 01:36:52.528	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrebi00dxwtwokzn4ishq	252610068	\N	Anisa Ayu Lestari	FEMALE	\N	\N	\N	\N	\N	252610068@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.542	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.542	2026-01-21 01:36:52.542	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrebx00e3wtwom873alza	252510067	\N	Anggi Ilhammudin	MALE	\N	\N	\N	\N	\N	252510067@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.557	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.557	2026-01-21 01:36:52.557	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrecc00e9wtwo6tw5b18g	252610070	\N	Azreal.fariz.rahman	MALE	\N	\N	\N	\N	\N	252610070@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.572	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.572	2026-01-21 01:36:52.572	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncredn00efwtwoo8io1z1e	252610069	\N	Azhar Zainul Muttaqin	MALE	\N	\N	\N	\N	\N	252610069@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.619	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.619	2026-01-21 01:36:52.619	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrehn00elwtwojurig18e	252610064	\N	Aditia	MALE	\N	\N	\N	\N	\N	252610064@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.763	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.763	2026-01-21 01:36:52.763	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncreji00erwtwoexqbqgk7	252610075	\N	Iwan Hidayat	MALE	\N	\N	\N	\N	\N	252610075@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.83	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.83	2026-01-21 01:36:52.83	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrek700exwtwo0dmwm6sk	252610077	\N	Kiki Ahmad Gojali	MALE	\N	\N	\N	\N	\N	252610077@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.855	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.855	2026-01-21 01:36:52.855	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrel000f3wtwolv6q07as	252610076	\N	Jayusman Simamora	FEMALE	\N	\N	\N	\N	\N	252610076@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.884	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.884	2026-01-21 01:36:52.884	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrelg00f9wtwo7ycx4h3i	252610063	\N	Adinda Melisa	FEMALE	\N	\N	\N	\N	\N	252610063@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.901	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.901	2026-01-21 01:36:52.901	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrelx00ffwtwogyih6oyo	252610071	\N	Cecep Kusnadi	MALE	\N	\N	\N	\N	\N	252610071@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.917	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.917	2026-01-21 01:36:52.917	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncremq00flwtwo6kfgpsrb	252610072	\N	Citra Lestari	FEMALE	\N	\N	\N	\N	\N	252610072@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.946	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.946	2026-01-21 01:36:52.946	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncremz00frwtwo0pvjr70p	252610073	\N	Dimas Pajar Permana	MALE	\N	\N	\N	\N	\N	252610073@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.956	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.956	2026-01-21 01:36:52.956	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrend00fxwtwo0ci1zwds	252610078	\N	Lisna Mutia Ningsih	FEMALE	\N	\N	\N	\N	\N	252610078@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.97	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.97	2026-01-21 01:36:52.97	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncreno00g3wtwoq7nld4mc	252610065	\N	Aldi Kusnawan	MALE	\N	\N	\N	\N	\N	252610065@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.98	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.98	2026-01-21 01:36:52.98	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncreo200g9wtwoy7wb8jpb	252610121	\N	Rikal Nazar Fauzan	MALE	\N	\N	\N	\N	\N	252610121@student.sch.id	\N	ACTIVE	2026-01-21 01:36:52.994	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:52.994	2026-01-21 01:36:52.994	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncreoc00gfwtwoe5xwxdnk	252610122	\N	Rio Wahyu Ramadan	MALE	\N	\N	\N	\N	\N	252610122@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.004	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.004	2026-01-21 01:36:53.004	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncreol00glwtwoj3s31jv1	252610129	\N	Tasya Maharani	FEMALE	\N	\N	\N	\N	\N	252610129@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.014	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.014	2026-01-21 01:36:53.014	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrep300grwtwobx50bby3	252610125	\N	Sinta Nuraeni	FEMALE	\N	\N	\N	\N	\N	252610125@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.031	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.031	2026-01-21 01:36:53.031	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrepg00gxwtwoszjq73yp	252610123	\N	Rustandi	MALE	\N	\N	\N	\N	\N	252610123@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.044	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.044	2026-01-21 01:36:53.044	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncreqa00h3wtwopqt60s9r	252610120	\N	Raffa Riandra Rahman	MALE	\N	\N	\N	\N	\N	252610120@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.074	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.074	2026-01-21 01:36:53.074	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrerd00h9wtwofuhulp6l	252610127	\N	Syifa Nuraisyah	FEMALE	\N	\N	\N	\N	\N	252610127@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.113	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.113	2026-01-21 01:36:53.113	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrers00hfwtwozqldv1ni	252610124	\N	Ryan,h	MALE	\N	\N	\N	\N	\N	252610124@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.128	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.128	2026-01-21 01:36:53.128	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrevr00hlwtwotom9sijj	2526102525	\N	Jajang Jaelani	MALE	\N	\N	\N	\N	\N	2526102525@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.271	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.271	2026-01-21 01:36:53.271	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrew200hrwtwor219i2mj	252610126	\N	Siti Sarah Ambami	FEMALE	\N	\N	\N	\N	\N	252610126@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.282	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.282	2026-01-21 01:36:53.282	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrewa00hxwtwof14v8tvz	252610110	\N	Gilang Ramadan	FEMALE	\N	\N	\N	\N	\N	252610110@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.29	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.29	2026-01-21 01:36:53.29	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrewk00i3wtwovwgksd6j	252610111	\N	Ibrahim Setiawan	MALE	\N	\N	\N	\N	\N	252610111@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.3	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.3	2026-01-21 01:36:53.3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrews00i9wtwos1ic13bp	252610119	\N	Olivia Zahra	FEMALE	\N	\N	\N	\N	\N	252610119@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.309	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.309	2026-01-21 01:36:53.309	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrex300ifwtwo1ey3feh8	252610118	\N	Nurul Purnamasani	FEMALE	\N	\N	\N	\N	\N	252610118@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.319	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.319	2026-01-21 01:36:53.319	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrexc00ilwtwoe34oec80	252610000	\N	Valent Abner W	MALE	\N	\N	\N	\N	\N	252610000@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.329	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.329	2026-01-21 01:36:53.329	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrexk00irwtwopv5nhytn	252610101	\N	Alek Ali Rohman	MALE	\N	\N	\N	\N	\N	252610101@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.336	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.336	2026-01-21 01:36:53.336	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrexw00ixwtwookxw6hrm	252610109	\N	Fitri Siti Sofiah	FEMALE	\N	\N	\N	\N	\N	252610109@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.348	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.348	2026-01-21 01:36:53.348	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrey400j3wtwovy9ic5oz	252610132	\N	Zaskia Alya Medina	FEMALE	\N	\N	\N	\N	\N	252610132@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.356	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.356	2026-01-21 01:36:53.356	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncreyg00j9wtwoocd09818	252610131	\N	Viera Zaskia	FEMALE	\N	\N	\N	\N	\N	252610131@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.369	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.369	2026-01-21 01:36:53.369	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrezr00jfwtwo1et7do00	252610106	\N	Dewi Siti Aminah	FEMALE	\N	\N	\N	\N	\N	252610106@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.415	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.415	2026-01-21 01:36:53.415	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrf0d00jlwtwouev3whlj	252610098	\N	Adinda Ulfa Juniar	FEMALE	\N	\N	\N	\N	\N	252610098@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.437	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.437	2026-01-21 01:36:53.437	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrf0l00jrwtwoxpbl5258	252610100	\N	Ai Leni Widianti	FEMALE	\N	\N	\N	\N	\N	252610100@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.445	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.445	2026-01-21 01:36:53.445	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrf0u00jxwtwo5mny3bkw	252610099	\N	Ahsan Abdul Manan	MALE	\N	\N	\N	\N	\N	252610099@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.454	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.454	2026-01-21 01:36:53.454	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrf1300k3wtwo3hpl8b8q	252610112	\N	Ila Lena Lestari	FEMALE	\N	\N	\N	\N	\N	252610112@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.463	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.463	2026-01-21 01:36:53.463	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrf1z00k9wtwovyro8o1a	252610103	\N	Annisa	FEMALE	\N	\N	\N	\N	\N	252610103@student.sch.id	\N	ACTIVE	2026-01-21 01:36:53.496	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:53.496	2026-01-21 01:36:53.496	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfwt00qlwtwoyv3ujy8c	252610141	\N	Celsi Selani	FEMALE	\N	\N	\N	\N	\N	252610141@student.sch.id	\N	ACTIVE	2026-01-21 01:36:54.605	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:54.605	2026-01-21 01:36:54.605	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfxq00qrwtwo0fu1v1jc	252610157	\N	Rasya Aulia Putri	FEMALE	\N	\N	\N	\N	\N	252610157@student.sch.id	\N	ACTIVE	2026-01-21 01:36:54.638	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:54.638	2026-01-21 01:36:54.638	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrg0b00qxwtwo0kz4t44l	252610155	\N	Putri Siti Nurhawa	FEMALE	\N	\N	\N	\N	\N	252610155@student.sch.id	\N	ACTIVE	2026-01-21 01:36:54.731	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:54.731	2026-01-21 01:36:54.731	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrg0m00r3wtwoc3ya0kj1	252610133	\N	Abiliana Adiani	MALE	\N	\N	\N	\N	\N	252610133@student.sch.id	\N	ACTIVE	2026-01-21 01:36:54.742	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:54.742	2026-01-21 01:36:54.742	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrg1u00r9wtwonxo0w4uw	252610160	\N	Salsabila	FEMALE	\N	\N	\N	\N	\N	252610160@student.sch.id	\N	ACTIVE	2026-01-21 01:36:54.786	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:54.786	2026-01-21 01:36:54.786	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrg2d00rfwtwot0gzc9sg	252610149	\N	Marshya Mega Aryanti	FEMALE	\N	\N	\N	\N	\N	252610149@student.sch.id	\N	ACTIVE	2026-01-21 01:36:54.805	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:54.805	2026-01-21 01:36:54.805	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrfux00qfwtwou2twnxwj	252610162	\N	Sawitri Gia Mauladi	MALE	\N	\N	\N	\N	\N	252610162@student.sch.id	\N	ACTIVE	2026-01-21 01:36:54.537	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:54.537	2026-01-21 01:36:54.847	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrg4000rpwtwooayyhqxr	252610159	\N	Rizal Permana	MALE	\N	\N	\N	\N	\N	252610159@student.sch.id	\N	ACTIVE	2026-01-21 01:36:54.863	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:54.863	2026-01-21 01:36:54.863	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrg6v00rvwtwou9voj4ax	252610158	\N	Riyan Taryana	MALE	\N	\N	\N	\N	\N	252610158@student.sch.id	\N	ACTIVE	2026-01-21 01:36:54.968	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:54.968	2026-01-21 01:36:54.968	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmkncrdgi006fwtwo7f6nqqkj	252610053	\N	Shofa Shofiyyatus Sa'adah	FEMALE	\N	\N	\N	\N	\N	252610053@student.sch.id	\N	ACTIVE	2026-01-21 01:36:51.426	\N	\N	\N	\N	\N	\N	\N	2026-01-21 01:36:51.426	2026-01-21 01:38:38.273	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: subjects; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.subjects (id, code, name, category, "hoursPerWeek", description, "createdAt", "updatedAt", "deletedAt") FROM stdin;
cmkcqahe60001wtnu5tdpajsw	MTK	Matematika	WAJIB	5	\N	2026-01-13 15:10:10.062	2026-01-13 15:10:10.062	\N
cmkcqaheh0003wtnunw60rohw	BIG	Bahasa Inggris	WAJIB	4	\N	2026-01-13 15:10:10.073	2026-01-13 15:10:10.073	\N
cmkcqahej0004wtnufju43j2i	FIS	Fisika	PEMINATAN_IPA	4	\N	2026-01-13 15:10:10.075	2026-01-13 15:10:10.075	\N
cmkcqahel0005wtnuaznbt7gi	KIM	Kimia	PEMINATAN_IPA	4	\N	2026-01-13 15:10:10.077	2026-01-13 15:10:10.077	\N
cmkcqahep0006wtnudtj6yy13	BIO	Biologi	PEMINATAN_IPA	4	\N	2026-01-13 15:10:10.081	2026-01-13 15:10:10.081	\N
cmkhi95c10000wthvv9x97v0s	TIK	Informatika	PEMINATAN_IPA	2	Pelajaran Informatika	2026-01-16 23:24:01.728	2026-01-16 23:24:01.728	\N
cmkcqahef0002wtnukb544l3q	BIN	Bahasa Indonesia	WAJIB	4	Bahasa Indonesia	2026-01-13 15:10:10.071	2026-01-16 23:28:02.079	\N
cmkhnjljq000ywtvsi06t69gb	IPA	Ilmu Pengetahuan Alam	WAJIB	6	\N	2026-01-17 01:52:07.382	2026-01-17 01:52:07.382	\N
cmkhnjlju000zwtvsfacf271e	IPS	Ilmu Pengetahuan Sosial	WAJIB	4	\N	2026-01-17 01:52:07.386	2026-01-17 01:52:07.386	\N
cmkjmbwes0001wtgj0uhxx0uy	IND	Bahasa Indonesia	WAJIB	2	\N	2026-01-18 10:53:40.949	2026-01-18 10:53:40.949	\N
cmkjmbwf20002wtgj0w18lygx	ING	Bahasa Inggris	WAJIB	2	\N	2026-01-18 10:53:40.959	2026-01-18 10:53:40.959	\N
cmkjmbwfr0005wtgjuh4evm3y	PJK	Penjaskes	WAJIB	2	\N	2026-01-18 10:53:40.984	2026-01-18 10:53:40.984	\N
cmkm3xy9i000ewtuc7rsuzw61	PAI	Pendidikan Agama Islam	WAJIB	2	\N	2026-01-20 04:42:15.606	2026-01-20 04:42:15.606	\N
cmkm3xy9k000fwtuctjej5fm0	PKN	Pendidikan Kewarganegaraan	WAJIB	2	\N	2026-01-20 04:42:15.609	2026-01-20 04:42:15.609	\N
cmknczvn60000wt5vm6illxhs	SOSIOLOGI289	Sosiologi	PEMINATAN_IPS	2	\N	2026-01-21 01:43:28.242	2026-01-21 01:43:28.242	\N
cmknczvnd0001wt5vvyfsdh3h	SBK540	SBK	WAJIB	2	\N	2026-01-21 01:43:28.25	2026-01-21 01:43:28.25	\N
cmknczvni0002wt5v3c1sz6fa	BASASUNDA662	Basa Sunda	MULOK	2	\N	2026-01-21 01:43:28.254	2026-01-21 01:43:28.254	\N
cmknczvnl0003wt5va63oho3r	PKWU378	PKWU	WAJIB	2	\N	2026-01-21 01:43:28.257	2026-01-21 01:43:28.257	\N
cmknczvnq0004wt5vtc67c3sw	EKONOMI498	Ekonomi	PEMINATAN_IPS	2	\N	2026-01-21 01:43:28.262	2026-01-21 01:43:28.262	\N
cmknczvny0005wt5v52hgd4it	GEOGRAFI736	Geografi	PEMINATAN_IPS	2	\N	2026-01-21 01:43:28.27	2026-01-21 01:43:28.27	\N
cmknczvo10006wt5v92jjgqe7	PABP306	PABP	WAJIB	2	\N	2026-01-21 01:43:28.274	2026-01-21 01:43:28.274	\N
cmknczvo40007wt5v54238qlg	SEJARAH240	Sejarah	WAJIB	2	\N	2026-01-21 01:43:28.277	2026-01-21 01:43:28.277	\N
cmknczvob0008wt5vbcaiveme	PJOK307	PJOK	WAJIB	2	\N	2026-01-21 01:43:28.283	2026-01-21 01:43:28.283	\N
cmknczvoe0009wt5vlgeecis5	PPKN830	PPKn	WAJIB	2	\N	2026-01-21 01:43:28.286	2026-01-21 01:43:28.286	\N
\.


--
-- Data for Name: system_configs; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.system_configs (id, key, value, description, "updatedBy", "updatedAt") FROM stdin;
\.


--
-- Data for Name: system_settings; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.system_settings (id, key, value, "createdAt", "updatedAt") FROM stdin;
cmkhlibt40000wt5r8j8j65uh	activeCurriculumType	MERDEKA	2026-01-17 00:55:08.865	2026-01-18 02:17:10.231
\.


--
-- Data for Name: teacher_attendances; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.teacher_attendances (id, "teacherId", date, status, "checkInTime", "checkOutTime", notes, "createdAt", "checkInLat", "checkInLong", "photoUrl") FROM stdin;
cmknkue010001wtuikl2dabx6	cmknczvpp000mwt5vwf0ylf90	2026-01-21	PRESENT	2026-01-21 05:23:08.849	\N	\N	2026-01-21 05:23:09.025	-6.861308133645053	107.9327095948666	/uploads/0186d4ee-05ad-4092-a79b-b749374fca23.jpg
\.


--
-- Data for Name: teacher_performances; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.teacher_performances (id, "teacherId", "academicYearId", semester, "teachingScore", "attendanceScore", "professionalScore", "socialScore", "overallScore", notes, "evaluatedBy", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: teacher_permits; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.teacher_permits (id, "teacherId", type, "startDate", "endDate", reason, document, status, "approvedBy", "createdAt", "updatedAt") FROM stdin;
cmkhe605r0001wttsiz6k3usv	cmkcqahes0007wtnumwa03r5h	SICK	2026-01-16 00:00:00	2026-01-22 00:00:00	demam	\N	APPROVED	\N	2026-01-16 21:29:36.591	2026-01-16 21:29:43.727
\.


--
-- Data for Name: teacher_subjects; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.teacher_subjects (id, "teacherId", "subjectId", "createdAt") FROM stdin;
cmkm58pms0006wt26nfrpv0ar	cmkm58pms0004wt26m94ljfjj	cmkhi95c10000wthvv9x97v0s	2026-01-20 05:18:37.252
cmknczvp1000ewt5vxky1twna	cmknczvoq000cwt5v2243ctdq	cmkcqahep0006wtnudtj6yy13	2026-01-21 01:43:28.309
cmknczvpf000jwt5v0k4egdrd	cmknczvpb000hwt5vmuhmjuev	cmkcqahe60001wtnu5tdpajsw	2026-01-21 01:43:28.323
cmknczvpr000owt5vveowwc2d	cmknczvpp000mwt5vwf0ylf90	cmkcqahef0002wtnukb544l3q	2026-01-21 01:43:28.335
cmknczvq8000wwt5vbpggsew1	cmknczvq6000uwt5vdc34do96	cmknczvn60000wt5vm6illxhs	2026-01-21 01:43:28.352
cmknczvr30011wt5vu1dyfjk7	cmknczvql000zwt5vxvijtgyk	cmkcqahef0002wtnukb544l3q	2026-01-21 01:43:28.383
cmknczvts0016wt5v2i00w1hb	cmknczvth0014wt5vqlzfp61s	cmknczvnd0001wt5vvyfsdh3h	2026-01-21 01:43:28.48
cmknczvya0018wt5v7odzmfwn	cmknczvth0014wt5vqlzfp61s	cmknczvni0002wt5v3c1sz6fa	2026-01-21 01:43:28.642
cmknczvyd001awt5vsai9a17a	cmknczvth0014wt5vqlzfp61s	cmknczvnl0003wt5va63oho3r	2026-01-21 01:43:28.645
cmknczvyn001fwt5v9d9nidak	cmknczvyk001dwt5vi7rkbxo5	cmkcqaheh0003wtnunw60rohw	2026-01-21 01:43:28.655
cmknczvyu001kwt5v5tlo6lkf	cmknczvys001iwt5vjjccwiuk	cmknczvni0002wt5v3c1sz6fa	2026-01-21 01:43:28.662
cmknczvz6001pwt5v7l4d0b3s	cmknczvz4001nwt5vk24xi0dw	cmkcqahe60001wtnu5tdpajsw	2026-01-21 01:43:28.674
cmknczvzd001uwt5v05wjihn8	cmknczvzb001swt5vyhz3xnhh	cmknczvnq0004wt5vtc67c3sw	2026-01-21 01:43:28.682
cmknczvzl001zwt5vqu0fu7vm	cmknczvzj001xwt5vuzuu9n7w	cmkcqahe60001wtnu5tdpajsw	2026-01-21 01:43:28.689
cmknczvzt0024wt5vrmx1cdwh	cmknczvzr0022wt5v81347bdf	cmknczvny0005wt5v52hgd4it	2026-01-21 01:43:28.697
cmknczw050029wt5vthq7kedw	cmknczw030027wt5vsztmofy7	cmknczvo10006wt5v92jjgqe7	2026-01-21 01:43:28.71
cmknczw09002bwt5vik2g84i0	cmknczw030027wt5vsztmofy7	cmknczvo40007wt5v54238qlg	2026-01-21 01:43:28.713
cmknczw0h002gwt5v6s5h94t6	cmknczw0d002ewt5vh94dfbbj	cmkcqahej0004wtnufju43j2i	2026-01-21 01:43:28.721
cmknczw0o002lwt5vh4sxpcau	cmknczw0l002jwt5vur6yuipa	cmknczvni0002wt5v3c1sz6fa	2026-01-21 01:43:28.728
cmknczw1b002qwt5v4yah3bnv	cmknczw19002owt5vg64ofn11	cmkcqahep0006wtnudtj6yy13	2026-01-21 01:43:28.752
cmknczw1t002vwt5vihg91nxz	cmknczw1p002twt5vmtsszvd5	cmknczvo10006wt5v92jjgqe7	2026-01-21 01:43:28.769
cmknczw270030wt5vgwtp2ji8	cmknczw25002ywt5vbj6isuhg	cmkcqahel0005wtnuaznbt7gi	2026-01-21 01:43:28.783
cmknczw2e0035wt5v2wqwu36m	cmknczw2b0033wt5vxzyjv4xb	cmknczvo40007wt5v54238qlg	2026-01-21 01:43:28.79
cmknczw2m003awt5vl6ausm59	cmknczw2k0038wt5v2toh99bn	cmknczvob0008wt5vbcaiveme	2026-01-21 01:43:28.799
cmknczw2x003iwt5vqhanqs5q	cmknczw2v003gwt5vm245x3nn	cmknczvo40007wt5v54238qlg	2026-01-21 01:43:28.81
cmknczw30003kwt5vx44j8u0m	cmknczw2v003gwt5vm245x3nn	cmknczvnq0004wt5vtc67c3sw	2026-01-21 01:43:28.812
cmknczw3b003pwt5vu8yt7vaw	cmknczw37003nwt5var7s947b	cmknczvoe0009wt5vlgeecis5	2026-01-21 01:43:28.823
cmknczw3i003uwt5vqzu685n9	cmknczw3f003swt5vk9vd4h9a	cmkcqaheh0003wtnunw60rohw	2026-01-21 01:43:28.83
cmknczw3q003wwt5v6xjti7t3	cmknczw3f003swt5vk9vd4h9a	cmknczvn60000wt5vm6illxhs	2026-01-21 01:43:28.838
cmknczw3z0041wt5vmcrrk15n	cmknczw3v003zwt5v3utqjdg6	cmknczvnd0001wt5vvyfsdh3h	2026-01-21 01:43:28.847
cmknczw4k0046wt5v6kwl2hvo	cmknczw4a0044wt5vvzahvk8g	cmkcqahep0006wtnudtj6yy13	2026-01-21 01:43:28.868
cmknczw4w0048wt5vwonth4lr	cmknczw4a0044wt5vvzahvk8g	cmkcqahej0004wtnufju43j2i	2026-01-21 01:43:28.88
cmknczw6a004dwt5vttilzwdq	cmknczw68004bwt5vj867dkbe	cmkhi95c10000wthvv9x97v0s	2026-01-21 01:43:28.931
cmknczw6k004iwt5vvjhihgdd	cmknczw6g004gwt5vwxny9ms2	cmkhi95c10000wthvv9x97v0s	2026-01-21 01:43:28.94
cmknczw7c004nwt5v0rp89hy7	cmknczw79004lwt5vo99xasgc	cmknczvob0008wt5vbcaiveme	2026-01-21 01:43:28.969
\.


--
-- Data for Name: teachers; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.teachers (id, "userId", nip, nuptk, name, gender, "birthPlace", "birthDate", address, phone, email, photo, "position", status, "isCertified", "joinDate", "createdAt", "updatedAt", "certificationFile", "educationDegree", major, "maritalStatus", nik, religion, university) FROM stdin;
cmkcqahes0007wtnumwa03r5h	\N	198501012010011001	\N	Budi Santoso, S.Pd	MALE	\N	\N	\N	\N	\N	\N	PNS	ACTIVE	t	2026-01-13 15:10:10.085	2026-01-13 15:10:10.085	2026-01-13 15:10:10.085	\N	\N	\N	\N	\N	\N	\N
cmkcqahex0008wtnut4douddi	\N	198703152011012002	\N	Siti Aminah, M.Pd	FEMALE	\N	\N	\N	\N	\N	\N	PNS	ACTIVE	t	2026-01-13 15:10:10.089	2026-01-13 15:10:10.089	2026-01-13 15:10:10.089	\N	\N	\N	\N	\N	\N	\N
cmkcqahf10009wtnup7lo37kp	\N	199005202015011003	\N	Ahmad Rizki, S.Pd	MALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-13 15:10:10.093	2026-01-13 15:10:10.093	2026-01-13 15:10:10.093	\N	\N	\N	\N	\N	\N	\N
cmkm58pms0004wt26m94ljfjj	cmkm58pme0000wt26mn77ke7v	1122631723	6517638e718	Gumilar	MALE	Sumedang	2001-01-20 00:00:00	Tenjolaya	82116179745	gumilar@school.com	\N	HONORER	ACTIVE	f	2026-01-04 00:00:00	2026-01-20 05:18:37.252	2026-01-20 05:18:37.252	\N	S1	Fakultas Informatika	SINGLE	2193829183	ISLAM	Unniversitas Sebelas April
cmknczvoq000cwt5v2243ctdq	cmknczvoi000awt5ve02adbh0	\N	\N	Dra. Hj. Entin Rohayatin	FEMALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-21 01:43:28.298	2026-01-21 01:43:28.298	2026-01-21 01:43:28.298	\N	\N	\N	\N	\N	\N	\N
cmknczvpb000hwt5vmuhmjuev	cmknczvp8000fwt5vkdjkjd26	\N	\N	Tintin Sumartini, SP	MALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-21 01:43:28.319	2026-01-21 01:43:28.319	2026-01-21 01:43:28.319	\N	\N	\N	\N	\N	\N	\N
cmknczvpp000mwt5vwf0ylf90	cmknczvpm000kwt5v75tdm739	\N	\N	Aih Nursasih, S.Pd	MALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-21 01:43:28.333	2026-01-21 01:43:28.333	2026-01-21 01:43:28.333	\N	\N	\N	\N	\N	\N	\N
cmknczvq1000rwt5v0a43f1ii	cmknczvpv000pwt5v6jlauuta	\N	\N	Dadan Darmanto, S.Pd	MALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-21 01:43:28.345	2026-01-21 01:43:28.345	2026-01-21 01:43:28.345	\N	\N	\N	\N	\N	\N	\N
cmknczvq6000uwt5vdc34do96	cmknczvq3000swt5vdb397dp0	\N	\N	Herni Andriani, S.Pd	MALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-21 01:43:28.35	2026-01-21 01:43:28.35	2026-01-21 01:43:28.35	\N	\N	\N	\N	\N	\N	\N
cmknczvql000zwt5vxvijtgyk	cmknczvqc000xwt5v9zaa7bv2	\N	\N	Wida Apriliani, S.Pd	MALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-21 01:43:28.365	2026-01-21 01:43:28.365	2026-01-21 01:43:28.365	\N	\N	\N	\N	\N	\N	\N
cmknczvth0014wt5vqlzfp61s	cmknczvsw0012wt5vytli75eu	\N	\N	Agus Budi Karsa, S.Sn.	MALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-21 01:43:28.469	2026-01-21 01:43:28.469	2026-01-21 01:43:28.469	\N	\N	\N	\N	\N	\N	\N
cmknczvyk001dwt5vi7rkbxo5	cmknczvyf001bwt5vmu85xqcu	\N	\N	Heti Rosilawati, S.Pd	MALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-21 01:43:28.652	2026-01-21 01:43:28.652	2026-01-21 01:43:28.652	\N	\N	\N	\N	\N	\N	\N
cmknczvys001iwt5vjjccwiuk	cmknczvyq001gwt5vgphiqwl3	\N	\N	Asri Puspitasari Kamilah, S.Pd	MALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-21 01:43:28.66	2026-01-21 01:43:28.66	2026-01-21 01:43:28.66	\N	\N	\N	\N	\N	\N	\N
cmknczvz4001nwt5vk24xi0dw	cmknczvyx001lwt5v921qyil5	\N	\N	Dewi Lisna Sopha, S.Pd	MALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-21 01:43:28.672	2026-01-21 01:43:28.672	2026-01-21 01:43:28.672	\N	\N	\N	\N	\N	\N	\N
cmknczvzb001swt5vyhz3xnhh	cmknczvz9001qwt5v3r96aiam	\N	\N	Hani Nurhanipah, S.Sy	MALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-21 01:43:28.679	2026-01-21 01:43:28.679	2026-01-21 01:43:28.679	\N	\N	\N	\N	\N	\N	\N
cmknczvzj001xwt5vuzuu9n7w	cmknczvzh001vwt5vp68uh6pw	\N	\N	Rina Nurhayati, S.Pd	MALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-21 01:43:28.687	2026-01-21 01:43:28.687	2026-01-21 01:43:28.687	\N	\N	\N	\N	\N	\N	\N
cmknczvzr0022wt5v81347bdf	cmknczvzo0020wt5vg25rl83l	\N	\N	Ninda Permatasari, S.Pd	MALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-21 01:43:28.695	2026-01-21 01:43:28.695	2026-01-21 01:43:28.695	\N	\N	\N	\N	\N	\N	\N
cmknczw030027wt5vsztmofy7	cmknczvzw0025wt5vio1jn1ie	\N	\N	Agus Suranto, S.Pd.I.	MALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-21 01:43:28.707	2026-01-21 01:43:28.707	2026-01-21 01:43:28.707	\N	\N	\N	\N	\N	\N	\N
cmknczw0d002ewt5vh94dfbbj	cmknczw0b002cwt5vxm2nl753	\N	\N	Ajeng Aisyah Rahayu, S.Si.	MALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-21 01:43:28.718	2026-01-21 01:43:28.718	2026-01-21 01:43:28.718	\N	\N	\N	\N	\N	\N	\N
cmknczw0l002jwt5vur6yuipa	cmknczw0j002hwt5vh162sv7a	\N	\N	Mila Karmila, S.Pd.	MALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-21 01:43:28.725	2026-01-21 01:43:28.725	2026-01-21 01:43:28.725	\N	\N	\N	\N	\N	\N	\N
cmknczw19002owt5vg64ofn11	cmknczw0s002mwt5vuobsbvep	\N	\N	Wiwik Karmilah, S.Hut.	MALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-21 01:43:28.749	2026-01-21 01:43:28.749	2026-01-21 01:43:28.749	\N	\N	\N	\N	\N	\N	\N
cmknczw1p002twt5vmtsszvd5	cmknczw1k002rwt5vn3ra5gfw	\N	\N	Sofi Sofiya, S.Ag.	MALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-21 01:43:28.765	2026-01-21 01:43:28.765	2026-01-21 01:43:28.765	\N	\N	\N	\N	\N	\N	\N
cmknczw25002ywt5vbj6isuhg	cmknczw23002wwt5vne8rs7p8	\N	\N	Elsa Awalia Lesmana, S Pd.	MALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-21 01:43:28.781	2026-01-21 01:43:28.781	2026-01-21 01:43:28.781	\N	\N	\N	\N	\N	\N	\N
cmknczw2b0033wt5vxzyjv4xb	cmknczw2a0031wt5vudmxq4o5	\N	\N	Yuli Rahmayanti, SE.	MALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-21 01:43:28.788	2026-01-21 01:43:28.788	2026-01-21 01:43:28.788	\N	\N	\N	\N	\N	\N	\N
cmknczw2k0038wt5v2toh99bn	cmknczw2i0036wt5vweoto4vx	\N	\N	Rizki Abdul Gani, S.Pd.	MALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-21 01:43:28.796	2026-01-21 01:43:28.796	2026-01-21 01:43:28.796	\N	\N	\N	\N	\N	\N	\N
cmknczw2r003dwt5vzdpy13eb	cmknczw2p003bwt5vfkewkc67	\N	\N	Hannifatun Fauziyah Setiawan, S.Psi.	MALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-21 01:43:28.803	2026-01-21 01:43:28.803	2026-01-21 01:43:28.803	\N	\N	\N	\N	\N	\N	\N
cmknczw2v003gwt5vm245x3nn	cmknczw2t003ewt5v82cfjgpo	\N	\N	Nur Santika, SE.	MALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-21 01:43:28.807	2026-01-21 01:43:28.807	2026-01-21 01:43:28.807	\N	\N	\N	\N	\N	\N	\N
cmknczw37003nwt5var7s947b	cmknczw35003lwt5vr5a4o3fg	\N	\N	Agus Nata Praja, SE	MALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-21 01:43:28.819	2026-01-21 01:43:28.819	2026-01-21 01:43:28.819	\N	\N	\N	\N	\N	\N	\N
cmknczw3f003swt5vk9vd4h9a	cmknczw3e003qwt5v7vnq9z3l	\N	\N	Muhammad Iqbal, S.Li.	MALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-21 01:43:28.828	2026-01-21 01:43:28.828	2026-01-21 01:43:28.828	\N	\N	\N	\N	\N	\N	\N
cmknczw3v003zwt5v3utqjdg6	cmknczw3u003xwt5vnw66xcqe	\N	\N	Rosa Komalasari, S.Sn.	MALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-21 01:43:28.843	2026-01-21 01:43:28.843	2026-01-21 01:43:28.843	\N	\N	\N	\N	\N	\N	\N
cmknczw4a0044wt5vvzahvk8g	cmknczw460042wt5v4n5ac2aw	\N	\N	Sendy Ali Baehaq, S.Si.	MALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-21 01:43:28.858	2026-01-21 01:43:28.858	2026-01-21 01:43:28.858	\N	\N	\N	\N	\N	\N	\N
cmknczw68004bwt5vj867dkbe	cmknczw5v0049wt5v0zzpqz1a	\N	\N	Muhammad Fikri Fajari, S.Kom.	MALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-21 01:43:28.928	2026-01-21 01:43:28.928	2026-01-21 01:43:28.928	\N	\N	\N	\N	\N	\N	\N
cmknczw6g004gwt5vwxny9ms2	cmknczw6e004ewt5vnym52e51	\N	\N	Zaidan Ikhsan Gumilar, S.Kom.	MALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-21 01:43:28.937	2026-01-21 01:43:28.937	2026-01-21 01:43:28.937	\N	\N	\N	\N	\N	\N	\N
cmknczw79004lwt5vo99xasgc	cmknczw6x004jwt5vmpj9qus9	\N	\N	Rohman R, S.Pd.	MALE	\N	\N	\N	\N	\N	\N	HONORER	ACTIVE	f	2026-01-21 01:43:28.965	2026-01-21 01:43:28.965	2026-01-21 01:43:28.965	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: teaching_schedules; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.teaching_schedules (id, "teacherId", "dayOfWeek", "startTime", "endTime", "classId", "subjectId", room, "createdAt") FROM stdin;
\.


--
-- Data for Name: tim_p7; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.tim_p7 (id, "proyekId", "guruFasilitatorId", "namaTim", "siswaIds", milestone, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.users (id, email, name, "emailVerified", image, role, status, "createdAt", "updatedAt") FROM stdin;
LTbMedQIHomObquQ0f8Z69FKGTFb89lo	zaidanikhsan.g@gmail.com	Zaidan	f	\N	STAFF	ACTIVE	2026-01-13 15:54:50.718	2026-01-13 15:54:50.718
rnLr0kJ70gWNWQDvRJzU7mRj0OJgUgVq	zerreff.io@gmail.com	zaidan	f	\N	STAFF	ACTIVE	2026-01-13 15:58:47.287	2026-01-13 15:58:47.287
r4BO1lU0gcl9VCRZo9B2PGeZWELisoZX	zaidan@test.co	Zaidan Ikhsan Gumilar	f	\N	STAFF	ACTIVE	2026-01-13 16:05:37.246	2026-01-13 16:05:37.246
xZ8cdeXTZaUCiRVTvGWcdhQEFbfGdz6f	admin@school.com	Super Admin	t	\N	SUPER_ADMIN	ACTIVE	2026-01-17 01:54:38.744	2026-01-17 01:54:38.791
3dy7Zx6HOcNfjftmqAJ2Gy9UOuuWzIkQ	kepsek@school.com	Kepala Sekolah	t	\N	PRINCIPAL	ACTIVE	2026-01-17 01:54:39.132	2026-01-17 01:54:39.144
wl78V5uxrQq3rZKouvn2Ztoi48od98Dp	guru@school.com	Budi Santoso (Guru)	t	\N	TEACHER	ACTIVE	2026-01-17 01:54:39.297	2026-01-17 01:54:39.306
FqDLKtj2vkU43TiXAsqvNfc84cEp9BXo	siswa@school.com	Ahmad Siswa	t	\N	STUDENT	ACTIVE	2026-01-17 01:54:39.686	2026-01-17 01:54:39.693
ybWvJoqHiXVxCJneMmUFElTw3qNSIasn	ortu@school.com	Orang Tua Ahmad	t	\N	PARENT	ACTIVE	2026-01-17 01:54:39.907	2026-01-17 01:54:39.916
cmkjk0j590000wttfxkm0lbms	zaidan@school.com	Zaidan Ikhsan Gumilar	t	\N	STUDENT	ACTIVE	2026-01-18 09:48:51.309	2026-01-18 09:48:51.309
cmkm3xy4x0002wtucfs30vdnh	ikhsan@school.com	Ikhsan Santoso	t	\N	STUDENT	ACTIVE	2026-01-20 04:42:15.441	2026-01-20 04:42:15.441
cmkm58pme0000wt26mn77ke7v	gumilar@school.com	Gumilar	t	\N	TEACHER	ACTIVE	2026-01-20 05:18:37.238	2026-01-20 05:18:37.238
cmkncnzgv0002wtppjpnpwvi8	252610011@student.sch.id	Kevin Maulana Zakarya	f	https://ui-avatars.com/api/?name=Kevin%20Maulana%20Zakarya&background=random	STUDENT	ACTIVE	2026-01-21 01:34:13.327	2026-01-21 01:36:50.164
cmkncrcjl0008wtwotx2sg0qm	252610012@student.sch.id	Fajri Fauzan	f	https://ui-avatars.com/api/?name=Fajri%20Fauzan&background=random	STUDENT	ACTIVE	2026-01-21 01:36:50.241	2026-01-21 01:36:50.241
cmkncrck7000ewtwogh7i973t	252610022@student.sch.id	Ramdani Maulana	f	https://ui-avatars.com/api/?name=Ramdani%20Maulana&background=random	STUDENT	ACTIVE	2026-01-21 01:36:50.263	2026-01-21 01:36:50.263
cmkncrcl7000kwtwo1qcdaa33	252610002@student.sch.id	Bagas Dwi Aprian	f	https://ui-avatars.com/api/?name=Bagas%20Dwi%20Aprian&background=random	STUDENT	ACTIVE	2026-01-21 01:36:50.299	2026-01-21 01:36:50.299
cmkncrcpq000qwtwobng3sb36	252610014@student.sch.id	Muhamad Riski Fadilah	f	https://ui-avatars.com/api/?name=Muhamad%20Riski%20Fadilah&background=random	STUDENT	ACTIVE	2026-01-21 01:36:50.462	2026-01-21 01:36:50.462
cmkncrcq8000wwtwo18oiwkyy	252610029@student.sch.id	Vanesa Bilqis Pramesti	f	https://ui-avatars.com/api/?name=Vanesa%20Bilqis%20Pramesti&background=random	STUDENT	ACTIVE	2026-01-21 01:36:50.48	2026-01-21 01:36:50.48
cmkncrcqo0012wtwo7kxqxuc4	252610005@student.sch.id	Fahri Nazril Mulyadi	f	https://ui-avatars.com/api/?name=Fahri%20Nazril%20Mulyadi&background=random	STUDENT	ACTIVE	2026-01-21 01:36:50.497	2026-01-21 01:36:50.497
cmkncrcwi0018wtwo0gvw10qv	252610008@student.sch.id	Hasbie Ash Shiddiq	f	https://ui-avatars.com/api/?name=Hasbie%20Ash%20Shiddiq&background=random	STUDENT	ACTIVE	2026-01-21 01:36:50.706	2026-01-21 01:36:50.706
cmkncrcxa001ewtwo43qfede9	252610013@student.sch.id	Muhamad Rezza Awala Nur Syamsi	f	https://ui-avatars.com/api/?name=Muhamad%20Rezza%20Awala%20Nur%20Syamsi&background=random	STUDENT	ACTIVE	2026-01-21 01:36:50.734	2026-01-21 01:36:50.734
cmkncrcxt001kwtwow9ua9lxc	252610017@student.sch.id	Nazwa Zahira Sulistyawati	f	https://ui-avatars.com/api/?name=Nazwa%20Zahira%20Sulistyawati&background=random	STUDENT	ACTIVE	2026-01-21 01:36:50.753	2026-01-21 01:36:50.753
cmkncrd20001qwtwoquvz7b29	252610025@student.sch.id	Sandiputraramdani	f	https://ui-avatars.com/api/?name=Sandiputraramdani&background=random	STUDENT	ACTIVE	2026-01-21 01:36:50.904	2026-01-21 01:36:50.904
cmkncrd39001wwtwovzrz6rxl	252610027@student.sch.id	Tantry Aprilianda	f	https://ui-avatars.com/api/?name=Tantry%20Aprilianda&background=random	STUDENT	ACTIVE	2026-01-21 01:36:50.949	2026-01-21 01:36:50.949
cmkncrd480022wtwofkqe22zo	252610018@student.sch.id	Nuri Maulida	f	https://ui-avatars.com/api/?name=Nuri%20Maulida&background=random	STUDENT	ACTIVE	2026-01-21 01:36:50.984	2026-01-21 01:36:50.984
cmkncrd520028wtwoa3fwozr6	252610019@student.sch.id	Nurul Alifah O	f	https://ui-avatars.com/api/?name=Nurul%20Alifah%20O&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.014	2026-01-21 01:36:51.014
cmkncrd5k002ewtwokfav4zrr	252610032@student.sch.id	Zahra Rifa Jauza	f	https://ui-avatars.com/api/?name=Zahra%20Rifa%20Jauza&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.032	2026-01-21 01:36:51.032
cmkncrd5z002kwtwo4une9uv8	252610026@student.sch.id	Setiawati	f	https://ui-avatars.com/api/?name=Setiawati&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.047	2026-01-21 01:36:51.047
cmkncrd6b002qwtwot9621bjt	252610028@student.sch.id	Tiara Nur Fadilah	f	https://ui-avatars.com/api/?name=Tiara%20Nur%20Fadilah&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.06	2026-01-21 01:36:51.06
cmkncrd6o002wwtwooxvaqsza	252610021@student.sch.id	Raihan Abdulghani	f	https://ui-avatars.com/api/?name=Raihan%20Abdulghani&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.072	2026-01-21 01:36:51.072
cmkncrd730032wtwoju2nm3y3	252610023@student.sch.id	Refi Refian Ardiana	f	https://ui-avatars.com/api/?name=Refi%20Refian%20Ardiana&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.087	2026-01-21 01:36:51.087
cmkncrd7f0038wtwotcz4r2t3	252610024@student.sch.id	Riska Aulia	f	https://ui-avatars.com/api/?name=Riska%20Aulia&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.099	2026-01-21 01:36:51.099
cmkncrd7t003ewtwot2y2c2mp	252610031@student.sch.id	Yunita Fitriani Putri	f	https://ui-avatars.com/api/?name=Yunita%20Fitriani%20Putri&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.114	2026-01-21 01:36:51.114
cmkncrd83003kwtwosvruwy83	252610030@student.sch.id	Wina Hartati	f	https://ui-avatars.com/api/?name=Wina%20Hartati&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.123	2026-01-21 01:36:51.123
cmkncrd90003qwtwor438kw6i	252610004@student.sch.id	Citra Wiliyanti	f	https://ui-avatars.com/api/?name=Citra%20Wiliyanti&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.156	2026-01-21 01:36:51.156
cmkncrd9y003wwtwoych2mbv9	252610020@student.sch.id	Rahma Aulia Nisa	f	https://ui-avatars.com/api/?name=Rahma%20Aulia%20Nisa&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.19	2026-01-21 01:36:51.19
cmkncrdak0042wtwo72t2b2i7	252610006@student.sch.id	Fayza Aura Dinda Nadhifa	f	https://ui-avatars.com/api/?name=Fayza%20Aura%20Dinda%20Nadhifa&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.212	2026-01-21 01:36:51.212
cmkncrdb70048wtwohxb97zbb	252610010@student.sch.id	Isti Annisa Cinta Azhara	f	https://ui-avatars.com/api/?name=Isti%20Annisa%20Cinta%20Azhara&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.236	2026-01-21 01:36:51.236
cmkncrdbm004ewtwot8op1d3w	252610003@student.sch.id	Cinta Nur Arofaj	f	https://ui-avatars.com/api/?name=Cinta%20Nur%20Arofaj&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.25	2026-01-21 01:36:51.25
cmkncrdc1004kwtwo9vdvzjsv	252610007@student.sch.id	Ghaisan Rahmanza Putra	f	https://ui-avatars.com/api/?name=Ghaisan%20Rahmanza%20Putra&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.266	2026-01-21 01:36:51.266
cmkncrdcc004qwtwosptm8t0k	252610009@student.sch.id	Iis Julaeha	f	https://ui-avatars.com/api/?name=Iis%20Julaeha&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.276	2026-01-21 01:36:51.276
cmkncrdcn004wwtwotm3o8xeo	252610016@student.sch.id	Naydra Julianty	f	https://ui-avatars.com/api/?name=Naydra%20Julianty&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.288	2026-01-21 01:36:51.288
cmkncrdd10052wtwo8jghzcki	252610015@student.sch.id	Nabila Nurfarhani	f	https://ui-avatars.com/api/?name=Nabila%20Nurfarhani&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.301	2026-01-21 01:36:51.301
cmkncrddd0058wtwo6ux741dy	252610001@student.sch.id	Alia Prisilia	f	https://ui-avatars.com/api/?name=Alia%20Prisilia&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.313	2026-01-21 01:36:51.313
cmkncrddq005ewtwo9a979ysg	252610049@student.sch.id	Rija Lesmana	f	https://ui-avatars.com/api/?name=Rija%20Lesmana&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.327	2026-01-21 01:36:51.327
cmkncrde3005kwtwoi4mc63ai	252610050@student.sch.id	Rima Septiani R	f	https://ui-avatars.com/api/?name=Rima%20Septiani%20R&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.34	2026-01-21 01:36:51.34
cmkncrdel005qwtwod46wz1la	252610055@student.sch.id	Siti Yusviana Fadilah	f	https://ui-avatars.com/api/?name=Siti%20Yusviana%20Fadilah&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.357	2026-01-21 01:36:51.357
cmkncrdf3005wwtwo8c2opchn	252610052@student.sch.id	Salma Riana Putri	f	https://ui-avatars.com/api/?name=Salma%20Riana%20Putri&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.375	2026-01-21 01:36:51.375
cmkncrdfk0062wtwohum72vof	252610054@student.sch.id	Sidik Rizqi Mauludin	f	https://ui-avatars.com/api/?name=Sidik%20Rizqi%20Mauludin&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.393	2026-01-21 01:36:51.393
cmkncrdfy0068wtwo41neolpb	252610041@student.sch.id	Lintang Aldi Lesmana	f	https://ui-avatars.com/api/?name=Lintang%20Aldi%20Lesmana&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.406	2026-01-21 01:36:51.406
cmkncrdgf006ewtwolyjdm46i	252610053@student.sch.id	Shofa.shofiyyatus.sa'adah	f	https://ui-avatars.com/api/?name=Shofa.shofiyyatus.sa'adah&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.423	2026-01-21 01:36:51.423
cmkncrdh8006kwtwout1d17zl	252610056@student.sch.id	Sri Arniyanti	f	https://ui-avatars.com/api/?name=Sri%20Arniyanti&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.452	2026-01-21 01:36:51.452
cmkncrdhn006qwtwogthdm3jg	252610057@student.sch.id	Tiara Sita Dewi	f	https://ui-avatars.com/api/?name=Tiara%20Sita%20Dewi&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.467	2026-01-21 01:36:51.467
cmkncrdi7006wwtwormss1tsr	252610058@student.sch.id	Tristan Leondri Canigia	f	https://ui-avatars.com/api/?name=Tristan%20Leondri%20Canigia&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.487	2026-01-21 01:36:51.487
cmkncrdin0072wtwolovnk9ir	252610051@student.sch.id	Rivki Hidayat	f	https://ui-avatars.com/api/?name=Rivki%20Hidayat&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.503	2026-01-21 01:36:51.503
cmkncrdje0078wtwoy5phen07	252610060@student.sch.id	Yuda Jehansah	f	https://ui-avatars.com/api/?name=Yuda%20Jehansah&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.53	2026-01-21 01:36:51.53
cmkncrdjr007ewtwoz9ww29v2	252610059@student.sch.id	Yevina Candra	f	https://ui-avatars.com/api/?name=Yevina%20Candra&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.544	2026-01-21 01:36:51.544
cmkncrdk6007kwtwoik3yhyje	252610061@student.sch.id	Zamzam Alfa Salam	f	https://ui-avatars.com/api/?name=Zamzam%20Alfa%20Salam&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.558	2026-01-21 01:36:51.558
cmkncrdkj007qwtwo9xvfszpx	252610048@student.sch.id	Reza	f	https://ui-avatars.com/api/?name=Reza&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.571	2026-01-21 01:36:51.571
cmkncrdkt007wwtwo6294lbl3	252610033@student.sch.id	Alfian Gunanja Mustopa	f	https://ui-avatars.com/api/?name=Alfian%20Gunanja%20Mustopa&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.581	2026-01-21 01:36:51.581
cmkncrdl40082wtwo1hku2dn0	252610044@student.sch.id	M Fadlan R.a	f	https://ui-avatars.com/api/?name=M%20Fadlan%20R.a&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.593	2026-01-21 01:36:51.593
cmkncrdlq0088wtwocatvxifv	252610040@student.sch.id	Kiki Firmansyah	f	https://ui-avatars.com/api/?name=Kiki%20Firmansyah&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.614	2026-01-21 01:36:51.614
cmkncrdmd008ewtwoyyhbui0p	252610045@student.sch.id	Muhammad Sendy Febriansyah	f	https://ui-avatars.com/api/?name=Muhammad%20Sendy%20Febriansyah&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.638	2026-01-21 01:36:51.638
cmkncrdmt008kwtwog7yuoern	252610037@student.sch.id	Elano Danar Sugih Sunarko	f	https://ui-avatars.com/api/?name=Elano%20Danar%20Sugih%20Sunarko&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.654	2026-01-21 01:36:51.654
cmkncrdn9008qwtwobywmsrqw	252610043@student.sch.id	Muhammad Aziz Syafi'i	f	https://ui-avatars.com/api/?name=Muhammad%20Aziz%20Syafi'i&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.669	2026-01-21 01:36:51.669
cmkncrdnk008wwtwot3h2frek	252610042@student.sch.id	M Hasan Bangkit Arya Atmaja	f	https://ui-avatars.com/api/?name=M%20Hasan%20Bangkit%20Arya%20Atmaja&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.681	2026-01-21 01:36:51.681
cmkncrdo00092wtwoy5fysbpl	252610036@student.sch.id	Desta Reski A	f	https://ui-avatars.com/api/?name=Desta%20Reski%20A&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.696	2026-01-21 01:36:51.696
cmkncrdom0098wtwokji0roh6	252610046@student.sch.id	Naswa Nur Aleesya	f	https://ui-avatars.com/api/?name=Naswa%20Nur%20Aleesya&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.718	2026-01-21 01:36:51.718
cmkncrdox009ewtwo4yn31mze	252610039@student.sch.id	Ferdi Maulana S	f	https://ui-avatars.com/api/?name=Ferdi%20Maulana%20S&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.729	2026-01-21 01:36:51.729
cmkncrdpe009kwtwo5lw3ovgx	252610038@student.sch.id	Erik Davidtiansyah	f	https://ui-avatars.com/api/?name=Erik%20Davidtiansyah&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.746	2026-01-21 01:36:51.746
cmkncrdpq009qwtwojlyuqkvi	252610034@student.sch.id	Annisa Nurul Fadilah	f	https://ui-avatars.com/api/?name=Annisa%20Nurul%20Fadilah&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.758	2026-01-21 01:36:51.758
cmkncrds0009wwtwor1yhbghs	252610047@student.sch.id	Nayla Zaskia	f	https://ui-avatars.com/api/?name=Nayla%20Zaskia&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.841	2026-01-21 01:36:51.841
cmkncrdsx00a2wtwocu3v8nbk	252610035@student.sch.id	Cinta Aulia	f	https://ui-avatars.com/api/?name=Cinta%20Aulia&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.874	2026-01-21 01:36:51.874
cmkncrdtx00a8wtwo3e9k0ljl	252610091@student.sch.id	Sherly Sifa Solihat	f	https://ui-avatars.com/api/?name=Sherly%20Sifa%20Solihat&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.909	2026-01-21 01:36:51.909
cmkncrdut00aewtwoq66360pr	252610086@student.sch.id	Rehan Arya	f	https://ui-avatars.com/api/?name=Rehan%20Arya&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.941	2026-01-21 01:36:51.941
cmkncrdvl00akwtwoy12r3bq1	252610088@student.sch.id	Robani Abdul Malik	f	https://ui-avatars.com/api/?name=Robani%20Abdul%20Malik&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.969	2026-01-21 01:36:51.969
cmkncrdw700aqwtwopg4cvb2h	252610090@student.sch.id	Selpi Nurpitriani	f	https://ui-avatars.com/api/?name=Selpi%20Nurpitriani&background=random	STUDENT	ACTIVE	2026-01-21 01:36:51.991	2026-01-21 01:36:51.991
cmkncrdwy00awwtwoqp91b6vr	242610092@student.sch.id	Sri Rahayu	f	https://ui-avatars.com/api/?name=Sri%20Rahayu&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.019	2026-01-21 01:36:52.019
cmkncrdxi00b2wtwo0iy7q3x9	252610095@student.sch.id	Wina Qhoirunnisa	f	https://ui-avatars.com/api/?name=Wina%20Qhoirunnisa&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.038	2026-01-21 01:36:52.038
cmkncrdxz00b8wtwou54y23pq	252610094@student.sch.id	Teni Sumarni	f	https://ui-avatars.com/api/?name=Teni%20Sumarni&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.056	2026-01-21 01:36:52.056
cmkncrdyx00bewtwoe00587sv	252610096@student.sch.id	Zio Ramadan Putra	f	https://ui-avatars.com/api/?name=Zio%20Ramadan%20Putra&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.089	2026-01-21 01:36:52.089
cmkncrdze00bkwtwo8zvlyukx	252610087@student.sch.id	Reyzan Rohnadin Yusuf	f	https://ui-avatars.com/api/?name=Reyzan%20Rohnadin%20Yusuf&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.107	2026-01-21 01:36:52.107
cmkncrdzy00bqwtwo7xncbem0	252610093@student.sch.id	Syalfa Dikriansyah Rizkian	f	https://ui-avatars.com/api/?name=Syalfa%20Dikriansyah%20Rizkian&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.127	2026-01-21 01:36:52.127
cmkncre2z00bwwtworp4vcgtc	252610080@student.sch.id	Muhammad Fadli Anjar Saputra	f	https://ui-avatars.com/api/?name=Muhammad%20Fadli%20Anjar%20Saputra&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.235	2026-01-21 01:36:52.235
cmkncre3p00c2wtwo666w1i5t	252610082@student.sch.id	Naila Azka Aufa	f	https://ui-avatars.com/api/?name=Naila%20Azka%20Aufa&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.262	2026-01-21 01:36:52.262
cmkncre4500c8wtwo7hiuxsn4	252610089@student.sch.id	Sandy Algiansah Octorio	f	https://ui-avatars.com/api/?name=Sandy%20Algiansah%20Octorio&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.277	2026-01-21 01:36:52.277
cmkncre4g00cewtwoqkkkuz4a	252610097@student.sch.id	Zuita Sri Rahayu	f	https://ui-avatars.com/api/?name=Zuita%20Sri%20Rahayu&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.289	2026-01-21 01:36:52.289
cmkncre5w00ckwtwozhey7nog	252610083@student.sch.id	Neta Rahmawati	f	https://ui-avatars.com/api/?name=Neta%20Rahmawati&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.34	2026-01-21 01:36:52.34
cmkncre7a00cqwtwowx1q72x5	252610066@student.sch.id	Aldi Nurhakim	f	https://ui-avatars.com/api/?name=Aldi%20Nurhakim&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.39	2026-01-21 01:36:52.39
cmkncre7x00cwwtwonaqig5ht	252610081@student.sch.id	Nadine Cantika Devi	f	https://ui-avatars.com/api/?name=Nadine%20Cantika%20Devi&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.413	2026-01-21 01:36:52.413
cmkncre8d00d2wtwocyzv5seo	252610084@student.sch.id	Nurdin Wahid	f	https://ui-avatars.com/api/?name=Nurdin%20Wahid&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.429	2026-01-21 01:36:52.429
cmkncre9300d8wtwomy5d2yeo	252610062@student.sch.id	Abdul Rahim	f	https://ui-avatars.com/api/?name=Abdul%20Rahim&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.455	2026-01-21 01:36:52.455
cmkncre9i00dewtwosurzbo3l	252610085@student.sch.id	Rapi Al-ghifari	f	https://ui-avatars.com/api/?name=Rapi%20Al-ghifari&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.471	2026-01-21 01:36:52.471
cmkncreaj00dkwtwof0odq2zt	252610074@student.sch.id	Hafizah Nurafifah	f	https://ui-avatars.com/api/?name=Hafizah%20Nurafifah&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.508	2026-01-21 01:36:52.508
cmkncreb100dqwtwok6u78ku4	252610079@student.sch.id	Muhamad Riyan	f	https://ui-avatars.com/api/?name=Muhamad%20Riyan&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.525	2026-01-21 01:36:52.525
cmkncrebf00dwwtwohiiaxy4g	252610068@student.sch.id	Anisa Ayu Lestari	f	https://ui-avatars.com/api/?name=Anisa%20Ayu%20Lestari&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.54	2026-01-21 01:36:52.54
cmkncrebv00e2wtwo3vhb8gfr	252510067@student.sch.id	Anggi Ilhammudin	f	https://ui-avatars.com/api/?name=Anggi%20Ilhammudin&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.555	2026-01-21 01:36:52.555
cmkncreca00e8wtwoq2zn2ifk	252610070@student.sch.id	Azreal.fariz.rahman	f	https://ui-avatars.com/api/?name=Azreal.fariz.rahman&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.57	2026-01-21 01:36:52.57
cmkncrecn00eewtwot2tqp5yi	252610069@student.sch.id	Azhar Zainul Muttaqin	f	https://ui-avatars.com/api/?name=Azhar%20Zainul%20Muttaqin&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.584	2026-01-21 01:36:52.584
cmkncrehj00ekwtwo248gj7xd	252610064@student.sch.id	Aditia	f	https://ui-avatars.com/api/?name=Aditia&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.76	2026-01-21 01:36:52.76
cmkncrejb00eqwtwo1hyifcte	252610075@student.sch.id	Iwan Hidayat	f	https://ui-avatars.com/api/?name=Iwan%20Hidayat&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.823	2026-01-21 01:36:52.823
cmkncrek300ewwtwownl7wr1z	252610077@student.sch.id	Kiki Ahmad Gojali	f	https://ui-avatars.com/api/?name=Kiki%20Ahmad%20Gojali&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.851	2026-01-21 01:36:52.851
cmkncrekq00f2wtwod6sanv0o	252610076@student.sch.id	Jayusman Simamora	f	https://ui-avatars.com/api/?name=Jayusman%20Simamora&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.874	2026-01-21 01:36:52.874
cmkncrele00f8wtwod2ntn562	252610063@student.sch.id	Adinda Melisa	f	https://ui-avatars.com/api/?name=Adinda%20Melisa&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.899	2026-01-21 01:36:52.899
cmkncrelv00fewtwox08k5htf	252610071@student.sch.id	Cecep Kusnadi	f	https://ui-avatars.com/api/?name=Cecep%20Kusnadi&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.916	2026-01-21 01:36:52.916
cmkncremn00fkwtwou70x69en	252610072@student.sch.id	Citra Lestari	f	https://ui-avatars.com/api/?name=Citra%20Lestari&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.944	2026-01-21 01:36:52.944
cmkncremy00fqwtwo6wzeix76	252610073@student.sch.id	Dimas Pajar Permana	f	https://ui-avatars.com/api/?name=Dimas%20Pajar%20Permana&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.954	2026-01-21 01:36:52.954
cmkncrenb00fwwtwo00d9hzns	252610078@student.sch.id	Lisna Mutia Ningsih	f	https://ui-avatars.com/api/?name=Lisna%20Mutia%20Ningsih&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.967	2026-01-21 01:36:52.967
cmkncrenm00g2wtwocqtkrfid	252610065@student.sch.id	Aldi Kusnawan	f	https://ui-avatars.com/api/?name=Aldi%20Kusnawan&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.978	2026-01-21 01:36:52.978
cmkncreo000g8wtwo2l6izqd5	252610121@student.sch.id	Rikal Nazar Fauzan	f	https://ui-avatars.com/api/?name=Rikal%20Nazar%20Fauzan&background=random	STUDENT	ACTIVE	2026-01-21 01:36:52.992	2026-01-21 01:36:52.992
cmkncreoa00gewtwocl3lmtgh	252610122@student.sch.id	Rio Wahyu Ramadan	f	https://ui-avatars.com/api/?name=Rio%20Wahyu%20Ramadan&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.002	2026-01-21 01:36:53.002
cmkncreok00gkwtwoulhmbf0t	252610129@student.sch.id	Tasya Maharani	f	https://ui-avatars.com/api/?name=Tasya%20Maharani&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.012	2026-01-21 01:36:53.012
cmkncreow00gqwtwofcae5dyh	252610125@student.sch.id	Sinta Nuraeni	f	https://ui-avatars.com/api/?name=Sinta%20Nuraeni&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.024	2026-01-21 01:36:53.024
cmkncrepe00gwwtwobx1wgcbw	252610123@student.sch.id	Rustandi	f	https://ui-avatars.com/api/?name=Rustandi&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.042	2026-01-21 01:36:53.042
cmkncreq700h2wtwo05qhvt8f	252610120@student.sch.id	Raffa Riandra Rahman	f	https://ui-avatars.com/api/?name=Raffa%20Riandra%20Rahman&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.071	2026-01-21 01:36:53.071
cmkncrer000h8wtwoc2c9t9bm	252610127@student.sch.id	Syifa Nuraisyah	f	https://ui-avatars.com/api/?name=Syifa%20Nuraisyah&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.1	2026-01-21 01:36:53.1
cmkncrerp00hewtwozfli4kpi	252610124@student.sch.id	Ryan,h	f	https://ui-avatars.com/api/?name=Ryan%2Ch&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.126	2026-01-21 01:36:53.126
cmkncrevq00hkwtwoztp9azej	2526102525@student.sch.id	Jajang Jaelani	f	https://ui-avatars.com/api/?name=Jajang%20Jaelani&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.27	2026-01-21 01:36:53.27
cmkncrevz00hqwtwock4bswv6	252610126@student.sch.id	Siti Sarah Ambami	f	https://ui-avatars.com/api/?name=Siti%20Sarah%20Ambami&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.279	2026-01-21 01:36:53.279
cmkncrew800hwwtwoyjt84m24	252610110@student.sch.id	Gilang Ramadan	f	https://ui-avatars.com/api/?name=Gilang%20Ramadan&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.288	2026-01-21 01:36:53.288
cmkncrewi00i2wtwo6mqy68mf	252610111@student.sch.id	Ibrahim Setiawan	f	https://ui-avatars.com/api/?name=Ibrahim%20Setiawan&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.299	2026-01-21 01:36:53.299
cmkncrewr00i8wtwo6cnaimyj	252610119@student.sch.id	Olivia Zahra	f	https://ui-avatars.com/api/?name=Olivia%20Zahra&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.307	2026-01-21 01:36:53.307
cmkncrex200iewtwoj4uyvfhm	252610118@student.sch.id	Nurul Purnamasani	f	https://ui-avatars.com/api/?name=Nurul%20Purnamasani&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.318	2026-01-21 01:36:53.318
cmkncrexa00ikwtwouioneuc1	252610000@student.sch.id	Valent Abner W	f	https://ui-avatars.com/api/?name=Valent%20Abner%20W&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.326	2026-01-21 01:36:53.326
cmkncrexj00iqwtwowuhzeymc	252610101@student.sch.id	Alek Ali Rohman	f	https://ui-avatars.com/api/?name=Alek%20Ali%20Rohman&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.335	2026-01-21 01:36:53.335
cmkncrexu00iwwtwoqib24wf2	252610109@student.sch.id	Fitri Siti Sofiah	f	https://ui-avatars.com/api/?name=Fitri%20Siti%20Sofiah&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.347	2026-01-21 01:36:53.347
cmkncrey300j2wtwokhp5vquv	252610132@student.sch.id	Zaskia Alya Medina	f	https://ui-avatars.com/api/?name=Zaskia%20Alya%20Medina&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.355	2026-01-21 01:36:53.355
cmkncreyf00j8wtwo0fqld060	252610131@student.sch.id	Viera Zaskia	f	https://ui-avatars.com/api/?name=Viera%20Zaskia&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.367	2026-01-21 01:36:53.367
cmkncreyu00jewtwo6ff3rxfe	252610106@student.sch.id	Dewi Siti Aminah	f	https://ui-avatars.com/api/?name=Dewi%20Siti%20Aminah&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.382	2026-01-21 01:36:53.382
cmkncrf0b00jkwtwod91fh92n	252610098@student.sch.id	Adinda Ulfa Juniar	f	https://ui-avatars.com/api/?name=Adinda%20Ulfa%20Juniar&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.436	2026-01-21 01:36:53.436
cmkncrf0j00jqwtwoco8s7qed	252610100@student.sch.id	Ai Leni Widianti	f	https://ui-avatars.com/api/?name=Ai%20Leni%20Widianti&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.443	2026-01-21 01:36:53.443
cmkncrf0s00jwwtwokyswpxam	252610099@student.sch.id	Ahsan Abdul Manan	f	https://ui-avatars.com/api/?name=Ahsan%20Abdul%20Manan&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.452	2026-01-21 01:36:53.452
cmkncrf1100k2wtwolgdc9x9k	252610112@student.sch.id	Ila Lena Lestari	f	https://ui-avatars.com/api/?name=Ila%20Lena%20Lestari&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.462	2026-01-21 01:36:53.462
cmkncrf1c00k8wtwoi9glg4qw	252610103@student.sch.id	Annisa	f	https://ui-avatars.com/api/?name=Annisa&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.473	2026-01-21 01:36:53.473
cmkncrf7d00kewtwoypyyxt84	252610115@student.sch.id	Muhammad Azka Al Padhil	f	https://ui-avatars.com/api/?name=Muhammad%20Azka%20Al%20Padhil&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.689	2026-01-21 01:36:53.689
cmkncrf7x00kkwtwowajpjzu0	252610105@student.sch.id	Deca Anindia Syafira	f	https://ui-avatars.com/api/?name=Deca%20Anindia%20Syafira&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.709	2026-01-21 01:36:53.709
cmkncrf8500kqwtwoy5zt7lvb	252610104@student.sch.id	Bunga Regina Putri	f	https://ui-avatars.com/api/?name=Bunga%20Regina%20Putri&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.718	2026-01-21 01:36:53.718
cmkncrf8f00kwwtwof76elslp	252610117@student.sch.id	Nathasya Chantika Aprillia	f	https://ui-avatars.com/api/?name=Nathasya%20Chantika%20Aprillia&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.727	2026-01-21 01:36:53.727
cmkncrf8y00l2wtwo0ek3al8j	252610128@student.sch.id	Taraono	f	https://ui-avatars.com/api/?name=Taraono&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.746	2026-01-21 01:36:53.746
cmkncrfax00l8wtwo1oe3u7hj	252610102@student.sch.id	Anisa Ramadhan	f	https://ui-avatars.com/api/?name=Anisa%20Ramadhan&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.818	2026-01-21 01:36:53.818
cmkncrfba00lewtwo275x6ztd	252610108@student.sch.id	Febi Wahyudi	f	https://ui-avatars.com/api/?name=Febi%20Wahyudi&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.831	2026-01-21 01:36:53.831
cmkncrfbl00lkwtwoh1uspm1e	2526100107@student.sch.id	Dikri Maulana	f	https://ui-avatars.com/api/?name=Dikri%20Maulana&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.842	2026-01-21 01:36:53.842
cmkncrfca00lqwtwofxd0dzbh	252610116@student.sch.id	Nagita Putriani	f	https://ui-avatars.com/api/?name=Nagita%20Putriani&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.867	2026-01-21 01:36:53.867
cmkncrfcl00lwwtwo5r8q0wxd	252610114@student.sch.id	Kaisya Putri Karina	f	https://ui-avatars.com/api/?name=Kaisya%20Putri%20Karina&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.878	2026-01-21 01:36:53.878
cmkncrfdp00m2wtwod04ajujo	252610135@student.sch.id	Amikal Almisky	f	https://ui-avatars.com/api/?name=Amikal%20Almisky&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.917	2026-01-21 01:36:53.917
cmkncrfe100m8wtwo0l1j8mub	252610147@student.sch.id	Irham Arief Fauzi	f	https://ui-avatars.com/api/?name=Irham%20Arief%20Fauzi&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.929	2026-01-21 01:36:53.929
cmkncrfea00mewtwo2uhaxmm5	252610145@student.sch.id	Gilang Ibrahim Ramadhan	f	https://ui-avatars.com/api/?name=Gilang%20Ibrahim%20Ramadhan&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.938	2026-01-21 01:36:53.938
cmkncrfej00mkwtwop11c5t87	252610156@student.sch.id	Raka Nur Sulaeman	f	https://ui-avatars.com/api/?name=Raka%20Nur%20Sulaeman&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.947	2026-01-21 01:36:53.947
cmkncrfey00mqwtworv35qqn4	252610136@student.sch.id	Andi	f	https://ui-avatars.com/api/?name=Andi&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.962	2026-01-21 01:36:53.962
cmkncrffe00mwwtwo6jxpwjp5	252610143@student.sch.id	Daffa Milano Putra	f	https://ui-avatars.com/api/?name=Daffa%20Milano%20Putra&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.978	2026-01-21 01:36:53.978
cmkncrffs00n2wtwon0x8jstj	252610154@student.sch.id	Putra Islamy	f	https://ui-avatars.com/api/?name=Putra%20Islamy&background=random	STUDENT	ACTIVE	2026-01-21 01:36:53.992	2026-01-21 01:36:53.992
cmkncrfg500n8wtwourc44o8p	252610140@student.sch.id	Avrilia Dewi Septiani Putri	f	https://ui-avatars.com/api/?name=Avrilia%20Dewi%20Septiani%20Putri&background=random	STUDENT	ACTIVE	2026-01-21 01:36:54.005	2026-01-21 01:36:54.005
cmkncrfgt00newtwo84pnpm7e	252610146@student.sch.id	Ica Inriani	f	https://ui-avatars.com/api/?name=Ica%20Inriani&background=random	STUDENT	ACTIVE	2026-01-21 01:36:54.029	2026-01-21 01:36:54.029
cmkncrfha00nkwtwoklohhru1	252610139@student.sch.id	Apriliana Putra Ginanjar	f	https://ui-avatars.com/api/?name=Apriliana%20Putra%20Ginanjar&background=random	STUDENT	ACTIVE	2026-01-21 01:36:54.046	2026-01-21 01:36:54.046
cmkncrfhk00nqwtwovzuuedj6	252610137@student.sch.id	Anisa Herawati	f	https://ui-avatars.com/api/?name=Anisa%20Herawati&background=random	STUDENT	ACTIVE	2026-01-21 01:36:54.056	2026-01-21 01:36:54.056
cmkncrfht00nwwtwoj6qepu7x	262610164@student.sch.id	Sonia Maharani	f	https://ui-avatars.com/api/?name=Sonia%20Maharani&background=random	STUDENT	ACTIVE	2026-01-21 01:36:54.066	2026-01-21 01:36:54.066
cmkncrfi400o2wtwo85mfunm5	252610144@student.sch.id	Febi Amalia H	f	https://ui-avatars.com/api/?name=Febi%20Amalia%20H&background=random	STUDENT	ACTIVE	2026-01-21 01:36:54.076	2026-01-21 01:36:54.076
cmkncrfik00o8wtwo11zipgsc	252610134@student.sch.id	Ahmad Alief Zulfikar	f	https://ui-avatars.com/api/?name=Ahmad%20Alief%20Zulfikar&background=random	STUDENT	ACTIVE	2026-01-21 01:36:54.093	2026-01-21 01:36:54.093
cmkncrfit00oewtwoa2zoztjz	252610148@student.sch.id	Kayla Yunianti	f	https://ui-avatars.com/api/?name=Kayla%20Yunianti&background=random	STUDENT	ACTIVE	2026-01-21 01:36:54.102	2026-01-21 01:36:54.102
cmkncrfj700okwtwo744ujxtr	252610168@student.sch.id	Yuni Nurfitriyani	f	https://ui-avatars.com/api/?name=Yuni%20Nurfitriyani&background=random	STUDENT	ACTIVE	2026-01-21 01:36:54.116	2026-01-21 01:36:54.116
cmkncrfji00oqwtwosm0hn4rf	252610165@student.sch.id	Syifa Kesya Nabila	f	https://ui-avatars.com/api/?name=Syifa%20Kesya%20Nabila&background=random	STUDENT	ACTIVE	2026-01-21 01:36:54.127	2026-01-21 01:36:54.127
cmkncrfjw00owwtwoh89u756b	252610161@student.sch.id	Salsabila Azahra	f	https://ui-avatars.com/api/?name=Salsabila%20Azahra&background=random	STUDENT	ACTIVE	2026-01-21 01:36:54.14	2026-01-21 01:36:54.14
cmkncrfkj00p2wtwo4qe8yd33	252610142@student.sch.id	Cincin Elsia Joya	f	https://ui-avatars.com/api/?name=Cincin%20Elsia%20Joya&background=random	STUDENT	ACTIVE	2026-01-21 01:36:54.164	2026-01-21 01:36:54.164
cmkncrfl000p8wtwolbvs8zan	252610138@student.sch.id	Anjani Oktavia	f	https://ui-avatars.com/api/?name=Anjani%20Oktavia&background=random	STUDENT	ACTIVE	2026-01-21 01:36:54.18	2026-01-21 01:36:54.18
cmkncrfla00pewtwo2eq524u7	252610166@student.sch.id	Teguh Ady Gitara	f	https://ui-avatars.com/api/?name=Teguh%20Ady%20Gitara&background=random	STUDENT	ACTIVE	2026-01-21 01:36:54.19	2026-01-21 01:36:54.19
cmkncrflj00pkwtwox9kqk6cq	252610151@student.sch.id	Nadia Oktaviani	f	https://ui-avatars.com/api/?name=Nadia%20Oktaviani&background=random	STUDENT	ACTIVE	2026-01-21 01:36:54.2	2026-01-21 01:36:54.2
cmkncrfly00pqwtwop438mbw3	252610153@student.sch.id	Nazla Salsabilla Lirabbiha	f	https://ui-avatars.com/api/?name=Nazla%20Salsabilla%20Lirabbiha&background=random	STUDENT	ACTIVE	2026-01-21 01:36:54.215	2026-01-21 01:36:54.215
cmkncrfmo00pwwtwoxy7pm14e	252610152@student.sch.id	Nadin Maisya Aqila	f	https://ui-avatars.com/api/?name=Nadin%20Maisya%20Aqila&background=random	STUDENT	ACTIVE	2026-01-21 01:36:54.24	2026-01-21 01:36:54.24
cmkncrfn700q2wtwogpsgqd8y	252610150@student.sch.id	Muhammad Faiz Al Ghiffari	f	https://ui-avatars.com/api/?name=Muhammad%20Faiz%20Al%20Ghiffari&background=random	STUDENT	ACTIVE	2026-01-21 01:36:54.259	2026-01-21 01:36:54.259
cmkncrftx00q8wtwotinieya6	252610163@student.sch.id	Siti Nurpatimah	f	https://ui-avatars.com/api/?name=Siti%20Nurpatimah&background=random	STUDENT	ACTIVE	2026-01-21 01:36:54.501	2026-01-21 01:36:54.501
cmkncrfwq00qkwtwou2ir2nkb	252610141@student.sch.id	Celsi Selani	f	https://ui-avatars.com/api/?name=Celsi%20Selani&background=random	STUDENT	ACTIVE	2026-01-21 01:36:54.602	2026-01-21 01:36:54.602
cmkncrfxj00qqwtwo76lww988	252610157@student.sch.id	Rasya Aulia Putri	f	https://ui-avatars.com/api/?name=Rasya%20Aulia%20Putri&background=random	STUDENT	ACTIVE	2026-01-21 01:36:54.632	2026-01-21 01:36:54.632
cmkncrg0800qwwtwog6pdyq1j	252610155@student.sch.id	Putri Siti Nurhawa	f	https://ui-avatars.com/api/?name=Putri%20Siti%20Nurhawa&background=random	STUDENT	ACTIVE	2026-01-21 01:36:54.728	2026-01-21 01:36:54.728
cmkncrg0k00r2wtwouce7uqw9	252610133@student.sch.id	Abiliana Adiani	f	https://ui-avatars.com/api/?name=Abiliana%20Adiani&background=random	STUDENT	ACTIVE	2026-01-21 01:36:54.74	2026-01-21 01:36:54.74
cmkncrg1100r8wtwo0668kqd5	252610160@student.sch.id	Salsabila	f	https://ui-avatars.com/api/?name=Salsabila&background=random	STUDENT	ACTIVE	2026-01-21 01:36:54.758	2026-01-21 01:36:54.758
cmkncrg2a00rewtwo82kapdpd	252610149@student.sch.id	Marshya Mega Aryanti	f	https://ui-avatars.com/api/?name=Marshya%20Mega%20Aryanti&background=random	STUDENT	ACTIVE	2026-01-21 01:36:54.803	2026-01-21 01:36:54.803
cmkncrfus00qewtwozf5t41am	252610162@student.sch.id	Sawitri Gia Mauladi	f	https://ui-avatars.com/api/?name=Sawitri%20Gia%20Mauladi&background=random	STUDENT	ACTIVE	2026-01-21 01:36:54.532	2026-01-21 01:36:54.843
cmkncrg3v00rowtwoerjqrlp1	252610159@student.sch.id	Rizal Permana	f	https://ui-avatars.com/api/?name=Rizal%20Permana&background=random	STUDENT	ACTIVE	2026-01-21 01:36:54.859	2026-01-21 01:36:54.859
cmkncrg4q00ruwtwoip0ky6cn	252610158@student.sch.id	Riyan Taryana	f	https://ui-avatars.com/api/?name=Riyan%20Taryana&background=random	STUDENT	ACTIVE	2026-01-21 01:36:54.885	2026-01-21 01:36:54.885
cmknczvoi000awt5ve02adbh0	drahjentin1@teacher.sch.id	Dra. Hj. Entin Rohayatin	f	https://ui-avatars.com/api/?name=Dra.%20Hj.%20Entin%20Rohayatin&background=random	TEACHER	ACTIVE	2026-01-21 01:43:28.29	2026-01-21 01:43:28.29
cmknczvp8000fwt5vkdjkjd26	tintinsuma2@teacher.sch.id	Tintin Sumartini, SP	f	https://ui-avatars.com/api/?name=Tintin%20Sumartini%2C%20SP&background=random	TEACHER	ACTIVE	2026-01-21 01:43:28.317	2026-01-21 01:43:28.317
cmknczvpm000kwt5v75tdm739	aihnursasi3@teacher.sch.id	Aih Nursasih, S.Pd	f	https://ui-avatars.com/api/?name=Aih%20Nursasih%2C%20S.Pd&background=random	TEACHER	ACTIVE	2026-01-21 01:43:28.331	2026-01-21 01:43:28.331
cmknczvpv000pwt5v6jlauuta	dadandarma4@teacher.sch.id	Dadan Darmanto, S.Pd	f	https://ui-avatars.com/api/?name=Dadan%20Darmanto%2C%20S.Pd&background=random	PRINCIPAL	ACTIVE	2026-01-21 01:43:28.339	2026-01-21 01:43:28.339
cmknczvq3000swt5vdb397dp0	herniandri5@teacher.sch.id	Herni Andriani, S.Pd	f	https://ui-avatars.com/api/?name=Herni%20Andriani%2C%20S.Pd&background=random	TEACHER	ACTIVE	2026-01-21 01:43:28.348	2026-01-21 01:43:28.348
cmknczvqc000xwt5v9zaa7bv2	widaaprili6@teacher.sch.id	Wida Apriliani, S.Pd	f	https://ui-avatars.com/api/?name=Wida%20Apriliani%2C%20S.Pd&background=random	TEACHER	ACTIVE	2026-01-21 01:43:28.356	2026-01-21 01:43:28.356
cmknczvsw0012wt5vytli75eu	agusbudika7@teacher.sch.id	Agus Budi Karsa, S.Sn.	f	https://ui-avatars.com/api/?name=Agus%20Budi%20Karsa%2C%20S.Sn.&background=random	TEACHER	ACTIVE	2026-01-21 01:43:28.449	2026-01-21 01:43:28.449
cmknczvyf001bwt5vmu85xqcu	hetirosila8@teacher.sch.id	Heti Rosilawati, S.Pd	f	https://ui-avatars.com/api/?name=Heti%20Rosilawati%2C%20S.Pd&background=random	TEACHER	ACTIVE	2026-01-21 01:43:28.648	2026-01-21 01:43:28.648
cmknczvyq001gwt5vgphiqwl3	asripuspit9@teacher.sch.id	Asri Puspitasari Kamilah, S.Pd	f	https://ui-avatars.com/api/?name=Asri%20Puspitasari%20Kamilah%2C%20S.Pd&background=random	TEACHER	ACTIVE	2026-01-21 01:43:28.658	2026-01-21 01:43:28.658
cmknczvyx001lwt5v921qyil5	dewilisnas10@teacher.sch.id	Dewi Lisna Sopha, S.Pd	f	https://ui-avatars.com/api/?name=Dewi%20Lisna%20Sopha%2C%20S.Pd&background=random	TEACHER	ACTIVE	2026-01-21 01:43:28.665	2026-01-21 01:43:28.665
cmknczvz9001qwt5v3r96aiam	haninurhan11@teacher.sch.id	Hani Nurhanipah, S.Sy	f	https://ui-avatars.com/api/?name=Hani%20Nurhanipah%2C%20S.Sy&background=random	TEACHER	ACTIVE	2026-01-21 01:43:28.677	2026-01-21 01:43:28.677
cmknczvzh001vwt5vp68uh6pw	rinanurhay12@teacher.sch.id	Rina Nurhayati, S.Pd	f	https://ui-avatars.com/api/?name=Rina%20Nurhayati%2C%20S.Pd&background=random	TEACHER	ACTIVE	2026-01-21 01:43:28.685	2026-01-21 01:43:28.685
cmknczvzo0020wt5vg25rl83l	nindaperma13@teacher.sch.id	Ninda Permatasari, S.Pd	f	https://ui-avatars.com/api/?name=Ninda%20Permatasari%2C%20S.Pd&background=random	TEACHER	ACTIVE	2026-01-21 01:43:28.693	2026-01-21 01:43:28.693
cmknczvzw0025wt5vio1jn1ie	agussurant14@teacher.sch.id	Agus Suranto, S.Pd.I.	f	https://ui-avatars.com/api/?name=Agus%20Suranto%2C%20S.Pd.I.&background=random	TEACHER	ACTIVE	2026-01-21 01:43:28.701	2026-01-21 01:43:28.701
cmknczw0b002cwt5vxm2nl753	ajengaisya15@teacher.sch.id	Ajeng Aisyah Rahayu, S.Si.	f	https://ui-avatars.com/api/?name=Ajeng%20Aisyah%20Rahayu%2C%20S.Si.&background=random	TEACHER	ACTIVE	2026-01-21 01:43:28.716	2026-01-21 01:43:28.716
cmknczw0j002hwt5vh162sv7a	milakarmil16@teacher.sch.id	Mila Karmila, S.Pd.	f	https://ui-avatars.com/api/?name=Mila%20Karmila%2C%20S.Pd.&background=random	TEACHER	ACTIVE	2026-01-21 01:43:28.724	2026-01-21 01:43:28.724
cmknczw0s002mwt5vuobsbvep	wiwikkarmi17@teacher.sch.id	Wiwik Karmilah, S.Hut.	f	https://ui-avatars.com/api/?name=Wiwik%20Karmilah%2C%20S.Hut.&background=random	TEACHER	ACTIVE	2026-01-21 01:43:28.732	2026-01-21 01:43:28.732
cmknczw1k002rwt5vn3ra5gfw	sofisofiya18@teacher.sch.id	Sofi Sofiya, S.Ag.	f	https://ui-avatars.com/api/?name=Sofi%20Sofiya%2C%20S.Ag.&background=random	TEACHER	ACTIVE	2026-01-21 01:43:28.761	2026-01-21 01:43:28.761
cmknczw23002wwt5vne8rs7p8	elsaawalia19@teacher.sch.id	Elsa Awalia Lesmana, S Pd.	f	https://ui-avatars.com/api/?name=Elsa%20Awalia%20Lesmana%2C%20S%20Pd.&background=random	TEACHER	ACTIVE	2026-01-21 01:43:28.779	2026-01-21 01:43:28.779
cmknczw2a0031wt5vudmxq4o5	yulirahmay20@teacher.sch.id	Yuli Rahmayanti, SE.	f	https://ui-avatars.com/api/?name=Yuli%20Rahmayanti%2C%20SE.&background=random	TEACHER	ACTIVE	2026-01-21 01:43:28.786	2026-01-21 01:43:28.786
cmknczw2i0036wt5vweoto4vx	rizkiabdul21@teacher.sch.id	Rizki Abdul Gani, S.Pd.	f	https://ui-avatars.com/api/?name=Rizki%20Abdul%20Gani%2C%20S.Pd.&background=random	TEACHER	ACTIVE	2026-01-21 01:43:28.794	2026-01-21 01:43:28.794
cmknczw2p003bwt5vfkewkc67	hannifatun22@teacher.sch.id	Hannifatun Fauziyah Setiawan, S.Psi.	f	https://ui-avatars.com/api/?name=Hannifatun%20Fauziyah%20Setiawan%2C%20S.Psi.&background=random	TEACHER	ACTIVE	2026-01-21 01:43:28.801	2026-01-21 01:43:28.801
cmknczw2t003ewt5v82cfjgpo	nursantika23@teacher.sch.id	Nur Santika, SE.	f	https://ui-avatars.com/api/?name=Nur%20Santika%2C%20SE.&background=random	TEACHER	ACTIVE	2026-01-21 01:43:28.805	2026-01-21 01:43:28.805
cmknczw35003lwt5vr5a4o3fg	agusnatapr24@teacher.sch.id	Agus Nata Praja, SE	f	https://ui-avatars.com/api/?name=Agus%20Nata%20Praja%2C%20SE&background=random	TEACHER	ACTIVE	2026-01-21 01:43:28.817	2026-01-21 01:43:28.817
cmknczw3e003qwt5v7vnq9z3l	muhammadiq25@teacher.sch.id	Muhammad Iqbal, S.Li.	f	https://ui-avatars.com/api/?name=Muhammad%20Iqbal%2C%20S.Li.&background=random	TEACHER	ACTIVE	2026-01-21 01:43:28.826	2026-01-21 01:43:28.826
cmknczw3u003xwt5vnw66xcqe	rosakomala26@teacher.sch.id	Rosa Komalasari, S.Sn.	f	https://ui-avatars.com/api/?name=Rosa%20Komalasari%2C%20S.Sn.&background=random	TEACHER	ACTIVE	2026-01-21 01:43:28.842	2026-01-21 01:43:28.842
cmknczw460042wt5v4n5ac2aw	sendyaliba27@teacher.sch.id	Sendy Ali Baehaq, S.Si.	f	https://ui-avatars.com/api/?name=Sendy%20Ali%20Baehaq%2C%20S.Si.&background=random	TEACHER	ACTIVE	2026-01-21 01:43:28.853	2026-01-21 01:43:28.853
cmknczw5v0049wt5v0zzpqz1a	muhammadfi28@teacher.sch.id	Muhammad Fikri Fajari, S.Kom.	f	https://ui-avatars.com/api/?name=Muhammad%20Fikri%20Fajari%2C%20S.Kom.&background=random	TEACHER	ACTIVE	2026-01-21 01:43:28.915	2026-01-21 01:43:28.915
cmknczw6e004ewt5vnym52e51	zaidanikhs29@teacher.sch.id	Zaidan Ikhsan Gumilar, S.Kom.	f	https://ui-avatars.com/api/?name=Zaidan%20Ikhsan%20Gumilar%2C%20S.Kom.&background=random	TEACHER	ACTIVE	2026-01-21 01:43:28.935	2026-01-21 01:43:28.935
cmknczw6x004jwt5vmpj9qus9	rohmanrspd30@teacher.sch.id	Rohman R, S.Pd.	f	https://ui-avatars.com/api/?name=Rohman%20R%2C%20S.Pd.&background=random	TEACHER	ACTIVE	2026-01-21 01:43:28.954	2026-01-21 01:43:28.954
cmknlrid00000wteac8xtcfh7	staff@school.com	Admin TU	t	\N	STAFF	ACTIVE	2026-01-21 05:48:54.324	2026-01-21 05:48:54.324
\.


--
-- Data for Name: verifications; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.verifications (id, identifier, value, "expiresAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: whatsapp_messages; Type: TABLE DATA; Schema: public; Owner: zaidan
--

COPY public.whatsapp_messages (id, recipients, message, template, "sentAt", status, "sentBy", "createdAt") FROM stdin;
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: academic_calendar_events academic_calendar_events_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.academic_calendar_events
    ADD CONSTRAINT academic_calendar_events_pkey PRIMARY KEY (id);


--
-- Name: academic_years academic_years_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.academic_years
    ADD CONSTRAINT academic_years_pkey PRIMARY KEY (id);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: achievements achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_pkey PRIMARY KEY (id);


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);


--
-- Name: assignment_attachments assignment_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.assignment_attachments
    ADD CONSTRAINT assignment_attachments_pkey PRIMARY KEY (id);


--
-- Name: assignment_submissions assignment_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.assignment_submissions
    ADD CONSTRAINT assignment_submissions_pkey PRIMARY KEY (id);


--
-- Name: assignments assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_pkey PRIMARY KEY (id);


--
-- Name: capaian_pembelajaran capaian_pembelajaran_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.capaian_pembelajaran
    ADD CONSTRAINT capaian_pembelajaran_pkey PRIMARY KEY (id);


--
-- Name: class_enrollments class_enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.class_enrollments
    ADD CONSTRAINT class_enrollments_pkey PRIMARY KEY (id);


--
-- Name: class_schedules class_schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.class_schedules
    ADD CONSTRAINT class_schedules_pkey PRIMARY KEY (id);


--
-- Name: classes classes_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_pkey PRIMARY KEY (id);


--
-- Name: curriculum_modules curriculum_modules_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.curriculum_modules
    ADD CONSTRAINT curriculum_modules_pkey PRIMARY KEY (id);


--
-- Name: curriculums curriculums_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.curriculums
    ADD CONSTRAINT curriculums_pkey PRIMARY KEY (id);


--
-- Name: data_backups data_backups_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.data_backups
    ADD CONSTRAINT data_backups_pkey PRIMARY KEY (id);


--
-- Name: dimensi_p7 dimensi_p7_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.dimensi_p7
    ADD CONSTRAINT dimensi_p7_pkey PRIMARY KEY (id);


--
-- Name: extracurricular_members extracurricular_members_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.extracurricular_members
    ADD CONSTRAINT extracurricular_members_pkey PRIMARY KEY (id);


--
-- Name: extracurriculars extracurriculars_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.extracurriculars
    ADD CONSTRAINT extracurriculars_pkey PRIMARY KEY (id);


--
-- Name: facilities facilities_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.facilities
    ADD CONSTRAINT facilities_pkey PRIMARY KEY (id);


--
-- Name: fee_types fee_types_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.fee_types
    ADD CONSTRAINT fee_types_pkey PRIMARY KEY (id);


--
-- Name: finance_transactions finance_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.finance_transactions
    ADD CONSTRAINT finance_transactions_pkey PRIMARY KEY (id);


--
-- Name: gallery_items gallery_items_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.gallery_items
    ADD CONSTRAINT gallery_items_pkey PRIMARY KEY (id);


--
-- Name: grades grades_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_pkey PRIMARY KEY (id);


--
-- Name: inventory_items inventory_items_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.inventory_items
    ADD CONSTRAINT inventory_items_pkey PRIMARY KEY (id);


--
-- Name: letters letters_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.letters
    ADD CONSTRAINT letters_pkey PRIMARY KEY (id);


--
-- Name: maintenance_records maintenance_records_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.maintenance_records
    ADD CONSTRAINT maintenance_records_pkey PRIMARY KEY (id);


--
-- Name: modul_ajar modul_ajar_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.modul_ajar
    ADD CONSTRAINT modul_ajar_pkey PRIMARY KEY (id);


--
-- Name: org_members org_members_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.org_members
    ADD CONSTRAINT org_members_pkey PRIMARY KEY (id);


--
-- Name: p5_participants p5_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.p5_participants
    ADD CONSTRAINT p5_participants_pkey PRIMARY KEY (id);


--
-- Name: p5_projects p5_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.p5_projects
    ADD CONSTRAINT p5_projects_pkey PRIMARY KEY (id);


--
-- Name: p7_penilaian_tim p7_penilaian_tim_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.p7_penilaian_tim
    ADD CONSTRAINT p7_penilaian_tim_pkey PRIMARY KEY (id);


--
-- Name: p7_proyek p7_proyek_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.p7_proyek
    ADD CONSTRAINT p7_proyek_pkey PRIMARY KEY (id);


--
-- Name: penilaian_formatif penilaian_formatif_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.penilaian_formatif
    ADD CONSTRAINT penilaian_formatif_pkey PRIMARY KEY (id);


--
-- Name: penilaian_sumatif penilaian_sumatif_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.penilaian_sumatif
    ADD CONSTRAINT penilaian_sumatif_pkey PRIMARY KEY (id);


--
-- Name: performance_tasks performance_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.performance_tasks
    ADD CONSTRAINT performance_tasks_pkey PRIMARY KEY (id);


--
-- Name: portofolio_siswa portofolio_siswa_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.portofolio_siswa
    ADD CONSTRAINT portofolio_siswa_pkey PRIMARY KEY (id);


--
-- Name: ppdb_batches ppdb_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.ppdb_batches
    ADD CONSTRAINT ppdb_batches_pkey PRIMARY KEY (id);


--
-- Name: ppdb_registrations ppdb_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.ppdb_registrations
    ADD CONSTRAINT ppdb_registrations_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: room_bookings room_bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.room_bookings
    ADD CONSTRAINT room_bookings_pkey PRIMARY KEY (id);


--
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- Name: schools schools_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: spp_billings spp_billings_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.spp_billings
    ADD CONSTRAINT spp_billings_pkey PRIMARY KEY (id);


--
-- Name: student_attendances student_attendances_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.student_attendances
    ADD CONSTRAINT student_attendances_pkey PRIMARY KEY (id);


--
-- Name: student_organizations student_organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.student_organizations
    ADD CONSTRAINT student_organizations_pkey PRIMARY KEY (id);


--
-- Name: student_permits student_permits_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.student_permits
    ADD CONSTRAINT student_permits_pkey PRIMARY KEY (id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: subjects subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_pkey PRIMARY KEY (id);


--
-- Name: system_configs system_configs_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.system_configs
    ADD CONSTRAINT system_configs_pkey PRIMARY KEY (id);


--
-- Name: system_settings system_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_pkey PRIMARY KEY (id);


--
-- Name: teacher_attendances teacher_attendances_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.teacher_attendances
    ADD CONSTRAINT teacher_attendances_pkey PRIMARY KEY (id);


--
-- Name: teacher_performances teacher_performances_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.teacher_performances
    ADD CONSTRAINT teacher_performances_pkey PRIMARY KEY (id);


--
-- Name: teacher_permits teacher_permits_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.teacher_permits
    ADD CONSTRAINT teacher_permits_pkey PRIMARY KEY (id);


--
-- Name: teacher_subjects teacher_subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.teacher_subjects
    ADD CONSTRAINT teacher_subjects_pkey PRIMARY KEY (id);


--
-- Name: teachers teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (id);


--
-- Name: teaching_schedules teaching_schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.teaching_schedules
    ADD CONSTRAINT teaching_schedules_pkey PRIMARY KEY (id);


--
-- Name: tim_p7 tim_p7_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.tim_p7
    ADD CONSTRAINT tim_p7_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: verifications verifications_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.verifications
    ADD CONSTRAINT verifications_pkey PRIMARY KEY (id);


--
-- Name: whatsapp_messages whatsapp_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.whatsapp_messages
    ADD CONSTRAINT whatsapp_messages_pkey PRIMARY KEY (id);


--
-- Name: assignment_submissions_assignmentId_studentId_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX "assignment_submissions_assignmentId_studentId_key" ON public.assignment_submissions USING btree ("assignmentId", "studentId");


--
-- Name: capaian_pembelajaran_fase_mataPelajaranId_idx; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE INDEX "capaian_pembelajaran_fase_mataPelajaranId_idx" ON public.capaian_pembelajaran USING btree (fase, "mataPelajaranId");


--
-- Name: capaian_pembelajaran_kodeCP_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX "capaian_pembelajaran_kodeCP_key" ON public.capaian_pembelajaran USING btree ("kodeCP");


--
-- Name: class_enrollments_studentId_classId_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX "class_enrollments_studentId_classId_key" ON public.class_enrollments USING btree ("studentId", "classId");


--
-- Name: classes_name_academicYearId_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX "classes_name_academicYearId_key" ON public.classes USING btree (name, "academicYearId");


--
-- Name: dimensi_p7_kode_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX dimensi_p7_kode_key ON public.dimensi_p7 USING btree (kode);


--
-- Name: extracurricular_members_extracurricularId_studentId_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX "extracurricular_members_extracurricularId_studentId_key" ON public.extracurricular_members USING btree ("extracurricularId", "studentId");


--
-- Name: grades_studentId_subjectId_academicYearId_semester_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX "grades_studentId_subjectId_academicYearId_semester_key" ON public.grades USING btree ("studentId", "subjectId", "academicYearId", semester);


--
-- Name: inventory_items_code_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX inventory_items_code_key ON public.inventory_items USING btree (code);


--
-- Name: letters_letterNumber_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX "letters_letterNumber_key" ON public.letters USING btree ("letterNumber");


--
-- Name: modul_ajar_cpId_status_idx; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE INDEX "modul_ajar_cpId_status_idx" ON public.modul_ajar USING btree ("cpId", status);


--
-- Name: modul_ajar_guruId_tahunAjaranId_idx; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE INDEX "modul_ajar_guruId_tahunAjaranId_idx" ON public.modul_ajar USING btree ("guruId", "tahunAjaranId");


--
-- Name: p5_participants_projectId_studentId_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX "p5_participants_projectId_studentId_key" ON public.p5_participants USING btree ("projectId", "studentId");


--
-- Name: p7_penilaian_tim_timId_siswaId_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX "p7_penilaian_tim_timId_siswaId_key" ON public.p7_penilaian_tim USING btree ("timId", "siswaId");


--
-- Name: penilaian_formatif_siswaId_modulAjarId_idx; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE INDEX "penilaian_formatif_siswaId_modulAjarId_idx" ON public.penilaian_formatif USING btree ("siswaId", "modulAjarId");


--
-- Name: penilaian_sumatif_siswaId_modulAjarId_idx; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE INDEX "penilaian_sumatif_siswaId_modulAjarId_idx" ON public.penilaian_sumatif USING btree ("siswaId", "modulAjarId");


--
-- Name: portofolio_siswa_siswaId_tahunAjaranId_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX "portofolio_siswa_siswaId_tahunAjaranId_key" ON public.portofolio_siswa USING btree ("siswaId", "tahunAjaranId");


--
-- Name: ppdb_registrations_registrationNo_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX "ppdb_registrations_registrationNo_key" ON public.ppdb_registrations USING btree ("registrationNo");


--
-- Name: roles_name_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX roles_name_key ON public.roles USING btree (name);


--
-- Name: rooms_code_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX rooms_code_key ON public.rooms USING btree (code);


--
-- Name: schools_npsn_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX schools_npsn_key ON public.schools USING btree (npsn);


--
-- Name: sessions_token_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX sessions_token_key ON public.sessions USING btree (token);


--
-- Name: student_attendances_studentId_date_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX "student_attendances_studentId_date_key" ON public.student_attendances USING btree ("studentId", date);


--
-- Name: students_nik_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX students_nik_key ON public.students USING btree (nik);


--
-- Name: students_nis_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX students_nis_key ON public.students USING btree (nis);


--
-- Name: students_nisn_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX students_nisn_key ON public.students USING btree (nisn);


--
-- Name: subjects_code_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX subjects_code_key ON public.subjects USING btree (code);


--
-- Name: system_configs_key_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX system_configs_key_key ON public.system_configs USING btree (key);


--
-- Name: system_settings_key_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX system_settings_key_key ON public.system_settings USING btree (key);


--
-- Name: teacher_attendances_teacherId_date_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX "teacher_attendances_teacherId_date_key" ON public.teacher_attendances USING btree ("teacherId", date);


--
-- Name: teacher_performances_teacherId_academicYearId_semester_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX "teacher_performances_teacherId_academicYearId_semester_key" ON public.teacher_performances USING btree ("teacherId", "academicYearId", semester);


--
-- Name: teacher_subjects_teacherId_subjectId_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX "teacher_subjects_teacherId_subjectId_key" ON public.teacher_subjects USING btree ("teacherId", "subjectId");


--
-- Name: teachers_nik_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX teachers_nik_key ON public.teachers USING btree (nik);


--
-- Name: teachers_nip_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX teachers_nip_key ON public.teachers USING btree (nip);


--
-- Name: teachers_nuptk_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX teachers_nuptk_key ON public.teachers USING btree (nuptk);


--
-- Name: teachers_userId_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX "teachers_userId_key" ON public.teachers USING btree ("userId");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: zaidan
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: academic_calendar_events academic_calendar_events_academicYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.academic_calendar_events
    ADD CONSTRAINT "academic_calendar_events_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES public.academic_years(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: accounts accounts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: achievements achievements_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT "achievements_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public.schools(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: achievements achievements_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT "achievements_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: achievements achievements_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT "achievements_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public.teachers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: activity_logs activity_logs_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT "activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: assignment_attachments assignment_attachments_assignmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.assignment_attachments
    ADD CONSTRAINT "assignment_attachments_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES public.assignments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: assignment_submissions assignment_submissions_assignmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.assignment_submissions
    ADD CONSTRAINT "assignment_submissions_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES public.assignments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: assignment_submissions assignment_submissions_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.assignment_submissions
    ADD CONSTRAINT "assignment_submissions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: assignments assignments_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT "assignments_classId_fkey" FOREIGN KEY ("classId") REFERENCES public.classes(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: assignments assignments_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT "assignments_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public.subjects(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: assignments assignments_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT "assignments_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public.teachers(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: capaian_pembelajaran capaian_pembelajaran_mataPelajaranId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.capaian_pembelajaran
    ADD CONSTRAINT "capaian_pembelajaran_mataPelajaranId_fkey" FOREIGN KEY ("mataPelajaranId") REFERENCES public.subjects(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: class_enrollments class_enrollments_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.class_enrollments
    ADD CONSTRAINT "class_enrollments_classId_fkey" FOREIGN KEY ("classId") REFERENCES public.classes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: class_enrollments class_enrollments_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.class_enrollments
    ADD CONSTRAINT "class_enrollments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: class_schedules class_schedules_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.class_schedules
    ADD CONSTRAINT "class_schedules_classId_fkey" FOREIGN KEY ("classId") REFERENCES public.classes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: class_schedules class_schedules_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.class_schedules
    ADD CONSTRAINT "class_schedules_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public.subjects(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: classes classes_academicYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT "classes_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES public.academic_years(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: classes classes_homeroomTeacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT "classes_homeroomTeacherId_fkey" FOREIGN KEY ("homeroomTeacherId") REFERENCES public.teachers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: curriculum_modules curriculum_modules_curriculumId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.curriculum_modules
    ADD CONSTRAINT "curriculum_modules_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES public.curriculums(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: extracurricular_members extracurricular_members_extracurricularId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.extracurricular_members
    ADD CONSTRAINT "extracurricular_members_extracurricularId_fkey" FOREIGN KEY ("extracurricularId") REFERENCES public.extracurriculars(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: extracurricular_members extracurricular_members_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.extracurricular_members
    ADD CONSTRAINT "extracurricular_members_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: extracurriculars extracurriculars_advisorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.extracurriculars
    ADD CONSTRAINT "extracurriculars_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES public.teachers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: facilities facilities_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.facilities
    ADD CONSTRAINT "facilities_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public.schools(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: gallery_items gallery_items_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.gallery_items
    ADD CONSTRAINT "gallery_items_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public.schools(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: grades grades_academicYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT "grades_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES public.academic_years(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: grades grades_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT "grades_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: grades grades_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT "grades_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public.subjects(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: maintenance_records maintenance_records_itemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.maintenance_records
    ADD CONSTRAINT "maintenance_records_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES public.inventory_items(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: modul_ajar modul_ajar_cpId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.modul_ajar
    ADD CONSTRAINT "modul_ajar_cpId_fkey" FOREIGN KEY ("cpId") REFERENCES public.capaian_pembelajaran(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: modul_ajar modul_ajar_guruId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.modul_ajar
    ADD CONSTRAINT "modul_ajar_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES public.teachers(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: modul_ajar modul_ajar_tahunAjaranId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.modul_ajar
    ADD CONSTRAINT "modul_ajar_tahunAjaranId_fkey" FOREIGN KEY ("tahunAjaranId") REFERENCES public.academic_years(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: org_members org_members_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.org_members
    ADD CONSTRAINT "org_members_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public.student_organizations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: org_members org_members_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.org_members
    ADD CONSTRAINT "org_members_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: p5_participants p5_participants_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.p5_participants
    ADD CONSTRAINT "p5_participants_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public.p5_projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: p7_penilaian_tim p7_penilaian_tim_siswaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.p7_penilaian_tim
    ADD CONSTRAINT "p7_penilaian_tim_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: p7_penilaian_tim p7_penilaian_tim_timId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.p7_penilaian_tim
    ADD CONSTRAINT "p7_penilaian_tim_timId_fkey" FOREIGN KEY ("timId") REFERENCES public.tim_p7(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: p7_proyek p7_proyek_dimensiId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.p7_proyek
    ADD CONSTRAINT "p7_proyek_dimensiId_fkey" FOREIGN KEY ("dimensiId") REFERENCES public.dimensi_p7(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: p7_proyek p7_proyek_tahunAjaranId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.p7_proyek
    ADD CONSTRAINT "p7_proyek_tahunAjaranId_fkey" FOREIGN KEY ("tahunAjaranId") REFERENCES public.academic_years(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: penilaian_formatif penilaian_formatif_modulAjarId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.penilaian_formatif
    ADD CONSTRAINT "penilaian_formatif_modulAjarId_fkey" FOREIGN KEY ("modulAjarId") REFERENCES public.modul_ajar(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: penilaian_formatif penilaian_formatif_siswaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.penilaian_formatif
    ADD CONSTRAINT "penilaian_formatif_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: penilaian_sumatif penilaian_sumatif_modulAjarId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.penilaian_sumatif
    ADD CONSTRAINT "penilaian_sumatif_modulAjarId_fkey" FOREIGN KEY ("modulAjarId") REFERENCES public.modul_ajar(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: penilaian_sumatif penilaian_sumatif_siswaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.penilaian_sumatif
    ADD CONSTRAINT "penilaian_sumatif_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: performance_tasks performance_tasks_modulAjarId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.performance_tasks
    ADD CONSTRAINT "performance_tasks_modulAjarId_fkey" FOREIGN KEY ("modulAjarId") REFERENCES public.modul_ajar(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: performance_tasks performance_tasks_siswaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.performance_tasks
    ADD CONSTRAINT "performance_tasks_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: portofolio_siswa portofolio_siswa_siswaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.portofolio_siswa
    ADD CONSTRAINT "portofolio_siswa_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: portofolio_siswa portofolio_siswa_tahunAjaranId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.portofolio_siswa
    ADD CONSTRAINT "portofolio_siswa_tahunAjaranId_fkey" FOREIGN KEY ("tahunAjaranId") REFERENCES public.academic_years(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ppdb_batches ppdb_batches_academicYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.ppdb_batches
    ADD CONSTRAINT "ppdb_batches_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES public.academic_years(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ppdb_registrations ppdb_registrations_batchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.ppdb_registrations
    ADD CONSTRAINT "ppdb_registrations_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES public.ppdb_batches(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: room_bookings room_bookings_roomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.room_bookings
    ADD CONSTRAINT "room_bookings_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES public.rooms(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sessions sessions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: spp_billings spp_billings_academicYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.spp_billings
    ADD CONSTRAINT "spp_billings_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES public.academic_years(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: spp_billings spp_billings_feeTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.spp_billings
    ADD CONSTRAINT "spp_billings_feeTypeId_fkey" FOREIGN KEY ("feeTypeId") REFERENCES public.fee_types(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: spp_billings spp_billings_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.spp_billings
    ADD CONSTRAINT "spp_billings_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_attendances student_attendances_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.student_attendances
    ADD CONSTRAINT "student_attendances_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_organizations student_organizations_advisorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.student_organizations
    ADD CONSTRAINT "student_organizations_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES public.teachers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: student_organizations student_organizations_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.student_organizations
    ADD CONSTRAINT "student_organizations_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public.schools(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_permits student_permits_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.student_permits
    ADD CONSTRAINT "student_permits_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teacher_attendances teacher_attendances_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.teacher_attendances
    ADD CONSTRAINT "teacher_attendances_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public.teachers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teacher_performances teacher_performances_academicYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.teacher_performances
    ADD CONSTRAINT "teacher_performances_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES public.academic_years(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: teacher_performances teacher_performances_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.teacher_performances
    ADD CONSTRAINT "teacher_performances_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public.teachers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teacher_permits teacher_permits_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.teacher_permits
    ADD CONSTRAINT "teacher_permits_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public.teachers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teacher_subjects teacher_subjects_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.teacher_subjects
    ADD CONSTRAINT "teacher_subjects_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public.subjects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teacher_subjects teacher_subjects_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.teacher_subjects
    ADD CONSTRAINT "teacher_subjects_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public.teachers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teachers teachers_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT "teachers_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: teaching_schedules teaching_schedules_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.teaching_schedules
    ADD CONSTRAINT "teaching_schedules_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public.teachers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tim_p7 tim_p7_guruFasilitatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.tim_p7
    ADD CONSTRAINT "tim_p7_guruFasilitatorId_fkey" FOREIGN KEY ("guruFasilitatorId") REFERENCES public.teachers(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tim_p7 tim_p7_proyekId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zaidan
--

ALTER TABLE ONLY public.tim_p7
    ADD CONSTRAINT "tim_p7_proyekId_fkey" FOREIGN KEY ("proyekId") REFERENCES public.p7_proyek(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict uPiMUxcLOK9IRfvMara4gXxaczLGx46rhiJU3alR3btnQUmDYlgnbrhUlPh7Tdq

