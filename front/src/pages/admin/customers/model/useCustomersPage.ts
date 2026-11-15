import { useEffect, useState } from 'react'

import { getCustomers, type TCustomer } from '@/entities/customer'
import type { TPaginatedResponse, TPaginationParams } from '@/shared/api'
import { getApiErrorMessage } from '@/shared/lib'

export const DEFAULT_PAGE_SIZE = 20

type TLoadResult = {
  key: string
  data?: TPaginatedResponse<TCustomer>
  error?: string
}

export function useCustomersPage() {
  const [pagination, setPagination] = useState<TPaginationParams>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  })
  const [search, setSearch] = useState<string>()
  const [result, setResult] = useState<TLoadResult | null>(null)
  const [lastData, setLastData] = useState<
    TPaginatedResponse<TCustomer> | undefined
  >()

  const { page, pageSize } = pagination
  const requestKey = JSON.stringify({ page, pageSize, search })

  useEffect(() => {
    let isCancelled = false

    getCustomers({ page, pageSize, search })
      .then((data) => {
        if (isCancelled) return
        setResult({ key: requestKey, data })
        setLastData(data)
      })
      .catch((error: unknown) => {
        if (isCancelled) return
        setResult({ key: requestKey, error: getApiErrorMessage(error) })
      })

    return () => {
      isCancelled = true
    }
  }, [page, pageSize, search, requestKey])

  const isLoading = result?.key !== requestKey

  return {
    customers: lastData?.items ?? [],
    totalCount: lastData?.totalCount ?? 0,
    page,
    pageSize,
    isLoading,
    error: isLoading ? undefined : result?.error,
    changePage: (nextPage: number, nextPageSize: number) =>
      setPagination({
        page: nextPageSize === pageSize ? nextPage : 1,
        pageSize: nextPageSize,
      }),
    changeSearch: (nextSearch: string) => {
      setSearch(nextSearch.trim() || undefined)
      setPagination((prev) => ({ ...prev, page: 1 }))
    },
  }
}
