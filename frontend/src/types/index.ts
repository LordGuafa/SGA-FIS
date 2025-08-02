export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'tutor' | 'participant';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Participant extends User {
  role: 'participant';
  studentId: string;
  enrolledCourses: string[];
}

export interface Tutor extends User {
  role: 'tutor';
  employeeId: string;
  courses: string[];
  specialization: string;
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  tutorId: string;
  tutorName: string;
  participantIds: string[];
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  startDate: string;
  endDate: string;
  maxParticipants: number;
  isActive: boolean;
}

export interface Grade {
  id: string;
  participantId: string;
  courseId: string;
  assignment: string;
  score: number;
  maxScore: number;
  percentage: number;
  letterGrade: string;
  date: string;
  comments?: string;
}

export interface Attendance {
  id: string;
  participantId: string;
  courseId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface DashboardStats {
  totalParticipants: number;
  totalTutors: number;
  totalCourses: number;
  activeParticipants: number;
}

export type UserRole = 'admin' | 'tutor' | 'participant';

export interface SidebarNavItem {
  title: string;
  href: string;
  icon: any;
  roles: UserRole[];
}
