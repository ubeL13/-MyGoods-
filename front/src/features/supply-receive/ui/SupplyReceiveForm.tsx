import type { TableColumnsType } from 'antd'
import {
  App,
  Button,
  Flex,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
} from 'antd'
import { useState } from 'react'

import {
  receiveSupply,
  type TSupply,
  type TSupplyItem,
} from '@/entities/supply'
import { formatPrice, getApiErrorMessage } from '@/shared/lib'

import styles from './supplyReceiveForm.module.css'

type TSupplyReceiveFormProps = {
  supply: TSupply
  onReceived: (supply: TSupply) => void
}

function DiffText({ diff }: { diff: number }) {
  if (diff === 0) return <Typography.Text type="secondary">—</Typography.Text>

  return <Typography.Text type="danger">{diff} шт.</Typography.Text>
}

export function SupplyReceiveForm({
  supply,
  onReceived,
}: TSupplyReceiveFormProps) {
  const { message } = App.useApp()
  const [received, setReceived] = useState<Record<string, number | null>>(() =>
    Object.fromEntries(
      supply.items.map((item) => [item.productId, item.quantity]),
    ),
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const receivedOf = (item: TSupplyItem) => received[item.productId] ?? null

  const isFilled = supply.items.every((item) => receivedOf(item) !== null)
  const totalUnits = supply.items.reduce(
    (sum, item) => sum + (receivedOf(item) ?? 0),
    0,
  )
  const totalAmount = supply.items.reduce(
    (sum, item) => sum + (receivedOf(item) ?? 0) * item.purchasePrice,
    0,
  )
  const diffCount = supply.items.filter(
    (item) => receivedOf(item) !== item.quantity,
  ).length

  const handleReceive = async () => {
    setIsSubmitting(true)

    try {
      const updated = await receiveSupply(supply.id, {
        items: supply.items.map((item) => ({
          productId: item.productId,
          receivedQuantity: receivedOf(item) ?? 0,
        })),
      })
      onReceived(updated)
      message.success(
        `Поставка №${updated.number} принята, на склад оприходовано ${totalUnits} шт.`,
      )
    } catch (error) {
      message.error(getApiErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns: TableColumnsType<TSupplyItem> = [
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
      key: 'received',
      width: 140,
      render: (_, item) => (
        <InputNumber
          min={0}
          max={item.quantity}
          precision={0}
          suffix="шт."
          value={receivedOf(item)}
          status={receivedOf(item) === null ? 'error' : undefined}
          disabled={isSubmitting}
          onChange={(value) =>
            setReceived((prev) => ({ ...prev, [item.productId]: value }))
          }
          className={styles['supply-receive__input']}
        />
      ),
    },
    {
      title: 'Расхождение',
      key: 'diff',
      align: 'right',
      width: 120,
      render: (_, item) => {
        const value = receivedOf(item)
        return value === null ? '—' : <DiffText diff={value - item.quantity} />
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
      title: 'Сумма',
      key: 'sum',
      align: 'right',
      width: 130,
      render: (_, item) =>
        formatPrice((receivedOf(item) ?? 0) * item.purchasePrice),
    },
  ]

  return (
    <>
      <Table<TSupplyItem>
        rowKey="productId"
        columns={columns}
        dataSource={supply.items}
        pagination={false}
        scroll={{ x: 850 }}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={6} align="right">
              <Typography.Text strong>
                К оприходованию: {totalUnits} шт.
              </Typography.Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1} align="right">
              <Typography.Text strong>
                {formatPrice(totalAmount)}
              </Typography.Text>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />

      <Flex
        justify="space-between"
        align="center"
        wrap
        gap="middle"
        className={styles['supply-receive__footer']}
      >
        <Typography.Text type={diffCount > 0 ? 'warning' : 'secondary'}>
          {diffCount > 0
            ? `Недостача в ${diffCount} поз. — проверьте перед подтверждением`
            : 'Фактическое количество совпадает с заказом. Принять больше заказанного нельзя.'}
        </Typography.Text>

        <Popconfirm
          title="Принять поставку?"
          description={`На склад будет оприходовано ${totalUnits} шт. Изменить количество после приёмки будет нельзя.`}
          okText="Принять"
          cancelText="Назад"
          onConfirm={handleReceive}
          disabled={!isFilled}
        >
          <Button type="primary" loading={isSubmitting} disabled={!isFilled}>
            Принять поставку
          </Button>
        </Popconfirm>
      </Flex>
    </>
  )
}
