import type { TPaginatedResponse } from '@/shared/api'

import type {
  TWriteOff,
  TWriteOffCreateValues,
  TWriteOffsQuery,
} from '../model/writeOff.types'

import {
  mapWriteOffDto,
  mapWriteOffsPageDto,
  mapWriteOffsQuery,
} from './writeOff.mapper'
import { createWriteOffMock, getWriteOffsMock } from './writeOff.mock'

export async function getWriteOffs(
  query: TWriteOffsQuery,
): Promise<TPaginatedResponse<TWriteOff>> {
  const data = await getWriteOffsMock(mapWriteOffsQuery(query))

  return mapWriteOffsPageDto(data)
}

export async function createWriteOff(
  values: TWriteOffCreateValues,
): Promise<TWriteOff> {
  const data = await createWriteOffMock(values)

  return mapWriteOffDto(data)
}
