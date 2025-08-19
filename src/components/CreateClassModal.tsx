import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookOpen, User, GraduationCap, Clock, FileText } from 'lucide-react';

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateClass: (classData: {
    name: string;
    teacher: string;
    description?: string;
    subject?: string;
    grade_level?: string;
    duration?: number;
  }) => Promise<void>;
}

const CreateClassModal: React.FC<CreateClassModalProps> = ({ isOpen, onClose, onCreateClass }) => {
  const [formData, setFormData] = useState({
    name: '',
    teacher: '',
    description: '',
    subject: '',
    grade_level: '',
    duration: 60,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.teacher) {
      setIsSubmitting(true);
      try {
        await onCreateClass(formData);
        setFormData({
          name: '',
          teacher: '',
          description: '',
          subject: '',
          grade_level: '',
          duration: 60,
        });
      } catch (error) {
        console.error('Error creating class:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
                style={{
                  borderColor: '#e5e7eb',
                  backgroundColor: '#ffffff'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                }}
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
                style={{
                  borderColor: '#e5e7eb',
                  backgroundColor: '#ffffff'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                }}
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium flex items-center">
                <FileText className="w-4 h-4 mr-1 text-purple-500" />
                Descripción
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Breve descripción de la clase..."
                className="border-2 focus:border-blue-400"
                rows={3}
                style={{
                  borderColor: '#e5e7eb',
                  backgroundColor: '#ffffff'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                }}
              />
            </div>

            {/* Materia */}
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-medium">
                Materia
              </Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="Ej: Informática, Matemáticas, Arte..."
                className="border-2 focus:border-blue-400"
                style={{
                  borderColor: '#e5e7eb',
                  backgroundColor: '#ffffff'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                }}
              />
            </div>

            {/* Nivel educativo */}
            <div className="space-y-2">
              <Label htmlFor="grade_level" className="text-sm font-medium">
                Nivel Educativo
              </Label>
              <Select value={formData.grade_level} onValueChange={(value) => handleInputChange('grade_level', value)}>
                <SelectTrigger className="border-2 focus:border-blue-400" style={{
                  borderColor: '#e5e7eb',
                  backgroundColor: '#ffffff'
                }}>
                  <SelectValue placeholder="Selecciona el nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Primaria">Primaria</SelectItem>
                  <SelectItem value="Secundaria">Secundaria</SelectItem>
                  <SelectItem value="Bachillerato">Bachillerato</SelectItem>
                  <SelectItem value="Universidad">Universidad</SelectItem>
                  <SelectItem value="Posgrado">Posgrado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Duración */}
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium flex items-center">
                <Clock className="w-4 h-4 mr-1 text-orange-500" />
                Duración (minutos)
              </Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 60)}
                placeholder="60"
                min="15"
                max="180"
                className="border-2 focus:border-blue-400"
                style={{
                  borderColor: '#e5e7eb',
                  backgroundColor: '#ffffff'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                }}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 border-2"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isSubmitting ? 'Creando...' : 'Crear Clase'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClassModal;
