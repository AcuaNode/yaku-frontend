export type EstadoEstanque = 'ÓPTIMO' | 'ALERTA' | 'CRÍTICO' | 'INACTIVO'

export interface LecturaEstanque {
  id: string
  temp: number
  ph: number
  o2: number
  lectura: string
  estado: EstadoEstanque
}

export interface EstanqueListItem {
  id: string
  nombre: string
  sensores: string[]
  ultimaLectura: string
  estado: EstadoEstanque
}

export interface Estanque {
  id: string
  nombre: string
  ubicacion: string
  activo: boolean
  lecturas: LecturaEstanque[]
}

export interface EstanqueStats {
  totalEstanques: number
  crecimientoMensual: number
  totalActivos: number
}

export interface TelemetriaLectura {
  valor: number
  unidad: string
  estado: string
  estadoColor: string
  rangoMin: number
  rangoMax: number
}

export interface EquipoAsignado {
  id: string
  tipo: 'SENSOR' | 'PUMP'
  nombre: string
  serialNumber: string
  codigo: string
}

export interface HistoricoPoint {
  tiempo: string
  Temperatura: number
  pH: number
  Oxígeno: number
}

export interface OperadorAsignado {
  id: string
  nombre: string
  email: string
}

export interface EstanqueDetalleData {
  id: string
  nombre: string
  activo: boolean
  pondId: string
  telemetria: {
    temperatura: TelemetriaLectura
    ph: TelemetriaLectura
    oxigeno: TelemetriaLectura
  }
  equipos: EquipoAsignado[]
  historico: HistoricoPoint[]
  operadorAsignado: OperadorAsignado | null
}
