import { AxiosError, type AxiosResponse } from 'axios'

const MOCK_DELAY_MS = 400

export function createMockApiError(
  status: number,
  title: string,
  detail: string,
): AxiosError {
  const response = {
    status,
    statusText: title,
    headers: {},
    config: {},
    data: { status, title, detail },
  } as AxiosResponse

  return new AxiosError(
    `Request failed with status code ${status}`,
    AxiosError.ERR_BAD_REQUEST,
    undefined,
    undefined,
    response,
  )
}

export function withMockDelay<T>(
  getResult: () => T,
  delayMs = MOCK_DELAY_MS,
): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(getResult())
      } catch (error) {
        reject(error)
      }
    }, delayMs)
  })
}
