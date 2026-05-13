import { http } from '../../lib/http'
import { API_ENDPOINTS } from '../../config/api.config'
import { getUserId } from '../../utils/token'
import type {
  Estanque,
  EstanqueDetalleData,
  EstanqueListItem,
  EstanqueStats,
  EstadoEstanque,
  HistoricoPoint,
  LecturaEstanque,
} from '../../domain/estanque/Estanque'

interface PondResource {
  id: number
  farmId: number
  name: string
  species: string
  volume: number
  status: string
  assignedFishFarmerId: number
}

interface SensorReading {
  id: number
  pondId: number
  sensorType: 'PH' | 'TEMPERATURE' | 'OXYGEN'
  measurement: { value: number; unit: string }
  timestamp: string
}

interface MeasurementAggregate {
  id: number
  pondId: number
  sensorType: 'PH' | 'TEMPERATURE' | 'OXYGEN'
  minValue: number
  maxValue: number
  averageValue: number
  periodStart: string
  periodEnd: string
}

interface EquipmentResource {
  id: number
  pondId: number
  type: 'SENSOR' | 'ACTUATOR'
  status: 'AVAILABLE' | 'LINKED'
  name: string
  physicalCode: string
  address: string
}

function determineEstado(temp: number, ph: number, o2: number): EstadoEstanque {
  if (temp === 0 && ph === 0 && o2 === 0) return 'INACTIVO'
  if (ph < 6.0 || ph > 9.0 || o2 < 3 || temp > 35) return 'CRÍTICO'
  if (ph < 6.5 || ph > 8.5 || o2 < 5 || temp > 30) return 'ALERTA'
  return 'ÓPTIMO'
}

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'Ahora'
  if (mins < 60) return `Hace ${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Hace ${hours}h`
  return `Hace ${Math.floor(hours / 24)}d`
}

function extractReadings(readings: SensorReading[]) {
  return {
    temp: readings.find(r => r.sensorType === 'TEMPERATURE')?.measurement.value ?? 0,
    ph:   readings.find(r => r.sensorType === 'PH')?.measurement.value ?? 0,
    o2:   readings.find(r => r.sensorType === 'OXYGEN')?.measurement.value ?? 0,
    latest: readings
      .map(r => r.timestamp)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] ?? '',
  }
}

