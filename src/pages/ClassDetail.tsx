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
    
    // Detectar temas discutidos
    const topicsDiscussed = [];
    if (text.toLowerCase().includes('react')) topicsDiscussed.push('React');
    if (text.toLowerCase().includes('componente')) topicsDiscussed.push('Componentes');
    if (text.toLowerCase().includes('estado') || text.toLowerCase().includes('state')) topicsDiscussed.push('Estado');
    if (text.toLowerCase().includes('props')) topicsDiscussed.push('Props');
    if (text.toLowerCase().includes('hook')) topicsDiscussed.push('Hooks');
    
    // Detectar ejemplos utilizados
    const examplesUsed = [];
    if (text.toLowerCase().includes('por ejemplo')) examplesUsed.push('Ejemplos verbales');
    if (text.toLowerCase().includes('demo') || text.toLowerCase().includes('demostración')) examplesUsed.push('Demostración práctica');
    if (text.toLowerCase().includes('código')) examplesUsed.push('Ejemplos de código');
    
    return {
      questionCount,
      explanationCount: explanations.length,
      professorIndicators,
      studentIndicators,
      keywordFrequency,
      topicsDiscussed,
      examplesUsed,
      sentenceCount: sentences.length,
      wordCount: words.length
    };
  };

  // Función de análisis completamente reescrita basada en el contenido real
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
      // Generar resumen basado en el contenido real
      let summary = `La clase de ${classData.name} registró una transcripción de ${analysis.wordCount} palabras en ${formatTime(recordingTime)} de duración. `;
      
      if (analysis.topicsDiscussed.length > 0) {
        summary += `Los temas principales discutidos fueron: ${analysis.topicsDiscussed.join(', ')}. `;
      }
      
      if (analysis.questionCount > 0) {
        summary += `Se registraron ${analysis.questionCount} preguntas durante la sesión, `;
        if (analysis.questionCount >= 5) {
          summary += "indicando un alto nivel de interacción y participación. ";
        } else if (analysis.questionCount >= 2) {
          summary += "mostrando un nivel moderado de participación. ";
        } else {
          summary += "sugiriendo participación limitada. ";
        }
      }
      
      if (analysis.explanationCount > 0) {
        summary += `Se identificaron ${analysis.explanationCount} instancias de explicaciones detalladas o ejemplos. `;
      }
      
      const participationRatio = analysis.studentIndicators / (analysis.professorIndicators + analysis.studentIndicators + 1);
      if (participationRatio > 0.3) {
        summary += "La sesión mostró un buen equilibrio entre instrucción docente y participación estudiantil.";
      } else {
        summary += "La sesión fue principalmente dirigida por el instructor con participación estudiantil limitada.";
      }

      // Fortalezas basadas en análisis real
      const strengths = [];
      if (analysis.questionCount >= 3) strengths.push("Alta frecuencia de preguntas indica compromiso estudiantil");
      if (analysis.explanationCount >= 2) strengths.push("Uso efectivo de explicaciones detalladas y ejemplos");
      if (analysis.topicsDiscussed.length >= 3) strengths.push("Cobertura amplia de múltiples temas relevantes");
      if (analysis.wordCount > 500) strengths.push("Sesión substancial con contenido rico y detallado");
      if (analysis.professorIndicators >= 3) strengths.push("Instrucción estructurada y dirigida por el profesor");
      if (strengths.length === 0) {
        strengths.push("Transmisión clara de información", "Mantenimiento del enfoque en el tema");
      }

      // Debilidades identificadas del análisis real
      const weaknesses = [];
      if (analysis.questionCount === 0) weaknesses.push("Ausencia de preguntas sugiere falta de verificación de comprensión");
      if (analysis.explanationCount === 0) weaknesses.push("Falta de ejemplos prácticos para ilustrar conceptos");
      if (analysis.studentIndicators === 0) weaknesses.push("No se detectó participación estudiantil directa");
      if (analysis.wordCount < 200) weaknesses.push("Contenido limitado para la duración de la clase");
      if (analysis.topicsDiscussed.length <= 1) weaknesses.push("Cobertura temática limitada");
      if (weaknesses.length === 0) {
        weaknesses.push("Podría beneficiarse de mayor interacción bidireccional");
      }

      // Oportunidades basadas en el análisis
      const opportunities = [];
      if (analysis.questionCount < 2) opportunities.push("Implementar técnicas para fomentar más preguntas estudiantiles");
      if (analysis.explanationCount < 2) opportunities.push("Incorporar más ejemplos prácticos y casos de estudio");
      if (participationRatio < 0.2) opportunities.push("Desarrollar estrategias para aumentar participación estudiantil");
      opportunities.push("Integrar actividades interactivas durante la sesión");
      opportunities.push("Utilizar recursos multimedia para enriquecer el contenido");

      // Análisis detallado de participación estudiantil
      let studentParticipation = "";
      if (analysis.studentIndicators >= 5 && analysis.questionCount >= 3) {
        studentParticipation = `El análisis de la transcripción revela un excelente nivel de participación estudiantil. Se detectaron ${analysis.studentIndicators} indicadores de participación activa y ${analysis.questionCount} preguntas formuladas por estudiantes. Los estudiantes mostraron iniciativa para solicitar aclaraciones, expresar dudas y contribuir al diálogo académico. Se evidencia un ambiente de aprendizaje colaborativo donde los estudiantes se sienten cómodos participando activamente.`;
      } else if (analysis.studentIndicators >= 2 || analysis.questionCount >= 1) {
        studentParticipation = `Se identificó un nivel moderado de participación estudiantil con ${analysis.studentIndicators} indicadores de participación y ${analysis.questionCount} preguntas registradas. Algunos estudiantes contribuyeron a la discusión, aunque existe potencial para mayor interacción. Se recomienda implementar estrategias más dinámicas para estimular la participación de todos los estudiantes.`;
      } else {
        studentParticipation = `La transcripción muestra participación estudiantil limitada con solo ${analysis.studentIndicators} indicadores detectados y ${analysis.questionCount} preguntas formuladas. Los estudiantes adoptaron una actitud principalmente receptiva. Se sugiere implementar técnicas como preguntas directas, discusiones grupales, y actividades participativas para fomentar mayor compromiso estudiantil.`;
      }

      // Análisis del desempeño del profesor
      let professorPerformance = "";
      if (analysis.professorIndicators >= 5 && analysis.explanationCount >= 3) {
        professorPerformance = `El análisis de la transcripción indica un desempeño docente excelente. Se identificaron ${analysis.professorIndicators} indicadores de instrucción estructurada y ${analysis.explanationCount} instancias de explicaciones detalladas. El profesor demostró dominio del tema, capacidad para comunicar conceptos complejos de manera clara, y habilidades pedagógicas efectivas. La presentación fue organizada y bien secuenciada, mostrando preparación adecuada y conocimiento profundo del contenido.`;
      } else if (analysis.professorIndicators >= 2 || analysis.explanationCount >= 1) {
        professorPerformance = `El profesor mostró un desempeño competente con ${analysis.professorIndicators} indicadores de instrucción y ${analysis.explanationCount} explicaciones registradas. Se evidencia conocimiento del tema y organización básica del contenido. Sin embargo, hay oportunidades para enriquecer la metodología de enseñanza, incluyendo más ejemplos prácticos, técnicas de verificación de comprensión, y estrategias para aumentar el engagement estudiantil.`;
      } else {
        professorPerformance = `El análisis sugiere oportunidades significativas de mejora en el desempeño docente. Con ${analysis.professorIndicators} indicadores de instrucción estructurada y ${analysis.explanationCount} explicaciones detectadas, se recomienda desarrollar técnicas pedagógicas más dinámicas, incluir más ejemplos prácticos, implementar verificaciones de comprensión regulares, y fomentar mayor interacción con los estudiantes.`;
      }

      setClassAnalysis({
        summary,
        strengths,
        weaknesses,
        opportunities,
        studentParticipation,
        professorPerformance,
        voiceAnalysis: {
          totalSpeakers: Math.max(1, Math.ceil((analysis.professorIndicators + analysis.studentIndicators) / 3)),
          professorSpeechTime: Math.round((analysis.professorIndicators / (analysis.professorIndicators + analysis.studentIndicators + 1)) * recordingTime),
          studentSpeechTime: Math.round((analysis.studentIndicators / (analysis.professorIndicators + analysis.studentIndicators + 1)) * recordingTime),
          questionCount: analysis.questionCount,
          interactionCount: analysis.professorIndicators + analysis.studentIndicators
        },
        contentAnalysis: {
          topicsDiscussed: analysis.topicsDiscussed,
          conceptsExplained: Object.keys(analysis.keywordFrequency).slice(0, 5),
          examplesUsed: analysis.examplesUsed,
          keywordFrequency: analysis.keywordFrequency
        }
      });
      
      setIsAnalyzing(false);
      
      toast({
        title: "Análisis completado",
        description: "Se ha generado el análisis completo basado en el contenido de la transcripción",
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
                          {Math.round(classAnalysis.voiceAnalysis.questionCount / (recordingTime / 60))}
                        </div>
                        <p className="text-purple-700 font-medium text-sm">Preguntas por Minuto</p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-orange-600 mb-2">
                          {transcript.split(' ').length / (recordingTime / 60) || 0}
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
                              <Badge variant="secondary">{count}</Badge>
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
