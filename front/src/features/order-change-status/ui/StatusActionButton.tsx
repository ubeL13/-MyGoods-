import { App, Button, Popconfirm } from 'antd'
import { useState } from 'react'

import { changeOrderStatus, type TOrder } from '@/entities/order'
import { getApiErrorMessage } from '@/shared/lib'

import type { TStatusAction } from '../model/statusActions'

type TStatusActionButtonProps = {
  order: TOrder
  action: TStatusAction
  danger?: boolean
  onChange: (order: TOrder) => void
}

export function StatusActionButton({
  order,
  action,
  danger = false,
  onChange,
}: TStatusActionButtonProps) {
  const { message } = App.useApp()
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      okButtonProps={{ danger }}
      cancelText="Назад"
      onConfirm={changeStatus}
    >
      <Button
        type={danger ? 'default' : 'primary'}
        danger={danger}
        loading={isSubmitting}
      >
        {action.buttonText}
      </Button>
    </Popconfirm>
  )
}
