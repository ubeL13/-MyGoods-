import {
  Alert,
  App,
  Button,
  Card,
  Empty,
  Flex,
  Skeleton,
  Space,
  Typography,
} from 'antd'
import { useState } from 'react'

import {
  buildCategoryTree,
  CategoryTree,
  type TCategory,
  useCategories,
} from '@/entities/category'
import { DeleteCategoryButton } from '@/features/category-delete'
import { CategoryFormModal } from '@/features/category-form'

import styles from './categoriesPage.module.css'

type TModalState = {
  category?: TCategory
  parentId?: string | null
}

export function CategoriesPage() {
  const { message } = App.useApp()
  const { categories, isLoading, error, reload } = useCategories()
  const [modal, setModal] = useState<TModalState | null>(null)
  const tree = buildCategoryTree(categories)

  const handleSaved = (category: TCategory) => {
    message.success(
      modal?.category
        ? 'Изменения сохранены'
        : `Категория «${category.name}» создана`,
    )
    setModal(null)
    reload()
  }

  return (
    <section>
      <Flex
        justify="space-between"
        align="center"
        wrap
        gap="middle"
        className={styles['categories-page__header']}
      >
        <Typography.Title
          level={2}
          className={styles['categories-page__title']}
        >
          Категории
        </Typography.Title>
        <Button type="primary" onClick={() => setModal({ parentId: null })}>
          Добавить категорию
        </Button>
      </Flex>

      {error && <Alert type="error" message={error} showIcon />}

      {!error && (
        <Card>
          {isLoading && <Skeleton active paragraph={{ rows: 6 }} />}

          {!isLoading &&
            (tree.length > 0 ? (
              <CategoryTree
                nodes={tree}
                renderActions={(node) => (
                  <Space size="small">
                    <Button
                      size="small"
                      onClick={() => setModal({ parentId: node.id })}
                    >
                      + Подкатегория
                    </Button>
                    <Button
                      size="small"
                      onClick={() => setModal({ category: node })}
                    >
                      Изменить
                    </Button>
                    <DeleteCategoryButton category={node} onDeleted={reload} />
                  </Space>
                )}
              />
            ) : (
              <Empty description="Категорий пока нет" />
            ))}
        </Card>
      )}

      {modal && (
        <CategoryFormModal
          categories={categories}
          category={modal.category}
          defaultParentId={modal.parentId}
          onSaved={handleSaved}
          onCancel={() => setModal(null)}
        />
      )}
    </section>
  )
}
