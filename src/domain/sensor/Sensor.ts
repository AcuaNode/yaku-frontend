export interface SensorLectura {
  estanqueId: string
  nombre: string
  Temp: number
  pH: number
  O2: number
}

export interface SensorStats {
  totalConectados: number
  sincronizacion: number
}
