import {
  Alert,
  Button,
  Card,
  Descriptions,
  Flex,
  Result,
  Skeleton,
  Typography,
} from 'antd'
import { Link, useNavigate, useParams } from 'react-router-dom'

import {
  useWriteOffDetail,
  WRITE_OFF_REASON_LABEL,
  WriteOffStatusTag,
} from '@/entities/write-off'
import { WriteOffReviewActions } from '@/features/write-off-review'
import { APP_ROUTES } from '@/shared/config/routes'
import { formatDateTime } from '@/shared/lib'

import styles from './writeOffDetailPage.module.css'

export function WriteOffDetailPage() {
  const { writeOffId = '' } = useParams<{ writeOffId: string }>()
  const navigate = useNavigate()
  const { writeOff, isLoading, error, isNotFound, replaceWriteOff } =
    useWriteOffDetail(writeOffId)

  if (isNotFound) {
    return (
      <Result
        status="404"
        title="Заявка не найдена"
        subTitle="Возможно, ссылка устарела."
        extra={
          <Button type="primary" onClick={() => navigate(APP_ROUTES.writeOffs)}>
            К списаниям
          </Button>
        }
      />
    )
  }

  return (
    <section>
      <Link
        to={APP_ROUTES.writeOffs}
        className={styles['write-off-detail__back']}
      >
        ← К списаниям
      </Link>

      {isLoading && <Skeleton active paragraph={{ rows: 8 }} />}

      {error && <Alert type="error" title={error} showIcon />}

      {writeOff && (
        <>
          <Flex
            align="center"
            gap="small"
            wrap
            className={styles['write-off-detail__header']}
          >
            <Typography.Title
              level={2}
              className={styles['write-off-detail__title']}
            >
              Заявка на списание №{writeOff.number}
            </Typography.Title>
            <WriteOffStatusTag status={writeOff.status} />
            <WriteOffReviewActions
              writeOff={writeOff}
              onReviewed={replaceWriteOff}
            />
          </Flex>

          {writeOff.status === 'Rejected' && (
            <Alert
              type="error"
              showIcon
              title="Заявка отклонена"
              description={writeOff.rejectionReason || 'Причина не указана'}
              className={styles['write-off-detail__card']}
            />
          )}

          {writeOff.status === 'Approved' && (
            <Alert
              type="success"
              showIcon
              title={`Списано со склада: ${writeOff.quantity} шт.`}
              className={styles['write-off-detail__card']}
            />
          )}

          <Card title="Заявка" className={styles['write-off-detail__card']}>
            <Descriptions
              column={1}
              bordered
              size="small"
              items={[
                {
                  key: 'product',
                  label: 'Товар',
                  children: (
                    <Link to={APP_ROUTES.productDetail(writeOff.productId)}>
                      {writeOff.productName || writeOff.sku}
                    </Link>
                  ),
                },
                { key: 'sku', label: 'Артикул', children: writeOff.sku || '—' },
                {
                  key: 'quantity',
                  label: 'Количество',
                  children: `${writeOff.quantity} шт.`,
                },
                {
                  key: 'reason',
                  label: 'Причина',
                  children: WRITE_OFF_REASON_LABEL[writeOff.reason],
                },
                {
                  key: 'comment',
                  label: 'Комментарий',
                  children: writeOff.comment || '—',
                },
                {
                  key: 'createdBy',
                  label: 'Кто оформил',
                  children: writeOff.createdBy,
                },
                {
                  key: 'createdAt',
                  label: 'Оформлена',
                  children: formatDateTime(writeOff.createdAt),
                },
                {
                  key: 'reviewedAt',
                  label: 'Рассмотрена',
                  children: writeOff.reviewedAt
                    ? formatDateTime(writeOff.reviewedAt)
                    : '—',
                },
              ]}
            />
          </Card>
        </>
      )}
    </section>
  )
}
