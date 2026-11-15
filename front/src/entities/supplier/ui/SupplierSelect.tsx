import { Select } from 'antd'
import { useState } from 'react'

import type { TSupplier } from '../model/supplier.types'
import { useSupplierOptions } from '../model/useSupplierOptions'

type TSupplierSelectProps = {
  value?: string
  onChange?: (value: string) => void
}

export function SupplierSelect({ value, onChange }: TSupplierSelectProps) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<TSupplier>()
  const { suppliers, isLoading } = useSupplierOptions(search)

  const list =
    selected && !suppliers.some((supplier) => supplier.id === selected.id)
      ? [selected, ...suppliers]
      : suppliers

  const handleChange = (supplierId: string) => {
    setSelected(list.find((item) => item.id === supplierId))
    onChange?.(supplierId)
  }

  return (
    <Select
      value={value}
      onChange={handleChange}
      showSearch={{ filterOption: false, onSearch: setSearch }}
      loading={isLoading}
      placeholder="Название или ИНН поставщика"
      notFoundContent={isLoading ? 'Загрузка…' : 'Поставщик не найден'}
      options={list.map((supplier) => ({
        value: supplier.id,
        label: supplier.inn
          ? `${supplier.name} · ИНН ${supplier.inn}`
          : supplier.name,
      }))}
    />
  )
}
