import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  ArrowRight,
  Brain, 
  BookOpen, 
  Lightbulb, 
  HelpCircle, 
  Link, 
  Star,
  Clock,
  FileText,
  TrendingUp,
  Target,
  RefreshCw
} from 'lucide-react';
import { classesService } from '@/services/classesService';

interface AnalysisData {
  summary: {
    title: string;
    content: string;
    duration: string;
    participants: number;
  };
  ecdfAnalysis: {
    structure: {
      organization: string;
      logicalSequence: string;
      clearObjectives: string;
      score: number;
    };
    content: {
      accuracy: string;
      depth: string;
      relevance: string;
      upToDate: string;
      score: number;
    };
    dynamics: {
      interaction: string;
      participation: string;
      methodology: string;
      resources: string;
      score: number;
    };
    formation: {
      competenceDevelopment: string;
      evaluation: string;
      feedback: string;
      score: number;
    };
  };
  concepts: Array<{
    name: string;
    description: string;
    importance: string;
    examples: string[];
  }>;
  examples: Array<{
    type: string;
    description: string;
    effectiveness: string;
    context: string;
  }>;
  questions: Array<{
    question: string;
    type: string;
    quality: string;
    purpose: string;
  }>;
  connections: Array<{
    from: string;
    to: string;
    type: string;
    strength: string;
    explanation: string;
  }>;
  moments: Array<{
    timestamp: string;
    type: string;
    description: string;
    significance: string;
  }>;
  evaluation: {
    overallScore: number;
    strengths: string[];
    areasForImprovement: string[];
    recommendations: string[];
  };
}

const ClassAnalysisPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(0);

  useEffect(() => {
    if (classId) {
      loadAnalysisData();
    }
  }, [classId]);

  const loadAnalysisData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      
      const response = await classesService.getClassWithAnalyses(classId!);
      
      // Los análisis están dentro de las grabaciones
      const allAnalyses = response.data.recordings?.flatMap(recording => recording.analyses || []) || [];
      
      if (allAnalyses.length > 0) {
        const latestAnalysis = allAnalyses[0];
        
        if (latestAnalysis.status === 'COMPLETED' && latestAnalysis.analysisData) {
          const parsedData = JSON.parse(latestAnalysis.analysisData);
          setAnalysisData(parsedData);
          setError(null); // Limpiar error si se encuentra análisis
        } else if (latestAnalysis.status === 'PENDING') {
          setError('El análisis aún está en progreso. Por favor, intenta de nuevo en unos minutos.');
        } else if (latestAnalysis.status === 'FAILED') {
          setError('Error en el análisis. Por favor, intenta grabar la clase nuevamente.');
        } else {
          setError('Estado de análisis desconocido: ' + latestAnalysis.status);
        }
      } else {
        setError('No se encontró análisis para esta clase.');
      }

      // Obtener transcript de la grabación más reciente
      if (response.data.recordings && response.data.recordings.length > 0) {
        const latestRecording = response.data.recordings[0];
        setTranscript(latestRecording.transcript || 'No hay transcript disponible');
      } else {
        setTranscript('No hay grabaciones disponibles para esta clase');
      }
    } catch (err: any) {
      if (err.response?.status === 429) {
        setError('Demasiadas peticiones. Por favor, espera unos segundos antes de intentar de nuevo.');
      } else {
        setError('Error al cargar el análisis: ' + err.message);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    const now = Date.now();
    const timeSinceLastRefresh = now - lastRefreshTime;
    
    // Debounce: solo permitir refresh cada 3 segundos
    if (timeSinceLastRefresh < 3000) {
      setError('Por favor, espera unos segundos antes de actualizar nuevamente.');
      return;
    }
    
    setLastRefreshTime(now);
    loadAnalysisData(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando análisis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Error</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => navigate('/classes')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a Clases
                </Button>
                {error.includes('en progreso') && (
                  <Button 
                    onClick={handleRefresh} 
                    variant="outline"
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? 'Actualizando...' : 'Actualizar'}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No hay datos</h3>
              <p className="text-gray-600 mb-4">No se encontraron datos de análisis.</p>
              <Button onClick={() => navigate('/classes')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Clases
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/classes')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Clases
          </Button>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Análisis de Clase</h1>
                <p className="text-gray-600">{analysisData?.summary?.title || 'Cargando...'}</p>
              </div>
            </div>
            <Button 
              onClick={handleRefresh} 
              variant="outline"
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Actualizando...' : 'Actualizar'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transcript */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Transcript de la Clase
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  {transcript && transcript.trim() ? (
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {transcript}
                    </p>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-sm">
                        {transcript === 'No hay grabaciones disponibles para esta clase' 
                          ? 'No hay grabaciones disponibles para esta clase'
                          : 'No se capturó transcripción durante la grabación'
                        }
                      </p>
                      <p className="text-gray-400 text-xs mt-2">
                        Esto puede deberse a problemas de micrófono o configuración de audio
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Análisis Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resumen */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Resumen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{analysisData.summary.content}</p>
                <div className="mt-4 flex gap-4 text-sm text-gray-600">
                  <span>Duración: {analysisData.summary.duration}</span>
                  <span>Participantes: {analysisData.summary.participants}</span>
                </div>
              </CardContent>
            </Card>

            {/* Conceptos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Conceptos Clave
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisData.concepts.map((concept, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold text-gray-900">{concept.name}</h4>
                      <p className="text-gray-700 text-sm mt-1">{concept.description}</p>
                      <p className="text-gray-600 text-xs mt-1">Importancia: {concept.importance}</p>
                      {concept.examples.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-gray-600">Ejemplos:</p>
                          <ul className="text-xs text-gray-600 list-disc list-inside">
                            {concept.examples.map((example, i) => (
                              <li key={i}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ejemplos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Ejemplos Utilizados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisData.examples.map((example, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{example.type}</Badge>
                      </div>
                      <p className="text-gray-700 text-sm">{example.description}</p>
                      <p className="text-gray-600 text-xs mt-1">Efectividad: {example.effectiveness}</p>
                      <p className="text-gray-600 text-xs">Contexto: {example.context}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Preguntas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Preguntas Planteadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisData.questions.map((question, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4">
                      <p className="text-gray-700 font-medium">"{question.question}"</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{question.type}</Badge>
                        <Badge variant="outline" className="text-xs">{question.quality}</Badge>
                      </div>
                      <p className="text-gray-600 text-xs mt-1">Propósito: {question.purpose}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Conexiones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Conexiones entre Conceptos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisData.connections.map((connection, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">{connection.from}</span>
                        <ArrowRight className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{connection.to}</span>
                        <Badge variant="outline" className="text-xs">{connection.type}</Badge>
                      </div>
                      <p className="text-gray-700 text-sm">{connection.explanation}</p>
                      <p className="text-gray-600 text-xs mt-1">Fuerza: {connection.strength}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Momentos Destacados */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Momentos Destacados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisData.moments.map((moment, index) => (
                    <div key={index} className="border-l-4 border-purple-500 pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-600">{moment.timestamp}</span>
                        <Badge variant="outline" className="text-xs">{moment.type}</Badge>
                      </div>
                      <p className="text-gray-700 text-sm">{moment.description}</p>
                      <p className="text-gray-600 text-xs mt-1">Significado: {moment.significance}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Evaluación */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Evaluación General
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {analysisData.evaluation.overallScore}/10
                    </div>
                    <p className="text-gray-600">Puntuación General</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">Fortalezas</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {analysisData.evaluation.strengths.map((strength, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-orange-700 mb-2">Áreas de Mejora</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {analysisData.evaluation.areasForImprovement.map((area, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                            {area}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">Recomendaciones</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {analysisData.evaluation.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassAnalysisPage;
