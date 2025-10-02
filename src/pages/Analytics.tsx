import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  Search, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  BarChart3,
  FileText,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { classesService } from '@/services/classesService';
import { Class } from '@/types/api';

interface AnalysisData {
  id: string;
  status: string;
  createdAt: string;
  analysisData: {
    summary: {
      title: string;
      duration: string;
      participation: string;
      level: string;
    };
    concepts: string[];
    examples: string[];
    questions: string[];
    connections: string[];
    moments: string[];
    evaluation: {
      overall: number;
      clarity: number;
      participation: number;
      examples: number;
      connections: number;
    };
  };
  recording: {
    id: string;
    title: string;
    status: string;
    createdAt: string;
    transcript: string;
    classId: string;
  };
}

interface ClassWithAnalyses {
  id: string;
  name: string;
  subject: string;
  schedule: string;
  status: string;
  recordings: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: string;
    transcript: string;
    analyses: AnalysisData[];
  }>;
}

const Analytics = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassWithAnalyses[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisData | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Obtener análisis del usuario actual (seguro)
      const response = await classesService.getUserAnalyses(1, 100);
      const analysesData = response.data.analyses as AnalysisData[] || [];
      
      // Obtener información de las clases
      const classesResponse = await classesService.getClasses(1, 100); // Obtener más clases
      const classesData = classesResponse.data as Class[] || [];
      
      // Crear un mapa de clases para acceso rápido
      const classesInfoMap = new Map<string, Class>();
      classesData.forEach(cls => {
        if (cls && cls.id) {
          classesInfoMap.set(cls.id, cls);
        }
      });
      
      // Agrupar análisis por clase
      const classesMap = new Map<string, ClassWithAnalyses>();
      
      // Verificar que analysesData sea un array válido antes de procesarlo
      if (Array.isArray(analysesData)) {
        analysesData.forEach(analysis => {
        // Verificar que analysis y analysis.recording existan
        if (!analysis || !analysis.recording || !analysis.recording.classId) {
          console.warn('Analysis o recording incompleto:', analysis);
          return; // Saltar este análisis
        }
        
        const classId = analysis.recording.classId;
        
        if (!classesMap.has(classId)) {
          const classInfo = classesInfoMap.get(classId);
          classesMap.set(classId, {
            id: classId,
            name: classInfo?.name || `Clase ${classId.slice(-8)}`,
            subject: classInfo?.subject || 'Sin especificar',
            schedule: classInfo?.schedule || 'Sin especificar',
            status: classInfo?.status || 'COMPLETED',
            recordings: []
          });
        }
        
        const classItem = classesMap.get(classId)!;
        
        // Buscar si ya existe esta grabación
        let recording = classItem.recordings.find(r => r.id === analysis.recording.id);
        if (!recording) {
          recording = {
            id: analysis.recording.id,
            title: analysis.recording.title,
            status: analysis.recording.status,
            createdAt: analysis.recording.createdAt,
            transcript: analysis.recording.transcript,
            analyses: []
          };
          classItem.recordings.push(recording);
        }
        
        // Agregar el análisis a la grabación
        recording.analyses.push(analysis);
        });
      }
      
      // Convertir Map a Array y filtrar solo clases con análisis
      const classesWithAnalyses = Array.from(classesMap.values()).filter(classItem => 
        classItem.recordings.some(recording => recording.analyses.length > 0)
      );
      
      setClasses(classesWithAnalyses);
    } catch (err: any) {
      setError('Error al cargar los análisis: ' + err.message);
      console.error('Error loading analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllAnalyses = (): AnalysisData[] => {
    return classes.flatMap(classItem => 
      classItem.recordings ? classItem.recordings.flatMap(recording => recording.analyses || []) : []
    );
  };

  const getFilteredAnalyses = (): AnalysisData[] => {
    let analyses = getAllAnalyses();
    
    if (selectedClass !== 'all') {
      analyses = analyses.filter(analysis => 
        classes.find(c => c.id === selectedClass)?.recordings?.some(r => 
          r.analyses && r.analyses.includes(analysis)
        )
      );
    }
    
    if (searchTerm) {
      analyses = analyses.filter(analysis => 
        analysis.recording.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        analysis.analysisData?.summary?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        analysis.analysisData?.concepts?.some(concept => 
          concept && (typeof concept === 'string' ? concept : concept.name || concept.description || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    return analyses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportAnalysis = (analysis: AnalysisData) => {
    const data = {
      clase: classes.find(c => c.recordings?.some(r => r.analyses && r.analyses.includes(analysis)))?.name,
      materia: classes.find(c => c.recordings?.some(r => r.analyses && r.analyses.includes(analysis)))?.subject,
      fecha: formatDate(analysis.createdAt),
      titulo: analysis.recording.title,
      resumen: analysis.analysisData?.summary,
      conceptos: analysis.analysisData?.concepts,
      ejemplos: analysis.analysisData?.examples,
      preguntas: analysis.analysisData?.questions,
      conexiones: analysis.analysisData?.connections,
      momentos: analysis.analysisData?.moments,
      evaluacion: analysis.analysisData?.evaluation
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analisis-${analysis.recording.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando análisis...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const filteredAnalyses = getFilteredAnalyses();

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Centro de Análisis</h1>
            <p className="text-gray-600 mt-1">
              Análisis de IA de todas tus clases grabadas
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadAnalytics} variant="outline">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Análisis</p>
                  <p className="text-2xl font-bold">{getAllAnalyses().length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Clases Analizadas</p>
                  <p className="text-2xl font-bold">{classes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Promedio General</p>
                  <p className="text-2xl font-bold">
                    {getAllAnalyses().length > 0 
                      ? (getAllAnalyses().reduce((sum, a) => sum + (a.analysisData?.evaluation?.overall || 0), 0) / getAllAnalyses().length).toFixed(1)
                      : '0.0'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Último Análisis</p>
                  <p className="text-sm font-bold">
                    {getAllAnalyses().length > 0 
                      ? formatDate(getAllAnalyses()[0].createdAt)
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar análisis por título, concepto o clase..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="sm:w-64">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas las clases</option>
              {classes.map(classItem => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.name} - {classItem.subject}
                </option>
              ))}
            </select>
                </div>
              </div>
              
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
                </div>
        )}

        {/* Analyses List */}
        {filteredAnalyses.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {searchTerm || selectedClass !== 'all' ? 'No se encontraron análisis' : 'No hay análisis disponibles'}
                </h3>
                <p className="text-gray-500">
                  {searchTerm || selectedClass !== 'all' 
                    ? 'Intenta con otros filtros de búsqueda'
                    : 'Los análisis aparecerán aquí cuando grabes y analices clases'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAnalyses.map((analysis) => (
              <Card key={analysis.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{analysis.recording.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {classes.find(c => c.recordings?.some(r => r.analyses && r.analyses.includes(analysis)))?.name} - 
                        {classes.find(c => c.recordings?.some(r => r.analyses && r.analyses.includes(analysis)))?.subject}
                      </CardDescription>
                    </div>
                    <Badge className={getScoreBadgeColor(analysis.analysisData?.evaluation?.overall || 0)}>
                      {analysis.analysisData?.evaluation?.overall || 0}/10
                    </Badge>
                  </div>
            </CardHeader>
                <CardContent className="space-y-4">
                  {/* Summary */}
                  {analysis.analysisData?.summary && (
                      <div>
                      <h4 className="font-medium text-gray-800 mb-2">Resumen</h4>
                      <p className="text-sm text-gray-600">
                        {analysis.analysisData.summary.title}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {analysis.analysisData.summary.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {analysis.analysisData.summary.participation}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Key Concepts */}
                  {analysis.analysisData?.concepts && analysis.analysisData.concepts.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Conceptos Clave</h4>
                      <div className="flex flex-wrap gap-1">
                        {analysis.analysisData.concepts.slice(0, 3).map((concept, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {typeof concept === 'string' ? concept : concept.name || concept.description || 'Concepto'}
                        </Badge>
                        ))}
                        {analysis.analysisData.concepts.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                            +{analysis.analysisData.concepts.length - 3} más
                        </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Evaluation Scores */}
                  {analysis.analysisData?.evaluation && (
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Evaluación</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span>Claridad:</span>
                          <span className={getScoreColor(analysis.analysisData.evaluation.clarity)}>
                            {analysis.analysisData.evaluation.clarity}/10
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Participación:</span>
                          <span className={getScoreColor(analysis.analysisData.evaluation.participation)}>
                            {analysis.analysisData.evaluation.participation}/10
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ejemplos:</span>
                          <span className={getScoreColor(analysis.analysisData.evaluation.examples)}>
                            {analysis.analysisData.evaluation.examples}/10
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Conexiones:</span>
                          <span className={getScoreColor(analysis.analysisData.evaluation.connections)}>
                            {analysis.analysisData.evaluation.connections}/10
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-xs text-gray-500">
                      {formatDate(analysis.createdAt)}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedAnalysis(analysis)}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Ver Detalles
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => exportAnalysis(analysis)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Exportar
                      </Button>
                    </div>
              </div>
            </CardContent>
          </Card>
            ))}
          </div>
        )}

        {/* Analysis Detail Modal */}
        {selectedAnalysis && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto w-full">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold">{selectedAnalysis.recording.title}</h2>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedAnalysis(null)}
                  >
                    Cerrar
                  </Button>
        </div>

                {/* Full Analysis Content */}
                <div className="space-y-6">
                  {/* Summary */}
                  {selectedAnalysis.analysisData?.summary && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Resumen</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium">{selectedAnalysis.analysisData.summary.title}</p>
                        <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                          <div>
                            <span className="font-medium">Duración:</span> {selectedAnalysis.analysisData.summary.duration}
                          </div>
                          <div>
                            <span className="font-medium">Participación:</span> {selectedAnalysis.analysisData.summary.participation}
                          </div>
                      <div>
                            <span className="font-medium">Nivel:</span> {selectedAnalysis.analysisData.summary.level}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Concepts */}
                  {selectedAnalysis.analysisData?.concepts && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Conceptos Clave</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedAnalysis.analysisData.concepts.map((concept, index) => (
                          <Badge key={index} variant="outline">
                            {typeof concept === 'string' ? concept : concept.name || concept.description || 'Concepto'}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Examples */}
                  {selectedAnalysis.analysisData?.examples && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Ejemplos Destacados</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedAnalysis.analysisData.examples.map((example, index) => (
                          <li key={index} className="text-sm">
                            {typeof example === 'string' ? example : example.description || example.type || 'Ejemplo'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Questions */}
                  {selectedAnalysis.analysisData?.questions && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Preguntas de Estudiantes</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedAnalysis.analysisData.questions.map((question, index) => (
                          <li key={index} className="text-sm">
                            {typeof question === 'string' ? question : question.question || 'Pregunta'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Connections */}
                  {selectedAnalysis.analysisData?.connections && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Conexiones</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedAnalysis.analysisData.connections.map((connection, index) => (
                          <li key={index} className="text-sm">
                            {typeof connection === 'string' ? connection : connection.explanation || `${connection.from} → ${connection.to}` || 'Conexión'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Moments */}
                  {selectedAnalysis.analysisData?.moments && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Momentos Clave</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedAnalysis.analysisData.moments.map((moment, index) => (
                          <li key={index} className="text-sm">
                            {typeof moment === 'string' ? moment : moment.description || moment.type || 'Momento'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Evaluation */}
                  {selectedAnalysis.analysisData?.evaluation && (
                      <div>
                      <h3 className="text-lg font-semibold mb-2">Evaluación Detallada</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Claridad:</span>
                            <span className={getScoreColor(selectedAnalysis.analysisData.evaluation.clarity)}>
                              {selectedAnalysis.analysisData.evaluation.clarity}/10
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Participación:</span>
                            <span className={getScoreColor(selectedAnalysis.analysisData.evaluation.participation)}>
                              {selectedAnalysis.analysisData.evaluation.participation}/10
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Ejemplos:</span>
                            <span className={getScoreColor(selectedAnalysis.analysisData.evaluation.examples)}>
                              {selectedAnalysis.analysisData.evaluation.examples}/10
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Conexiones:</span>
                            <span className={getScoreColor(selectedAnalysis.analysisData.evaluation.connections)}>
                              {selectedAnalysis.analysisData.evaluation.connections}/10
                            </span>
                          </div>
                          <div className="flex justify-between font-bold">
                            <span>General:</span>
                            <span className={getScoreColor(selectedAnalysis.analysisData.evaluation.overall)}>
                              {selectedAnalysis.analysisData.evaluation.overall}/10
                            </span>
                          </div>
                      </div>
                      </div>
                    </div>
                )}
                </div>
              </div>
            </div>
        </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Analytics;