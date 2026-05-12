import { useEffect, useState } from 'react'
import type { Operador, OperadorStats } from '../domain/operador/Operador'
import { operadorService } from '../infrastructure/operador/operadorService'

interface UseOperadoresReturn {
  operadores: Operador[]
  stats: OperadorStats | null
  farmToken: string
  loading: boolean
  actualizarToken: () => Promise<void>
}

export function useOperadores(): UseOperadoresReturn {
  const [operadores, setOperadores] = useState<Operador[]>([])
  const [stats, setStats] = useState<OperadorStats | null>(null)
  const [farmToken, setFarmToken] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [ops, statsData, token] = await Promise.all([
          operadorService.getAll(),
          operadorService.getStats(),
          operadorService.getFarmToken(),
        ])
        setOperadores(ops)
        setStats(statsData)
        setFarmToken(token)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  async function actualizarToken() {
    const nuevoToken = await operadorService.actualizarToken()
    setFarmToken(nuevoToken)
  }

  return { operadores, stats, farmToken, loading, actualizarToken }
}
