import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { classService, Class } from '@/services/classService';
import { useAuth } from './AuthContext';

interface ClassContextType {
  classes: Class[];
  loading: boolean;
  error: string | null;
  addClass: (classData: Omit<Class, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  getClassById: (id: string) => Class | undefined;
  updateClass: (id: string, updates: Partial<Class>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  refreshClasses: () => Promise<void>;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

export const useClass = () => {
  const context = useContext(ClassContext);
  if (context === undefined) {
    throw new Error('useClass must be used within a ClassProvider');
  }
  return context;
};

interface ClassProviderProps {
  children: ReactNode;
}

export const ClassProvider: React.FC<ClassProviderProps> = ({ children }) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  // Cargar clases al inicializar o cuando cambie el usuario
  const loadClasses = async () => {
    if (!isAuthenticated) {
      setClasses([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Cargando clases desde el backend...');
      console.log('👤 Usuario actual:', user?.name, user?.role);
      const fetchedClasses = await classService.getAllClasses();
      console.log('✅ Clases cargadas:', fetchedClasses);
      setClasses(fetchedClasses);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las clases';
      console.error('❌ Error loading classes:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, [isAuthenticated, user]);

  const addClass = async (classData: Omit<Class, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      const newClass = await classService.createClass(classData);
      setClasses(prev => [newClass, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la clase');
      throw err;
    }
  };

  const getClassById = (id: string): Class | undefined => {
    return classes.find(cls => cls.id === id);
  };

  const updateClass = async (id: string, updates: Partial<Class>) => {
    try {
      setError(null);
      const updatedClass = await classService.updateClass(id, updates);
      setClasses(prev => prev.map(cls => 
        cls.id === id ? updatedClass : cls
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la clase');
      throw err;
    }
  };

  const deleteClass = async (id: string) => {
    try {
      setError(null);
      await classService.deleteClass(id);
      setClasses(prev => prev.filter(cls => cls.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la clase');
      throw err;
    }
  };

  const refreshClasses = async () => {
    await loadClasses();
  };

  return (
    <ClassContext.Provider value={{
      classes,
      loading,
      error,
      addClass,
      getClassById,
      updateClass,
      deleteClass,
      refreshClasses
    }}>
      {children}
    </ClassContext.Provider>
  );
};
