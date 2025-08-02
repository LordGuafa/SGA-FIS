'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types';
import { AuthService, LoginCredentials } from '@/services/auth.service';
import { getAuthToken, removeAuthToken, AuthenticationError } from '@/services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data and token on mount
    const storedUser = localStorage.getItem('cultulab_user');
    const token = getAuthToken();
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const credentials: LoginCredentials = { email, password };
      const response = await AuthService.login(credentials);
      
      // Check if we have a valid response with token
      if (response && response.token) {
        // Decode the JWT token to get user information
        const decodedToken = AuthService.decodeToken(response.token);
        
        // Map decoded token to frontend user format
        const mappedUser: User = {
          id: decodedToken.id.toString(),
          email: decodedToken.email,
          name: decodedToken.email.split('@')[0], // Use email prefix as name
          role: AuthService.mapApiRoleToFrontendRole(decodedToken.rol_id),
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        setUser(mappedUser);
        localStorage.setItem('cultulab_user', JSON.stringify(mappedUser));
      } else {
        throw new Error('Respuesta de login inválida');
      }
    } catch (error) {
      // Only log non-authentication errors to avoid showing invalid credentials in console
      if (!(error instanceof AuthenticationError)) {
        console.error('Login error:', error);
      }
      
      // Handle specific invalid credentials error
      if (error instanceof AuthenticationError && error.message === 'INVALID_CREDENTIALS') {
        throw error; // Pass through the INVALID_CREDENTIALS error unchanged
      }
      
      // For other errors, wrap them with a generic message
      throw new Error('Error al iniciar sesión: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    removeAuthToken();
    localStorage.removeItem('cultulab_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
