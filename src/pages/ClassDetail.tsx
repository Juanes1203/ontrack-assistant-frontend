
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
  MicOff
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
  
  // Estados de análisis
  const [analysis, setAnalysis] = useState({
    summary: '',
    strengths: [],
    weaknesses: [],
    opportunities: [],
    studentParticipation: ''
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
    setAnalysis({
      summary: '',
      strengths: [],
      weaknesses: [],
      opportunities: [],
      studentParticipation: ''
    });
  };

  // Función de análisis con IA mejorada
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

    // Simulación de análisis IA más realista basado en el contenido
    setTimeout(() => {
      const words = transcript.toLowerCase();
      
      // Análisis básico del contenido
      const hasQuestions = words.includes('pregunta') || words.includes('¿') || words.includes('cómo') || words.includes('qué') || words.includes('por qué');
      const hasExamples = words.includes('ejemplo') || words.includes('por ejemplo') || words.includes('como') || words.includes('demostrar');
      const hasInteraction = words.includes('estudiante') || words.includes('alumno') || words.includes('participación') || words.includes('respuesta');
      
      // Generar resumen basado en contenido
      let summary = "La clase ";
      if (transcript.length > 500) {
        summary += "fue extensa y cubrió múltiples temas de manera detallada. ";
      } else if (transcript.length > 200) {
        summary += "abordó los temas principales de forma concisa. ";
      } else {
        summary += "fue breve y se enfocó en conceptos específicos. ";
      }
      
      if (hasQuestions) {
        summary += "Se fomentó la participación estudiantil a través de preguntas. ";
      }
      if (hasExamples) {
        summary += "Se utilizaron ejemplos prácticos para explicar los conceptos. ";
      }
      if (hasInteraction) {
        summary += "Hubo interacción activa entre profesores y estudiantes.";
      }

      // Generar fortalezas dinámicas
      const strengths = [];
      if (hasExamples) strengths.push("Uso efectivo de ejemplos para clarificar conceptos");
      if (hasQuestions) strengths.push("Promoción activa de la participación estudiantil");
      if (transcript.length > 300) strengths.push("Explicaciones detalladas y bien estructuradas");
      if (hasInteraction) strengths.push("Creación de un ambiente de aprendizaje interactivo");
      
      // Si no hay suficientes indicadores, usar fortalezas generales
      if (strengths.length === 0) {
        strengths.push("Transmisión clara de información", "Mantenimiento del enfoque en el tema");
      }

      // Generar debilidades y oportunidades
      const weaknesses = [];
      const opportunities = [];
      
      if (!hasQuestions) {
        weaknesses.push("Podría beneficiarse de más preguntas para verificar comprensión");
        opportunities.push("Implementar más momentos de verificación de entendimiento");
      }
      if (!hasExamples) {
        weaknesses.push("Falta de ejemplos prácticos para ilustrar conceptos");
        opportunities.push("Incorporar más ejemplos del mundo real");
      }
      if (transcript.length < 200) {
        opportunities.push("Expandir el contenido con más detalles y explicaciones");
      }
      
      // Agregar algunas oportunidades generales
      if (opportunities.length < 2) {
        opportunities.push("Integrar más recursos multimedia", "Incluir ejercicios prácticos durante la sesión");
      }

      // Análisis de participación estudiantil
      let studentParticipation = "";
      if (hasInteraction && hasQuestions) {
        studentParticipation = "Los estudiantes mostraron un excelente nivel de participación, realizando preguntas pertinentes y contribuyendo activamente a la discusión. Se evidenció un ambiente de aprendizaje colaborativo y de confianza para expresar dudas.";
      } else if (hasQuestions) {
        studentParticipation = "Se observó participación estudiantil a través de preguntas, lo que indica interés en el tema. Sin embargo, podría fomentarse más la interacción bidireccional.";
      } else if (hasInteraction) {
        studentParticipation = "Hubo cierto nivel de interacción estudiantil, aunque podría incrementarse el número de preguntas y participaciones espontáneas.";
      } else {
        studentParticipation = "La participación estudiantil fue limitada durante esta sesión. Se recomienda implementar estrategias para fomentar más interacción, como preguntas directas, discusiones grupales o actividades participativas.";
      }

      setAnalysis({
        summary,
        strengths,
        weaknesses: weaknesses.length > 0 ? weaknesses : ["Podría incorporar más variedad en las metodologías de enseñanza"],
        opportunities,
        studentParticipation
      });
      
      setIsAnalyzing(false);
      
      toast({
        title: "Análisis completado",
        description: "Se ha generado el análisis completo basado en la transcripción de la clase",
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

        {/* Pestañas principales */}
        <Tabs defaultValue="transcript" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 h-12">
            <TabsTrigger value="transcript" className="flex items-center text-sm">
              <FileText className="w-4 h-4 mr-2" />
              Transcripción
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center text-sm">
              <Brain className="w-4 h-4 mr-2" />
              Análisis IA
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center text-sm hidden lg:flex">
              <TrendingUp className="w-4 h-4 mr-2" />
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

          {/* Pestaña Análisis IA */}
          <TabsContent value="analysis">
            <div className="space-y-6">
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-purple-600" />
                      Análisis con Inteligencia Artificial
                    </CardTitle>
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
                  </div>
                </CardHeader>
                <CardContent>
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Analizando contenido de la clase...</p>
                      </div>
                    </div>
                  ) : analysis.summary ? (
                    <div className="space-y-6">
                      {/* Resumen */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          📝 Resumen de la Clase
                        </h3>
                        <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                          {analysis.summary}
                        </p>
                      </div>

                      {/* Fortalezas */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          💪 Fortalezas
                        </h3>
                        <ul className="space-y-2">
                          {analysis.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-500 mr-2">✓</span>
                              <span className="text-gray-700">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Debilidades */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          🔍 Áreas de Mejora
                        </h3>
                        <ul className="space-y-2">
                          {analysis.weaknesses.map((weakness, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-orange-500 mr-2">⚠</span>
                              <span className="text-gray-700">{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Oportunidades */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          🚀 Oportunidades
                        </h3>
                        <ul className="space-y-2">
                          {analysis.opportunities.map((opportunity, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-blue-500 mr-2">💡</span>
                              <span className="text-gray-700">{opportunity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Participación estudiantil */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          👥 Participación Estudiantil
                        </h3>
                        <p className="text-gray-700 leading-relaxed bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                          {analysis.studentParticipation}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg mb-4">
                        Genera un análisis detallado de tu clase
                      </p>
                      <p className="text-gray-400 text-sm">
                        Primero necesitas tener una transcripción para poder analizarla
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pestaña Insights */}
          <TabsContent value="insights">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Insights y Métricas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">
                    Próximamente: Métricas avanzadas
                  </p>
                  <p className="text-gray-400 text-sm">
                    Estadísticas de participación, tiempo de habla, y más insights educativos
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
