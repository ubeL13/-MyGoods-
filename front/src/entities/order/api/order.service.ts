import { API_ENDPOINTS, apiClient, type TPaginatedResponse } from '@/shared/api'

import type {
  TOrder,
  TOrderCreateValues,
  TOrderListItem,
  TOrdersQuery,
  TOrderStatus,
} from '../model/order.types'

import type { TOrderDto } from './order.dto'
import { mapOrderDto, mapOrdersPageDto, mapOrdersQuery } from './order.mapper'
import {
  changeOrderStatusMock,
  getOrderByIdMock,
  getOrdersMock,
} from './order.mock'

export async function getOrders(
  query: TOrdersQuery,
): Promise<TPaginatedResponse<TOrderListItem>> {
  const data = await getOrdersMock(mapOrdersQuery(query))

  return mapOrdersPageDto(data)
}

export async function getOrderById(orderId: string): Promise<TOrder> {
  const data = await getOrderByIdMock(orderId)

  return mapOrderDto(data)
}

export async function changeOrderStatus(
  orderId: string,
  status: TOrderStatus,
): Promise<TOrder> {
  const data = await changeOrderStatusMock(orderId, status)

  return mapOrderDto(data)
}

export async function createOrder(values: TOrderCreateValues): Promise<TOrder> {
  const { data } = await apiClient.post<TOrderDto>(
    API_ENDPOINTS.orders.list,
    values,
  )

  return mapOrderDto(data)
}
