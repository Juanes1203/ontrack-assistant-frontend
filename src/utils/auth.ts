import { User } from '@/types/api';

// Token management
export const tokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },

  setToken: (token: string): void => {
    localStorage.setItem('auth_token', token);
  },

  removeToken: (): void => {
    localStorage.removeItem('auth_token');
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  },
};

// User data management
export const userManager = {
  getUser: (): User | null => {
    try {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  },

  setUser: (user: User): void => {
    localStorage.setItem('user_data', JSON.stringify(user));
  },

  removeUser: (): void => {
    localStorage.removeItem('user_data');
  },
};

// Role checking utilities
export const roleUtils = {
  isTeacher: (user: User | null): boolean => {
    return user?.role === 'teacher';
  },

  isAdmin: (user: User | null): boolean => {
    return user?.role === 'admin';
  },

  canManageClasses: (user: User | null): boolean => {
    console.log('🔍 canManageClasses check - user:', user, 'role:', user?.role);
    const result = user?.role === 'teacher' || user?.role === 'admin';
    console.log('🔍 canManageClasses result:', result);
    return result;
  },

  canManageStudents: (user: User | null): boolean => {
    return user?.role === 'teacher' || user?.role === 'admin';
  },

  canViewAnalytics: (user: User | null): boolean => {
    return user?.role === 'admin';
  },
};

// Auth state checking
export const authUtils = {
  isAuthenticated: (): boolean => {
    const token = tokenManager.getToken();
    const user = userManager.getUser();
    
    if (!token || !user) return false;
    
    // Check if token is expired
    if (tokenManager.isTokenExpired(token)) {
      tokenManager.removeToken();
      userManager.removeUser();
      return false;
    }
    
    return true;
  },

  getAuthHeaders: (): Record<string, string> => {
    const token = tokenManager.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

// Route protection utilities
export const routeUtils = {
  requiresAuth: (path: string): boolean => {
    const publicRoutes = ['/login', '/register', '/forgot-password'];
    return !publicRoutes.includes(path);
  },

  requiresRole: (path: string, requiredRole: 'teacher' | 'admin'): boolean => {
    const adminRoutes = ['/admin', '/analytics', '/users'];
    return adminRoutes.some(route => path.startsWith(route)) && requiredRole === 'admin';
  },
};
