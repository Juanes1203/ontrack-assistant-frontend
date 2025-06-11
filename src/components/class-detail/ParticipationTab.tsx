import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClassAnalysis } from '@/types/analysis';

interface ParticipationTabProps {
  classAnalysis: ClassAnalysis | null;
}

export const ParticipationTab: React.FC<ParticipationTabProps> = ({
  classAnalysis
}) => {
  if (!classAnalysis) {
    return (
      <Card className="border-2 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            No hay datos de participación disponibles. Graba una clase para ver el análisis.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Análisis de Participación</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Aquí irá el contenido del análisis de participación */}
          <div className="text-gray-600">
            El análisis de participación se mostrará aquí cuando esté disponible.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
