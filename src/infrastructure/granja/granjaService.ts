import { http } from '../../lib/http'
import { API_ENDPOINTS } from '../../config/api.config'
import { getUserId } from '../../utils/token'
import type { Granja, CrearGranjaDTO } from '../../domain/granja/Granja'

interface FarmResource {
  id: number
  name: string
  ownerId: number
  farmToken: string
  address: string
}

async function getUserFarms(): Promise<FarmResource[]> {
  const userId = getUserId()
  const { data } = await http.get<FarmResource[]>(API_ENDPOINTS.farms.base)
  if (!userId) return []
  return data.filter(f => f.ownerId === userId)
}

export const granjaService = {
  getAll: async (): Promise<Granja[]> => {
    const farms = await getUserFarms()
    return farms.map(f => ({
      id:        String(f.id),
      nombre:    f.name,
      ubicacion: f.address ?? '',
    }))
  },

  crear: async (dto: CrearGranjaDTO): Promise<Granja> => {
    const { data } = await http.post<FarmResource>(API_ENDPOINTS.farms.base, {
      name:    dto.nombre,
      address: dto.ubicacion,
    })
    return {
      id:        String(data.id),
      nombre:    data.name,
      ubicacion: data.address ?? '',
    }
  },

  tieneGranjas: async (): Promise<boolean> => {
    const farms = await getUserFarms()
    return farms.length > 0
  },
}
