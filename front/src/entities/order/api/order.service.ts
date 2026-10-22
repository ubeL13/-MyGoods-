import { API_ENDPOINTS, apiClient } from '@/shared/api'

import type { TOrder, TOrderCreateValues } from '../model/order.types'

import type { TOrderDto } from './order.dto'
import { mapOrderDto } from './order.mapper'

export async function createOrder(values: TOrderCreateValues): Promise<TOrder> {
  const { data } = await apiClient.post<TOrderDto>(
    API_ENDPOINTS.orders.list,
    values,
  )

  return mapOrderDto(data)
}
