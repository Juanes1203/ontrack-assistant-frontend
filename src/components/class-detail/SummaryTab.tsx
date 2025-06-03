
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { ClassAnalysis } from '@/types/classAnalysis';

interface SummaryTabProps {
  classAnalysis: ClassAnalysis;
  recordingTime: number;
  transcript: string;
  formatTime: (seconds: number) => string;
}

export const SummaryTab: React.FC<SummaryTabProps> = ({
  classAnalysis,
  recordingTime,
  transcript,
  formatTime
}) => {
  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-green-600" />
          Resumen de la Clase
        </CardTitle>
      </CardHeader>
      <CardContent>
        {classAnalysis.summary ? (
          <div className="space-y-4">
            <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-3">
                📝 Resumen Ejecutivo (Basado en Transcripción)
              </h3>
              <p className="text-gray-700 leading-relaxed text-base">
                {classAnalysis.summary}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Duración de la clase</h4>
                <p className="text-blue-700">{formatTime(recordingTime)}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Palabras transcritas</h4>
                <p className="text-purple-700">{transcript.split(' ').filter(word => word.length > 0).length}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">Preguntas detectadas</h4>
                <p className="text-orange-700">{classAnalysis.voiceAnalysis.questionCount}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Temas discutidos</h4>
                <p className="text-green-700">{classAnalysis.contentAnalysis.topicsDiscussed.join(', ') || 'No detectados'}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">
              Genera un resumen detallado de tu clase
            </p>
            <p className="text-gray-400 text-sm">
              Primero necesitas tener una transcripción y generar el análisis
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
