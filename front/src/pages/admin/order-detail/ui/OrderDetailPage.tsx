import type { TableColumnsType } from 'antd'
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Flex,
  Result,
  Skeleton,
  Table,
  Typography,
} from 'antd'
import { Link, useNavigate, useParams } from 'react-router-dom'

import {
  OrderStatusTag,
  type TOrderItem,
  useOrderDetail,
} from '@/entities/order'
import { ChangeOrderStatusButton } from '@/features/order-change-status'
import { APP_ROUTES } from '@/shared/config/routes'
import { formatDateTime, formatPhone, formatPrice } from '@/shared/lib'

import styles from './orderDetailPage.module.css'

const columns: TableColumnsType<TOrderItem> = [
  {
    title: 'Артикул',
    dataIndex: 'sku',
    width: 120,
  },
  {
    title: 'Товар',
    dataIndex: 'productName',
    render: (name: string, item) => (
      <Link to={APP_ROUTES.productDetail(item.productId)}>{name}</Link>
    ),
  },
  {
    title: 'Цена',
    dataIndex: 'price',
    align: 'right',
    width: 130,
    render: (price: number) => formatPrice(price),
  },
  {
    title: 'Количество',
    dataIndex: 'quantity',
    align: 'right',
    width: 120,
    render: (quantity: number) => `${quantity} шт.`,
  },
  {
    title: 'Сумма',
    dataIndex: 'sum',
    align: 'right',
    width: 140,
    render: (sum: number) => formatPrice(sum),
  },
]

export function OrderDetailPage() {
  const { orderId = '' } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const { order, isLoading, error, isNotFound, replaceOrder } =
    useOrderDetail(orderId)

  if (isNotFound) {
    return (
      <Result
        status="404"
        title="Заказ не найден"
        subTitle="Возможно, ссылка устарела."
        extra={
          <Button type="primary" onClick={() => navigate(APP_ROUTES.orders)}>
            К заказам
          </Button>
        }
      />
    )
  }

  return (
    <section>
      <Link to={APP_ROUTES.orders} className={styles['order-detail__back']}>
        ← К заказам
      </Link>

      {isLoading && <Skeleton active paragraph={{ rows: 8 }} />}

      {error && <Alert type="error" message={error} showIcon />}

      {order && (
        <>
          <Flex
            align="center"
            gap="small"
            wrap
            className={styles['order-detail__header']}
          >
            <Typography.Title
              level={2}
              className={styles['order-detail__title']}
            >
              Заказ №{order.number}
            </Typography.Title>
            <OrderStatusTag status={order.status} />
            <ChangeOrderStatusButton order={order} onChange={replaceOrder} />
          </Flex>

          <Card
            title="Покупатель и доставка"
            className={styles['order-detail__card']}
          >
            <Descriptions
              column={1}
              bordered
              size="small"
              items={[
                {
                  key: 'customer',
                  label: 'Покупатель',
                  children: order.customerName,
                },
                {
                  key: 'phone',
                  label: 'Телефон',
                  children: formatPhone(order.customerPhone),
                },
                {
                  key: 'address',
                  label: 'Адрес доставки',
                  children: order.deliveryAddress,
                },
                {
                  key: 'createdAt',
                  label: 'Создан',
                  children: formatDateTime(order.createdAt),
                },
                {
                  key: 'updatedAt',
                  label: 'Изменён',
                  children: formatDateTime(order.updatedAt),
                },
              ]}
            />
          </Card>

          <Card title="Позиции" className={styles['order-detail__card']}>
            <Table<TOrderItem>
              rowKey="productId"
              columns={columns}
              dataSource={order.items}
              pagination={false}
              scroll={{ x: 700 }}
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={4} align="right">
                    <Typography.Text strong>Итого</Typography.Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right">
                    <Typography.Text strong>
                      {formatPrice(order.totalAmount)}
                    </Typography.Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          </Card>
        </>
      )}
    </section>
  )
}
