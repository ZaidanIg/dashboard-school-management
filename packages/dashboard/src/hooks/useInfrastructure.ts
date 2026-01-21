import { useFetch, useMutations } from './useShared'

export interface InventoryItem {
    id: string
    name: string
    code: string
    category: string
    condition: 'GOOD' | 'FAIR' | 'POOR' | 'DAMAGED'
    location: string
    quantity: number
    purchaseDate?: string
    lastMaintenance?: string
    status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'DISPOSED'
}

export interface MaintenanceRecord {
    id: string
    inventoryId: string
    inventory?: {
        name: string
        code: string
    }
    date: string
    type: 'ROUTINE' | 'REPAIR' | 'REPLACEMENT'
    description: string
    cost: number
    technician: string
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
    nextMaintenanceDate?: string
}

export type InventoryFormData = Omit<InventoryItem, 'id'>
export type MaintenanceFormData = Omit<MaintenanceRecord, 'id' | 'inventory'>

export function useInventory(params?: Record<string, string | number | undefined>) {
    const { data: inventory, loading, error, refetch, meta } = useFetch<InventoryItem[]>('/api/infrastructure/inventory', params, {
        initialData: []
    })

    const { create, update, remove, loading: mutationLoading } = useMutations<InventoryItem, InventoryFormData, Partial<InventoryFormData>>('/api/infrastructure/inventory')

    return {
        inventory,
        loading,
        mutationLoading,
        error,
        meta,
        refetch,
        create,
        update,
        remove
    }
}

export function useMaintenance(params?: Record<string, string | number | undefined>) {
    const { data: maintenance, loading, error, refetch, meta } = useFetch<MaintenanceRecord[]>('/api/infrastructure/maintenance', params, {
        initialData: []
    })

    const { create, update, remove, loading: mutationLoading } = useMutations<MaintenanceRecord, MaintenanceFormData, Partial<MaintenanceFormData>>('/api/infrastructure/maintenance')

    return {
        maintenance,
        loading,
        mutationLoading,
        error,
        meta,
        refetch,
        create,
        update,
        remove
    }
}
