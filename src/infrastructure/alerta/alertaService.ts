import { http } from '../../lib/http'
import { API_ENDPOINTS } from '../../config/api.config'
import { getUserId } from '../../utils/token'
import type { Alerta } from '../../domain/alerta/Alerta'

interface NotificationResponseResource {
  id: number
  type: string
  message: string
  recipientUserId: number
  triggerTemperature?: number
  triggerPh?: number
  triggerHardwareStatus?: string
  createdAt: string
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'Ahora'
  if (mins < 60) return `Hace ${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Hace ${hours}h`
  return `Hace ${Math.floor(hours / 24)}d`
}

function buildTitle(n: NotificationResponseResource): string {
  const t = n.type.toUpperCase()
  if (t.includes('TEMP') && n.triggerTemperature != null) return `Anomalía de Temperatura (${n.triggerTemperature}°C)`
  if (t.includes('PH') && n.triggerPh != null) return `Anomalía de pH (${n.triggerPh})`
  if (n.triggerHardwareStatus) return `Estado de Hardware: ${n.triggerHardwareStatus}`
  return n.type
}

async function fetchNotifications(): Promise<NotificationResponseResource[]> {
  const userId = getUserId()
  if (!userId) return []
  const { data } = await http.get<NotificationResponseResource[]>(
    API_ENDPOINTS.users.notifications(userId)
  )
  return Array.isArray(data) ? data : []
}

export const alertaService = {
  getAll: async (): Promise<Alerta[]> => {
    const notifications = await fetchNotifications()
    return notifications.map(n => ({
      id:          String(n.id),
      estanqueId:  '',
      tiempo:      formatRelativeTime(n.createdAt),
      titulo:      buildTitle(n),
      descripcion: n.message,
      prioridad:   (n.triggerPh || n.triggerTemperature) ? 'CRITICA' : 'NORMAL',
    }))
  },

  getNoLeidas: async (): Promise<number> => {
    const notifications = await fetchNotifications()
    return notifications.length
  },
}
