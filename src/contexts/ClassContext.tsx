import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Class {
  id: string;
  name: string;
  teacher: string;
  subject: string;
  location: string;
  maxStudents: number;
  description?: string;
  schedulingType: 'immediate' | 'scheduled';
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
    duration: string;
    date: string;
    isRecurring: boolean;
    recurrenceType: 'weekly' | 'biweekly' | 'monthly';
    endDate: string;
  };
  createdAt: Date;
}

interface ClassContextType {
  classes: Class[];
  addClass: (classData: Omit<Class, 'id' | 'createdAt'>) => void;
  getClassById: (id: string) => Class | undefined;
  updateClass: (id: string, updates: Partial<Class>) => void;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

export const useClass = () => {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error('useClass must be used within a ClassProvider');
  }
  return context;
};

interface ClassProviderProps {
  children: ReactNode;
}

export const ClassProvider: React.FC<ClassProviderProps> = ({ children }) => {
  const [classes, setClasses] = useState<Class[]>([
    {
      id: '1',
      name: 'Introducción a React',
      teacher: 'María González',
      subject: 'Informática',
      location: 'Sala 205',
      maxStudents: 25,
      description: 'Curso introductorio a React y desarrollo web moderno',
      schedulingType: 'scheduled',
      schedule: {
        day: 'Lunes',
        startTime: '09:00',
        endTime: '10:30',
        duration: '90',
        date: '2024-01-15',
        isRecurring: true,
        recurrenceType: 'weekly',
        endDate: '2024-06-15'
      },
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Historia del Arte',
      teacher: 'Carlos Ruiz',
      subject: 'Arte',
      location: 'Aula 301',
      maxStudents: 30,
      description: 'Exploración de los movimientos artísticos más importantes',
      schedulingType: 'scheduled',
      schedule: {
        day: 'Martes',
        startTime: '14:00',
        endTime: '15:30',
        duration: '90',
        date: '2024-01-10',
        isRecurring: false,
        recurrenceType: 'weekly',
        endDate: ''
      },
      createdAt: new Date('2024-01-10')
    }
  ]);

  const addClass = (classData: Omit<Class, 'id' | 'createdAt'>) => {
    const newClass: Class = {
      ...classData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setClasses(prev => [newClass, ...prev]);
  };

  const getClassById = (id: string): Class | undefined => {
    return classes.find(cls => cls.id === id);
  };

  const updateClass = (id: string, updates: Partial<Class>) => {
    setClasses(prev => prev.map(cls => 
      cls.id === id ? { ...cls, ...updates } : cls
    ));
  };

  return (
    <ClassContext.Provider value={{
      classes,
      addClass,
      getClassById,
      updateClass
    }}>
      {children}
    </ClassContext.Provider>
  );
};
