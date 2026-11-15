import {
  Alert,
  Button,
  Card,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'

import { ProductSelect, type TProductListItem } from '@/entities/product'
import { SupplierSelect } from '@/entities/supplier'
import type { TSupplyCreateValues } from '@/entities/supply'
import { formatPrice, getApiErrorMessage } from '@/shared/lib'

import type { TSupplyFormValues } from '../model/supplyForm.types'

import styles from './supplyForm.module.css'

const INITIAL_VALUES: Partial<TSupplyFormValues> = {
  items: [{ quantity: 1 }],
}

type TSupplyFormProps = {
  onSubmit: (values: TSupplyCreateValues) => Promise<void>
  onCancel: () => void
}

function toCreateValues(values: TSupplyFormValues): TSupplyCreateValues {
  return {
    supplierId: values.supplierId as string,
    expectedDate: values.expectedDate?.format('YYYY-MM-DD') ?? null,
    comment: values.comment?.trim() || null,
    items: values.items.map((item) => ({
      productId: item.productId as string,
      quantity: item.quantity,
      purchasePrice: item.purchasePrice ?? 0,
    })),
  }
}

export function SupplyForm({ onSubmit, onCancel }: TSupplyFormProps) {
  const [form] = Form.useForm<TSupplyFormValues>()
  const [products, setProducts] = useState<Record<string, TProductListItem>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>()

  const items = Form.useWatch('items', form) ?? []

  const takenIds = items
    .map((item) => item?.productId)
    .filter((id): id is string => Boolean(id))

  const total = items.reduce(
    (sum, item) => sum + (item?.purchasePrice ?? 0) * (item?.quantity ?? 0),
    0,
  )

  const rememberProduct = (product: TProductListItem) => {
    setProducts((prev) => ({ ...prev, [product.id]: product }))
  }

  const handleFinish = async (values: TSupplyFormValues) => {
    setIsSubmitting(true)
    setError(undefined)

    try {
      await onSubmit(toCreateValues(values))
    } catch (submitError) {
      setError(getApiErrorMessage(submitError))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form<TSupplyFormValues>
      form={form}
      layout="vertical"
      initialValues={INITIAL_VALUES}
      onFinish={handleFinish}
      disabled={isSubmitting}
      className={styles['supply-form']}
    >
      {error && <Alert type="error" message={error} showIcon />}

      <Card title="Поставщик">
        <Flex gap="middle" wrap>
          <Form.Item<TSupplyFormValues>
            label="Поставщик"
            name="supplierId"
            className={styles['supply-form__grow']}
            rules={[{ required: true, message: 'Выберите поставщика' }]}
          >
            <SupplierSelect />
          </Form.Item>
          <Form.Item<TSupplyFormValues>
            label="Ожидаемая дата поставки"
            name="expectedDate"
          >
            <DatePicker
              format="DD.MM.YYYY"
              disabledDate={(date) => date.isBefore(dayjs(), 'day')}
            />
          </Form.Item>
        </Flex>

        <Form.Item<TSupplyFormValues>
          label="Комментарий"
          name="comment"
          rules={[{ max: 500, message: 'Не длиннее 500 символов' }]}
        >
          <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
        </Form.Item>
      </Card>

      <Card title="Товары">
        <Form.List
          name="items"
          rules={[
            {
              validator: async (_, value?: unknown[]) => {
                if (!value?.length) {
                  throw new Error('Добавьте хотя бы один товар')
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field) => {
                const item = items[field.name]
                const product = item?.productId
                  ? products[item.productId]
                  : undefined

                return (
                  <div key={field.key} className={styles['supply-form__item']}>
                    <Form.Item
                      label="Товар"
                      name={[field.name, 'productId']}
                      className={styles['supply-form__product']}
                      rules={[{ required: true, message: 'Выберите товар' }]}
                      extra={
                        product &&
                        `На складе: ${product.quantity} шт., продажа ${formatPrice(product.price)}`
                      }
                    >
                      <ProductSelect
                        selectedProduct={product}
                        takenIds={takenIds}
                        onSelectProduct={rememberProduct}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Количество"
                      name={[field.name, 'quantity']}
                      rules={[
                        { required: true, message: 'Укажите количество' },
                      ]}
                    >
                      <InputNumber
                        min={1}
                        max={100000}
                        precision={0}
                        suffix="шт."
                      />
                    </Form.Item>

                    <Form.Item
                      label="Закупочная цена"
                      name={[field.name, 'purchasePrice']}
                      rules={[{ required: true, message: 'Укажите цену' }]}
                    >
                      <InputNumber
                        min={0.01}
                        precision={2}
                        suffix="₽"
                        placeholder="0,00"
                      />
                    </Form.Item>

                    <span className={styles['supply-form__sum']}>
                      {item?.purchasePrice
                        ? formatPrice(item.purchasePrice * (item.quantity ?? 0))
                        : '—'}
                    </span>

                    <Button
                      type="text"
                      danger
                      disabled={fields.length === 1}
                      onClick={() => remove(field.name)}
                    >
                      Удалить
                    </Button>
                  </div>
                )
              })}

              <Form.ErrorList errors={errors} />

              <Button type="dashed" block onClick={() => add({ quantity: 1 })}>
                Добавить товар
              </Button>
            </>
          )}
        </Form.List>

        <Flex justify="flex-end" className={styles['supply-form__total']}>
          <Typography.Title level={4}>
            Итого по закупке: {formatPrice(total)}
          </Typography.Title>
        </Flex>
      </Card>

      <Flex gap="small">
        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          Оформить поставку
        </Button>
        <Button onClick={onCancel}>Отмена</Button>
      </Flex>
    </Form>
  )
}
