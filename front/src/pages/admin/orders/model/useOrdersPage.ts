import { useEffect, useState } from 'react'

import {
  getOrders,
  type TOrderListItem,
  type TOrdersFilters,
} from '@/entities/order'
import type { TPaginatedResponse, TPaginationParams } from '@/shared/api'
import { getApiErrorMessage } from '@/shared/lib'

export const DEFAULT_PAGE_SIZE = 20

type TLoadResult = {
  key: string
  data?: TPaginatedResponse<TOrderListItem>
  error?: string
}

export function useOrdersPage() {
  const [pagination, setPagination] = useState<TPaginationParams>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  })
  const [filters, setFilters] = useState<TOrdersFilters>({})
  const [result, setResult] = useState<TLoadResult | null>(null)
  const [lastData, setLastData] = useState<
    TPaginatedResponse<TOrderListItem> | undefined
  >()

  const { page, pageSize } = pagination
  const requestKey = JSON.stringify({ page, pageSize, ...filters })

  useEffect(() => {
    let isCancelled = false

    getOrders({ page, pageSize, ...filters })
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
  }, [page, pageSize, filters, requestKey])

  const isLoading = result?.key !== requestKey

  return {
    orders: lastData?.items ?? [],
    totalCount: lastData?.totalCount ?? 0,
    page,
    pageSize,
    filters,
    isLoading,
    error: isLoading ? undefined : result?.error,
    changePage: (nextPage: number, nextPageSize: number) =>
      setPagination({
        page: nextPageSize === pageSize ? nextPage : 1,
        pageSize: nextPageSize,
      }),
    changeFilters: (nextFilters: TOrdersFilters) => {
      setFilters(nextFilters)
      setPagination((prev) => ({ ...prev, page: 1 }))
    },
  }
}
