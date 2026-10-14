import { Alert, Empty, Skeleton, Typography } from 'antd'

import {
  buildCategoryTree,
  CategoryTree,
  useCategories,
} from '@/entities/category'

export function CategoriesPage() {
  const { categories, isLoading, error } = useCategories()
  const tree = buildCategoryTree(categories)

  return (
    <section>
      <Typography.Title level={2}>Категории</Typography.Title>

      {isLoading && <Skeleton active paragraph={{ rows: 6 }} />}

      {error && <Alert type="error" message={error} showIcon />}

      {!isLoading &&
        !error &&
        (tree.length > 0 ? (
          <CategoryTree nodes={tree} />
        ) : (
          <Empty description="Категорий пока нет" />
        ))}
    </section>
  )
}
