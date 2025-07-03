import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import { ClassAnalysis } from '@/types/classAnalysis';
import { useVoiceDetection } from '@/hooks/useVoiceDetection';

interface InsightsTabProps {
  classAnalysis: ClassAnalysis | null;
  recordingTime: number;
  transcript: string;
  audioBlob: Blob | null;
}

export const InsightsTab: React.FC<InsightsTabProps> = ({
  classAnalysis,
  recordingTime,
  transcript,
  audioBlob
}) => {
  const { results: voiceResults, isAnalyzing: isAnalyzingVoices } = useVoiceDetection(audioBlob);

  if (!classAnalysis) {
    return (
      <Card className="border-2 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            No hay datos de análisis disponibles. Genera el análisis para ver los insights.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
          Insights y Métricas Avanzadas de la Grabación
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Métricas de participación */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {recordingTime > 0 && classAnalysis.voiceAnalysis ? `${Math.round((classAnalysis.voiceAnalysis.studentSpeechTime / recordingTime) * 100)}%` : '--'}
              </div>
              <p className="text-blue-700 font-medium text-sm">Tiempo de Participación Estudiantil</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {recordingTime > 0 && classAnalysis.voiceAnalysis ? `${Math.round((classAnalysis.voiceAnalysis.professorSpeechTime / recordingTime) * 100)}%` : '--'}
              </div>
              <p className="text-green-700 font-medium text-sm">Tiempo de Instrucción Docente</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {recordingTime > 0 && classAnalysis.voiceAnalysis ? Math.round(classAnalysis.voiceAnalysis.questionCount / (recordingTime / 60)) : '--'}
              </div>
              <p className="text-purple-700 font-medium text-sm">Preguntas por Minuto</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {recordingTime > 0 ? Math.round(transcript.split(' ').length / (recordingTime / 60)) : '--'}
              </div>
              <p className="text-orange-700 font-medium text-sm">Palabras por Minuto</p>
            </div>
          </div>

          {/* Análisis de voces */}
          {voiceResults && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Análisis de Voces Detectadas</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Total de voces detectadas:</span>
                  <Badge variant="secondary">{voiceResults.totalSpeakers}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Profesor</h4>
                    <div className="space-y-2">
                      {voiceResults.speakers
                        .filter(speaker => speaker.type === 'professor')
                        .map((speaker, index) => (
                          <div key={speaker.id} className="flex justify-between items-center">
                            <span className="text-gray-600">Voz {index + 1}</span>
                            <Badge variant="outline">
                              {Math.round(speaker.confidence * 100)}% confianza
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Estudiantes</h4>
                    <div className="space-y-2">
                      {voiceResults.speakers
                        .filter(speaker => speaker.type === 'student')
                        .map((speaker, index) => (
                          <div key={speaker.id} className="flex justify-between items-center">
                            <span className="text-gray-600">Voz {index + 1}</span>
                            <Badge variant="outline">
                              {Math.round(speaker.confidence * 100)}% confianza
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contenido analizado */}
          {classAnalysis.contentAnalysis && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Temas Discutidos</h3>
              <div className="space-y-2">
                  {classAnalysis.contentAnalysis.topicsDiscussed && classAnalysis.contentAnalysis.topicsDiscussed.length > 0 ? (
                  classAnalysis.contentAnalysis.topicsDiscussed.map((topic, index) => (
                    <Badge key={index} variant="secondary" className="mr-2 mb-2">
                      {topic}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No se detectaron temas específicos</p>
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ejemplos Utilizados</h3>
              <div className="space-y-2">
                  {classAnalysis.contentAnalysis.examplesUsed && classAnalysis.contentAnalysis.examplesUsed.length > 0 ? (
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
          )}

          {/* Palabras clave más frecuentes */}
          {classAnalysis.contentAnalysis && classAnalysis.contentAnalysis.keywordFrequency && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Conceptos Más Mencionados</h3>
            <div className="space-y-2">
              {Object.entries(classAnalysis.contentAnalysis.keywordFrequency)
                .sort(([,a], [,b]) => (b as number) - (a as number))
                .slice(0, 10)
                .map(([word, count], index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-700">{word}</span>
                    <Badge variant="secondary">{count as number}</Badge>
                  </div>
                ))
              }
            </div>
          </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
