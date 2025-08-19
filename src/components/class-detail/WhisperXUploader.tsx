import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Mic, 
  Users, 
  Clock, 
  FileAudio,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  User,
  MessageSquare,
  Timer
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { WhisperXService } from '@/services/whisperXService';

interface WhisperXUploaderProps {
  onTranscriptionComplete: (transcript: string, speakers: any[], participation: any) => void;
  className?: string;
}

interface TranscriptionProgress {
  stage: 'uploading' | 'transcribing' | 'processing' | 'complete' | 'error';
  progress: number;
  message: string;
}

interface TranscriptionResult {
  transcript: string;
  speakers: any[];
  participation: {
    totalTime: number;
    speakerStats: Record<string, { time: number; segments: number; words: number }>;
    interactionPatterns: Array<{ from: string; to: string; count: number }>;
  };
  segments: any[];
}

export const WhisperXUploader: React.FC<WhisperXUploaderProps> = ({
  onTranscriptionComplete,
  className
}) => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<TranscriptionProgress>({
    stage: 'uploading',
    progress: 0,
    message: 'Listo para subir archivo'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);

  const whisperXService = new WhisperXService();

  // Debug: Log cuando cambia el estado de transcriptionResult
  useEffect(() => {
    console.log('TranscriptionResult state changed:', transcriptionResult);
  }, [transcriptionResult]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = [
        'audio/wav',
        'audio/mp3',
        'audio/mpeg',
        'audio/ogg',
        'audio/webm',
        'audio/m4a',
        'audio/flac'
      ];

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Tipo de archivo no válido",
          description: "Por favor, selecciona un archivo de audio válido (WAV, MP3, OGG, WEBM, M4A, FLAC)",
          variant: "destructive"
        });
        return;
      }

      // Validar tamaño (100MB máximo)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "Archivo demasiado grande",
          description: "El archivo debe ser menor a 100MB",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
      setProgress({
        stage: 'uploading',
        progress: 0,
        message: `Archivo seleccionado: ${file.name}`
      });
    }
  }, [toast]);

  const handleTranscribe = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress({
      stage: 'transcribing',
      progress: 0,
      message: 'Iniciando transcripción con WhisperX...'
    });

    try {
      // Simular progreso durante la transcripción
      const progressInterval = setInterval(() => {
        setProgress(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90)
        }));
      }, 1000);

      const result = await whisperXService.transcribeAudio(selectedFile, {
        model: 'base',
        language: 'es',
        diarize: true,
        min_speakers: 1,
        max_speakers: 5
      });

      clearInterval(progressInterval);

      setProgress({
        stage: 'complete',
        progress: 100,
        message: 'Transcripción completada exitosamente'
      });

      // Formatear transcripción
      const formattedTranscript = whisperXService.formatTranscript(result.segments);
      
      // Analizar participación
      const participationAnalysis = whisperXService.getParticipationAnalysis(result.segments);

      // Crear objeto de resultado
      const resultData: TranscriptionResult = {
        transcript: formattedTranscript,
        speakers: result.speakers,
        participation: participationAnalysis,
        segments: result.segments
      };

      console.log('WhisperX Result Data:', resultData);
      console.log('Setting transcription result...');

      // Guardar resultado en el estado
      setTranscriptionResult(resultData);

      // Llamar callback con resultados
      onTranscriptionComplete(formattedTranscript, result.speakers, participationAnalysis);

      toast({
        title: "Transcripción completada",
        description: `Se identificaron ${result.speakers.length} hablantes y se procesaron ${result.segments.length} segmentos`,
        variant: "default"
      });

    } catch (error) {
      setProgress({
        stage: 'error',
        progress: 0,
        message: error instanceof Error ? error.message : 'Error en la transcripción'
      });

      toast({
        title: "Error en la transcripción",
        description: error instanceof Error ? error.message : 'Error desconocido',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, whisperXService, onTranscriptionComplete, toast]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStageIcon = () => {
    switch (progress.stage) {
      case 'uploading':
        return <Upload className="w-5 h-5" />;
      case 'transcribing':
        return <Loader2 className="w-5 h-5 animate-spin" />;
      case 'processing':
        return <Mic className="w-5 h-5" />;
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <FileAudio className="w-5 h-5" />;
    }
  };

  const getStageColor = () => {
    switch (progress.stage) {
      case 'complete':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Transcripción con WhisperX
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Información sobre WhisperX */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">¿Qué es WhisperX?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Transcripción precisa:</strong> Timestamps a nivel de palabra</li>
              <li>• <strong>Diarización automática:</strong> Identifica quién habla en cada momento</li>
              <li>• <strong>Múltiples idiomas:</strong> Soporte para español e inglés</li>
              <li>• <strong>Análisis avanzado:</strong> Patrones de participación e interacción</li>
            </ul>
          </div>

          {/* Selector de archivo */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Seleccionar archivo de audio
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                disabled={isProcessing}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          {/* Información del archivo */}
          {selectedFile && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <FileAudio className="w-4 h-4" />
                <span className="font-medium">{selectedFile.name}</span>
                <Badge variant="secondary">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </Badge>
              </div>
            </div>
          )}

          {/* Progreso */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {getStageIcon()}
                <span className={`text-sm font-medium ${getStageColor()}`}>
                  {progress.message}
                </span>
              </div>
              <Progress value={progress.progress} className="w-full" />
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-2">
            <Button
              onClick={handleTranscribe}
              disabled={!selectedFile || isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Transcribiendo...
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Transcribir con WhisperX
                </>
              )}
            </Button>
          </div>

          {/* Información adicional */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Formatos soportados: WAV, MP3, OGG, WEBM, M4A, FLAC</p>
            <p>• Tamaño máximo: 100MB</p>
            <p>• Tiempo estimado: 1-5 minutos según duración del audio</p>
          </div>
        </CardContent>
      </Card>

      {/* Resultados de la transcripción */}
      {transcriptionResult && (
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
                    {transcriptionResult.transcript}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="speakers" className="mt-4">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Participantes Identificados</h4>
                  <div className="grid gap-4">
                    {transcriptionResult.speakers.map((speaker, index) => (
                      <div key={speaker.id || index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
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
                        {transcriptionResult.participation?.speakerStats?.[speaker.id] && (
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                              <div className="font-semibold text-gray-900">
                                {formatTime(transcriptionResult.participation.speakerStats[speaker.id].time)}
                              </div>
                              <div className="text-gray-600">Tiempo total</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-gray-900">
                                {transcriptionResult.participation.speakerStats[speaker.id].segments}
                              </div>
                              <div className="text-gray-600">Intervenciones</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-gray-900">
                                {transcriptionResult.participation.speakerStats[speaker.id].words}
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
                  {transcriptionResult.participation && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Timer className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-900">Duración Total</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-700">
                          {formatTime(transcriptionResult.participation.totalTime || 0)}
                        </div>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-green-900">Total Hablantes</span>
                        </div>
                        <div className="text-2xl font-bold text-green-700">
                          {transcriptionResult.speakers.length}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Gráfico de participación por hablante */}
                  {transcriptionResult.participation?.speakerStats && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-3 text-gray-900">Distribución de Tiempo por Hablante</h5>
                      <div className="space-y-3">
                        {Object.entries(transcriptionResult.participation.speakerStats).map(([speakerId, stats]) => {
                          const percentage = (stats.time / (transcriptionResult.participation.totalTime || 1)) * 100;
                          const speaker = transcriptionResult.speakers.find(s => s.id === speakerId);
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
                      {transcriptionResult.segments.map((segment, index) => (
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

                  {/* Patrones de interacción */}
                  {transcriptionResult.participation?.interactionPatterns && 
                   transcriptionResult.participation.interactionPatterns.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-3 text-gray-900">Patrones de Interacción</h5>
                      <div className="space-y-2">
                        {transcriptionResult.participation.interactionPatterns
                          .sort((a, b) => b.count - a.count)
                          .slice(0, 5)
                          .map((pattern, index) => (
                            <div key={index} className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-sm text-gray-700">
                                <span className="font-medium">{pattern.from}</span>
                                <span className="mx-2">→</span>
                                <span className="font-medium">{pattern.to}</span>
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {pattern.count} veces
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 