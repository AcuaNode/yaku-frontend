import { useEffect, useState } from 'react'
import type { SensorLectura, SensorStats } from '../domain/sensor/Sensor'
import { sensorService } from '../infrastructure/sensor/sensorService'

interface UseSensoresReturn {
  chartData: SensorLectura[]
  stats: SensorStats | null
  loading: boolean
  error: string | null
}

export function useSensores(): UseSensoresReturn {
  const [chartData, setChartData] = useState<SensorLectura[]>([])
  const [stats, setStats] = useState<SensorStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [chartDataResult, statsData] = await Promise.all([
          sensorService.getChartData(),
          sensorService.getStats(),
        ])
        setChartData(chartDataResult)
        setStats(statsData)
      } catch {
        setError('Error al cargar datos de sensores')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { chartData, stats, loading, error }
}
