import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Calendar, MapPin, Users, Clock, BookOpen, User, CalendarDays } from 'lucide-react';
import { useClass } from '@/contexts/ClassContext';
import { useStudent } from '@/contexts/StudentContext';
import { useToast } from '@/hooks/use-toast';
import { AddStudentsModal } from './AddStudentsModal';

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateClassModal: React.FC<CreateClassModalProps> = ({ isOpen, onClose }) => {
  const { addClass } = useClass();
  const { students } = useStudent();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    teacher: '',
    location: '',
    maxStudents: '',
    description: '',
    schedulingType: 'immediate', // 'immediate' or 'scheduled'
    schedule: {
      day: '',
      startTime: '',
      endTime: '',
      duration: '',
      date: '',
      isRecurring: false,
      recurrenceType: 'weekly', // 'weekly', 'biweekly', 'monthly'
      endDate: ''
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddStudentsModalOpen, setIsAddStudentsModalOpen] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAddStudents = (studentIds: string[]) => {
    setSelectedStudentIds(studentIds);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.subject || !formData.teacher || !formData.location) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive",
      });
      return;
    }

    // Validate scheduling based on type
    if (formData.schedulingType === 'scheduled') {
      if (!formData.schedule.date || !formData.schedule.startTime || !formData.schedule.endTime) {
        toast({
          title: "Información de programación requerida",
          description: "Para clases programadas, debes especificar fecha, hora de inicio y fin.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Create the new class
      addClass({
        name: formData.name,
        teacher: formData.teacher,
        subject: formData.subject,
        location: formData.location,
        maxStudents: parseInt(formData.maxStudents) || 30,
        description: formData.description,
        schedulingType: formData.schedulingType,
        schedule: formData.schedule
      });

      const schedulingText = formData.schedulingType === 'immediate' 
        ? 'para comenzar ahora' 
        : `programada para ${formData.schedule.date}`;

      toast({
        title: "Clase creada exitosamente",
        description: `La clase "${formData.name}" ha sido creada ${schedulingText}.`,
      });

      // Reset form and close modal
      setFormData({
        name: '',
        subject: '',
        teacher: '',
        location: '',
        maxStudents: '',
        description: '',
        schedulingType: 'immediate',
        schedule: {
          day: '',
          startTime: '',
          endTime: '',
          duration: '',
          date: '',
          isRecurring: false,
          recurrenceType: 'weekly',
          endDate: ''
        }
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error al crear la clase",
        description: "Hubo un problema al crear la clase. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const subjects = [
    'Matemáticas',
    'Física',
    'Química',
    'Biología',
    'Historia',
    'Literatura',
    'Inglés',
    'Arte',
    'Música',
    'Educación Física',
    'Informática',
    'Filosofía',
    'Geografía',
    'Economía',
    'Psicología',
    'Otro'
  ];

  const days = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo'
  ];

  const recurrenceTypes = [
    { value: 'weekly', label: 'Semanal' },
    { value: 'biweekly', label: 'Quincenal' },
    { value: 'monthly', label: 'Mensual' }
  ];

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-2xl">
            <Plus className="w-6 h-6 text-green-600" />
            <span>Crear Nueva Clase</span>
          </DialogTitle>
          <DialogDescription>
            Completa la información para crear una nueva clase. Puedes programarla para ahora o para el futuro.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Información Básica</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Clase *</Label>
                <Input
                  id="name"
                  placeholder="Ej: Cálculo Avanzado"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Materia *</Label>
                <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar materia" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Describe brevemente el contenido y objetivos de la clase..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Scheduling Type Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <CalendarDays className="w-5 h-5 text-purple-600" />
              <span>Tipo de Programación</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>¿Cuándo quieres que se realice la clase?</Label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="schedulingType"
                      value="immediate"
                      checked={formData.schedulingType === 'immediate'}
                      onChange={(e) => handleInputChange('schedulingType', e.target.value)}
                      className="text-green-600"
                    />
                    <span className="text-sm">Para ahora</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="schedulingType"
                      value="scheduled"
                      checked={formData.schedulingType === 'scheduled'}
                      onChange={(e) => handleInputChange('schedulingType', e.target.value)}
                      className="text-green-600"
                    />
                    <span className="text-sm">Programar para después</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Teacher and Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <User className="w-5 h-5 text-green-600" />
              <span>Profesor y Ubicación</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teacher">Profesor *</Label>
                <Input
                  id="teacher"
                  placeholder="Nombre del profesor"
                  value={formData.teacher}
                  onChange={(e) => handleInputChange('teacher', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Ubicación *</Label>
                <Input
                  id="location"
                  placeholder="Ej: Sala 205, Laboratorio 1"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Schedule Configuration */}
          {formData.schedulingType === 'scheduled' && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Programación de la Clase</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha de la clase *</Label>
                  <Input
                    id="date"
                    type="date"
                    min={today}
                    value={formData.schedule.date}
                    onChange={(e) => handleInputChange('schedule.date', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="day">Día de la semana</Label>
                  <Select value={formData.schedule.day} onValueChange={(value) => handleInputChange('schedule.day', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar día" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Hora de inicio *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.schedule.startTime}
                    onChange={(e) => handleInputChange('schedule.startTime', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endTime">Hora de fin *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.schedule.endTime}
                    onChange={(e) => handleInputChange('schedule.endTime', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duración (minutos)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="45"
                    value={formData.schedule.duration}
                    onChange={(e) => handleInputChange('schedule.duration', e.target.value)}
                  />
                </div>
              </div>

              {/* Recurring Options */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    checked={formData.schedule.isRecurring}
                    onChange={(e) => handleInputChange('schedule.isRecurring', e.target.checked)}
                    className="text-green-600"
                  />
                  <Label htmlFor="isRecurring">¿Es una clase recurrente?</Label>
                </div>

                {formData.schedule.isRecurring && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                    <div className="space-y-2">
                      <Label htmlFor="recurrenceType">Frecuencia</Label>
                      <Select 
                        value={formData.schedule.recurrenceType} 
                        onValueChange={(value) => handleInputChange('schedule.recurrenceType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar frecuencia" />
                        </SelectTrigger>
                        <SelectContent>
                          {recurrenceTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endDate">Fecha de finalización</Label>
                      <Input
                        id="endDate"
                        type="date"
                        min={formData.schedule.date}
                        value={formData.schedule.endDate}
                        onChange={(e) => handleInputChange('schedule.endDate', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Immediate Schedule (simplified) */}
          {formData.schedulingType === 'immediate' && (
            <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-green-600" />
                <span>Horario para Ahora</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTimeNow">Hora de inicio</Label>
                  <Input
                    id="startTimeNow"
                    type="time"
                    value={formData.schedule.startTime}
                    onChange={(e) => handleInputChange('schedule.startTime', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="durationNow">Duración estimada (minutos)</Label>
                  <Input
                    id="durationNow"
                    type="number"
                    placeholder="45"
                    value={formData.schedule.duration}
                    onChange={(e) => handleInputChange('schedule.duration', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Capacity */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <Users className="w-5 h-5 text-orange-600" />
              <span>Capacidad</span>
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="maxStudents">Número máximo de estudiantes</Label>
              <Input
                id="maxStudents"
                type="number"
                placeholder="30"
                value={formData.maxStudents}
                onChange={(e) => handleInputChange('maxStudents', e.target.value)}
                min="1"
                max="100"
              />
            </div>
          </div>

          {/* Students Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Estudiantes de la Clase</span>
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Estudiantes seleccionados</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddStudentsModalOpen(true)}
                  className="text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {selectedStudentIds.length === 0 ? 'Añadir Estudiantes' : 'Gestionar Estudiantes'}
                </Button>
              </div>
              
              {selectedStudentIds.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{selectedStudentIds.length} estudiante{selectedStudentIds.length !== 1 ? 's' : ''} seleccionado{selectedStudentIds.length !== 1 ? 's' : ''}</span>
                    <span className="text-blue-600 font-medium">
                      {selectedStudentIds.length}/{formData.maxStudents || '∞'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {selectedStudentIds.map(studentId => {
                      const student = students.find(s => s.id === studentId);
                      return student ? (
                        <div key={studentId} className="flex items-center space-x-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={student.avatar} alt={student.fullName} />
                            <AvatarFallback className="text-xs bg-blue-200 text-blue-800">
                              {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-gray-800 truncate">
                            {student.fullName}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {student.grade}
                          </Badge>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No hay estudiantes seleccionados</p>
                  <p className="text-xs text-gray-400">Haz clic en "Añadir Estudiantes" para comenzar</p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  {formData.schedulingType === 'immediate' ? 'Crear Clase' : 'Programar Clase'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>

        {/* Add Students Modal */}
        <AddStudentsModal
          isOpen={isAddStudentsModalOpen}
          onClose={() => setIsAddStudentsModalOpen(false)}
          onAddStudents={handleAddStudents}
          existingStudentIds={selectedStudentIds}
          subject={formData.subject}
          maxStudents={parseInt(formData.maxStudents) || undefined}
        />
      </DialogContent>
    </Dialog>
  );
};
