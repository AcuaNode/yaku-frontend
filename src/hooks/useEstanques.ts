import { useEffect, useState } from 'react'
import type { EstanqueListItem, EstanqueStats, LecturaEstanque } from '../domain/estanque/Estanque'
import { estanqueService } from '../infrastructure/estanque/estanqueService'

interface UseEstanquesReturn {
  lecturas: LecturaEstanque[]
  listItems: EstanqueListItem[]
  stats: EstanqueStats | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useEstanques(): UseEstanquesReturn {
  const [lecturas, setLecturas] = useState<LecturaEstanque[]>([])
  const [listItems, setListItems] = useState<EstanqueListItem[]>([])
  const [stats, setStats] = useState<EstanqueStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [lecturasData, statsData, listData] = await Promise.all([
          estanqueService.getLecturas(),
          estanqueService.getStats(),
          estanqueService.getListItems(),
        ])
        setLecturas(lecturasData)
        setStats(statsData)
        setListItems(listData)
      } catch {
        setError('Error al cargar datos de estanques')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [tick])

  return { lecturas, listItems, stats, loading, error, refetch: () => setTick(t => t + 1) }
}
