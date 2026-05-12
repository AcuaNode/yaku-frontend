export type AlertaPrioridad = 'CRITICA' | 'NORMAL'

export interface Alerta {
  id: string
  estanqueId: string
  tiempo: string
  titulo: string
  descripcion: string
  prioridad: AlertaPrioridad
}
