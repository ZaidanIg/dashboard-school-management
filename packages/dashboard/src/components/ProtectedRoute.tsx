import { Navigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'
import LoadingSpinner from './common/LoadingSpinner'

interface ProtectedRouteProps {
    children: React.ReactNode
    requiredRoles?: string[]
}

export default function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
    const { user, loading, isAuthenticated } = useAuthContext()
    const location = useLocation()

    console.log(`ProtectedRoute [${location.pathname}]:`, { loading, isAuthenticated, role: user?.role, requiredRoles })

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <LoadingSpinner size="lg" text="Memuat..." />
            </div>
        )
    }

    if (!isAuthenticated) {
        console.log('ProtectedRoute: Not authenticated, redirecting to login')
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (requiredRoles && user && !requiredRoles.includes(user.role)) {
        console.log('ProtectedRoute: Role mismatch')
        // Prevent infinite loop: redirect to appropriate home
        if (user.role === 'STUDENT') {
            console.log('ProtectedRoute: Redirecting Student to /student-portal')
            return <Navigate to="/student-portal" replace />
        }
        if (user.role === 'TEACHER') {
            console.log('ProtectedRoute: Redirecting Teacher to /teacher-portal')
            return <Navigate to="/teacher-portal" replace />
        }
        if (user.role === 'STAFF') {
            console.log('ProtectedRoute: Redirecting Staff to /staff-portal')
            return <Navigate to="/staff-portal" replace />
        }
        console.log('ProtectedRoute: Redirecting Admin/Other to /dashboard')
        return <Navigate to="/dashboard" replace />
    }

    return <>{children}</>
}
