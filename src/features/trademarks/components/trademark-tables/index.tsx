'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';

interface TrademarkTableParams<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
}

export function TrademarkTable<TData, TValue>({
  data,
  columns
}: TrademarkTableParams<TData, TValue>) {
  const { table } = useDataTable({
    data,
    columns,
    shallow: false,
    debounceMs: 500
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
