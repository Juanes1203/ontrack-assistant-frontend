
import React, { useState } from 'react';
import { Plus, Calendar, MapPin, Users, Clock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useClass } from '@/contexts/ClassContext';
import { CreateClassModal } from './CreateClassModal';

export const ClassSchedule: React.FC = () => {
  const navigate = useNavigate();
  const { classes } = useClass();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Use real classes from context
  const displayClasses = classes.length > 0 ? classes : [
    {
      id: '1',
      name: 'Cálculo Avanzado',
      location: 'Laboratorio 205',
      students: 28,
      time: '09:00 AM',
      status: 'orange'
    },
    {
      id: '2',
      name: 'Tutorial de Química',
      location: 'Laboratorio 205',
      students: 28,
      time: '09:00 AM',
      status: 'orange'
    },
    {
      id: '3',
      name: 'Cálculo Integral',
      location: 'Laboratorio 205',
      students: 28,
      time: '09:00 AM',
      status: 'orange'
    }
  ];

  const handleClassClick = (classId: string) => {
    navigate(`/class/${classId}`);
  };

  const handleCreateClass = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const getStartClassButtonStyle = (status: string) => {
    switch (status) {
      case 'orange':
        return 'bg-[#ff592f] text-white hover:bg-orange-600';
      default:
        return 'bg-gray-500 text-white hover:bg-gray-600';
    }
  };

  return (
    <div 
      className="bg-white rounded-lg p-4 lg:p-6 max-w-full border border-gray-200"
    >
      <div className="space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-green-600" />
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Horario de Clases</h2>
          </div>
          <Button 
            onClick={handleCreateClass}
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Clase
          </Button>
        </div>

        {/* Class Cards */}
        <div className="grid gap-3 lg:gap-4">
          {displayClasses.map((cls) => {
            // Handle both old sample data and new context data
            const isContextClass = 'subject' in cls;
            const className = isContextClass ? cls.name : cls.name;
            const location = isContextClass ? cls.location : cls.location;
            const students = isContextClass ? cls.maxStudents : cls.students;
            const time = isContextClass ? `${cls.schedule.startTime} - ${cls.schedule.endTime}` : cls.time;
            const day = isContextClass ? cls.schedule.day : 'Hoy';
            
            // Format date for display
            const formatDate = (dateString: string) => {
              if (!dateString) return 'Hoy';
              const date = new Date(dateString);
              const today = new Date();
              const tomorrow = new Date(today);
              tomorrow.setDate(tomorrow.getDate() + 1);
              
              if (date.toDateString() === today.toDateString()) return 'Hoy';
              if (date.toDateString() === tomorrow.toDateString()) return 'Mañana';
              
              return date.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              });
            };
            
            const displayDate = isContextClass && cls.schedule.date 
              ? formatDate(cls.schedule.date) 
              : 'Hoy';
            
            return (
              <div
                key={cls.id}
                className="bg-white rounded-lg p-4 lg:p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer border border-gray-200"
                onClick={() => handleClassClick(cls.id)}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Class Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg lg:text-xl font-semibold text-gray-800">
                        {className}
                      </h3>
                      {isContextClass && (
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          cls.schedulingType === 'immediate' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {cls.schedulingType === 'immediate' ? 'Ahora' : 'Programada'}
                        </div>
                      )}
                    </div>
                    
                                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-gray-600">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{location}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{students}</span>
                        </div>
                        
                        {isContextClass && cls.subject && (
                          <div className="flex items-center space-x-2">
                            <BookOpen className="w-4 h-4" />
                            <span>{cls.subject}</span>
                          </div>
                        )}
                      </div>
                  </div>

                  {/* Time and Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{displayDate}</div>
                      <div className="font-semibold text-gray-800">{time}</div>
                      {isContextClass && cls.schedule.isRecurring && (
                        <div className="text-xs text-green-600 font-medium">
                          {cls.schedule.recurrenceType === 'weekly' && 'Semanal'}
                          {cls.schedule.recurrenceType === 'biweekly' && 'Quincenal'}
                          {cls.schedule.recurrenceType === 'monthly' && 'Mensual'}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        className="text-gray-700 hover:bg-green-50 bg-white hover:border-green-300 w-full sm:w-auto border border-gray-300"
                      >
                        Editar
                      </Button>
                      <Button
                        className={`${getStartClassButtonStyle(cls.status)} rounded-lg w-full sm:w-auto`}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the card click
                          handleClassClick(cls.id);
                        }}
                      >
                        Iniciar Clase
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Class Modal */}
      <CreateClassModal 
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
      />
    </div>
  );
};
