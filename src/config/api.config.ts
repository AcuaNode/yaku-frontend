export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api'

export const API_ENDPOINTS = {
  auth: {
    login:    '/auth/login',
    register: '/auth/register',
    logout:   '/auth/logout',
    refresh:  '/auth/refresh',
    me:       '/auth/me',
  },
  estanques: {
    base:     '/estanques',
    list:     '/estanques/list',
    lecturas: '/estanques/lecturas',
    stats:    '/estanques/stats',
  },
  equipos: {
    base:  '/equipos',
    stats: '/equipos/stats',
  },
  operadores: {
    base:       '/operadores',
    stats:      '/operadores/stats',
    farmToken:  '/operadores/farm-token',
    refreshToken: '/operadores/farm-token/refresh',
  },
  notificaciones: {
    base:         '/notificaciones',
    markAllRead:  '/notificaciones/mark-all-read',
  },
  sensores: {
    base:  '/sensores',
    stats: '/sensores/stats',
  },
  alertas: {
    base: '/alertas',
  },
} as const
