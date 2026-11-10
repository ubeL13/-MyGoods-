import type { TPaginatedResponse } from '@/shared/api'

import type {
  TSupplier,
  TSupplierFormValues,
  TSuppliersQuery,
} from '../model/supplier.types'

import {
  mapSupplierDto,
  mapSuppliersPageDto,
  mapSuppliersQuery,
  toSupplierEditDto,
} from './supplier.mapper'
import {
  createSupplierMock,
  getSuppliersMock,
  setSupplierArchivedMock,
  updateSupplierMock,
} from './supplier.mock'

export async function getSuppliers(
  query: TSuppliersQuery,
): Promise<TPaginatedResponse<TSupplier>> {
  const data = await getSuppliersMock(mapSuppliersQuery(query))

  return mapSuppliersPageDto(data)
}

export async function createSupplier(
  values: TSupplierFormValues,
): Promise<TSupplier> {
  const data = await createSupplierMock(toSupplierEditDto(values))

  return mapSupplierDto(data)
}

export async function updateSupplier(
  supplierId: string,
  values: TSupplierFormValues,
): Promise<TSupplier> {
  const data = await updateSupplierMock(supplierId, toSupplierEditDto(values))

  return mapSupplierDto(data)
}

export async function setSupplierArchived(
  supplierId: string,
  isArchived: boolean,
): Promise<TSupplier> {
  const data = await setSupplierArchivedMock(supplierId, isArchived)

  return mapSupplierDto(data)
}
