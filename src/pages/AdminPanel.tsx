import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  UserPlus, 
  Shield, 
  GraduationCap, 
  Search,
  Edit,
  Trash2,
  RefreshCw,
  Plus,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { adminService, User, UserStats, CreateUserData } from '@/services/adminService';
import { useToast } from '@/hooks/use-toast';

const AdminPanel = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form data
  const [formData, setFormData] = useState<CreateUserData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'TEACHER',
    schoolId: 'default-school'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [usersResponse, statsResponse] = await Promise.all([
        adminService.getUsers(),
        adminService.getUserStats()
      ]);
      
      setUsers(usersResponse.data);
      setStats(statsResponse.data);
    } catch (err: any) {
      setError('Error al cargar datos: ' + err.message);
      console.error('Error loading admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
        toast({
          title: 'Error',
          description: 'Por favor completa todos los campos requeridos',
          variant: 'destructive'
        });
        return;
      }

      const response = await adminService.createUser(formData);
      
      setUsers(prev => [response.data, ...prev]);
      setShowCreateForm(false);
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'TEACHER',
        schoolId: 'default-school'
      });

      toast({
        title: 'Usuario creado',
        description: `${response.data.firstName} ${response.data.lastName} ha sido creado exitosamente`,
      });

      // Recargar estadísticas
      const statsResponse = await adminService.getUserStats();
      setStats(statsResponse.data);

    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Error al crear usuario: ' + err.message,
        variant: 'destructive'
      });
    }
  };

  const handleDeactivateUser = async (userId: string, userName: string) => {
    if (window.confirm(`¿Estás seguro de que quieres desactivar a ${userName}?`)) {
      try {
        await adminService.deactivateUser(userId);
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, isActive: false } : user
        ));
        
        toast({
          title: 'Usuario desactivado',
          description: `${userName} ha sido desactivado`,
        });

        // Recargar estadísticas
        const statsResponse = await adminService.getUserStats();
        setStats(statsResponse.data);

      } catch (err: any) {
        toast({
          title: 'Error',
          description: 'Error al desactivar usuario: ' + err.message,
          variant: 'destructive'
        });
      }
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      SUPER_ADMIN: { color: 'bg-red-100 text-red-800 border-red-200', icon: Shield },
      ADMIN: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Shield },
      TEACHER: { color: 'bg-green-100 text-green-800 border-green-200', icon: GraduationCap }
    };

    const config = roleConfig[role as keyof typeof roleConfig];
    const Icon = config.icon;

    return (
      <Badge variant="outline" className={`text-xs ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {role.replace('_', ' ')}
      </Badge>
    );
  };

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-800">Cargando panel de administración...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="text-gray-800 mt-1">
              Gestiona usuarios y permisos del sistema
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Crear Usuario
            </Button>
            <Button onClick={loadData} variant="outline">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-gray-800">
                  Usuarios registrados
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Activos</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
                <p className="text-xs text-gray-800">
                  Usuarios activos
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profesores</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.teachers}</div>
                <p className="text-xs text-gray-800">
                  Profesores registrados
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Administradores</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.admins}</div>
                <p className="text-xs text-gray-800">
                  Administradores
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Buscar usuarios por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-gray-800 placeholder:text-gray-800 border-gray-300 focus:border-blue-500"
          />
        </div>

        {/* Create User Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-gray-100 relative">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 px-6 py-4 relative">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-3 pr-8">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <UserPlus className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Crear Nuevo Usuario</h2>
                    <p className="text-blue-100 text-sm">Agregar usuario al sistema</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Juan"
                      className="placeholder:text-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Pérez"
                      className="placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="usuario@ejemplo.com"
                    className="placeholder:text-gray-600"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Mínimo 6 caracteres"
                      className="placeholder:text-gray-600 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="role">Rol</Label>
                  <Select value={formData.role} onValueChange={(value: 'ADMIN' | 'TEACHER') => setFormData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TEACHER">Profesor</SelectItem>
                      <SelectItem value="ADMIN">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCreateUser}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-lg font-medium shadow-lg transition-all duration-200"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Crear Usuario
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Usuarios ({filteredUsers.length})</CardTitle>
            <CardDescription className="text-gray-800">
              Lista de todos los usuarios del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
                </h3>
                <p className="text-gray-500">
                  {searchTerm 
                    ? 'Intenta con otros términos de búsqueda'
                    : 'Crea tu primer usuario para comenzar'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-sm text-gray-800">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {getRoleBadge(user.role)}
                          <Badge variant="outline" className={`text-xs ${user.isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                            {user.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-800">
                      <span>Creado: {formatDate(user.createdAt)}</span>
                      {user.isActive && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeactivateUser(user.id, `${user.firstName} ${user.lastName}`)}
                          className="text-red-600 hover:bg-red-50 border-red-200"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Desactivar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AdminPanel;
