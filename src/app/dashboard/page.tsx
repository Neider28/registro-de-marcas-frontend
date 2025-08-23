'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir automáticamente a trademark-registration
    router.push('/dashboard/trademark-registration');
  }, [router]);

  // Mostrar loading mientras se redirige
  return (
    <div className='bg-background flex min-h-screen items-center justify-center'>
      <div className='border-primary h-12 w-12 animate-spin rounded-full border-b-2'></div>
    </div>
  );
}
