import type { TableColumnsType } from 'antd'
import {
  Alert,
  App,
  Button,
  Flex,
  Input,
  Select,
  Table,
  Tabs,
  Typography,
} from 'antd'
import { useState } from 'react'

import {
  type TWriteOff,
  type TWriteOffReason,
  type TWriteOffStatus,
  WRITE_OFF_REASON_LABEL,
  WRITE_OFF_REASONS,
  WRITE_OFF_STATUS_VIEW,
  WRITE_OFF_STATUSES,
  WriteOffStatusTag,
} from '@/entities/write-off'
import { WriteOffFormModal } from '@/features/write-off-form'
import { formatDateTime } from '@/shared/lib'

import { useWriteOffsPage } from '../model/useWriteOffsPage'

import styles from './writeOffsPage.module.css'

const PAGE_SIZE_OPTIONS = [10, 20, 50]

const ALL_STATUSES_KEY = 'all'

const STATUS_TABS = [
  { key: ALL_STATUSES_KEY, label: 'Все' },
  ...WRITE_OFF_STATUSES.map((status) => ({
    key: status,
    label: WRITE_OFF_STATUS_VIEW[status].pluralLabel,
  })),
]

const columns: TableColumnsType<TWriteOff> = [
  {
    title: '№',
    dataIndex: 'number',
    width: 70,
  },
  {
    title: 'Дата',
    dataIndex: 'createdAt',
    width: 200,
    render: (createdAt: string) => formatDateTime(createdAt),
  },
  {
    title: 'Товар',
    dataIndex: 'productName',
    render: (name: string, writeOff) => (
      <>
        <div>{name || '—'}</div>
        <Typography.Text type="secondary">{writeOff.sku}</Typography.Text>
      </>
    ),
  },
  {
    title: 'Кол-во',
    dataIndex: 'quantity',
    align: 'right',
    width: 90,
    render: (quantity: number) => `${quantity} шт.`,
  },
  {
    title: 'Причина',
    dataIndex: 'reason',
    width: 220,
    render: (reason: TWriteOffReason, writeOff) => (
      <>
        <div>{WRITE_OFF_REASON_LABEL[reason]}</div>
        {writeOff.comment && (
          <Typography.Text type="secondary" ellipsis>
            {writeOff.comment}
          </Typography.Text>
        )}
      </>
    ),
  },
  {
    title: 'Кто оформил',
    dataIndex: 'createdBy',
    width: 160,
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    width: 170,
    render: (status: TWriteOffStatus) => <WriteOffStatusTag status={status} />,
  },
]

export function WriteOffsPage() {
  const { message } = App.useApp()
  const {
    writeOffs,
    totalCount,
    page,
    pageSize,
    filters,
    isLoading,
    error,
    reload,
    changePage,
    changeFilters,
  } = useWriteOffsPage()
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleCreated = (writeOff: TWriteOff) => {
    message.success(
      `Заявка №${writeOff.number} на списание отправлена на рассмотрение`,
    )
    setIsFormOpen(false)
    reload()
  }

  return (
    <section>
      <Flex
        justify="space-between"
        align="center"
        wrap
        gap="middle"
        className={styles['write-offs-page__header']}
      >
        <Typography.Title
          level={2}
          className={styles['write-offs-page__title']}
        >
          Списания
        </Typography.Title>
        <Button type="primary" onClick={() => setIsFormOpen(true)}>
          Новая заявка
        </Button>
      </Flex>

      <Tabs
        activeKey={filters.status ?? ALL_STATUSES_KEY}
        items={STATUS_TABS}
        onChange={(key) =>
          changeFilters({
            ...filters,
            status:
              key === ALL_STATUSES_KEY ? undefined : (key as TWriteOffStatus),
          })
        }
      />

      <Flex gap="middle" wrap className={styles['write-offs-page__filters']}>
        <Input.Search
          allowClear
          placeholder="Номер заявки, товар или артикул"
          onSearch={(search) =>
            changeFilters({ ...filters, search: search.trim() || undefined })
          }
          className={styles['write-offs-page__search']}
        />
        <Select
          allowClear
          placeholder="Любая причина"
          value={filters.reason}
          onChange={(reason?: TWriteOffReason) =>
            changeFilters({ ...filters, reason })
          }
          options={WRITE_OFF_REASONS.map((value) => ({
            value,
            label: WRITE_OFF_REASON_LABEL[value],
          }))}
          className={styles['write-offs-page__reason']}
        />
      </Flex>

      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          className={styles['write-offs-page__error']}
        />
      )}

      <Table<TWriteOff>
        rowKey="id"
        columns={columns}
        dataSource={writeOffs}
        loading={isLoading}
        scroll={{ x: 1000 }}
        locale={{ emptyText: 'Заявок на списание нет' }}
        pagination={{
          current: page,
          pageSize,
          total: totalCount,
          showSizeChanger: true,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
          showTotal: (total) => `Всего заявок: ${total}`,
          onChange: changePage,
        }}
      />

      {isFormOpen && (
        <WriteOffFormModal
          onCreated={handleCreated}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </section>
  )
}
