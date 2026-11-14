import { Alert, Flex, Form, Input, Modal } from 'antd'
import { useState } from 'react'

import {
  createSupplier,
  type TSupplier,
  type TSupplierFormValues,
  updateSupplier,
} from '@/entities/supplier'
import { getApiErrorMessage, isConflictError } from '@/shared/lib'

import styles from './supplierFormModal.module.css'

const INN_PATTERN = /^(\d{10}|\d{12})$/
const PHONE_PATTERN = /^\+?[\d\s()-]{10,20}$/

type TSupplierFormModalProps = {
  supplier?: TSupplier
  onSaved: (supplier: TSupplier) => void
  onCancel: () => void
}

export function SupplierFormModal({
  supplier,
  onSaved,
  onCancel,
}: TSupplierFormModalProps) {
  const [form] = Form.useForm<TSupplierFormValues>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>()

  const isEdit = Boolean(supplier)

  const handleFinish = async (values: TSupplierFormValues) => {
    setIsSubmitting(true)
    setError(undefined)

    try {
      const saved = supplier
        ? await updateSupplier(supplier.id, values)
        : await createSupplier(values)
      onSaved(saved)
    } catch (submitError) {
      const message = getApiErrorMessage(submitError)

      if (isConflictError(submitError)) {
        const field = message.includes('ИНН') ? 'inn' : 'name'
        form.setFields([{ name: field, errors: [message] }])
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
      width={640}
      title={isEdit ? 'Редактирование поставщика' : 'Новый поставщик'}
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
          className={styles['supplier-form__error']}
        />
      )}

      <Form<TSupplierFormValues>
        form={form}
        layout="vertical"
        initialValues={{
          name: supplier?.name ?? '',
          inn: supplier?.inn ?? '',
          contactPerson: supplier?.contactPerson ?? '',
          phone: supplier?.phone ?? '',
          email: supplier?.email ?? '',
          address: supplier?.address ?? '',
        }}
        onFinish={handleFinish}
        disabled={isSubmitting}
      >
        <Form.Item<TSupplierFormValues>
          label="Название"
          name="name"
          rules={[
            { required: true, whitespace: true, message: 'Введите название' },
            { max: 200, message: 'Не длиннее 200 символов' },
          ]}
        >
          <Input autoFocus placeholder="ООО «Поставщик»" />
        </Form.Item>

        <Flex gap="middle">
          <Form.Item<TSupplierFormValues>
            label="ИНН"
            name="inn"
            className={styles['supplier-form__grow']}
            rules={[
              {
                pattern: INN_PATTERN,
                message: '10 цифр для юрлица или 12 для ИП',
              },
            ]}
          >
            <Input placeholder="6312012345" />
          </Form.Item>
          <Form.Item<TSupplierFormValues>
            label="Контактное лицо"
            name="contactPerson"
            className={styles['supplier-form__grow']}
            rules={[{ max: 200, message: 'Не длиннее 200 символов' }]}
          >
            <Input />
          </Form.Item>
        </Flex>

        <Flex gap="middle">
          <Form.Item<TSupplierFormValues>
            label="Телефон"
            name="phone"
            className={styles['supplier-form__grow']}
            rules={[
              { required: true, message: 'Укажите телефон' },
              { pattern: PHONE_PATTERN, message: 'Пример: +7 846 200-10-10' },
            ]}
          >
            <Input placeholder="+7 846 200-10-10" />
          </Form.Item>
          <Form.Item<TSupplierFormValues>
            label="Email"
            name="email"
            className={styles['supplier-form__grow']}
            rules={[{ type: 'email', message: 'Неверный формат email' }]}
          >
            <Input />
          </Form.Item>
        </Flex>

        <Form.Item<TSupplierFormValues>
          label="Адрес"
          name="address"
          rules={[{ max: 500, message: 'Не длиннее 500 символов' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}
