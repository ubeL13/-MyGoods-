import type { TableColumnsType } from 'antd'
import {
  Alert,
  App,
  Button,
  Flex,
  Input,
  Segmented,
  Space,
  Table,
  Typography,
} from 'antd'
import { useState } from 'react'

import type { TSupplier } from '@/entities/supplier'
import { ArchiveSupplierButton } from '@/features/supplier-archive'
import { SupplierFormModal } from '@/features/supplier-form'
import { formatPhone } from '@/shared/lib'

import { useSuppliersPage } from '../model/useSuppliersPage'

import styles from './suppliersPage.module.css'

const PAGE_SIZE_OPTIONS = [10, 20, 50]

type TModalState = {
  supplier?: TSupplier
}

export function SuppliersPage() {
  const { message } = App.useApp()
  const {
    suppliers,
    totalCount,
    page,
    pageSize,
    filters,
    isLoading,
    error,
    reload,
    changePage,
    changeFilters,
  } = useSuppliersPage()
  const [modal, setModal] = useState<TModalState | null>(null)

  const handleSaved = (supplier: TSupplier) => {
    message.success(
      modal?.supplier
        ? 'Изменения сохранены'
        : `Поставщик «${supplier.name}» создан`,
    )
    setModal(null)
    reload()
  }

  const columns: TableColumnsType<TSupplier> = [
    {
      title: 'Название',
      dataIndex: 'name',
      render: (name: string, supplier) => (
        <>
          <div>{name}</div>
          {supplier.comment && (
            <Typography.Text type="secondary" ellipsis>
              {supplier.comment}
            </Typography.Text>
          )}
        </>
      ),
    },
    {
      title: 'ИНН',
      dataIndex: 'inn',
      width: 140,
      render: (inn: string) => inn || '—',
    },
    {
      title: 'Контактное лицо',
      dataIndex: 'contactPerson',
      width: 180,
      render: (contactPerson: string) => contactPerson || '—',
    },
    {
      title: 'Телефон',
      dataIndex: 'phone',
      width: 170,
      render: (phone: string) => (phone ? formatPhone(phone) : '—'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 190,
      render: (email: string) =>
        email ? <a href={`mailto:${email}`}>{email}</a> : '—',
    },
    {
      title: '',
      key: 'actions',
      width: 200,
      align: 'right',
      render: (_, supplier) => (
        <Space size="small">
          <Button size="small" onClick={() => setModal({ supplier })}>
            Изменить
          </Button>
          <ArchiveSupplierButton supplier={supplier} onChange={reload} />
        </Space>
      ),
    },
  ]

  return (
    <section>
      <Flex
        justify="space-between"
        align="center"
        wrap
        gap="middle"
        className={styles['suppliers-page__header']}
      >
        <Typography.Title level={2} className={styles['suppliers-page__title']}>
          Поставщики
        </Typography.Title>
        <Button type="primary" onClick={() => setModal({})}>
          Добавить поставщика
        </Button>
      </Flex>

      <Flex
        gap="middle"
        align="center"
        wrap
        className={styles['suppliers-page__filters']}
      >
        <Segmented
          value={filters.archived ? 'archived' : 'active'}
          options={[
            { label: 'Активные', value: 'active' },
            { label: 'Архив', value: 'archived' },
          ]}
          onChange={(value) =>
            changeFilters({ ...filters, archived: value === 'archived' })
          }
        />
        <Input.Search
          allowClear
          placeholder="Название, ИНН, контакт или телефон"
          onSearch={(search) =>
            changeFilters({ ...filters, search: search.trim() || undefined })
          }
          className={styles['suppliers-page__search']}
        />
      </Flex>

      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          className={styles['suppliers-page__error']}
        />
      )}

      <Table<TSupplier>
        rowKey="id"
        columns={columns}
        dataSource={suppliers}
        loading={isLoading}
        scroll={{ x: 1000 }}
        locale={{
          emptyText: filters.archived
            ? 'В архиве нет поставщиков'
            : 'Поставщики не найдены',
        }}
        pagination={{
          current: page,
          pageSize,
          total: totalCount,
          showSizeChanger: true,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
          showTotal: (total) => `Всего поставщиков: ${total}`,
          onChange: changePage,
        }}
      />

      {modal && (
        <SupplierFormModal
          supplier={modal.supplier}
          onSaved={handleSaved}
          onCancel={() => setModal(null)}
        />
      )}
    </section>
  )
}
