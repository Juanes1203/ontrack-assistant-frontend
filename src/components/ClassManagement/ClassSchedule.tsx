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
      name: 'Calculus Advanced',
      location: 'Lab 205',
      students: 28,
      time: '09:00 AM',
      status: 'today'
    },
    {
      id: '2',
      name: 'Chemistry Tutorial',
      location: 'Lab 205',
      students: 28,
      time: '09:00 AM',
      status: 'today'
    },
    {
      id: '3',
      name: 'Calculus Integral',
      location: 'Lab 205',
      students: 28,
      time: '09:00 AM',
      status: 'today'
    }
  ];

  const handleClassClick = (classId: string) => {
    navigate(`/class/${classId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'today':
        return 'bg-pink-100 text-pink-700';
      case 'upcoming':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-green-200 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-gray-600" />
            <h2 className="text-2xl font-bold text-gray-800">Class Schedule</h2>
          </div>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Class
          </Button>
        </div>

        {/* Class Cards */}
        <div className="grid gap-4">
          {sampleClasses.map((cls) => (
            <div
              key={cls.id}
              className="bg-gray-50 rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => handleClassClick(cls.id)}
            >
              <div className="flex items-center justify-between">
                {/* Class Info */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {cls.name}
                  </h3>
                  
                  <div className="flex items-center space-x-6 text-gray-600">
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
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Today</div>
                    <div className="font-semibold text-gray-800">{cls.time}</div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Edit
                    </Button>
                    <Button
                      className={`${
                        cls.id === '3' 
                          ? 'bg-orange-500 hover:bg-orange-600' 
                          : 'bg-pink-500 hover:bg-pink-600'
                      } text-white`}
                    >
                      Start Class
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
