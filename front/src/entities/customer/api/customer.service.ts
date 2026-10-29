import { API_ENDPOINTS, apiClient } from '@/shared/api'

import type { TCustomer } from '../model/customer.types'

import type { TCustomersPageDto } from './customer.dto'
import { mapCustomerDto } from './customer.mapper'

const SEARCH_LIMIT = 20

export async function searchCustomers(search: string): Promise<TCustomer[]> {
  const { data } = await apiClient.get<TCustomersPageDto>(
    API_ENDPOINTS.customers.list,
    { params: { search: search || undefined, limit: SEARCH_LIMIT } },
  )

  return data.data.map(mapCustomerDto)
}
