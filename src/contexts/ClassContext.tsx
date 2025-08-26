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
  students: string[]; // Array de IDs de estudiantes
  transcript?: string; // Transcripción de la clase
  hasAnalysis?: boolean; // Si tiene análisis de IA
  createdAt: Date;
}

interface ClassContextType {
  classes: Class[];
  addClass: (classData: Omit<Class, 'id' | 'createdAt'>) => void;
  getClassById: (id: string) => Class | undefined;
  updateClass: (id: string, updates: Partial<Class>) => void;
  addStudentsToClass: (classId: string, studentIds: string[]) => void;
  removeStudentFromClass: (classId: string, studentId: string) => void;
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
      students: ['1', '3', '7', '11'], // IDs de estudiantes
      transcript: `Profesor: Buenos días a todos, bienvenidos a la clase de Introducción a React. Hoy vamos a comenzar con los conceptos fundamentales de React.

Estudiante 1: ¿Profesora, React es lo mismo que JavaScript?

Profesor: Excelente pregunta. React es una biblioteca de JavaScript, no es un lenguaje completamente nuevo. React nos permite crear interfaces de usuario de manera más eficiente y organizada.

Estudiante 2: ¿Podemos usar React para crear aplicaciones móviles?

Profesor: Sí, absolutamente. React Native es una extensión de React que nos permite crear aplicaciones móviles nativas usando JavaScript y React.

Estudiante 3: ¿Cuál es la diferencia entre React y Angular?

Profesor: React es más flexible y ligero, mientras que Angular es un framework completo con más funcionalidades integradas. React es ideal para proyectos medianos y pequeños, mientras que Angular es mejor para aplicaciones empresariales grandes.

Hoy vamos a crear nuestro primer componente React. Empezaremos con un componente simple que muestre "Hola Mundo".`,
      hasAnalysis: true,
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
      students: ['2', '5', '9'], // IDs de estudiantes
      transcript: `Profesor: Bienvenidos a la clase de Historia del Arte. Hoy exploraremos el Renacimiento italiano, uno de los períodos más fascinantes de la historia del arte.

Estudiante 1: Profesor, ¿por qué se llama Renacimiento?

Profesor: El término "Renacimiento" significa "renacer" en francés. Se refiere al renacimiento del interés por la cultura clásica griega y romana después de la Edad Media.

Estudiante 2: ¿Cuáles son los artistas más importantes del Renacimiento?

Profesor: Los tres grandes maestros del Alto Renacimiento son Leonardo da Vinci, Miguel Ángel y Rafael. Cada uno contribuyó de manera única al desarrollo del arte.

Estudiante 3: ¿Qué técnicas artísticas se desarrollaron durante este período?

Profesor: Durante el Renacimiento se perfeccionaron técnicas como la perspectiva lineal, el sfumato (transiciones suaves entre colores), y el estudio anatómico del cuerpo humano.

Estudiante 4: ¿Cómo influyó la Iglesia en el arte del Renacimiento?

Profesor: La Iglesia fue el principal patrocinador del arte durante este período. Muchas de las obras maestras fueron encargadas para decorar iglesias y catedrales.

Hoy analizaremos "La Mona Lisa" de Leonardo da Vinci, una obra que representa perfectamente las innovaciones técnicas y estéticas del Renacimiento.`,
      hasAnalysis: true,
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

  const addStudentsToClass = (classId: string, studentIds: string[]) => {
    setClasses(prev => prev.map(cls => {
      if (cls.id === classId) {
        const newStudents = [...new Set([...cls.students, ...studentIds])];
        return { ...cls, students: newStudents };
      }
      return cls;
    }));
  };

  const removeStudentFromClass = (classId: string, studentId: string) => {
    setClasses(prev => prev.map(cls => {
      if (cls.id === classId) {
        return { ...cls, students: cls.students.filter(id => id !== studentId) };
      }
      return cls;
    }));
  };

  return (
    <ClassContext.Provider value={{
      classes,
      addClass,
      getClassById,
      updateClass,
      addStudentsToClass,
      removeStudentFromClass
    }}>
      {children}
    </ClassContext.Provider>
  );
};
