import { App, Button, Popconfirm } from 'antd'
import { useState } from 'react'

import { changeOrderStatus, type TOrder } from '@/entities/order'
import { getApiErrorMessage } from '@/shared/lib'

import { NEXT_STATUS_ACTION } from '../model/nextStatusAction'

type TChangeOrderStatusButtonProps = {
  order: TOrder
  onChange: (order: TOrder) => void
}

export function ChangeOrderStatusButton({
  order,
  onChange,
}: TChangeOrderStatusButtonProps) {
  const { message } = App.useApp()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const action = NEXT_STATUS_ACTION[order.status]

  if (!action) return null

  const changeStatus = async () => {
    setIsSubmitting(true)

    try {
      const updated = await changeOrderStatus(order.id, action.status)
      onChange(updated)
      message.success(action.successMessage)
    } catch (error) {
      message.error(getApiErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Popconfirm
      title={action.confirmTitle}
      description={action.confirmDescription}
      okText={action.buttonText}
      cancelText="Отмена"
      onConfirm={changeStatus}
    >
      <Button type="primary" loading={isSubmitting}>
        {action.buttonText}
      </Button>
    </Popconfirm>
  )
}
