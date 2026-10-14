import type { TCategory, TCategoryFormValues } from '../model/category.types'

import type { TCategoryDto } from './category.dto'

export function mapCategoryDto({
  id,
  name,
  description,
  parentId,
}: TCategoryDto): TCategory {
  return { id, name, description, parentId }
}

export function flattenCategoryDtos(dtos: TCategoryDto[]): TCategory[] {
  return dtos.flatMap((dto) => [
    mapCategoryDto(dto),
    ...flattenCategoryDtos(dto.children ?? []),
  ])
}

export function toCategoryRequest(values: TCategoryFormValues) {
  return {
    name: values.name,
    description: values.description || null,
    parentId: values.parentId,
  }
}
