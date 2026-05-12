import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import i18next from 'i18next'
import type { LoginCredentials, RegisterCredentials } from '../domain/auth/Auth'
import { authService } from '../infrastructure/auth/authService'
import { useAuthContext } from '../context/AuthContext'
import { clearTokens } from '../utils/token'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setUser } = useAuthContext()
  const navigate = useNavigate()

  async function login(credentials: LoginCredentials) {
    if (!credentials.username || !credentials.password) {
      setError(i18next.t('login.errorInvalid'))
      return
    }
    setLoading(true)
    setError(null)
    try {
      const user = await authService.login(credentials)
      setUser(user)
      navigate('/dashboard')
    } catch {
      setError(i18next.t('login.errorCredentials'))
    } finally {
      setLoading(false)
    }
  }

  async function register(data: RegisterCredentials) {
    const { username, firstName, lastName, email, password } = data
    if (!username || !firstName || !lastName || !email || !password) {
      setError(i18next.t('register.errorRequired'))
      return
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }
    if (username.length < 4 || username.length > 20) {
      setError('El usuario debe tener entre 4 y 20 caracteres')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const user = await authService.register(data)
      setUser(user)
      navigate('/dashboard')
    } catch {
      setError(i18next.t('register.errorRegister'))
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
