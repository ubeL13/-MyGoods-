import { App, Button, Popconfirm } from 'antd'
import { useState } from 'react'

import { setSupplierArchived, type TSupplier } from '@/entities/supplier'
import { getApiErrorMessage } from '@/shared/lib'

type TArchiveSupplierButtonProps = {
  supplier: TSupplier
  onChange: (supplier: TSupplier) => void
}

export function ArchiveSupplierButton({
  supplier,
  onChange,
}: TArchiveSupplierButtonProps) {
  const { message } = App.useApp()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggle = async () => {
    setIsSubmitting(true)

    try {
      const updated = await setSupplierArchived(
        supplier.id,
        !supplier.isArchived,
      )
      onChange(updated)
      message.success(
        updated.isArchived
          ? `«${updated.name}» перенесён в архив`
          : `«${updated.name}» возвращён из архива`,
      )
    } catch (error) {
      message.error(getApiErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (supplier.isArchived) {
    return (
      <Button size="small" loading={isSubmitting} onClick={toggle}>
        Вернуть
      </Button>
    )
  }

  return (
    <Popconfirm
      title="Перенести поставщика в архив?"
      description="Он останется в истории поставок, но в новых поставках его выбрать будет нельзя."
      okText="В архив"
      cancelText="Отмена"
      onConfirm={toggle}
    >
      <Button size="small" danger loading={isSubmitting}>
        В архив
      </Button>
    </Popconfirm>
  )
}
