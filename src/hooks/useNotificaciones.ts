import { useEffect, useState } from 'react'
import type { Notificacion } from '../domain/notificacion/Notificacion'
import { notificacionService } from '../infrastructure/notificacion/notificacionService'

interface UseNotificacionesReturn {
  notificaciones: Notificacion[]
  loading: boolean
  marcarTodasLeidas: () => void
}

export function useNotificaciones(): UseNotificacionesReturn {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    notificacionService.getAll().then(data => {
      setNotificaciones(data)
      setLoading(false)
    })
  }, [])

  function marcarTodasLeidas() {
    notificacionService.marcarTodasLeidas()
    setNotificaciones(prev => prev.map(n => ({ ...n, estado: 'LEIDA' as const })))
  }

  return { notificaciones, loading, marcarTodasLeidas }
}
