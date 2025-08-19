# MentorAI Backend API

Backend API para la aplicación MentorAI Virtual Teacher.

## 🚀 Características

- **RESTful API** con Express.js y TypeScript
- **Base de datos MySQL** con conexión pool
- **Autenticación JWT** (preparado para futuras implementaciones)
- **CORS configurado** para desarrollo
- **Manejo de errores** centralizado
- **Validación de datos** en endpoints

## 📋 Prerrequisitos

- Node.js (versión 18 o superior)
- MySQL (versión 8.0 o superior)
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio** (si no lo has hecho ya):
```bash
git clone <tu-repositorio>
cd mentorai-virtual-teacher/backend
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:
```bash
cp env.example .env
```

Edita el archivo `.env` con tus configuraciones:
```env
# Configuración del servidor
PORT=5000
NODE_ENV=development

# Configuración de la base de datos MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_aqui
DB_NAME=mentorai_db
DB_PORT=3306

# Configuración del frontend
FRONTEND_URL=http://localhost:5173

# JWT Secret (cambiar en producción)
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
```

4. **Configurar la base de datos**:
```bash
# Conectarse a MySQL
mysql -u root -p

# Ejecutar el script de creación
source database/schema.sql
```

## 🏃‍♂️ Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

## 📊 Endpoints de la API

### Clases

- `GET /api/classes` - Obtener todas las clases
- `GET /api/classes/:id` - Obtener una clase por ID
- `GET /api/classes/search?q=term` - Buscar clases
- `POST /api/classes` - Crear una nueva clase
- `PUT /api/classes/:id` - Actualizar una clase
- `DELETE /api/classes/:id` - Eliminar una clase

### Funcionalidades específicas de MentorAI

- `PUT /api/classes/:id/recording` - Actualizar URL de grabación
- `PUT /api/classes/:id/transcript` - Actualizar transcripción
- `PUT /api/classes/:id/analysis` - Actualizar datos de análisis

### Health Check

- `GET /api/health` - Verificar estado de la API y conexión a BD

## 🗄️ Estructura de la Base de Datos

### Tabla `classes`
- `id` - UUID único
- `name` - Nombre de la clase
- `teacher` - Nombre del profesor
- `description` - Descripción de la clase
- `subject` - Materia
- `grade_level` - Nivel educativo
- `duration` - Duración en minutos
- `status` - Estado (active/inactive)
- `recording_url` - URL de la grabación
- `transcript` - Transcripción de la clase
- `analysis_data` - Datos de análisis (JSON)
- `created_at` - Fecha de creación
- `updated_at` - Fecha de actualización

### Tabla `users` (para futuras funcionalidades)
- `id` - UUID único
- `email` - Email del usuario
- `password_hash` - Hash de la contraseña
- `name` - Nombre del usuario
- `role` - Rol (teacher/admin/student)
- `status` - Estado (active/inactive)

### Tabla `class_analyses`
- `id` - UUID único
- `class_id` - ID de la clase (foreign key)
- `analysis_type` - Tipo de análisis
- `analysis_data` - Datos del análisis (JSON)
- `created_at` - Fecha de creación

### Tabla `class_moments`
- `id` - UUID único
- `class_id` - ID de la clase (foreign key)
- `moment_type` - Tipo de momento
- `timestamp` - Tiempo en segundos
- `description` - Descripción del momento
- `data` - Datos adicionales (JSON)

## 🔧 Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo con nodemon
- `npm run build` - Compilar TypeScript a JavaScript
- `npm start` - Ejecutar en modo producción
- `npm test` - Ejecutar tests (pendiente de implementar)

## 🌐 Conectar con el Frontend

El backend está configurado para aceptar conexiones desde `http://localhost:5173` (Vite dev server). Para conectar tu aplicación React:

```typescript
// Ejemplo de uso en el frontend
const API_BASE_URL = 'http://localhost:5000/api';

// Obtener todas las clases
const response = await fetch(`${API_BASE_URL}/classes`);
const classes = await response.json();

// Crear una nueva clase
const newClass = await fetch(`${API_BASE_URL}/classes`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Mi Clase',
    teacher: 'Profesor',
    description: 'Descripción de la clase'
  })
});
```

## 🔒 Seguridad

- CORS configurado para desarrollo
- Validación de datos en endpoints
- Preparado para autenticación JWT
- Sanitización de consultas SQL con parámetros

## 📝 Próximas Funcionalidades

- [ ] Autenticación JWT completa
- [ ] Middleware de autorización
- [ ] Validación de datos con Joi o Zod
- [ ] Tests unitarios y de integración
- [ ] Logging con Winston
- [ ] Rate limiting
- [ ] Documentación con Swagger
- [ ] Dockerización

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. 