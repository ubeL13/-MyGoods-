import type { TableColumnsType } from 'antd'
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Flex,
  Result,
  Skeleton,
  Statistic,
  Table,
  Typography,
} from 'antd'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { type TCustomerOrder, useCustomerDetail } from '@/entities/customer'
import { OrderStatusTag, type TOrderStatus } from '@/entities/order'
import { APP_ROUTES } from '@/shared/config/routes'
import { formatDateTime, formatPhone, formatPrice } from '@/shared/lib'

import styles from './customerDetailPage.module.css'

const orderColumns: TableColumnsType<TCustomerOrder> = [
  {
    title: '№',
    dataIndex: 'number',
    width: 90,
    render: (number: number, order) => (
      <Link to={APP_ROUTES.orderDetail(order.id)}>{number}</Link>
    ),
  },
  {
    title: 'Дата',
    dataIndex: 'createdAt',
    render: (createdAt: string) => formatDateTime(createdAt),
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    width: 150,
    render: (status: string) => (
      <OrderStatusTag status={status as TOrderStatus} />
    ),
  },
  {
    title: 'Сумма',
    dataIndex: 'totalAmount',
    align: 'right',
    width: 150,
    render: (totalAmount: number) => formatPrice(totalAmount),
  },
]

export function CustomerDetailPage() {
  const { customerId = '' } = useParams<{ customerId: string }>()
  const navigate = useNavigate()
  const { customer, isLoading, error, isNotFound } =
    useCustomerDetail(customerId)

  if (isNotFound) {
    return (
      <Result
        status="404"
        title="Покупатель не найден"
        subTitle="Возможно, ссылка устарела."
        extra={
          <Button type="primary" onClick={() => navigate(APP_ROUTES.customers)}>
            К покупателям
          </Button>
        }
      />
    )
  }

  return (
    <section>
      <Link
        to={APP_ROUTES.customers}
        className={styles['customer-detail__back']}
      >
        ← К покупателям
      </Link>

      {isLoading && <Skeleton active paragraph={{ rows: 8 }} />}

      {error && <Alert type="error" message={error} showIcon />}

      {customer && (
        <>
          <Typography.Title
            level={2}
            className={styles['customer-detail__title']}
          >
            {customer.name}
          </Typography.Title>

          <Card className={styles['customer-detail__card']}>
            <Flex gap="large" wrap>
              <Statistic title="Заказов" value={customer.ordersCount} />
              <Statistic
                title="Сумма покупок"
                value={formatPrice(customer.totalSpent)}
              />
            </Flex>
            <Typography.Text type="secondary">
              Отменённые заказы в сумму покупок не входят.
            </Typography.Text>
          </Card>

          <Card title="Контакты" className={styles['customer-detail__card']}>
            <Descriptions
              column={1}
              bordered
              size="small"
              items={[
                {
                  key: 'phone',
                  label: 'Телефон',
                  children: formatPhone(customer.phone),
                },
                {
                  key: 'email',
                  label: 'Email',
                  children: customer.email || '—',
                },
                {
                  key: 'address',
                  label: 'Адрес',
                  children: customer.address || '—',
                },
                {
                  key: 'createdAt',
                  label: 'Клиент с',
                  children: formatDateTime(customer.createdAt),
                },
              ]}
            />
          </Card>

          <Card title="Заказы" className={styles['customer-detail__card']}>
            <Table<TCustomerOrder>
              rowKey="id"
              columns={orderColumns}
              dataSource={customer.orders}
              pagination={
                customer.orders.length > 10 ? { pageSize: 10 } : false
              }
              locale={{ emptyText: 'У покупателя пока нет заказов' }}
              scroll={{ x: 600 }}
            />
          </Card>
        </>
      )}
    </section>
  )
}
