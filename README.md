# Backend Conecta Pro

Backend para la aplicación "Conecta Pro", desarrollado con Node.js, Express y MongoDB. Este módulo maneja la autenticación, gestión de usuarios y verificación de identidad.

## 🚀 Requisitos Previos

- **Node.js** (v14 o superior)
- **MongoDB** (Instancia local o en la nube)

## 🛠️ Instalación y Configuración

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

2.  **Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto basándote en el siguiente ejemplo:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/conecta_pro
    JWT_SECRET=tu_secreto_super_seguro
    JWT_EXPIRE=1h
    JWT_REFRESH_SECRET=tu_secreto_refresh
    JWT_REFRESH_EXPIRE=7d
    ```

3.  **Iniciar el servidor:**
    ```bash
    npm run dev
    ```

4.  **Poblar Base de Datos (Data Seeding):**
    Para tener datos iniciales (Categorías, Servicios, Proveedores, Usuario de prueba), ejecuta:
    ```bash
    npm run seed
    ```
    *Nota: Esto creará usuarios como 'devon.lane@example.com' (Provider) y 'fara.binladen@example.com' (Client) con contraseña 'password123'.*

## 📚 Documentación de la API

A continuación se detallan los endpoints disponibles con sus respectivos ejemplos de solicitud y respuesta.

### 1. Módulo de Autenticación

#### a. Iniciar Sesión
**POST** `/auth/login`

**Entrada:**
```json
{
 "phone_number": "+51 994 320 250",
 "password": "MiClaveSegura$2024"
}
```

**Salida:**
```json
{
 "success": true,
 "message": "Inicio de sesión exitoso.",
 "data": {
 "user": {
 "id": "usr_1234567890",
 "full_name": "Fara Bin Laden",
 "phone_number": "+51 994 320 250",
 "email": "fara_example@example.com",
 "account_type": "CONECTA_PRO",
 "status": {
 "phone_verified": true,
 "identity_verified": true,
 "profile_completed": true
 }
 },
 "tokens": {
 "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 "refresh_token": "d1f4f0c3-0a0e-4f50-9d5e-000000000000",
 "expires_in": 3600
 }
 },
 "errors": []
}
```

#### b. Registrar Usuario
**POST** `/auth/register`

**Entrada:**
```json
{
 "full_name": "Fara Bin Laden",
 "email": "fara_example@example.com",
 "phone_number": "+51 555 0114",
 "password": "MiClaveSegura$2024",
 "account_type": "CONECTA_PRO",
 "accept_terms": true,
 "accept_privacy_policy": true
}
```

**Salida:**
```json
{
 "success": true,
 "message": "Registro iniciado correctamente.",
 "data": {
 "user_id": "usr_1234567890",
 "full_name": "Fara Bin Laden",
 "email": "fara_example@example.com",
 "phone_number": "+51 555 0114",
 "account_type": "CONECTA_PRO",
 "status": {
 "phone_verified": false,
 "identity_verified": false,
 "profile_completed": false
 },
 "tokens": {
 "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 "refresh_token": "d1f4f0c3-0a0e-4f50-9d5e-000000000000",
 "expires_in": 3600
 }
 },
 "errors": []
}
```

#### c. Solicitar Verificación de Teléfono
**POST** `/auth/verify-phone/request`

**Entrada:**
```json
{
 "phone_number": "+51 994 320 250"
}
```

**Salida:**
```json
{
 "success": true,
 "message": "Se ha enviado un código de verificación por SMS.",
 "data": {
 "masked_phone": "+51 *** *** 250",
 "expires_in": 300,
 "attempts_left": 3
 },
 "errors": []
}
```

#### d. Confirmar Verificación de Teléfono
**POST** `/auth/verify-phone/confirm`

**Entrada:**
```json
{
 "phone_number": "+51 994 320 250",
 "code": "3333"
}
```

**Salida:**
```json
{
 "success": true,
 "message": "Número de teléfono verificado correctamente.",
 "data": {
 "user_id": "usr_1234567890",
 "phone_verified": true
 },
 "errors": []
}
```

### 2. Módulo de Usuario

#### e. Actualizar Información Personal
**PATCH** `/users/me/personal-info`
*Requiere Header:* `Authorization: Bearer <access_token>`

**Entrada:**
```json
{
 "full_name": "Fara Bin Laden",
 "gender": "FEMALE",
 "birth_date": "1995-08-24"
}
```

**Salida:**
```json
{
 "success": true,
 "message": "Información personal actualizada correctamente.",
 "data": {
 "user_id": "usr_1234567890",
 "full_name": "Fara Bin Laden",
 "gender": "FEMALE",
 "birth_date": "1995-08-24",
 "profile_completed": true
 },
 "errors": []
}
```

### 3. Módulo de Verificación

#### f. Obtener Opciones de Identidad
**GET** `/verification/identity/options?country=PE`

**Entrada (Query Param):** `country=PE`

**Salida:**
```json
{
 "success": true,
 "data": {
 "country": "PE",
 "document_types": [
 {
 "code": "NATIONAL_ID",
 "label": "Documento de identidad"
 },
 {
 "code": "PASSPORT",
 "label": "Pasaporte"
 },
 {
 "code": "DRIVER_LICENSE",
 "label": "Licencia de conducir"
 }
 ]
 },
 "errors": []
}
```

#### g. Subir Documento de Identidad
**POST** `/verification/identity/document`
*Requiere Header:* `Authorization: Bearer <access_token>`

**Entrada:**
```json
{
 "country": "PE",
 "document_type": "PASSPORT",
 "image_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA..."
}
```

**Salida:**
```json
{
 "success": true,
 "message": "Documento recibido para verificación.",
 "data": {
 "verification_id": "ver_987654321",
 "status": "VERIFIED"
 },
 "errors": []
}
```

#### h. Consultar Estado de Verificación
**GET** `/verification/identity/status`
*Requiere Header:* `Authorization: Bearer <access_token>`

**Salida:**
```json
{
 "success": true,
 "data": {
 "user_id": "usr_1234567890",
 "status": "VERIFIED",
 "checked_at": "2025-11-23T15:32:00Z"
 },
 "errors": []
}
```

### 4. Módulo Cliente (Home & Assets)

#### i. Obtener Dashboard (Home)
**GET** `/client/home`
*Requiere Header:* `Authorization: Bearer <access_token>`

**Entrada (Query Params):**
- `latitude`: Latitud actual (ej. -12.0464)
- `longitude`: Longitud actual (ej. -77.0428)

**Salida:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "usr_123", "full_name": "Fara Bin Laden" },
    "delivery_address": { "label": "Ate", "full_address": "Av. Los Ingenieros 123..." },
    "cart": { "items_count": 1 },
    "categories": [{ "id": "cat_gasfiteria", "name": "Gasfitería" }],
    "top_services": [{ "id": "srv_001", "title": "Servicio de electricista", "price": 20.0 }]
  }
}
```

