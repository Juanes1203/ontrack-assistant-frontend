import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  BookOpen, 
  Users, 
  Clock, 
  Target, 
  TrendingUp, 
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Info,
  Star,
  MessageSquare,
  BarChart3,
  FileText,
  Eye
} from 'lucide-react';
import { MainLayout } from '@/components/Layout';
import { useClass } from '@/contexts/ClassContext';

const ClassAnalysis = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { getClassById } = useClass();
  
  const classData = getClassById(classId || '');
  
  // Mock analysis data - in real app this would come from the recording hook or context
  const mockAnalysis = {
    transcript: "Profesor: Buenos días estudiantes, hoy vamos a discutir sobre la fotosíntesis...",
    resumen: {
      tema: "Fotosíntesis y Respiración Celular",
      objetivos: "Comprender los procesos de fotosíntesis y su importancia en el ecosistema",
      duracion: "45 minutos",
      participantes: {
        profesores: ["Juan Carlos Suarez"],
        estudiantes: ["Cristina Paez", "Ana Maria Cruz", "Laura Silva"]
      }
    },
    criterios_evaluacion: {
      contexto_practica: {
        comprension_contexto: {
          nivel: "AVANZADO",
          evidencias: ["Explicación clara del contexto científico", "Conexión con ejemplos del mundo real"],
          recomendaciones: ["Mantener el enfoque contextual"]
        },
        flexibilidad_practica: {
          nivel: "SATISFACTORIO",
          evidencias: ["Adaptación a preguntas de estudiantes", "Uso de analogías"],
          recomendaciones: ["Incluir más ejemplos prácticos"]
        },
        vinculacion_familias: {
          nivel: "MÍNIMO",
          evidencias: ["Mencionó tarea para casa"],
          recomendaciones: ["Fortalecer comunicación con familias"]
        }
      },
      reflexion_planeacion: {
        propositos_claros: {
          nivel: "AVANZADO",
          evidencias: ["Objetivos claramente establecidos", "Secuencia lógica de conceptos"],
          recomendaciones: ["Excelente planificación"]
        },
        articulacion_contenidos: {
          nivel: "AVANZADO",
          evidencias: ["Conexión entre conceptos previos y nuevos", "Transiciones suaves"],
          recomendaciones: ["Mantener esta calidad"]
        },
        organizacion_conocimiento: {
          nivel: "SATISFACTORIO",
          evidencias: ["Estructura clara de la lección", "Uso de organizadores gráficos"],
          recomendaciones: ["Incluir más mapas conceptuales"]
        }
      },
      praxis_pedagogica: {
        comunicacion_docente_estudiantes: {
          nivel: "AVANZADO",
          evidencias: ["Lenguaje claro y apropiado", "Preguntas abiertas efectivas"],
          recomendaciones: ["Excelente comunicación"]
        },
        estrategias_participacion: {
          nivel: "SATISFACTORIO",
          evidencias: ["Discusión grupal", "Preguntas individuales"],
          recomendaciones: ["Incluir más actividades colaborativas"]
        },
        interes_estudiantes: {
          nivel: "AVANZADO",
          evidencias: ["Participación activa", "Preguntas relevantes"],
          recomendaciones: ["Mantener el nivel de engagement"]
        }
      },
      ambiente_aula: {
        clima_respeto: {
          nivel: "AVANZADO",
          evidencias: ["Interacciones respetuosas", "Valoración de todas las opiniones"],
          recomendaciones: ["Excelente ambiente de respeto"]
        },
        toma_decisiones: {
          nivel: "SATISFACTORIO",
          evidencias: ["Estudiantes participan en decisiones", "Flexibilidad en el desarrollo"],
          recomendaciones: ["Fomentar más autonomía estudiantil"]
        },
        estructura_organizacion: {
          nivel: "AVANZADO",
          evidencias: ["Rutinas claras", "Transiciones organizadas"],
          recomendaciones: ["Mantener la excelente organización"]
        }
      }
    },
    momentos_clave: [
      {
        tiempo: "00:05",
        tipo: "Introducción",
        descripcion: "Establecimiento claro de objetivos de la clase",
        impacto: "Alto - Los estudiantes comprendieron qué aprenderían",
        participante: "Profesor"
      },
      {
        tiempo: "00:15",
        tipo: "Pregunta Crítica",
        descripcion: "¿Por qué es importante la fotosíntesis para nosotros?",
        impacto: "Alto - Generó discusión significativa",
        participante: "Estudiante (Cristina)"
      },
      {
        tiempo: "00:30",
        tipo: "Ejemplo Práctico",
        descripcion: "Analogía con una fábrica de alimentos",
        impacto: "Alto - Clarificó el concepto abstracto",
        participante: "Profesor"
      }
    ],
    participacion_estudiantes: {
      nivel_participacion: "Alto",
      tipos_interaccion: ["Preguntas", "Discusión grupal", "Ejemplos personales"],
      momentos_destacados: ["Intervención de Cristina sobre importancia práctica", "Comentario de Ana sobre plantas en casa"],
      distribucion_participacion: {
        profesores: {
          tiempo_total: "25 minutos",
          intervenciones: 15
        },
        estudiantes: {
          tiempo_total: "20 minutos",
          intervenciones: 12
        }
      }
    },
    areas_mejora: {
      fortalezas: [
        "Excelente dominio del contenido",
        "Comunicación clara y efectiva",
        "Ambiente de respeto y participación"
      ],
      oportunidades: [
        "Incluir más actividades prácticas",
        "Fortalecer comunicación con familias",
        "Usar más organizadores gráficos"
      ],
      recomendaciones_generales: [
        "Mantener el alto nivel de engagement",
        "Considerar proyectos interdisciplinarios",
        "Implementar más evaluación formativa"
      ]
    }
  };

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'AVANZADO':
        return 'bg-green-100 text-green-800 border-gray-300';
      case 'SATISFACTORIO':
        return 'bg-blue-100 text-blue-800 border-gray-300';
      case 'MÍNIMO':
        return 'bg-yellow-100 text-yellow-800 border-gray-300';
      case 'INFERIOR':
        return 'bg-red-100 text-red-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

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
              Análisis AI de la Clase
            </h1>
            <p className="text-gray-600 text-lg">
              {classData.name} - Análisis detallado con Inteligencia Artificial
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Tema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <p className="text-lg font-semibold text-gray-800">{mockAnalysis.resumen.tema}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Duración</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-green-600" />
                <p className="text-lg font-semibold text-gray-800">{mockAnalysis.resumen.duracion}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Participantes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-600" />
                <p className="text-lg font-semibold text-gray-800">
                  {mockAnalysis.resumen.participantes.profesores.length + mockAnalysis.resumen.participantes.estudiantes.length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Nivel General</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-600" />
                <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                  AVANZADO
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analysis Content */}
        <Tabs defaultValue="evaluacion" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="evaluacion">Evaluación ECDF</TabsTrigger>
            <TabsTrigger value="momentos">Momentos Clave</TabsTrigger>
            <TabsTrigger value="participacion">Participación</TabsTrigger>
            <TabsTrigger value="mejoras">Áreas de Mejora</TabsTrigger>
          </TabsList>

          <TabsContent value="evaluacion" className="space-y-6">
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
                  {Object.entries(mockAnalysis.criterios_evaluacion.contexto_practica).map(([key, value]) => (
                    <div key={key} className="border-l-4 border-gray-300 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800 capitalize">
                          {key.replace(/_/g, ' ')}
                        </h4>
                        <Badge className={getNivelColor(value.nivel)}>
                          {value.nivel}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Evidencias:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {value.evidencias.map((evidencia, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{evidencia}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Recomendaciones:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {value.recomendaciones.map((recomendacion, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <Lightbulb className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <span>{recomendacion}</span>
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
                  {Object.entries(mockAnalysis.criterios_evaluacion.reflexion_planeacion).map(([key, value]) => (
                    <div key={key} className="border-l-4 border-gray-300 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800 capitalize">
                          {key.replace(/_/g, ' ')}
                        </h4>
                        <Badge className={getNivelColor(value.nivel)}>
                          {value.nivel}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Evidencias:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {value.evidencias.map((evidencia, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{evidencia}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Recomendaciones:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {value.recomendaciones.map((recomendacion, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <Lightbulb className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <span>{recomendacion}</span>
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
                  {Object.entries(mockAnalysis.criterios_evaluacion.praxis_pedagogica).map(([key, value]) => (
                    <div key={key} className="border-l-4 border-gray-300 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800 capitalize">
                          {key.replace(/_/g, ' ')}
                        </h4>
                        <Badge className={getNivelColor(value.nivel)}>
                          {value.nivel}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Evidencias:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {value.evidencias.map((evidencia, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{evidencia}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Recomendaciones:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {value.recomendaciones.map((recomendacion, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <Lightbulb className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <span>{recomendacion}</span>
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
                  {Object.entries(mockAnalysis.criterios_evaluacion.ambiente_aula).map(([key, value]) => (
                    <div key={key} className="border-l-4 border-gray-300 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800 capitalize">
                          {key.replace(/_/g, ' ')}
                        </h4>
                        <Badge className={getNivelColor(value.nivel)}>
                          {value.nivel}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Evidencias:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {value.evidencias.map((evidencia, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{evidencia}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Recomendaciones:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {value.recomendaciones.map((recomendacion, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <Lightbulb className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <span>{recomendacion}</span>
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

          <TabsContent value="momentos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>Momentos Clave de la Clase</span>
                </CardTitle>
                <CardDescription>
                  Puntos críticos que marcaron el desarrollo de la sesión
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalysis.momentos_clave.map((momento, index) => (
                    <div key={index} className="border-l-4 border-gray-300 pl-4 py-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-gray-700 border-gray-300">
                            {momento.tiempo}
                          </Badge>
                          <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                            {momento.tipo}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">{momento.participante}</span>
                      </div>
                      <h4 className="font-medium text-gray-800 mb-1">{momento.descripcion}</h4>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Impacto:</span> {momento.impacto}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="participacion" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    <span>Nivel de Participación</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Nivel General:</span>
                      <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                        {mockAnalysis.participacion_estudiantes.nivel_participacion}
                      </Badge>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Tipos de Interacción:</p>
                      <div className="flex flex-wrap gap-2">
                        {mockAnalysis.participacion_estudiantes.tipos_interaccion.map((tipo, index) => (
                          <Badge key={index} variant="outline" className="text-gray-600 border-gray-300">
                            {tipo}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Momentos Destacados:</p>
                      <ul className="space-y-1">
                        {mockAnalysis.participacion_estudiantes.momentos_destacados.map((momento, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                            <Star className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <span>{momento}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span>Distribución de Participación</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-gray-300 pl-4">
                      <h4 className="font-medium text-gray-800 mb-2">Profesores</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Tiempo Total:</span>
                          <span className="text-sm font-medium text-gray-800">
                            {mockAnalysis.participacion_estudiantes.distribucion_participacion.profesores.tiempo_total}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Intervenciones:</span>
                          <span className="text-sm font-medium text-gray-800">
                            {mockAnalysis.participacion_estudiantes.distribucion_participacion.profesores.intervenciones}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-gray-300 pl-4">
                      <h4 className="font-medium text-gray-800 mb-2">Estudiantes</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Tiempo Total:</span>
                          <span className="text-sm font-medium text-gray-800">
                            {mockAnalysis.participacion_estudiantes.distribucion_participacion.estudiantes.tiempo_total}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Intervenciones:</span>
                          <span className="text-sm font-medium text-gray-800">
                            {mockAnalysis.participacion_estudiantes.distribucion_participacion.estudiantes.intervenciones}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="mejoras" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Fortalezas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {mockAnalysis.areas_mejora.fortalezas.map((fortaleza, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{fortaleza}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    <span>Oportunidades</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {mockAnalysis.areas_mejora.oportunidades.map((oportunidad, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{oportunidad}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span>Recomendaciones</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {mockAnalysis.areas_mejora.recomendaciones_generales.map((recomendacion, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{recomendacion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ClassAnalysis;
