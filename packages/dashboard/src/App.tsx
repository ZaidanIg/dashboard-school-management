import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuthContext } from './contexts/AuthContext'
import { ToastProvider, useToast } from './contexts/ToastContext'
import { CurriculumProvider } from './contexts/CurriculumContext'
import { apiEvents } from './lib/api'
import { useEffect } from 'react'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/layout/Layout'
import StudentLayout from './components/layout/StudentLayout'

// Dashboard
import Dashboard from './pages/dashboard/Dashboard'

// Auth
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import NotFound from './pages/NotFound'

// Students
import StudentList from './pages/students/StudentList'
import StudentDetail from './pages/students/StudentDetail'
import StudentCreate from './pages/students/StudentCreate'
import StudentEdit from './pages/students/StudentEdit'
import ClassList from './pages/students/ClassList'
import ClassDetail from './pages/students/ClassDetail'
import StudentAttendance from './pages/students/StudentAttendance'
import Extracurricular from './pages/students/Extracurricular'


// Teachers
import TeacherList from './pages/teachers/TeacherList'
import TeacherCreate from './pages/teachers/TeacherCreate'
import TeacherEdit from './pages/teachers/TeacherEdit'
import TeacherDetail from './pages/teachers/TeacherDetail'
import TeachingSchedule from './pages/teachers/TeachingSchedule'
import TeacherAttendance from './pages/teachers/TeacherAttendance'
import PerformanceEvaluation from './pages/teachers/PerformanceEvaluation'

// Finance
import FinanceDashboard from './pages/finance/FinanceDashboard'
import SPPBilling from './pages/finance/SPPBilling'
import Income from './pages/finance/Income'
import Expenses from './pages/finance/Expenses'
import FinanceReports from './pages/finance/FinanceReports'

// Academic
import AcademicYears from './pages/academic/AcademicYears'
import Subjects from './pages/academic/Subjects'
import ClassSchedule from '@/pages/academic/ClassSchedule'
import AcademicCalendar from '@/pages/academic/AcademicCalendar'
import AssignmentList from '@/pages/academic/lms/AssignmentList'
import AssignmentDetail from '@/pages/academic/lms/AssignmentDetail'


// Curriculum
import CurriculumManagement from './pages/curriculum/CurriculumManagement'
import CurriculumDetail from './pages/curriculum/CurriculumDetail'
import { PenilaianSumatif, Portofolio } from './pages/curriculum/ComingSoon'
import ModulAjarPage from './pages/kurikulum-merdeka/ModulAjar'

// Grading
import Penilaian from './pages/grading/Penilaian'
import GradeInput from './pages/grading/GradeInput'
import EReport from './pages/grading/EReport'
import GradeAnalytics from './pages/grading/GradeAnalytics'
import P5Projects from './pages/grading/P5Projects'

// Kurikulum Merdeka Pages (sub-routes of curriculum)
import CapaianPembelajaran from './pages/kurikulum-merdeka/CapaianPembelajaran'
import P7Proyek from './pages/kurikulum-merdeka/P7Proyek'
import PenilaianFormatif from './pages/kurikulum-merdeka/PenilaianFormatif'

// Infrastructure
import Inventory from './pages/infrastructure/Inventory'
import RoomBooking from './pages/infrastructure/RoomBooking'
import Maintenance from './pages/infrastructure/Maintenance'

// Communication
import Announcements from './pages/communication/Announcements'
import Letters from './pages/communication/Letters'
import WhatsAppBlast from './pages/communication/WhatsAppBlast'

// Settings
import UserManagement from './pages/settings/UserManagement'
import RolesPermissions from './pages/settings/RolesPermissions'
import DataBackup from './pages/settings/DataBackup'
import SystemConfig from './pages/settings/SystemConfig'
import CurriculumConfigAdmin from './pages/settings/CurriculumConfigAdmin'

