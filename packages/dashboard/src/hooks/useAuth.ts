import { useState, useEffect, useCallback } from 'react'
import { api, API_URL } from '../lib/api'
import type { User, Session } from '../types'

interface AuthState {
    user: User | null
    loading: boolean
    error: string | null
}

export function useAuth() {
    const [state, setState] = useState<AuthState>({
        user: null,
        loading: true,
        error: null,
    })

    const fetchSession = useCallback(async () => {
        try {
            const session = await api.get<Session>('/api/auth/get-session')
            console.log('useAuth: Fetched session:', session)
            setState({ user: session?.user || null, loading: false, error: null })
        } catch {
            setState({ user: null, loading: false, error: null })
        }
    }, [])

    useEffect(() => {
        fetchSession()
    }, [fetchSession])

    const login = async (email: string, password: string): Promise<User | null> => {
        setState(prev => ({ ...prev, loading: true, error: null }))
        try {
            const response = await fetch(`${API_URL}/api/auth/sign-in/email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Login gagal')
            }

            const session = await api.get<Session>('/api/auth/get-session')
            console.log('useAuth: Fetched session:', session)
            setState({ user: session?.user || null, loading: false, error: null })

            return session?.user || null
        } catch (err: unknown) {
            const error = err as Error
            setState(prev => ({ ...prev, loading: false, error: error.message }))
            return null
        }
    }

    const signup = async (name: string, email: string, password: string): Promise<boolean> => {
        setState(prev => ({ ...prev, loading: true, error: null }))
        try {
            const response = await fetch(`${API_URL}/api/auth/sign-up/email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name, email, password }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Registrasi gagal')
            }

            return true
        } catch (err: unknown) {
            const error = err as Error
            setState(prev => ({ ...prev, loading: false, error: error.message }))
            return false
        }
    }

    const logout = async (): Promise<void> => {
        try {
            await fetch(`${API_URL}/api/auth/sign-out`, {
                method: 'POST',
                credentials: 'include',
            })
        } finally {
            setState({ user: null, loading: false, error: null })
        }
    }

    const loginWithGoogle = () => {
        window.location.href = `${API_URL}/api/auth/sign-in/social?provider=google`
    }

    return {
        user: state.user,
        loading: state.loading,
        error: state.error,
        isAuthenticated: !!state.user,
        login,
        signup,
        logout,
        loginWithGoogle,
        refetch: fetchSession,
    }
}
