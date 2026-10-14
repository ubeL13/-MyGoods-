import type { TCategory, TCategoryTreeNode } from '../model/category.types'

function sortByName(nodes: TCategoryTreeNode[]): void {
  nodes.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
  nodes.forEach((node) => sortByName(node.children))
}

export function buildCategoryTree(
  categories: TCategory[],
): TCategoryTreeNode[] {
  const nodes = new Map<string, TCategoryTreeNode>()

  categories.forEach((category) => {
    nodes.set(category.id, { ...category, children: [] })
  })

  const roots: TCategoryTreeNode[] = []

  nodes.forEach((node) => {
    const parent = node.parentId ? nodes.get(node.parentId) : undefined

    if (parent) {
      parent.children.push(node)
    } else {
      roots.push(node)
    }
  })

  sortByName(roots)

  return roots
}
