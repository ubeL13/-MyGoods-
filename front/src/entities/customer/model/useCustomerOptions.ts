import { useEffect, useState } from 'react'

import { searchCustomers } from '../api/customer.service'

import type { TCustomer } from './customer.types'

export function useCustomerOptions(search: string) {
  const [customers, setCustomers] = useState<TCustomer[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let isCancelled = false

    const timerId = setTimeout(async () => {
      setIsLoading(true)

      try {
        const data = await searchCustomers(search.trim())
        if (!isCancelled) setCustomers(data)
      } catch {
        if (!isCancelled) setCustomers([])
      } finally {
        if (!isCancelled) setIsLoading(false)
      }
    }, 300)

    return () => {
      isCancelled = true
      clearTimeout(timerId)
    }
  }, [search])

  return { customers, isLoading }
}
