import type { TPaginatedResponse } from '@/shared/api'

import type {
  TSuppliesQuery,
  TSupply,
  TSupplyCreateValues,
  TSupplyListItem,
  TSupplyReceiveValues,
} from '../model/supply.types'

import {
  mapSuppliesPageDto,
  mapSuppliesQuery,
  mapSupplyDto,
} from './supply.mapper'
import {
  cancelSupplyMock,
  createSupplyMock,
  getSuppliesMock,
  getSupplyByIdMock,
  receiveSupplyMock,
} from './supply.mock'

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

export async function getSupplyById(supplyId: string): Promise<TSupply> {
  const data = await getSupplyByIdMock(supplyId)

  return mapSupplyDto(data)
}

export async function receiveSupply(
  supplyId: string,
  values: TSupplyReceiveValues,
): Promise<TSupply> {
  const data = await receiveSupplyMock(supplyId, values)

  return mapSupplyDto(data)
}

export async function cancelSupply(supplyId: string): Promise<TSupply> {
  const data = await cancelSupplyMock(supplyId)

  return mapSupplyDto(data)
}
