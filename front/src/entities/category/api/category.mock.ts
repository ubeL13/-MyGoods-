import { createMockApiError, withMockDelay } from '@/shared/lib'

import type { TCategory, TCategoryFormValues } from '../model/category.types'

const KITCHEN_ID = '10000000-0000-0000-0000-000000000001'
const BATHROOM_ID = '10000000-0000-0000-0000-000000000002'
const BEDROOM_ID = '10000000-0000-0000-0000-000000000003'
const DECOR_ID = '10000000-0000-0000-0000-000000000004'
const STORAGE_ID = '10000000-0000-0000-0000-000000000005'
const TEXTILE_ID = '10000000-0000-0000-0000-000000000006'
const COOKWARE_ID = '20000000-0000-0000-0000-000000000001'

const CATEGORY_IDS_WITH_PRODUCTS = new Set([
  KITCHEN_ID,
  BATHROOM_ID,
  BEDROOM_ID,
  DECOR_ID,
  STORAGE_ID,
  TEXTILE_ID,
])

const MOCK_CATEGORIES: TCategory[] = [
  {
    id: KITCHEN_ID,
    name: 'Кухня',
    description: 'Всё для приготовления и сервировки',
    parentId: null,
  },
  {
    id: COOKWARE_ID,
    name: 'Посуда',
    description: 'Сковороды, кастрюли, наборы посуды',
    parentId: KITCHEN_ID,
  },
  {
    id: '20000000-0000-0000-0000-000000000002',
    name: 'Сковороды',
    description: null,
    parentId: COOKWARE_ID,
  },
  {
    id: '20000000-0000-0000-0000-000000000003',
    name: 'Кастрюли',
    description: null,
    parentId: COOKWARE_ID,
  },
  {
    id: '20000000-0000-0000-0000-000000000004',
    name: 'Ножи и доски',
    description: 'Кухонные ножи, разделочные доски',
    parentId: KITCHEN_ID,
  },
  {
    id: BATHROOM_ID,
    name: 'Ванная',
    description: 'Аксессуары и текстиль для ванной',
    parentId: null,
  },
  {
    id: '20000000-0000-0000-0000-000000000005',
    name: 'Аксессуары для ванной',
    description: 'Дозаторы, мыльницы, полки',
    parentId: BATHROOM_ID,
  },
  {
    id: BEDROOM_ID,
    name: 'Спальня',
    description: 'Постельное бельё, подушки, одеяла',
    parentId: null,
  },
  {
    id: DECOR_ID,
    name: 'Декор',
    description: 'Вазы, свечи, часы, рамки',
    parentId: null,
  },
  {
    id: STORAGE_ID,
    name: 'Хранение',
    description: 'Корзины, контейнеры, органайзеры',
    parentId: null,
  },
  {
    id: TEXTILE_ID,
    name: 'Текстиль',
    description: 'Скатерти, шторы, полотенца, подушки',
    parentId: null,
  },
]

function findCategoryOrThrow(categoryId: string): TCategory {
  const category = MOCK_CATEGORIES.find((item) => item.id === categoryId)

  if (!category) {
    throw createMockApiError(
      404,
      'Не найдено',
      `Категория с id ${categoryId} не найдена.`,
    )
  }

  return category
}

function isDescendant(ancestorId: string, categoryId: string): boolean {
  let parentId =
    MOCK_CATEGORIES.find((item) => item.id === categoryId)?.parentId ?? null

  while (parentId) {
    if (parentId === ancestorId) return true

    const currentId: string = parentId
    parentId =
      MOCK_CATEGORIES.find((item) => item.id === currentId)?.parentId ?? null
  }

  return false
}

function validateValues(values: TCategoryFormValues, categoryId?: string) {
  const isNameTaken = MOCK_CATEGORIES.some(
    (item) =>
      item.id !== categoryId &&
      item.name.toLowerCase() === values.name.toLowerCase(),
  )

  if (isNameTaken) {
    throw createMockApiError(
      409,
      'Конфликт',
      `Категория «${values.name}» уже существует.`,
    )
  }

  if (!values.parentId) return

  if (values.parentId === categoryId) {
    throw createMockApiError(
      400,
      'Ошибка валидации',
      'Категория не может быть родителем самой себя.',
    )
  }

  if (!MOCK_CATEGORIES.some((item) => item.id === values.parentId)) {
    throw createMockApiError(
      400,
      'Ошибка валидации',
      `Родительская категория с id ${values.parentId} не существует.`,
    )
  }

  if (categoryId && isDescendant(categoryId, values.parentId)) {
    throw createMockApiError(
      400,
      'Ошибка валидации',
      'Нельзя перенести категорию внутрь её собственной подкатегории.',
    )
  }
}

export function getCategoriesMock(): Promise<TCategory[]> {
  return withMockDelay(
    () => MOCK_CATEGORIES.map((category) => ({ ...category })),
    300,
  )
}

export function createCategoryMock(
  values: TCategoryFormValues,
): Promise<TCategory> {
  return withMockDelay(() => {
    validateValues(values)

    const category: TCategory = {
      id: crypto.randomUUID(),
      name: values.name,
      description: values.description || null,
      parentId: values.parentId,
    }

    MOCK_CATEGORIES.push(category)

    return { ...category }
  })
}

export function updateCategoryMock(
  categoryId: string,
  values: TCategoryFormValues,
): Promise<TCategory> {
  return withMockDelay(() => {
    const category = findCategoryOrThrow(categoryId)

    validateValues(values, categoryId)

    category.name = values.name
    category.description = values.description || null
    category.parentId = values.parentId

    return { ...category }
  })
}

export function deleteCategoryMock(categoryId: string): Promise<void> {
  return withMockDelay(() => {
    const category = findCategoryOrThrow(categoryId)

    if (MOCK_CATEGORIES.some((item) => item.parentId === categoryId)) {
      throw createMockApiError(
        409,
        'Конфликт',
        `Нельзя удалить категорию «${category.name}»: у неё есть подкатегории.`,
      )
    }

    if (CATEGORY_IDS_WITH_PRODUCTS.has(categoryId)) {
      throw createMockApiError(
        409,
        'Конфликт',
        `Нельзя удалить категорию «${category.name}»: в ней есть товары.`,
      )
    }

    MOCK_CATEGORIES.splice(MOCK_CATEGORIES.indexOf(category), 1)
  })
}
