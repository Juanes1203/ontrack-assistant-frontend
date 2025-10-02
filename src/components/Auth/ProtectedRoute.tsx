import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { roleUtils } from '@/utils/auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'teacher' | 'admin' | 'super_admin';
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallbackPath = '/login'
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  console.log('🛡️ ProtectedRoute - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading, 'user:', user, 'location:', location.pathname, 'requiredRole:', requiredRole);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('🚫 Not authenticated, redirecting to login');
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role requirements
  if (requiredRole) {
    let hasRequiredRole = false;
    
    if (requiredRole === 'super_admin') {
      hasRequiredRole = user?.role === 'SUPER_ADMIN';
    } else if (requiredRole === 'admin') {
      hasRequiredRole = roleUtils.isAdmin(user);
    } else {
      hasRequiredRole = roleUtils.canManageClasses(user);
    }

    console.log('🔐 Role check - requiredRole:', requiredRole, 'user.role:', user?.role, 'hasRequiredRole:', hasRequiredRole);

    if (!hasRequiredRole) {
      console.log('🚫 Access denied - insufficient role');
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

// Higher-order component for easier usage
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: 'teacher' | 'admin' | 'super_admin'
) => {
  return (props: P) => (
    <ProtectedRoute requiredRole={requiredRole}>
      <Component {...props} />
    </ProtectedRoute>
  );
};
