# OnTrack Assistant

> Nota: Para actualizar el favicon, convierte unnamed.webp a favicon.ico y reemplaza public/favicon.ico.

*Asistente virtual educativo con inteligencia artificial para aprendizaje personalizado*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![GitHub last commit](https://img.shields.io/github/last-commit/Juanes1203/mentorai-virtual-teacher)
![Vite](https://img.shields.io/badge/Vite-4.4.5-646CFF?logo=vite)
![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
[![Open in GitHub Codespaces](https://img.shields.io/badge/Open%20in-GitHub%20Codespaces-blue?logo=github)](https://codespaces.new/Juanes1203/mentorai-virtual-teacher)

## 🌟 Descripción

OnTrack Assistant es un tutor virtual que utiliza tecnologías modernas para ofrecer:
- 🎯 Experiencias de aprendizaje interactivas
- 🔄 Adaptación a diferentes estilos de aprendizaje
- ⚡ Retroalimentación en tiempo real
- 📱 Interfaz accesible y responsive
- 🌐 Soporte multi-idioma
- 📊 Panel de progreso estudiantil
- 🎙️ Análisis de clases en tiempo real
- 📚 Integración con RAG para procesamiento de materiales educativos

## 🛠 Stack Tecnológico

### Frontend
| Tecnología       | Uso                          | Versión |
|------------------|------------------------------|---------|
| React           | Biblioteca principal         | 18.2    |
| TypeScript      | Tipado estático              | 5.0+    |
| Vite            | Entorno de desarrollo        | 4.4+    |
| shadcn-ui       | Componentes UI               | Nuevo   |
| Tailwind CSS    | Utilidades CSS               | 3.3+    |

### Backend
| Tecnología       | Uso                          | Versión |
|------------------|------------------------------|---------|
| Node.js         | Entorno de ejecución        | 18+     |
| Express.js      | Framework web               | 4.18+   |
| TypeScript      | Tipado estático              | 5.0+    |
| MySQL           | Base de datos               | 8.0+    |
| JWT             | Autenticación               | 9.0+    |

## ✨ Características

<div align="center">

| 🚀 Rendimiento | 🎨 Diseño | 🔧 Funcionalidad |
|---------------|----------|------------------|
| Carga ultrarrápida | Interface limpia | Tutoría personalizada |
| Optimizado para producción | Totalmente responsive | Retroalimentación AI |
| Build con Vite | Accesibilidad WCAG | Actualizaciones en vivo |
| PWA Ready     | Dark/Light Mode | Gamificación |

</div>

## 🚀 Primeros Pasos

### Requisitos
- Node.js v18+
- MySQL v8.0+
- npm v9+ o pnpm

### Frontend
```bash
# 1. Clonar repositorio
git clone https://github.com/Juanes1203/mentorai-virtual-teacher.git
cd mentorai-virtual-teacher

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

### Backend
```bash
# 1. Navegar al directorio backend
cd backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp env.example .env
# Editar .env con tus configuraciones de MySQL

# 4. Configurar base de datos
mysql -u root -p < database/schema.sql

# 5. Iniciar servidor de desarrollo
npm run dev
```

## 📊 Estructura del Proyecto

```
mentorai-virtual-teacher/
├── src/                    # Frontend React
│   ├── components/         # Componentes reutilizables
│   ├── pages/             # Páginas de la aplicación
│   ├── services/          # Servicios y APIs
│   └── types/             # Definiciones de TypeScript
├── backend/               # Backend Node.js
│   ├── src/
│   │   ├── config/        # Configuración de BD
│   │   ├── controllers/   # Controladores
│   │   ├── models/        # Modelos de datos
│   │   └── routes/        # Rutas de la API
│   └── database/          # Scripts de BD
└── OnTrack_Assistant_DB.mwb        # Diseño de BD (MySQL Workbench)
```

## 🔧 Scripts Disponibles

### Frontend
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de producción

### Backend
- `npm run dev` - Servidor de desarrollo con nodemon
- `npm run build` - Compilar TypeScript
- `npm start` - Servidor de producción

## 📡 API Endpoints

### Clases
- `GET /api/classes` - Obtener todas las clases
- `GET /api/classes/:id` - Obtener una clase por ID
- `GET /api/classes/search?q=term` - Buscar clases
- `POST /api/classes` - Crear una nueva clase
- `PUT /api/classes/:id` - Actualizar una clase
- `DELETE /api/classes/:id` - Eliminar una clase

### Funcionalidades OnTrack Assistant
- `PUT /api/classes/:id/recording` - Actualizar URL de grabación
- `PUT /api/classes/:id/transcript` - Actualizar transcripción
- `PUT /api/classes/:id/analysis` - Actualizar datos de análisis

## 🗄️ Base de Datos

El proyecto incluye un diseño de base de datos MySQL con las siguientes tablas principales:

- **classes** - Información de las clases
- **users** - Usuarios del sistema
- **class_analyses** - Análisis detallados de clases
- **class_moments** - Momentos destacados de las clases

## 🚀 Despliegue

### Frontend
La aplicación se despliega automáticamente en GitHub Pages cuando se hace push a la rama main.

### Backend
Para desplegar el backend, puedes usar:
- Heroku
- Railway
- DigitalOcean
- AWS EC2

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
