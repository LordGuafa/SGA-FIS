'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AuthenticationError } from '@/services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      // Only log non-authentication errors to avoid showing invalid credentials in console
      if (!(err instanceof AuthenticationError)) {
        console.log('Login error:', err);
      }
      
      if (err instanceof AuthenticationError && err.message === 'INVALID_CREDENTIALS') {
        // Show toast for invalid credentials - not a server error
        // Clear any error state since we're using toast instead
        setError('');
        toast({
          variant: "destructive",
          title: "Error de autenticación",
          description: "Correo electrónico o contraseña erróneos",
        });
      } else if (err instanceof Error) {
        if (err.message.includes('500') || err.message.includes('server') || err.message.includes('network')) {
          // Show error state for server errors
          setError('Error del servidor. Inténtalo de nuevo más tarde.');
        } else {
          // Show error state for other unknown errors
          setError('Error al iniciar sesión. Inténtalo de nuevo.');
        }
      } else {
        setError('Error inesperado. Inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Brand */}
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Cultulab</h1>
          </div>
          <p className="text-gray-600">Plataforma de Gestión Académica</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Bienvenido de vuelta</CardTitle>
            <CardDescription className="text-center">
              Ingresa tus credenciales para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ingresa tu correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Credenciales de Demostración:</p>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Administrador:</strong> ana.admin@sga.com / admin123</p>
                <p><strong>Tutor:</strong> carlos.tutor@sga.com / admin123</p>
                <p><strong>Nota:</strong> Las contraseñas pueden haber sido cambiadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
