export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterCredentials {
  username: string
  firstName: string
  lastName: string
  email: string
  password: string
  role: 'ADMIN' | 'OPERATOR'
  farmToken?: string
}

export interface User {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  role: 'SUPERUSUARIO' | 'OPERADOR' | 'ADMIN'
}
