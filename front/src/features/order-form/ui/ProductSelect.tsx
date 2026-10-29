import { Select } from 'antd'
import { useState } from 'react'

import type { TProductListItem } from '@/entities/product'
import { formatPrice } from '@/shared/lib'

import { useProductOptions } from '../model/useProductOptions'

type TProductSelectProps = {
  value?: string
  onChange?: (value: string) => void
  selectedProduct?: TProductListItem
  takenIds: string[]
  onSelectProduct: (product: TProductListItem) => void
}

export function ProductSelect({
  value,
  onChange,
  selectedProduct,
  takenIds,
  onSelectProduct,
}: TProductSelectProps) {
  const [search, setSearch] = useState('')
  const { products, isLoading } = useProductOptions(search)

  const list =
    selectedProduct &&
    !products.some((product) => product.id === selectedProduct.id)
      ? [selectedProduct, ...products]
      : products

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
      options={list.map((product) => ({
        value: product.id,
        label: `${product.name} · ${product.sku} · ${formatPrice(product.price)}`,
        disabled:
          !product.isActive ||
          product.quantity === 0 ||
          (product.id !== value && takenIds.includes(product.id)),
      }))}
    />
  )
}