#### j. Listar Ubicaciones
**GET** `/client/locations`
*Requiere Header:* `Authorization: Bearer <access_token>`

**Salida:**
```json
{
  "success": true,
  "data": {
    "locations": [
      { "id": "loc_1", "label": "Casa", "full_address": "21B Av Morelli...", "is_default": true }
    ]
  }
}
```

#### k. Crear Ubicación
**POST** `/client/locations`
*Requiere Header:* `Authorization: Bearer <access_token>`

**Entrada:**
```json
{
  "label": "Casa 2",
  "full_address": "122C Av La Marina...",
  "latitude": -12.0865,
  "longitude": -77.0796,
  "set_as_default": false
}
```

#### l. Métodos de Pago
**GET** `/client/payment-methods`
*Requiere Header:* `Authorization: Bearer <access_token>`

**Salida:**
```json
{
  "success": true,
  "data": {
    "payment_methods": [
      { "id": "pm_cash", "type": "CASH", "label": "Efectivo", "is_default": true }
    ]
  }
}
```

#### m. Crear Solicitud de Servicio (Booking)
**POST** `/client/service-request`
*Requiere Header:* `Authorization: Bearer <access_token>`

**Entrada:**
```json
{
  "service_id": "srv_010",
  "location_id": "loc_1",
  "scheduled_date": "2025-11-25",
  "scheduled_time_range": { "start": "08:00", "end": "09:00" },
  "payment_method_id": "pm_cash",
  "notes": "Traer escalera",
  "price_summary": { "currency": "PEN", "total": 20.0 }
}
```

**Salida:**
```json
{
  "success": true,
  "message": "Solicitud creada...",
  "data": {
    "request_id": "sr_1000",
    "status": "PENDING_PROVIDER_CONFIRMATION"
  }
}
```

### 5. Módulo Servicios (Catálogo)

#### n. Listar Servicios por Categoría
**GET** `/categories/:categoryId/services`
*Requiere Header:* `Authorization: Bearer <access_token>`

**Entrada (Query Params):**
- `page`: Número de página (defecto 1)
- `page_size`: Tamaño de página (defecto 10)
- `search`: Término de búsqueda (opcional)

#### o. Detalle de Servicio
**GET** `/services/:serviceId`
*Requiere Header:* `Authorization: Bearer <access_token>`

**Salida:**
```json
{
  "success": true,
  "data": {
    "id": "srv_010",
    "title": "Revisión de cables...",
    "provider": { "name": "Marry Jane" },
    "comments": []
  }
}
```

#### p. Buscar Servicios
**GET** `/services/search?query=...`
*Requiere Header:* `Authorization: Bearer <access_token>`

### 6. Módulo Proveedor

#### q. Listar Solicitudes (Provider)
**GET** `/provider/service-requests`
*Requiere Header:* `Authorization: Bearer <access_token>`

**Entrada (Query Params):**
- `status`: Filtrar por estado (PENDING_PROVIDER_CONFIRMATION, ACCEPTED, etc.)

#### r. Aceptar Solicitud
**POST** `/provider/service-requests/:requestId/accept`
*Requiere Header:* `Authorization: Bearer <access_token>`

**Entrada:**
```json
{ "notes": "Llego en 10 min" }
```

#### s. Rechazar Solicitud
**POST** `/provider/service-requests/:requestId/reject`
*Requiere Header:* `Authorization: Bearer <access_token>`

**Entrada:**
```json
{ "reason": "No disponible" }
```

### 7. Extensiones de Usuario y Auth

#### t. Perfil de Usuario (Me)
**GET** `/users/me`
*Requiere Header:* `Authorization: Bearer <access_token>`

#### u. Cambiar Contraseña
**POST** `/auth/change-password`
*Requiere Header:* `Authorization: Bearer <access_token>`

**Entrada:**
```json
{ "current_password": "old", "new_password": "new" }
```

#### v. Cerrar Sesión
**POST** `/auth/logout`
*Requiere Header:* `Authorization: Bearer <access_token>`

**Entrada:**
```json
{ "refresh_token": "..." }
```