function mapHistorical(data: MeasurementAggregate[]): HistoricoPoint[] {
  const grouped: Record<string, HistoricoPoint> = {}
  for (const item of data) {
    const key = item.periodStart
    if (!grouped[key]) {
      const d = new Date(item.periodStart)
      grouped[key] = {
        tiempo: `${d.getDate()}/${d.toLocaleString('es', { month: 'short' })}`,
        Temperatura: 0,
        pH: 0,
        Oxígeno: 0,
      }
    }
    if (item.sensorType === 'TEMPERATURE') grouped[key].Temperatura = item.averageValue
    if (item.sensorType === 'PH') grouped[key].pH = item.averageValue
    if (item.sensorType === 'OXYGEN') grouped[key]['Oxígeno'] = item.averageValue
  }
  return Object.values(grouped)
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

async function getPondReadings(pondId: number): Promise<SensorReading[]> {
  try {
    const { data } = await http.get<SensorReading[]>(API_ENDPOINTS.telemetry.status(pondId))
    return data
  } catch {
    return []
  }
}

export const estanqueService = {
  getLecturas: async (): Promise<LecturaEstanque[]> => {
    const ponds = await getUserPonds()
    const results = await Promise.all(
      ponds.map(async pond => {
        const readings = await getPondReadings(pond.id)
        const { temp, ph, o2, latest } = extractReadings(readings)
        return {
          id: `EST-${String(pond.id).padStart(3, '0')}`,
          temp,
          ph,
          o2,
          lectura: latest ? formatRelativeTime(latest) : '—',
          estado: determineEstado(temp, ph, o2),
        } satisfies LecturaEstanque
      })
    )
    return results
  },

  getStats: async (): Promise<EstanqueStats> => {
    const ponds = await getUserPonds()
    return {
      totalEstanques: ponds.length,
      totalActivos: ponds.filter(p => p.status !== 'INACTIVE').length,
      crecimientoMensual: 0,
    }
  },

  getAll: async (): Promise<Estanque[]> => {
    const ponds = await getUserPonds()
    return ponds.map(p => ({
      id: String(p.id),
      nombre: p.name,
      ubicacion: String(p.farmId),
      activo: p.status !== 'INACTIVE',
      lecturas: [],
    }))
  },

  getListItems: async (): Promise<EstanqueListItem[]> => {
    const [ponds, equipmentRes] = await Promise.all([
      getUserPonds(),
      http.get<EquipmentResource[]>(API_ENDPOINTS.equipment.base),
    ])
    const statusResults = await Promise.allSettled(
      ponds.map(pond => getPondReadings(pond.id))
    )
    return ponds.map((pond, i) => {
      const sensors = equipmentRes.data
        .filter(e => e.pondId === pond.id && e.type === 'SENSOR')
        .map(e => e.name ?? 'SENSOR')
      const readings = statusResults[i].status === 'fulfilled' ? statusResults[i].value : []
      const { temp, ph, o2, latest } = extractReadings(readings)
      return {
        id: `#EST-${String(pond.id).padStart(3, '0')}`,
        nombre: pond.name,
        sensores: sensors,
        ultimaLectura: latest ? formatRelativeTime(latest) : '—',
        estado: determineEstado(temp, ph, o2),
      }
    })
  },

  crear: async (data: { nombre: string; species?: string; volume?: number; farmId?: number }): Promise<void> => {
    let farmId = data.farmId
    if (!farmId) {
      const userId = getUserId()
      const { data: farms } = await http.get<{ id: number; ownerId: number }[]>(API_ENDPOINTS.farms.base)
      const userFarm = userId ? farms.find(f => f.ownerId === userId) : undefined
      farmId = userFarm?.id ?? farms[0]?.id
    }
    await http.post(API_ENDPOINTS.ponds.base, {
      farmId,
      name: data.nombre,
      species: data.species ?? '',
      volume: data.volume ?? 0,
    })
  },

  getDetalle: async (id: string): Promise<EstanqueDetalleData> => {
    const pondId = parseInt(id, 10)
    const [pondRes, statusRes, historicalRes, equipmentRes, usersRes] = await Promise.all([
      http.get<PondResource>(API_ENDPOINTS.ponds.byId(pondId)),
      http.get<SensorReading[]>(API_ENDPOINTS.telemetry.status(pondId)).catch(() => ({ data: [] as SensorReading[] })),
      http.get<MeasurementAggregate[]>(API_ENDPOINTS.telemetry.historical(pondId)).catch(() => ({ data: [] as MeasurementAggregate[] })),
      http.get<EquipmentResource[]>(API_ENDPOINTS.equipment.base),
      http.get<{ id: number; firstName: string; lastName: string; email: string }[]>(API_ENDPOINTS.users.base).catch(() => ({ data: [] as { id: number; firstName: string; lastName: string; email: string }[] })),
    ])

    const pond = pondRes.data
    const readings = statusRes.data
    const { temp, ph, o2 } = extractReadings(readings)
    const pondEquipment = equipmentRes.data.filter(e => e.pondId === pondId)
    const assignedUser = pond.assignedFishFarmerId
      ? (usersRes.data.find(u => u.id === pond.assignedFishFarmerId) ?? null)
      : null

    return {
      id: String(pond.id),
      nombre: pond.name,
      activo: pond.status !== 'INACTIVE',
      pondId: `POND-${pond.id}`,
      telemetria: {
        temperatura: {
          valor: temp,
          unidad: '°C',
          estado: temp >= 20 && temp <= 30 ? 'ÓPTIMO' : 'ALERTA',
          estadoColor: temp >= 20 && temp <= 30 ? '#0d9488' : '#f59e0b',
          rangoMin: 10,
          rangoMax: 30,
        },
        ph: {
          valor: ph,
          unidad: '',
          estado: ph >= 6.5 && ph <= 8.5 ? 'ESTABLE' : 'ALERTA',
          estadoColor: ph >= 6.5 && ph <= 8.5 ? '#0d9488' : '#f59e0b',
          rangoMin: 6.5,
          rangoMax: 8.5,
        },
        oxigeno: {
          valor: o2,
          unidad: 'mg/L',
          estado: o2 >= 5 ? 'SALUDABLE' : 'BAJO',
          estadoColor: o2 >= 5 ? '#0d9488' : '#ef4444',
          rangoMin: 5,
          rangoMax: 12,
        },
      },
      equipos: pondEquipment.map(e => ({
        id: String(e.id),
        tipo: e.type === 'SENSOR' ? 'SENSOR' : 'PUMP',
        nombre: e.name ?? e.type,
        serialNumber: e.physicalCode ?? '',
        codigo: e.physicalCode ?? '',
      })),
      historico: mapHistorical(historicalRes.data),
      operadorAsignado: assignedUser ? {
        id: String(assignedUser.id),
        nombre: `${assignedUser.firstName} ${assignedUser.lastName}`.trim(),
        email: assignedUser.email,
      } : null,
    }
  },
}
