import { http } from '../../lib/http'
import { API_ENDPOINTS } from '../../config/api.config'
import { getUserId } from '../../utils/token'
import type { Equipo, EquipoStats, RegistrarEquipoDTO } from '../../domain/equipo/Equipo'

interface EquipmentResource {
  id: number
  pondId: number
  type: 'SENSOR' | 'ACTUATOR'
  status: 'AVAILABLE' | 'LINKED'
  name: string
  physicalCode: string
  address: string
}

function mapEquipment(e: EquipmentResource): Equipo {
  return {
    id: String(e.id),
    tipo: e.type === 'SENSOR' ? 'SENSOR' : 'PUMP',
    estado: e.status === 'LINKED' ? 'Asignado' : 'Libre',
    nombre: e.name ?? '',
    serialNumber: e.physicalCode ?? '',
    codigoFisico: e.physicalCode ?? '',
    ubicacion: e.address ?? '',
  }
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

async function getUserEquipment(): Promise<EquipmentResource[]> {
  const [allEquipment, userPondIds] = await Promise.all([
    http.get<EquipmentResource[]>(API_ENDPOINTS.equipment.base),
    getUserPondIds(),
  ])
  return allEquipment.data.filter(e =>
    e.status === 'AVAILABLE' || userPondIds.has(e.pondId)
  )
}

export const equipoService = {
  getAll: async (): Promise<Equipo[]> => {
    const equipment = await getUserEquipment()
    return equipment.map(mapEquipment)
  },

  getStats: async (): Promise<EquipoStats> => {
    const equipment = await getUserEquipment()
    const sensors   = equipment.filter(e => e.type === 'SENSOR')
    const actuators = equipment.filter(e => e.type === 'ACTUATOR')
    return {
      totalEquipos:        equipment.length,
      sensoresActivos:     sensors.filter(e => e.status === 'LINKED').length,
      bombasEnOperacion:   actuators.filter(e => e.status === 'LINKED').length,
      requiereMantension:  0,
    }
  },

  registrar: async (data: RegistrarEquipoDTO): Promise<void> => {
    await http.post(API_ENDPOINTS.equipment.base, {
      type:         data.tipo === 'PUMP' ? 'ACTUATOR' : 'SENSOR',
      name:         data.nombre,
      physicalCode: data.codigoFisico,
    })
  },

  eliminar: async (id: string): Promise<void> => {
    await http.delete(API_ENDPOINTS.equipment.byId(parseInt(id, 10)))
  },

  asignarEstanque: async (id: string, estanqueId: string): Promise<void> => {
    await http.post(
      API_ENDPOINTS.equipment.link(parseInt(id, 10), parseInt(estanqueId, 10))
    )
  },
}
