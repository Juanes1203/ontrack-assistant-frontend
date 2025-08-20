import React, { useState } from 'react';
import { MainLayout } from '@/components/Layout';
import { 
  CheckCircle, 
  Play, 
  GraduationCap, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  Headphones,
  Clock,
  Users,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Analytics = () => {
  const [weeklyInsightsExpanded, setWeeklyInsightsExpanded] = useState(false);

  const teachingMetrics = [
    {
      label: 'Compromiso de Estudiantes',
      value: '87%',
      trend: '+1%',
      trendType: 'positive',
      progress: 87,
      color: 'bg-green-500'
    },
    {
      label: 'Distribución del Tiempo de Habla',
      value: '60%',
      trend: '-1%',
      trendType: 'negative',
      progress: 60,
      color: 'bg-red-500'
    },
    {
      label: 'Frecuencia de Preguntas',
      value: '2 preguntas/clase',
      trend: '+8%',
      trendType: 'positive',
      progress: 85,
      color: 'bg-green-500'
    },
    {
      label: 'Retención de Conceptos',
      value: '81%',
      trend: '+8%',
      trendType: 'positive',
      progress: 81,
      color: 'bg-green-500'
    }
  ];

  const classRecordings = [
    {
      id: '1',
      title: 'Matemáticas 101 - Fundamentos de Cálculo',
      duration: '1h 25m',
      students: 14,
      date: '2024-01-30',
      status: 'Análisis Completado',
      topics: ['Derivadas', 'Regla de la Cadena', 'Aplicaciones'],
      analysisComplete: true
    },
    {
      id: '2',
      title: 'Laboratorio de Física - Mecánica Cuántica',
      duration: '2h 15m',
      students: 16,
      date: '2024-01-29',
      status: 'Análisis Completado',
      topics: ['Funciones de Onda', 'Ecuación de Schrödinger', 'Probabilidad'],
      analysisComplete: true
    },
    {
      id: '3',
      title: 'Tutorial de Química - Reacciones Orgánicas',
      duration: '45m',
      students: 12,
      date: '2024-01-28',
      status: 'Procesando',
      topics: ['Sustitución Nucleofílica', 'Mecanismos de Reacción'],
      analysisComplete: false
    }
  ];

  const studentEvaluations = [
    {
      id: '1',
      name: 'Ana Garcia',
      initials: 'AG',
      grade: 'A',
      participation: 90,
      participationScore: 92,
      interactions: 15,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: '2',
      name: 'Carlos Rodriguez',
      initials: 'CR',
      grade: 'B+',
      participation: 74,
      participationScore: 74,
      interactions: 12,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: '3',
      name: 'Maria Lopez',
      initials: 'ML',
      grade: 'A-',
      participation: 88,
      participationScore: 88,
      interactions: 18,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
    }
  ];

  const feedbackSuggestions = [
    {
      id: '1',
      name: 'Ana Garcia',
      initials: 'AG',
      status: 'Pendiente',
      priority: 'media',
      learningStyle: 'Aprendiz visual',
      description: 'Ana muestra excelente comprensión de los conceptos de cálculo. Considera proporcionar más diagramas visuales y gráficos para mejorar su aprendizaje. Su estilo de aprendizaje visual se beneficiaría de mapas mentales para temas complejos.',
      focusAreas: ['Resolución de Problemas', 'Representación Visual'],
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: '2',
      name: 'Carlos Rodriguez',
      initials: 'CR',
      status: 'En Progreso',
      priority: 'alta',
      learningStyle: 'Aprendiz kinestésico',
      description: 'Carlos se beneficia de actividades prácticas y ejemplos del mundo real. Considera incorporar más ejercicios prácticos y casos de estudio para mejorar su compromiso y comprensión.',
      focusAreas: ['Aplicaciones Prácticas', 'Ejemplos del Mundo Real'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
    }
  ];

  const weeklyData = {
    thisWeek: {
      engagement: '87%',
      improvementArea: 'Preguntas de Estudiantes',
      topTopic: 'Aplicaciones de Cálculo',
      classes: 12
    },
    lastWeek: {
      engagement: '80%',
      improvementArea: 'Ritmo de Clase',
      topTopic: 'Derivadas',
      classes: 11
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-full">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Análisis de Enseñanza
            </h1>
            <p className="text-gray-600 text-lg">
              Información completa sobre tu rendimiento de enseñanza y compromiso de estudiantes
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50 w-full sm:w-auto">
              <BarChart3 className="w-4 h-4 mr-2" />
              Exportar Datos
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
              <TrendingUp className="w-4 h-4 mr-2" />
              Generar Reporte
            </Button>
          </div>
        </div>

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Teaching Analytics - Left Top */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800">Análisis de Enseñanza</h2>
            </div>

            {/* Key Metrics */}
            <div className="space-y-4 mb-6">
              {teachingMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-800">{metric.value}</span>
                      <Badge 
                        variant={metric.trendType === 'positive' ? 'default' : 'destructive'}
                        className={`text-xs ${
                          metric.trendType === 'positive' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}
                      >
                        {metric.trendType === 'positive' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {metric.trend}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={metric.progress} className="h-2" />
                </div>
              ))}
            </div>

            {/* Weekly Insights */}
            <div className="border-t border-gray-200 pt-4">
              <button
                onClick={() => setWeeklyInsightsExpanded(!weeklyInsightsExpanded)}
                className="flex items-center justify-between w-full text-left mb-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <span className="font-medium text-gray-700">Información Semanal</span>
                {weeklyInsightsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {weeklyInsightsExpanded && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">Esta Semana</h4>
                    <div className="space-y-1 text-sm text-green-700">
                      <p>Compromiso Promedio: {weeklyData.thisWeek.engagement}</p>
                      <p>Área de Mejora: {weeklyData.thisWeek.improvementArea}</p>
                      <p>Tema Principal: {weeklyData.thisWeek.topTopic}</p>
                      <p>{weeklyData.thisWeek.classes} clases</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Semana Pasada</h4>
                    <div className="space-y-1 text-sm text-blue-700">
                      <p>Compromiso Promedio: {weeklyData.lastWeek.engagement}</p>
                      <p>Área de Mejora: {weeklyData.lastWeek.improvementArea}</p>
                      <p>Tema Principal: {weeklyData.lastWeek.topTopic}</p>
                      <p>{weeklyData.lastWeek.classes} clases</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Class Recordings & Analysis - Right Top */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <Play className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800">Grabaciones y Análisis de Clases</h2>
            </div>

            {/* Class Listings */}
            <div className="space-y-4 mb-6">
              {classRecordings.map((recording) => (
                <div key={recording.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 mb-2">{recording.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{recording.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{recording.students} estudiantes</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{recording.date}</span>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={recording.analysisComplete ? 'default' : 'secondary'}
                      className={`${
                        recording.analysisComplete 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}
                    >
                      {recording.status}
                    </Badge>
                  </div>
                  
                  {/* Topics */}
                  <div className="flex flex-wrap gap-2">
                    {recording.topics.map((topic, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Headphones className="w-3 h-3 mr-1" />
                      Escuchar
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Download className="w-3 h-3 mr-1" />
                      Descargar
                    </Button>
                    {recording.analysisComplete && (
                      <Button size="sm" className="text-xs bg-green-600 hover:bg-green-700 text-white">
                        <Eye className="w-3 h-3 mr-1" />
                        Ver Análisis
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50">
              Ver Todas las Grabaciones
            </Button>
          </div>

          {/* Automated Student Evaluation - Left Bottom */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <GraduationCap className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800">Evaluación Automatizada de Estudiantes</h2>
            </div>

            {/* Student Evaluations */}
            <div className="space-y-4">
              {studentEvaluations.map((student) => (
                <div key={student.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-green-100 text-green-800 text-sm font-medium">
                        {student.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-800">{student.name}</h4>
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          Calificación: {student.grade}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{student.participation}% participación</p>
                    </div>
                  </div>
                  
                  {/* Participation Score */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Puntuación de Participación</span>
                      <span className="font-medium text-gray-800">{student.participationScore}%</span>
                    </div>
                    <Progress value={student.participationScore} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{student.interactions} interacciones esta semana</span>
                    <Button variant="link" className="text-green-600 hover:text-green-700 p-0 h-auto text-sm">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personalized Feedback Suggestions - Right Bottom */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <MessageSquare className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800">Sugerencias de Feedback Personalizado</h2>
            </div>

            {/* Feedback Entries */}
            <div className="space-y-4">
              {feedbackSuggestions.map((feedback) => (
                <div key={feedback.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-green-100 text-green-800 text-sm font-medium">
                        {feedback.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-800">{feedback.name}</h4>
                        <Badge 
                          variant="default"
                          className="bg-green-100 text-green-800 border-green-200 text-xs"
                        >
                          {feedback.status}
                        </Badge>
                        <Badge 
                          variant="outline"
                          className={`text-xs ${
                            feedback.priority === 'alta' 
                              ? 'bg-red-50 text-red-700 border-red-200' 
                              : 'bg-orange-50 text-orange-700 border-orange-200'
                          }`}
                        >
                          prioridad {feedback.priority}
                        </Badge>
                      </div>
                      
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 mb-2">
                        {feedback.learningStyle}
                      </Badge>
                      
                      <p className="text-sm text-gray-600 mb-3">{feedback.description}</p>
                      
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-700">Áreas de Enfoque:</p>
                        <div className="flex flex-wrap gap-2">
                          {feedback.focusAreas.map((area, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Analytics;
