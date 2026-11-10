import type { TPaginationParams } from '@/shared/api'

export type TSupplier = {
  id: string
  name: string
  inn: string
  contactPerson: string
  phone: string
  email: string
  address: string
  comment: string
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export type TSupplierFormValues = {
  name: string
  inn: string
  contactPerson: string
  phone: string
  email: string
  address: string
  comment: string
}

export type TSuppliersFilters = {
  search?: string
  archived?: boolean
}

export type TSuppliersQuery = TPaginationParams & TSuppliersFilters
