export type TCategory = {
  id: string
  name: string
  description: string | null
  parentId: string | null
}

export type TCategoryTreeNode = TCategory & {
  children: TCategoryTreeNode[]
}
