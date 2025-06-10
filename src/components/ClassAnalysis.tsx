import React from 'react';

interface Reference {
  page_content: string;
  page: number;
}

interface ClassAnalysisProps {
  transcript: string;
  analysis: string;
  references: Reference[];
  coinsUsed: number;
}

export const ClassAnalysis: React.FC<ClassAnalysisProps> = ({
  transcript,
  analysis,
  references,
  coinsUsed,
}) => {
  return (
    <div className="space-y-6">
      {/* Transcripción */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Transcripción</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{transcript}</p>
      </div>

      {/* Análisis */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Análisis de la Clase</h2>
        <div className="prose max-w-none">
          {analysis.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Referencias */}
      {references.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Referencias del Material</h2>
          <div className="space-y-4">
            {references.map((reference, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm text-gray-600 mb-1">Página {reference.page}</p>
                <p className="text-gray-700">{reference.page_content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Información de uso */}
      <div className="text-sm text-gray-500 text-right">
        Coins utilizados: {coinsUsed}
      </div>
    </div>
  );
}; 