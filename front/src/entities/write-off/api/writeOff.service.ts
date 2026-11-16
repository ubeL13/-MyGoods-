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
import {
  approveWriteOffMock,
  createWriteOffMock,
  getWriteOffByIdMock,
  getWriteOffsMock,
  rejectWriteOffMock,
} from './writeOff.mock'

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

export async function getWriteOffById(writeOffId: string): Promise<TWriteOff> {
  const data = await getWriteOffByIdMock(writeOffId)

  return mapWriteOffDto(data)
}

export async function approveWriteOff(writeOffId: string): Promise<TWriteOff> {
  const data = await approveWriteOffMock(writeOffId)

  return mapWriteOffDto(data)
}

export async function rejectWriteOff(
  writeOffId: string,
  reason: string,
): Promise<TWriteOff> {
  const data = await rejectWriteOffMock(writeOffId, { reason })

  return mapWriteOffDto(data)
}
