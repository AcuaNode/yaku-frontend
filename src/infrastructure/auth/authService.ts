import { http } from '../../lib/http'
import { API_ENDPOINTS } from '../../config/api.config'
import type { LoginCredentials, RegisterCredentials, User } from '../../domain/auth/Auth'
import { setToken, setUserId, setStoredUser } from '../../utils/token'

interface SignInResponse {
  token?: string
  accessToken?: string
  id?: number
  userId?: number
  username?: string
  email?: string
  firstName?: string
  lastName?: string
  role?: string
  roles?: string | string[]
}

function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64)) as Record<string, unknown>
  } catch {
    return {}
  }
}

function mapRole(raw: unknown): User['role'] {
  const role = Array.isArray(raw) ? String(raw[0]) : String(raw ?? '')
  if (role.includes('ADMIN')) return 'ADMIN'
  if (role.includes('OPERATOR')) return 'OPERADOR'
  return 'ADMIN'
}

function buildUser(token: string, response: SignInResponse, fallback: Partial<User>): User {
  const payload = decodeJwtPayload(token)

  const id = Number(
    response.id ?? response.userId ?? payload.id ?? payload.userId ?? 0
  )
  const user: User = {
    id: String(id),
    username: String(response.username ?? payload.sub ?? fallback.username ?? ''),
    firstName: String(response.firstName ?? payload.firstName ?? fallback.firstName ?? ''),
    lastName: String(response.lastName ?? payload.lastName ?? fallback.lastName ?? ''),
    email: String(response.email ?? payload.email ?? fallback.email ?? ''),
    role: mapRole(response.role ?? response.roles ?? payload.role ?? payload.roles),
  }

  setToken(token)
  if (id) setUserId(id)
  setStoredUser(user)

  return user
}

interface UserProfileResponse {
  id?: number
  username?: string
  firstName?: string
  lastName?: string
  email?: string
  role?: string
  roles?: string | string[]
}

async function fetchProfile(username: string): Promise<UserProfileResponse> {
  try {
    const { data } = await http.get<UserProfileResponse>(
      `${API_ENDPOINTS.users.byUsername}?username=${encodeURIComponent(username)}`
    )
    return data
  } catch {
    return {}
  }
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const { data } = await http.post<SignInResponse | string>(
      API_ENDPOINTS.auth.signin,
      credentials
    )

    const token = typeof data === 'string'
      ? data
      : (data.token ?? data.accessToken ?? '')

    const partial = typeof data === 'string' ? {} : data
    const profile = await fetchProfile(credentials.username)

    return buildUser(token, { ...partial, ...profile }, {
      username: credentials.username,
    })
  },

  register: async (data: RegisterCredentials): Promise<User> => {
    const { data: responseData } = await http.post<SignInResponse | string>(
      API_ENDPOINTS.auth.signup,
      { ...data }
    )

    const token = typeof responseData === 'string'
      ? responseData
      : (responseData.token ?? responseData.accessToken ?? '')

    return buildUser(token, typeof responseData === 'string' ? {} : responseData, {
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    })
  },

  logout: async (): Promise<void> => {
    // No logout endpoint in backend
  },
}
