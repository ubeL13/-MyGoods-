import { API_ENDPOINTS, apiClient, type TPaginatedResponse } from '@/shared/api'

import type { TProductListItem, TProductsQuery } from '../model/product.types'

import { getProductsMock } from './product.mock'

const USE_PRODUCTS_MOCK = true

export async function getProducts(
  query: TProductsQuery,
): Promise<TPaginatedResponse<TProductListItem>> {
  if (USE_PRODUCTS_MOCK) {
    return getProductsMock(query)
  }

  const { data } = await apiClient.get<TPaginatedResponse<TProductListItem>>(
    API_ENDPOINTS.products.list,
    { params: query },
  )

  return data
}
