# 🔐 Sistema de Autenticación - MentorAI

Este documento describe cómo configurar y usar el sistema de autenticación implementado en MentorAI.

## 🚀 Configuración Rápida

### 1. Ejecutar el script de configuración

```bash
./setup-auth.sh
```

Este script automáticamente:
- Instala las dependencias del backend
- Compila el proyecto
- Crea usuarios de prueba en la base de datos

### 2. Iniciar los servicios

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
npm run dev
```

## 👥 Usuarios de Prueba

El sistema incluye los siguientes usuarios preconfigurados:

| Rol | Email | Contraseña | Descripción |
|-----|-------|------------|-------------|
| Admin | `admin@mentorai.com` | `admin123` | Administrador del sistema |
| Profesor | `maria.gonzalez@mentorai.com` | `teacher123` | Profesora de Informática |
| Profesor | `carlos.rodriguez@mentorai.com` | `teacher123` | Profesor de Matemáticas |
| Profesor | `ana.martinez@mentorai.com` | `teacher123` | Profesora de Arte |
| Super Admin | `superadmin@mentorai.com` | `admin456` | Super administrador |

## 🔧 Características del Sistema

### Autenticación JWT
- Tokens de acceso con expiración de 24 horas
- Verificación automática de tokens en cada solicitud
- Almacenamiento seguro en localStorage

### Protección de Rutas
- Todas las páginas principales requieren autenticación
- Redirección automática a `/login` si no está autenticado
- Pantalla de carga durante la verificación del token

### Interfaz de Usuario
- Formulario de login moderno y responsivo
- Validación de credenciales en tiempo real
- Mensajes de error descriptivos
- Indicador de usuario logueado en el header
- Botón de logout accesible

## 🛠️ Estructura del Código

### Backend (`backend/src/`)

```
├── controllers/
│   └── authController.ts      # Lógica de autenticación
├── middleware/
│   └── auth.ts               # Middleware de verificación JWT
├── routes/
│   └── authRoutes.ts         # Rutas de autenticación
└── scripts/
    └── createUsers.ts        # Script para crear usuarios
```

### Frontend (`src/`)

```
├── contexts/
│   └── AuthContext.tsx       # Contexto de autenticación
├── components/
│   └── ProtectedRoute.tsx    # Componente de protección de rutas
└── pages/
    └── Login.tsx             # Página de login
```

## 🔒 Seguridad

### Contraseñas
- Hash con bcryptjs (salt rounds: 10)
- Verificación segura de contraseñas
- No se almacenan contraseñas en texto plano

### Tokens JWT
- Secret key configurable via `JWT_SECRET`
- Expiración automática después de 24 horas
- Verificación de firma en cada solicitud

### Base de Datos
- Tabla `users` con campos seguros
- Índices optimizados para consultas
- Estados de usuario (active/inactive)

## 🚨 Troubleshooting

### Error: "Cannot connect to database"
- Verificar que MySQL esté ejecutándose
- Comprobar credenciales en `.env`
- Ejecutar `npm run dev` en el backend

### Error: "Invalid credentials"
- Verificar que el usuario existe en la base de datos
- Comprobar que la contraseña sea correcta
- Ejecutar el script de creación de usuarios

### Error: "Token expired"
- El token ha expirado (24 horas)
- Hacer logout y volver a iniciar sesión
- Verificar la hora del sistema

## 📝 API Endpoints

### POST `/api/auth/login`
Iniciar sesión con email y contraseña.

**Request:**
```json
{
  "email": "admin@mentorai.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "email": "admin@mentorai.com",
      "name": "Administrador",
      "role": "admin"
    }
  }
}
```

### POST `/api/auth/logout`
Cerrar sesión (limpiar token).

### GET `/api/auth/verify`
Verificar token de acceso (requiere Authorization header).

## 🔄 Flujo de Autenticación

1. **Acceso inicial**: Usuario redirigido a `/login`
2. **Login**: Usuario ingresa credenciales
3. **Verificación**: Backend valida contra base de datos
4. **Token**: Se genera JWT y se almacena en localStorage
5. **Acceso**: Usuario redirigido a página principal
6. **Protección**: Todas las rutas verifican token automáticamente
7. **Logout**: Token eliminado, usuario redirigido a login

## 🎯 Próximas Mejoras

- [ ] Recuperación de contraseña por email
- [ ] Registro de nuevos usuarios
- [ ] Roles y permisos más granulares
- [ ] Auditoría de sesiones
- [ ] Autenticación de dos factores
- [ ] Integración con OAuth (Google, Microsoft) 