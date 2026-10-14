import { Alert, Form, Input, Modal, TreeSelect } from 'antd'
import { useState } from 'react'

import {
  buildCategoryTree,
  createCategory,
  type TCategory,
  type TCategoryFormValues,
  toCategoryTreeSelectData,
  updateCategory,
} from '@/entities/category'
import { getApiErrorMessage, isConflictError } from '@/shared/lib'

import styles from './categoryFormModal.module.css'

type TCategoryFormModalProps = {
  categories: TCategory[]
  category?: TCategory
  defaultParentId?: string | null
  onSaved: (category: TCategory) => void
  onCancel: () => void
}

export function CategoryFormModal({
  categories,
  category,
  defaultParentId = null,
  onSaved,
  onCancel,
}: TCategoryFormModalProps) {
  const [form] = Form.useForm<TCategoryFormValues>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>()

  const isEdit = Boolean(category)
  const parentTreeData = toCategoryTreeSelectData(
    buildCategoryTree(categories),
    category?.id,
  )

  const handleFinish = async (values: TCategoryFormValues) => {
    setIsSubmitting(true)
    setError(undefined)

    const payload: TCategoryFormValues = {
      name: values.name.trim(),
      description: (values.description ?? '').trim(),
      parentId: values.parentId ?? null,
    }

    try {
      const saved = category
        ? await updateCategory(category.id, payload)
        : await createCategory(payload)
      onSaved(saved)
    } catch (submitError) {
      const message = getApiErrorMessage(submitError)

      if (isConflictError(submitError)) {
        form.setFields([{ name: 'name', errors: [message] }])
      } else {
        setError(message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      open
      title={isEdit ? 'Редактирование категории' : 'Новая категория'}
      okText={isEdit ? 'Сохранить' : 'Создать'}
      cancelText="Отмена"
      confirmLoading={isSubmitting}
      onOk={() => form.submit()}
      onCancel={onCancel}
    >
      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          className={styles['category-form__error']}
        />
      )}

      <Form<TCategoryFormValues>
        form={form}
        layout="vertical"
        initialValues={{
          name: category?.name ?? '',
          description: category?.description ?? '',
          parentId: category ? category.parentId : defaultParentId,
        }}
        onFinish={handleFinish}
        disabled={isSubmitting}
      >
        <Form.Item<TCategoryFormValues>
          label="Название"
          name="name"
          rules={[
            { required: true, whitespace: true, message: 'Введите название' },
            { max: 100, message: 'Не длиннее 100 символов' },
          ]}
        >
          <Input autoFocus />
        </Form.Item>

        <Form.Item<TCategoryFormValues>
          label="Родительская категория"
          name="parentId"
        >
          <TreeSelect
            allowClear
            placeholder="Без родителя (верхний уровень)"
            treeData={parentTreeData}
            treeDefaultExpandAll
          />
        </Form.Item>

        <Form.Item<TCategoryFormValues>
          label="Описание"
          name="description"
          rules={[{ max: 500, message: 'Не длиннее 500 символов' }]}
        >
          <Input.TextArea rows={3} showCount maxLength={500} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
