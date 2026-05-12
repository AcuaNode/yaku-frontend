import { createContext, useContext, useState, useEffect } from 'react'
import type { User } from '../domain/auth/Auth'
import { getToken, clearTokens } from '../utils/token'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = getToken()
    if (!token) return
    // TODO (backend): GET /auth/me → setUser(data)
    // const { data } = await http.get(API_ENDPOINTS.auth.me)
    // setUser(data)
  }, [])

  function logout() {
    clearTokens()
    setUser(null)
  }

  const isAuthenticated = !!user || !!getToken()

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be inside AuthProvider')
  return ctx
}
