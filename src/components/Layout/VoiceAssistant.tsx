import React, { useEffect, useRef, useState } from 'react';
import { useElevenLabs } from '@/contexts/ElevenLabsContext';
import './VoiceAssistant.css';

export const VoiceAssistant: React.FC = () => {
  const { isWidgetVisible } = useElevenLabs();
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const [widgetStatus, setWidgetStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const checkWidget = () => {
      if (customElements.get('elevenlabs-convai')) {
        setWidgetStatus('ready');
        return true;
      }
      return false;
    };

    // Check immediately
    if (checkWidget()) {
      return;
    }

    // Check every 500ms
    const interval = setInterval(() => {
      if (checkWidget()) {
        clearInterval(interval);
      }
    }, 500);

    // Cleanup
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (widgetContainerRef.current && isWidgetVisible && widgetStatus === 'ready') {
      const container = widgetContainerRef.current;
      
      // Clear any existing content
      container.innerHTML = '';
      
      try {
        // Create the 11Labs widget element with minimal interference
        const widget = document.createElement('elevenlabs-convai');
        widget.setAttribute('agent-id', 'agent_01jxkjj751fsktj1ekm63k0pkd');
        
        // Minimal event listeners to prevent interference
        widget.addEventListener('click', (e) => e.stopPropagation());
        
        // Let the widget handle its own styling naturally
        container.appendChild(widget);
        
      } catch (error) {
        console.error('Error creating widget:', error);
        setWidgetStatus('error');
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
      {/* El widget se insertará aquí y mantendrá su tamaño natural */}
      
      {widgetStatus === 'loading' && (
        <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">Loading 11Labs Widget...</p>
          </div>
        </div>
      )}
      
      {widgetStatus === 'error' && (
        <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-2">⚠️</div>
            <p className="text-red-500 text-sm">Failed to load widget</p>
            <p className="text-xs text-gray-400 mt-2">Please try again later</p>
          </div>
        </div>
      )}
    </div>
  );
};
