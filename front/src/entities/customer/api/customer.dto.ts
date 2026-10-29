export type TCustomerDto = {
  id: string
  name: string
  phone: string
  email: string | null
  address: string | null
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
