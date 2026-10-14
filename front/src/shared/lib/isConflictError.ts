import { isAxiosError } from 'axios'

export function isConflictError(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 409
}
