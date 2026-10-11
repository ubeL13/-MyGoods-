import { isAxiosError } from 'axios'

type TProblemDetails = {
  title?: string
  detail?: string | null
}

const DEFAULT_ERROR_MESSAGE = 'Не удалось загрузить данные. Попробуйте позже.'

export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError<TProblemDetails>(error)) {
    const problem = error.response?.data

    if (problem?.detail) return problem.detail
    if (problem?.title) return problem.title
    if (!error.response)
      return 'Сервер недоступен. Проверьте, что backend запущен.'
  }

  return DEFAULT_ERROR_MESSAGE
}
