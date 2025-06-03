
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck } from 'lucide-react';
import { ClassAnalysis } from '@/types/classAnalysis';

interface ParticipationTabProps {
  classAnalysis: ClassAnalysis;
  formatTime: (seconds: number) => string;
}

export const ParticipationTab: React.FC<ParticipationTabProps> = ({
  classAnalysis,
  formatTime
}) => {
  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserCheck className="w-5 h-5 mr-2 text-blue-600" />
          Análisis de Participación Estudiantil (Basado en Transcripción)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {classAnalysis.studentParticipation ? (
          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                👥 Evaluación de Participación Detectada en la Grabación
              </h3>
              <p className="text-gray-700 leading-relaxed text-base">
                {classAnalysis.studentParticipation}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {classAnalysis.voiceAnalysis.questionCount}
                </div>
                <p className="text-green-700 font-medium">Preguntas Formuladas</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {classAnalysis.voiceAnalysis.interactionCount}
                </div>
                <p className="text-purple-700 font-medium">Interacciones Detectadas</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600 mb-2">
                  {formatTime(classAnalysis.voiceAnalysis.studentSpeechTime)}
                </div>
                <p className="text-orange-700 font-medium">Tiempo Estimado de Participación</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">
              Evaluación de participación estudiantil
            </p>
            <p className="text-gray-400 text-sm">
              Genera el análisis para evaluar la participación y actitud de los estudiantes basado en la transcripción
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
