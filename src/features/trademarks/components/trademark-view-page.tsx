import TrademarkForm from './trademark-form';

type TTrademarkViewPageProps = {
  trademarkId: string;
};

export default async function TrademarkViewPage({
  trademarkId
}: TTrademarkViewPageProps) {
  let pageTitle = 'Crear Registro de Marca';

  if (trademarkId !== 'new') {
    pageTitle = `Editar Registro de Marca`;
  }

  return <TrademarkForm trademarkId={trademarkId} pageTitle={pageTitle} />;
}
