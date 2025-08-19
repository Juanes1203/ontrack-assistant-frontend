import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, Shield, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MentorAILogo } from '@/components/MentorAILogo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión exitosamente.",
        });
        navigate('/');
      } else {
        setError('Credenciales inválidas. Por favor, verifica tu email y contraseña.');
      }
    } catch (error) {
      setError('Error al conectar con el servidor. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-md rounded-2xl">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <Shield className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-center mb-4">
                <MentorAILogo />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                Bienvenido
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                Inicia sesión en tu cuenta de OnTrack
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 px-4 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-xl transition-all duration-200"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-12 px-4 pr-12 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-xl transition-all duration-200"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>

            <div className="text-center space-y-4 pt-4">
              <div className="text-xs text-gray-500">
                <p className="font-semibold mb-3 text-gray-600">Credenciales de prueba:</p>
                <div className="space-y-2 text-left bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                  <p className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full"></span><strong>Admin:</strong> admin@mentorai.com / admin123</p>
                  <p className="flex items-center gap-2"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span><strong>Profesor:</strong> maria.gonzalez@mentorai.com / teacher123</p>
                  <p className="flex items-center gap-2"><span className="w-2 h-2 bg-teal-500 rounded-full"></span><strong>Super Admin:</strong> superadmin@mentorai.com / admin456</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login; 