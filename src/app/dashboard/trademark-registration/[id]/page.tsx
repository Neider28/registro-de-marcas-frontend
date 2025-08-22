import PageContainer from '@/components/layout/page-container';
import TrademarkViewPage from '@/features/trademarks/components/trademark-view-page';

export const metadata = {
  title: 'Dashboard : Vista Registro de Marca'
};

type PageProps = { params: Promise<{ id: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <TrademarkViewPage trademarkId={params.id} />
      </div>
    </PageContainer>
  );
}
