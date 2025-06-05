import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClassAnalysis } from '@/types/classAnalysis';

interface ObjectiveTabProps {
  classAnalysis: ClassAnalysis;
}

export const ObjectiveTab: React.FC<ObjectiveTabProps> = ({ classAnalysis }) => {
  const { classObjective } = classAnalysis;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'achieved':
        return 'bg-green-500';
      case 'partially_achieved':
        return 'bg-yellow-500';
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
            <h3 className="text-lg font-semibold mb-2">Objetivo Principal</h3>
            <p className="text-gray-700">{classObjective.mainObjective}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Objetivos Específicos</h3>
            <ul className="list-disc pl-5 space-y-2">
              {classObjective.specificObjectives.map((objective, index) => (
                <li key={index} className="text-gray-700">{objective}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Estado de Logro</h3>
            <Badge className={`${getStatusColor(classObjective.achievementStatus)} text-white`}>
              {classObjective.achievementStatus === 'achieved' ? 'Logrado' :
               classObjective.achievementStatus === 'partially_achieved' ? 'Parcialmente Logrado' :
               'No Logrado'}
            </Badge>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Evidencia</h3>
            <ul className="list-disc pl-5 space-y-2">
              {classObjective.evidence.map((item, index) => (
                <li key={index} className="text-gray-700">{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Recomendaciones</h3>
            <ul className="list-disc pl-5 space-y-2">
              {classObjective.recommendations.map((recommendation, index) => (
                <li key={index} className="text-gray-700">{recommendation}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 