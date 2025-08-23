import { useState, useEffect } from 'react';
import { api } from '@/config/axios';
import { ApiResponse, Trademark } from '@/types';

// Función global para refetch que puede ser llamada desde cualquier lugar
let globalRefetch: (() => Promise<void>) | null = null;

export const useTrademarks = () => {
  const [trademarks, setTrademarks] = useState<Trademark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrademarks = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get<ApiResponse<Trademark[]>>(
        process.env.NEXT_PUBLIC_API_TRADEMARK || '',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth-token')}`
          }
        }
      );

      if (response.data.success) {
        // Asegurar que siempre sea un array
        setTrademarks(response.data.data || []);
      } else {
        setError(response.data.message || 'Error al cargar las marcas');
        setTrademarks([]); // Establecer array vacío en caso de error
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 404) {
        setError('No se encontraron marcas');
      } else if (error.response?.status === 401) {
        setError('No autorizado. Por favor inicia sesión nuevamente.');
      } else {
        setError('Error al cargar las marcas. Por favor intenta nuevamente.');
      }
      setTrademarks([]); // Establecer array vacío en caso de error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrademarks();
    // Asignar la función global
    globalRefetch = fetchTrademarks;

    // Cleanup
    return () => {
      globalRefetch = null;
    };
  }, []);

  return {
    trademarks,
    isLoading,
    error,
    refetch: fetchTrademarks
  };
};

// Función global para refetch que puede ser llamada desde cualquier lugar
export const refetchTrademarks = () => {
  if (globalRefetch) {
    return globalRefetch();
  }
  return Promise.resolve();
};
