import { Metadata } from 'next';
import SignUpViewPage from '@/features/auth/components/sign-up-view';

export const metadata: Metadata = {
  title: 'InnovaBrands | Crear cuenta',
  description: 'Página de creación de cuenta'
};

export default async function Page() {
  return <SignUpViewPage />;
}
