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
        console.log('ProtectedRoute: Role mismatch for role', user.role, 'on path', location.pathname)
        let targetPath = '/'
        if (user.role === 'STUDENT') {
            targetPath = '/student-portal'
        } else if (user.role === 'TEACHER') {
            targetPath = '/teacher-portal'
        } else if (user.role === 'STAFF') {
            targetPath = '/staff-portal'
        } else if (user.role === 'SUPER_ADMIN' || user.role === 'PRINCIPAL' || (user.role as string) === 'ADMIN') {
            targetPath = '/dashboard'
        }

        // Prevent infinite loop if already at targetPath
        if (location.pathname === targetPath) {
            console.log('ProtectedRoute: Already at targetPath but unauthorized, falling back to landing page')
            return <Navigate to="/" replace />
        }

        return <Navigate to={targetPath} replace />
    }

    return <>{children}</>
}
