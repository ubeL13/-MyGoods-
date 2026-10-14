export type TCategoryDto = {
  id: string
  name: string
  description: string | null
  parentId: string | null
  children: TCategoryDto[]
}
