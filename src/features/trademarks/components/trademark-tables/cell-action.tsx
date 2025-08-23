'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { api } from '@/config/axios';
import { ApiResponse, Trademark } from '@/types';
import { refetchTrademarks } from '@/hooks/use-trademarks';
import { IconEdit, IconDotsVertical, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface CellActionProps {
  data: Trademark;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    try {
      setLoading(true);

      const response = await api.delete<
        ApiResponse<{ id: number; deleted: boolean }>
      >(`${process.env.NEXT_PUBLIC_API_TRADEMARK || ''}/${data.id}`);

      toast.success(response.data.message);

      setOpen(false);

      // Volver a cargar las marcas para actualizar la tabla usando la función global
      if (response.data.success) {
        await refetchTrademarks();
      }
    } catch (error: any) {
      // Mostrar toast de error
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 404) {
        toast.error('Marca no encontrada');
      } else if (error.response?.status === 401) {
        toast.error('No autorizado. Por favor inicia sesión nuevamente.');
      } else {
        toast.error(
          'Error al eliminar la marca. Por favor intenta nuevamente.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Abrir menú</span>
            <IconDotsVertical className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() =>
              router.push(`/dashboard/trademark-registration/${data.id}`)
            }
          >
            <IconEdit className='h-4 w-4' /> Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <IconTrash className='h-4 w-4' /> Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
