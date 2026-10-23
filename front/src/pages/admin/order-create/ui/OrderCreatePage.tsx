import { App, Button, Result, Typography } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  createOrder,
  type TOrder,
  type TOrderCreateValues,
} from '@/entities/order'
import { OrderForm } from '@/features/order-form'
import { APP_ROUTES } from '@/shared/config/routes'
import { formatPrice } from '@/shared/lib'

export function OrderCreatePage() {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const [createdOrder, setCreatedOrder] = useState<TOrder>()

  const handleSubmit = async (values: TOrderCreateValues) => {
    const order = await createOrder(values)
    message.success('Заказ создан')
    setCreatedOrder(order)
  }

  if (createdOrder) {
    return (
      <Result
        status="success"
        title="Заказ создан"
        subTitle={`${createdOrder.customerName}, сумма ${formatPrice(createdOrder.totalAmount)}`}
        extra={
          <Button type="primary" onClick={() => setCreatedOrder(undefined)}>
            Создать ещё
          </Button>
        }
      />
    )
  }

  return (
    <section>
      <Typography.Title level={2}>Новый заказ</Typography.Title>
      <OrderForm
        onSubmit={handleSubmit}
        onCancel={() => navigate(APP_ROUTES.products)}
      />
    </section>
  )
}
