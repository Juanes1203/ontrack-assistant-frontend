
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';
import { ClassAnalysis } from '@/types/classAnalysis';

interface SwotTabProps {
  classAnalysis: ClassAnalysis;
}

export const SwotTab: React.FC<SwotTabProps> = ({ classAnalysis }) => {
  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="w-5 h-5 mr-2 text-orange-600" />
          Análisis FODA (Basado en Contenido de la Transcripción)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {classAnalysis.strengths.length > 0 ? (
          <div className="space-y-6">
            {/* Fortalezas */}
            <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                💪 Fortalezas Identificadas en la Transcripción
              </h3>
              <ul className="space-y-3">
                {classAnalysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-3 mt-0.5">✓</span>
                    <span className="text-gray-700 leading-relaxed">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Debilidades */}
            <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
                🔍 Áreas de Mejora Detectadas
              </h3>
              <ul className="space-y-3">
                {classAnalysis.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-orange-500 mr-3 mt-0.5">⚠</span>
                    <span className="text-gray-700 leading-relaxed">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Oportunidades */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                🚀 Oportunidades de Crecimiento
              </h3>
              <ul className="space-y-3">
                {classAnalysis.opportunities.map((opportunity, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-3 mt-0.5">💡</span>
                    <span className="text-gray-700 leading-relaxed">{opportunity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">
              Análisis FODA de la clase
            </p>
            <p className="text-gray-400 text-sm">
              Genera el análisis para ver fortalezas, debilidades y oportunidades basadas en la transcripción
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
