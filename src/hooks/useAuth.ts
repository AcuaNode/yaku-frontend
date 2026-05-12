import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { LoginCredentials, RegisterCredentials } from '../domain/auth/Auth'
import { authService } from '../infrastructure/auth/authService'
import { useAuthContext } from '../context/AuthContext'
import { setToken, clearTokens } from '../utils/token'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setUser } = useAuthContext()
  const navigate = useNavigate()

  async function login(credentials: LoginCredentials) {
    if (!credentials.username || !credentials.password) {
      setError('Credenciales inválidas')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const user = await authService.login(credentials)
      setUser(user)
      // TODO (backend): setToken(response.accessToken); setRefreshToken(response.refreshToken)
      setToken('mock-token')
      navigate('/dashboard')
    } catch {
      setError('Usuario o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  async function register(data: RegisterCredentials) {
    const { username, firstName, lastName, email, password } = data
    if (!username || !firstName || !lastName || !email || !password) {
      setError('Todos los campos son requeridos')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const user = await authService.register(data)
      setUser(user)
      // TODO (backend): setToken(response.accessToken)
      setToken('mock-token')
      navigate('/dashboard')
    } catch {
      setError('Error al registrar usuario')
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    await authService.logout()
    clearTokens()
    setUser(null)
    navigate('/')
  }

  return { login, register, logout, loading, error, setError }
}
