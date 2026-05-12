export type EstadoNotificacion = 'NO_LEIDA' | 'LEIDA'
export type TipoNotificacion = 'ALERTA' | 'TEMPERATURA' | 'MANTENIMIENTO' | 'OPERADOR'

export interface Notificacion {
  id: string
  tipo: TipoNotificacion
  titulo: string
  descripcion: string
  estanque: string
  tiempo: string
  estado: EstadoNotificacion
  esCritica?: boolean
}
