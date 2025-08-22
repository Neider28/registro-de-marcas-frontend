'use client';

import { useUserDetails } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { toast } from 'sonner';
import { RefreshCw, User } from 'lucide-react';

export function UserProfile() {
  const { user, fetchUserDetails } = useUserDetails();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshUser = async () => {
    try {
      setIsRefreshing(true);
      const updatedUser = await fetchUserDetails();

      if (updatedUser) {
        toast.success('Perfil actualizado correctamente');
      } else {
        toast.error('No se pudo actualizar el perfil');
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      toast.error('Error al actualizar el perfil');
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Perfil de Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>No hay usuario autenticado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Perfil de Usuario</CardTitle>
        <Button
          variant='outline'
          size='sm'
          onClick={handleRefreshUser}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          Actualizar
        </Button>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-center space-x-4'>
          <Avatar className='h-16 w-16'>
            <AvatarImage src={user.avatar} alt={user.name || user.email} />
            <AvatarFallback className='bg-primary/10 text-primary text-lg'>
              {user.name ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                <User className='h-6 w-6' />
              )}
            </AvatarFallback>
          </Avatar>
          <div className='space-y-1'>
            <h3 className='text-lg font-semibold'>{user.name || 'Usuario'}</h3>
            <p className='text-muted-foreground'>{user.email}</p>
            <p className='text-muted-foreground text-sm'>ID: {user.id}</p>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4 pt-4'>
          <div className='space-y-2'>
            <label className='text-muted-foreground text-sm font-medium'>
              Nombre
            </label>
            <p className='text-sm'>{user.name || 'No especificado'}</p>
          </div>
          <div className='space-y-2'>
            <label className='text-muted-foreground text-sm font-medium'>
              Email
            </label>
            <p className='text-sm'>{user.email}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
