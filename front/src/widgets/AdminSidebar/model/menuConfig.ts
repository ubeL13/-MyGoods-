import { APP_ROUTES } from '@/shared/config/routes'

export type TAdminMenuGroup = {
  key: string
  label: string
  items: TAdminMenuItem[]
}

export type TAdminMenuItem = {
  key: string
  label: string
  path: string
}

/**
 * Пункты бокового меню. Новый раздел добавляется сюда после того,
 * как для него появился маршрут в APP_ROUTES и страница в роутере.
 * Группы повторяют модули продукта: каталог и заказы, склад, администрирование.
 */
export const ADMIN_MENU_GROUPS: TAdminMenuGroup[] = [
  {
    key: 'catalog',
    label: 'Каталог и заказы',
    items: [
      {
        key: 'products',
        label: 'Товары',
        path: APP_ROUTES.products,
      },
      {
        key: 'categories',
        label: 'Категории',
        path: APP_ROUTES.categories,
      },
    ],
  },
]
