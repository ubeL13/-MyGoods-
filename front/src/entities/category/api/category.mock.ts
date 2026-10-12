import type { TCategory } from '../model/category.types'

const MOCK_DELAY_MS = 300

const MOCK_CATEGORIES: TCategory[] = [
  { id: '10000000-0000-0000-0000-000000000001', name: 'Кухня' },
  { id: '10000000-0000-0000-0000-000000000002', name: 'Ванная' },
  { id: '10000000-0000-0000-0000-000000000003', name: 'Спальня' },
  { id: '10000000-0000-0000-0000-000000000004', name: 'Декор' },
  { id: '10000000-0000-0000-0000-000000000005', name: 'Хранение' },
  { id: '10000000-0000-0000-0000-000000000006', name: 'Текстиль' },
]

export function getCategoriesMock(): Promise<TCategory[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_CATEGORIES), MOCK_DELAY_MS)
  })
}
