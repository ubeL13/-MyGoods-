import { API_ENDPOINTS, apiClient, type TPaginatedResponse } from '@/shared/api'

import type {
  TSuppliesQuery,
  TSupply,
  TSupplyCreateValues,
  TSupplyListItem,
  TSupplyReceiveValues,
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

export async function getSupplyById(supplyId: string): Promise<TSupply> {
  const { data } = await apiClient.get<TSupplyDto>(
    API_ENDPOINTS.supplies.byId(supplyId),
  )

  return mapSupplyDto(data)
}

export async function receiveSupply(
  supplyId: string,
  values: TSupplyReceiveValues,
): Promise<TSupply> {
  const { data } = await apiClient.post<TSupplyDto>(
    API_ENDPOINTS.supplies.receive(supplyId),
    values,
  )

  return mapSupplyDto(data)
}

export async function cancelSupply(supplyId: string): Promise<TSupply> {
  const { data } = await apiClient.post<TSupplyDto>(
    API_ENDPOINTS.supplies.cancel(supplyId),
  )

  return mapSupplyDto(data)
}
