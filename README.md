# OnTrack Assistant - Frontend

Una aplicación web moderna para el análisis de clases educativas con inteligencia artificial.

## 🚀 Características

- **Grabación de Clases**: Graba clases en tiempo real con transcripción automática
- **Análisis con IA**: Análisis inteligente de contenido usando Straico API
- **Gestión de Estudiantes**: Administra estudiantes y clases
- **Dashboard Analytics**: Métricas y reportes detallados
- **Asistente de Voz**: Integración con ElevenLabs para asistencia por voz
- **Autenticación**: Sistema de login con roles (Profesor/Admin)

## 🛠️ Tecnologías

- **React 18** con TypeScript
- **Vite** para build y desarrollo
- **Tailwind CSS** para estilos
- **Shadcn/ui** para componentes
- **React Router DOM** para navegación
- **Axios** para peticiones HTTP
- **ElevenLabs** para asistente de voz

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env.local

# Editar .env.local con tus configuraciones
VITE_API_BASE_URL=http://localhost:3001/api
VITE_ELEVENLABS_AGENT_ID=tu_agent_id
```

## 🚀 Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🔧 Configuración

### Variables de Entorno

- `VITE_API_BASE_URL`: URL del backend API
- `VITE_ELEVENLABS_AGENT_ID`: ID del agente de ElevenLabs

### ElevenLabs Setup

Ver [ELEVENLABS_SETUP.md](./ELEVENLABS_SETUP.md) para configuración detallada.

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Auth/           # Componentes de autenticación
│   ├── Layout/         # Layout principal
│   └── ui/             # Componentes UI base
├── contexts/           # Contextos de React
├── hooks/              # Hooks personalizados
├── pages/              # Páginas de la aplicación
├── services/           # Servicios API
├── types/              # Tipos TypeScript
└── utils/              # Utilidades
```

## 🔗 Backend

Este frontend se conecta con el backend de OnTrack. Ver el repositorio del backend para más detalles.

## 📝 Licencia

MIT License