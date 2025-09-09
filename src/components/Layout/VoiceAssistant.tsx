import React, { useEffect, useRef, useState } from 'react';
import { useElevenLabs } from '@/contexts/ElevenLabsContext';
import { VoiceAssistantFallback } from './VoiceAssistantFallback';
import './VoiceAssistant.css';

export const VoiceAssistant: React.FC = () => {
  const { isWidgetVisible } = useElevenLabs();
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const [widgetStatus, setWidgetStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const scriptLoaded = useRef(false);

  useEffect(() => {
    const loadElevenLabsScript = async () => {
      if (scriptLoaded.current) return;

      try {
        // Verificar si el script ya existe
        if (document.getElementById('elevenlabs-convai-script')) {
          scriptLoaded.current = true;
          setWidgetStatus('ready');
          return;
        }

        // Cargar el script oficial de ElevenLabs
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
        script.async = true;
        script.type = 'text/javascript';
        script.id = 'elevenlabs-convai-script';

        script.onload = () => {
          console.log('✅ ElevenLabs script loaded successfully');
          scriptLoaded.current = true;
          setWidgetStatus('ready');
        };

        script.onerror = (error) => {
          console.error('❌ Error loading ElevenLabs script:', error);
          setWidgetStatus('error');
          setErrorMessage('Error al cargar el script de ElevenLabs');
        };

        document.body.appendChild(script);
      } catch (error) {
        console.error('❌ Error in loadElevenLabsScript:', error);
        setWidgetStatus('error');
        setErrorMessage('Error al inicializar ElevenLabs');
      }
    };

    loadElevenLabsScript();
  }, []);

  useEffect(() => {
    if (widgetContainerRef.current && isWidgetVisible && widgetStatus === 'ready') {
      const container = widgetContainerRef.current;
      
      // Limpiar contenido existente
      container.innerHTML = '';
      
      try {
        // Crear el widget usando el código oficial de ElevenLabs
        const widget = document.createElement('elevenlabs-convai');
        widget.setAttribute('agent-id', 'agent_01jxkjj751fsktj1ekm63k0pkd');
        
        // Agregar event listeners para manejo de errores
        widget.addEventListener('error', (event: any) => {
          console.error('❌ Widget error:', event.detail);
          const errorMsg = event.detail?.message || 'Widget configuration error';
          
          if (errorMsg.includes('authorize') || errorMsg.includes('authorization')) {
            setErrorMessage('Error de autorización: Las credenciales de ElevenLabs no están configuradas correctamente');
          } else {
            setErrorMessage(errorMsg);
          }
          
          setWidgetStatus('error');
        });
        
        widget.addEventListener('disconnect', (event: any) => {
          console.warn('⚠️ Widget disconnected:', event.detail);
          const disconnectReason = event.detail?.reason || 'Unknown';
          
          if (disconnectReason.includes('authorize') || disconnectReason.includes('authorization')) {
            setErrorMessage('Desconexión por autorización: Verificar credenciales de ElevenLabs');
            setWidgetStatus('error');
            return;
          }
          
          setErrorMessage('Widget desconectado - verificar configuración');
          setWidgetStatus('error');
        });
        
        widget.addEventListener('ready', () => {
          console.log('✅ Widget ready with agent:', 'agent_01jxkjj751fsktj1ekm63k0pkd');
          setWidgetStatus('ready');
          setErrorMessage('');
        });
        
        // Prevenir interferencia con otros elementos
        widget.addEventListener('click', (e) => e.stopPropagation());
        
        // Agregar el widget al contenedor
        container.appendChild(widget);
        
        console.log('🎤 ElevenLabs widget created and added to container');
        
      } catch (error) {
        console.error('❌ Error creating widget:', error);
        setWidgetStatus('error');
        setErrorMessage('Error al crear el widget de ElevenLabs');
      }
    }
  }, [isWidgetVisible, widgetStatus]);

  // Solo mostrar el widget cuando esté activo
  if (!isWidgetVisible) {
    return null;
  }

  return (
    <div 
      ref={widgetContainerRef}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        minWidth: '400px',
        minHeight: '600px'
      }}
    >
      {/* El widget se insertará aquí usando el código oficial de ElevenLabs */}
      
      {widgetStatus === 'loading' && (
        <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">Cargando ElevenLabs Widget...</p>
            <p className="text-xs text-gray-400 mt-1">Usando configuración oficial</p>
          </div>
        </div>
      )}
      
      {widgetStatus === 'error' && (
        <VoiceAssistantFallback errorMessage={errorMessage} />
      )}
    </div>
  );
};