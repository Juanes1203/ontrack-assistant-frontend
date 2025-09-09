import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  BookOpen, 
  Brain, 
  FileText, 
  Lightbulb, 
  Target, 
  TrendingUp,
  Users,
  Clock,
  MapPin,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  Star,
  BarChart3,
  MessageSquare,
  Eye,
  Calendar,
  User,
  Award,
  BookMarked,
  Zap
} from 'lucide-react';
import { useClass } from '@/contexts/ClassContext';
import { useStudent } from '@/contexts/StudentContext';
import { MainLayout } from '@/components/Layout';

const ClassAnalysis = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { getClassById } = useClass();
  
  console.log('🎯 ClassAnalysis component loaded with classId:', classId);
  const { getStudentById } = useStudent();
  
  const classData = getClassById(classId || '');

  if (!classData) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Clase no encontrada</h1>
            <p className="text-gray-600 mb-6">La clase que buscas no existe o ha sido eliminada.</p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Mock analysis data based on class subject - más completo como Straico
  const getAnalysisData = () => {
    if (classData.subject === 'Informática') {
      return {
        summary: "La clase de Introducción a React cubrió los conceptos fundamentales de la biblioteca de JavaScript, incluyendo la diferencia entre React y JavaScript, la capacidad de crear aplicaciones móviles con React Native, y las comparaciones con otros frameworks como Angular.",
        keyConcepts: [
          "React es una biblioteca de JavaScript, no un lenguaje nuevo",
          "React Native permite crear aplicaciones móviles nativas",
          "React es más flexible y ligero que Angular",
          "Ideal para proyectos medianos y pequeños"
        ],
        examples: [
          "Creación de componentes React simples",
          "Proyecto 'Hola Mundo' como introducción",
          "Comparación práctica entre React y Angular"
        ],
        questions: [
          "¿Cuál es la diferencia entre React y JavaScript?",
          "¿Se puede usar React para aplicaciones móviles?",
          "¿Cuándo elegir React sobre Angular?"
        ],
        connections: [
          "Fundamentos de JavaScript ES6+",
          "Conceptos de componentes y reutilización",
          "Desarrollo de interfaces de usuario modernas"
        ],
        recommendations: [
          "Practicar creando componentes simples",
          "Explorar React Native para desarrollo móvil",
          "Comparar con otros frameworks para entender cuándo usar cada uno"
        ],
        // Datos adicionales como Straico
        evaluation: {
          contextPractice: {
            understanding: { level: "AVANZADO", score: 95, evidence: ["Explicación clara de conceptos", "Ejemplos prácticos relevantes"] },
            flexibility: { level: "SATISFACTORIO", score: 85, evidence: ["Adaptación a preguntas", "Uso de analogías"] },
            familyConnection: { level: "MÍNIMO", score: 60, evidence: ["Mencionó tarea para casa"] }
          },
          reflectionPlanning: {
            clearPurposes: { level: "AVANZADO", score: 98, evidence: ["Objetivos claros", "Secuencia lógica"] },
            contentArticulation: { level: "AVANZADO", score: 92, evidence: ["Conexión entre conceptos", "Transiciones suaves"] },
            knowledgeOrganization: { level: "SATISFACTORIO", score: 88, evidence: ["Estructura clara", "Organizadores visuales"] }
          },
          pedagogicalPractice: {
            communication: { level: "AVANZADO", score: 96, evidence: ["Lenguaje claro", "Preguntas efectivas"] },
            participationStrategies: { level: "SATISFACTORIO", score: 87, evidence: ["Discusión grupal", "Participación individual"] },
            studentInterest: { level: "AVANZADO", score: 94, evidence: ["Participación activa", "Preguntas relevantes"] }
          },
          classroomEnvironment: {
            respectClimate: { level: "AVANZADO", score: 97, evidence: ["Interacciones respetuosas", "Valoración de opiniones"] },
            decisionMaking: { level: "SATISFACTORIO", score: 83, evidence: ["Estudiantes participan", "Flexibilidad"] },
            structureOrganization: { level: "AVANZADO", score: 95, evidence: ["Rutinas claras", "Transiciones organizadas"] }
          }
        },
        keyMoments: [
          { time: "00:05", type: "Introducción", description: "Establecimiento de objetivos de la clase", impact: "Alto", participant: "Profesor" },
          { time: "00:15", type: "Pregunta Crítica", description: "¿React es lo mismo que JavaScript?", impact: "Alto", participant: "Estudiante" },
          { time: "00:30", type: "Ejemplo Práctico", description: "Demostración de React Native", impact: "Alto", participant: "Profesor" }
        ],
        studentParticipation: {
          participationLevel: "Alto",
          interactionTypes: ["Preguntas", "Discusión grupal", "Ejemplos personales"],
          distribution: {
            teachers: { timeTotal: "25 minutos", interventions: 15 },
            students: { timeTotal: "20 minutos", interventions: 12 }
          }
        },
        improvementAreas: {
          strengths: ["Excelente dominio del contenido", "Comunicación clara", "Ambiente participativo"],
          opportunities: ["Más actividades prácticas", "Comunicación con familias", "Organizadores gráficos"],
          generalRecommendations: ["Mantener engagement", "Proyectos interdisciplinarios", "Evaluación formativa"]
        }
      };
    } else if (classData.subject === 'Arte') {
      return {
        summary: "La clase de Historia del Arte exploró el Renacimiento italiano, explicando el origen del término, los artistas más importantes como Leonardo da Vinci, Miguel Ángel y Rafael, las técnicas artísticas desarrolladas, y la influencia de la Iglesia en el arte de este período.",
        keyConcepts: [
          "El término 'Renacimiento' significa 'renacer' en francés",
          "Los tres grandes maestros: Leonardo, Miguel Ángel y Rafael",
          "Técnicas como perspectiva lineal y sfumato",
          "La Iglesia como principal patrocinador del arte"
        ],
        examples: [
          "Análisis de 'La Mona Lisa' de Leonardo da Vinci",
          "Técnicas de perspectiva y anatomía",
          "Influencia de la cultura clásica griega y romana"
        ],
        questions: [
          "¿Por qué se llama Renacimiento?",
          "¿Quiénes son los artistas más importantes?",
          "¿Qué técnicas se desarrollaron?",
          "¿Cómo influyó la Iglesia?"
        ],
        connections: [
          "Cultura clásica griega y romana",
          "Desarrollo de técnicas de pintura y escultura",
          "Historia de la Iglesia y el mecenazgo"
        ],
        recommendations: [
          "Visitar museos para ver obras del Renacimiento",
          "Estudiar las técnicas de perspectiva",
          "Explorar la influencia del período en el arte moderno"
        ],
        // Datos adicionales como Straico
        evaluation: {
          contextPractice: {
            understanding: { level: "AVANZADO", score: 93, evidence: ["Contexto histórico claro", "Conexiones culturales"] },
            flexibility: { level: "AVANZADO", score: 91, evidence: ["Adaptación a intereses", "Ejemplos variados"] },
            familyConnection: { level: "BUENO", score: 75, evidence: ["Tarea de investigación", "Visita familiar a museos"] }
          },
          reflectionPlanning: {
            clearPurposes: { level: "AVANZADO", score: 96, evidence: ["Objetivos artísticos claros", "Secuencia cronológica"] },
            contentArticulation: { level: "AVANZADO", score: 94, evidence: ["Conexión entre períodos", "Transiciones artísticas"] },
            knowledgeOrganization: { level: "AVANZADO", score: 90, evidence: ["Estructura histórica", "Mapas temporales"] }
          },
          pedagogicalPractice: {
            communication: { level: "AVANZADO", score: 95, evidence: ["Lenguaje artístico", "Descripciones visuales"] },
            participationStrategies: { level: "AVANZADO", score: 89, evidence: ["Análisis grupal", "Interpretación personal"] },
            studentInterest: { level: "AVANZADO", score: 96, evidence: ["Participación artística", "Preguntas creativas"] }
          },
          classroomEnvironment: {
            respectClimate: { level: "AVANZADO", score: 98, evidence: ["Respeto por opiniones", "Valoración de interpretaciones"] },
            decisionMaking: { level: "BUENO", score: 82, evidence: ["Elección de obras", "Proyectos personales"] },
            structureOrganization: { level: "AVANZADO", score: 93, evidence: ["Rutinas artísticas", "Espacios creativos"] }
          }
        },
        keyMoments: [
          { time: "00:05", type: "Introducción", description: "Definición del Renacimiento", impact: "Alto", participant: "Profesor" },
          { time: "00:20", type: "Pregunta Crítica", description: "¿Por qué se llama Renacimiento?", impact: "Alto", participant: "Estudiante" },
          { time: "00:35", type: "Análisis Visual", description: "Estudio de 'La Mona Lisa'", impact: "Alto", participant: "Profesor" }
        ],
        studentParticipation: {
          participationLevel: "Muy Alto",
          interactionTypes: ["Análisis visual", "Interpretación personal", "Preguntas históricas"],
          distribution: {
            teachers: { timeTotal: "30 minutos", interventions: 18 },
            students: { timeTotal: "25 minutos", interventions: 15 }
          }
        },
        improvementAreas: {
          strengths: ["Excelente contexto histórico", "Análisis visual detallado", "Participación creativa"],
          opportunities: ["Más visitas virtuales", "Proyectos artísticos", "Colaboración interdisciplinaria"],
          generalRecommendations: ["Mantener creatividad", "Explorar técnicas prácticas", "Conexiones culturales"]
        }
      };
    }
    
    return {
      summary: "Análisis general de la clase",
      keyConcepts: ["Conceptos básicos", "Aplicaciones prácticas"],
      examples: ["Ejemplos de la clase"],
      questions: ["Preguntas comunes"],
      connections: ["Conexiones con otros temas"],
      recommendations: ["Recomendaciones generales"],
      evaluation: {},
      keyMoments: [],
      studentParticipation: {},
      improvementAreas: {}
    };
  };

  const analysisData = getAnalysisData();
  const classStudents = classData.students?.map(id => getStudentById(id)).filter(Boolean) || [];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'AVANZADO': return 'bg-green-100 text-green-800 border-green-200';
      case 'BUENO': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SATISFACTORIO': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'MÍNIMO': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 lg:mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(`/class/${classId}`)}
            className="mr-0 sm:mr-4 border border-gray-300 hover:bg-gray-50 w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la Clase
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
              Análisis AI - {classData.name}
            </h1>
            <p className="text-gray-600">{classData.subject} • {classData.location}</p>
          </div>
        </div>

        {/* Class Info Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <span>Información de la Clase</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Estudiantes</p>
                  <p className="font-semibold">{classStudents.length}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Horario</p>
                  <p className="font-semibold">{classData.schedule.startTime} - {classData.schedule.endTime}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Ubicación</p>
                  <p className="font-semibold">{classData.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Materia</p>
                  <p className="font-semibold">{classData.subject}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Analysis Content */}
        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 bg-white border border-gray-200">
            <TabsTrigger value="summary" className="text-gray-700 hover:text-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50">
              Resumen
            </TabsTrigger>
            <TabsTrigger value="concepts" className="text-gray-700 hover:text-green-600 data-[state=active]:text-green-600 data-[state=active]:bg-green-50">
              Conceptos
            </TabsTrigger>
            <TabsTrigger value="examples" className="text-gray-700 hover:text-yellow-600 data-[state=active]:text-yellow-600 data-[state=active]:bg-yellow-50">
              Ejemplos
            </TabsTrigger>
            <TabsTrigger value="questions" className="text-gray-700 hover:text-purple-600 data-[state=active]:text-purple-600 data-[state=active]:bg-purple-50">
              Preguntas
            </TabsTrigger>
            <TabsTrigger value="connections" className="text-gray-700 hover:text-orange-600 data-[state=active]:text-orange-600 data-[state=active]:bg-orange-50">
              Conexiones
            </TabsTrigger>
            <TabsTrigger value="evaluation" className="text-gray-700 hover:text-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:bg-indigo-50">
              Evaluación
            </TabsTrigger>
            <TabsTrigger value="moments" className="text-gray-700 hover:text-pink-600 data-[state=active]:text-pink-600 data-[state=active]:bg-pink-50">
              Momentos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-6 h-6 text-blue-600" />
                  <span>Resumen Ejecutivo</span>
                </CardTitle>
                <CardDescription className="text-gray-700 font-medium">
                  Análisis general de la clase generado por IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{analysisData.summary}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="concepts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-6 h-6 text-green-600" />
                  <span>Conceptos Clave Identificados</span>
                </CardTitle>
                <CardDescription className="text-gray-700 font-medium">
                  Los temas principales discutidos durante la clase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {analysisData.keyConcepts.map((concept, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{concept}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-6 h-6 text-yellow-600" />
                  <span>Ejemplos y Casos de Estudio</span>
                </CardTitle>
                <CardDescription className="text-gray-700 font-medium">
                  Ejemplos prácticos mencionados durante la clase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {analysisData.examples.map((example, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{example}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-6 h-6 text-purple-600" />
                  <span>Preguntas y Áreas de Clarificación</span>
                </CardTitle>
                <CardDescription className="text-gray-700 font-medium">
                  Preguntas planteadas durante la clase que requieren atención
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {analysisData.questions.map((question, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{question}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="connections" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                  <span>Conexiones y Relaciones</span>
                </CardTitle>
                <CardDescription className="text-gray-700 font-medium">
                  Cómo este tema se conecta con otros del curso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {analysisData.connections.map((connection, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                      <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{connection}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evaluation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contexto de Práctica */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span>Contexto de Práctica</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysisData.evaluation.contextPractice && Object.entries(analysisData.evaluation.contextPractice).map(([key, value]: [string, any]) => (
                    <div key={key} className="border-l-4 border-gray-300 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={getLevelColor(value.level)}>
                            {value.level}
                          </Badge>
                          <span className="text-sm font-semibold text-gray-800">{value.score}%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Evidencias:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {value.evidence.map((evidencia: string, index: number) => (
                              <li key={index} className="flex items-start space-x-2">
                                <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{evidencia}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Reflexión y Planeación */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-green-600" />
                    <span>Reflexión y Planeación</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysisData.evaluation.reflectionPlanning && Object.entries(analysisData.evaluation.reflectionPlanning).map(([key, value]: [string, any]) => (
                    <div key={key} className="border-l-4 border-gray-300 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={getLevelColor(value.level)}>
                            {value.level}
                          </Badge>
                          <span className="text-sm font-semibold text-gray-800">{value.score}%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Evidencias:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {value.evidence.map((evidencia: string, index: number) => (
                              <li key={index} className="flex items-start space-x-2">
                                <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{evidencia}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Praxis Pedagógica */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <span>Praxis Pedagógica</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysisData.evaluation.pedagogicalPractice && Object.entries(analysisData.evaluation.pedagogicalPractice).map(([key, value]: [string, any]) => (
                    <div key={key} className="border-l-4 border-gray-300 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={getLevelColor(value.level)}>
                            {value.level}
                          </Badge>
                          <span className="text-sm font-semibold text-gray-800">{value.score}%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Evidencias:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {value.evidence.map((evidencia: string, index: number) => (
                              <li key={index} className="flex items-start space-x-2">
                                <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{evidencia}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Ambiente de Aula */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-orange-600" />
                    <span>Ambiente de Aula</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysisData.evaluation.classroomEnvironment && Object.entries(analysisData.evaluation.classroomEnvironment).map(([key, value]: [string, any]) => (
                    <div key={key} className="border-l-4 border-gray-300 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={getLevelColor(value.level)}>
                            {value.level}
                          </Badge>
                          <span className="text-sm font-semibold text-gray-800">{value.score}%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Evidencias:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {value.evidence.map((evidencia: string, index: number) => (
                              <li key={index} className="flex items-start space-x-2">
                                <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{evidencia}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="moments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-6 h-6 text-pink-600" />
                  <span>Momentos Clave de la Clase</span>
                </CardTitle>
                <CardDescription className="text-gray-700 font-medium">
                  Puntos críticos que marcaron el desarrollo de la sesión
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisData.keyMoments.map((momento, index) => (
                    <div key={index} className="border-l-4 border-gray-300 pl-4 py-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-gray-700 border-gray-300">
                            {momento.time}
                          </Badge>
                          <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                            {momento.type}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">{momento.participant}</span>
                      </div>
                      <h4 className="font-medium text-gray-800 mb-1">{momento.description}</h4>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Impacto:</span> {momento.impact}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recommendations Section */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="w-6 h-6 text-green-600" />
              <span>Recomendaciones de Seguimiento</span>
            </CardTitle>
            <CardDescription className="text-gray-700 font-medium">
              Sugerencias para profundizar en los temas discutidos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {analysisData.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-green-200">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                    {index + 1}
                  </Badge>
                  <p className="text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Students Performance Overview */}
        {classStudents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-6 h-6 text-indigo-600" />
                <span>Vista General de Estudiantes</span>
              </CardTitle>
              <CardDescription className="text-gray-700 font-medium">
                Resumen del rendimiento de los estudiantes en esta clase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classStudents.map((student) => (
                  <div key={student.id} className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={student.avatar}
                        alt={student.fullName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{student.fullName}</h4>
                        <p className="text-sm text-gray-500">{student.grade}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Rendimiento:</span>
                        <Badge 
                          variant="secondary" 
                          className={
                            student.performance === 'excellent' ? 'bg-green-100 text-green-800 border-green-200' :
                            student.performance === 'good' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            student.performance === 'average' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-red-100 text-red-800 border-red-200'
                          }
                        >
                          {student.performance === 'excellent' ? 'Excelente' :
                           student.performance === 'good' ? 'Bueno' :
                           student.performance === 'average' ? 'Promedio' :
                           'Necesita Mejorar'}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Asistencia:</span>
                        <span className="font-medium">{student.attendance}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default ClassAnalysis;
