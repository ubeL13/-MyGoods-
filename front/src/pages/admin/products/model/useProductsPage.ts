import { useEffect, useState } from 'react'

import { getProducts, type TProductListItem } from '@/entities/product'
import type { TPaginatedResponse, TPaginationParams } from '@/shared/api'
import { getApiErrorMessage } from '@/shared/lib'

export const DEFAULT_PAGE_SIZE = 20

type TLoadResult = {
  key: string
  data?: TPaginatedResponse<TProductListItem>
  error?: string
}

export function useProductsPage() {
  const [pagination, setPagination] = useState<TPaginationParams>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  })
  const [result, setResult] = useState<TLoadResult | null>(null)
  const [lastData, setLastData] = useState<
    TPaginatedResponse<TProductListItem> | undefined
  >()

  const { page, pageSize } = pagination
  const requestKey = `${page}:${pageSize}`

  useEffect(() => {
    let isCancelled = false

    getProducts({ page, pageSize })
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
  }, [page, pageSize, requestKey])

  const isLoading = result?.key !== requestKey

  return {
    products: lastData?.items ?? [],
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
  }
}
