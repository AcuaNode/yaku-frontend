# Endpoints requeridos por el frontend

## Estado de funcionalidades

| Funcionalidad | Página | Estado | Notas |
|---|---|---|---|
| Login | Login | ✅ Funciona | |
| Registro | Registro | ✅ Funciona | |
| Cargar perfil (nombre, email) | Configuración / Topbar | ✅ Funciona | Requiere `GET /v1/users/by-username` |
| Dashboard — estadísticas | Dashboard | ✅ Funciona | Filtrado por usuario vía `ownerId` |
| Dashboard — gráfico de sensores | Dashboard | ✅ Funciona | Vacío si no hay estanques |
| Dashboard — alertas recientes | Dashboard | ✅ Funciona | |
| Dashboard — calidad promedio | Dashboard | ✅ Funciona | Calculado dinámicamente según lecturas |
| Modal crear granja (primer acceso) | Dashboard | ✅ Funciona | Solo aparece si el usuario no tiene granja |
| Lista de estanques | Estanques | ✅ Funciona | |
| Detalle del estanque | Estanques | ✅ Funciona | |
| Historial de lecturas | Detalle estanque | ✅ Funciona | Vacío si no hay datos históricos |
| Vincular equipo a estanque | Detalle estanque | ✅ Funciona | Solo muestra equipos `AVAILABLE` |
| Nuevo registro manual | Detalle estanque | ✅ Funciona | Requiere al menos un sensor LINKED al estanque |
| Lista de equipos | Equipos | ✅ Funciona | Filtrado por usuario |
| Registrar equipo nuevo | Equipos | ✅ Funciona | |
| Eliminar equipo | Equipos | ✅ Funciona | |
| Lista de operadores | Operadores | ✅ Funciona | Muestra usuarios con `role = OPERATOR` |
| Token de granja | Operadores | ✅ Funciona | |
| Regenerar token de granja | Operadores | ✅ Funciona | |
| Lista de notificaciones | Notificaciones | ✅ Funciona | |
| Marcar notificaciones como leídas | Notificaciones | ❌ Sin endpoint | El backend no tiene este endpoint aún |
| Suscripción activa | Configuración | ✅ Funciona | Cruza `/v1/subscriptions/{id}` con `/v1/plans` |
| Cambiar contraseña | Configuración | ❌ Sin endpoint | El backend no tiene este endpoint aún |
| Editar datos del estanque | Detalle estanque | ❌ Sin endpoint | El backend no tiene `PUT /v1/ponds/{id}` |
| Desasignar operador del estanque | Detalle estanque | ✅ Funciona | Botón en la tarjeta del operador asignado |
| Exportar CSV de lecturas | Detalle estanque | ✅ Funciona | Descarga CSV del historial, deshabilitado si no hay datos |
| Asignar operador al estanque | Detalle estanque | ✅ Funciona | Modal con lista de operadores disponibles |

---

Base URL: `http://localhost:8080/api`

Todos los endpoints (salvo login y registro) requieren el header:
```
Authorization: Bearer <token>
```

---

## Autenticación

### POST `/v1/users/signin`
Inicia sesión. Devuelve el token JWT.

**Body:**
```json
{ "username": "string", "password": "string" }
```

**Respuesta esperada** (cualquiera de estas formas es aceptada):
```json
"<jwt_string>"
```
```json
{ "token": "string", "accessToken": "string" }
```

---

### POST `/v1/users/signup`
Registra un nuevo usuario.

**Body:**
```json
{
  "username": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "role": "ADMIN"
}
```

**Respuesta esperada:** igual que signin (token JWT).

---

## Usuarios

### GET `/v1/users/by-username?username={username}`
Obtiene el perfil completo del usuario tras el login (necesario para mostrar nombre y email en la UI).

**Respuesta esperada:**
```json
{
  "id": 1,
  "username": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "role": "ADMIN"
}
```

---

### GET `/v1/users`
Lista todos los usuarios. Usado en la página de Operadores para filtrar por `role === "OPERATOR"`.

**Respuesta esperada:** array de objetos usuario (mismos campos que arriba + `createdAt`).

---

## Granjas (Farms)

### GET `/v1/farms`
Lista todas las granjas. El frontend filtra por `ownerId` para mostrar solo las del usuario autenticado.

> **Campo crítico:** el objeto debe incluir `ownerId` (ID numérico del dueño) para que el filtrado por usuario funcione correctamente.

**Respuesta esperada:**
```json
[
  {
    "id": 1,
    "name": "string",
    "ownerId": 1,
    "address": "string",
    "farmToken": "string"
  }
]
```

---

### POST `/v1/farms`
Crea una nueva granja. Se llama cuando un usuario nuevo accede al dashboard por primera vez.

**Body:**
```json
{ "name": "string", "address": "string" }
```

---

### PATCH `/v1/farms/{id}/token`
Regenera el token de la granja (botón en página de Operadores).

**Respuesta esperada:** objeto granja actualizado con el nuevo `farmToken`.

---

## Estanques (Ponds)

### GET `/v1/ponds/farm/{farmId}`
Lista los estanques de una granja específica. Este es el endpoint central para el filtrado por usuario — **el frontend ya no usa `GET /v1/ponds` general**.

**Respuesta esperada:**
```json
[
  {
    "id": 1,
    "farmId": 1,
    "name": "string",
    "species": "string",
    "volume": 100,
    "status": "ACTIVE"
  }
]
```

---

### GET `/v1/ponds/{id}`
Obtiene un estanque por ID. Usado en la página de detalle.

---

### POST `/v1/ponds`
Crea un estanque nuevo.

