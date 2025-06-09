import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { ClassAnalysis } from '@/types/classAnalysis';

interface MomentsTabProps {
  classAnalysis: ClassAnalysis;
}

export const MomentsTab: React.FC<MomentsTabProps> = ({ classAnalysis }) => {
  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2 text-indigo-600" />
          Momentos Clave de la Clase
        </CardTitle>
      </CardHeader>
      <CardContent>
        {classAnalysis.momentos_clave.length > 0 ? (
          <div className="space-y-6">
            {classAnalysis.momentos_clave.map((momento, index) => (
              <div key={index} className="border-l-4 border-indigo-400 bg-indigo-50 p-6 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-indigo-800">
                    {momento.tipo}
                  </h3>
                  <span className="text-sm text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                    {momento.tiempo}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {momento.descripcion}
                </p>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Impacto</h4>
                  <p className="text-gray-600">{momento.impacto}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">
              Momentos Clave de la Clase
            </p>
            <p className="text-gray-400 text-sm">
              Genera el análisis para ver los momentos clave identificados
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 