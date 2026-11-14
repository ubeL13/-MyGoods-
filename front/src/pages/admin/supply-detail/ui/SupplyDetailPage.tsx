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
import dayjs from 'dayjs'
import { Link, useNavigate, useParams } from 'react-router-dom'

import {
  SupplyStatusTag,
  type TSupplyItem,
  useSupplyDetail,
} from '@/entities/supply'
import { CancelSupplyButton } from '@/features/supply-cancel'
import { SupplyReceiveForm } from '@/features/supply-receive'
import { APP_ROUTES } from '@/shared/config/routes'
import { formatDateTime, formatPrice } from '@/shared/lib'

import styles from './supplyDetailPage.module.css'

const itemColumns: TableColumnsType<TSupplyItem> = [
  {
    title: 'Артикул',
    dataIndex: 'sku',
    width: 110,
    render: (sku: string) => sku || '—',
  },
  {
    title: 'Товар',
    dataIndex: 'productName',
    render: (name: string) => name || '—',
  },
  {
    title: 'Заказано',
    dataIndex: 'quantity',
    align: 'right',
    width: 100,
    render: (quantity: number) => `${quantity} шт.`,
  },
  {
    title: 'Принято',
    dataIndex: 'receivedQuantity',
    align: 'right',
    width: 100,
    render: (received: number | null) =>
      received === null ? '—' : `${received} шт.`,
  },
  {
    title: 'Расхождение',
    key: 'diff',
    align: 'right',
    width: 120,
    render: (_, item) => {
      if (item.receivedQuantity === null) return '—'
      const diff = item.receivedQuantity - item.quantity
      if (diff === 0) return '—'
      return (
        <Typography.Text type={diff < 0 ? 'danger' : 'warning'}>
          {diff > 0 ? `+${diff}` : diff} шт.
        </Typography.Text>
      )
    },
  },
  {
    title: 'Закупочная цена',
    dataIndex: 'purchasePrice',
    align: 'right',
    width: 140,
    render: (price: number) => formatPrice(price),
  },
  {
    title: 'Сумма по заказу',
    dataIndex: 'sum',
    align: 'right',
    width: 140,
    render: (sum: number) => formatPrice(sum),
  },
  {
    title: 'Сумма принятого',
    key: 'receivedSum',
    align: 'right',
    width: 140,
    render: (_, item) =>
      item.receivedQuantity === null
        ? '—'
        : formatPrice(item.receivedQuantity * item.purchasePrice),
  },
]

function getReceivedAmount(items: TSupplyItem[]) {
  return items.reduce(
    (sum, item) => sum + (item.receivedQuantity ?? 0) * item.purchasePrice,
    0,
  )
}

export function SupplyDetailPage() {
  const { supplyId = '' } = useParams<{ supplyId: string }>()
  const navigate = useNavigate()
  const { supply, isLoading, error, isNotFound, replaceSupply } =
    useSupplyDetail(supplyId)

  if (isNotFound) {
    return (
      <Result
        status="404"
        title="Поставка не найдена"
        subTitle="Возможно, ссылка устарела."
        extra={
          <Button type="primary" onClick={() => navigate(APP_ROUTES.supplies)}>
            К поставкам
          </Button>
        }
      />
    )
  }

  return (
    <section>
      <Link to={APP_ROUTES.supplies} className={styles['supply-detail__back']}>
        ← К поставкам
      </Link>

      {isLoading && <Skeleton active paragraph={{ rows: 8 }} />}

      {error && <Alert type="error" message={error} showIcon />}

      {supply && (
        <>
          <Flex
            align="center"
            gap="small"
            wrap
            className={styles['supply-detail__header']}
          >
            <Typography.Title
              level={2}
              className={styles['supply-detail__title']}
            >
              Поставка №{supply.number}
            </Typography.Title>
            <SupplyStatusTag status={supply.status} />
            {supply.status === 'Created' && (
              <CancelSupplyButton supply={supply} onCancelled={replaceSupply} />
            )}
          </Flex>

          <Card title="Поставка" className={styles['supply-detail__card']}>
            <Descriptions
              column={1}
              bordered
              size="small"
              items={[
                {
                  key: 'supplier',
                  label: 'Поставщик',
                  children: supply.supplierName || '—',
                },
                {
                  key: 'expected',
                  label: 'Ожидаемая дата',
                  children: supply.expectedDate
                    ? dayjs(supply.expectedDate).format('DD.MM.YYYY')
                    : '—',
                },
                {
                  key: 'created',
                  label: 'Оформлена',
                  children: formatDateTime(supply.createdAt),
                },
                {
                  key: 'received',
                  label: 'Принята',
                  children: supply.receivedAt
                    ? formatDateTime(supply.receivedAt)
                    : '—',
                },
                {
                  key: 'total',
                  label: 'Сумма по заказу',
                  children: formatPrice(supply.totalAmount),
                },
                ...(supply.status === 'Received'
                  ? [
                      {
                        key: 'receivedTotal',
                        label: 'Сумма принятого',
                        children: formatPrice(getReceivedAmount(supply.items)),
                      },
                    ]
                  : []),
                {
                  key: 'comment',
                  label: 'Комментарий',
                  children: supply.comment || '—',
                },
              ]}
            />
          </Card>

          {supply.status === 'Created' ? (
            <Card
              title="Приёмка: укажите фактическое количество"
              className={styles['supply-detail__card']}
            >
              <SupplyReceiveForm supply={supply} onReceived={replaceSupply} />
            </Card>
          ) : (
            <Card title="Позиции" className={styles['supply-detail__card']}>
              <Table<TSupplyItem>
                rowKey="productId"
                columns={itemColumns}
                dataSource={supply.items}
                pagination={false}
                scroll={{ x: 1000 }}
                summary={() =>
                  supply.status === 'Received' && (
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={6} align="right">
                        <Typography.Text strong>Итого</Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right">
                        <Typography.Text strong>
                          {formatPrice(supply.totalAmount)}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2} align="right">
                        <Typography.Text strong>
                          {formatPrice(getReceivedAmount(supply.items))}
                        </Typography.Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  )
                }
              />
            </Card>
          )}
        </>
      )}
    </section>
  )
}
