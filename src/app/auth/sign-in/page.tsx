import { Metadata } from 'next';
import SignInViewPage from '@/features/auth/components/sign-in-view';

export const metadata: Metadata = {
  title: 'InnovaBrands | Iniciar Sesión',
  description: 'Página de inicio de sesión para la aplicación.'
};

export default function Page() {
  return <SignInViewPage />;
}
