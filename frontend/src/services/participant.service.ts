import { api } from './api';

export interface Participant {
  id: number;
  nombre: string;
  email: string;
  contactNumber1: string;
  contactNumber2: string;
  departamentoId: number;
  activo: boolean;
}

export interface ParticipantFormData {
  nombre: string;
  email: string;
  contactNumber1: string;
  contactNumber2: string;
  departamentoId: number;
}

export interface ApiParticipant {
  id: number;
  nombre: string;
  email: string;
  contact1: string;
  contact2: string;
  departamento_id: number;
  activo: boolean;
}

export interface ApiParticipantCreate {
  nombre: string;
  email: string;
  contact1: string;
  contact2: string;
  departamento_id: number;
}

function transformApiParticipantToFrontend(apiParticipant: ApiParticipant): Participant {
  return {
    id: apiParticipant.id,
    nombre: apiParticipant.nombre,
    email: apiParticipant.email,
    contactNumber1: apiParticipant.contact1,
    contactNumber2: apiParticipant.contact2,
    departamentoId: apiParticipant.departamento_id,
    activo: apiParticipant.activo
  };
}

function transformFrontendToApiParticipant(participantData: ParticipantFormData): ApiParticipantCreate {
  return {
    nombre: participantData.nombre,
    email: participantData.email,
    contact1: participantData.contactNumber1,
    contact2: participantData.contactNumber2,
    departamento_id: participantData.departamentoId
  };
}

export const participantService = {
  async getAllParticipants(): Promise<Participant[]> {
    const response = await api.get('/admin/participantes');
    return response.map(transformApiParticipantToFrontend);
  },

  async createParticipant(participantData: ParticipantFormData): Promise<Participant> {
    const apiData = transformFrontendToApiParticipant(participantData);
    const response = await api.post('/admin/participantes', apiData);
    return transformApiParticipantToFrontend(response);
  },

  async updateParticipant(id: number, participantData: Partial<ParticipantFormData & { activo?: boolean }>): Promise<void> {
    const updateData: any = {};
    
    if (participantData.nombre !== undefined) updateData.nombre = participantData.nombre;
    if (participantData.email !== undefined) updateData.email = participantData.email;
    if (participantData.contactNumber1 !== undefined) updateData.contact1 = participantData.contactNumber1;
    if (participantData.contactNumber2 !== undefined) updateData.contact2 = participantData.contactNumber2;
    if (participantData.departamentoId !== undefined) updateData.departamento_id = participantData.departamentoId;
    if (participantData.activo !== undefined) updateData.activo = participantData.activo;

    await api.put(`/admin/participantes/${id}`, updateData);
  },

  async deleteParticipant(id: number): Promise<void> {
    await api.delete(`/admin/participantes/${id}`);
  },

  async toggleParticipantStatus(id: number, activo: boolean): Promise<void> {
    await api.put(`/admin/participantes/${id}`, { activo });
  }
};