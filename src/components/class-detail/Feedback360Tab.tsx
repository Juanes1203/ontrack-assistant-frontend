import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { ClassAnalysis } from '@/types/classAnalysis';

interface Feedback360TabProps {
  classAnalysis: ClassAnalysis;
}

export const Feedback360Tab: React.FC<Feedback360TabProps> = ({ classAnalysis }) => {
  useEffect(() => {
    // Dynamically add the ElevenLabs script if it hasn't been added yet
    if (!document.getElementById("elevenlabs-convai-script")) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
      script.async = true;
      script.type = "text/javascript";
      script.id = "elevenlabs-convai-script";
      document.body.appendChild(script);
    }
  }, []);

  const feedbackSections = [
    {
      title: 'Autoevaluación Docente',
      items: classAnalysis.feedback360.selfEvaluation,
      icon: '👨‍🏫',
      color: 'border-blue-400 bg-blue-50'
    },
    {
      title: 'Perspectiva Estudiantil',
      items: classAnalysis.feedback360.studentPerspective,
      icon: '🎓',
      color: 'border-green-400 bg-green-50'
    },
    {
      title: 'Observación de Pares',
      items: classAnalysis.feedback360.peerObservations,
      icon: '👥',
      color: 'border-purple-400 bg-purple-50'
    },
    {
      title: 'Áreas de Mejora Identificadas',
      items: classAnalysis.feedback360.improvementAreas,
      icon: '🎯',
      color: 'border-orange-400 bg-orange-50'
    }
  ];

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="w-5 h-5 mr-2 text-pink-600" />
          Retroalimentación 360°
        </CardTitle>
      </CardHeader>
      <CardContent>
        {classAnalysis.feedback360.selfEvaluation.length > 0 ? (
          <div className="space-y-6">
            {feedbackSections.map((section, index) => (
              <div key={index} className={`border-l-4 p-6 rounded-lg ${section.color}`}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-3 text-2xl">{section.icon}</span>
                  {section.title}
                </h3>
                {section.items.length > 0 ? (
                  <ul className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <span className="text-pink-500 mr-3 mt-1">•</span>
                        <span className="text-gray-700 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No hay información disponible para esta perspectiva.</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">
              Retroalimentación 360°
            </p>
            <p className="text-gray-400 text-sm">
              Genera el análisis para ver la retroalimentación detallada
            </p>
          </div>
        )}
        <elevenlabs-convai agent-id="agent_01jwsqvdyeeqkv6jvmrwnw7z2g"></elevenlabs-convai>
      </CardContent>
    </Card>
  );
};
