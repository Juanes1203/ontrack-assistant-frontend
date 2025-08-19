# Visualización de Resultados de WhisperX

## 📋 Descripción

La nueva funcionalidad permite visualizar de manera completa y detallada los resultados de la transcripción con WhisperX, incluyendo:

- **Transcripción completa** con timestamps y identificadores de hablantes
- **Análisis de participantes** con estadísticas detalladas
- **Análisis de participación** con gráficos y patrones de interacción

## 🎯 Características Principales

### 1. Transcripción Completa
- Muestra el texto transcrito con formato legible
- Incluye timestamps precisos para cada segmento
- Identifica automáticamente los hablantes (SPEAKER_00, SPEAKER_01, etc.)
- Formato: `[SPEAKER_00] [00:15]: Hola, bienvenidos a la clase...`

### 2. Análisis de Participantes
- **Identificación automática** de hablantes
- **Clasificación** como Profesor o Estudiante
- **Estadísticas por hablante**:
  - Tiempo total de habla
  - Número de intervenciones
  - Número de palabras pronunciadas
  - Nivel de confianza en la identificación

### 3. Análisis de Participación
- **Duración total** de la grabación
- **Número total** de hablantes identificados
- **Gráfico de distribución** de tiempo por hablante
- **Segmentos detallados** con información temporal
- **Patrones de interacción** entre hablantes

## 🎨 Interfaz de Usuario

### Pestañas de Resultados

#### 1. Transcripción
```
[SPEAKER_00] [00:00:15]: Hola, bienvenidos a la clase de MentorAI
[SPEAKER_01] [00:00:18]: Gracias por la bienvenida
[SPEAKER_00] [00:00:20]: Hoy vamos a hablar sobre...
```

#### 2. Participantes
```
┌─────────────────────────────────────┐
│ 👤 SPEAKER_00 (Profesor)            │
│    ⏱️  12:30 (45.2%)               │
│    💬 45 intervenciones             │
│    📝 1,200 palabras                │
│    🎯 85% confianza                 │
└─────────────────────────────────────┘
```

#### 3. Análisis
```
📊 Distribución de Tiempo
SPEAKER_00 ████████████████████ 45.2%
SPEAKER_01 ████████ 32.1%
SPEAKER_02 ████ 22.7%

🔄 Patrones de Interacción
SPEAKER_00 → SPEAKER_01: 15 veces
SPEAKER_01 → SPEAKER_00: 12 veces
SPEAKER_02 → SPEAKER_00: 8 veces
```

## 🔧 Uso en el Frontend

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

### Estados del Componente

```tsx
interface TranscriptionResult {
  transcript: string;
  speakers: Array<{
    id: string;
    type: 'professor' | 'student';
    confidence: number;
  }>;
  participation: {
    totalTime: number;
    speakerStats: Record<string, {
      time: number;
      segments: number;
      words: number;
    }>;
    interactionPatterns: Array<{
      from: string;
      to: string;
      count: number;
    }>;
  };
  segments: Array<{
    start: number;
    end: number;
    text: string;
    speaker?: string;
  }>;
}
```

## 📊 Métricas Disponibles

### Por Hablante
- **Tiempo total**: Duración acumulada de todas las intervenciones
- **Intervenciones**: Número de segmentos de habla
- **Palabras**: Total de palabras pronunciadas
- **Confianza**: Nivel de certeza en la identificación

### Generales
- **Duración total**: Tiempo completo de la grabación
- **Hablantes únicos**: Número de voces diferentes identificadas
- **Patrones de interacción**: Secuencia de turnos de habla

## 🎨 Personalización Visual

### Colores por Hablante
- **SPEAKER_00**: Azul (típicamente el profesor)
- **SPEAKER_01**: Verde (primer estudiante)
- **SPEAKER_02**: Púrpura (segundo estudiante)
- **Otros**: Gris (hablantes adicionales)

### Indicadores Visuales
- **Barras de progreso** para distribución de tiempo
- **Badges** con información temporal y de hablante
- **Iconos** para diferentes tipos de información
- **Hover effects** en segmentos de conversación

## 🔄 Flujo de Trabajo

1. **Seleccionar archivo** de audio (WAV, MP3, OGG, WEBM, M4A, FLAC)
2. **Iniciar transcripción** con WhisperX
3. **Esperar procesamiento** (1-5 minutos según duración)
4. **Revisar resultados** en las tres pestañas
5. **Analizar participación** y patrones de interacción
6. **Exportar o guardar** resultados según necesidad

## 🚀 Beneficios

### Para Educadores
- **Análisis objetivo** de participación en clase
- **Identificación** de estudiantes menos participativos
- **Medición** de tiempo de habla del profesor vs estudiantes
- **Evaluación** de dinámicas de grupo

### Para Investigadores
- **Datos cuantitativos** para estudios educativos
- **Patrones de interacción** entre participantes
- **Métricas de engagement** basadas en participación
- **Análisis temporal** de desarrollo de conversaciones

### Para Estudiantes
- **Retroalimentación** sobre su participación
- **Identificación** de oportunidades de mejora
- **Comprensión** de dinámicas de grupo
- **Autoevaluación** de habilidades comunicativas

## 🔧 Configuración Técnica

### Requisitos del Backend
- WhisperX instalado y configurado
- Token de Hugging Face para diarización
- Endpoint `/api/whisperx/transcribe` funcionando

### Requisitos del Frontend
- React 18+
- TypeScript
- Tailwind CSS
- Lucide React (iconos)

## 📝 Notas de Implementación

- Los resultados se muestran automáticamente después de completar la transcripción
- La interfaz es responsiva y funciona en dispositivos móviles
- Los datos se pueden exportar o integrar con otros análisis
- La funcionalidad es compatible con el sistema existente de análisis de clases 