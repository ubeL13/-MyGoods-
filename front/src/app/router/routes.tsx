import { createBrowserRouter, Navigate } from 'react-router-dom'

import {
  CategoriesPageLazy,
  NotFoundPageLazy,
  OrderCreatePageLazy,
  OrderDetailPageLazy,
  OrdersPageLazy,
  ProductCreatePageLazy,
  ProductDetailPageLazy,
  ProductEditPageLazy,
  ProductsPageLazy,
  WarehousePageLazy,
} from '@/app/router/lazyPages'
import { PageSuspense } from '@/app/router/PageSuspense'
import { AdminLayout } from '@/app/ui/AdminLayout'
import { Layout } from '@/app/ui/Layout'
import {
  ADMIN_ROUTE_PREFIX,
  APP_ROUTES,
  ROUTE_ROOT,
  ROUTE_SEGMENTS,
} from '@/shared/config/routes'

export const router = createBrowserRouter([
  {
    path: ROUTE_ROOT,
    element: <Layout />,
    children: [
      {
        index: true,
        // Пока нет авторизации (US-16), сразу открываем каталог
        element: <Navigate to={APP_ROUTES.products} replace />,
      },
      {
        path: ADMIN_ROUTE_PREFIX,
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Navigate to={APP_ROUTES.products} replace />,
          },
          {
            path: ROUTE_SEGMENTS.products,
            element: (
              <PageSuspense>
                <ProductsPageLazy />
              </PageSuspense>
            ),
          },
          {
            path: ROUTE_SEGMENTS.productDetail,
            element: (
              <PageSuspense>
                <ProductDetailPageLazy />
              </PageSuspense>
            ),
          },
          {
            path: ROUTE_SEGMENTS.productCreate,
            element: (
              <PageSuspense>
                <ProductCreatePageLazy />
              </PageSuspense>
            ),
          },
          {
            path: ROUTE_SEGMENTS.productEdit,
            element: (
              <PageSuspense>
                <ProductEditPageLazy />
              </PageSuspense>
            ),
          },
          {
            path: ROUTE_SEGMENTS.categories,
            element: (
              <PageSuspense>
                <CategoriesPageLazy />
              </PageSuspense>
            ),
          },
          {
            path: ROUTE_SEGMENTS.warehouse,
            element: (
              <PageSuspense>
                <WarehousePageLazy />
              </PageSuspense>
            ),
          },
          {
            path: ROUTE_SEGMENTS.orders,
            element: (
              <PageSuspense>
                <OrdersPageLazy />
              </PageSuspense>
            ),
          },
          {
            path: ROUTE_SEGMENTS.orderDetail,
            element: (
              <PageSuspense>
                <OrderDetailPageLazy />
              </PageSuspense>
            ),
          },
          {
            path: ROUTE_SEGMENTS.orderCreate,
            element: (
              <PageSuspense>
                <OrderCreatePageLazy />
              </PageSuspense>
            ),
          },
        ],
      },
      {
        path: '*',
        element: (
          <PageSuspense>
            <NotFoundPageLazy />
          </PageSuspense>
        ),
      },
    ],
  },
])
