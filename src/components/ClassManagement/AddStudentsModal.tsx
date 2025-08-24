import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Users, Plus, X } from 'lucide-react';
import { useStudent } from '@/contexts/StudentContext';
import { Student } from '@/contexts/StudentContext';

interface AddStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudents: (studentIds: string[]) => void;
  existingStudentIds?: string[];
  subject?: string;
  maxStudents?: number;
}

export const AddStudentsModal: React.FC<AddStudentsModalProps> = ({
  isOpen,
  onClose,
  onAddStudents,
  existingStudentIds = [],
  subject,
  maxStudents
}) => {
  const { students } = useStudent();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [filterGrade, setFilterGrade] = useState('all');

  // Filter students based on search, grade, and subject
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGrade = filterGrade === 'all' || student.grade === filterGrade;
      const matchesSubject = !subject || student.subjects.includes(subject);
      const notAlreadyAdded = !existingStudentIds.includes(student.id);
      
      return matchesSearch && matchesGrade && matchesSubject && notAlreadyAdded;
    });
  }, [students, searchTerm, filterGrade, subject, existingStudentIds]);

  // Get available grades from students
  const availableGrades = useMemo(() => {
    const grades = [...new Set(students.map(s => s.grade))];
    return grades.sort();
  }, [students]);

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleAddStudents = () => {
    onAddStudents(selectedStudents);
    setSelectedStudents([]);
    onClose();
  };

  const handleClose = () => {
    setSelectedStudents([]);
    onClose();
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'average': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'needs-improvement': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPerformanceLabel = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Bueno';
      case 'average': return 'Promedio';
      case 'needs-improvement': return 'Necesita Mejorar';
      default: return 'N/A';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-2xl">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Añadir Estudiantes a la Clase</span>
          </DialogTitle>
          <DialogDescription>
            Selecciona los estudiantes que quieres añadir a esta clase.
            {subject && ` Se mostrarán solo estudiantes que cursan ${subject}.`}
            {maxStudents && ` Máximo ${maxStudents} estudiantes.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar estudiantes</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="w-full sm:w-48">
              <Label htmlFor="grade-filter">Filtrar por grado</Label>
              <select
                id="grade-filter"
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos los grados</option>
                {availableGrades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Selected Students Count */}
          {selectedStudents.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-800">
                  {selectedStudents.length} estudiante{selectedStudents.length !== 1 ? 's' : ''} seleccionado{selectedStudents.length !== 1 ? 's' : ''}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedStudents([])}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-4 h-4 mr-1" />
                  Limpiar
                </Button>
              </div>
            </div>
          )}

          {/* Students List */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              Estudiantes Disponibles ({filteredStudents.length})
            </Label>
            
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No se encontraron estudiantes que coincidan con los filtros.</p>
              </div>
            ) : (
              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                      selectedStudents.includes(student.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleStudentToggle(student.id)}
                  >
                    <Checkbox
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleStudentToggle(student.id)}
                      className="flex-shrink-0"
                    />
                    
                    <Avatar className="w-12 h-12 flex-shrink-0">
                      <AvatarImage src={student.avatar} alt={student.fullName} />
                      <AvatarFallback className="bg-gray-200 text-gray-700">
                        {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 truncate">
                            {student.fullName}
                          </h4>
                          <p className="text-sm text-gray-500 truncate">
                            {student.email}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {student.grade}
                          </Badge>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getPerformanceColor(student.performance)}`}
                          >
                            {getPerformanceLabel(student.performance)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span>Asistencia: {student.attendance}%</span>
                        <span>Edad: {student.age} años</span>
                        <span>Materias: {student.subjects.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAddStudents}
            disabled={selectedStudents.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Añadir {selectedStudents.length} Estudiante{selectedStudents.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
