import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  BookOpen, 
  Lightbulb, 
  HelpCircle, 
  Link, 
  Clock, 
  Star,
  TrendingUp,
  Target,
  Users,
  BookMarked,
  CheckCircle
} from 'lucide-react';

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

interface ClassAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisData: string | null;
  className?: string;
  onRefresh?: () => void;
}

const ClassAnalysisModal: React.FC<ClassAnalysisModalProps> = ({
  isOpen,
  onClose,
  analysisData,
  className,
  onRefresh
}) => {
  if (!analysisData) return null;

  // Manejar estados especiales
  if (analysisData === 'ANALYSIS_PENDING') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-blue-600" />
              Análisis en Progreso
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Procesando Análisis</h3>
            <p className="text-gray-600 mb-4">
              El análisis de IA está en progreso. Esto puede tomar 2-5 minutos.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Por favor, cierra este modal y vuelve a intentar en unos minutos.
            </p>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Actualizar Estado
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (analysisData === 'ANALYSIS_FAILED') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-red-600" />
              Error en el Análisis
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Análisis Fallido</h3>
            <p className="text-gray-600">
              Hubo un error al procesar el análisis de IA. Por favor, intenta grabar la clase nuevamente.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  let parsedData: AnalysisData;
  try {
    parsedData = JSON.parse(analysisData);
  } catch (error) {
    console.error('Error parsing analysis data:', error);
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Error en el Análisis</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-red-600">Error al cargar los datos del análisis.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            Análisis de Clase - {parsedData.summary.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumen General */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Resumen General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Duración: {parsedData.summary.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Participantes: {parsedData.summary.participants}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">Puntuación: {parsedData.evaluation.overallScore}/10</span>
                </div>
              </div>
              <p className="mt-4 text-gray-700">{parsedData.summary.content}</p>
            </CardContent>
          </Card>

          {/* Análisis ECDF */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Análisis ECDF
              </CardTitle>
              <CardDescription>
                Evaluación de Carácter Diagnóstico Formativa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Estructura */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Estructura</h4>
                    <Badge className={getScoreBadgeColor(parsedData.ecdfAnalysis.structure.score)}>
                      {parsedData.ecdfAnalysis.structure.score}/10
                    </Badge>
                  </div>
                  <Progress value={parsedData.ecdfAnalysis.structure.score * 10} className="h-2" />
                  <div className="space-y-2 text-sm">
                    <p><strong>Organización:</strong> {parsedData.ecdfAnalysis.structure.organization}</p>
                    <p><strong>Secuencia:</strong> {parsedData.ecdfAnalysis.structure.logicalSequence}</p>
                    <p><strong>Objetivos:</strong> {parsedData.ecdfAnalysis.structure.clearObjectives}</p>
                  </div>
                </div>

                {/* Contenido */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Contenido</h4>
                    <Badge className={getScoreBadgeColor(parsedData.ecdfAnalysis.content.score)}>
                      {parsedData.ecdfAnalysis.content.score}/10
                    </Badge>
                  </div>
                  <Progress value={parsedData.ecdfAnalysis.content.score * 10} className="h-2" />
                  <div className="space-y-2 text-sm">
                    <p><strong>Precisión:</strong> {parsedData.ecdfAnalysis.content.accuracy}</p>
                    <p><strong>Profundidad:</strong> {parsedData.ecdfAnalysis.content.depth}</p>
                    <p><strong>Relevancia:</strong> {parsedData.ecdfAnalysis.content.relevance}</p>
                  </div>
                </div>

                {/* Dinámica */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Dinámica</h4>
                    <Badge className={getScoreBadgeColor(parsedData.ecdfAnalysis.dynamics.score)}>
                      {parsedData.ecdfAnalysis.dynamics.score}/10
                    </Badge>
                  </div>
                  <Progress value={parsedData.ecdfAnalysis.dynamics.score * 10} className="h-2" />
                  <div className="space-y-2 text-sm">
                    <p><strong>Interacción:</strong> {parsedData.ecdfAnalysis.dynamics.interaction}</p>
                    <p><strong>Participación:</strong> {parsedData.ecdfAnalysis.dynamics.participation}</p>
                    <p><strong>Metodología:</strong> {parsedData.ecdfAnalysis.dynamics.methodology}</p>
                  </div>
                </div>

                {/* Formación */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Formación</h4>
                    <Badge className={getScoreBadgeColor(parsedData.ecdfAnalysis.formation.score)}>
                      {parsedData.ecdfAnalysis.formation.score}/10
                    </Badge>
                  </div>
                  <Progress value={parsedData.ecdfAnalysis.formation.score * 10} className="h-2" />
                  <div className="space-y-2 text-sm">
                    <p><strong>Desarrollo:</strong> {parsedData.ecdfAnalysis.formation.competenceDevelopment}</p>
                    <p><strong>Evaluación:</strong> {parsedData.ecdfAnalysis.formation.evaluation}</p>
                    <p><strong>Retroalimentación:</strong> {parsedData.ecdfAnalysis.formation.feedback}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conceptos Clave */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookMarked className="h-5 w-5" />
                Conceptos Clave
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parsedData.concepts.map((concept, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h5 className="font-semibold text-blue-600">{concept.name}</h5>
                    <p className="text-sm text-gray-600 mt-1">{concept.description}</p>
                    <p className="text-xs text-gray-500 mt-2">{concept.importance}</p>
                    {concept.examples.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-700">Ejemplos:</p>
                        <ul className="text-xs text-gray-600 list-disc list-inside">
                          {concept.examples.map((example, idx) => (
                            <li key={idx}>{example}</li>
                          ))}
                        </ul>
                      </div>
                    )}
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
                Preguntas Identificadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {parsedData.questions.map((question, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                    <p className="font-medium">{question.question}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{question.type}</Badge>
                      <Badge variant="outline" className="text-xs">{question.quality}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{question.purpose}</p>
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
                {parsedData.connections.map((connection, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-blue-600">{connection.from}</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-medium text-green-600">{connection.to}</span>
                      <Badge variant="outline" className="text-xs">{connection.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{connection.explanation}</p>
                    <p className="text-xs text-gray-500 mt-1">Fuerza: {connection.strength}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Momentos Clave */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Momentos Clave
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {parsedData.moments.map((moment, index) => (
                  <div key={index} className="flex gap-4 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      <Badge variant="outline">{moment.timestamp}</Badge>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{moment.description}</p>
                      <p className="text-sm text-gray-600 mt-1">{moment.significance}</p>
                      <Badge variant="secondary" className="text-xs mt-1">{moment.type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Evaluación y Recomendaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Evaluación y Recomendaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Fortalezas
                  </h5>
                  <ul className="space-y-1">
                    {parsedData.evaluation.strengths.map((strength, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-orange-600 mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Áreas de Mejora
                  </h5>
                  <ul className="space-y-1">
                    {parsedData.evaluation.areasForImprovement.map((area, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4">
                <h5 className="font-semibold text-blue-600 mb-2">Recomendaciones</h5>
                <ul className="space-y-1">
                  {parsedData.evaluation.recommendations.map((recommendation, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClassAnalysisModal;