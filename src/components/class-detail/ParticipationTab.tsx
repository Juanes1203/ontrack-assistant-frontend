import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
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
          <Users className="w-5 h-5 mr-2 text-pink-600" />
          Participación Estudiantil
        </CardTitle>
      </CardHeader>
      <CardContent>
        {classAnalysis.participacion_estudiantes.nivel_participacion ? (
          <div className="space-y-6">
            <div className="bg-pink-50 border-l-4 border-pink-400 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-pink-800 mb-4">
                Nivel de Participación
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {classAnalysis.participacion_estudiantes.nivel_participacion}
              </p>
            </div>

            {classAnalysis.participacion_estudiantes.tipos_interaccion.length > 0 && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">
                  Tipos de Interacción
                </h3>
                <ul className="space-y-2">
                  {classAnalysis.participacion_estudiantes.tipos_interaccion.map((tipo, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-3 mt-1">•</span>
                      <span className="text-gray-700">{tipo}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {classAnalysis.participacion_estudiantes.momentos_destacados.length > 0 && (
              <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-4">
                  Momentos Destacados
                </h3>
                <ul className="space-y-2">
                  {classAnalysis.participacion_estudiantes.momentos_destacados.map((momento, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-purple-500 mr-3 mt-1">•</span>
                      <span className="text-gray-700">{momento}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">
              Participación Estudiantil
            </p>
            <p className="text-gray-400 text-sm">
              Genera el análisis para ver el detalle de la participación
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
