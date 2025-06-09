import React, { createContext, useContext, useEffect, useRef } from 'react';

interface ElevenLabsContextType {
  sendToAgent: (transcript: string, analysis: any) => Promise<void>;
}

const ElevenLabsContext = createContext<ElevenLabsContextType | null>(null);

export const ElevenLabsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const scriptLoaded = useRef(false);
  const widgetLoaded = useRef(false);

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
            widget.setAttribute('agent-id', 'agent_01jwsqvdyeeqkv6jvmrwnw7z2g');
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

  return (
    <ElevenLabsContext.Provider value={{ sendToAgent }}>
      {children}
      <div id="elevenlabs-widget-container" className="fixed bottom-4 right-4 w-[400px] h-[600px] z-50" />
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