// API Base Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://0.0.0.0:3001'

// Response types
interface ApiResponse<T> {
    data: T
    meta?: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

interface ApiError {
    statusCode: number
    error: string
    message: string
}

// Simple Event Emitter for API events
type ApiEventType = 'error' | 'success'
type ApiEventHandler = (data: any) => void

class ApiEventEmitter {
    private listeners: Record<string, ApiEventHandler[]> = {}

    on(event: ApiEventType, handler: ApiEventHandler) {
        if (!this.listeners[event]) this.listeners[event] = []
        this.listeners[event].push(handler)
    }

    emit(event: ApiEventType, data: any) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(handler => handler(data))
        }
    }
}

export const apiEvents = new ApiEventEmitter()

// API Client
class ApiClient {
    private baseUrl: string

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`

        const isFormData = options.body instanceof FormData
        const headers: Record<string, string> = {
            ...options.headers as Record<string, string>,
        }

        if (!isFormData) {
            headers['Content-Type'] = 'application/json'
        }

        const config: RequestInit = {
            ...options,
            headers,
            credentials: 'include', // Include cookies for auth
        }

        const response = await fetch(url, config)

        if (!response.ok) {
            let errorMessage = 'Something went wrong'
            try {
                const errorData = await response.json()
                errorMessage = errorData.message || response.statusText
            } catch {
                errorMessage = response.statusText
            }

            // Emit error event for global handling (400, 401, 403, 404, 405)
            if ([400, 401, 403, 404, 405].includes(response.status)) {
                apiEvents.emit('error', errorMessage)
            }

            throw {
                message: errorMessage,
                status: response.status,
            }
        }

        // Handle 204 No Content
        if (response.status === 204) {
            return null as T
        }

        return response.json()
    }

    // GET request
    async get<T>(endpoint: string, params?: Record<string, string | number | undefined>): Promise<T> {
        let url = endpoint
        if (params) {
            const searchParams = new URLSearchParams()
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    searchParams.append(key, String(value))
                }
            })
            const queryString = searchParams.toString()
            if (queryString) {
                url += `?${queryString}`
            }
        }
        return this.request<T>(url, { method: 'GET' })
    }

    // POST request
    async post<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined),
        })
    }

    // PUT request
    async put<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined),
        })
    }

    // DELETE request
    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' })
    }

    // PATCH request
    async patch<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined),
        })
    }
}

// Export singleton instance
export const api = new ApiClient(API_URL)

// Export types
export type { ApiResponse, ApiError }

// Export base URL for auth
export { API_URL }
