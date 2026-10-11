import {
  API_ENDPOINTS,
  apiClient,
  type TPaginatedResponse,
  type TPaginationParams,
} from '@/shared/api'

import type { TProductListItem } from '../model/product.types'

import { getProductsMock } from './product.mock'

const USE_PRODUCTS_MOCK = true

export async function getProducts(
  params: TPaginationParams,
): Promise<TPaginatedResponse<TProductListItem>> {
  if (USE_PRODUCTS_MOCK) {
    return getProductsMock(params)
  }

  const { data } = await apiClient.get<TPaginatedResponse<TProductListItem>>(
    API_ENDPOINTS.products.list,
    { params },
  )

  return data
}
