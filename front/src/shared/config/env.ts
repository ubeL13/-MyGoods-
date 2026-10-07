const apiUrl = import.meta.env.VITE_API_URL

if (!apiUrl) {
  throw new Error(
    'Не задан VITE_API_URL. Скопируйте .env.example в .env и укажите адрес backend.',
  )
}

export const env = {
  VITE_API_URL: apiUrl,
} as const
