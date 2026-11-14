import { API_ENDPOINTS, apiClient, type TPaginatedResponse } from '@/shared/api'

import type {
  TCustomer,
  TCustomerDetail,
  TCustomersQuery,
} from '../model/customer.types'

import type { TCustomersPageDto } from './customer.dto'
import {
  mapCustomerDetailDto,
  mapCustomerDto,
  mapCustomersPageDto,
  mapCustomersQuery,
} from './customer.mapper'
import { getCustomerDetailMock } from './customer.mock'

const SEARCH_LIMIT = 20

export async function searchCustomers(search: string): Promise<TCustomer[]> {
  const { data } = await apiClient.get<TCustomersPageDto>(
    API_ENDPOINTS.customers.list,
    { params: { search: search || undefined, limit: SEARCH_LIMIT } },
  )

  return data.data.map(mapCustomerDto)
}

export async function getCustomers(
  query: TCustomersQuery,
): Promise<TPaginatedResponse<TCustomer>> {
  const { data } = await apiClient.get<TCustomersPageDto>(
    API_ENDPOINTS.customers.list,
    { params: mapCustomersQuery(query) },
  )

  return mapCustomersPageDto(data)
}

export async function getCustomerById(
  customerId: string,
): Promise<TCustomerDetail> {
  const data = await getCustomerDetailMock(customerId)

  return mapCustomerDetailDto(data)
}
