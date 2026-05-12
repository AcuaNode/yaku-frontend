import type { User } from '../domain/auth/Auth'

const ACCESS_TOKEN_KEY = 'yaku_access_token'
const USER_ID_KEY      = 'yaku_user_id'
const USER_KEY         = 'yaku_user'

export function getToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function removeToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export function getUserId(): number | null {
  const id = localStorage.getItem(USER_ID_KEY)
  return id ? parseInt(id, 10) : null
}

export function setUserId(id: number): void {
  localStorage.setItem(USER_ID_KEY, String(id))
}

export function getStoredUser(): User | null {
  try {
    const json = localStorage.getItem(USER_KEY)
    return json ? (JSON.parse(json) as User) : null
  } catch {
    return null
  }
}

export function setStoredUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(USER_ID_KEY)
  localStorage.removeItem(USER_KEY)
}
