import type { LoginCredentials, RegisterCredentials, User } from '../../domain/auth/Auth'

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    // TODO: POST /api/auth/login
    return {
      id: '1',
      username: credentials.username,
      firstName: 'Admin',
      lastName: 'Principal',
      email: 'admin@yacucontrol.pe',
      role: 'SUPERUSUARIO',
    }
  },

  register: async (data: RegisterCredentials): Promise<User> => {
    // TODO: POST /api/auth/register
    return {
      id: '2',
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: 'OPERADOR',
    }
  },

  logout: async (): Promise<void> => {
    // TODO: POST /api/auth/logout
  },
}
