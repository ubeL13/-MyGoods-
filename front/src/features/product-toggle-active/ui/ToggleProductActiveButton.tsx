import { App, Button, Popconfirm } from 'antd'
import { useState } from 'react'

import { setProductActive, type TProductDetail } from '@/entities/product'
import { getApiErrorMessage } from '@/shared/lib'

type TToggleProductActiveButtonProps = {
  productId: string
  isActive: boolean
  onChange: (product: TProductDetail) => void
}

export function ToggleProductActiveButton({
  productId,
  isActive,
  onChange,
}: TToggleProductActiveButtonProps) {
  const { message } = App.useApp()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggle = async () => {
    setIsSubmitting(true)

    try {
      const product = await setProductActive(productId, !isActive)
      onChange(product)
      message.success(
        product.isActive ? 'Товар возвращён в продажу' : 'Товар снят с продажи',
      )
    } catch (error) {
      message.error(getApiErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isActive) {
    return (
      <Button loading={isSubmitting} onClick={toggle}>
        Вернуть в продажу
      </Button>
    )
  }

  return (
    <Popconfirm
      title="Снять товар с продажи?"
      description="Товар останется в каталоге, но его нельзя будет добавить в новый заказ."
      okText="Снять"
      cancelText="Отмена"
      onConfirm={toggle}
    >
      <Button danger loading={isSubmitting}>
        Снять с продажи
      </Button>
    </Popconfirm>
  )
}
