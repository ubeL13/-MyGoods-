import { API_ENDPOINTS, apiClient, type TPaginatedResponse } from '@/shared/api'

import type {
  TProductDetail,
  TProductFormValues,
  TProductListItem,
  TProductsQuery,
} from '../model/product.types'

import type { TPagedResultDto, TProductDto } from './product.dto'
import {
  mapProductDto,
  mapProductsPageDto,
  mapProductsQuery,
} from './product.mapper'

export async function getProducts(
  query: TProductsQuery,
): Promise<TPaginatedResponse<TProductListItem>> {
  const { data } = await apiClient.get<TPagedResultDto<TProductDto>>(
    API_ENDPOINTS.products.list,
    { params: mapProductsQuery(query) },
  )

  return mapProductsPageDto(data)
}

export async function getProductById(
  productId: string,
): Promise<TProductDetail> {
  const { data } = await apiClient.get<TProductDto>(
    API_ENDPOINTS.products.byId(productId),
  )

  return mapProductDto(data)
}

export async function createProduct(
  values: TProductFormValues,
): Promise<TProductDetail> {
  const { data } = await apiClient.post<TProductDto>(
    API_ENDPOINTS.products.list,
    values,
  )

  return mapProductDto(data)
}

export async function updateProduct(
  productId: string,
  values: TProductFormValues,
): Promise<TProductDetail> {
  const { data } = await apiClient.put<TProductDto>(
    API_ENDPOINTS.products.byId(productId),
    values,
  )

  return mapProductDto(data)
}

export async function setProductActive(
  productId: string,
  isActive: boolean,
): Promise<TProductDetail> {
  const { data } = await apiClient.patch<TProductDto>(
    API_ENDPOINTS.products.active(productId),
    { isActive },
  )

  return mapProductDto(data)
}
