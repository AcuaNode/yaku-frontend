const LOCALE = 'es-PE'

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString(LOCALE, { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString(LOCALE, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function timeAgo(date: string | Date): string {
  const diff = Date.now() - new Date(date).getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)

  if (mins  < 1)   return 'Justo ahora'
  if (mins  < 60)  return `Hace ${mins} minuto${mins > 1 ? 's' : ''}`
  if (hours < 24)  return `Hace ${hours} hora${hours > 1 ? 's' : ''}`
  if (days  === 1) return 'Ayer'
  return `Hace ${days} días`
}
