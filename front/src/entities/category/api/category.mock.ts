import type { TCategory } from '../model/category.types'

const MOCK_DELAY_MS = 300

const KITCHEN_ID = '10000000-0000-0000-0000-000000000001'
const BATHROOM_ID = '10000000-0000-0000-0000-000000000002'
const BEDROOM_ID = '10000000-0000-0000-0000-000000000003'
const DECOR_ID = '10000000-0000-0000-0000-000000000004'
const STORAGE_ID = '10000000-0000-0000-0000-000000000005'
const TEXTILE_ID = '10000000-0000-0000-0000-000000000006'
const COOKWARE_ID = '20000000-0000-0000-0000-000000000001'

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

export function getCategoriesMock(): Promise<TCategory[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_CATEGORIES), MOCK_DELAY_MS)
  })
}
