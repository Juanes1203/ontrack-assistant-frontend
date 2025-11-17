import React, { useState, useEffect } from 'react';
import { X, Play, Square, FileText, Clock, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { liveTranscriptionService } from '@/services/liveTranscriptionService';

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className: string;
  classId: string;
}

interface LiveRecording {
  id: string;
  title: string;
  transcript: string;
  duration: number;
  status: string;
  createdAt: string;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  isOpen,
  onClose,
  className,
  classId
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [transcriptConfidence, setTranscriptConfidence] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [activeRecordings, setActiveRecordings] = useState<LiveRecording[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialize form data when sidebar opens
  useEffect(() => {
    if (isOpen) {
      setTitle(`${className} - ${new Date().toLocaleString()}`);
      setDescription(`Grabación de clase de ${className}`);
    }
  }, [isOpen, className]);

  // Timer for recording
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Load active recordings when sidebar opens
  useEffect(() => {
    if (isOpen && classId) {
      loadActiveRecordings();
    }
  }, [isOpen, classId]);

  const loadActiveRecordings = async () => {
    try {
      const response = await fetch(`/api/recordings/class/${classId}/live-status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setActiveRecordings(data.data.activeRecordings);
      }
    } catch (error) {
      console.error('Error loading active recordings:', error);
    }
  };

  const startRecording = async () => {
    try {
      setError(null);
      
      const response = await fetch('/api/recordings/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          classId,
          title,
          description,
          isLive: true
        })
      });

      const data = await response.json();
      if (data.success) {
        setRecordingId(data.data.recording.id);
        setIsRecording(true);
        setRecordingTime(0);
        setLiveTranscript('');
        
        // Start live transcription
        try {
          liveTranscriptionService.startListening(
            (result) => {
              setLiveTranscript(result.transcript);
              setTranscriptConfidence(result.confidence);
              updateTranscript(data.data.recording.id, result.transcript, result.confidence);
            },
            (error) => {
              console.error('Transcription error:', error);
              // Mostrar error al usuario si es crítico
              if (error && typeof error === 'string' && !error.includes('abortado') && !error.includes('network')) {
                setError(`Error en transcripción: ${error}`);
              }
            }
          );
        } catch (micError: any) {
          // Error específico del micrófono
          setError(micError.message || 'Error al acceder al micrófono');
          setIsRecording(false);
          setRecordingId(null);
        }
      } else {
        setError(data.message || 'Error al iniciar la grabación');
      }
    } catch (error: any) {
      console.error('Error starting recording:', error);
      setError(error.message || 'Error al iniciar la grabación. Por favor intenta de nuevo.');
    }
  };

  const stopRecording = async () => {
    try {
      if (recordingId) {
        // Stop live transcription
        liveTranscriptionService.stopListening();

        // Finish recording
        const response = await fetch(`/api/recordings/${recordingId}/finish`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            finalTranscript: liveTranscript,
            duration: recordingTime
          })
        });

        const data = await response.json();
        if (data.success) {
          setIsRecording(false);
          setRecordingId(null);
          setRecordingTime(0);
          setLiveTranscript('');
          setTranscriptConfidence(0);
          
          // Reload active recordings
          loadActiveRecordings();
        }
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const updateTranscript = async (id: string, transcript: string, confidence: number) => {
    try {
      await fetch(`/api/recordings/${id}/transcript`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          transcript,
          confidence,
          isLive: true
        })
      });
    } catch (error) {
      console.error('Error updating transcript:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Si está grabando, siempre mostrar el panel (no se puede cerrar)
  const shouldShow = isOpen || isRecording;

  if (!shouldShow) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Grabación de Clase</h2>
          {isRecording && (
            <span className="ml-2 px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded-full animate-pulse">
              EN VIVO
            </span>
          )}
        </div>
        {!isRecording && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-100"
            title="Cerrar panel"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {isRecording && (
          <div className="h-8 w-8 flex items-center justify-center">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Recording Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título de la Grabación</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Clase de Matemáticas - 18/09/2024"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej: Clase sobre determinantes"
                className="mt-1"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className="mt-2 text-red-600 hover:text-red-800"
              >
                Cerrar
              </Button>
            </div>
          )}

          {/* Recording Controls */}
          <div className="space-y-4">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={!title.trim()}
              >
                <Play className="h-4 w-4 mr-2" />
                Iniciar Grabación
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <div>
                        <h3 className="font-semibold text-red-800">Grabando...</h3>
                        <p className="text-sm text-red-600 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(recordingTime)}
                        </p>
                      </div>
                    </div>
                    <Button onClick={stopRecording} variant="destructive" size="sm">
                      <Square className="h-4 w-4 mr-1" />
                      Detener
                    </Button>
                  </div>
                </div>

                {/* Recording Status Indicator */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    {/* Animated Microphone Icon */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-blue-200 rounded-full animate-ping opacity-75"></div>
                      </div>
                      <div className="relative flex items-center justify-center w-20 h-20 bg-blue-500 rounded-full">
                        <Mic className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    
                    {/* Status Text */}
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-800 mb-1 text-lg">Grabación en Progreso</h4>
                      <p className="text-sm text-gray-600">
                        El audio se está capturando correctamente
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        La transcripción se procesará automáticamente al finalizar
                      </p>
                    </div>
                    
                    {/* Visual Waveform Indicator */}
                    <div className="flex items-end justify-center space-x-1.5 h-10 w-full">
                      <div className="w-1.5 bg-blue-400 rounded-full animate-pulse" style={{ height: '50%', animationDelay: '0s' }}></div>
                      <div className="w-1.5 bg-blue-500 rounded-full animate-pulse" style={{ height: '70%', animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 bg-blue-600 rounded-full animate-pulse" style={{ height: '100%', animationDelay: '0.2s' }}></div>
                      <div className="w-1.5 bg-blue-500 rounded-full animate-pulse" style={{ height: '80%', animationDelay: '0.3s' }}></div>
                      <div className="w-1.5 bg-blue-600 rounded-full animate-pulse" style={{ height: '90%', animationDelay: '0.4s' }}></div>
                      <div className="w-1.5 bg-blue-500 rounded-full animate-pulse" style={{ height: '60%', animationDelay: '0.5s' }}></div>
                      <div className="w-1.5 bg-blue-400 rounded-full animate-pulse" style={{ height: '40%', animationDelay: '0.6s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Active Recordings */}
          {activeRecordings.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Grabaciones Activas</h3>
              <div className="space-y-2">
                {activeRecordings.map((recording) => (
                  <div key={recording.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-blue-900 text-sm">{recording.title}</h4>
                        <p className="text-xs text-blue-700">
                          {formatTime(recording.duration)} • {recording.status}
                        </p>
                      </div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RightSidebar;
