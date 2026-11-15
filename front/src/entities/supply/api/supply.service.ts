import { API_ENDPOINTS, apiClient, type TPaginatedResponse } from '@/shared/api'

import type {
  TSuppliesQuery,
  TSupply,
  TSupplyCreateValues,
  TSupplyListItem,
} from '../model/supply.types'

import type { TSuppliesPageDto, TSupplyDto } from './supply.dto'
import {
  mapSuppliesPageDto,
  mapSuppliesQuery,
  mapSupplyDto,
} from './supply.mapper'

export async function getSupplies(
  query: TSuppliesQuery,
): Promise<TPaginatedResponse<TSupplyListItem>> {
  const { data } = await apiClient.get<TSuppliesPageDto>(
    API_ENDPOINTS.supplies.list,
    { params: mapSuppliesQuery(query) },
  )

  return mapSuppliesPageDto(data)
}

export async function createSupply(
  values: TSupplyCreateValues,
): Promise<TSupply> {
  const { data } = await apiClient.post<TSupplyDto>(
    API_ENDPOINTS.supplies.list,
    values,
  )

  return mapSupplyDto(data)
}
