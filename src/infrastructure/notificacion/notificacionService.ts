import type { Notificacion } from '../../domain/notificacion/Notificacion'

const mockNotificaciones: Notificacion[] = [
  {
    id: 'n-1', tipo: 'ALERTA', estado: 'NO_LEIDA', esCritica: true,
    titulo: 'Alerta: Nivel de Oxígeno Crítico',
    descripcion: 'El sensor DO-02 en el Estanque A-01 ha registrado niveles por debajo de 3.5 mg/L durante los últimos 15 minutos. Se recomienda revisión inmediata de aireadores.',
    estanque: 'Estanque A-01', tiempo: 'Hace 5 minutos',
  },
  {
    id: 'n-2', tipo: 'TEMPERATURA', estado: 'NO_LEIDA', esCritica: false,
    titulo: 'Variación de Temperatura',
    descripcion: 'Incremento detectado en Estanque B-05 (+2.4°C). El sistema de control térmico ha sido activado automáticamente.',
    estanque: 'Estanque B-05', tiempo: 'Hace 42 minutos',
  },
  {
    id: 'n-3', tipo: 'MANTENIMIENTO', estado: 'LEIDA', esCritica: false,
    titulo: 'Mantenimiento de Sensor Completado',
    descripcion: 'El mantenimiento preventivo del sensor pH-14 en el Estanque A-02 ha sido finalizado por el operador Carlos Ruiz.',
    estanque: 'Estanque A-02', tiempo: 'Hoy, 08:30 AM',
  },
  {
    id: 'n-4', tipo: 'OPERADOR', estado: 'LEIDA', esCritica: false,
    titulo: 'Nuevo Operador Asignado',
    descripcion: 'Se ha registrado a un nuevo operador en el sistema: Roberto Pérez ha sido asignado al turno nocturno de la Finca San José.',
    estanque: 'Global', tiempo: 'Ayer, 04:15 PM',
  },
  {
    id: 'n-5', tipo: 'ALERTA', estado: 'NO_LEIDA', esCritica: true,
    titulo: 'Alerta: pH Fuera de Rango',
    descripcion: 'El sensor pH-07 en el Estanque C-03 ha registrado un valor de 5.8, por debajo del umbral mínimo de 6.5.',
    estanque: 'Estanque C-03', tiempo: 'Hace 1 hora',
  },
  {
    id: 'n-6', tipo: 'TEMPERATURA', estado: 'LEIDA', esCritica: false,
    titulo: 'Temperatura Normalizada',
    descripcion: 'La temperatura en el Estanque D-01 ha vuelto al rango óptimo (23.5°C) tras la activación del sistema de enfriamiento.',
    estanque: 'Estanque D-01', tiempo: 'Ayer, 11:00 AM',
  },
  {
    id: 'n-7', tipo: 'MANTENIMIENTO', estado: 'LEIDA', esCritica: false,
    titulo: 'Calibración de Sensores Programada',
    descripcion: 'Se ha programado una calibración masiva de sensores para el día viernes a las 7:00 AM.',
    estanque: 'Global', tiempo: 'Hace 2 días',
  },
  {
    id: 'n-8', tipo: 'OPERADOR', estado: 'LEIDA', esCritica: false,
    titulo: 'Turno Nocturno Iniciado',
    descripcion: 'El operador Luis García ha iniciado su turno nocturno y está monitoreando los estanques del Sector Norte.',
    estanque: 'Global', tiempo: 'Hace 3 días',
  },
]

export const notificacionService = {
  getAll: async (): Promise<Notificacion[]> => {
    // TODO: GET /api/notificaciones
    return mockNotificaciones
  },

  marcarTodasLeidas: async (): Promise<void> => {
    // TODO: PATCH /api/notificaciones/mark-all-read
  },

  marcarLeida: async (_id: string): Promise<void> => {
    // TODO: PATCH /api/notificaciones/:id/read
  },
}
