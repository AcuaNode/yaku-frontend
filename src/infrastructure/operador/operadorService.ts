import { http } from '../../lib/http'
import { API_ENDPOINTS } from '../../config/api.config'
import { getUserId } from '../../utils/token'
import type { Operador, OperadorStats } from '../../domain/operador/Operador'

interface UserResource {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
  createdAt?: string
}

interface FarmResource {
  id: number
  name: string
  ownerId: number
  farmToken: string
  address: string
}

const AVATAR_COLORS = ['#06b6d4', '#1e3a5f', '#0d9488', '#7c3aed', '#ea580c', '#db2777']

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' })
}

async function fetchUsers(): Promise<UserResource[]> {
  const { data } = await http.get<UserResource[] | unknown>(API_ENDPOINTS.users.base)
  return Array.isArray(data) ? (data as UserResource[]) : []
}

async function fetchUserFarm(): Promise<FarmResource | null> {
  const userId = getUserId()
  const { data } = await http.get<Record<string, unknown>[] | unknown>(API_ENDPOINTS.farms.base)
  if (!Array.isArray(data) || data.length === 0) return null
  const farms = data as FarmResource[]
  if (!userId) return farms[0]
  return farms.find(f => Number(f.ownerId) === userId) ?? farms[0]
}

export const operadorService = {
  getAll: async (): Promise<Operador[]> => {
    const users = await fetchUsers()
    return users
      .filter(u => u.role === 'OPERATOR')
      .map((u, i) => ({
        id:               String(u.id),
        userId:           `#USR-${String(u.id).padStart(4, '0')}`,
        nombre:           u.firstName ?? '',
        apellido:         u.lastName ?? '',
        email:            u.email,
        rol:              'OPERATOR' as const,
        estanqueAsignado: '',
        fechaRegistro:    u.createdAt ? formatDate(u.createdAt) : '—',
        avatarColor:      AVATAR_COLORS[i % AVATAR_COLORS.length],
      }))
  },

  getStats: async (): Promise<OperadorStats> => {
    const users = await fetchUsers()
    const operators = users.filter(u => u.role === 'OPERATOR')
    return {
      total:              operators.length,
      crecimientoMensual: 0,
    }
  },

  getFarmToken: async (): Promise<string> => {
    const farm = await fetchUserFarm()
    return farm?.farmToken ?? ''
  },

  actualizarToken: async (): Promise<string> => {
    const farm = await fetchUserFarm()
    if (!farm) throw new Error('No se encontró ninguna granja')
    const { data } = await http.patch<FarmResource>(API_ENDPOINTS.farms.regenerateToken(farm.id))
    return data.farmToken ?? ''
  },
}
