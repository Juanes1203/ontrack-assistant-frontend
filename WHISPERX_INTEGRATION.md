# Integración de WhisperX en MentorAI

## 🎯 Descripción

WhisperX es una herramienta avanzada de transcripción de audio que proporciona:
- **Transcripción precisa** con timestamps a nivel de palabra
- **Diarización automática** para identificar múltiples hablantes
- **Soporte multilingüe** (español, inglés, etc.)
- **Análisis de participación** detallado

## 🚀 Instalación

### 1. Instalación Automática (Recomendada)

```bash
# Dar permisos de ejecución
chmod +x install-whisperx.sh

# Ejecutar script de instalación
./install-whisperx.sh
```

### 2. Instalación Manual

#### Prerrequisitos
- Python 3.8 o superior
- FFmpeg
- Git

#### Pasos de instalación

```bash
# 1. Crear entorno virtual
python3 -m venv whisperx-env
source whisperx-env/bin/activate

# 2. Instalar PyTorch
pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

# 3. Instalar WhisperX
pip3 install git+https://github.com/m-bain/whisperX.git

# 4. Instalar dependencias adicionales
pip3 install transformers accelerate sentencepiece pyannote.audio torch-audio
```

### 3. Configuración del Backend

```bash
# Instalar dependencias del backend
cd backend
npm install

# Configurar variables de entorno
cp env.example .env
```

Editar `.env`:
```env
# WhisperX Configuration
WHISPERX_PATH=whisperx
PYTHON_PATH=python3
WHISPERX_ENV_PATH=/path/to/whisperx-env/bin/python3
```

## 🔧 Configuración

### Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `WHISPERX_PATH` | Comando para ejecutar WhisperX | `whisperx` |
| `PYTHON_PATH` | Comando de Python | `python3` |
| `WHISPERX_ENV_PATH` | Ruta al Python del entorno virtual | `whisperx-env/bin/python3` |

### Modelos Disponibles

WhisperX soporta varios modelos de Whisper:

| Modelo | Tamaño | Velocidad | Precisión |
|--------|--------|-----------|-----------|
| `tiny` | 39 MB | Muy rápida | Baja |
| `base` | 74 MB | Rápida | Media |
| `small` | 244 MB | Media | Buena |
| `medium` | 769 MB | Lenta | Muy buena |
| `large` | 1550 MB | Muy lenta | Excelente |
| `large-v2` | 1550 MB | Muy lenta | Excelente |
| `large-v3` | 1550 MB | Muy lenta | Excelente |

## 📡 API Endpoints

### 1. Transcribir Audio

```http
POST /api/whisperx/transcribe
Content-Type: multipart/form-data

Form Data:
- audio: [archivo de audio]
- model: large-v2 (opcional)
- language: es (opcional)
- diarize: true (opcional)
- min_speakers: 1 (opcional)
- max_speakers: 10 (opcional)
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "transcript": "[SPEAKER_00] [00:00:15]: Hola, bienvenidos a la clase...",
    "segments": [
      {
        "start": 15.0,
        "end": 18.5,
        "text": "Hola, bienvenidos a la clase",
        "speaker": "SPEAKER_00",
        "words": [
          {
            "start": 15.0,
            "end": 15.5,
            "word": "Hola",
            "speaker": "SPEAKER_00"
          }
        ]
      }
    ],
    "speakers": [
      {
        "id": "SPEAKER_00",
        "type": "professor",
        "confidence": 0.85
      }
    ],
    "language": "es",
    "duration": 1800.5,
    "participation": {
      "totalTime": 1800.5,
      "speakerStats": {
        "SPEAKER_00": {
          "time": 1200.0,
          "segments": 45,
          "words": 1200
        }
      },
      "interactionPatterns": []
    }
  }
}
```

### 2. Verificar Disponibilidad

```http
GET /api/whisperx/availability
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "available": true,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### 3. Información de Modelos

```http
GET /api/whisperx/models/large-v2
```

## 🎨 Uso en el Frontend

### Componente WhisperXUploader

```tsx
import { WhisperXUploader } from '@/components/class-detail/WhisperXUploader';

