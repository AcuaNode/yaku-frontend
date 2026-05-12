export type RolOperador = 'OPERATOR' | 'ADMIN' | 'SUPERUSUARIO'

export interface Operador {
  id: string
  userId: string
  nombre: string
  apellido: string
  email: string
  rol: RolOperador
  estanqueAsignado: string
  fechaRegistro: string
  avatarColor: string
}

export interface OperadorStats {
  total: number
  crecimientoMensual: number
}
