export type TStockStatusDto = 'Available' | 'LessMinimum' | 'OutOfStock'

export type TStockDto = {
  quantity: number
  min: number
  status: TStockStatusDto
}

export type TProductDto = {
  id: string
  categoryId: string
  categoryName: string | null
  sku: string
  name: string
  price: number
  description: string
  manufacturer: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  stock: TStockDto | null
}

export type TPagedResultDto<TItem> = {
  data: TItem[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type TProductQueryDto = {
  search?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  page: number
  limit: number
}
