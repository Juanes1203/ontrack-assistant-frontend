import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClassAnalysis } from '@/types/classAnalysis';

interface ObjectiveTabProps {
  classAnalysis: ClassAnalysis;
}

export const ObjectiveTab: React.FC<ObjectiveTabProps> = ({ classAnalysis }) => {
  const { resumen } = classAnalysis;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'achieved':
        return 'bg-green-500';
      case 'partially_achieved':
        return 'bg-orange-500';
      default:
        return 'bg-red-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Objetivos de la Clase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Tema</h3>
            <p className="text-gray-700">{resumen?.tema || 'No disponible'}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Objetivos</h3>
            <p className="text-gray-700">{resumen?.objetivos || 'No disponible'}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Duración</h3>
            <p className="text-gray-700">{resumen?.duracion || 'No disponible'}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Participantes</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li className="text-gray-700">Profesores: {resumen?.participantes?.profesores?.join(', ') || 'No disponible'}</li>
              <li className="text-gray-700">Estudiantes: {resumen?.participantes?.estudiantes?.join(', ') || 'No disponible'}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 