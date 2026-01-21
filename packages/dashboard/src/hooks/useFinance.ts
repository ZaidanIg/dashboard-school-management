import { useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'
import type { ApiResponse } from '../lib/api'
import type { FinanceDashboard, SPPBilling, FinanceTransaction, FeeType } from '../types'
import { useMutations, downloadFile } from './useShared'

// Dashboard Stats
export function useFinanceDashboard() {
    const [data, setData] = useState<FinanceDashboard | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchDashboard = useCallback(async () => {
        setLoading(true)
        try {
            const result = await api.get<FinanceDashboard>('/api/finance/dashboard')
            setData(result)
        } catch (err: unknown) {
            const error = err as { message?: string }
            setError(error.message || 'Failed to fetch finance dashboard')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchDashboard() }, [fetchDashboard])
    return { data, loading, error, refetch: fetchDashboard }
}

// Billings
export function useBillings(options: { page?: number; limit?: number; status?: string; studentId?: string } = {}) {
    const [billings, setBillings] = useState<SPPBilling[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [meta, setMeta] = useState<{ page: number; limit: number; total: number; totalPages: number } | null>(null)

    const fetchBillings = useCallback(async () => {
        setLoading(true)
        try {
            const response = await api.get<ApiResponse<SPPBilling[]>>('/api/finance/billings', options)
            setBillings(response.data)
            setMeta(response.meta || null)
        } catch (err: unknown) {
            const error = err as { message?: string }
            setError(error.message || 'Failed to fetch billings')
        } finally {
            setLoading(false)
        }
    }, [options.page, options.limit, options.status, options.studentId])

    useEffect(() => { fetchBillings() }, [fetchBillings])
    return { billings, loading, error, meta, refetch: fetchBillings }
}

// Billing Actions (Pay, Notify)
export function useBillingActions() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const recordPayment = async (billingId: string, data: { amount: number; paymentMethod: string }) => {
        setLoading(true)
        setError(null)
        try {
            return await api.post<SPPBilling>(`/api/finance/billings/${billingId}/pay`, data)
        } catch (err: unknown) {
            const error = err as { message?: string }
            setError(error.message || 'Failed to record payment')
            return null
        } finally {
            setLoading(false)
        }
    }

    const sendNotification = async (billingId: string) => {
        setLoading(true)
        setError(null)
        try {
            const res = await api.post<{ success: boolean; message: string }>(`/api/finance/billings/${billingId}/notify`, {})
            return res
        } catch (err: unknown) {
            const error = err as { message?: string }
            setError(error.message || 'Failed to send notification')
            return null
        } finally {
            setLoading(false)
        }
    }

    return { recordPayment, sendNotification, loading, error }
}

// Transactions
export function useTransactions(options: { page?: number; limit?: number; type?: string } = {}) {
    const [transactions, setTransactions] = useState<FinanceTransaction[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [meta, setMeta] = useState<{ page: number; limit: number; total: number; totalPages: number } | null>(null)

    const fetchTransactions = useCallback(async () => {
        setLoading(true)
        try {
            const response = await api.get<ApiResponse<FinanceTransaction[]>>('/api/finance/transactions', options)
            setTransactions(response.data)
            setMeta(response.meta || null)
        } catch (err: unknown) {
            const error = err as { message?: string }
            setError(error.message || 'Failed to fetch transactions')
        } finally {
            setLoading(false)
        }
    }, [options.page, options.limit, options.type])

    useEffect(() => { fetchTransactions() }, [fetchTransactions])
    return { transactions, loading, error, meta, refetch: fetchTransactions }
}

// Transaction Mutations (Create, Export)
export function useTransactionMutations() {
    const { create, loading: baseLoading } = useMutations<FinanceTransaction, Partial<FinanceTransaction>>('/api/finance/transactions')

    // Explicit Create function to handle type safety better if needed
    const createTransaction = async (data: any) => {
        return create(data)
    }

    const exportReports = async (filters?: { type?: string, category?: string, startDate?: string, endDate?: string }) => {
        return downloadFile('/api/finance/reports/export', `laporan-keuangan-${new Date().toISOString().split('T')[0]}.csv`, filters as Record<string, string>)
    }

    return {
        createTransaction,
        exportReports,
        loading: baseLoading
    }
}

// Fee Types
export function useFeeTypes() {
    const [feeTypes, setFeeTypes] = useState<FeeType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchFeeTypes = async () => {
            try {
                const data = await api.get<FeeType[]>('/api/finance/fee-types')
                setFeeTypes(data)
            } catch (err: unknown) {
                const error = err as { message?: string }
                setError(error.message || 'Failed to fetch fee types')
            } finally {
                setLoading(false)
            }
        }
        fetchFeeTypes()
    }, [])

    return { feeTypes, loading, error }
}