// Student Portal
import StudentPortalDashboard from './pages/student/Dashboard'
import StudentPortalAttendance from './pages/student/Attendance'
import StudentPortalAssignments from './pages/student/Assignments'
import StudentPortalAssignmentDetail from './pages/student/AssignmentDetail'
import StudentPortalSchedule from './pages/student/Schedule'
import StudentPortalGrades from './pages/student/Grades'
import StudentPortalAnnouncements from './pages/student/Announcements'
import StudentPortalEnrollment from './pages/student/ClassEnrollment'

// Teacher Portal
import TeacherLayout from './components/layout/TeacherLayout'
import TeacherPortalDashboard from './pages/teacher/Dashboard'
import TeacherPortalSchedule from './pages/teacher/Schedule'
import TeacherPortalAssignments from './pages/teacher/Assignments'
import TeacherPortalAssignmentForm from './pages/teacher/assignments/AssignmentForm'
import TeacherPortalAssignmentDetail from './pages/teacher/assignments/AssignmentDetail'
import TeacherPortalGrading from './pages/teacher/Grading'
import TeacherPortalAttendance from './pages/teacher/Attendance'

// Staff Portal
import StaffLayout from './components/layout/StaffLayout'
import StaffPortalDashboard from './pages/staff/Dashboard'
import StaffPortalStudents from './pages/staff/Students'
import StaffPortalTeachers from './pages/staff/Teachers'
import StaffPortalInventory from './pages/staff/Inventory'
import StaffPortalSalary from './pages/staff/finance/Salary'
import StaffPortalSPP from './pages/staff/finance/SPP'
import StaffPortalIncome from './pages/staff/finance/Income'
import StaffPortalExpenses from './pages/staff/finance/Expenses'
import StaffPortalAnnouncements from './pages/staff/Announcements'


// School Profile
import SchoolIdentity from './pages/profile/SchoolIdentity'
import OrganizationStructure from './pages/profile/OrganizationStructure'
import Facilities from './pages/profile/Facilities'
import Gallery from './pages/profile/Gallery'
import Achievements from './pages/profile/Achievements'
import OSIS from './pages/profile/OSIS'
import MPK from './pages/profile/MPK'

// Public Pages
import LandingPage from './pages/public/LandingPage'
import PPDBRegister from './pages/public/PPDBRegister'

// PPDB Admin
import PPDBBatchAdmin from './pages/ppdb/PPDBBatchAdmin'
import PPDBRegistrations from './pages/ppdb/PPDBRegistrations'

function GlobalToastListener() {
    const { addToast } = useToast()

    useEffect(() => {
        const handleError = (message: string) => {
            addToast('error', message)
        }
        apiEvents.on('error', handleError)
    }, [addToast])

    return null
}

function Gateway() {
    const { user, loading, isAuthenticated } = useAuthContext()

    console.log('Gateway State:', { loading, isAuthenticated, role: user?.role })

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

    // Not authenticated -> Public landing page
    if (!isAuthenticated) {
        console.log('Gateway: Not authenticated, redirecting to /home (public)')
        return <Navigate to="/home" replace />
    }

    // Student -> Student Portal
    if (user?.role === 'STUDENT') {
        console.log('Gateway: Student detected, redirecting to /student-portal')
        return <Navigate to="/student-portal" replace />
    }

    // Teacher -> Teacher Portal
    if (user?.role === 'TEACHER') {
        console.log('Gateway: Teacher detected, redirecting to /teacher-portal')
        return <Navigate to="/teacher-portal" replace />
    }

    // Staff -> Staff Portal
    if (user?.role === 'STAFF') {
        console.log('Gateway: Staff detected, redirecting to /staff-portal')
        return <Navigate to="/staff-portal" replace />
    }

    // Admin/Principal -> Dashboard
    console.log('Gateway: Admin detected, redirecting to /dashboard')
    return <Navigate to="/dashboard" replace />
}

