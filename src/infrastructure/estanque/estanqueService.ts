import type { Estanque, EstanqueDetalleData, EstanqueListItem, EstanqueStats, LecturaEstanque } from '../../domain/estanque/Estanque'

const mockLecturas: LecturaEstanque[] = [
  { id: 'EST-001', temp: 28.4, ph: 7.2, o2: 6.1, lectura: 'Hace 2m', estado: 'ÓPTIMO' },
  { id: 'EST-002', temp: 29.1, ph: 6.8, o2: 5.8, lectura: 'Hace 4m', estado: 'ÓPTIMO' },
  { id: 'EST-003', temp: 27.9, ph: 6.1, o2: 4.2, lectura: 'Hace 8m', estado: 'ALERTA' },
]

const mockEstanques: Estanque[] = [
  { id: 'EST-001', nombre: 'Estanque 1', ubicacion: 'Sector A', activo: true, lecturas: [] },
  { id: 'EST-002', nombre: 'Estanque 2', ubicacion: 'Sector A', activo: true, lecturas: [] },
  { id: 'EST-003', nombre: 'Estanque 3', ubicacion: 'Sector B', activo: true, lecturas: [] },
]

const mockListItems: EstanqueListItem[] = [
  { id: '#EST-001', nombre: 'Estanque de Cría Norte',   sensores: ['O2', 'pH', 'TEMP'], ultimaLectura: 'Hace 2 minutos', estado: 'ÓPTIMO' },
  { id: '#EST-002', nombre: 'Canal de Engorde A1',       sensores: ['O2', 'TEMP'],        ultimaLectura: 'Hace 5 minutos', estado: 'CRÍTICO' },
  { id: '#EST-003', nombre: 'Estanque de Reserva 2',     sensores: [],                    ultimaLectura: '—',              estado: 'INACTIVO' },
]

export const estanqueService = {
  getLecturas: async (): Promise<LecturaEstanque[]> => {
    // TODO: GET /api/estanques/lecturas
    return mockLecturas
  },

  getStats: async (): Promise<EstanqueStats> => {
    // TODO: GET /api/estanques/stats
    return { totalEstanques: 12, totalActivos: 12, crecimientoMensual: 2 }
  },

  getAll: async (): Promise<Estanque[]> => {
    // TODO: GET /api/estanques
    return mockEstanques
  },

  getListItems: async (): Promise<EstanqueListItem[]> => {
    // TODO: GET /api/estanques/list
    return mockListItems
  },

  crear: async (data: { nombre: string; ubicacion: string }): Promise<void> => {
    // TODO: POST /api/estanques
    console.log('Crear estanque:', data)
  },

  getDetalle: async (_id: string): Promise<EstanqueDetalleData> => {
    // TODO: GET /api/estanques/:id
    return {
      id: 'EST-001',
      nombre: 'Estanque A-01',
      activo: true,
      pondId: 'POND-29481-J01',
      telemetria: {
        temperatura: { valor: 24, unidad: '°C', estado: 'ÓPTIMO',    estadoColor: '#0d9488', rangoMin: 10, rangoMax: 30 },
        ph:          { valor: 7.2, unidad: '',   estado: 'ESTABLE',   estadoColor: '#0d9488', rangoMin: 6.5, rangoMax: 8.5 },
        oxigeno:     { valor: 8.5, unidad: 'mg/L', estado: 'SALUDABLE', estadoColor: '#0d9488', rangoMin: 5, rangoMax: 12 },
      },
      equipos: [
        { id: 'eq-1', tipo: 'SENSOR', nombre: 'Sensor Multi-Parámetro Pro', serialNumber: '8829-YAKU-01', codigo: 'AQUA-S-101' },
        { id: 'eq-2', tipo: 'PUMP',   nombre: 'Bomba Oxigenadora 5HP',       serialNumber: '4410-PUMP-X2', codigo: 'PUMP-A-01' },
      ],
      historico: [
        { tiempo: '06/Jan', Temperatura: 23.1, pH: 7.4, Oxígeno: 8.8 },
        { tiempo: '07/Jan', Temperatura: 24.0, pH: 7.3, Oxígeno: 8.5 },
        { tiempo: '13/Jan', Temperatura: 23.6, pH: 7.1, Oxígeno: 7.9 },
        { tiempo: '04/Ago', Temperatura: 22.8, pH: 6.9, Oxígeno: 7.2 },
        { tiempo: '03/Sep', Temperatura: 24.0, pH: 7.2, Oxígeno: 8.5 },
      ],
    }
  },
}
