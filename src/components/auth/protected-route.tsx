'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isRedirecting) {
      setIsRedirecting(true);
      router.push('/auth/sign-in');
    }
  }, [isAuthenticated, isLoading, router, isRedirecting]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      fallback || (
        <div className='bg-background flex min-h-screen items-center justify-center'>
          <div className='border-primary h-12 w-12 animate-spin rounded-full border-b-2'></div>
        </div>
      )
    );
  }

  // Si está redirigiendo, mostrar loading
  if (isRedirecting) {
    return (
      <div className='bg-background flex min-h-screen items-center justify-center'>
        <div className='border-primary h-12 w-12 animate-spin rounded-full border-b-2'></div>
      </div>
    );
  }

  // Si no está autenticado, no renderizar nada (se redirige)
  if (!isAuthenticated) {
    return null;
  }

  // Si está autenticado, mostrar el contenido
  return <>{children}</>;
}