const MyComponent = () => {
  const handleTranscriptionComplete = (transcript: string, speakers: any[], participation: any) => {
    console.log('Transcripción:', transcript);
    console.log('Hablantes:', speakers);
    console.log('Participación:', participation);
  };

  return (
    <WhisperXUploader
      onTranscriptionComplete={handleTranscriptionComplete}
      className="w-full"
    />
  );
};
```

### Servicio WhisperXService

```tsx
import { WhisperXService } from '@/services/whisperXService';

const whisperXService = new WhisperXService();

// Transcribir audio
const result = await whisperXService.transcribeAudio(audioFile, {
  model: 'large-v2',
  language: 'es',
  diarize: true,
  min_speakers: 1,
  max_speakers: 10
});

// Formatear transcripción
const transcript = whisperXService.formatTranscript(result.segments);

// Analizar participación
const participation = whisperXService.getParticipationAnalysis(result.segments);
```

## 🔍 Análisis de Participación

WhisperX proporciona análisis detallado de participación:

### Estadísticas por Hablante
- **Tiempo total** de habla
- **Número de segmentos** de intervención
- **Número de palabras** pronunciadas
- **Confianza** en la identificación

### Patrones de Interacción
- **Secuencia** de turnos de habla
- **Frecuencia** de interacciones entre hablantes
- **Duración** de cada intervención

### Clasificación Automática
- **Profesor**: Hablante con más intervenciones
- **Estudiante**: Hablantes con menos intervenciones

## 🎯 Casos de Uso

### 1. Análisis de Clases
- Identificar patrones de participación
- Medir tiempo de habla por estudiante
- Analizar interacciones profesor-estudiante

### 2. Evaluación de Presentaciones
- Cronometrar tiempos de presentación
- Identificar pausas y transiciones
- Analizar claridad del discurso

### 3. Investigación Educativa
- Estudiar dinámicas de grupo
- Analizar efectividad de metodologías
- Evaluar engagement de estudiantes

## 🛠️ Troubleshooting

### Error: "WhisperX not found"
```bash
# Verificar instalación
source whisperx-env/bin/activate
whisperx --help

# Si no funciona, reinstalar
pip3 uninstall whisperx
pip3 install git+https://github.com/m-bain/whisperX.git
```

### Error: "FFmpeg not found"
```bash
# Ubuntu/Debian
sudo apt-get install ffmpeg

# macOS
brew install ffmpeg

# Windows
# Descargar desde https://ffmpeg.org/download.html
```

### Error: "CUDA not available"
```bash
# Instalar versión CPU de PyTorch
pip3 uninstall torch torchvision torchaudio
pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
```

### Error: "Out of memory"
- Reducir `batch_size` en la configuración
- Usar modelo más pequeño (`medium` en lugar de `large-v2`)
- Procesar archivos más cortos

## 📊 Rendimiento

### Tiempos de Procesamiento (CPU)

| Duración | Modelo | Tiempo Estimado |
|----------|--------|-----------------|
| 5 min | tiny | 30 seg |
| 5 min | base | 1 min |
| 5 min | small | 2 min |
| 5 min | medium | 5 min |
| 5 min | large-v2 | 10 min |

### Tiempos de Procesamiento (GPU)

| Duración | Modelo | Tiempo Estimado |
|----------|--------|-----------------|
| 5 min | tiny | 10 seg |
| 5 min | base | 20 seg |
| 5 min | small | 40 seg |
| 5 min | medium | 1 min |
| 5 min | large-v2 | 2 min |

## 🔗 Recursos Adicionales

- [Documentación oficial de WhisperX](https://github.com/m-bain/whisperX)
- [Modelos de Whisper](https://huggingface.co/openai/whisper-large-v2)
- [Documentación de PyTorch](https://pytorch.org/docs/)
- [Guía de FFmpeg](https://ffmpeg.org/documentation.html)

## 📝 Notas de Desarrollo

### Próximas Mejoras
- [ ] Soporte para streaming de audio
- [ ] Integración con ElevenLabs para síntesis
- [ ] Análisis de emociones en la voz
- [ ] Exportación a formatos educativos (SRT, VTT)

### Contribuciones
Para contribuir al desarrollo:
1. Fork el repositorio
2. Crea una rama para tu feature
3. Implementa los cambios
4. Añade tests
5. Envía un Pull Request

---

**¿Necesitas ayuda?** Abre un issue en el repositorio o contacta al equipo de desarrollo. 