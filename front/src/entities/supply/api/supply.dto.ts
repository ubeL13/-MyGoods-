export type TSupplyItemDto = {
  productId: string
  sku: string | null
  productName: string | null
  quantity: number
  receivedQuantity: number | null
  purchasePrice: number
  sum: number
}

export type TSupplyDto = {
  id: string
  number: number
  supplierId: string
  supplierName: string | null
  status: string
  expectedDate: string | null
  comment: string | null
  totalAmount: number
  createdAt: string
  receivedAt: string | null
  items: TSupplyItemDto[]
}

export type TSupplyListItemDto = {
  id: string
  number: number
  supplierName: string | null
  status: string
  expectedDate: string | null
  itemsCount: number
  totalAmount: number
  createdAt: string
}

export type TSuppliesPageDto = {
  data: TSupplyListItemDto[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type TSuppliesQueryDto = {
  status?: string
  search?: string
  page: number
  limit: number
}

export type TSupplyCreateDto = {
  supplierId: string
  expectedDate: string | null
  comment: string | null
  items: { productId: string; quantity: number; purchasePrice: number }[]
}

export type TSupplyReceiveDto = {
  items: { productId: string; receivedQuantity: number }[]
}
