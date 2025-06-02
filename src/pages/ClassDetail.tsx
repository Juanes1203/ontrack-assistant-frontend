
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
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Funciones de grabación
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        await transcribeAudio(audioBlob);
        
        // Detener todas las pistas de audio
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      
      // Iniciar cronómetro
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast({
        title: "Grabación iniciada",
        description: "La clase se está grabando correctamente",
      });
    } catch (error) {
      console.error('Error al iniciar grabación:', error);
      toast({
        title: "Error",
        description: "No se pudo acceder al micrófono",
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

      toast({
        title: "Grabación finalizada",
        description: "Procesando transcripción...",
      });
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        intervalRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
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

  // Función de transcripción simulada
  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    
    // Simulación de transcripción - en producción aquí iría la integración con un servicio real
    setTimeout(() => {
      const simulatedTranscript = `
Profesora: Buenos días estudiantes, hoy vamos a hablar sobre los conceptos básicos de React. React es una biblioteca de JavaScript para construir interfaces de usuario.

Estudiante 1: Profesora, ¿cuál es la diferencia entre React y JavaScript vanilla?

Profesora: Excelente pregunta. React nos permite crear componentes reutilizables y manejar el estado de manera más eficiente. Mientras que en JavaScript vanilla tendríamos que manipular el DOM manualmente, React lo hace por nosotros.

Estudiante 2: ¿Podría dar un ejemplo de un componente?

Profesora: Por supuesto. Un componente es como una función que retorna JSX. Por ejemplo, podríamos tener un componente Button que recibe props y renderiza un botón con estilos específicos.

Estudiante 1: ¿Qué son las props?

Profesora: Las props son como parámetros que pasamos a nuestros componentes. Son la forma en que los componentes padre comunican datos a los componentes hijo.
      `.trim();
      
      setTranscript(simulatedTranscript);
      setIsTranscribing(false);
      
      toast({
        title: "Transcripción completada",
        description: "Puedes editar el texto y generar el análisis",
      });
    }, 3000);
  };

  // Función de análisis con IA simulada
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

    // Simulación de análisis IA - en producción iría integración con OpenAI/Claude
    setTimeout(() => {
      setAnalysis({
        summary: "La clase cubrió exitosamente los conceptos fundamentales de React, incluyendo componentes, props y la diferencia con JavaScript vanilla. La profesora utilizó ejemplos prácticos y respondió efectivamente las preguntas de los estudiantes, creando un ambiente de aprendizaje interactivo.",
        strengths: [
          "Explicaciones claras y estructuradas",
          "Uso de ejemplos prácticos",
          "Fomento de la participación estudiantil",
          "Respuestas directas a las preguntas"
        ],
        weaknesses: [
          "Podría beneficiarse de más ejemplos de código en vivo",
          "Falta de ejercicios prácticos durante la clase"
        ],
        opportunities: [
          "Implementar una sesión de coding en vivo",
          "Agregar más interactividad con herramientas digitales",
          "Incluir recursos adicionales para estudio independiente"
        ],
        studentParticipation: "Los estudiantes mostraron un buen nivel de participación con preguntas relevantes y oportunas. Se evidenció interés genuino en el tema, especialmente en entender las diferencias conceptuales entre React y JavaScript vanilla."
      });
      
      setIsAnalyzing(false);
      
      toast({
        title: "Análisis completado",
        description: "Se ha generado el análisis completo de la clase",
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
              Control de Grabación
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
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2 pulse-slow"></div>
                    <span className="text-red-600 font-medium">
                      {isPaused ? 'Pausado' : 'Grabando'}
                    </span>
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
                {isTranscribing ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">Transcribiendo audio...</p>
                    </div>
                  </div>
                ) : (
                  <Textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="La transcripción aparecerá aquí una vez que finalices la grabación. Puedes editarla manualmente si es necesario."
                    className="min-h-[400px] border-2 focus:border-blue-400 text-base leading-relaxed"
                  />
                )}
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
