import {
  Alert,
  Button,
  Card,
  Descriptions,
  Flex,
  Result,
  Skeleton,
  Statistic,
  Tag,
  Typography,
} from 'antd'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { StockStatusTag, useProductDetail } from '@/entities/product'
import { ToggleProductActiveButton } from '@/features/product-toggle-active'
import { APP_ROUTES } from '@/shared/config/routes'
import { formatDateTime, formatPrice } from '@/shared/lib'

import styles from './productDetailPage.module.css'

export function ProductDetailPage() {
  const { productId = '' } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const { product, isLoading, error, isNotFound, replaceProduct } =
    useProductDetail(productId)

  if (isNotFound) {
    return (
      <Result
        status="404"
        title="Товар не найден"
        subTitle="Возможно, ссылка устарела или товар был удалён."
        extra={
          <Button type="primary" onClick={() => navigate(APP_ROUTES.products)}>
            К каталогу
          </Button>
        }
      />
    )
  }

  return (
    <section>
      <Link to={APP_ROUTES.products} className={styles['product-detail__back']}>
        ← К каталогу
      </Link>

      {isLoading && <Skeleton active paragraph={{ rows: 8 }} />}

      {error && <Alert type="error" message={error} showIcon />}

      {product && (
        <>
          <Flex
            align="center"
            gap="small"
            wrap
            className={styles['product-detail__header']}
          >
            <Typography.Title
              level={2}
              className={styles['product-detail__title']}
            >
              {product.name}
            </Typography.Title>
            {!product.isActive && <Tag>Снят с продажи</Tag>}
            <Button
              onClick={() => navigate(APP_ROUTES.productEdit(product.id))}
            >
              Редактировать
            </Button>
            <ToggleProductActiveButton
              productId={product.id}
              isActive={product.isActive}
              onChange={replaceProduct}
            />
          </Flex>

          <Card
            title="Остаток на складе"
            className={styles['product-detail__card']}
          >
            <Flex gap="large" wrap align="center">
              <Statistic
                title="На складе"
                value={product.quantity}
                suffix="шт."
              />
              <Statistic
                title="Минимальный остаток"
                value={product.min}
                suffix="шт."
              />
              <div>
                <div className={styles['product-detail__label']}>Статус</div>
                <StockStatusTag status={product.stockStatus} />
              </div>
            </Flex>
          </Card>

          <Card
            title="Информация о товаре"
            className={styles['product-detail__card']}
          >
            <Descriptions
              column={1}
              bordered
              size="small"
              items={[
                { key: 'sku', label: 'Артикул', children: product.sku },
                {
                  key: 'price',
                  label: 'Цена',
                  children: formatPrice(product.price),
                },
                {
                  key: 'category',
                  label: 'Категория',
                  children: product.categoryName,
                },
                {
                  key: 'manufacturer',
                  label: 'Производитель',
                  children: product.manufacturer || '—',
                },
                {
                  key: 'description',
                  label: 'Описание',
                  children: product.description || '—',
                },
                {
                  key: 'createdAt',
                  label: 'Добавлен',
                  children: formatDateTime(product.createdAt),
                },
                {
                  key: 'updatedAt',
                  label: 'Изменён',
                  children: formatDateTime(product.updatedAt),
                },
              ]}
            />
          </Card>
        </>
      )}
    </section>
  )
}
