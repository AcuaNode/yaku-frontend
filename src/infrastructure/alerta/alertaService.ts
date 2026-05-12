import type { Alerta } from '../../domain/alerta/Alerta'

const mockAlertas: Alerta[] = [
  { id: '1', estanqueId: 'EST-004', tiempo: 'Hace 5m',  titulo: 'pH Crítico Detectado',    descripcion: 'El pH ha descendido por debajo del umbral de seguridad (6.1).', prioridad: 'CRITICA' },
  { id: '2', estanqueId: 'EST-002', tiempo: 'Hace 45m', titulo: 'Mantenimiento de Sensor', descripcion: 'Calibración requerida para el sensor de O2 en el cuadrante norte.', prioridad: 'NORMAL' },
  { id: '3', estanqueId: 'EST-009', tiempo: 'Hace 1h',  titulo: 'Oxígeno Bajo',            descripcion: 'Nivel de oxígeno en 3.5 mg/L. Aeradores activados automáticamente.', prioridad: 'CRITICA' },
  { id: '4', estanqueId: 'GLOBAL',  tiempo: 'Hace 3h',  titulo: 'Reporte Diario Generado', descripcion: 'El consolidado de la producción de ayer ya está disponible para descarga.', prioridad: 'NORMAL' },
  { id: '5', estanqueId: 'EST-012', tiempo: 'Hace 5h',  titulo: 'Inicio de Ciclo',         descripcion: 'Nuevas siembras registradas exitosamente en el sistema.', prioridad: 'NORMAL' },
]

export const alertaService = {
  getAll: async (): Promise<Alerta[]> => {
    // TODO: GET /api/alertas
    return mockAlertas
  },

  getNoLeidas: async (): Promise<number> => {
    // TODO: GET /api/alertas/no-leidas/count
    return 3
  },
}