function App() {
    return (
        <ToastProvider>
            <GlobalToastListener />
            <AuthProvider>
                <div className="bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white antialiased">
                    <CurriculumProvider>
                        <Routes>
                            {/* Default Route - Gateway decides where to go */}
                            <Route path="/" element={<Gateway />} />

                            {/* Auth Routes */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />

                            {/* Public Landing Page */}
                            <Route path="/home" element={<LandingPage />} />
                            <Route path="/ppdb/register" element={<PPDBRegister />} />

                            {/* Student Portal Routes (Authenticated Students Only) */}
                            <Route
                                path="/student-portal"
                                element={
                                    <ProtectedRoute requiredRoles={['STUDENT']}>
                                        <StudentLayout />
                                    </ProtectedRoute>
                                }
                            >
                                <Route index element={<StudentPortalDashboard />} />
                                <Route path="attendance" element={<StudentPortalAttendance />} />
                                <Route path="assignments" element={<StudentPortalAssignments />} />
                                <Route path="assignments/:id" element={<StudentPortalAssignmentDetail />} />
                                <Route path="schedule" element={<StudentPortalSchedule />} />
                                <Route path="grades" element={<StudentPortalGrades />} />
                                <Route path="announcements" element={<StudentPortalAnnouncements />} />
                                <Route path="enrollment" element={<StudentPortalEnrollment />} />


                                {/* School Profile (Read Only) */}
                                <Route path="profile-school">
                                    <Route path="identity" element={<SchoolIdentity />} />
                                    <Route path="organization" element={<OrganizationStructure />} />
                                    <Route path="facilities" element={<Facilities />} />
                                    <Route path="gallery" element={<Gallery />} />
                                    <Route path="achievements" element={<Achievements />} />
                                </Route>
                            </Route>

                            {/* Teacher Portal Routes (Authenticated Teachers Only) */}
                            <Route
                                path="/teacher-portal"
                                element={
                                    <ProtectedRoute requiredRoles={['TEACHER']}>
                                        <TeacherLayout />
                                    </ProtectedRoute>
                                }
                            >
                                <Route index element={<TeacherPortalDashboard />} />
                                <Route path="schedule" element={<TeacherPortalSchedule />} />

                                <Route path="assignments" element={<TeacherPortalAssignments />} />
                                <Route path="assignments/new" element={<TeacherPortalAssignmentForm />} />
                                <Route path="assignments/:id" element={<TeacherPortalAssignmentDetail />} />
                                <Route path="assignments/:id/edit" element={<TeacherPortalAssignmentForm />} />
                                <Route path="grading" element={<TeacherPortalGrading />} />
                                <Route path="attendance" element={<TeacherPortalAttendance />} />
                            </Route>

                            {/* Staff Portal Routes (Authenticated Staff Only) */}
                            <Route
                                path="/staff-portal"
                                element={
                                    <ProtectedRoute requiredRoles={['STAFF']}>
                                        <StaffLayout />
                                    </ProtectedRoute>
                                }
                            >
                                <Route index element={<StaffPortalDashboard />} />
                                <Route path="students" element={<StaffPortalStudents />} />
                                <Route path="teachers" element={<StaffPortalTeachers />} />
                                <Route path="inventory" element={<StaffPortalInventory />} />
                                <Route path="finance/salary" element={<StaffPortalSalary />} />
                                <Route path="finance/spp" element={<StaffPortalSPP />} />
                                <Route path="finance/income" element={<StaffPortalIncome />} />
                                <Route path="finance/expenses" element={<StaffPortalExpenses />} />
                                <Route path="announcements" element={<StaffPortalAnnouncements />} />
                            </Route>

                            {/* Admin/Teacher Routes (Wrapped in Layout) */}
                            <Route
                                element={
                                    <ProtectedRoute requiredRoles={['SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'STAFF']}>
                                        <Layout />
                                    </ProtectedRoute>
                                }
                            >
                                {/* Dashboard moved to /dashboard */}
                                <Route path="/dashboard" element={<Dashboard />} />

                                {/* Students */}
                                <Route path="students" element={<StudentList />} />
                                <Route path="students/new" element={<StudentCreate />} />
                                <Route path="students/:id" element={<StudentDetail />} />
                                <Route path="students/:id/edit" element={<StudentEdit />} />
                                <Route path="students/classes" element={<ClassList />} />
                                <Route path="students/classes/:id" element={<ClassDetail />} />
                                <Route path="students/attendance" element={<StudentAttendance />} />
                                <Route path="students/extracurricular" element={<Extracurricular />} />

                                {/* Teachers */}
                                <Route path="teachers" element={<TeacherList />} />
                                <Route path="teachers/new" element={<TeacherCreate />} />
                                <Route path="teachers/:id" element={<TeacherDetail />} />
                                <Route path="teachers/:id/edit" element={<TeacherEdit />} />
                                <Route path="teachers/schedule" element={<TeachingSchedule />} />
                                <Route path="teachers/attendance" element={<TeacherAttendance />} />
                                <Route path="teachers/performance" element={<PerformanceEvaluation />} />

                                {/* Finance */}
                                <Route path="finance" element={<FinanceDashboard />} />
                                <Route path="finance/billing" element={<SPPBilling />} />
                                <Route path="finance/income" element={<Income />} />
                                <Route path="finance/expenses" element={<Expenses />} />
                                <Route path="finance/reports" element={<FinanceReports />} />

                                {/* Academic */}
                                <Route path="academic/years" element={<AcademicYears />} />
                                <Route path="academic/subjects" element={<Subjects />} />
                                <Route path="academic/schedules" element={<ClassSchedule />} />
                                <Route path="academic/lms" element={<AssignmentList />} />
                                <Route path="academic/lms/assignments/:id" element={<AssignmentDetail />} />

                                <Route path="academic/calendar" element={<AcademicCalendar />} />

                                {/* Curriculum */}
                                <Route path="curriculum" element={<CurriculumManagement />} />
                                <Route path="curriculum/cp" element={<CapaianPembelajaran />} />
                                <Route path="curriculum/modul-ajar" element={<ModulAjarPage />} />
                                <Route path="curriculum/penilaian-formatif" element={<PenilaianFormatif />} />
                                <Route path="curriculum/penilaian-sumatif" element={<PenilaianSumatif />} />
                                <Route path="curriculum/p7" element={<P7Proyek />} />
                                <Route path="curriculum/portofolio" element={<Portofolio />} />
                                <Route path="curriculum/detail/:id" element={<CurriculumDetail />} />

                                {/* Grading */}
                                <Route path="grading" element={<Penilaian />} />
                                <Route path="grading/input" element={<GradeInput />} />
                                <Route path="grading/reports" element={<EReport />} />
                                <Route path="grading/analytics" element={<GradeAnalytics />} />
                                <Route path="grading/p5" element={<P5Projects />} />

                                {/* Infrastructure */}
                                <Route path="infrastructure/inventory" element={<Inventory />} />
                                <Route path="infrastructure/booking" element={<RoomBooking />} />
                                <Route path="infrastructure/maintenance" element={<Maintenance />} />

                                {/* Communication */}
                                <Route path="communication/announcements" element={<Announcements />} />
                                <Route path="communication/letters" element={<Letters />} />
                                <Route path="communication/whatsapp" element={<WhatsAppBlast />} />

                                {/* Settings */}
                                <Route path="settings/users" element={<UserManagement />} />
                                <Route path="settings/roles" element={<RolesPermissions />} />
                                <Route path="settings/backup" element={<DataBackup />} />
                                <Route path="settings/config" element={<SystemConfig />} />
                                <Route path="settings/curriculum" element={<CurriculumConfigAdmin />} />

                                {/* School Profile */}
                                <Route path="profile/identity" element={<SchoolIdentity />} />
                                <Route path="profile/organization" element={<OrganizationStructure />} />
                                <Route path="profile/facilities" element={<Facilities />} />
                                <Route path="profile/gallery" element={<Gallery />} />
                                <Route path="profile/achievements" element={<Achievements />} />
                                <Route path="profile/osis" element={<OSIS />} />
                                <Route path="profile/mpk" element={<MPK />} />

                                {/* PPDB Admin */}
                                <Route path="ppdb/batches" element={<PPDBBatchAdmin />} />
                                <Route path="ppdb/registrations" element={<PPDBRegistrations />} />
                            </Route>

                            {/* 404 Not Found */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </CurriculumProvider>
                </div>
            </AuthProvider>
        </ToastProvider>
    )
}

export default App
