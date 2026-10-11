import type { TableColumnsType } from 'antd'
import { Alert, Table, Tag, Typography } from 'antd'
import { Link } from 'react-router-dom'

import { StockStatusTag, type TProductListItem } from '@/entities/product'
import { APP_ROUTES } from '@/shared/config/routes'
import { formatPrice } from '@/shared/lib'

import { useProductsPage } from '../model/useProductsPage'

import styles from './productsPage.module.css'

const PAGE_SIZE_OPTIONS = [10, 20, 50]

const columns: TableColumnsType<TProductListItem> = [
  {
    title: 'Артикул',
    dataIndex: 'sku',
    width: 120,
  },
  {
    title: 'Название',
    dataIndex: 'name',
    render: (name: string, product) => (
      <>
        <Link to={APP_ROUTES.productDetail(product.id)}>{name}</Link>
        {!product.isActive && (
          <Tag className={styles['products-page__inactive']}>
            Снят с продажи
          </Tag>
        )}
      </>
    ),
  },
  {
    title: 'Категория',
    dataIndex: 'categoryName',
    width: 160,
  },
  {
    title: 'Цена',
    dataIndex: 'price',
    align: 'right',
    width: 130,
    render: (price: number) => formatPrice(price),
  },
  {
    title: 'Остаток',
    dataIndex: 'quantity',
    align: 'right',
    width: 130,
    render: (quantity: number, product) => (
      <span title={`Минимальный остаток: ${product.min} шт.`}>
        {quantity} шт.
      </span>
    ),
  },
  {
    title: 'Статус',
    dataIndex: 'stockStatus',
    width: 160,
    render: (_, product) => <StockStatusTag status={product.stockStatus} />,
  },
]

export function ProductsPage() {
  const { products, totalCount, page, pageSize, isLoading, error, changePage } =
    useProductsPage()

  return (
    <section>
      <Typography.Title level={2}>Каталог товаров</Typography.Title>

      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          className={styles['products-page__error']}
        />
      )}

      <Table<TProductListItem>
        rowKey="id"
        columns={columns}
        dataSource={products}
        loading={isLoading}
        scroll={{ x: 900 }}
        pagination={{
          current: page,
          pageSize,
          total: totalCount,
          showSizeChanger: true,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
          showTotal: (total) => `Всего товаров: ${total}`,
          onChange: changePage,
        }}
      />
    </section>
  )
}
