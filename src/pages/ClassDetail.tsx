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
    professorPerformance: ''
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
      professorPerformance: ''
    });
  };

  // Función de análisis expandida
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

    // Simulación de análisis IA más completo
    setTimeout(() => {
      const words = transcript.toLowerCase();
      
      // Análisis de contenido
      const hasQuestions = words.includes('pregunta') || words.includes('¿') || words.includes('cómo') || words.includes('qué') || words.includes('por qué');
      const hasExamples = words.includes('ejemplo') || words.includes('por ejemplo') || words.includes('como') || words.includes('demostrar');
      const hasInteraction = words.includes('estudiante') || words.includes('alumno') || words.includes('participación') || words.includes('respuesta');
      const hasExplanations = words.includes('explicar') || words.includes('entender') || words.includes('concepto') || words.includes('teoría');
      const hasProfessorKeywords = words.includes('profesor') || words.includes('maestro') || words.includes('docente');
      
      // Generar resumen detallado
      let summary = `La clase de ${classData.name} `;
      if (transcript.length > 800) {
        summary += "fue una sesión muy completa y extensa que abordó múltiples aspectos del tema con gran profundidad. ";
      } else if (transcript.length > 400) {
        summary += "cubrió los temas principales de manera satisfactoria con buen nivel de detalle. ";
      } else {
        summary += "se enfocó en conceptos específicos de forma concisa. ";
      }
      
      if (hasQuestions && hasInteraction) {
        summary += "Se evidenció un excelente intercambio de ideas entre el profesor y los estudiantes, con participación activa y preguntas relevantes. ";
      }
      if (hasExamples) {
        summary += "Se utilizaron ejemplos prácticos efectivos para facilitar la comprensión. ";
      }
      if (hasExplanations) {
        summary += "Las explicaciones fueron claras y bien estructuradas.";
      }

      // Fortalezas específicas
      const strengths = [];
      if (hasExamples) strengths.push("Uso efectivo de ejemplos para clarificar conceptos complejos");
      if (hasQuestions) strengths.push("Promoción activa de la participación estudiantil");
      if (hasExplanations) strengths.push("Explicaciones claras y bien estructuradas");
      if (hasInteraction) strengths.push("Creación de un ambiente de aprendizaje interactivo");
      if (transcript.length > 500) strengths.push("Cobertura completa del contenido programático");
      if (strengths.length === 0) {
        strengths.push("Transmisión ordenada de la información", "Mantenimiento del enfoque temático");
      }

      // Debilidades identificadas
      const weaknesses = [];
      if (!hasQuestions) weaknesses.push("Falta de verificación de comprensión estudiantil");
      if (!hasExamples) weaknesses.push("Ausencia de ejemplos prácticos para ilustrar conceptos");
      if (!hasInteraction) weaknesses.push("Limitada interacción bidireccional con estudiantes");
      if (transcript.length < 300) weaknesses.push("Contenido insuficiente para el tiempo de clase asignado");
      if (weaknesses.length === 0) {
        weaknesses.push("Podría beneficiarse de mayor variedad metodológica");
      }

      // Oportunidades de mejora
      const opportunities = [];
      if (!hasExamples) opportunities.push("Incorporar más casos prácticos y ejemplos del mundo real");
      if (!hasQuestions) opportunities.push("Implementar técnicas de verificación de aprendizaje");
      if (!hasInteraction) opportunities.push("Fomentar mayor participación estudiantil");
      opportunities.push("Integrar recursos multimedia interactivos");
      opportunities.push("Incluir actividades colaborativas durante la sesión");

      // Análisis de participación estudiantil detallado
      let studentParticipation = "";
      const participationLevel = hasInteraction && hasQuestions ? 'alta' : hasQuestions ? 'media' : 'baja';
      
      if (participationLevel === 'alta') {
        studentParticipation = "Los estudiantes demostraron un nivel excelente de participación y compromiso. Se observó iniciativa para realizar preguntas pertinentes, contribuir activamente a las discusiones y mostrar interés genuino en el tema. El ambiente de aprendizaje fue colaborativo y propicio para el intercambio de ideas. Los estudiantes se sintieron cómodos expresando dudas y aportando sus perspectivas.";
      } else if (participationLevel === 'media') {
        studentParticipation = "Se evidenció un nivel moderado de participación estudiantil. Algunos estudiantes realizaron preguntas y contribuyeron a la discusión, aunque podría fomentarse mayor interacción. Se recomienda implementar estrategias para motivar a más estudiantes a participar activamente, como preguntas directas, trabajo en grupos pequeños o técnicas de participación inclusiva.";
      } else {
        studentParticipation = "La participación estudiantil fue limitada durante esta sesión. Se observó una actitud principalmente receptiva por parte de los estudiantes, con poca iniciativa para hacer preguntas o contribuir a discusiones. Se recomienda implementar estrategias dinámicas como: preguntas frecuentes al grupo, actividades participativas, discusiones dirigidas, y crear un ambiente más estimulante para la participación voluntaria.";
      }

      // Análisis del desempeño del profesor
      let professorPerformance = "";
      const professorQuality = (hasExplanations && hasExamples) ? 'excelente' : 
                             (hasExplanations || hasExamples) ? 'bueno' : 'mejorable';
      
      if (professorQuality === 'excelente') {
        professorPerformance = "El profesor demostró un desempeño excelente durante la clase. Se evidenció dominio sólido del tema, capacidad para explicar conceptos complejos de manera accesible, y habilidades pedagógicas efectivas. La presentación fue organizada, clara y bien estructurada. El profesor mostró flexibilidad para adaptar las explicaciones según las necesidades del grupo y fomentó un ambiente de aprendizaje positivo. Su conocimiento del tema es profundo y su metodología de enseñanza es efectiva.";
      } else if (professorQuality === 'bueno') {
        professorPerformance = "El profesor mostró un buen dominio del tema y competencias pedagógicas adecuadas. Las explicaciones fueron mayormente claras y el contenido se presentó de manera organizada. Sin embargo, hay oportunidades para enriquecer la metodología de enseñanza, como incorporar más ejemplos prácticos, aumentar la interacción con estudiantes, o utilizar técnicas más dinámicas. El conocimiento técnico es sólido, pero la presentación podría ser más engaging.";
      } else {
        professorPerformance = "Se identifican áreas significativas de mejora en el desempeño docente. Aunque se evidencia conocimiento del tema, la metodología de enseñanza requiere desarrollo. Se recomienda: mejorar la claridad en las explicaciones, incorporar más ejemplos prácticos, fomentar mayor interacción estudiantil, y desarrollar técnicas más dinámicas de presentación. Sería beneficioso recibir capacitación en metodologías pedagógicas activas y técnicas de engagement estudiantil.";
      }

      setClassAnalysis({
        summary,
        strengths,
        weaknesses,
        opportunities,
        studentParticipation,
        professorPerformance
      });
      
      setIsAnalyzing(false);
      
      toast({
        title: "Análisis completado",
        description: "Se ha generado el análisis completo de todos los aspectos de la clase",
      });
    }, 4000);
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
                        📝 Resumen Ejecutivo
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
                  Análisis FODA (Fortalezas, Oportunidades, Debilidades, Amenazas)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {classAnalysis.strengths.length > 0 ? (
                  <div className="space-y-6">
                    {/* Fortalezas */}
                    <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                        💪 Fortalezas Identificadas
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
                        🔍 Áreas de Mejora
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
                      Genera el análisis para ver fortalezas, debilidades y oportunidades
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
                  Análisis de Participación Estudiantil
                </CardTitle>
              </CardHeader>
              <CardContent>
                {classAnalysis.studentParticipation ? (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                        👥 Evaluación de Participación y Actitud
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-base">
                        {classAnalysis.studentParticipation}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600 mb-2">
                          {classAnalysis.studentParticipation.includes('excelente') ? '9/10' : 
                           classAnalysis.studentParticipation.includes('moderado') ? '6/10' : '4/10'}
                        </div>
                        <p className="text-green-700 font-medium">Nivel de Participación</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-2">
                          {classAnalysis.studentParticipation.includes('colaborativo') ? '9/10' : 
                           classAnalysis.studentParticipation.includes('interacción') ? '7/10' : '5/10'}
                        </div>
                        <p className="text-purple-700 font-medium">Interacción</p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-orange-600 mb-2">
                          {classAnalysis.studentParticipation.includes('iniciativa') ? '8/10' : 
                           classAnalysis.studentParticipation.includes('algunas') ? '6/10' : '4/10'}
                        </div>
                        <p className="text-orange-700 font-medium">Iniciativa</p>
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
                      Genera el análisis para evaluar la participación y actitud de los estudiantes
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
                  Evaluación del Desempeño Docente
                </CardTitle>
              </CardHeader>
              <CardContent>
                {classAnalysis.professorPerformance ? (
                  <div className="space-y-6">
                    <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                        🎓 Análisis del Desempeño Docente
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-base">
                        {classAnalysis.professorPerformance}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600 mb-2">
                          {classAnalysis.professorPerformance.includes('excelente') ? '9/10' : 
                           classAnalysis.professorPerformance.includes('buen') ? '7/10' : '5/10'}
                        </div>
                        <p className="text-green-700 font-medium text-sm">Dominio del Tema</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-2">
                          {classAnalysis.professorPerformance.includes('clara') || classAnalysis.professorPerformance.includes('accesible') ? '8/10' : 
                           classAnalysis.professorPerformance.includes('mayormente') ? '7/10' : '5/10'}
                        </div>
                        <p className="text-blue-700 font-medium text-sm">Claridad</p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-yellow-600 mb-2">
                          {classAnalysis.professorPerformance.includes('efectiva') || classAnalysis.professorPerformance.includes('positivo') ? '8/10' : 
                           classAnalysis.professorPerformance.includes('adecuadas') ? '6/10' : '4/10'}
                        </div>
                        <p className="text-yellow-700 font-medium text-sm">Metodología</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-red-600 mb-2">
                          {classAnalysis.professorPerformance.includes('organizada') || classAnalysis.professorPerformance.includes('estructurada') ? '9/10' : 
                           classAnalysis.professorPerformance.includes('organizada') ? '7/10' : '6/10'}
                        </div>
                        <p className="text-red-700 font-medium text-sm">Organización</p>
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
                      Genera el análisis para evaluar el conocimiento y metodología del profesor
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
                  Insights y Métricas Avanzadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">
                    Próximamente: Métricas avanzadas y analytics
                  </p>
                  <p className="text-gray-400 text-sm">
                    Estadísticas detalladas, tendencias de aprendizaje, y métricas de rendimiento
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClassDetail;
