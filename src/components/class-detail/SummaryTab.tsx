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
        {classAnalysis.resumen.tema ? (
          <div className="space-y-6">
            <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                Información General
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700">Tema</h4>
                  <p className="text-gray-600">{classAnalysis.resumen.tema}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Objetivos</h4>
                  <p className="text-gray-600">{classAnalysis.resumen.objetivos}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Duración</h4>
                  <p className="text-gray-600">{classAnalysis.resumen.duracion}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Participantes</h4>
                  <p className="text-gray-600">{classAnalysis.resumen.participantes}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Duración de la clase</h4>
                <p className="text-blue-700">{formatTime(recordingTime)}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Palabras transcritas</h4>
                <p className="text-purple-700">{transcript.split(' ').filter(word => word.length > 0).length}</p>
              </div>
            </div>

            {classAnalysis.areas_mejora.fortalezas.length > 0 && (
              <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-800 mb-4">
                  Áreas de Mejora
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700">Fortalezas</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {classAnalysis.areas_mejora.fortalezas.map((fortaleza, index) => (
                        <li key={index} className="text-gray-600">{fortaleza}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Oportunidades</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {classAnalysis.areas_mejora.oportunidades.map((oportunidad, index) => (
                        <li key={index} className="text-gray-600">{oportunidad}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Recomendaciones Generales</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {classAnalysis.areas_mejora.recomendaciones_generales.map((recomendacion, index) => (
                        <li key={index} className="text-gray-600">{recomendacion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">
              Resumen de la Clase
            </p>
            <p className="text-gray-400 text-sm">
              Genera el análisis para ver el resumen detallado
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
