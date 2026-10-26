import type { TableColumnsType } from 'antd'
import { Alert, Button, Flex, Input, Table, Tabs, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

import {
  ORDER_STATUS_VIEW,
  ORDER_STATUSES,
  OrderStatusTag,
  type TOrderListItem,
  type TOrderStatus,
} from '@/entities/order'
import { APP_ROUTES } from '@/shared/config/routes'
import { formatDateTime, formatPrice } from '@/shared/lib'

import { useOrdersPage } from '../model/useOrdersPage'

import styles from './ordersPage.module.css'

const PAGE_SIZE_OPTIONS = [10, 20, 50]

const ALL_STATUSES_KEY = 'all'

const STATUS_TABS = [
  { key: ALL_STATUSES_KEY, label: 'Все' },
  ...ORDER_STATUSES.map((status) => ({
    key: status,
    label: ORDER_STATUS_VIEW[status].pluralLabel,
  })),
]

const columns: TableColumnsType<TOrderListItem> = [
  {
    title: '№',
    dataIndex: 'number',
    width: 90,
  },
  {
    title: 'Дата',
    dataIndex: 'createdAt',
    width: 200,
    render: (createdAt: string) => formatDateTime(createdAt),
  },
  {
    title: 'Покупатель',
    dataIndex: 'customerName',
    render: (name: string, order) => (
      <>
        <div>{name}</div>
        <Typography.Text type="secondary">
          {order.customerPhone}
        </Typography.Text>
      </>
    ),
  },
  {
    title: 'Позиций',
    dataIndex: 'itemsCount',
    align: 'right',
    width: 100,
  },
  {
    title: 'Сумма',
    dataIndex: 'totalAmount',
    align: 'right',
    width: 140,
    render: (totalAmount: number) => formatPrice(totalAmount),
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    width: 150,
    render: (status: TOrderStatus) => <OrderStatusTag status={status} />,
  },
]

export function OrdersPage() {
  const navigate = useNavigate()
  const {
    orders,
    totalCount,
    page,
    pageSize,
    filters,
    isLoading,
    error,
    changePage,
    changeFilters,
  } = useOrdersPage()

  const handleStatusChange = (key: string) => {
    changeFilters({
      ...filters,
      status: key === ALL_STATUSES_KEY ? undefined : (key as TOrderStatus),
    })
  }

  const handleSearch = (search: string) => {
    changeFilters({ ...filters, search: search.trim() || undefined })
  }

  return (
    <section>
      <Flex
        justify="space-between"
        align="center"
        wrap
        gap="middle"
        className={styles['orders-page__header']}
      >
        <Typography.Title level={2} className={styles['orders-page__title']}>
          Заказы
        </Typography.Title>
        <Button type="primary" onClick={() => navigate(APP_ROUTES.orderCreate)}>
          Новый заказ
        </Button>
      </Flex>

      <Tabs
        activeKey={filters.status ?? ALL_STATUSES_KEY}
        items={STATUS_TABS}
        onChange={handleStatusChange}
      />

      <Input.Search
        allowClear
        placeholder="Номер заказа, имя или телефон покупателя"
        onSearch={handleSearch}
        className={styles['orders-page__search']}
      />

      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          className={styles['orders-page__error']}
        />
      )}

      <Table<TOrderListItem>
        rowKey="id"
        columns={columns}
        dataSource={orders}
        loading={isLoading}
        scroll={{ x: 800 }}
        locale={{ emptyText: 'Заказы не найдены' }}
        pagination={{
          current: page,
          pageSize,
          total: totalCount,
          showSizeChanger: true,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
          showTotal: (total) => `Всего заказов: ${total}`,
          onChange: changePage,
        }}
      />
    </section>
  )
}
