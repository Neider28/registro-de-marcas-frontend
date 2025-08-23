import { useState, useEffect, useRef } from 'react';
import { api } from '@/config/axios';
import { ApiResponse, Trademark } from '@/types';

export const useTrademarkById = (id: string | number | null) => {
  const [trademark, setTrademark] = useState<Trademark | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    // Si el id es 'new' o no es un número válido, no hacer la llamada
    if (!id || id === 'new' || isNaN(Number(id))) {
      setTrademark(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    // Evitar peticiones duplicadas
    if (isFetchingRef.current) {
      return;
    }

    const fetchTrademark = async () => {
      try {
        isFetchingRef.current = true;
        setIsLoading(true);
        setError(null);

        const response = await api.get<ApiResponse<Trademark>>(
          `${process.env.NEXT_PUBLIC_API_TRADEMARK || ''}/${id}`
        );

        if (response.data.success) {
          setTrademark(response.data.data);
        } else {
          setError(response.data.message || 'Error al cargar la marca');
        }
      } catch (error: any) {
        if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else if (error.response?.status === 404) {
          setError('Marca no encontrada');
        } else if (error.response?.status === 401) {
          setError('No autorizado. Por favor inicia sesión nuevamente.');
        } else {
          setError('Error al cargar la marca. Por favor intenta nuevamente.');
        }
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    };

    fetchTrademark();
  }, [id]);

  const refetch = async () => {
    // Resetear el flag para permitir refetch manual
    isFetchingRef.current = false;

    // Si el id es 'new' o no es un número válido, no hacer la llamada
    if (!id || id === 'new' || isNaN(Number(id))) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get<ApiResponse>(
        `${process.env.NEXT_PUBLIC_API_TRADEMARK || ''}${id}`
      );

      if (response.data.success) {
        setTrademark(response.data.data);
      } else {
        setError(response.data.message || 'Error al cargar la marca');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 404) {
        setError('Marca no encontrada');
      } else if (error.response?.status === 401) {
        setError('No autorizado. Por favor inicia sesión nuevamente.');
      } else {
        setError('Error al cargar la marca. Por favor intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    trademark,
    isLoading,
    error,
    refetch
  };
};
