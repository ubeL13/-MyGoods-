import { Alert, Button, Flex, Form, Input, InputNumber, Select } from 'antd'
import { useState } from 'react'

import { useCategoryOptions } from '@/entities/category'
import type { TProductFormValues } from '@/entities/product'
import { getApiErrorMessage, isConflictError } from '@/shared/lib'

import styles from './productForm.module.css'

const EMPTY_VALUES: Partial<TProductFormValues> = {
  description: '',
  manufacturer: '',
  min: 0,
}

type TProductFormProps = {
  initialValues?: TProductFormValues
  submitText: string
  onSubmit: (values: TProductFormValues) => Promise<void>
  onCancel: () => void
}

export function ProductForm({
  initialValues,
  submitText,
  onSubmit,
  onCancel,
}: TProductFormProps) {
  const [form] = Form.useForm<TProductFormValues>()
  const { options: categoryOptions, isLoading: isCategoriesLoading } =
    useCategoryOptions()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>()

  const handleFinish = async (values: TProductFormValues) => {
    setIsSubmitting(true)
    setError(undefined)

    try {
      await onSubmit({
        ...values,
        sku: values.sku.trim(),
        name: values.name.trim(),
        description: (values.description ?? '').trim(),
        manufacturer: (values.manufacturer ?? '').trim(),
      })
    } catch (submitError) {
      const message = getApiErrorMessage(submitError)

      if (isConflictError(submitError)) {
        form.setFields([{ name: 'sku', errors: [message] }])
      } else {
        setError(message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form<TProductFormValues>
      form={form}
      layout="vertical"
      initialValues={initialValues ?? EMPTY_VALUES}
      onFinish={handleFinish}
      disabled={isSubmitting}
      className={styles['product-form']}
    >
      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          className={styles['product-form__error']}
        />
      )}

      <Form.Item<TProductFormValues>
        label="Название"
        name="name"
        rules={[
          { required: true, whitespace: true, message: 'Введите название' },
          { max: 200, message: 'Не длиннее 200 символов' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item<TProductFormValues>
        label="Артикул"
        name="sku"
        rules={[
          { required: true, whitespace: true, message: 'Введите артикул' },
          { max: 50, message: 'Не длиннее 50 символов' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item<TProductFormValues>
        label="Категория"
        name="categoryId"
        rules={[{ required: true, message: 'Выберите категорию' }]}
      >
        <Select
          placeholder="Выберите категорию"
          options={categoryOptions}
          loading={isCategoriesLoading}
        />
      </Form.Item>

      <Flex gap="middle" wrap>
        <Form.Item<TProductFormValues>
          label="Цена"
          name="price"
          rules={[
            { required: true, message: 'Укажите цену' },
            { type: 'number', min: 0.01, message: 'Цена должна быть больше 0' },
          ]}
        >
          <InputNumber
            min={0}
            precision={2}
            suffix="₽"
            className={styles['product-form__number']}
          />
        </Form.Item>

        <Form.Item<TProductFormValues>
          label="Минимальный остаток"
          name="min"
          tooltip="Когда на складе останется столько штук или меньше, товар получит статус «Заканчивается»"
          rules={[{ required: true, message: 'Укажите минимальный остаток' }]}
        >
          <InputNumber
            min={0}
            precision={0}
            suffix="шт."
            className={styles['product-form__number']}
          />
        </Form.Item>
      </Flex>

      <Form.Item<TProductFormValues>
        label="Производитель"
        name="manufacturer"
        rules={[{ max: 100, message: 'Не длиннее 100 символов' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<TProductFormValues>
        label="Описание"
        name="description"
        rules={[{ max: 1000, message: 'Не длиннее 1000 символов' }]}
      >
        <Input.TextArea rows={4} showCount maxLength={1000} />
      </Form.Item>

      <Flex gap="small">
        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          {submitText}
        </Button>
        <Button onClick={onCancel}>Отмена</Button>
      </Flex>
    </Form>
  )
}
