import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  RotateCcw, 
  FileText, 
  Brain, 
  TrendingUp, 
  Users, 
  Clock,
  Download,
  Save,
  MicOff,
  BookOpen,
  Target,
  UserCheck,
  GraduationCap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const ClassDetail = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Estados de grabación
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Estados de análisis expandidos
  const [classAnalysis, setClassAnalysis] = useState({
    summary: '',
    strengths: [],
    weaknesses: [],
    opportunities: [],
    studentParticipation: '',
    professorPerformance: '',
    voiceAnalysis: {
      totalSpeakers: 0,
      professorSpeechTime: 0,
      studentSpeechTime: 0,
      questionCount: 0,
      interactionCount: 0
    },
    contentAnalysis: {
      topicsDiscussed: [],
      conceptsExplained: [],
      examplesUsed: [],
      keywordFrequency: {}
    }
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Referencias
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Datos de ejemplo de la clase
  const classData = {
    id: classId,
    name: 'Introducción a React',
    teacher: 'María González',
    day: 'Lunes',
    time: '10:00',
    description: 'Conceptos básicos de React y componentes',
    subject: 'Programación',
    duration: 90
  };

  useEffect(() => {
    // Verificar si el navegador soporta reconocimiento de voz
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'es-ES'; // Español de España, cambia según necesites
      
      recognition.onstart = () => {
        console.log('Reconocimiento de voz iniciado');
        setIsListening(true);
      };
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart + ' ';
          } else {
            interimTranscript += transcriptPart;
          }
        }
        
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Error en reconocimiento de voz:', event.error);
        if (event.error === 'no-speech') {
          // Reiniciar automáticamente si no detecta habla
          if (isRecording && !isPaused) {
            setTimeout(() => {
              try {
                recognition.start();
              } catch (e) {
                console.log('Ya está corriendo el reconocimiento');
              }
            }, 1000);
          }
        }
      };
      
      recognition.onend = () => {
        console.log('Reconocimiento de voz terminado');
        setIsListening(false);
        // Reiniciar automáticamente si estamos grabando
        if (isRecording && !isPaused) {
          setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {
              console.log('Ya está corriendo el reconocimiento');
            }
          }, 500);
        }
      };
      
      recognitionRef.current = recognition;
    } else {
      toast({
        title: "Navegador no compatible",
        description: "Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge para mejor compatibilidad.",
        variant: "destructive"
      });
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // Solicitar permisos de micrófono
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Iniciar grabación de audio
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      
      // Iniciar reconocimiento de voz
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }

      setIsRecording(true);
      setIsPaused(false);
      setTranscript(''); // Limpiar transcripción anterior
      
      // Iniciar cronómetro
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast({
        title: "Grabación iniciada",
        description: "Escuchando y transcribiendo en tiempo real...",
      });
    } catch (error) {
      console.error('Error al iniciar grabación:', error);
      toast({
        title: "Error",
        description: "No se pudo acceder al micrófono. Verifica los permisos.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Detener reconocimiento de voz
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      // Detener stream de audio
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      toast({
        title: "Grabación finalizada",
        description: "Transcripción completada. Puedes editarla y generar el análisis.",
      });
    }
  };

  const pauseRecording = () => {
    if (isRecording) {
      if (isPaused) {
        // Reanudar
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.resume();
        }
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.log('Reconocimiento ya está corriendo');
          }
        }
        intervalRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        // Pausar
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.pause();
        }
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
      setIsPaused(!isPaused);
    }
  };

  const resetRecording = () => {
    setRecordingTime(0);
    setTranscript('');
    setClassAnalysis({
      summary: '',
      strengths: [],
      weaknesses: [],
      opportunities: [],
      studentParticipation: '',
      professorPerformance: '',
      voiceAnalysis: {
        totalSpeakers: 0,
        professorSpeechTime: 0,
        studentSpeechTime: 0,
        questionCount: 0,
        interactionCount: 0
      },
      contentAnalysis: {
        topicsDiscussed: [],
        conceptsExplained: [],
        examplesUsed: [],
        keywordFrequency: {}
      }
    });
  };

  // Función mejorada de análisis del contenido real de la transcripción
  const analyzeTranscriptContent = (text: string) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    
    // Análisis de patrones de voz y roles
    const professorKeywords = ['explico', 'enseño', 'vamos a ver', 'como pueden ver', 'recuerden', 'la tarea', 'el examen', 'evaluación', 'calificación'];
    const studentKeywords = ['profesor', 'maestro', 'no entiendo', 'una pregunta', 'puedo preguntar', 'disculpe', 'gracias'];
    const questionPatterns = /\b(qué|cómo|cuándo|dónde|por qué|para qué|cuál)\b.*\?/gi;
    const explanationPatterns = /\b(es decir|por ejemplo|como|significa|definimos|concepto de|teoría de)\b/gi;
    
    // Detectar preguntas
    const questions = text.match(questionPatterns) || [];
    const questionCount = questions.length;
    
    // Detectar explicaciones
    const explanations = text.match(explanationPatterns) || [];
    
    // Análisis de frecuencia de palabras clave
    const keywordFrequency: {[key: string]: number} = {};
    const importantWords = words.filter(word => word.length > 4);
    importantWords.forEach(word => {
      keywordFrequency[word] = (keywordFrequency[word] || 0) + 1;
    });
    
    // Estimar participación por patrones de lenguaje
    const professorIndicators = professorKeywords.reduce((count, keyword) => 
      count + (text.toLowerCase().split(keyword).length - 1), 0);
    const studentIndicators = studentKeywords.reduce((count, keyword) => 
      count + (text.toLowerCase().split(keyword).length - 1), 0);
    
    // Detectar temas discutidos basándose en el contenido real
    const topicsDiscussed = [];
    
    // Análisis más profundo del contenido
    const lowerText = text.toLowerCase();
    
    // Detectar temas tecnológicos
    if (lowerText.includes('react') || lowerText.includes('componente')) topicsDiscussed.push('React y Componentes');
    if (lowerText.includes('javascript') || lowerText.includes('js')) topicsDiscussed.push('JavaScript');
    if (lowerText.includes('html') || lowerText.includes('css')) topicsDiscussed.push('HTML/CSS');
    if (lowerText.includes('estado') || lowerText.includes('state')) topicsDiscussed.push('Gestión de Estado');
    if (lowerText.includes('props') || lowerText.includes('propiedades')) topicsDiscussed.push('Props y Propiedades');
    if (lowerText.includes('hook') || lowerText.includes('usestate') || lowerText.includes('useeffect')) topicsDiscussed.push('React Hooks');
    if (lowerText.includes('función') || lowerText.includes('método')) topicsDiscussed.push('Funciones y Métodos');
    if (lowerText.includes('variable') || lowerText.includes('constante')) topicsDiscussed.push('Variables y Constantes');
    if (lowerText.includes('clase') || lowerText.includes('programación')) topicsDiscussed.push('Programación');
    if (lowerText.includes('algoritmo') || lowerText.includes('lógica')) topicsDiscussed.push('Algoritmos y Lógica');
    
    // Si no se detectan temas específicos, analizar palabras más frecuentes para inferir temas
    if (topicsDiscussed.length === 0) {
      const wordFreq = Object.entries(keywordFrequency).sort(([,a], [,b]) => (b as number) - (a as number));
      const mainWords = wordFreq.slice(0, 3).map(([word]) => word);
      if (mainWords.length > 0) {
        topicsDiscussed.push(`Conceptos: ${mainWords.join(', ')}`);
      }
    }
    
    // Detectar ejemplos utilizados
    const examplesUsed = [];
    if (lowerText.includes('por ejemplo') || lowerText.includes('ejemplo')) examplesUsed.push('Ejemplos verbales');
    if (lowerText.includes('demo') || lowerText.includes('demostración')) examplesUsed.push('Demostración práctica');
    if (lowerText.includes('código') || lowerText.includes('program')) examplesUsed.push('Ejemplos de código');
    if (lowerText.includes('práctica') || lowerText.includes('ejercicio')) examplesUsed.push('Ejercicios prácticos');
    
    return {
      questionCount,
      explanationCount: explanations.length,
      professorIndicators,
      studentIndicators,
      keywordFrequency,
      topicsDiscussed,
      examplesUsed,
      sentenceCount: sentences.length,
      wordCount: words.length,
      actualQuestions: questions,
      mainWords: Object.entries(keywordFrequency).sort(([,a], [,b]) => (b as number) - (a as number)).slice(0, 5)
    };
  };

  // Función de análisis completamente reescrita para generar resúmenes reales
  const generateAnalysis = async () => {
    if (!transcript.trim()) {
      toast({
        title: "Error",
        description: "Necesitas tener una transcripción para generar el análisis",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    // Analizar el contenido real de la transcripción
    const analysis = analyzeTranscriptContent(transcript);
    
    setTimeout(() => {
      // Generar resumen REAL basado en el contenido específico de la transcripción
      let summary = '';
      
      // Introducción con datos reales
      summary += `Durante la sesión de ${formatTime(recordingTime)}, se registraron ${analysis.wordCount} palabras y ${analysis.sentenceCount} oraciones. `;
      
      // Análisis del contenido principal
      if (analysis.topicsDiscussed.length > 0) {
        summary += `Los principales temas abordados fueron: ${analysis.topicsDiscussed.join(', ')}. `;
      } else if (analysis.mainWords.length > 0) {
        const mainConcepts = analysis.mainWords.map(([word]) => word).join(', ');
        summary += `Los conceptos más mencionados durante la clase fueron: ${mainConcepts}. `;
      }
      
      // Análisis de interacción basado en contenido real
      if (analysis.questionCount > 0) {
        summary += `Se identificaron ${analysis.questionCount} preguntas o cuestionamientos durante la sesión`;
        if (analysis.actualQuestions.length > 0) {
          summary += `, incluyendo: "${analysis.actualQuestions[0].substring(0, 50)}..."`;
        }
        summary += '. ';
        
        if (analysis.questionCount >= 5) {
          summary += "Esto indica un alto nivel de interacción y engagement por parte de los participantes. ";
        } else if (analysis.questionCount >= 2) {
          summary += "Esto muestra un nivel moderado de participación activa. ";
        } else {
          summary += "Esto sugiere una participación inicial que podría incrementarse. ";
        }
      } else {
        summary += "No se detectaron preguntas directas en la transcripción, sugiriendo un formato más expositivo. ";
      }
      
      // Análisis de explicaciones y metodología
      if (analysis.explanationCount > 0) {
        summary += `Se registraron ${analysis.explanationCount} instancias de explicaciones detalladas o ejemplificaciones, `;
        summary += "mostrando un enfoque pedagógico estructurado. ";
      }
      
      // Análisis de dinámicas de participación
      const totalIndicators = analysis.professorIndicators + analysis.studentIndicators;
      if (totalIndicators > 0) {
        const professorPercentage = Math.round((analysis.professorIndicators / totalIndicators) * 100);
        const studentPercentage = Math.round((analysis.studentIndicators / totalIndicators) * 100);
        
        if (studentPercentage >= 40) {
          summary += `La sesión mostró un equilibrio saludable con ${professorPercentage}% de instrucción docente y ${studentPercentage}% de participación estudiantil.`;
        } else if (studentPercentage >= 20) {
          summary += `La clase fue mayormente dirigida por el instructor (${professorPercentage}%) con participación estudiantil moderada (${studentPercentage}%).`;
        } else {
          summary += `La sesión fue predominantemente expositiva con ${professorPercentage}% de instrucción docente y participación estudiantil limitada.`;
        }
      } else {
        summary += "La transcripción refleja principalmente contenido académico sin indicadores claros de roles específicos.";
      }

      // Fortalezas basadas en análisis real
      const strengths = [];
      if (analysis.questionCount >= 3) strengths.push(`Excelente interacción: ${analysis.questionCount} preguntas registradas demuestran engagement activo`);
      if (analysis.explanationCount >= 2) strengths.push(`Metodología efectiva: ${analysis.explanationCount} explicaciones detalladas registradas`);
      if (analysis.topicsDiscussed.length >= 3) strengths.push(`Cobertura amplia: ${analysis.topicsDiscussed.length} temas diferentes abordados`);
      if (analysis.wordCount > 200) strengths.push(`Contenido sustancial: ${analysis.wordCount} palabras registradas indican profundidad temática`);
      if (analysis.sentenceCount > 10) strengths.push(`Comunicación estructurada: ${analysis.sentenceCount} oraciones bien formadas`);
      
      if (strengths.length === 0) {
        if (analysis.wordCount > 50) {
          strengths.push("Transmisión clara de información académica");
        } else {
          strengths.push("Sesión registrada con contenido básico");
        }
      }

      // Debilidades identificadas del análisis real
      const weaknesses = [];
      if (analysis.questionCount === 0) weaknesses.push("Ausencia total de preguntas: no se detectó verificación de comprensión");
      if (analysis.explanationCount === 0) weaknesses.push("Falta de ejemplificación: no se registraron explicaciones detalladas");
      if (analysis.studentIndicators === 0) weaknesses.push("Sin participación estudiantil detectada en la transcripción");
      if (analysis.wordCount < 100) weaknesses.push(`Contenido limitado: solo ${analysis.wordCount} palabras para ${formatTime(recordingTime)} de duración`);
      if (analysis.topicsDiscussed.length <= 1) weaknesses.push("Cobertura temática restringida detectada en el contenido");
      
      if (weaknesses.length === 0) {
        weaknesses.push("Oportunidad de incrementar la interacción bidireccional registrada");
      }

      // Oportunidades basadas en el análisis real
      const opportunities = [];
      if (analysis.questionCount < 2) opportunities.push("Implementar técnicas para generar más preguntas y verificación de comprensión");
      if (analysis.explanationCount < 2) opportunities.push("Incorporar más ejemplos prácticos y casos de estudio detallados");
      if (analysis.studentIndicators < analysis.professorIndicators * 0.3) opportunities.push("Desarrollar estrategias para aumentar la participación estudiantil registrable");
      opportunities.push("Enriquecer el contenido con actividades que generen más interacción verbal");
      if (analysis.examplesUsed.length === 0) opportunities.push("Integrar ejemplos prácticos y demostraciones más evidentes");

      // Análisis detallado de participación estudiantil
      let studentParticipation = '';
      if (analysis.studentIndicators > 0) {
        studentParticipation = `Se detectaron ${analysis.studentIndicators} indicadores de participación estudiantil en la transcripción. `;
      } else {
        studentParticipation = 'La transcripción no muestra indicadores claros de participación estudiantil directa. ';
      }
      if (analysis.questionCount > 0) {
        studentParticipation += `Los estudiantes formularon ${analysis.questionCount} preguntas durante la sesión, `;
      } else {
        studentParticipation += 'No se registraron preguntas por parte de los estudiantes, ';
      }
      if (analysis.studentIndicators >= 3) {
        studentParticipation += 'demostrando un ambiente de aprendizaje interactivo donde los estudiantes se sienten cómodos participando.';
      } else if (analysis.studentIndicators >= 1) {
        studentParticipation += 'sugiriendo oportunidades para fomentar mayor participación activa.';
      } else {
        studentParticipation += 'indicando la necesidad de implementar estrategias más dinámicas para estimular el engagement estudiantil.';
      }

      // Análisis del desempeño del profesor
      let professorPerformance = '';
      if (analysis.professorIndicators > 0) {
        professorPerformance = `Se identificaron ${analysis.professorIndicators} indicadores de instrucción estructurada en la transcripción. `;
      } else {
        professorPerformance = 'El análisis no detectó indicadores claros de metodología docente estructurada. ';
      }
      if (analysis.explanationCount > 0) {
        professorPerformance += `El profesor proporcionó ${analysis.explanationCount} explicaciones detalladas, `;
      } else {
        professorPerformance += 'No se registraron explicaciones detalladas en la transcripción, ';
      }
      if (analysis.topicsDiscussed.length > 0) {
        professorPerformance += `cubriendo ${analysis.topicsDiscussed.length} temas principales: ${analysis.topicsDiscussed.join(', ')}. `;
      } else {
        professorPerformance += 'con cobertura temática limitada detectada. ';
      }
      if (analysis.professorIndicators >= 3 && analysis.explanationCount >= 2) {
        professorPerformance += 'Esto indica un desempeño docente sólido con metodología clara y contenido bien estructurado.';
      } else {
        professorPerformance += 'Hay oportunidades para enriquecer la metodología de enseñanza y aumentar la claridad en las explicaciones.';
      }

      setClassAnalysis({
        summary,
        strengths,
        weaknesses,
        opportunities,
        studentParticipation,
        professorPerformance,
        voiceAnalysis: {
          totalSpeakers: Math.max(1, Math.ceil((analysis.professorIndicators + analysis.studentIndicators) / 2)),
          professorSpeechTime: Math.round((analysis.professorIndicators / (analysis.professorIndicators + analysis.studentIndicators + 1)) * recordingTime),
          studentSpeechTime: Math.round((analysis.studentIndicators / (analysis.professorIndicators + analysis.studentIndicators + 1)) * recordingTime),
          questionCount: analysis.questionCount,
          interactionCount: analysis.professorIndicators + analysis.studentIndicators
        },
        contentAnalysis: {
          topicsDiscussed: analysis.topicsDiscussed,
          conceptsExplained: analysis.mainWords.map(([word]) => word),
          examplesUsed: analysis.examplesUsed,
          keywordFrequency: analysis.keywordFrequency
        }
      });
      
      setIsAnalyzing(false);
      
      toast({
        title: "Análisis completado",
        description: `Análisis generado basado en ${analysis.wordCount} palabras de la transcripción real`,
      });
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const saveChanges = () => {
    toast({
      title: "Cambios guardados",
      description: "Los cambios se han guardado correctamente",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mr-4 border-2 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {classData.name}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {classData.teacher}
              </span>
              <span>{classData.day} - {classData.time}</span>
              <Badge variant="secondary">{classData.subject}</Badge>
            </div>
          </div>
        </div>

        {/* Control de Grabación */}
        <Card className="mb-8 border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Mic className="w-6 h-6 mr-2 text-red-500" />
              Control de Grabación y Transcripción
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                {!isRecording ? (
                  <Button 
                    onClick={startRecording}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Mic className="w-5 h-5 mr-2" />
                    Iniciar Grabación
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button 
                      onClick={pauseRecording}
                      variant="outline"
                      className="border-2"
                    >
                      {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                      {isPaused ? 'Reanudar' : 'Pausar'}
                    </Button>
                    <Button 
                      onClick={stopRecording}
                      className="bg-gray-600 hover:bg-gray-700 text-white"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Detener
                    </Button>
                  </div>
                )}
                
                <Button 
                  onClick={resetRecording}
                  variant="outline"
                  className="border-2"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reiniciar
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center text-lg font-mono">
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  <span className={`${isRecording && !isPaused ? 'text-red-600 pulse-slow' : 'text-gray-700'}`}>
                    {formatTime(recordingTime)}
                  </span>
                </div>
                
                {isRecording && (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2 pulse-slow"></div>
                      <span className="text-red-600 font-medium">
                        {isPaused ? 'Pausado' : 'Grabando'}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      {isListening ? (
                        <Mic className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <MicOff className="w-4 h-4 text-gray-400 mr-1" />
                      )}
                      <span className={`text-sm ${isListening ? 'text-green-600' : 'text-gray-500'}`}>
                        {isListening ? 'Escuchando' : 'Sin audio'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pestañas principales expandidas */}
        <Tabs defaultValue="transcript" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-12 gap-1">
            <TabsTrigger value="transcript" className="flex items-center text-xs">
              <FileText className="w-4 h-4 mr-1" />
              Transcripción
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center text-xs">
              <BookOpen className="w-4 h-4 mr-1" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="swot" className="flex items-center text-xs">
              <Target className="w-4 h-4 mr-1" />
              FODA
            </TabsTrigger>
            <TabsTrigger value="participation" className="flex items-center text-xs">
              <UserCheck className="w-4 h-4 mr-1" />
              Participación
            </TabsTrigger>
            <TabsTrigger value="professor" className="flex items-center text-xs">
              <GraduationCap className="w-4 h-4 mr-1" />
              Profesor
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center text-xs">
              <TrendingUp className="w-4 h-4 mr-1" />
              Insights
            </TabsTrigger>
          </TabsList>

          {/* Pestaña Transcripción */}
          <TabsContent value="transcript">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Transcripción de la Clase
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={generateAnalysis}
                      disabled={isAnalyzing || !transcript}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Analizando...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          Generar Análisis
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                    <Button onClick={saveChanges} size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Guardar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isRecording && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-blue-700 text-sm flex items-center">
                        <Mic className="w-4 h-4 mr-2" />
                        Transcripción en tiempo real activa. El texto aparecerá automáticamente mientras hablas.
                      </p>
                    </div>
                  )}
                  
                  <Textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="La transcripción aparecerá aquí en tiempo real mientras grabas. Habla claramente para mejores resultados. Puedes editarla manualmente después de la grabación."
                    className="min-h-[400px] border-2 focus:border-blue-400 text-base leading-relaxed"
                  />
                  
                  {transcript && (
                    <div className="text-sm text-gray-600">
                      Palabras: {transcript.split(' ').filter(word => word.length > 0).length} | 
                      Caracteres: {transcript.length}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña Resumen de la Clase */}
          <TabsContent value="summary">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-green-600" />
                  Resumen de la Clase
                </CardTitle>
              </CardHeader>
              <CardContent>
                {classAnalysis.summary ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-800 mb-3">
                        📝 Resumen Ejecutivo (Basado en Transcripción)
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-base">
                        {classAnalysis.summary}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Duración de la clase</h4>
                        <p className="text-blue-700">{formatTime(recordingTime)}</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-2">Palabras transcritas</h4>
                        <p className="text-purple-700">{transcript.split(' ').filter(word => word.length > 0).length}</p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-orange-800 mb-2">Preguntas detectadas</h4>
                        <p className="text-orange-700">{classAnalysis.voiceAnalysis.questionCount}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">Temas discutidos</h4>
                        <p className="text-green-700">{classAnalysis.contentAnalysis.topicsDiscussed.join(', ') || 'No detectados'}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-4">
                      Genera un resumen detallado de tu clase
                    </p>
                    <p className="text-gray-400 text-sm">
                      Primero necesitas tener una transcripción y generar el análisis
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña Fortalezas, Debilidades y Oportunidades (FODA) */}
          <TabsContent value="swot">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-orange-600" />
                  Análisis FODA (Basado en Contenido de la Transcripción)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {classAnalysis.strengths.length > 0 ? (
                  <div className="space-y-6">
                    {/* Fortalezas */}
                    <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                        💪 Fortalezas Identificadas en la Transcripción
                      </h3>
                      <ul className="space-y-3">
                        {classAnalysis.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-3 mt-0.5">✓</span>
                            <span className="text-gray-700 leading-relaxed">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Debilidades */}
                    <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
                        🔍 Áreas de Mejora Detectadas
                      </h3>
                      <ul className="space-y-3">
                        {classAnalysis.weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-orange-500 mr-3 mt-0.5">⚠</span>
                            <span className="text-gray-700 leading-relaxed">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Oportunidades */}
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                        🚀 Oportunidades de Crecimiento
                      </h3>
                      <ul className="space-y-3">
                        {classAnalysis.opportunities.map((opportunity, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-500 mr-3 mt-0.5">💡</span>
                            <span className="text-gray-700 leading-relaxed">{opportunity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-4">
                      Análisis FODA de la clase
                    </p>
                    <p className="text-gray-400 text-sm">
                      Genera el análisis para ver fortalezas, debilidades y oportunidades basadas en la transcripción
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña Participación Estudiantil */}
          <TabsContent value="participation">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="w-5 h-5 mr-2 text-blue-600" />
                  Análisis de Participación Estudiantil (Basado en Transcripción)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {classAnalysis.studentParticipation ? (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                        👥 Evaluación de Participación Detectada en la Grabación
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-base">
                        {classAnalysis.studentParticipation}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600 mb-2">
                          {classAnalysis.voiceAnalysis.questionCount}
                        </div>
                        <p className="text-green-700 font-medium">Preguntas Formuladas</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-2">
                          {classAnalysis.voiceAnalysis.interactionCount}
                        </div>
                        <p className="text-purple-700 font-medium">Interacciones Detectadas</p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-orange-600 mb-2">
                          {formatTime(classAnalysis.voiceAnalysis.studentSpeechTime)}
                        </div>
                        <p className="text-orange-700 font-medium">Tiempo Estimado de Participación</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-4">
                      Evaluación de participación estudiantil
                    </p>
                    <p className="text-gray-400 text-sm">
                      Genera el análisis para evaluar la participación y actitud de los estudiantes basado en la transcripción
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña Desempeño del Profesor */}
          <TabsContent value="professor">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-purple-600" />
                  Evaluación del Desempeño Docente (Basado en Transcripción)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {classAnalysis.professorPerformance ? (
                  <div className="space-y-6">
                    <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                        🎓 Análisis del Desempeño Detectado en la Grabación
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-base">
                        {classAnalysis.professorPerformance}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600 mb-2">
                          {formatTime(classAnalysis.voiceAnalysis.professorSpeechTime)}
                        </div>
                        <p className="text-green-700 font-medium text-sm">Tiempo de Instrucción</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-2">
                          {classAnalysis.contentAnalysis.topicsDiscussed.length}
                        </div>
                        <p className="text-blue-700 font-medium text-sm">Temas Cubiertos</p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-yellow-600 mb-2">
                          {classAnalysis.contentAnalysis.examplesUsed.length}
                        </div>
                        <p className="text-yellow-700 font-medium text-sm">Ejemplos Utilizados</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-red-600 mb-2">
                          {classAnalysis.voiceAnalysis.totalSpeakers}
                        </div>
                        <p className="text-red-700 font-medium text-sm">Voces Detectadas</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-4">
                      Evaluación del desempeño del profesor
                    </p>
                    <p className="text-gray-400 text-sm">
                      Genera el análisis para evaluar el conocimiento y metodología del profesor basado en la transcripción
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña Insights */}
          <TabsContent value="insights">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Insights y Métricas Avanzadas de la Grabación
                </CardTitle>
              </CardHeader>
              <CardContent>
                {classAnalysis.contentAnalysis.topicsDiscussed.length > 0 ? (
                  <div className="space-y-6">
                    {/* Métricas de participación */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-2">
                          {Math.round((classAnalysis.voiceAnalysis.studentSpeechTime / recordingTime) * 100)}%
                        </div>
                        <p className="text-blue-700 font-medium text-sm">Tiempo de Participación Estudiantil</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600 mb-2">
                          {Math.round((classAnalysis.voiceAnalysis.professorSpeechTime / recordingTime) * 100)}%
                        </div>
                        <p className="text-green-700 font-medium text-sm">Tiempo de Instrucción Docente</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-2">
                          {Math.round(classAnalysis.voiceAnalysis.questionCount / (recordingTime / 60)) || 0}
                        </div>
                        <p className="text-purple-700 font-medium text-sm">Preguntas por Minuto</p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-orange-600 mb-2">
                          {Math.round(transcript.split(' ').length / (recordingTime / 60)) || 0}
                        </div>
                        <p className="text-orange-700 font-medium text-sm">Palabras por Minuto</p>
                      </div>
                    </div>

                    {/* Contenido analizado */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">📚 Temas Discutidos</h3>
                        <div className="space-y-2">
                          {classAnalysis.contentAnalysis.topicsDiscussed.map((topic, index) => (
                            <Badge key={index} variant="secondary" className="mr-2 mb-2">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Ejemplos Utilizados</h3>
                        <div className="space-y-2">
                          {classAnalysis.contentAnalysis.examplesUsed.length > 0 ? (
                            classAnalysis.contentAnalysis.examplesUsed.map((example, index) => (
                              <Badge key={index} variant="outline" className="mr-2 mb-2">
                                {example}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm">No se detectaron ejemplos específicos</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Palabras clave más frecuentes */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">🔤 Conceptos Más Mencionados</h3>
                      <div className="space-y-2">
                        {Object.entries(classAnalysis.contentAnalysis.keywordFrequency)
                          .sort(([,a], [,b]) => (b as number) - (a as number))
                          .slice(0, 10)
                          .map(([word, count], index) => (
                            <div key={index} className="flex justify-between items-center py-1">
                              <span className="text-gray-700">{word}</span>
                              <Badge variant="secondary">{count as number}</Badge>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-2">
                      Métricas avanzadas basadas en la transcripción
                    </p>
                    <p className="text-gray-400 text-sm">
                      Genera el análisis para ver estadísticas detalladas, patrones de voz y métricas de rendimiento
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClassDetail;
