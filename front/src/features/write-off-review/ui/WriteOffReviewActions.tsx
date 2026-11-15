import { App, Button, Flex, Form, Input, Modal, Popconfirm } from 'antd'
import { useState } from 'react'

import {
  approveWriteOff,
  rejectWriteOff,
  type TWriteOff,
} from '@/entities/write-off'
import { getApiErrorMessage } from '@/shared/lib'

type TWriteOffReviewActionsProps = {
  writeOff: TWriteOff
  onReviewed: (writeOff: TWriteOff) => void
}

type TRejectFormValues = {
  reason: string
}

export function WriteOffReviewActions({
  writeOff,
  onReviewed,
}: TWriteOffReviewActionsProps) {
  const { message } = App.useApp()
  const [form] = Form.useForm<TRejectFormValues>()
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [isRejectOpen, setIsRejectOpen] = useState(false)

  if (writeOff.status !== 'Pending') return null

  const handleApprove = async () => {
    setIsApproving(true)

    try {
      const updated = await approveWriteOff(writeOff.id)
      onReviewed(updated)
      message.success(
        `Заявка №${updated.number} одобрена, со склада списано ${updated.quantity} шт.`,
      )
    } catch (error) {
      message.error(getApiErrorMessage(error))
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async ({ reason }: TRejectFormValues) => {
    setIsRejecting(true)

    try {
      const updated = await rejectWriteOff(writeOff.id, reason.trim())
      onReviewed(updated)
      setIsRejectOpen(false)
      message.success(`Заявка №${updated.number} отклонена`)
    } catch (error) {
      message.error(getApiErrorMessage(error))
    } finally {
      setIsRejecting(false)
    }
  }

  return (
    <Flex gap="small" wrap>
      <Popconfirm
        title="Одобрить списание?"
        description={`Со склада будет списано ${writeOff.quantity} шт. «${writeOff.productName}». Отменить это будет нельзя.`}
        okText="Одобрить"
        cancelText="Назад"
        onConfirm={handleApprove}
      >
        <Button type="primary" loading={isApproving} disabled={isRejecting}>
          Одобрить
        </Button>
      </Popconfirm>

      <Button
        danger
        disabled={isApproving}
        onClick={() => setIsRejectOpen(true)}
      >
        Отклонить
      </Button>

      <Modal
        open={isRejectOpen}
        title={`Отклонить заявку №${writeOff.number}`}
        okText="Отклонить"
        okButtonProps={{ danger: true }}
        cancelText="Назад"
        confirmLoading={isRejecting}
        onOk={() => form.submit()}
        onCancel={() => setIsRejectOpen(false)}
        destroyOnHidden
      >
        <Form<TRejectFormValues>
          form={form}
          layout="vertical"
          onFinish={handleReject}
          disabled={isRejecting}
          preserve={false}
        >
          <Form.Item<TRejectFormValues>
            label="Причина отклонения"
            name="reason"
            extra="Кладовщик увидит её в карточке заявки."
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'Укажите причину отклонения',
              },
              { max: 500, message: 'Не длиннее 500 символов' },
            ]}
          >
            <Input.TextArea
              autoFocus
              autoSize={{ minRows: 3, maxRows: 6 }}
              placeholder="Например: вернуть поставщику по гарантии"
            />
          </Form.Item>
        </Form>
      </Modal>
    </Flex>
  )
}
