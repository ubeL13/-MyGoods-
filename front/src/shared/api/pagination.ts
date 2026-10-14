export type TPaginationParams = {
  page: number
  pageSize: number
}

export type TPaginatedResponse<TItem> = {
  items: TItem[]
  page: number
  pageSize: number
  totalCount: number
}
