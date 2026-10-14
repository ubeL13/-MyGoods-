import { useEffect, useState } from 'react'

import { getCategories } from '../api/category.service'
import type { TCategory } from './category.types'

type TCategoryOption = {
  value: string
  label: string
}

export function useCategoryOptions() {
  const [options, setOptions] = useState<TCategoryOption[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isCancelled = false

    getCategories()
      .then((categories) => {
        if (isCancelled) return

        const byId = new Map(
          categories.map((category) => [category.id, category]),
        )
        const getLabel = (category: TCategory): string => {
          const parent = category.parentId
            ? byId.get(category.parentId)
            : undefined

          return parent
            ? `${getLabel(parent)} / ${category.name}`
            : category.name
        }

        setOptions(
          categories
            .map((category) => ({
              value: category.id,
              label: getLabel(category),
            }))
            .sort((a, b) => a.label.localeCompare(b.label, 'ru')),
        )
      })
      .catch(() => {
        if (isCancelled) return
        setOptions([])
      })
      .finally(() => {
        if (isCancelled) return
        setIsLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [])

  return { options, isLoading }
}
