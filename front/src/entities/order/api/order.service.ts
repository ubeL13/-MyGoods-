import { API_ENDPOINTS, apiClient, type TPaginatedResponse } from '@/shared/api'

import type {
  TOrder,
  TOrderCreateValues,
  TOrderListItem,
  TOrdersQuery,
} from '../model/order.types'

import type { TOrderDto } from './order.dto'
import { mapOrderDto, mapOrdersPageDto, mapOrdersQuery } from './order.mapper'
import { getOrdersMock } from './order.mock'

export async function getOrders(
  query: TOrdersQuery,
): Promise<TPaginatedResponse<TOrderListItem>> {
  const data = await getOrdersMock(mapOrdersQuery(query))

  return mapOrdersPageDto(data)
}

export async function createOrder(values: TOrderCreateValues): Promise<TOrder> {
  const { data } = await apiClient.post<TOrderDto>(
    API_ENDPOINTS.orders.list,
    values,
  )

  return mapOrderDto(data)
}
