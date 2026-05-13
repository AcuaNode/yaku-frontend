import { http } from '../../lib/http'
import { API_ENDPOINTS } from '../../config/api.config'
import { getUserId } from '../../utils/token'
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
  pondId: number
  type: 'SENSOR' | 'ACTUATOR'
  status: 'AVAILABLE' | 'LINKED'
}

async function getUserPondIds(): Promise<Set<number>> {
  const userId = getUserId()
  const { data: farms } = await http.get<{ id: number; ownerId: number }[]>(API_ENDPOINTS.farms.base)
  const userFarmIds = userId ? farms.filter(f => f.ownerId === userId).map(f => f.id) : []
  if (userFarmIds.length === 0) return new Set()
  const responses = await Promise.all(
    userFarmIds.map(farmId => http.get<{ id: number }[]>(API_ENDPOINTS.ponds.byFarm(farmId)))
  )
  return new Set(responses.flatMap(r => r.data.map(p => p.id)))
}

async function getUserPonds(): Promise<PondResource[]> {
  const userId = getUserId()
  const { data: farms } = await http.get<{ id: number; ownerId: number }[]>(API_ENDPOINTS.farms.base)
  const userFarmIds = userId ? farms.filter(f => f.ownerId === userId).map(f => f.id) : []
  if (userFarmIds.length === 0) return []
  const responses = await Promise.all(
    userFarmIds.map(farmId => http.get<PondResource[]>(API_ENDPOINTS.ponds.byFarm(farmId)))
  )
  return responses.flatMap(r => r.data)
}

export const sensorService = {
  getChartData: async (): Promise<SensorLectura[]> => {
    const ponds = await getUserPonds()

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
    const [allEquipment, userPondIds] = await Promise.all([
      http.get<EquipmentResource[]>(API_ENDPOINTS.equipment.base),
      getUserPondIds(),
    ])
    const sensors = allEquipment.data.filter(
      e => e.type === 'SENSOR' && (e.status === 'AVAILABLE' || userPondIds.has(e.pondId))
    )
    const active = sensors.filter(e => e.status === 'LINKED')
    return {
      totalConectados: active.length,
      sincronizacion:  sensors.length > 0
        ? Math.round((active.length / sensors.length) * 100)
        : 0,
    }
  },
}
