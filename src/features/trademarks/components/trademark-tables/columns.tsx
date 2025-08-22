'use client';
import { Badge } from '@/components/ui/badge';
import { Trademark } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, GalleryVerticalEnd, XCircle } from 'lucide-react';
import Image from 'next/image';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Trademark>[] = [
  {
    accessorKey: 'logo',
    header: 'Logo',
    size: 64,
    cell: ({ row }) => {
      return (
        <div className='relative h-12 w-12'>
          {row.getValue('logo') !== null ? (
            <Image
              src={row.getValue('logo')}
              alt={row.getValue('marca')}
              fill
              className='rounded-lg'
            />
          ) : (
            <div className='bg-primary/10 flex h-full w-full items-center justify-center rounded-lg p-3'>
              <GalleryVerticalEnd className='text-primary h-6 w-6' />
            </div>
          )}
        </div>
      );
    },
    meta: {
      label: 'Logo'
    }
  },
  {
    id: 'marca',
    accessorKey: 'marca',
    header: 'Marca',
    cell: ({ cell }) => <div>{cell.getValue<Trademark['marca']>()}</div>,
    enableColumnFilter: true,
    meta: {
      label: 'Marca'
    }
  },
  {
    accessorKey: 'titular',
    header: 'Titular',
    meta: {
      label: 'Titular'
    }
  },
  {
    id: 'estado',
    accessorKey: 'estado',
    header: 'Estado',
    cell: ({ cell }) => {
      const status = (cell.getValue() as string) || '';
      const normalized = status.toString().toLowerCase();
      const isActive = normalized === 'activo' || normalized === 'active';
      const Icon = isActive ? CheckCircle2 : XCircle;

      return (
        <Badge
          variant='outline'
          className={`${isActive ? 'border-green-200 bg-green-100 text-green-700' : 'border-red-200 bg-red-100 text-red-700'} inline-flex items-center text-sm capitalize`}
        >
          <Icon
            className={`${isActive ? 'text-green-600' : 'text-red-600'} h-6 w-6`}
          />
          {status}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Estado'
    }
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
