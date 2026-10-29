import { API_ENDPOINTS, apiClient } from '@/shared/api'

import type { TCustomer } from '../model/customer.types'

import type { TCustomerDto } from './customer.dto'
import { mapCustomerDto } from './customer.mapper'

export async function searchCustomers(search: string): Promise<TCustomer[]> {
  const { data } = await apiClient.get<TCustomerDto[]>(
    API_ENDPOINTS.customers.list,
    { params: { search: search || undefined } },
  )

  return data.map(mapCustomerDto)
}
