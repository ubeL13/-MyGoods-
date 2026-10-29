import { lazy } from 'react'

export const ProductsPageLazy = lazy(() =>
  import('@/pages/admin/products').then((module) => ({
    default: module.ProductsPage,
  })),
)

export const ProductDetailPageLazy = lazy(() =>
  import('@/pages/admin/product-detail').then((module) => ({
    default: module.ProductDetailPage,
  })),
)

export const ProductCreatePageLazy = lazy(() =>
  import('@/pages/admin/product-create').then((module) => ({
    default: module.ProductCreatePage,
  })),
)

export const ProductEditPageLazy = lazy(() =>
  import('@/pages/admin/product-edit').then((module) => ({
    default: module.ProductEditPage,
  })),
)

export const CategoriesPageLazy = lazy(() =>
  import('@/pages/admin/categories').then((module) => ({
    default: module.CategoriesPage,
  })),
)

export const OrdersPageLazy = lazy(() =>
  import('@/pages/admin/orders').then((module) => ({
    default: module.OrdersPage,
  })),
)

export const OrderCreatePageLazy = lazy(() =>
  import('@/pages/admin/order-create').then((module) => ({
    default: module.OrderCreatePage,
  })),
)

export const NotFoundPageLazy = lazy(() =>
  import('@/pages/not-found').then((module) => ({
    default: module.NotFoundPage,
  })),
)
