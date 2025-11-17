import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, LoginRequest, LoginResponse, RegisterRequest } from '@/types/api';
import { api } from '@/services/apiClient';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated
  const isAuthenticated = !!user;
  
  // Helper function to normalize role to uppercase
  const normalizeRole = (role: string): 'TEACHER' | 'ADMIN' | 'SUPER_ADMIN' => {
    const upperRole = role.toUpperCase();
    if (upperRole === 'SUPER_ADMIN') return 'SUPER_ADMIN';
    if (upperRole === 'ADMIN') return 'ADMIN';
    return 'TEACHER';
  };
  

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          // Normalize role to uppercase
          const normalizedUser = {
            ...parsedUser,
            role: normalizeRole(parsedUser.role)
          };
          setUser(normalizedUser);
          
          // Verify token is still valid by refreshing user data
          await refreshUser();
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        // Clear invalid data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/login', credentials);
      
      // Extract data from the API response
      const { user, token, expiresIn } = response.data;
      
      // Normalize role to uppercase
      const normalizedUser = {
        ...user,
        role: normalizeRole(user.role)
      };
      
      // Store token and user data
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(normalizedUser));
      
      setUser(normalizedUser);
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/register', userData);
      
      // Extract data from the API response
      const { user, token, expiresIn } = response.data;
      
      // Normalize role to uppercase
      const normalizedUser = {
        ...user,
        role: normalizeRole(user.role)
      };
      
      // Store token and user data
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(normalizedUser));
      
      setUser(normalizedUser);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  // Clear auth data (for debugging)
  const clearAuth = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    try {
      const response = await api.get('/auth/me');
      
      // Normalize role to uppercase
      const normalizedUser = {
        ...response.data,
        role: normalizeRole(response.data.role)
      };
      
      setUser(normalizedUser);
      localStorage.setItem('user_data', JSON.stringify(normalizedUser));
    } catch (error) {
      console.error('❌ Error refreshing user:', error);
      // If refresh fails, logout user
      logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
    clearAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
