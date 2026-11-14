export type TCustomerDto = {
  id: string
  name: string
  phone: string
  email: string | null
  address: string | null
  createdAt: string
}

export type TCustomersPageDto = {
  data: TCustomerDto[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type TCustomersQueryDto = {
  search?: string
  page: number
  limit: number
}

export type TCustomerOrderDto = {
  id: string
  number: number
  createdAt: string
  status: string
  totalAmount: number
}

export type TCustomerDetailDto = TCustomerDto & {
  ordersCount: number
  totalSpent: number
  orders: TCustomerOrderDto[]
}
