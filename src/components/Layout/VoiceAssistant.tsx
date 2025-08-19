import React, { useEffect, useRef } from 'react';
import { useElevenLabs } from '@/contexts/ElevenLabsContext';

export const VoiceAssistant: React.FC = () => {
  const { isWidgetVisible } = useElevenLabs();
  const widgetContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create a container for the 11Labs widget within this component
    if (widgetContainerRef.current && isWidgetVisible) {
      const container = widgetContainerRef.current;
      
      // Clear any existing content
      container.innerHTML = '';
      
      // Create the 11Labs widget element
      if (customElements.get('elevenlabs-convai')) {
        const widget = document.createElement('elevenlabs-convai');
        widget.setAttribute('agent-id', 'agent_01jxkjj751fsktj1ekm63k0pkd');
        
        // Add event listeners to prevent interference with main page
        widget.addEventListener('click', (e) => e.stopPropagation());
        widget.addEventListener('mousedown', (e) => e.stopPropagation());
        widget.addEventListener('touchstart', (e) => e.stopPropagation());
        widget.addEventListener('focus', (e) => e.stopPropagation());
        widget.addEventListener('blur', (e) => e.stopPropagation());
        widget.addEventListener('input', (e) => e.stopPropagation());
        widget.addEventListener('change', (e) => e.stopPropagation());
        
        container.appendChild(widget);
      }
    }
  }, [isWidgetVisible]);

  return (
    <div className="bg-white rounded-lg border border-green-200 p-6 h-fit">
      {/* Voice Assistant Title */}
      <h2 className="text-xl font-bold text-gray-800 mb-6">Voice Assistant</h2>

      {/* 11Labs Widget Container */}
      <div className="flex justify-center mb-6">
        <div 
          ref={widgetContainerRef}
          className="w-80 h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
        >
          {!customElements.get('elevenlabs-convai') && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-2"></div>
              <p className="text-gray-500 text-sm">Loading 11Labs Widget...</p>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="text-center">
        <p className="text-gray-700 text-sm leading-relaxed">
          ¡Hi! I am your AI assistant. The widget above allows you to interact with me through voice and text.
        </p>
      </div>
    </div>
  );
};
