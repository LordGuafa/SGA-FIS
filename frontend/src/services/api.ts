import { API_BASE_URL } from '@/constants';

// Base API configuration
const API_CONFIG = {
  baseURL: 'http://localhost:4000/culturapp',
  headers: {
    'Content-Type': 'application/json',
  },
};

// Auth token management
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('cultulab_token');
  }
  return null;
};

export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cultulab_token', token);
  }
};

export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('cultulab_token');
  }
};

// Custom error class for handled authentication errors
export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

// API request wrapper with authentication
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...API_CONFIG.headers,
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  const url = `${API_CONFIG.baseURL}${endpoint}`;
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle specific 401 errors for invalid credentials
      if (response.status === 401 && errorData.message === 'Invalid credentials') {
        throw new AuthenticationError('INVALID_CREDENTIALS');
      }
      
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    // Handle 204 No Content responses (successful operations with no response body)
    if (response.status === 204) {
      return null;
    }
    
    // For other successful responses, parse JSON
    return await response.json();
  } catch (error) {
    // Only log non-authentication errors to avoid showing invalid credentials in console
    if (!(error instanceof AuthenticationError)) {
      console.error('API request failed:', error);
    }
    throw error;
  }
};

// Generic CRUD operations
export const api = {
  get: (endpoint: string) => apiRequest(endpoint, { method: 'GET' }),
  post: (endpoint: string, data: any) => 
    apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: (endpoint: string, data: any) =>
    apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (endpoint: string) =>
    apiRequest(endpoint, { method: 'DELETE' }),
};
