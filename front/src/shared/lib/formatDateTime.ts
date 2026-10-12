const dateTimeFormatter = new Intl.DateTimeFormat('ru-RU', {
  dateStyle: 'long',
  timeStyle: 'short',
})

export function formatDateTime(value: string): string {
  return dateTimeFormatter.format(new Date(value))
}
