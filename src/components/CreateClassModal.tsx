import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookOpen, User, GraduationCap } from 'lucide-react';

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateClass: (classData: {
    name: string;
    teacher: string;
  }) => void;
}

const CreateClassModal: React.FC<CreateClassModalProps> = ({ isOpen, onClose, onCreateClass }) => {
  const [formData, setFormData] = useState({
    name: '',
    teacher: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.teacher) {
      onCreateClass(formData);
      setFormData({
        name: '',
        teacher: '',
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center">
            <GraduationCap className="w-6 h-6 mr-2 text-blue-600" />
            Nueva Clase
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Ingresa la información básica para comenzar la clase
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            {/* Nombre de la clase */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium flex items-center">
                <BookOpen className="w-4 h-4 mr-1 text-blue-500" />
                Nombre de la Clase *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ej: Introducción a React"
                required
                className="border-2 focus:border-blue-400"
              />
            </div>

            {/* Profesor */}
            <div className="space-y-2">
              <Label htmlFor="teacher" className="text-sm font-medium flex items-center">
                <User className="w-4 h-4 mr-1 text-green-500" />
                Profesor *
              </Label>
              <Input
                id="teacher"
                value={formData.teacher}
                onChange={(e) => handleInputChange('teacher', e.target.value)}
                placeholder="Nombre del profesor"
                required
                className="border-2 focus:border-blue-400"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="px-6 py-2 border-2"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Iniciar Clase
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClassModal;
