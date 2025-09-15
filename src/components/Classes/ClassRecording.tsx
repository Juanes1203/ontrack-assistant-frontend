import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  MicOff, 
  Square, 
  Play, 
  Pause, 
  Save, 
  Loader2,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react';
import { recordingService, CreateRecordingRequest } from '@/services/recordingService';

interface ClassRecordingProps {
  classId: string;
  className: string;
  onRecordingSaved?: () => void;
}

export const ClassRecording: React.FC<ClassRecordingProps> = ({ 
  classId, 
  className, 
  onRecordingSaved 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [recordingId, setRecordingId] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Timer effect
  useEffect(() => {
    if (isRecording && !isPaused) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording, isPaused]);

  const startRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    startTimeRef.current = Date.now();
    setRecordingTime(0);
    setError(null);
    setSuccess(false);
  };

  const pauseRecording = () => {
    setIsPaused(!isPaused);
    if (!isPaused) {
      startTimeRef.current = Date.now() - (recordingTime * 1000);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resetRecording = () => {
    stopRecording();
    setRecordingTime(0);
    setTranscript('');
    setError(null);
    setSuccess(false);
    setRecordingId(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveRecording = async () => {
    if (!transcript.trim()) {
      setError('Por favor, ingresa el transcript de la clase');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const recordingData: CreateRecordingRequest = {
        classId,
        transcript: transcript.trim(),
        duration: recordingTime
      };

      const response = await recordingService.processRecording(recordingData);
      setRecordingId(response.recording.id);
      setSuccess(true);
      
      if (onRecordingSaved) {
        onRecordingSaved();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar la grabación');
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-700 mb-2">
              ¡Grabación guardada exitosamente!
            </h3>
            <p className="text-gray-600 mb-4">
              La grabación ha sido procesada y el análisis AI ha comenzado.
            </p>
            <div className="space-y-2">
              <Badge variant="outline" className="mr-2">
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(recordingTime)}
              </Badge>
              <Badge variant="outline">
                <FileText className="h-3 w-3 mr-1" />
                {transcript.length} caracteres
              </Badge>
            </div>
            <div className="mt-4 space-x-2">
              <Button onClick={resetRecording} variant="outline">
                Nueva grabación
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Grabar Clase: {className}
        </CardTitle>
        <CardDescription>
          Graba tu clase y proporciona el transcript para el análisis AI.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Recording Controls */}
        <div className="flex items-center justify-center space-x-4">
          {!isRecording ? (
            <Button 
              onClick={startRecording}
              size="lg"
              className="bg-red-500 hover:bg-red-600"
            >
              <Mic className="h-5 w-5 mr-2" />
              Iniciar Grabación
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Button 
                onClick={pauseRecording}
                variant="outline"
                size="lg"
              >
                {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
              </Button>
              <Button 
                onClick={stopRecording}
                variant="destructive"
                size="lg"
              >
                <Square className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Recording Timer */}
        {isRecording && (
          <div className="text-center">
            <div className="text-3xl font-mono font-bold text-red-500">
              {formatTime(recordingTime)}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {isPaused ? 'Pausado' : 'Grabando...'}
            </div>
          </div>
        )}

        {/* Transcript Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Transcript de la Clase</label>
          <Textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Ingresa el transcript de la clase aquí..."
            rows={6}
            className="resize-none"
          />
          <div className="text-xs text-gray-500">
            {transcript.length} caracteres
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button 
            onClick={resetRecording}
            variant="outline"
            disabled={isProcessing}
          >
            Reiniciar
          </Button>
          
          <Button 
            onClick={handleSaveRecording}
            disabled={!transcript.trim() || isProcessing || recordingTime === 0}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar Grabación
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
