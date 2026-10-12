import { API_ENDPOINTS, apiClient } from '@/shared/api'

import type { TCategory } from '../model/category.types'

import { getCategoriesMock } from './category.mock'

const USE_CATEGORIES_MOCK = true

export async function getCategories(): Promise<TCategory[]> {
  if (USE_CATEGORIES_MOCK) {
    return getCategoriesMock()
  }

  const { data } = await apiClient.get<TCategory[]>(
    API_ENDPOINTS.categories.list,
  )

  return data
}
