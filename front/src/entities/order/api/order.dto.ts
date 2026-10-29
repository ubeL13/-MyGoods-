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
