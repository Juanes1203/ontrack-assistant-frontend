import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, UserPlus, CheckCircle } from 'lucide-react';
import { teacherService, CreateTeacherRequest } from '@/services/teacherService';

interface CreateTeacherFormProps {
  onSuccess?: () => void;
}

export const CreateTeacherForm: React.FC<CreateTeacherFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<CreateTeacherRequest>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    schoolId: 'default-school'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await teacherService.createTeacher(formData);
      setSuccess(true);
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        schoolId: 'default-school'
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear el profesor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-700 mb-2">
              ¡Profesor creado exitosamente!
            </h3>
            <p className="text-gray-600 mb-4">
              El profesor ha sido creado y puede iniciar sesión con sus credenciales.
            </p>
            <Button 
              onClick={() => setSuccess(false)}
              variant="outline"
            >
              Crear otro profesor
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Crear Nuevo Profesor
        </CardTitle>
        <CardDescription>
          Agrega un nuevo profesor al sistema. El profesor podrá iniciar sesión con las credenciales proporcionadas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Nombre del profesor"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Apellido del profesor"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="profesor@ontrack.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña temporal"
              required
              minLength={6}
            />
            <p className="text-sm text-gray-500">
              La contraseña debe tener al menos 6 caracteres. El profesor podrá cambiarla después.
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creando profesor...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Crear Profesor
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
