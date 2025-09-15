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
  
  console.log('🔍 AuthContext - user:', user, 'isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        console.log('🔄 Initializing auth - token:', !!token, 'userData:', !!userData);
        console.log('📦 localStorage content:', {
          auth_token: localStorage.getItem('auth_token'),
          user_data: localStorage.getItem('user_data')
        });
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          console.log('👤 Found user in localStorage:', parsedUser);
          setUser(parsedUser);
          
          // Verify token is still valid by refreshing user data
          await refreshUser();
        } else {
          console.log('🚫 No auth data found in localStorage');
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        // Clear invalid data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      } finally {
        setIsLoading(false);
        console.log('✅ Auth initialization complete');
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('🔐 Attempting login with:', credentials.email);
      const response = await api.post('/auth/login', credentials);
      console.log('✅ Login response:', response);
      console.log('📊 Response structure:', {
        success: response.success,
        data: response.data,
        message: response.message
      });
      
      // Extract data from the API response
      const { user, token, expiresIn } = response.data;
      
      // Normalize role to lowercase
      const normalizedUser = {
        ...user,
        role: user.role.toLowerCase() as 'teacher' | 'admin'
      };
      
      // Store token and user data
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(normalizedUser));
      
      console.log('💾 Stored in localStorage:', {
        token: token.substring(0, 20) + '...',
        user: normalizedUser
      });
      
      setUser(normalizedUser);
      console.log('👤 User set in context:', normalizedUser);
      console.log('✅ Login completed successfully');
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
      
      // Normalize role to lowercase
      const normalizedUser = {
        ...user,
        role: user.role.toLowerCase() as 'teacher' | 'admin'
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
    console.log('🧹 Clearing auth data');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    console.log('✅ Auth data cleared');
  };

  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    try {
      console.log('🔄 Refreshing user data...');
      const response = await api.get('/auth/me');
      console.log('✅ User refresh response:', response);
      
      // Normalize role to lowercase
      const normalizedUser = {
        ...response.data,
        role: response.data.role.toLowerCase() as 'teacher' | 'admin'
      };
      
      console.log('👤 Refreshed user:', normalizedUser);
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
