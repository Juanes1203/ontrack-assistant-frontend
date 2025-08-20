import React from 'react';
import { Plus, Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useClass } from '@/contexts/ClassContext';

export const ClassSchedule: React.FC = () => {
  const navigate = useNavigate();
  const { classes } = useClass();

  // Sample classes data - you can replace this with your actual data
  const sampleClasses = [
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
      className="bg-white rounded-lg p-4 lg:p-6 max-w-full"
      style={{ border: '1px solid #10b981' }}
    >
      <div className="space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-green-600" />
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Horario de Clases</h2>
          </div>
          <Button className="bg-green-600 hover:bg-green-700 text-white rounded-lg w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Clase
          </Button>
        </div>

        {/* Class Cards */}
        <div className="grid gap-3 lg:gap-4">
          {sampleClasses.map((cls) => (
            <div
              key={cls.id}
              className="bg-white rounded-lg p-4 lg:p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
              style={{ border: '1px solid #10b981' }}
              onClick={() => handleClassClick(cls.id)}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Class Info */}
                <div className="flex-1">
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2 lg:mb-3">
                    {cls.name}
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{cls.location}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>{cls.students}</span>
                    </div>
                  </div>
                </div>

                {/* Time and Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Hoy</div>
                    <div className="font-semibold text-gray-800">{cls.time}</div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      className="text-gray-700 hover:bg-green-50 bg-white hover:border-green-300 w-full sm:w-auto"
                      style={{ border: '1px solid #10b981' }}
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
          ))}
        </div>
      </div>
    </div>
  );
};
