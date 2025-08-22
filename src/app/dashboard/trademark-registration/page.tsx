import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import TrademarkListingPage from '@/features/trademarks/components/trademark-listing';
import { cn } from '@/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';

export const metadata = {
  title: 'Dashboard: Registro de Marcas'
};

export default async function Page() {
  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Registro de Marcas'
            description='Gestiona tus marcas: crea, edita y controla todos tus registros en un solo lugar.'
          />
          <Link
            href='/dashboard/trademark-registration/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <IconPlus className='h-4 w-4' /> Agregar Nueva Marca
          </Link>
        </div>
        <Separator />
        <TrademarkListingPage />
      </div>
    </PageContainer>
  );
}
