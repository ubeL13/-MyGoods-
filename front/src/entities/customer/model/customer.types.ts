import type { TPaginationParams } from '@/shared/api'

export type TCustomer = {
  id: string
  name: string
  phone: string
  email: string
  address: string
  createdAt: string
}

export type TCustomerOrder = {
  id: string
  number: number
  createdAt: string
  status: string
  totalAmount: number
}

export type TCustomerDetail = TCustomer & {
  ordersCount: number
  totalSpent: number
  orders: TCustomerOrder[]
}

export type TCustomersQuery = TPaginationParams & {
  search?: string
}
