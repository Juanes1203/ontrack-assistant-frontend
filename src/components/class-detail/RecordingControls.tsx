
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  RotateCcw, 
  Clock,
  MicOff
} from 'lucide-react';

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  isListening: boolean;
  formatTime: (seconds: number) => string;
  startRecording: () => void;
  stopRecording: () => void;
  pauseRecording: () => void;
  resetRecording: () => void;
}

export const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  isPaused,
  recordingTime,
  isListening,
  formatTime,
  startRecording,
  stopRecording,
  pauseRecording,
  resetRecording
}) => {
  return (
    <Card className="mb-8 border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Mic className="w-6 h-6 mr-2 text-red-500" />
          Control de Grabación y Transcripción
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {!isRecording ? (
              <Button 
                onClick={startRecording}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Mic className="w-5 h-5 mr-2" />
                Iniciar Grabación
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button 
                  onClick={pauseRecording}
                  variant="outline"
                  className="border-2"
                >
                  {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                  {isPaused ? 'Reanudar' : 'Pausar'}
                </Button>
                <Button 
                  onClick={stopRecording}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Detener
                </Button>
              </div>
            )}
            
            <Button 
              onClick={resetRecording}
              variant="outline"
              className="border-2"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reiniciar
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center text-lg font-mono">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              <span className={`${isRecording && !isPaused ? 'text-red-600 pulse-slow' : 'text-gray-700'}`}>
                {formatTime(recordingTime)}
              </span>
            </div>
            
            {isRecording && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2 pulse-slow"></div>
                  <span className="text-red-600 font-medium">
                    {isPaused ? 'Pausado' : 'Grabando'}
                  </span>
                </div>
                
                <div className="flex items-center">
                  {isListening ? (
                    <Mic className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <MicOff className="w-4 h-4 text-gray-400 mr-1" />
                  )}
                  <span className={`text-sm ${isListening ? 'text-green-600' : 'text-gray-500'}`}>
                    {isListening ? 'Escuchando' : 'Sin audio'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
