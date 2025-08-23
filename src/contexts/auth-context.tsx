'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/config/axios';
import { toast } from 'sonner';
import { ApiResponse, LoginResponseData, User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  getUserDetails: (token: string) => Promise<User | null>;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  signUp: (userData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Funciones para manejar cookies
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const removeCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verificar autenticación al cargar la app
  useEffect(() => {
    checkAuth();
  }, []);

  // Función para verificar si el usuario está autenticado
  const checkAuth = async () => {
    try {
      const token =
        localStorage.getItem('auth-token') || getCookie('auth-token');

      if (!token) {
        setIsLoading(false);
        return;
      }

      // Verificar token con el backend
      const userDetails = await getUserDetails(token);
      if (userDetails) {
        setUser(userDetails);
      } else {
        // Token inválido, limpiar
        localStorage.removeItem('auth-token');
        removeCookie('auth-token');
        setUser(null);
      }
    } catch (error) {
      // Error al verificar token, limpiar
      localStorage.removeItem('auth-token');
      removeCookie('auth-token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para obtener detalles del usuario desde la API
  const getUserDetails = async (token: string): Promise<User | null> => {
    try {
      const response = await api.get<ApiResponse<User>>(
        process.env.NEXT_PUBLIC_API_V1_AUTH_ME || '',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        return null;
      }
    } catch (error: any) {
      return null;
    }
  };

  // Función para actualizar datos del usuario
  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const token =
        localStorage.getItem('auth-token') || getCookie('auth-token');
      if (!token) {
        toast.error('No hay token de autenticación');
        return false;
      }

      const response = await api.patch<ApiResponse<User>>(
        process.env.NEXT_PUBLIC_API_V1_AUTH_ME || '',
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Actualizar el usuario localmente
        setUser((prev) => (prev ? { ...prev, ...userData } : null));
        toast.success(response.data.message);
        return true;
      } else {
        toast.error(response.data.message || 'Error al actualizar el perfil');
        return false;
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error al actualizar el perfil');
      }
      return false;
    }
  };

  // Función de login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post<ApiResponse<LoginResponseData>>(
        process.env.NEXT_PUBLIC_API_V1_AUTH_LOGIN || '',
        { email, password }
      );

      if (response.data.success) {
        const { access_token } = response.data.data;

        // Guardar token en localStorage Y cookies
        localStorage.setItem('auth-token', access_token);
        setCookie('auth-token', access_token, 7); // 7 días

        await checkAuth();

        toast.success(response.data.message);
        return true;
      } else {
        toast.error(response.data.message || 'Error en el inicio de sesión');
        return false;
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error en el inicio de sesión');
      }
      return false;
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      // Llamar al endpoint de logout si existe
      await api.post('/auth/logout');
    } catch (error) {
      // Ignorar errores en logout
    } finally {
      // Limpiar estado local Y cookies
      localStorage.removeItem('auth-token');
      removeCookie('auth-token');
      setUser(null);
      router.push('/auth/sign-in');
      toast.success('Sesión cerrada exitosamente');
    }
  };

  const signUp = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const response = await api.post<ApiResponse<User>>(
        process.env.NEXT_PUBLIC_API_V1_AUTH_REGISTER || '',
        userData
      );

      if (response.data.success) {
        toast.success(response.data.message);
        return true;
      } else {
        toast.error(
          response.data.message ||
            'Error en el registro. Por favor, intenta nuevamente.'
        );
        return false;
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error en el registro. Por favor, intenta nuevamente.');
      }
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
    getUserDetails,
    updateUser,
    signUp
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook personalizado para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook personalizado para obtener detalles del usuario
export function useUserDetails() {
  const { getUserDetails, user } = useAuth();

  const fetchUserDetails = async () => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    return await getUserDetails(token);
  };

  return {
    user,
    fetchUserDetails,
    getUserDetails
  };
}
