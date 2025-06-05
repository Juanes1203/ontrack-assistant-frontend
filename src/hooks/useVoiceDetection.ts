import { useState, useEffect } from 'react';

interface VoiceDetectionResult {
  speakers: {
    id: string;
    type: 'professor' | 'student';
    confidence: number;
  }[];
  totalSpeakers: number;
}

export const useVoiceDetection = (audioBlob: Blob | null) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<VoiceDetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!audioBlob) return;

    const analyzeVoices = async () => {
      setIsAnalyzing(true);
      setError(null);

      try {
        // Crear un contexto de audio
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioData = await audioBlob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(audioData);

        // Obtener los datos de audio
        const channelData = audioBuffer.getChannelData(0);
        const sampleRate = audioBuffer.sampleRate;

        // Detectar segmentos de voz
        const voiceSegments = detectVoiceSegments(channelData, sampleRate);
        
        // Analizar características de voz para cada segmento
        const speakers = analyzeVoiceCharacteristics(voiceSegments, channelData, sampleRate);

        setResults({
          speakers,
          totalSpeakers: speakers.length
        });
      } catch (err) {
        setError('Error al analizar las voces: ' + (err as Error).message);
      } finally {
        setIsAnalyzing(false);
      }
    };

    analyzeVoices();
  }, [audioBlob]);

  return { results, isAnalyzing, error };
};

// Función para detectar segmentos de voz
const detectVoiceSegments = (channelData: Float32Array, sampleRate: number) => {
  const segments: { start: number; end: number }[] = [];
  const threshold = 0.01; // Umbral para detectar voz
  const minDuration = 0.5; // Duración mínima en segundos
  let isSpeaking = false;
  let startTime = 0;

  for (let i = 0; i < channelData.length; i++) {
    const amplitude = Math.abs(channelData[i]);
    
    if (amplitude > threshold && !isSpeaking) {
      isSpeaking = true;
      startTime = i / sampleRate;
    } else if (amplitude <= threshold && isSpeaking) {
      isSpeaking = false;
      const endTime = i / sampleRate;
      const duration = endTime - startTime;
      
      if (duration >= minDuration) {
        segments.push({ start: startTime, end: endTime });
      }
    }
  }

  return segments;
};

// Función para analizar características de voz
const analyzeVoiceCharacteristics = (
  segments: { start: number; end: number }[],
  channelData: Float32Array,
  sampleRate: number
) => {
  const speakers: { id: string; type: 'professor' | 'student'; confidence: number }[] = [];
  
  segments.forEach((segment, index) => {
    // Extraer el segmento de audio
    const startSample = Math.floor(segment.start * sampleRate);
    const endSample = Math.floor(segment.end * sampleRate);
    const segmentData = channelData.slice(startSample, endSample);

    // Calcular características básicas
    const pitch = calculatePitch(segmentData, sampleRate);
    const energy = calculateEnergy(segmentData);
    const duration = segment.end - segment.start;

    // Clasificar el tipo de voz basado en características
    const type = classifyVoiceType(pitch, energy, duration);
    const confidence = calculateConfidence(pitch, energy, duration);

    speakers.push({
      id: `speaker_${index}`,
      type,
      confidence
    });
  });

  return speakers;
};

// Función para calcular el tono (pitch)
const calculatePitch = (data: Float32Array, sampleRate: number) => {
  // Implementación básica de detección de tono
  let zeroCrossings = 0;
  for (let i = 1; i < data.length; i++) {
    if ((data[i] >= 0 && data[i - 1] < 0) || (data[i] < 0 && data[i - 1] >= 0)) {
      zeroCrossings++;
    }
  }
  return (zeroCrossings * sampleRate) / (2 * data.length);
};

// Función para calcular la energía del audio
const calculateEnergy = (data: Float32Array) => {
  return data.reduce((sum, value) => sum + value * value, 0) / data.length;
};

// Función para clasificar el tipo de voz
const classifyVoiceType = (pitch: number, energy: number, duration: number) => {
  // Valores de ejemplo, ajustar según necesidades
  const isProfessor = pitch < 200 && energy > 0.1 && duration > 2;
  return isProfessor ? 'professor' : 'student';
};

// Función para calcular la confianza de la clasificación
const calculateConfidence = (pitch: number, energy: number, duration: number) => {
  // Implementación básica de cálculo de confianza
  const pitchConfidence = Math.min(1, Math.max(0, 1 - Math.abs(pitch - 150) / 150));
  const energyConfidence = Math.min(1, energy * 10);
  const durationConfidence = Math.min(1, duration / 5);
  
  return (pitchConfidence + energyConfidence + durationConfidence) / 3;
}; 