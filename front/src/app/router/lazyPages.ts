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

export const CategoriesPageLazy = lazy(() =>
  import('@/pages/admin/categories').then((module) => ({
    default: module.CategoriesPage,
  })),
)

export const NotFoundPageLazy = lazy(() =>
  import('@/pages/not-found').then((module) => ({
    default: module.NotFoundPage,
  })),
)
