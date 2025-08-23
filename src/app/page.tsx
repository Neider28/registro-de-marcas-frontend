'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // Si está autenticado, redirigir a trademark-registration
        router.push('/dashboard/trademark-registration');
      } else {
        // Si no está autenticado, redirigir al login
        router.push('/auth/sign-in');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className='bg-background flex min-h-screen items-center justify-center'>
        <div className='border-primary h-12 w-12 animate-spin rounded-full border-b-2'></div>
      </div>
    );
  }

  // No renderizar nada mientras se redirige
  return null;
}
