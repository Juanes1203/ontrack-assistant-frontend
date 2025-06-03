
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Class {
  id: string;
  name: string;
  teacher: string;
  day: string;
  time: string;
  description: string;
  subject: string;
  duration: number;
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
      day: 'Lunes',
      time: '10:00',
      description: 'Conceptos básicos de React y componentes',
      subject: 'Programación',
      duration: 90,
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Historia del Arte',
      teacher: 'Carlos Ruiz',
      day: 'Miércoles',
      time: '14:30',
      description: 'Renacimiento y arte clásico',
      subject: 'Arte',
      duration: 120,
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
