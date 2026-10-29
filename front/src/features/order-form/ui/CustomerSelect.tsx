import { Select } from 'antd'
import { useState } from 'react'

import { type TCustomer, useCustomerOptions } from '@/entities/customer'
import { formatPhone } from '@/shared/lib'

type TCustomerSelectProps = {
  value?: string
  onChange?: (value: string) => void
  onSelectCustomer?: (customer: TCustomer) => void
}

export function CustomerSelect({
  value,
  onChange,
  onSelectCustomer,
}: TCustomerSelectProps) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<TCustomer>()
  const { customers, isLoading } = useCustomerOptions(search)

  const list =
    selected && !customers.some((customer) => customer.id === selected.id)
      ? [selected, ...customers]
      : customers

  const handleChange = (customerId: string) => {
    const customer = list.find((item) => item.id === customerId)

    if (customer) {
      setSelected(customer)
      onSelectCustomer?.(customer)
    }

    onChange?.(customerId)
  }

  return (
    <Select
      value={value}
      onChange={handleChange}
      showSearch={{ filterOption: false, onSearch: setSearch }}
      loading={isLoading}
      placeholder="Имя или телефон покупателя"
      notFoundContent={isLoading ? 'Загрузка…' : 'Покупатель не найден'}
      options={list.map((customer) => ({
        value: customer.id,
        label: `${customer.name} · ${formatPhone(customer.phone)}`,
      }))}
    />
  )
}
