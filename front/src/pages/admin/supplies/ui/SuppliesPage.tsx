import type { TableColumnsType } from 'antd'
import { Alert, Button, Flex, Input, Table, Tabs, Typography } from 'antd'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'

import {
  SUPPLY_STATUS_VIEW,
  SUPPLY_STATUSES,
  SupplyStatusTag,
  type TSupplyListItem,
  type TSupplyStatus,
} from '@/entities/supply'
import { APP_ROUTES } from '@/shared/config/routes'
import { formatDateTime, formatPrice } from '@/shared/lib'

import { useSuppliesPage } from '../model/useSuppliesPage'

import styles from './suppliesPage.module.css'

const PAGE_SIZE_OPTIONS = [10, 20, 50]

const ALL_STATUSES_KEY = 'all'

const STATUS_TABS = [
  { key: ALL_STATUSES_KEY, label: 'Все' },
  ...SUPPLY_STATUSES.map((status) => ({
    key: status,
    label: SUPPLY_STATUS_VIEW[status].pluralLabel,
  })),
]

const columns: TableColumnsType<TSupplyListItem> = [
  {
    title: '№',
    dataIndex: 'number',
    width: 80,
  },
  {
    title: 'Оформлена',
    dataIndex: 'createdAt',
    width: 200,
    render: (createdAt: string) => formatDateTime(createdAt),
  },
  {
    title: 'Поставщик',
    dataIndex: 'supplierName',
    render: (name: string) => name || '—',
  },
  {
    title: 'Ожидается',
    dataIndex: 'expectedDate',
    width: 120,
    render: (date: string | null) =>
      date ? dayjs(date).format('DD.MM.YYYY') : '—',
  },
  {
    title: 'Позиций',
    dataIndex: 'itemsCount',
    align: 'right',
    width: 100,
  },
  {
    title: 'Сумма закупки',
    dataIndex: 'totalAmount',
    align: 'right',
    width: 150,
    render: (totalAmount: number) => formatPrice(totalAmount),
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    width: 140,
    render: (status: TSupplyStatus) => <SupplyStatusTag status={status} />,
  },
]

export function SuppliesPage() {
  const navigate = useNavigate()
  const {
    supplies,
    totalCount,
    page,
    pageSize,
    filters,
    isLoading,
    error,
    changePage,
    changeFilters,
  } = useSuppliesPage()

  return (
    <section>
      <Flex
        justify="space-between"
        align="center"
        wrap
        gap="middle"
        className={styles['supplies-page__header']}
      >
        <Typography.Title level={2} className={styles['supplies-page__title']}>
          Поставки
        </Typography.Title>
        <Button
          type="primary"
          onClick={() => navigate(APP_ROUTES.supplyCreate)}
        >
          Новая поставка
        </Button>
      </Flex>

      <Tabs
        activeKey={filters.status ?? ALL_STATUSES_KEY}
        items={STATUS_TABS}
        onChange={(key) =>
          changeFilters({
            ...filters,
            status:
              key === ALL_STATUSES_KEY ? undefined : (key as TSupplyStatus),
          })
        }
      />

      <Input.Search
        allowClear
        placeholder="Номер поставки или поставщик"
        onSearch={(search) =>
          changeFilters({ ...filters, search: search.trim() || undefined })
        }
        className={styles['supplies-page__search']}
      />

      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          className={styles['supplies-page__error']}
        />
      )}

      <Table<TSupplyListItem>
        rowKey="id"
        columns={columns}
        dataSource={supplies}
        loading={isLoading}
        scroll={{ x: 900 }}
        locale={{ emptyText: 'Поставки не найдены' }}
        pagination={{
          current: page,
          pageSize,
          total: totalCount,
          showSizeChanger: true,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
          showTotal: (total) => `Всего поставок: ${total}`,
          onChange: changePage,
        }}
      />
    </section>
  )
}
