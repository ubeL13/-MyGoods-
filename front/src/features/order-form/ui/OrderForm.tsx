import {
  Alert,
  Button,
  Card,
  Flex,
  Form,
  Input,
  InputNumber,
  Segmented,
  Typography,
} from 'antd'
import { useState } from 'react'

import type { TCustomer } from '@/entities/customer'
import type { TOrderCreateValues } from '@/entities/order'
import type { TProductListItem } from '@/entities/product'
import { formatPrice, getApiErrorMessage, isConflictError } from '@/shared/lib'

import type { TOrderFormValues } from '../model/orderForm.types'

import { CustomerSelect } from './CustomerSelect'
import { ProductSelect } from './ProductSelect'

import styles from './orderForm.module.css'

const INITIAL_VALUES: Partial<TOrderFormValues> = {
  customerMode: 'existing',
  items: [{ quantity: 1 }],
}

const PHONE_PATTERN = /^\+?[\d\s()-]{10,20}$/

type TOrderFormProps = {
  onSubmit: (values: TOrderCreateValues) => Promise<void>
  onCancel: () => void
}

function toCreateValues(values: TOrderFormValues): TOrderCreateValues {
  const isNew = values.customerMode === 'new'

  return {
    customerId: isNew ? null : (values.customerId ?? null),
    newCustomer:
      isNew && values.newCustomer
        ? {
            name: values.newCustomer.name.trim(),
            phone: values.newCustomer.phone.trim(),
            email: values.newCustomer.email?.trim() || null,
          }
        : null,
    deliveryAddress: values.deliveryAddress.trim(),
    items: values.items.map((item) => ({
      productId: item.productId as string,
      quantity: item.quantity,
    })),
  }
}

export function OrderForm({ onSubmit, onCancel }: TOrderFormProps) {
  const [form] = Form.useForm<TOrderFormValues>()
  const [products, setProducts] = useState<Record<string, TProductListItem>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>()

  const customerMode = Form.useWatch('customerMode', form)
  const items = Form.useWatch('items', form) ?? []

  const takenIds = items
    .map((item) => item?.productId)
    .filter((id): id is string => Boolean(id))

  const total = items.reduce((sum, item) => {
    const product = item?.productId ? products[item.productId] : undefined
    return product ? sum + product.price * (item.quantity ?? 0) : sum
  }, 0)

  const rememberProduct = (product: TProductListItem) => {
    setProducts((prev) => ({ ...prev, [product.id]: product }))
  }

  const handleSelectCustomer = (customer: TCustomer) => {
    if (customer.address && !form.getFieldValue('deliveryAddress')) {
      form.setFieldValue('deliveryAddress', customer.address)
    }
  }

  const handleFinish = async (values: TOrderFormValues) => {
    setIsSubmitting(true)
    setError(undefined)

    try {
      await onSubmit(toCreateValues(values))
    } catch (submitError) {
      const message = getApiErrorMessage(submitError)

      if (
        isConflictError(submitError) &&
        values.customerMode === 'new' &&
        message.toLowerCase().includes('телефон')
      ) {
        form.setFields([{ name: ['newCustomer', 'phone'], errors: [message] }])
      } else {
        setError(message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form<TOrderFormValues>
      form={form}
      layout="vertical"
      initialValues={INITIAL_VALUES}
      onFinish={handleFinish}
      disabled={isSubmitting}
      className={styles['order-form']}
    >
      {error && <Alert type="error" message={error} showIcon />}

      <Card title="Покупатель">
        <Form.Item<TOrderFormValues> name="customerMode">
          <Segmented
            options={[
              { label: 'Выбрать существующего', value: 'existing' },
              { label: 'Новый покупатель', value: 'new' },
            ]}
          />
        </Form.Item>

        {customerMode === 'new' ? (
          <>
            <Form.Item
              label="Имя или наименование"
              name={['newCustomer', 'name']}
              rules={[
                { required: true, whitespace: true, message: 'Укажите имя' },
                { max: 200, message: 'Не длиннее 200 символов' },
              ]}
            >
              <Input />
            </Form.Item>
            <Flex gap="middle">
              <Form.Item
                label="Телефон"
                name={['newCustomer', 'phone']}
                className={styles['order-form__grow']}
                rules={[
                  { required: true, message: 'Укажите телефон' },
                  {
                    pattern: PHONE_PATTERN,
                    message: 'Пример: +7 999 123-45-67',
                  },
                ]}
              >
                <Input placeholder="+7 999 123-45-67" />
              </Form.Item>
              <Form.Item
                label="Email"
                name={['newCustomer', 'email']}
                className={styles['order-form__grow']}
                rules={[{ type: 'email', message: 'Неверный формат email' }]}
              >
                <Input />
              </Form.Item>
            </Flex>
          </>
        ) : (
          <Form.Item<TOrderFormValues>
            label="Покупатель"
            name="customerId"
            rules={[{ required: true, message: 'Выберите покупателя' }]}
          >
            <CustomerSelect onSelectCustomer={handleSelectCustomer} />
          </Form.Item>
        )}

        <Form.Item<TOrderFormValues>
          label="Адрес доставки"
          name="deliveryAddress"
          rules={[
            { required: true, whitespace: true, message: 'Укажите адрес' },
            { max: 500, message: 'Не длиннее 500 символов' },
          ]}
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
                  <div key={field.key} className={styles['order-form__item']}>
                    <Form.Item
                      name={[field.name, 'productId']}
                      className={styles['order-form__product']}
                      rules={[{ required: true, message: 'Выберите товар' }]}
                      extra={product && `Доступно: ${product.available} шт.`}
                    >
                      <ProductSelect
                        selectedProduct={product}
                        takenIds={takenIds}
                        onSelectProduct={rememberProduct}
                      />
                    </Form.Item>

                    <Form.Item
                      name={[field.name, 'quantity']}
                      dependencies={[['items', field.name, 'productId']]}
                      rules={[
                        { required: true, message: 'Укажите количество' },
                        {
                          validator: async (_, quantity?: number) => {
                            if (
                              product &&
                              quantity &&
                              quantity > product.available
                            ) {
                              throw new Error(
                                `Доступно только ${product.available} шт.`,
                              )
                            }
                          },
                        },
                      ]}
                    >
                      <InputNumber min={1} precision={0} suffix="шт." />
                    </Form.Item>

                    <span className={styles['order-form__sum']}>
                      {product
                        ? formatPrice(product.price * (item?.quantity ?? 0))
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

        <Flex justify="flex-end" className={styles['order-form__total']}>
          <Typography.Title level={4}>
            Итого: {formatPrice(total)}
          </Typography.Title>
        </Flex>
      </Card>

      <Flex gap="small">
        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          Создать заказ
        </Button>
        <Button onClick={onCancel}>Отмена</Button>
      </Flex>
    </Form>
  )
}
