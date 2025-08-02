import { api } from './api';

export interface Tutor {
  id: number;
  nombre: string;
  email: string;
  contactNumber1: string;
  contactNumber2: string;
}

export interface TutorFormData {
  nombre: string;
  email: string;
  contactNumber1: string;
  contactNumber2: string;
  password?: string;
}

export interface ApiTutor {
  id: number;
  nombre: string;
  email: string;
  contact1: string;
  contact2: string;
  rol_id: number;
}

export interface ApiTutorCreate {
  username: string;
  email: string;
  password: string;
  contactNumber1: number;
  contactNumber2: number | null;
  rol_id: number;
}

function transformApiTutorToFrontend(apiTutor: ApiTutor): Tutor {
  return {
    id: apiTutor.id,
    nombre: apiTutor.nombre,
    email: apiTutor.email,
    contactNumber1: apiTutor.contact1,
    contactNumber2: apiTutor.contact2
  };
}

function transformFrontendToApiTutor(tutorData: TutorFormData): ApiTutorCreate {
  return {
    username: tutorData.nombre,
    email: tutorData.email,
    password: tutorData.password || 'admin123',
    contactNumber1: parseInt(tutorData.contactNumber1) || 0,
    contactNumber2: tutorData.contactNumber2 ? parseInt(tutorData.contactNumber2) : null,
    rol_id: 2 // Tutor role
  };
}

export const tutorService = {
  async getAllTutors(): Promise<Tutor[]> {
    const response = await api.get('/admin/personal');
    return response.map(transformApiTutorToFrontend);
  },

  async createTutor(tutorData: TutorFormData): Promise<Tutor> {
    const apiData = transformFrontendToApiTutor(tutorData);
    const response = await api.post('/admin/personal', apiData);
    return transformApiTutorToFrontend(response);
  },

  async updateTutor(id: number, tutorData: Partial<TutorFormData>): Promise<void> {
    const updateData: any = {};
    
    if (tutorData.nombre !== undefined) updateData.username = tutorData.nombre;
    if (tutorData.email !== undefined) updateData.email = tutorData.email;
    if (tutorData.contactNumber1 !== undefined) updateData.contactNumber1 = parseInt(tutorData.contactNumber1) || 0;
    if (tutorData.contactNumber2 !== undefined) updateData.contactNumber2 = tutorData.contactNumber2 ? parseInt(tutorData.contactNumber2) : null;

    await api.put(`/admin/personal/${id}`, updateData);
  },

  async deleteTutor(id: number): Promise<void> {
    await api.delete(`/admin/personal/${id}`);
  }
};
