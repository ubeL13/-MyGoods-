import type { TPaginatedResponse } from '@/shared/api'

import type {
  TSuppliesQuery,
  TSupply,
  TSupplyCreateValues,
  TSupplyListItem,
} from '../model/supply.types'

import {
  mapSuppliesPageDto,
  mapSuppliesQuery,
  mapSupplyDto,
} from './supply.mapper'
import { createSupplyMock, getSuppliesMock } from './supply.mock'

export async function getSupplies(
  query: TSuppliesQuery,
): Promise<TPaginatedResponse<TSupplyListItem>> {
  const data = await getSuppliesMock(mapSuppliesQuery(query))

  return mapSuppliesPageDto(data)
}

export async function createSupply(
  values: TSupplyCreateValues,
): Promise<TSupply> {
  const data = await createSupplyMock(values)

  return mapSupplyDto(data)
}
