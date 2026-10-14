import { Tree, type TreeDataNode, Typography } from 'antd'
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
        <div>
          <span className={styles['category-tree__name']}>{node.name}</span>
          {node.description && (
            <Typography.Text
              type="secondary"
              className={styles['category-tree__description']}
            >
              {node.description}
            </Typography.Text>
          )}
        </div>
        {renderActions?.(node)}
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
    />
  )
}
