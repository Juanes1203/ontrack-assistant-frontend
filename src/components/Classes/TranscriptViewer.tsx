import React, { useState, useEffect } from 'react';
import { FileText, Clock, BookOpen, Copy, Check, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { recordingsService } from '@/services/recordingsService';

interface TranscriptViewerProps {
  recordingId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface FormattedTranscript {
  raw: string;
  formatted: string;
  wordCount: number;
  estimatedReadingTime: number;
}

interface RecordingInfo {
  id: string;
  title: string;
  duration: number;
  status: string;
  createdAt: string;
  className: string;
}

const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
  recordingId,
  isOpen,
  onClose
}) => {
  const [transcript, setTranscript] = useState<FormattedTranscript | null>(null);
  const [recording, setRecording] = useState<RecordingInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && recordingId) {
      loadTranscript();
    }
  }, [isOpen, recordingId]);

  const loadTranscript = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await recordingsService.getRecordingTranscript(recordingId);
      
      if (response.data.success) {
        setTranscript(response.data.data.transcript);
        setRecording(response.data.data.recording);
      } else {
        setError('Error al cargar el transcript');
      }
    } catch (error) {
      console.error('Error loading transcript:', error);
      setError('Error al cargar el transcript');
    } finally {
      setLoading(false);
    }
  };

  const copyTranscript = async () => {
    if (transcript) {
      try {
        await navigator.clipboard.writeText(transcript.formatted);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Error copying transcript:', error);
      }
    }
  };

  const downloadTranscript = () => {
    if (transcript && recording) {
      const element = document.createElement('a');
      const file = new Blob([transcript.formatted], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${recording.title || 'transcript'}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Transcript de la Grabación</h2>
              {recording && (
                <p className="text-sm text-gray-600">{recording.title}</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            ×
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando transcript...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={loadTranscript} variant="outline">
                  Reintentar
                </Button>
              </div>
            </div>
          ) : transcript ? (
            <div className="h-full flex flex-col">
              {/* Recording Info */}
              {recording && (
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Duración: {formatDuration(recording.duration)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {transcript.wordCount} palabras
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={recording.status === 'COMPLETED' ? 'default' : 'secondary'}>
                        {recording.status === 'COMPLETED' ? 'Completada' : recording.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Creada: {formatDate(recording.createdAt)} • Clase: {recording.className}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Tiempo de lectura estimado: {transcript.estimatedReadingTime} minuto{transcript.estimatedReadingTime !== 1 ? 's' : ''}
                  </div>
                </div>
              )}

              {/* Transcript Content */}
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-6">
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                        {transcript.formatted}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={copyTranscript}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>Copiar</span>
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={downloadTranscript}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Descargar</span>
                    </Button>
                  </div>
                  <Button onClick={onClose}>
                    Cerrar
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay transcript disponible para esta grabación</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranscriptViewer;
