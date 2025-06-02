
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookOpen, User, Calendar, Clock, FileText, GraduationCap } from 'lucide-react';

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateClass: (classData: {
    name: string;
    teacher: string;
    day: string;
    time: string;
    description: string;
    subject: string;
    duration: number;
  }) => void;
}

const CreateClassModal: React.FC<CreateClassModalProps> = ({ isOpen, onClose, onCreateClass }) => {
  const [formData, setFormData] = useState({
    name: '',
    teacher: '',
    day: '',
    time: '',
    description: '',
    subject: '',
    duration: 60
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.teacher && formData.day && formData.time) {
      onCreateClass(formData);
      setFormData({
        name: '',
        teacher: '',
        day: '',
        time: '',
        description: '',
        subject: '',
        duration: 60
      });
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const days = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
  ];

  const subjects = [
    'Matemáticas', 'Ciencias', 'Historia', 'Literatura', 'Arte', 'Música', 
    'Programación', 'Idiomas', 'Educación Física', 'Filosofía', 'Otro'
  ];

  const durations = [
    { value: 30, label: '30 minutos' },
    { value: 45, label: '45 minutos' },
    { value: 60, label: '1 hora' },
    { value: 90, label: '1.5 horas' },
    { value: 120, label: '2 horas' },
    { value: 180, label: '3 horas' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center">
            <GraduationCap className="w-6 h-6 mr-2 text-blue-600" />
            Nueva Clase
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Completa la información para crear una nueva clase
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Día */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-purple-500" />
                Día de la semana *
              </Label>
              <Select onValueChange={(value) => handleInputChange('day', value)}>
                <SelectTrigger className="border-2 focus:border-blue-400">
                  <SelectValue placeholder="Seleccionar día" />
                </SelectTrigger>
                <SelectContent>
                  {days.map((day) => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Hora */}
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium flex items-center">
                <Clock className="w-4 h-4 mr-1 text-orange-500" />
                Hora *
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                required
                className="border-2 focus:border-blue-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Materia */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center">
                <GraduationCap className="w-4 h-4 mr-1 text-indigo-500" />
                Materia
              </Label>
              <Select onValueChange={(value) => handleInputChange('subject', value)}>
                <SelectTrigger className="border-2 focus:border-blue-400">
                  <SelectValue placeholder="Seleccionar materia" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duración */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center">
                <Clock className="w-4 h-4 mr-1 text-red-500" />
                Duración
              </Label>
              <Select onValueChange={(value) => handleInputChange('duration', parseInt(value))}>
                <SelectTrigger className="border-2 focus:border-blue-400">
                  <SelectValue placeholder="Seleccionar duración" />
                </SelectTrigger>
                <SelectContent>
                  {durations.map((duration) => (
                    <SelectItem key={duration.value} value={duration.value.toString()}>
                      {duration.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium flex items-center">
              <FileText className="w-4 h-4 mr-1 text-teal-500" />
              Descripción
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe brevemente el contenido de la clase..."
              rows={3}
              className="border-2 focus:border-blue-400 resize-none"
            />
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
              Crear Clase
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClassModal;
