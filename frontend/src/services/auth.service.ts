import { api, setAuthToken, removeAuthToken, AuthenticationError } from './api';
import { jwtDecode } from 'jwt-decode';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface JWTPayload {
  id: number;
  email: string;
  rol_id: number;
  iat: number;
  exp: number;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export class AuthService {
  // Decode JWT token to extract user information
  static decodeToken(token: string): JWTPayload {
    try {
      return jwtDecode<JWTPayload>(token);
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  // Admin login
  static async loginAdmin(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post('/admin/login', credentials);
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  }

  // Tutor login
  static async loginTutor(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post('/tutor/login', credentials);
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  }

  // Generic login that determines role based on email or response
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // Try admin login first
    try {
      return await this.loginAdmin(credentials);
    } catch (error) {
      // If admin login fails, try tutor login
      try {
        return await this.loginTutor(credentials);
      } catch (tutorError) {
        // If both fail, preserve the AuthenticationError if it exists
        if (error instanceof AuthenticationError) {
          throw error;
        }
        if (tutorError instanceof AuthenticationError) {
          throw tutorError;
        }
        // Otherwise throw an AuthenticationError for invalid credentials
        throw new AuthenticationError('INVALID_CREDENTIALS');
      }
    }
  }

  // Change password for admin
  static async changeAdminPassword(
    userId: number,
    passwordData: ChangePasswordData
  ): Promise<any> {
    return await api.put(`/admin/change-password/${userId}`, passwordData);
  }

  // Change password for tutor
  static async changeTutorPassword(
    userId: number,
    passwordData: ChangePasswordData
  ): Promise<any> {
    return await api.put(`/tutor/change-password/${userId}`, passwordData);
  }

  // Logout
  static logout(): void {
    removeAuthToken();
    localStorage.removeItem('cultulab_user');
  }

  // Map API role to frontend role
  static mapApiRoleToFrontendRole(rolId: number): 'admin' | 'tutor' | 'participant' {
    switch (rolId) {
      case 1:
        return 'admin';
      case 2:
        return 'tutor';
      case 3:
        return 'participant';
      default:
        return 'participant';
    }
  }
}
