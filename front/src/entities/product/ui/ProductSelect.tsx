import { Flex, Select, Typography } from 'antd'
import { useState } from 'react'

import { formatPrice } from '@/shared/lib'

import type { TProductListItem } from '../model/product.types'
import { useProductOptions } from '../model/useProductOptions'

import styles from './productSelect.module.css'

type TProductSelectProps = {
  value?: string
  onChange?: (value: string) => void
  selectedProduct?: TProductListItem
  takenIds: string[]
  onSelectProduct: (product: TProductListItem) => void
  getDisabledReason?: (product: TProductListItem) => string | undefined
}

export function ProductSelect({
  value,
  onChange,
  selectedProduct,
  takenIds,
  onSelectProduct,
  getDisabledReason,
}: TProductSelectProps) {
  const [search, setSearch] = useState('')
  const { products, isLoading } = useProductOptions(search)

  const list =
    selectedProduct &&
    !products.some((product) => product.id === selectedProduct.id)
      ? [selectedProduct, ...products]
      : products

  const reasonOf = (product: TProductListItem) => {
    if (!product.isActive) return 'Снят с продажи'
    if (product.id !== value && takenIds.includes(product.id)) {
      return 'Уже добавлен в другую строку'
    }
    return getDisabledReason?.(product)
  }

  const handleChange = (productId: string) => {
    const product = list.find((item) => item.id === productId)
    if (product) onSelectProduct(product)
    onChange?.(productId)
  }

  return (
    <Select
      value={value}
      onChange={handleChange}
      showSearch={{ filterOption: false, onSearch: setSearch }}
      loading={isLoading}
      placeholder="Название или артикул"
      notFoundContent={isLoading ? 'Загрузка…' : 'Товар не найден'}
      options={list.map((product) => {
        const reason = reasonOf(product)

        return {
          value: product.id,
          label: `${product.name} · ${product.sku} · ${formatPrice(product.price)}`,
          title: reason,
          disabled: Boolean(reason),
          reason,
        }
      })}
      optionRender={(option) => (
        <Flex
          justify="space-between"
          gap="small"
          className={styles['product-select__option']}
        >
          <Typography.Text ellipsis disabled={Boolean(option.data.reason)}>
            {option.label}
          </Typography.Text>
          {option.data.reason && (
            <Typography.Text
              type="secondary"
              className={styles['product-select__reason']}
            >
              {option.data.reason}
            </Typography.Text>
          )}
        </Flex>
      )}
    />
  )
}
