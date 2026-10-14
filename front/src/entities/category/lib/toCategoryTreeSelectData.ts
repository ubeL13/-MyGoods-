import type { TCategoryTreeNode } from '../model/category.types'

type TCategoryTreeSelectNode = {
  value: string
  title: string
  children?: TCategoryTreeSelectNode[]
}

export function toCategoryTreeSelectData(
  nodes: TCategoryTreeNode[],
  excludeId?: string,
): TCategoryTreeSelectNode[] {
  return nodes
    .filter((node) => node.id !== excludeId)
    .map((node) => ({
      value: node.id,
      title: node.name,
      children: node.children.length
        ? toCategoryTreeSelectData(node.children, excludeId)
        : undefined,
    }))
}
