import type { TableColumnsType } from 'antd'
import { Alert, Input, Table, Typography } from 'antd'
import { Link } from 'react-router-dom'

import type { TCustomer } from '@/entities/customer'
import { APP_ROUTES } from '@/shared/config/routes'
import { formatDateTime, formatPhone } from '@/shared/lib'

import { useCustomersPage } from '../model/useCustomersPage'

import styles from './customersPage.module.css'

const PAGE_SIZE_OPTIONS = [10, 20, 50]

const columns: TableColumnsType<TCustomer> = [
  {
    title: 'Покупатель',
    dataIndex: 'name',
    render: (name: string, customer) => (
      <Link to={APP_ROUTES.customerDetail(customer.id)}>{name}</Link>
    ),
  },
  {
    title: 'Телефон',
    dataIndex: 'phone',
    width: 170,
    render: (phone: string) => formatPhone(phone),
  },
  {
    title: 'Email',
    dataIndex: 'email',
    width: 200,
    render: (email: string) => email || '—',
  },
  {
    title: 'Адрес',
    dataIndex: 'address',
    ellipsis: true,
    render: (address: string) => address || '—',
  },
  {
    title: 'Клиент с',
    dataIndex: 'createdAt',
    width: 200,
    render: (createdAt: string) => formatDateTime(createdAt),
  },
]

export function CustomersPage() {
  const {
    customers,
    totalCount,
    page,
    pageSize,
    isLoading,
    error,
    changePage,
    changeSearch,
  } = useCustomersPage()

  return (
    <section>
      <Typography.Title level={2} className={styles['customers-page__title']}>
        Покупатели
      </Typography.Title>

      <Input.Search
        allowClear
        placeholder="Имя или телефон"
        onSearch={changeSearch}
        className={styles['customers-page__search']}
      />

      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          className={styles['customers-page__error']}
        />
      )}

      <Table<TCustomer>
        rowKey="id"
        columns={columns}
        dataSource={customers}
        loading={isLoading}
        scroll={{ x: 900 }}
        locale={{ emptyText: 'Покупатели не найдены' }}
        pagination={{
          current: page,
          pageSize,
          total: totalCount,
          showSizeChanger: true,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
          showTotal: (total) => `Всего покупателей: ${total}`,
          onChange: changePage,
        }}
      />
    </section>
  )
}
