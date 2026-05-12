import type { Operador, OperadorStats } from '../../domain/operador/Operador'

const mockOperadores: Operador[] = [
  { id: 'op-1', userId: '#USR-8902', nombre: 'Carlos',   apellido: 'Rodriguez', email: 'c.rodriguez@yakumail.com', rol: 'OPERATOR', estanqueAsignado: 'Finca San José',   fechaRegistro: '12 Oct 2023', avatarColor: '#06b6d4' },
  { id: 'op-2', userId: '#USR-7721', nombre: 'Ana',      apellido: 'Martinez',  email: 'ana.mtz@yakumail.com',     rol: 'OPERATOR', estanqueAsignado: 'Finca El Dorado', fechaRegistro: '05 Nov 2023', avatarColor: '#1e3a5f' },
  { id: 'op-3', userId: '#USR-6650', nombre: 'Luis',     apellido: 'García',    email: 'lgarcia@yakumail.com',     rol: 'OPERATOR', estanqueAsignado: 'Finca San José',   fechaRegistro: '20 Nov 2023', avatarColor: '#0d9488' },
  { id: 'op-4', userId: '#USR-5510', nombre: 'María',    apellido: 'López',     email: 'm.lopez@yakumail.com',     rol: 'OPERATOR', estanqueAsignado: 'Finca El Dorado', fechaRegistro: '03 Dic 2023', avatarColor: '#7c3aed' },
  { id: 'op-5', userId: '#USR-4401', nombre: 'Jorge',    apellido: 'Ramírez',   email: 'j.ramirez@yakumail.com',   rol: 'OPERATOR', estanqueAsignado: 'Finca Norte',     fechaRegistro: '14 Ene 2024', avatarColor: '#ea580c' },
  { id: 'op-6', userId: '#USR-3320', nombre: 'Sofía',    apellido: 'Torres',    email: 's.torres@yakumail.com',    rol: 'ADMIN',    estanqueAsignado: 'Todas',           fechaRegistro: '20 Ene 2024', avatarColor: '#db2777' },
]

const FARM_TOKEN = 'AQUA-7729-TRT'

export const operadorService = {
  getAll: async (): Promise<Operador[]> => {
    // TODO: GET /api/operadores
    return mockOperadores
  },

  getStats: async (): Promise<OperadorStats> => {
    // TODO: GET /api/operadores/stats
    return { total: 24, crecimientoMensual: 2 }
  },

  getFarmToken: async (): Promise<string> => {
    // TODO: GET /api/operadores/farm-token
    return FARM_TOKEN
  },

  actualizarToken: async (): Promise<string> => {
    // TODO: POST /api/operadores/farm-token/refresh
    return 'AQUA-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 5).toUpperCase()
  },
}
