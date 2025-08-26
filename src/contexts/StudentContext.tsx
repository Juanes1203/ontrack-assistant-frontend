import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  grade: string;
  age: number;
  avatar: string;
  subjects: string[];
  performance: 'excellent' | 'good' | 'average' | 'needs-improvement';
  attendance: number; // percentage
  notes: string;
  createdAt: Date;
}

interface StudentContextType {
  students: Student[];
  addStudent: (studentData: Omit<Student, 'id' | 'createdAt' | 'fullName'>) => void;
  getStudentById: (id: string) => Student | undefined;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  getStudentsBySubject: (subject: string) => Student[];
  getStudentsByGrade: (grade: string) => Student[];
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};

interface StudentProviderProps {
  children: ReactNode;
}

export const StudentProvider: React.FC<StudentProviderProps> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      firstName: 'María',
      lastName: 'González',
      fullName: 'María González',
      email: 'maria.gonzalez@email.com',
      grade: '11°',
      age: 16,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
      subjects: ['Matemáticas', 'Física', 'Química'],
      performance: 'excellent',
      attendance: 95,
      notes: 'Estudiante destacada en ciencias exactas. Excelente participación en clase.',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      firstName: 'Carlos',
      lastName: 'Rodríguez',
      fullName: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@email.com',
      grade: '10°',
      age: 15,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      subjects: ['Historia', 'Literatura', 'Inglés'],
      performance: 'good',
      attendance: 88,
      notes: 'Buen estudiante en humanidades. Interés particular en historia.',
      createdAt: new Date('2024-01-10')
    },
    {
      id: '3',
      firstName: 'Ana',
      lastName: 'Martínez',
      fullName: 'Ana Martínez',
      email: 'ana.martinez@email.com',
      grade: '11°',
      age: 16,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      subjects: ['Biología', 'Química', 'Matemáticas'],
      performance: 'excellent',
      attendance: 92,
      notes: 'Excelente en ciencias naturales. Lidera proyectos de investigación.',
      createdAt: new Date('2024-01-12')
    },
    {
      id: '4',
      firstName: 'Luis',
      lastName: 'Hernández',
      fullName: 'Luis Hernández',
      email: 'luis.hernandez@email.com',
      grade: '9°',
      age: 14,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      subjects: ['Matemáticas', 'Informática', 'Inglés'],
      performance: 'good',
      attendance: 85,
      notes: 'Interés en tecnología y programación. Buen rendimiento en matemáticas.',
      createdAt: new Date('2024-01-08')
    },
    {
      id: '5',
      firstName: 'Sofia',
      lastName: 'López',
      fullName: 'Sofia López',
      email: 'sofia.lopez@email.com',
      grade: '12°',
      age: 17,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      subjects: ['Arte', 'Literatura', 'Historia'],
      performance: 'excellent',
      attendance: 98,
      notes: 'Artista talentosa. Excelente en expresión creativa y análisis literario.',
      createdAt: new Date('2024-01-05')
    },
    {
      id: '6',
      firstName: 'Diego',
      lastName: 'Pérez',
      fullName: 'Diego Pérez',
      email: 'diego.perez@email.com',
      grade: '10°',
      age: 15,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      subjects: ['Educación Física', 'Biología', 'Matemáticas'],
      performance: 'good',
      attendance: 90,
      notes: 'Deportista destacado. Buen rendimiento académico general.',
      createdAt: new Date('2024-01-14')
    },
    {
      id: '7',
      firstName: 'Valentina',
      lastName: 'García',
      fullName: 'Valentina García',
      email: 'valentina.garcia@email.com',
      grade: '11°',
      age: 16,
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      subjects: ['Física', 'Matemáticas', 'Informática'],
      performance: 'excellent',
      attendance: 94,
      notes: 'Excelente en ciencias exactas. Participa en olimpiadas de matemáticas.',
      createdAt: new Date('2024-01-11')
    },
    {
      id: '8',
      firstName: 'Andrés',
      lastName: 'Torres',
      fullName: 'Andrés Torres',
      email: 'andres.torres@email.com',
      grade: '9°',
      age: 14,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
      subjects: ['Música', 'Inglés', 'Historia'],
      performance: 'average',
      attendance: 78,
      notes: 'Interés en música. Necesita apoyo en algunas materias.',
      createdAt: new Date('2024-01-09')
    },
    {
      id: '9',
      firstName: 'Camila',
      lastName: 'Jiménez',
      fullName: 'Camila Jiménez',
      email: 'camila.jimenez@email.com',
      grade: '12°',
      age: 17,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
      subjects: ['Psicología', 'Biología', 'Literatura'],
      performance: 'good',
      attendance: 87,
      notes: 'Interés en ciencias sociales. Buena capacidad de análisis.',
      createdAt: new Date('2024-01-06')
    },
    {
      id: '10',
      firstName: 'Juan',
      lastName: 'Silva',
      fullName: 'Juan Silva',
      email: 'juan.silva@email.com',
      grade: '10°',
      age: 15,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
      subjects: ['Geografía', 'Historia', 'Inglés'],
      performance: 'average',
      attendance: 82,
      notes: 'Interés en geografía. Necesita mejorar en idiomas.',
      createdAt: new Date('2024-01-13')
    },
    {
      id: '11',
      firstName: 'Isabella',
      lastName: 'Ramírez',
      fullName: 'Isabella Ramírez',
      email: 'isabella.ramirez@email.com',
      grade: '11°',
      age: 16,
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      subjects: ['Química', 'Matemáticas', 'Física'],
      performance: 'excellent',
      attendance: 96,
      notes: 'Excelente en ciencias. Lidera proyectos de laboratorio.',
      createdAt: new Date('2024-01-07')
    },
    {
      id: '12',
      firstName: 'Mateo',
      lastName: 'Castro',
      fullName: 'Mateo Castro',
      email: 'mateo.castro@email.com',
      grade: '9°',
      age: 14,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      subjects: ['Informática', 'Matemáticas', 'Inglés'],
      performance: 'good',
      attendance: 89,
      notes: 'Interés en programación. Buen rendimiento en matemáticas.',
      createdAt: new Date('2024-01-16')
    }
  ]);

  const addStudent = (studentData: Omit<Student, 'id' | 'createdAt' | 'fullName'>) => {
    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString(),
      fullName: `${studentData.firstName} ${studentData.lastName}`,
      createdAt: new Date()
    };
    setStudents(prev => [newStudent, ...prev]);
  };

  const getStudentById = (id: string): Student | undefined => {
    return students.find(student => student.id === id);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(student => 
      student.id === id ? { ...student, ...updates } : student
    ));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const getStudentsBySubject = (subject: string): Student[] => {
    return students.filter(student => student.subjects.includes(subject));
  };

  const getStudentsByGrade = (grade: string): Student[] => {
    return students.filter(student => student.grade === grade);
  };

  return (
    <StudentContext.Provider value={{
      students,
      addStudent,
      getStudentById,
      updateStudent,
      deleteStudent,
      getStudentsBySubject,
      getStudentsByGrade
    }}>
      {children}
    </StudentContext.Provider>
  );
};
