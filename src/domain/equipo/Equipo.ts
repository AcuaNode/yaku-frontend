export type TipoEquipo = 'SENSOR' | 'PUMP'
export type EstadoEquipo = 'Asignado' | 'Libre'

export interface Equipo {
  id: string
  tipo: TipoEquipo
  estado: EstadoEquipo
  nombre: string
  serialNumber: string
  codigoFisico: string
  ubicacion: string
}

export interface EquipoStats {
  totalEquipos: number
  sensoresActivos: number
  bombasEnOperacion: number
  requiereMantension: number
}

export interface RegistrarEquipoDTO {
  nombre: string
  tipo: TipoEquipo
  codigoFisico: string
  ubicacion: string
}
