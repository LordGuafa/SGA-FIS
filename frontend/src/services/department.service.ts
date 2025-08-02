import { api } from './api';

export interface Department {
  id: number;
  nombre: string;
}

export class DepartmentService {
  // Get all departments (Admin only)
  static async getAllDepartments(): Promise<Department[]> {
    return await api.get('/admin/departamentos');
  }
}