**Body:**
```json
{
  "farmId": 1,
  "name": "string",
  "species": "string",
  "volume": 100
}
```

---

### POST `/v1/ponds/{pondId}/assignments`
Asigna un operador a un estanque (botón "Asignar Operador" en detalle del estanque).

> **Estado actual:** el botón existe en la UI pero este endpoint aún no está conectado.

---

## Telemetría

### GET `/v1/telemetry/ponds/{pondId}/status`
Lecturas actuales del estanque (temperatura, pH, oxígeno). Devuelve un array con la última lectura por tipo de sensor.

**Respuesta esperada:**
```json
[
  {
    "id": 1,
    "pondId": 1,
    "sensorType": "TEMPERATURE",
    "measurement": { "value": 24.5, "unit": "°C" },
    "timestamp": "2024-01-15T10:30:00Z"
  },
  { "sensorType": "PH", "measurement": { "value": 7.2, "unit": "" }, ... },
  { "sensorType": "OXYGEN", "measurement": { "value": 6.8, "unit": "mg/L" }, ... }
]
```

> Retornar `404` cuando no hay lecturas es aceptado — el frontend lo maneja con un catch silencioso.

---

### GET `/v1/telemetry/ponds/{pondId}/historical`
Histórico de lecturas agregadas. Usado para el gráfico en la página de detalle del estanque.

**Respuesta esperada:**
```json
[
  {
    "id": 1,
    "pondId": 1,
    "sensorType": "TEMPERATURE",
    "minValue": 22.0,
    "maxValue": 26.0,
    "averageValue": 24.0,
    "periodStart": "2024-01-15T00:00:00Z",
    "periodEnd": "2024-01-15T23:59:59Z"
  }
]
```

---

### POST `/v1/telemetry/manual-ingest`
Inserta una lectura manual. Se envía **una request por cada tipo de sensor** (el frontend llama a este endpoint 3 veces en paralelo: TEMPERATURE, PH, OXYGEN).

> **Importante:** `sensorId` debe ser el ID de un equipo tipo SENSOR que esté vinculado (`LINKED`) al estanque. Si el sensor no está vinculado, el backend retorna error.

**Body:**
```json
{
  "sensorId": 1,
  "pondId": 1,
  "sensorType": "TEMPERATURE",
  "value": 24.5,
  "unit": "°C",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

Valores válidos para `sensorType`: `TEMPERATURE`, `PH`, `OXYGEN`.

---

## Equipos (Equipment)

### GET `/v1/equipment`
Lista todo el equipamiento. El frontend filtra:
- Muestra equipos `LINKED` solo si su `pondId` pertenece al usuario autenticado.
- Muestra todos los equipos `AVAILABLE` (sin dueño asignado).

> **Campo crítico:** el objeto debe incluir `pondId` para que el filtrado funcione.

**Respuesta esperada:**
```json
[
  {
    "id": 1,
    "pondId": 1,
    "type": "SENSOR",
    "status": "LINKED",
    "name": "string",
    "physicalCode": "string",
    "address": "string"
  }
]
```

Valores válidos para `type`: `SENSOR`, `ACTUATOR`.  
Valores válidos para `status`: `AVAILABLE`, `LINKED`.

---

### POST `/v1/equipment`
Registra un nuevo equipo.

**Body:**
```json
{
  "type": "SENSOR",
  "name": "string",
  "physicalCode": "string"
}
```

---

### DELETE `/v1/equipment/{id}`
Elimina un equipo.

---

### POST `/v1/equipment/{equipmentId}/link/{pondId}`
Vincula un equipo a un estanque. Usado en el modal "+ Vincular" dentro del detalle del estanque.

---

## Suscripciones y Planes

### GET `/v1/subscriptions/{userId}`
Obtiene la suscripción del usuario. Mostrado en la página de Configuración.

**Respuesta esperada:**
```json
{
  "id": 1,
  "userId": 1,
  "planId": 2,
  "status": "ACTIVE"
}
```

---

### GET `/v1/plans`
Lista los planes disponibles. El frontend cruza esta lista con el `planId` de la suscripción para mostrar el nombre y precio del plan.

**Respuesta esperada:**
```json
[
  { "id": 1, "name": "FREE", "price": 0, "maxPonds": 2 },
  { "id": 2, "name": "PREMIUM", "price": 29.99, "maxPonds": 50 }
]
```

---

## Notificaciones

### GET `/v1/users/{userId}/notifications`
Lista las notificaciones del usuario. Usado en el Dashboard (alertas recientes) y en la página de Notificaciones.

**Respuesta esperada:**
```json
[
  {
    "id": 1,
    "type": "TEMPERATURE_ALERT",
    "message": "string",
    "recipientUserId": 1,
    "triggerTemperature": 35.0,
    "triggerPh": null,
    "triggerHardwareStatus": null,
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

Tipos de notificación reconocidos por el frontend: cualquier string que contenga `TEMP`, `PH`, `MAINT`, `HARDWARE`, `OPERATOR` o `USER`.

> **Nota:** marcar notificaciones como leídas no tiene endpoint en el backend actualmente — la operación queda pendiente.

---

## Resumen de campos críticos

| Recurso | Campo crítico | Motivo |
|---|---|---|
| `FarmResource` | `ownerId` | El frontend filtra granjas por usuario usando este campo |
| `EquipmentResource` | `pondId` | El frontend filtra equipos vinculados por estanque del usuario |
| `SubscriptionResource` | `planId` | El frontend cruza con `/v1/plans` para mostrar nombre del plan |
| Telemetría manual | `sensorId` | Debe ser un sensor LINKED al estanque; si no, el backend rechaza la solicitud |
