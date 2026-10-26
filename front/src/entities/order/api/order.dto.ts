export type TOrderItemDto = {
  productId: string
  sku: string | null
  productName: string | null
  quantity: number
  price: number
  sum: number
}

export type TOrderDto = {
  id: string
  number: number
  customerId: string
  customerName: string | null
  customerPhone: string | null
  status: string
  deliveryAddress: string
  totalAmount: number
  createdAt: string
  updatedAt: string | null
  items: TOrderItemDto[]
}

export type TOrderListItemDto = {
  id: string
  number: number
  customerName: string | null
  customerPhone: string | null
  status: string
  totalAmount: number
  itemsCount: number
  createdAt: string
}

export type TOrdersPageDto = {
  data: TOrderListItemDto[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type TOrdersQueryDto = {
  status?: string
  search?: string
  page: number
  limit: number
}
