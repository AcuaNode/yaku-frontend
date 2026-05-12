import { useEffect, useState } from 'react'
import type { Alerta } from '../domain/alerta/Alerta'
import { alertaService } from '../infrastructure/alerta/alertaService'

interface UseAlertasReturn {
  alertas: Alerta[]
  noLeidas: number
  loading: boolean
  error: string | null
}

export function useAlertas(): UseAlertasReturn {
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [noLeidas, setNoLeidas] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [alertasData, noLeidasData] = await Promise.all([
          alertaService.getAll(),
          alertaService.getNoLeidas(),
        ])
        setAlertas(alertasData)
        setNoLeidas(noLeidasData)
      } catch {
        setError('Error al cargar alertas')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { alertas, noLeidas, loading, error }
}
