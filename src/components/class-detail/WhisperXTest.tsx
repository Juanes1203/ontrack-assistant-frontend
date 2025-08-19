import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Mic, FileText, Users, MessageSquare, CheckCircle } from 'lucide-react';

interface TestTranscriptionResult {
  transcript: string;
  speakers: Array<{
    id: string;
    type: 'professor' | 'student';
    confidence: number;
  }>;
  participation: {
    totalTime: number;
    speakerStats: Record<string, { time: number; segments: number; words: number }>;
    interactionPatterns: Array<{ from: string; to: string; count: number }>;
  };
  segments: Array<{
    start: number;
    end: number;
    text: string;
    speaker?: string;
  }>;
}

export const WhisperXTest: React.FC = () => {
  const [showResults, setShowResults] = useState(false);
  const [testResult, setTestResult] = useState<TestTranscriptionResult>({
    transcript: "Esta es una transcripción de prueba. [SPEAKER_00] [00:00:05]: Hola, bienvenidos a la clase de hoy. [SPEAKER_01] [00:00:08]: Gracias profesor, estamos listos para aprender.",
    speakers: [
      { id: 'SPEAKER_00', type: 'professor', confidence: 0.95 },
      { id: 'SPEAKER_01', type: 'student', confidence: 0.88 }
    ],
    participation: {
      totalTime: 120.5,
      speakerStats: {
        'SPEAKER_00': { time: 85.2, segments: 12, words: 156 },
        'SPEAKER_01': { time: 35.3, segments: 8, words: 89 }
      },
      interactionPatterns: [
        { from: 'SPEAKER_00', to: 'SPEAKER_01', count: 5 },
        { from: 'SPEAKER_01', to: 'SPEAKER_00', count: 3 }
      ]
    },
    segments: [
      { start: 5.0, end: 8.0, text: "Hola, bienvenidos a la clase de hoy.", speaker: 'SPEAKER_00' },
      { start: 8.0, end: 12.0, text: "Gracias profesor, estamos listos para aprender.", speaker: 'SPEAKER_01' }
    ]
  });

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Test WhisperX Results Display
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setShowResults(!showResults)}>
            {showResults ? 'Ocultar' : 'Mostrar'} Resultados de Prueba
          </Button>
        </CardContent>
      </Card>

      {/* Resultados de la transcripción */}
      {showResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Resultados de la Transcripción
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="transcript" className="w-full">
                          <TabsList className="grid w-full grid-cols-3 bg-gray-200 p-1 rounded-lg">
              <TabsTrigger value="transcript" className="flex items-center gap-2 bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 border border-gray-300">
                <FileText className="w-4 h-4" />
                Transcripción
              </TabsTrigger>
              <TabsTrigger value="speakers" className="flex items-center gap-2 bg-white text-gray-700 hover:bg-green-50 hover:text-green-700 data-[state=active]:bg-green-100 data-[state=active]:text-green-700 border border-gray-300">
                <Users className="w-4 h-4" />
                Participantes
              </TabsTrigger>
              <TabsTrigger value="participation" className="flex items-center gap-2 bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-700 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 border border-gray-300">
                <MessageSquare className="w-4 h-4" />
                Análisis
              </TabsTrigger>
            </TabsList>

              <TabsContent value="transcript" className="mt-4">
                <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <h4 className="font-semibold mb-3 text-gray-900">Transcripción Completa</h4>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">
                    {testResult.transcript}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="speakers" className="mt-4">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Participantes Identificados</h4>
                  <div className="grid gap-4">
                    {testResult.speakers.map((speaker, index) => (
                      <div key={speaker.id || index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">{speaker.id}</h5>
                            <p className="text-sm text-gray-600">
                              {speaker.type === 'professor' ? 'Profesor' : 'Estudiante'}
                            </p>
                          </div>
                          {speaker.confidence && (
                            <Badge variant="secondary">
                              {Math.round(speaker.confidence * 100)}% confianza
                            </Badge>
                          )}
                        </div>
                        
                        {/* Estadísticas del hablante */}
                        {testResult.participation?.speakerStats?.[speaker.id] && (
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                              <div className="font-semibold text-gray-900">
                                {formatTime(testResult.participation.speakerStats[speaker.id].time)}
                              </div>
                              <div className="text-gray-600">Tiempo total</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-gray-900">
                                {testResult.participation.speakerStats[speaker.id].segments}
                              </div>
                              <div className="text-gray-600">Intervenciones</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-gray-900">
                                {testResult.participation.speakerStats[speaker.id].words}
                              </div>
                              <div className="text-gray-600">Palabras</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="participation" className="mt-4">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Análisis de Participación</h4>
                  
                  {/* Estadísticas generales */}
                  {testResult.participation && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-900">Duración Total</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-700">
                          {formatTime(testResult.participation.totalTime || 0)}
                        </div>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-green-900">Total Hablantes</span>
                        </div>
                        <div className="text-2xl font-bold text-green-700">
                          {testResult.speakers.length}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Gráfico de participación por hablante */}
                  {testResult.participation?.speakerStats && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-3 text-gray-900">Distribución de Tiempo por Hablante</h5>
                      <div className="space-y-3">
                        {Object.entries(testResult.participation.speakerStats).map(([speakerId, stats]) => {
                          const percentage = (stats.time / (testResult.participation.totalTime || 1)) * 100;
                          const speaker = testResult.speakers.find(s => s.id === speakerId);
                          return (
                            <div key={speakerId} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="font-medium text-gray-700">
                                  {speakerId} {speaker?.type === 'professor' && '(Profesor)'}
                                </span>
                                <span className="text-gray-600">
                                  {formatTime(stats.time)} ({percentage.toFixed(1)}%)
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Segmentos detallados */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium mb-3 text-gray-900">Segmentos de Conversación</h5>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {testResult.segments.map((segment, index) => (
                        <div key={index} className="bg-white p-3 rounded border hover:shadow-sm transition-shadow">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {formatTime(segment.start)} - {formatTime(segment.end)}
                            </Badge>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${
                                segment.speaker?.includes('SPEAKER_00') ? 'bg-blue-100 text-blue-800' : 
                                segment.speaker?.includes('SPEAKER_01') ? 'bg-green-100 text-green-800' :
                                segment.speaker?.includes('SPEAKER_02') ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {segment.speaker || 'Desconocido'}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {Math.round((segment.end - segment.start) * 10) / 10}s
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{segment.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 