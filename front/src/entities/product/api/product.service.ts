import { API_ENDPOINTS, apiClient, type TPaginatedResponse } from '@/shared/api'

import type {
  TProductDetail,
  TProductFormValues,
  TProductListItem,
  TProductsQuery,
} from '../model/product.types'

import {
  createProductMock,
  getProductByIdMock,
  getProductsMock,
  updateProductMock,
} from './product.mock'

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

export async function getProductById(
  productId: string,
): Promise<TProductDetail> {
  if (USE_PRODUCTS_MOCK) {
    return getProductByIdMock(productId)
  }

  const { data } = await apiClient.get<TProductDetail>(
    API_ENDPOINTS.products.byId(productId),
  )

  return data
}

export async function createProduct(
  values: TProductFormValues,
): Promise<TProductDetail> {
  if (USE_PRODUCTS_MOCK) {
    return createProductMock(values)
  }

  const { data } = await apiClient.post<TProductDetail>(
    API_ENDPOINTS.products.list,
    values,
  )

  return data
}

export async function updateProduct(
  productId: string,
  values: TProductFormValues,
): Promise<TProductDetail> {
  if (USE_PRODUCTS_MOCK) {
    return updateProductMock(productId, values)
  }

  const { data } = await apiClient.put<TProductDetail>(
    API_ENDPOINTS.products.byId(productId),
    values,
  )

  return data
}
