import { Users, GraduationCap, BookOpen, ClipboardCheck, BarChart3, Settings, LogOut } from 'lucide-react';
import { SidebarNavItem, UserRole } from '@/types';

export const API_BASE_URL = 'http://localhost:4000';

export const USER_ROLES: Record<UserRole, string> = {
  admin: 'Administrador',
  tutor: 'Tutor',
  participant: 'Participante',
};

export const ATTENDANCE_STATUS = {
  present: 'Presente',
  absent: 'Ausente',
  late: 'Tardanza',
  excused: 'Justificado',
} as const;

export const GRADE_SCALE = {
  'A+': { min: 97, max: 100 },
  'A': { min: 93, max: 96 },
  'A-': { min: 90, max: 92 },
  'B+': { min: 87, max: 89 },
  'B': { min: 83, max: 86 },
  'B-': { min: 80, max: 82 },
  'C+': { min: 77, max: 79 },
  'C': { min: 73, max: 76 },
  'C-': { min: 70, max: 72 },
  'D': { min: 60, max: 69 },
  'F': { min: 0, max: 59 },
} as const;

export const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = [
  {
    title: 'Gestionar Participantes',
    href: '/dashboard/participants',
    icon: Users,
    roles: ['admin'],
  },
  {
    title: 'Gestionar Tutores',
    href: '/dashboard/tutors',
    icon: GraduationCap,
    roles: ['admin'],
  },
  {
    title: 'Gestionar Cursos',
    href: '/dashboard/courses',
    icon: BookOpen,
    roles: ['tutor'],
  },
  {
    title: 'Gestionar Calificaciones',
    href: '/dashboard/grades',
    icon: BarChart3,
    roles: ['tutor'],
  },
  {
    title: 'Gestionar Asistencia',
    href: '/dashboard/attendance',
    icon: ClipboardCheck,
    roles: ['tutor'],
  },
  {
    title: 'Mis Cursos',
    href: '/dashboard/my-courses',
    icon: BookOpen,
    roles: ['participant'],
  },
];

export const HEADER_NAV_ITEMS = [
  {
    title: 'Configuración',
    href: '/dashboard/settings',
    icon: Settings,
  },
  {
    title: 'Cerrar Sesión',
    href: '/logout',
    icon: LogOut,
  },
];
