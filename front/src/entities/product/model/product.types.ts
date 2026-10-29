import type { TPaginationParams } from '@/shared/api'

export type TStockStatus = 'InStock' | 'LowStock' | 'OutOfStock'

export type TProductListItem = {
  id: string
  sku: string
  name: string
  price: number
  categoryId: string
  categoryName: string
  quantity: number
  reserved: number
  available: number
  min: number
  stockStatus: TStockStatus
  isActive: boolean
}
export type TProductsFilters = {
  search?: string
  categoryId?: string
  priceFrom?: number
  priceTo?: number
  inStock?: boolean
  lowStock?: boolean
  sortBy?: TProductsSortBy
  sortOrder?: 'asc' | 'desc'
}

export type TProductsSortBy = 'name' | 'price' | 'stock' | 'createdAt'

export type TProductDetail = TProductListItem & {
  description: string
  manufacturer: string
  createdAt: string
  updatedAt: string
}

export type TProductFormValues = {
  categoryId: string
  sku: string
  name: string
  price: number
  description: string
  manufacturer: string
  min: number
}

export type TProductsQuery = TPaginationParams & TProductsFilters
