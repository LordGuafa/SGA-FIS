'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  TrendingUp,
  Calendar,
  Clock,
  BarChart3,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  // Mock stats based on user role
  const getStatsForRole = () => {
    switch (user?.role) {
      case 'admin':
        return {
          title: 'Panel de Administración',
          description: 'Gestiona participantes, tutores y vista general del sistema.',
          stats: [
            {
              title: 'Total de Participantes',
              value: '45',
              description: '+2 desde el mes pasado',
              icon: Users,
              trend: '+4.5%',
              color: 'text-blue-600',
              bgColor: 'bg-blue-100',
            },
            {
              title: 'Tutores Activos',
              value: '8',
              description: '3 nuevos este semestre',
              icon: GraduationCap,
              trend: '+12.5%',
              color: 'text-green-600',
              bgColor: 'bg-green-100',
            },
            {
              title: 'Total de Cursos',
              value: '12',
              description: '4 inician el próximo mes',
              icon: BookOpen,
              trend: '+8.3%',
              color: 'text-purple-600',
              bgColor: 'bg-purple-100',
            },
            {
              title: 'Tasa de Finalización',
              value: '94%',
              description: 'Por encima del objetivo',
              icon: TrendingUp,
              trend: '+2.1%',
              color: 'text-orange-600',
              bgColor: 'bg-orange-100',
            },
          ],
        };
      case 'tutor':
        return {
          title: 'Panel del Tutor',
          description: 'Gestiona tus cursos, calificaciones y asistencia de estudiantes.',
          stats: [
            {
              title: 'Mis Cursos',
              value: '3',
              description: 'Actualmente enseñando',
              icon: BookOpen,
              trend: 'Activo',
              color: 'text-blue-600',
              bgColor: 'bg-blue-100',
            },
            {
              title: 'Total de Estudiantes',
              value: '68',
              description: 'En todos los cursos',
              icon: Users,
              trend: '+5 esta semana',
              color: 'text-green-600',
              bgColor: 'bg-green-100',
            },
            {
              title: 'Calificaciones Pendientes',
              value: '12',
              description: 'Necesitan calificación',
              icon: BarChart3,
              trend: 'Próximo vencimiento',
              color: 'text-orange-600',
              bgColor: 'bg-orange-100',
            },
            {
              title: 'Tasa de Asistencia',
              value: '89%',
              description: 'Este semestre',
              icon: CheckCircle,
              trend: '+3.2%',
              color: 'text-purple-600',
              bgColor: 'bg-purple-100',
            },
          ],
        };
      case 'participant':
        return {
          title: 'Panel del Estudiante',
          description: 'Ve tus cursos, calificaciones y asistencia.',
          stats: [
            {
              title: 'Cursos Inscritos',
              value: '2',
              description: 'Este semestre',
              icon: BookOpen,
              trend: 'Activo',
              color: 'text-blue-600',
              bgColor: 'bg-blue-100',
            },
            {
              title: 'Promedio de Calificaciones',
              value: '87%',
              description: 'GPA actual: 3.4',
              icon: BarChart3,
              trend: '+2.1%',
              color: 'text-green-600',
              bgColor: 'bg-green-100',
            },
            {
              title: 'Tasa de Asistencia',
              value: '94%',
              description: 'Excelente asistencia',
              icon: CheckCircle,
              trend: '+1.5%',
              color: 'text-purple-600',
              bgColor: 'bg-purple-100',
            },
            {
              title: 'Clases Próximas',
              value: '5',
              description: 'Esta semana',
              icon: Calendar,
              trend: 'Horario',
              color: 'text-orange-600',
              bgColor: 'bg-orange-100',
            },
          ],
        };
      default:
        return {
          title: 'Panel Principal',
          description: 'Bienvenido a Cultulab',
          stats: [],
        };
    }
  };

  const dashboardData = getStatsForRole();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{dashboardData.title}</h1>
        <p className="text-gray-600 mt-1">{dashboardData.description}</p>
      </div>

      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-white">¡Bienvenido de vuelta, {user?.name}!</CardTitle>
          <CardDescription className="text-blue-100">
            Aquí está lo que está pasando con tu {user?.role === 'admin' ? 'sistema' : user?.role === 'tutor' ? 'cursos' : 'estudios'} hoy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-100" />
            <span className="text-blue-100">
              Último acceso: {new Date().toLocaleDateString()} a las {new Date().toLocaleTimeString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData.stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">{stat.description}</p>
                  {stat.trend && (
                    <Badge variant="outline" className="text-xs">
                      {stat.trend}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Funciones frecuentemente utilizadas para tu rol.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user?.role === 'admin' && (
              <>
                <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-3">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-medium">Agregar Participante</h3>
                      <p className="text-sm text-gray-600">Registrar nuevo estudiante</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-medium">Agregar Tutor</h3>
                      <p className="text-sm text-gray-600">Registrar nuevo instructor</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                    <div>
                      <h3 className="font-medium">Ver Reportes</h3>
                      <p className="text-sm text-gray-600">Analíticas del sistema</p>
                    </div>
                  </div>
                </Card>
              </>
            )}
            {user?.role === 'tutor' && (
              <>
                <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-medium">Agregar Curso</h3>
                      <p className="text-sm text-gray-600">Crear nuevo curso</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-medium">Registrar Calificaciones</h3>
                      <p className="text-sm text-gray-600">Actualizar puntuaciones</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-8 w-8 text-purple-600" />
                    <div>
                      <h3 className="font-medium">Tomar Asistencia</h3>
                      <p className="text-sm text-gray-600">Marcar presencia de estudiantes</p>
                    </div>
                  </div>
                </Card>
              </>
            )}
            {user?.role === 'participant' && (
              <>
                <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-medium">Ver Cursos</h3>
                      <p className="text-sm text-gray-600">Ver cursos inscritos</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-medium">Verificar Calificaciones</h3>
                      <p className="text-sm text-gray-600">Ver tus puntuaciones</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-8 w-8 text-purple-600" />
                    <div>
                      <h3 className="font-medium">Ver Horario</h3>
                      <p className="text-sm text-gray-600">Consultar horarios de clases</p>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
