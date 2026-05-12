import { http } from '../../lib/http'
import { API_ENDPOINTS } from '../../config/api.config'
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

export const equipoService = {
  getAll: async (): Promise<Equipo[]> => {
    const { data } = await http.get<EquipmentResource[]>(API_ENDPOINTS.equipment.base)
    return data.map(mapEquipment)
  },

  getStats: async (): Promise<EquipoStats> => {
    const { data } = await http.get<EquipmentResource[]>(API_ENDPOINTS.equipment.base)
    const sensors   = data.filter(e => e.type === 'SENSOR')
    const actuators = data.filter(e => e.type === 'ACTUATOR')
    return {
      totalEquipos:        data.length,
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
