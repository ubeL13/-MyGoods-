import { Alert, Flex, Form, Input, InputNumber, Modal, Select } from 'antd'
import { useState } from 'react'

import { ProductSelect, type TProductListItem } from '@/entities/product'
import {
  createWriteOff,
  type TWriteOff,
  type TWriteOffReason,
  WRITE_OFF_REASON_LABEL,
  WRITE_OFF_REASONS,
} from '@/entities/write-off'
import { getApiErrorMessage, isConflictError } from '@/shared/lib'

import styles from './writeOffFormModal.module.css'

type TWriteOffFormValues = {
  productId?: string
  quantity: number
  reason?: TWriteOffReason
  comment?: string
  createdBy: string
}

const INITIAL_VALUES: Partial<TWriteOffFormValues> = {
  quantity: 1,
  createdBy: '',
}

type TWriteOffFormModalProps = {
  onCreated: (writeOff: TWriteOff) => void
  onCancel: () => void
}

export function WriteOffFormModal({
  onCreated,
  onCancel,
}: TWriteOffFormModalProps) {
  const [form] = Form.useForm<TWriteOffFormValues>()
  const [product, setProduct] = useState<TProductListItem>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>()

  const reason = Form.useWatch('reason', form)

  const handleFinish = async (values: TWriteOffFormValues) => {
    setIsSubmitting(true)
    setError(undefined)

    try {
      const writeOff = await createWriteOff({
        productId: values.productId as string,
        quantity: values.quantity,
        reason: values.reason as TWriteOffReason,
        comment: values.comment?.trim() || null,
        createdBy: values.createdBy.trim(),
      })
      onCreated(writeOff)
    } catch (submitError) {
      const message = getApiErrorMessage(submitError)

      if (isConflictError(submitError)) {
        form.setFields([{ name: 'quantity', errors: [message] }])
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
      width={600}
      title="Новая заявка на списание"
      okText="Отправить на рассмотрение"
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
          className={styles['write-off-form__error']}
        />
      )}

      <Form<TWriteOffFormValues>
        form={form}
        layout="vertical"
        initialValues={INITIAL_VALUES}
        onFinish={handleFinish}
        disabled={isSubmitting}
      >
        <Form.Item<TWriteOffFormValues>
          label="Товар"
          name="productId"
          rules={[{ required: true, message: 'Выберите товар' }]}
          extra={
            product &&
            `На складе: ${product.quantity} шт., в резерве: ${product.reserved} шт., можно списать: ${product.available} шт.`
          }
        >
          <ProductSelect
            selectedProduct={product}
            takenIds={[]}
            onSelectProduct={setProduct}
            getDisabledReason={(item) =>
              item.available <= 0 ? 'Нет доступного остатка' : undefined
            }
          />
        </Form.Item>

        <Flex gap="middle">
          <Form.Item<TWriteOffFormValues>
            label="Количество"
            name="quantity"
            className={styles['write-off-form__grow']}
            dependencies={['productId']}
            rules={[
              { required: true, message: 'Укажите количество' },
              {
                validator: async (_, quantity?: number) => {
                  if (product && quantity && quantity > product.available) {
                    throw new Error(
                      product.reserved > 0
                        ? `Можно списать не больше ${product.available} шт.: ещё ${product.reserved} шт. в резерве под заказы`
                        : `Можно списать не больше ${product.available} шт.`,
                    )
                  }
                },
              },
            ]}
          >
            <InputNumber min={1} precision={0} suffix="шт." />
          </Form.Item>

          <Form.Item<TWriteOffFormValues>
            label="Причина"
            name="reason"
            className={styles['write-off-form__grow']}
            rules={[{ required: true, message: 'Выберите причину' }]}
          >
            <Select
              placeholder="Причина списания"
              options={WRITE_OFF_REASONS.map((value) => ({
                value,
                label: WRITE_OFF_REASON_LABEL[value],
              }))}
            />
          </Form.Item>
        </Flex>

        <Form.Item<TWriteOffFormValues>
          label="Комментарий"
          name="comment"
          dependencies={['reason']}
          rules={[
            {
              required: reason === 'Other',
              whitespace: true,
              message: 'Для причины «Другое» опишите, что случилось',
            },
            { max: 500, message: 'Не длиннее 500 символов' },
          ]}
        >
          <Input.TextArea
            autoSize={{ minRows: 2, maxRows: 4 }}
            placeholder={
              reason === 'Other' ? 'Обязательно для «Другое»' : 'Необязательно'
            }
          />
        </Form.Item>

        <Form.Item<TWriteOffFormValues>
          label="Кто оформил"
          name="createdBy"
          rules={[
            { required: true, whitespace: true, message: 'Укажите имя' },
            { max: 100, message: 'Не длиннее 100 символов' },
          ]}
        >
          <Input placeholder="Имя кладовщика" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
