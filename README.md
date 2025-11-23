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