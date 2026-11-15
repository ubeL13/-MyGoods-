import { API_ENDPOINTS, apiClient, type TPaginatedResponse } from '@/shared/api'

import type {
  TSupplier,
  TSupplierFormValues,
  TSuppliersQuery,
} from '../model/supplier.types'

import type { TSupplierDto, TSuppliersPageDto } from './supplier.dto'
import {
  mapSupplierDto,
  mapSuppliersPageDto,
  mapSuppliersQuery,
  toSupplierEditDto,
} from './supplier.mapper'

export async function getSuppliers(
  query: TSuppliersQuery,
): Promise<TPaginatedResponse<TSupplier>> {
  const { data } = await apiClient.get<TSuppliersPageDto>(
    API_ENDPOINTS.suppliers.list,
    { params: mapSuppliersQuery(query) },
  )

  return mapSuppliersPageDto(data)
}

export async function createSupplier(
  values: TSupplierFormValues,
): Promise<TSupplier> {
  const { data } = await apiClient.post<TSupplierDto>(
    API_ENDPOINTS.suppliers.list,
    toSupplierEditDto(values),
  )

  return mapSupplierDto(data)
}

export async function updateSupplier(
  supplierId: string,
  values: TSupplierFormValues,
): Promise<TSupplier> {
  const { data } = await apiClient.put<TSupplierDto>(
    API_ENDPOINTS.suppliers.byId(supplierId),
    toSupplierEditDto(values),
  )

  return mapSupplierDto(data)
}

export async function setSupplierArchived(
  supplierId: string,
  isArchived: boolean,
): Promise<TSupplier> {
  const { data } = await apiClient.patch<TSupplierDto>(
    API_ENDPOINTS.suppliers.active(supplierId),
    { isActive: !isArchived },
  )

  return mapSupplierDto(data)
}
