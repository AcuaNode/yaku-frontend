import { http } from '../../lib/http'
import { API_ENDPOINTS } from '../../config/api.config'
import type { SensorLectura, SensorStats } from '../../domain/sensor/Sensor'

interface PondResource {
  id: number
  name: string
}

interface SensorReading {
  sensorType: 'PH' | 'TEMPERATURE' | 'OXYGEN'
  measurement: { value: number; unit: string }
}

interface EquipmentResource {
  type: 'SENSOR' | 'ACTUATOR'
  status: 'AVAILABLE' | 'LINKED'
}

export const sensorService = {
  getChartData: async (): Promise<SensorLectura[]> => {
    const { data: ponds } = await http.get<PondResource[]>(API_ENDPOINTS.ponds.base)

    const results = await Promise.allSettled(
      ponds.map(async pond => {
        const { data: readings } = await http.get<SensorReading[]>(
          API_ENDPOINTS.telemetry.status(pond.id)
        )
        return {
          estanqueId: String(pond.id),
          nombre:     pond.name,
          Temp: readings.find(r => r.sensorType === 'TEMPERATURE')?.measurement.value ?? 0,
          pH:   readings.find(r => r.sensorType === 'PH')?.measurement.value ?? 0,
          O2:   readings.find(r => r.sensorType === 'OXYGEN')?.measurement.value ?? 0,
        } satisfies SensorLectura
      })
    )

    return results
      .filter((r): r is PromiseFulfilledResult<SensorLectura> => r.status === 'fulfilled')
      .map(r => r.value)
  },

  getStats: async (): Promise<SensorStats> => {
    const { data } = await http.get<EquipmentResource[]>(API_ENDPOINTS.equipment.base)
    const sensors = data.filter(e => e.type === 'SENSOR')
    const active  = sensors.filter(e => e.status === 'LINKED')
    return {
      totalConectados: active.length,
      sincronizacion:  sensors.length > 0
        ? Math.round((active.length / sensors.length) * 100)
        : 0,
    }
  },
}
