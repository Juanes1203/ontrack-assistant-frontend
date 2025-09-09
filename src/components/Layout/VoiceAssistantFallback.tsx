import React from 'react';

interface VoiceAssistantFallbackProps {
  errorMessage?: string;
}

export const VoiceAssistantFallback: React.FC<VoiceAssistantFallbackProps> = ({ errorMessage }) => {
  const isAuthError = errorMessage?.includes('autorización') || errorMessage?.includes('authorize');
  
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        minWidth: '320px',
        minHeight: '400px'
      }}
      className="bg-white rounded-lg shadow-lg border border-gray-200 p-4"
    >
      <div className="text-center">
        <div className={`text-4xl mb-3 ${isAuthError ? 'text-orange-500' : 'text-blue-500'}`}>
          {isAuthError ? '🔐' : '🎤'}
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {isAuthError ? 'Configuración Requerida' : 'Voice Assistant'}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {isAuthError 
            ? 'El asistente de voz requiere configuración de credenciales'
            : 'El asistente de voz está temporalmente no disponible'
          }
        </p>
        
        {isAuthError && (
          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
            <p className="font-medium mb-1">⚠️ Error de Autorización</p>
            <p>Las credenciales de ElevenLabs no están configuradas o son inválidas</p>
          </div>
        )}
        
        <div className="space-y-2 text-xs text-gray-500 mb-4">
          <p>• Funcionalidad de grabación disponible</p>
          <p>• Análisis de IA funcionando</p>
          <p>• Transcripción automática activa</p>
        </div>
        
        <div className="space-y-2 text-xs text-gray-600">
          <div className="p-2 bg-blue-50 rounded">
            <p className="font-medium text-blue-800">💡 Alternativas disponibles:</p>
            <p>• Usa el botón de grabación en la clase</p>
            <p>• El análisis de IA funciona sin el widget</p>
          </div>
          
          {isAuthError && (
            <div className="p-2 bg-gray-50 rounded">
              <p className="font-medium text-gray-700">🔧 Para configurar:</p>
              <p>• Obtén una API key de ElevenLabs</p>
              <p>• Configura las variables de entorno</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
