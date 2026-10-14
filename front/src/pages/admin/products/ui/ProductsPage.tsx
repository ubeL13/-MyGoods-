import type { TableColumnsType } from 'antd'
import { Alert, Button, Flex, Table, Tag, Typography } from 'antd'
import { Link, useNavigate } from 'react-router-dom'

import { StockStatusTag, type TProductListItem } from '@/entities/product'
import { CatalogFilters } from '@/features/catalog-filters'
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
  const navigate = useNavigate()
  const {
    products,
    totalCount,
    page,
    pageSize,
    filters,
    isLoading,
    error,
    changePage,
    changeFilters,
  } = useProductsPage()

  return (
    <section>
      <Flex
        justify="space-between"
        align="center"
        wrap
        gap="middle"
        className={styles['products-page__header']}
      >
        <Typography.Title level={2} className={styles['products-page__title']}>
          Каталог товаров
        </Typography.Title>
        <Button
          type="primary"
          onClick={() => navigate(APP_ROUTES.productCreate)}
        >
          Добавить товар
        </Button>
      </Flex>

      <CatalogFilters value={filters} onChange={changeFilters} />

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
        locale={{ emptyText: 'Товары не найдены' }}
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
