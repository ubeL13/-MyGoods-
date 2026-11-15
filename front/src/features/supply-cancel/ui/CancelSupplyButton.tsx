import { App, Button, Popconfirm } from 'antd'
import { useState } from 'react'

import { cancelSupply, type TSupply } from '@/entities/supply'
import { getApiErrorMessage } from '@/shared/lib'

type TCancelSupplyButtonProps = {
  supply: TSupply
  onCancelled: (supply: TSupply) => void
}

export function CancelSupplyButton({
  supply,
  onCancelled,
}: TCancelSupplyButtonProps) {
  const { message } = App.useApp()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCancel = async () => {
    setIsSubmitting(true)

    try {
      const updated = await cancelSupply(supply.id)
      onCancelled(updated)
      message.success(`Поставка №${updated.number} отменена`)
    } catch (error) {
      message.error(getApiErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Popconfirm
      title="Отменить поставку?"
      description="Остатки на складе не изменятся. Вернуть поставку в работу будет нельзя."
      okText="Отменить поставку"
      okButtonProps={{ danger: true }}
      cancelText="Назад"
      onConfirm={handleCancel}
    >
      <Button danger loading={isSubmitting}>
        Отменить поставку
      </Button>
    </Popconfirm>
  )
}
