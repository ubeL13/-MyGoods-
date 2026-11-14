import { API_ENDPOINTS, apiClient } from '@/shared/api'

import type { TCustomerDetailDto, TCustomerDto } from './customer.dto'

type TOrderListItemDto = {
  id: string
  number: number
  customerPhone: string | null
  status: string
  totalAmount: number
  createdAt: string
}

type TOrdersPageDto = {
  data: TOrderListItemDto[]
}

export async function getCustomerDetailMock(
  customerId: string,
): Promise<TCustomerDetailDto> {
  const { data: customer } = await apiClient.get<TCustomerDto>(
    API_ENDPOINTS.customers.byId(customerId),
  )
  const { data: ordersPage } = await apiClient.get<TOrdersPageDto>(
    API_ENDPOINTS.orders.list,
    { params: { search: customer.phone, limit: 100 } },
  )

  const orders = ordersPage.data
    .filter((order) => order.customerPhone === customer.phone)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(({ id, number, createdAt, status, totalAmount }) => ({
      id,
      number,
      createdAt,
      status,
      totalAmount,
    }))

  return {
    ...customer,
    ordersCount: orders.length,
    totalSpent: orders
      .filter((order) => order.status !== 'Cancelled')
      .reduce((sum, order) => sum + order.totalAmount, 0),
    orders,
  }
}
