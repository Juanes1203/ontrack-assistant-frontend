# Configuración de ElevenLabs Voice Assistant

## Error de Autorización

Si ves el error "Could not authorize the conversation", significa que las credenciales de ElevenLabs no están configuradas correctamente.

## Pasos para Configurar

### 1. Obtener API Key
1. Ve a [ElevenLabs](https://elevenlabs.io/)
2. Crea una cuenta o inicia sesión
3. Ve a tu perfil y genera una API key
4. Copia la API key

### 2. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:

```bash
# ElevenLabs Configuration
ELEVENLABS_API_KEY=tu_api_key_aqui
ELEVENLABS_AGENT_ID=tu_agent_id_aqui
ELEVENLABS_WIDGET_ENABLED=true
```

### 3. Crear un Agente (Opcional)
1. En el dashboard de ElevenLabs, ve a "Conversational AI"
2. Crea un nuevo agente
3. Configura el agente según tus necesidades
4. Copia el Agent ID generado

### 4. Configurar el Widget
El widget se configurará automáticamente con las variables de entorno.

## Alternativas sin Widget

Si no quieres configurar ElevenLabs, la aplicación funciona completamente sin el widget:

- ✅ Grabación de audio en las clases
- ✅ Transcripción automática
- ✅ Análisis de IA
- ✅ Generación de reportes
- ✅ Gestión de estudiantes

## Solución de Problemas

### Error: "Could not authorize the conversation"
- Verifica que la API key sea correcta
- Asegúrate de que la API key tenga permisos para Conversational AI
- Revisa que no haya espacios extra en la configuración

### Widget no aparece
- Verifica que `ELEVENLABS_WIDGET_ENABLED=true`
- Revisa la consola del navegador para errores
- Asegúrate de que el script se esté cargando correctamente

### Widget aparece pero no funciona
- Verifica la configuración del Agent ID
- Revisa que el agente esté activo en ElevenLabs
- Prueba con diferentes configuraciones de agente
