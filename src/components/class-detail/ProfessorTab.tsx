
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';
import { ClassAnalysis } from '@/types/classAnalysis';

interface ProfessorTabProps {
  classAnalysis: ClassAnalysis;
  formatTime: (seconds: number) => string;
}

export const ProfessorTab: React.FC<ProfessorTabProps> = ({
  classAnalysis,
  formatTime
}) => {
  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <GraduationCap className="w-5 h-5 mr-2 text-purple-600" />
          Evaluación del Desempeño Docente (Basado en Transcripción)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {classAnalysis.professorPerformance ? (
          <div className="space-y-6">
            <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                🎓 Análisis del Desempeño Detectado en la Grabación
              </h3>
              <p className="text-gray-700 leading-relaxed text-base">
                {classAnalysis.professorPerformance}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {formatTime(classAnalysis.voiceAnalysis.professorSpeechTime)}
                </div>
                <p className="text-green-700 font-medium text-sm">Tiempo de Instrucción</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {classAnalysis.contentAnalysis.topicsDiscussed.length}
                </div>
                <p className="text-blue-700 font-medium text-sm">Temas Cubiertos</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-2">
                  {classAnalysis.contentAnalysis.examplesUsed.length}
                </div>
                <p className="text-yellow-700 font-medium text-sm">Ejemplos Utilizados</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600 mb-2">
                  {classAnalysis.voiceAnalysis.totalSpeakers}
                </div>
                <p className="text-red-700 font-medium text-sm">Voces Detectadas</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">
              Evaluación del desempeño del profesor
            </p>
            <p className="text-gray-400 text-sm">
              Genera el análisis para evaluar el conocimiento y metodología del profesor basado en la transcripción
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
