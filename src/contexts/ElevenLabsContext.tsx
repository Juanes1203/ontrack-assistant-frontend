import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface ElevenLabsContextType {
  sendToAgent: (transcript: string, analysis: any) => Promise<void>;
  toggleWidget: () => void;
  isWidgetVisible: boolean;
}

const ElevenLabsContext = createContext<ElevenLabsContextType | null>(null);

export const ElevenLabsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const scriptLoaded = useRef(false);
  const widgetLoaded = useRef(false);
  const [isWidgetVisible, setIsWidgetVisible] = useState(true);

  useEffect(() => {
    const loadWidget = async () => {
      if (scriptLoaded.current) return;

      try {
        // Cargar el script
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
        script.async = true;
        script.id = 'elevenlabs-convai-script';

        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });

        scriptLoaded.current = true;

        // Esperar a que el elemento personalizado esté definido
        if (!customElements.get('elevenlabs-convai')) {
          await new Promise(resolve => {
            const observer = new MutationObserver((mutations, obs) => {
              if (customElements.get('elevenlabs-convai')) {
                obs.disconnect();
                resolve(true);
              }
            });
            observer.observe(document, {
              childList: true,
              subtree: true
            });
          });
        }

        // Crear el widget una sola vez
        if (!widgetLoaded.current) {
          const container = document.getElementById('elevenlabs-widget-container');
          if (container && !container.querySelector('elevenlabs-convai')) {
            const widget = document.createElement('elevenlabs-convai');
            widget.setAttribute('agent-id', 'agent_01jxkjj751fsktj1ekm63k0pkd');
            
            // Add event listeners to prevent interference with main page
            widget.addEventListener('click', (e) => {
              e.stopPropagation();
            });
            
            widget.addEventListener('mousedown', (e) => {
              e.stopPropagation();
            });
            
            widget.addEventListener('touchstart', (e) => {
              e.stopPropagation();
            });
            
            // Prevent any focus events from affecting the main page
            widget.addEventListener('focus', (e) => {
              e.stopPropagation();
            });
            
            widget.addEventListener('blur', (e) => {
              e.stopPropagation();
            });
            
            // Prevent any input events from bubbling up
            widget.addEventListener('input', (e) => {
              e.stopPropagation();
            });
            
            widget.addEventListener('change', (e) => {
              e.stopPropagation();
            });
            
            container.appendChild(widget);
            widgetLoaded.current = true;
          }
        }
      } catch (error) {
        console.error('Error loading ElevenLabs widget:', error);
      }
    };

    loadWidget();
  }, []);

  const sendToAgent = async (transcript: string, analysis: any) => {
    const widget = document.querySelector('elevenlabs-convai');
    if (!widget) {
      throw new Error('Widget de ElevenLabs no encontrado');
    }

    const event = new CustomEvent('elevenlabs-send-message', {
      detail: {
        type: 'analysis',
        data: {
          transcript,
          analysis: {
            resumen: analysis.resumen,
            criterios_evaluacion: analysis.criterios_evaluacion,
            momentos_clave: analysis.momentos_clave,
            participacion_estudiantes: analysis.participacion_estudiantes,
            areas_mejora: analysis.areas_mejora
          }
        }
      }
    });
    widget.dispatchEvent(event);
  };

  const toggleWidget = () => {
    setIsWidgetVisible(!isWidgetVisible);
  };

  return (
    <ElevenLabsContext.Provider value={{ sendToAgent, toggleWidget, isWidgetVisible }}>
      {children}
      {isWidgetVisible && (
        <div 
          id="elevenlabs-widget-container" 
          className="fixed bottom-4 left-4 w-[320px] h-[480px] z-50"
          style={{
            isolation: 'isolate',
            contain: 'layout style paint',
            willChange: 'transform',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}
        />
      )}
    </ElevenLabsContext.Provider>
  );
};

export const useElevenLabs = () => {
  const context = useContext(ElevenLabsContext);
  if (!context) {
    throw new Error('useElevenLabs must be used within an ElevenLabsProvider');
  }
  return context;
}; 