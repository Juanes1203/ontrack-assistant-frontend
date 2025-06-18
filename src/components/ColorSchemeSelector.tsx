import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Monitor, Smartphone, Eye } from 'lucide-react';

interface ColorSchemeSelectorProps {
  onSchemeChange: (scheme: string) => void;
}

const colorSchemes = [
  {
    id: 'default',
    name: 'Estándar',
    description: 'Colores originales optimizados para la mayoría de dispositivos',
    icon: Monitor,
    colors: ['bg-blue-50', 'bg-green-50', 'bg-orange-50', 'bg-red-50']
  },
  {
    id: 'high-contrast',
    name: 'Alto Contraste',
    description: 'Colores más contrastados para mejor visibilidad',
    icon: Eye,
    colors: ['bg-gray-100', 'bg-blue-100', 'bg-green-100', 'bg-red-100']
  },
  {
    id: 'neutral',
    name: 'Neutral',
    description: 'Colores neutros para monitores externos y diferentes dispositivos',
    icon: Smartphone,
    colors: ['bg-neutral-50', 'bg-neutral-100', 'bg-gray-50', 'bg-slate-50']
  },
  {
    id: 'warm',
    name: 'Cálido',
    description: 'Tonos cálidos que reducen la fatiga visual',
    icon: Palette,
    colors: ['bg-white', 'bg-orange-50', 'bg-red-50', 'bg-pink-50']
  }
];

export const ColorSchemeSelector: React.FC<ColorSchemeSelectorProps> = ({
  onSchemeChange
}) => {
  const [selectedScheme, setSelectedScheme] = useState('default');

  const handleSchemeChange = (schemeId: string) => {
    setSelectedScheme(schemeId);
    onSchemeChange(schemeId);
    
    // Aplicar el esquema de color al documento
    document.documentElement.setAttribute('data-color-scheme', schemeId);
    
    // Guardar preferencia en localStorage
    localStorage.setItem('mentorai-color-scheme', schemeId);
  };

  // Cargar esquema guardado al inicializar
  React.useEffect(() => {
    const savedScheme = localStorage.getItem('mentorai-color-scheme');
    if (savedScheme) {
      handleSchemeChange(savedScheme);
    }
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Configuración de Colores
        </CardTitle>
        <p className="text-sm text-gray-600">
          Selecciona un esquema de colores que funcione mejor en tu dispositivo
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {colorSchemes.map((scheme) => {
            const Icon = scheme.icon;
            return (
              <Button
                key={scheme.id}
                variant={selectedScheme === scheme.id ? "default" : "outline"}
                className={`h-auto p-4 flex flex-col items-start gap-3 ${
                  selectedScheme === scheme.id 
                    ? 'border-2 border-blue-500 bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleSchemeChange(scheme.id)}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{scheme.name}</span>
                </div>
                <p className="text-xs text-left text-gray-600">
                  {scheme.description}
                </p>
                <div className="flex gap-1 mt-2">
                  {scheme.colors.map((color, index) => (
                    <div
                      key={index}
                      className={`w-4 h-4 rounded ${color} border border-gray-200`}
                    />
                  ))}
                </div>
              </Button>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">💡 Consejos:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• <strong>Estándar:</strong> Recomendado para la mayoría de usuarios</li>
            <li>• <strong>Alto Contraste:</strong> Para monitores con problemas de brillo</li>
            <li>• <strong>Neutral:</strong> Para monitores externos o diferentes dispositivos</li>
            <li>• <strong>Cálido:</strong> Para reducir la fatiga visual en sesiones largas</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}; 