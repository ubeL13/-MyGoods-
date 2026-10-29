import type { TableColumnsType } from 'antd'
import { Alert, Flex, Input, Switch, Table, Typography } from 'antd'
import { Link } from 'react-router-dom'

import {
  StockStatusTag,
  type TProductListItem,
  type TStockStatus,
} from '@/entities/product'
import { APP_ROUTES } from '@/shared/config/routes'

import { useWarehousePage } from '../model/useWarehousePage'

import styles from './warehousePage.module.css'

const PAGE_SIZE_OPTIONS = [10, 20, 50]

const ROW_CLASS_BY_STATUS: Partial<Record<TStockStatus, string>> = {
  LowStock: styles['warehouse-page__row_low'],
  OutOfStock: styles['warehouse-page__row_out'],
}

const columns: TableColumnsType<TProductListItem> = [
  {
    title: 'Артикул',
    dataIndex: 'sku',
    width: 120,
  },
  {
    title: 'Товар',
    dataIndex: 'name',
    render: (name: string, product) => (
      <Link to={APP_ROUTES.productDetail(product.id)}>{name}</Link>
    ),
  },
  {
    title: 'Категория',
    dataIndex: 'categoryName',
    width: 160,
  },
  {
    title: 'На складе',
    dataIndex: 'quantity',
    align: 'right',
    width: 110,
  },
  {
    title: 'В резерве',
    dataIndex: 'reserved',
    align: 'right',
    width: 110,
  },
  {
    title: 'Доступно',
    dataIndex: 'available',
    align: 'right',
    width: 110,
    render: (available: number) => (
      <Typography.Text strong>{available}</Typography.Text>
    ),
  },
  {
    title: 'Минимум',
    dataIndex: 'min',
    align: 'right',
    width: 110,
  },
  {
    title: 'Статус',
    dataIndex: 'stockStatus',
    width: 160,
    render: (status: TStockStatus) => <StockStatusTag status={status} />,
  },
]

export function WarehousePage() {
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
  } = useWarehousePage()

  return (
    <section>
      <Typography.Title level={2} className={styles['warehouse-page__title']}>
        Остатки на складе
      </Typography.Title>

      <Flex
        gap="middle"
        align="center"
        wrap
        className={styles['warehouse-page__filters']}
      >
        <Input.Search
          allowClear
          placeholder="Название или артикул"
          onSearch={(search) =>
            changeFilters({ ...filters, search: search.trim() || undefined })
          }
          className={styles['warehouse-page__search']}
        />
        <Flex gap="small" align="center">
          <Switch
            checked={filters.belowMin ?? false}
            onChange={(belowMin) =>
              changeFilters({ ...filters, belowMin: belowMin || undefined })
            }
          />
          <span>Только заканчивающиеся</span>
        </Flex>
      </Flex>

      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          className={styles['warehouse-page__error']}
        />
      )}

      <Table<TProductListItem>
        rowKey="id"
        columns={columns}
        dataSource={products}
        loading={isLoading}
        scroll={{ x: 900 }}
        rowClassName={(product) =>
          ROW_CLASS_BY_STATUS[product.stockStatus] ?? ''
        }
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
