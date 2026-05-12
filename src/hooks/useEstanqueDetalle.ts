import { useEffect, useState } from 'react'
import type { EstanqueDetalleData } from '../domain/estanque/Estanque'
import { estanqueService } from '../infrastructure/estanque/estanqueService'

interface UseEstanqueDetalleReturn {
  detalle: EstanqueDetalleData | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useEstanqueDetalle(id: string): UseEstanqueDetalleReturn {
  const [detalle, setDetalle] = useState<EstanqueDetalleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const data = await estanqueService.getDetalle(id)
        setDetalle(data)
      } catch {
        setError('Error al cargar detalles del estanque')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, tick])

  return { detalle, loading, error, refetch: () => setTick(t => t + 1) }
}
