import { useEffect, useState } from 'react'
import type { Equipo, EquipoStats } from '../domain/equipo/Equipo'
import { equipoService } from '../infrastructure/equipo/equipoService'

interface UseEquiposReturn {
  equipos: Equipo[]
  stats: EquipoStats | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useEquipos(): UseEquiposReturn {
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [stats, setStats] = useState<EquipoStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [equiposData, statsData] = await Promise.all([
          equipoService.getAll(),
          equipoService.getStats(),
        ])
        setEquipos(equiposData)
        setStats(statsData)
      } catch {
        setError('Error al cargar equipos')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [tick])

  return { equipos, stats, loading, error, refetch: () => setTick(t => t + 1) }
}
