import { API_ENDPOINTS, apiClient } from '@/shared/api'

import type { TCategory, TCategoryFormValues } from '../model/category.types'

import type { TCategoryDto } from './category.dto'
import {
  flattenCategoryDtos,
  mapCategoryDto,
  toCategoryRequest,
} from './category.mapper'

export async function getCategories(): Promise<TCategory[]> {
  const { data } = await apiClient.get<TCategoryDto[]>(
    API_ENDPOINTS.categories.list,
  )

  return flattenCategoryDtos(data)
}

export async function createCategory(
  values: TCategoryFormValues,
): Promise<TCategory> {
  const { data } = await apiClient.post<TCategoryDto>(
    API_ENDPOINTS.categories.list,
    toCategoryRequest(values),
  )

  return mapCategoryDto(data)
}

export async function updateCategory(
  categoryId: string,
  values: TCategoryFormValues,
): Promise<TCategory> {
  const { data } = await apiClient.put<TCategoryDto>(
    API_ENDPOINTS.categories.byId(categoryId),
    toCategoryRequest(values),
  )

  return mapCategoryDto(data)
}

export async function deleteCategory(categoryId: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.categories.byId(categoryId))
}
