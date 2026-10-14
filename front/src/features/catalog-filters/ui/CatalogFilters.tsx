import { Button, Checkbox, Flex, Input, InputNumber, Select } from 'antd'
import { useState } from 'react'

import { useCategoryOptions } from '@/entities/category'
import type { TProductsFilters } from '@/entities/product'

import styles from './catalogFilters.module.css'

type TCatalogFiltersProps = {
  value: TProductsFilters
  onChange: (next: TProductsFilters) => void
}

export function CatalogFilters({ value, onChange }: TCatalogFiltersProps) {
  const { options: categoryOptions, isLoading: isCategoriesLoading } =
    useCategoryOptions()

  const [search, setSearch] = useState(value.search ?? '')
  const [priceFrom, setPriceFrom] = useState<number | null>(
    value.priceFrom ?? null,
  )
  const [priceTo, setPriceTo] = useState<number | null>(value.priceTo ?? null)

  const applySearch = (text: string) => {
    const nextSearch = text.trim() || undefined

    if (nextSearch === value.search) return
    onChange({ ...value, search: nextSearch })
  }

  const applyPrice = () => {
    let from = priceFrom ?? undefined
    let to = priceTo ?? undefined

    if (from !== undefined && to !== undefined && from > to) {
      ;[from, to] = [to, from]
      setPriceFrom(from)
      setPriceTo(to)
    }

    if (from === value.priceFrom && to === value.priceTo) return
    onChange({ ...value, priceFrom: from, priceTo: to })
  }

  const reset = () => {
    setSearch('')
    setPriceFrom(null)
    setPriceTo(null)
    onChange({})
  }

  return (
    <Flex
      wrap
      gap="middle"
      align="center"
      className={styles['catalog-filters']}
    >
      <Input.Search
        className={styles['catalog-filters__search']}
        placeholder="Название или артикул"
        allowClear
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        onSearch={applySearch}
      />
      <Select
        className={styles['catalog-filters__category']}
        placeholder="Все категории"
        allowClear
        loading={isCategoriesLoading}
        options={categoryOptions}
        value={value.categoryId}
        onChange={(categoryId?: string) => onChange({ ...value, categoryId })}
      />
      <InputNumber
        placeholder="Цена от"
        min={0}
        suffix="₽"
        value={priceFrom}
        onChange={(next) => setPriceFrom(next)}
        onBlur={applyPrice}
        onPressEnter={applyPrice}
      />
      <InputNumber
        placeholder="Цена до"
        min={0}
        suffix="₽"
        value={priceTo}
        onChange={(next) => setPriceTo(next)}
        onBlur={applyPrice}
        onPressEnter={applyPrice}
      />
      <Checkbox
        checked={value.inStock ?? false}
        onChange={(event) =>
          onChange({ ...value, inStock: event.target.checked || undefined })
        }
      >
        Только в наличии
      </Checkbox>
      <Button onClick={reset}>Сбросить</Button>
    </Flex>
  )
}
