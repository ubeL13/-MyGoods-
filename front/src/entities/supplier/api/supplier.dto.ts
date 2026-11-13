export type TSupplierDto = {
  id: string
  name: string
  inn: string | null
  contactPerson: string | null
  phone: string
  email: string | null
  address: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export type TSuppliersPageDto = {
  data: TSupplierDto[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type TSuppliersQueryDto = {
  search?: string
  isActive: boolean
  page: number
  limit: number
}

export type TSupplierEditDto = {
  name: string
  inn: string | null
  contactPerson: string | null
  phone: string
  email: string | null
  address: string | null
}
