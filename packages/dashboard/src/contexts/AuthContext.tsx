import { createContext, useContext, type ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import type { User } from '../types'

interface AuthContextType {
    user: User | null
    loading: boolean
    error: string | null
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<User | null>
    signup: (name: string, email: string, password: string) => Promise<boolean>
    logout: () => Promise<void>
    loginWithGoogle: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const auth = useAuth()

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuthContext must be used within AuthProvider')
    }
    return context
}
