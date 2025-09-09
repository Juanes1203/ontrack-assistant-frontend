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
        // Verificar si el script ya existe
        if (document.getElementById('elevenlabs-convai-script')) {
          scriptLoaded.current = true;
          widgetLoaded.current = true;
          return;
        }

        // Cargar el script oficial de ElevenLabs
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
        script.async = true;
        script.type = 'text/javascript';
        script.id = 'elevenlabs-convai-script';

        await new Promise((resolve, reject) => {
          script.onload = () => {
            console.log('✅ ElevenLabs script loaded in context');
            resolve(true);
          };
          script.onerror = (error) => {
            console.error('❌ Error loading ElevenLabs script in context:', error);
            reject(error);
          };
          document.body.appendChild(script);
        });

        scriptLoaded.current = true;

        // Esperar a que el elemento personalizado esté definido
        if (!customElements.get('elevenlabs-convai')) {
          await new Promise(resolve => {
            const observer = new MutationObserver((mutations, obs) => {
              if (customElements.get('elevenlabs-convai')) {
                console.log('✅ ElevenLabs custom element registered in context');
                obs.disconnect();
                resolve(true);
              }
            });
            observer.observe(document, {
              childList: true,
              subtree: true
            });
            
            // Timeout después de 10 segundos
            setTimeout(() => {
              observer.disconnect();
              resolve(false);
            }, 10000);
          });
        }

        widgetLoaded.current = true;
      } catch (error) {
        console.error('❌ Error loading ElevenLabs widget in context:', error);
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