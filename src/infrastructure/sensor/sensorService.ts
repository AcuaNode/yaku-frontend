import type { SensorLectura, SensorStats } from '../../domain/sensor/Sensor'

const mockChartData: SensorLectura[] = [
  { estanqueId: 'EST-001', nombre: 'EST-001', Temp: 28, pH: 7.2, O2: 6.1 },
  { estanqueId: 'EST-002', nombre: 'EST-002', Temp: 29, pH: 6.8, O2: 5.8 },
  { estanqueId: 'EST-003', nombre: 'EST-003', Temp: 27, pH: 6.1, O2: 4.2 },
  { estanqueId: 'EST-004', nombre: 'EST-004', Temp: 30, pH: 7.5, O2: 6.8 },
  { estanqueId: 'EST-005', nombre: 'EST-005', Temp: 26, pH: 7.0, O2: 5.5 },
]

export const sensorService = {
  getChartData: async (): Promise<SensorLectura[]> => {
    // TODO: GET /api/sensores/chart
    return mockChartData
  },

  getStats: async (): Promise<SensorStats> => {
    // TODO: GET /api/sensores/stats
    return { totalConectados: 45, sincronizacion: 100 }
  },
}
