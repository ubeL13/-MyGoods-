import { App, Button, Popconfirm } from 'antd'

import { deleteCategory, type TCategory } from '@/entities/category'
import { getApiErrorMessage } from '@/shared/lib'

type TDeleteCategoryButtonProps = {
  category: TCategory
  onDeleted: () => void
}

export function DeleteCategoryButton({
  category,
  onDeleted,
}: TDeleteCategoryButtonProps) {
  const { message } = App.useApp()

  const handleConfirm = async () => {
    try {
      await deleteCategory(category.id)
      message.success(`Категория «${category.name}» удалена`)
      onDeleted()
    } catch (error) {
      message.error(getApiErrorMessage(error))
    }
  }

  return (
    <Popconfirm
      title="Удалить категорию?"
      description={`Категория «${category.name}» будет удалена без возможности восстановления.`}
      okText="Удалить"
      okButtonProps={{ danger: true }}
      cancelText="Отмена"
      onConfirm={handleConfirm}
    >
      <Button size="small" danger>
        Удалить
      </Button>
    </Popconfirm>
  )
}
