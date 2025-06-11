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
          <Clock className="w-5 h-5 mr-2 text-blue-600" />
          Momentos Clave
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {classAnalysis.momentos_clave.map((momento, index) => (
            <div key={index} className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{momento.tipo}</h3>
                  <p className="text-sm text-gray-500">{momento.tiempo}</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {momento.participante}
                </span>
              </div>
              <p className="text-gray-600 mb-2">{momento.descripcion}</p>
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">Impacto</h4>
                <p className="text-gray-600">{momento.impacto}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 