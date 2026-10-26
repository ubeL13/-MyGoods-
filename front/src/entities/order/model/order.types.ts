import type { TPaginationParams } from '@/shared/api'

export type TOrderStatus =
  | 'New'
  | 'Confirmed'
  | 'Assembled'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'

export type TOrderItem = {
  productId: string
  sku: string
  productName: string
  quantity: number
  price: number
  sum: number
}

export type TOrder = {
  id: string
  number: number
  customerId: string
  customerName: string
  customerPhone: string
  status: TOrderStatus
  deliveryAddress: string
  totalAmount: number
  createdAt: string
  updatedAt: string
  items: TOrderItem[]
}

export type TOrderListItem = {
  id: string
  number: number
  customerName: string
  customerPhone: string
  status: TOrderStatus
  totalAmount: number
  itemsCount: number
  createdAt: string
}

export type TOrdersFilters = {
  status?: TOrderStatus
  search?: string
}

export type TOrdersQuery = TPaginationParams & TOrdersFilters

export type TOrderNewCustomer = {
  name: string
  phone: string
  email: string | null
}

export type TOrderCreateValues = {
  customerId: string | null
  newCustomer: TOrderNewCustomer | null
  deliveryAddress: string
  items: { productId: string; quantity: number }[]
}
