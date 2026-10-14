import { Tag, Tree, type TreeDataNode } from 'antd'
import type { ReactNode } from 'react'

import type { TCategoryTreeNode } from '../model/category.types'

import styles from './categoryTree.module.css'

type TCategoryTreeProps = {
  nodes: TCategoryTreeNode[]
  renderActions?: (node: TCategoryTreeNode) => ReactNode
}

function toTreeData(
  nodes: TCategoryTreeNode[],
  renderActions?: (node: TCategoryTreeNode) => ReactNode,
): TreeDataNode[] {
  return nodes.map((node) => ({
    key: node.id,
    title: (
      <div className={styles['category-tree__node']}>
        <div className={styles['category-tree__info']}>
          <span className={styles['category-tree__name']}>{node.name}</span>
          {node.children.length > 0 && (
            <Tag
              variant="filled"
              title={`Подкатегорий: ${node.children.length}`}
              className={styles['category-tree__count']}
            >
              {node.children.length}
            </Tag>
          )}
          {node.description && (
            <span
              title={node.description}
              className={styles['category-tree__description']}
            >
              {node.description}
            </span>
          )}
        </div>
        {renderActions && (
          <div className={styles['category-tree__actions']}>
            {renderActions(node)}
          </div>
        )}
      </div>
    ),
    children: node.children.length
      ? toTreeData(node.children, renderActions)
      : undefined,
  }))
}

export function CategoryTree({ nodes, renderActions }: TCategoryTreeProps) {
  return (
    <Tree
      treeData={toTreeData(nodes, renderActions)}
      defaultExpandAll
      showLine
      blockNode
      selectable={false}
      className={styles['category-tree']}
    />
  )
}
