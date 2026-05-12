import { http } from '../../lib/http'
import { API_ENDPOINTS } from '../../config/api.config'
import { getUserId } from '../../utils/token'
import type { Notificacion, TipoNotificacion } from '../../domain/notificacion/Notificacion'

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
  if (mins < 60) return `Hace ${mins} minutos`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`
  const days = Math.floor(hours / 24)
  return `Hace ${days} día${days > 1 ? 's' : ''}`
}

function mapType(type: string): TipoNotificacion {
  const t = type.toUpperCase()
  if (t.includes('TEMP')) return 'TEMPERATURA'
  if (t.includes('MAINT') || t.includes('HARDWARE')) return 'MANTENIMIENTO'
  if (t.includes('OPERATOR') || t.includes('USER')) return 'OPERADOR'
  return 'ALERTA'
}

function buildTitle(n: NotificationResponseResource): string {
  const t = n.type.toUpperCase()
  if (t.includes('TEMP') && n.triggerTemperature != null) return `Anomalía de Temperatura (${n.triggerTemperature}°C)`
  if (t.includes('PH') && n.triggerPh != null) return `Anomalía de pH (${n.triggerPh})`
  if (n.triggerHardwareStatus) return `Estado de Hardware: ${n.triggerHardwareStatus}`
  return n.type
}

export const notificacionService = {
  getAll: async (): Promise<Notificacion[]> => {
    const userId = getUserId()
    if (!userId) return []

    const { data } = await http.get<NotificationResponseResource[]>(
      API_ENDPOINTS.users.notifications(userId)
    )
    return data.map(n => ({
      id:          String(n.id),
      tipo:        mapType(n.type),
      titulo:      buildTitle(n),
      descripcion: n.message,
      estanque:    '',
      tiempo:      formatRelativeTime(n.createdAt),
      estado:      'NO_LEIDA',
      esCritica:   !!(n.triggerPh || n.triggerTemperature),
    }))
  },

  marcarTodasLeidas: async (): Promise<void> => {
    // No existe endpoint en backend — operación solo local
  },

  marcarLeida: async (_id: string): Promise<void> => {
    // No existe endpoint en backend — operación solo local
  },
}
