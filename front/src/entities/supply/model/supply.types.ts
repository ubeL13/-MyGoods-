import type { TPaginationParams } from '@/shared/api'

export type TSupplyStatus = 'Created' | 'Received' | 'Cancelled'

export type TSupplyItem = {
  productId: string
  sku: string
  productName: string
  quantity: number
  receivedQuantity: number | null
  purchasePrice: number
  sum: number
}

export type TSupply = {
  id: string
  number: number
  supplierId: string
  supplierName: string
  status: TSupplyStatus
  expectedDate: string | null
  comment: string
  totalAmount: number
  createdAt: string
  receivedAt: string | null
  items: TSupplyItem[]
}

export type TSupplyListItem = {
  id: string
  number: number
  supplierName: string
  status: TSupplyStatus
  expectedDate: string | null
  itemsCount: number
  totalAmount: number
  createdAt: string
}

export type TSuppliesFilters = {
  status?: TSupplyStatus
  search?: string
}

export type TSuppliesQuery = TPaginationParams & TSuppliesFilters

export type TSupplyCreateValues = {
  supplierId: string
  expectedDate: string | null
  comment: string | null
  items: { productId: string; quantity: number; purchasePrice: number }[]
}

export type TSupplyReceiveValues = {
  items: { productId: string; receivedQuantity: number }[]
}
