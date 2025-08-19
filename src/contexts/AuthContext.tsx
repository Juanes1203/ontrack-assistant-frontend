import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'teacher' | 'admin' | 'student';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      verifyToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenToVerify}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data.user);
        setToken(tokenToVerify);
      } else {
        // Token inválido, limpiar localStorage
        localStorage.removeItem('authToken');
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error('Error verificando token:', error);
      localStorage.removeItem('authToken');
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.data.user);
        setToken(data.data.token);
        localStorage.setItem('authToken', data.data.token);
        return true;
      } else {
        console.error('Error en login:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 