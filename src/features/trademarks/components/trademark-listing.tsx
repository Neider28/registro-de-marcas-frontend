'use client';
import { TrademarkTable } from './trademark-tables';
import { columns } from './trademark-tables/columns';
import { useTrademarks } from '@/hooks/use-trademarks';

export default function TrademarkListingPage() {
  const { trademarks, isLoading, error, refetch } = useTrademarks();

  if (isLoading) {
    return (
      <div className='flex min-h-[400px] items-center justify-center gap-2'>
        <div className='border-primary h-8 w-8 animate-spin rounded-full border-b-2'></div>
        <span className='text-muted-foreground ml-2'>Cargando marcas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex min-h-[400px] flex-col items-center justify-center text-center'>
        <div className='mb-4 text-red-500'>
          <svg
            className='mx-auto h-12 w-12'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
            />
          </svg>
        </div>
        <h3 className='mb-2 text-lg font-semibold'>Error al cargar marcas</h3>
        <p className='text-muted-foreground mb-4'>{error}</p>
        <button
          onClick={refetch}
          className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 transition-colors'
        >
          Intentar nuevamente
        </button>
      </div>
    );
  }

  return (
    <TrademarkTable
      data={trademarks}
      totalItems={trademarks.length}
      columns={columns}
    />
  );
}
