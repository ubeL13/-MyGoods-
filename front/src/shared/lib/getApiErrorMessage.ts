import { isAxiosError } from 'axios'

type TProblemDetails = {
  title?: string
  detail?: string | null
  errors?: Record<string, string[]>
}

const DEFAULT_ERROR_MESSAGE = 'Не удалось загрузить данные. Попробуйте позже.'

export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError<TProblemDetails>(error)) {
    const problem = error.response?.data
    const validationMessages = Object.values(problem?.errors ?? {}).flat()

    if (validationMessages.length > 0) return validationMessages.join(' ')
    if (problem?.detail) return problem.detail
    if (problem?.title) return problem.title
    if (!error.response)
      return 'Сервер недоступен. Проверьте, что backend запущен.'
  }

  return DEFAULT_ERROR_MESSAGE
}
