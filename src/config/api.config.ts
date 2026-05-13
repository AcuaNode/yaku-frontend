export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://yaku-back-b5ggakd7awhucvaq.canadacentral-01.azurewebsites.net/api'

export const API_ENDPOINTS = {
  auth: {
    signin: '/v1/users/signin',
    signup: '/v1/users/signup',
  },
  users: {
    base:                    '/v1/users',
    byUsername:              '/v1/users/by-username',
    availableRoles:          '/v1/users/available-roles',
    notifications:           (userId: number) => `/v1/users/${userId}/notifications`,
    markNotificationsRead:   (userId: number) => `/v1/users/${userId}/notifications/read`,
    changePassword:          (userId: number) => `/v1/users/${userId}/password`,
    deviceTokens:            (userId: number) => `/v1/users/${userId}/device-tokens`,
  },
  farms: {
    base:            '/v1/farms',
    byId:            (id: number) => `/v1/farms/${id}`,
    regenerateToken: (id: number) => `/v1/farms/${id}/token`,
    createFarmToken: (farmId: number) => `/v1/iam/farms/${farmId}/tokens`,
  },
  ponds: {
    base:      '/v1/ponds',
    byId:      (id: number) => `/v1/ponds/${id}`,
    byFarm:    (farmId: number) => `/v1/ponds/farm/${farmId}`,
    assign:    (pondId: number) => `/v1/ponds/${pondId}/assignments`,
    deassign:  (pondId: number, operatorId: number) => `/v1/ponds/${pondId}/deassignments/${operatorId}`,
  },
  telemetry: {
    status:     (pondId: number) => `/v1/telemetry/ponds/${pondId}/status`,
    historical: (pondId: number) => `/v1/telemetry/ponds/${pondId}/historical`,
    ingest:     '/v1/telemetry/manual-ingest',
  },
  equipment: {
    base:  '/v1/equipment',
    byId:  (id: number) => `/v1/equipment/${id}`,
    link:  (equipmentId: number, pondId: number) => `/v1/equipment/${equipmentId}/link/${pondId}`,
  },
  subscriptions: {
    byUser: (userId: number) => `/v1/subscriptions/${userId}`,
  },
  plans: {
    base: '/v1/plans',
  },
} as const
