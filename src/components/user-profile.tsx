'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { AvatarLogo } from '@/components/ui/avatar-logo';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { User, Edit, Save, X, Check, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import React from 'react';
import * as z from 'zod';

const MAX_FILE_SIZE = 1000000; // 1MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

const formSchema = z.object({
  avatar: z
    .any()
    .optional()
    .refine((files) => {
      // Si no hay avatar, es válido
      if (!files) return true;

      // Si es un string (base64), es válido
      if (typeof files === 'string') return true;

      // Si es un array de archivos, validar el primer archivo
      if (Array.isArray(files) && files.length > 0) {
        const file = files[0];
        return (
          file.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_TYPES.includes(file.type)
        );
      }

      // Si es un archivo individual, validarlo
      if (files instanceof File) {
        return (
          files.size <= MAX_FILE_SIZE &&
          ACCEPTED_IMAGE_TYPES.includes(files.type)
        );
      }

      return false;
    }, `Tamaño máximo del archivo es 1MB.`),
  first_name: z.string().min(1, {
    message: 'Campo requerido'
  }),
  last_name: z.string().min(1, {
    message: 'Campo requerido'
  })
});

type UserProfileForm = z.infer<typeof formSchema>;

export function UserProfile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Estados para los campos editables
  const [fieldValues, setFieldValues] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    avatar: user?.avatar || null
  });

  // Actualizar fieldValues cuando cambie el usuario
  React.useEffect(() => {
    if (user) {
      setFieldValues({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        avatar: user.avatar || null
      });
    }
  }, [user]);

  const defaultValues = {
    first_name: fieldValues.first_name,
    last_name: fieldValues.last_name,
    avatar: fieldValues.avatar
  };

  const form = useForm<UserProfileForm>({
    resolver: zodResolver(formSchema),
    values: defaultValues,
    mode: 'onChange'
  });

  // Update form values when fieldValues change
  React.useEffect(() => {
    form.reset(fieldValues);
  }, [fieldValues, form]);

  const handleEdit = () => {
    setFieldValues({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      avatar: user?.avatar || null
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFieldValues({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      avatar: user?.avatar || null
    });
    form.reset(defaultValues);
  };

  // Function to update field values
  const updateFieldValue = (
    fieldName: keyof typeof fieldValues,
    value: any
  ) => {
    setFieldValues((prev) => ({
      ...prev,
      [fieldName]: value
    }));

    // También actualizar el formulario inmediatamente
    form.setValue(fieldName, value);

    // Trigger validation para el campo específico
    form.trigger(fieldName);
  };

  async function onSubmit(values: UserProfileForm) {
    try {
      // Validar que el formulario sea válido antes de proceder
      const isValid = await form.trigger();

      if (!isValid) {
        toast.error(
          'Por favor corrige los errores en el formulario antes de continuar.'
        );
        return;
      }

      setIsSaving(true);

      // 👉 Convierte el archivo a base64 si existe
      const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      };

      let avatarBase64: string | null = null;

      // Manejar diferentes tipos de avatar
      if (values.avatar) {
        if (
          typeof values.avatar === 'string' &&
          values.avatar.startsWith('data:image')
        ) {
          // Si ya es base64, usarlo tal como está
          avatarBase64 = values.avatar;
        } else if (
          values.avatar &&
          typeof values.avatar === 'object' &&
          'size' in values.avatar
        ) {
          // Si es un archivo individual, convertirlo
          avatarBase64 = await convertToBase64(values.avatar as File);
        } else if (
          Array.isArray(values.avatar) &&
          values.avatar[0] &&
          typeof values.avatar[0] === 'object' &&
          'size' in values.avatar[0]
        ) {
          // Si es un array de archivos, convertir el primero
          avatarBase64 = await convertToBase64(values.avatar[0] as File);
        }
      }

      const success = await updateUser({
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
        avatar: avatarBase64
      });

      if (success) {
        setIsEditing(false);
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error al actualizar el perfil');
      }
    } finally {
      setIsSaving(false);
    }
  }

  if (!user) {
    return (
      <div className='w-full px-4'>
        <Card>
          <CardHeader>
            <CardTitle>Perfil de Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground'>No hay usuario autenticado</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='w-full px-4'>
      <Card>
        <CardHeader>
          <CardTitle>Perfil de Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-8'>
            <div className='space-y-6'>
              {isEditing ? (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-6'
                  >
                    <div className='space-y-4'>
                      <FormField
                        control={form.control}
                        name='avatar'
                        render={({ field }) => (
                          <div className='flex flex-col items-center space-y-4'>
                            <AvatarLogo
                              logo={fieldValues.avatar}
                              marca={`${fieldValues.first_name} ${fieldValues.last_name}`}
                              isLoading={false}
                              onLogoChange={(value) => {
                                updateFieldValue('avatar', value);
                                field.onChange(value);
                              }}
                            />
                            <div className='max-w-md space-y-2 text-center'>
                              <p className='text-muted-foreground text-sm'>
                                Formatos aceptados: JPG, PNG, WebP
                              </p>
                              <p className='text-muted-foreground text-sm'>
                                Tamaño máximo: 1MB
                              </p>
                            </div>
                          </div>
                        )}
                      />
                    </div>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <FormField
                        control={form.control}
                        name='first_name'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              Nombre
                              <span className='text-red-500'>*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Tu nombre'
                                value={fieldValues.first_name}
                                onChange={(e) => {
                                  updateFieldValue(
                                    'first_name',
                                    e.target.value
                                  );
                                  field.onChange(e.target.value);
                                }}
                                className={
                                  form.formState.errors.first_name
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='last_name'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              Apellido
                              <span className='text-red-500'>*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Tu apellido'
                                value={fieldValues.last_name}
                                onChange={(e) => {
                                  updateFieldValue('last_name', e.target.value);
                                  field.onChange(e.target.value);
                                }}
                                className={
                                  form.formState.errors.last_name
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='flex items-center justify-end space-x-4'>
                      <Button
                        variant='outline'
                        type='button'
                        onClick={handleCancel}
                        disabled={isSaving}
                      >
                        <X className='h-4 w-4' />
                        Cancelar
                      </Button>
                      <Button
                        variant='default'
                        type='submit'
                        disabled={isSaving}
                      >
                        <Save className='h-4 w-4' />
                        {isSaving ? 'Guardando...' : 'Guardar'}
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className='space-y-6'>
                  <div className='relative'>
                    <div className='h-32 rounded-t-xl bg-gradient-to-r from-blue-400 to-purple-500'></div>

                    <div className='absolute -bottom-16 left-4'>
                      <Avatar className='h-32 w-32 border-4 border-white shadow-lg'>
                        <AvatarImage
                          src={user.avatar || ''}
                          alt={user.first_name || user.email}
                        />
                        <AvatarFallback className='bg-secondary text-secondary-foreground text-4xl font-bold'>
                          {user.first_name ? (
                            user.first_name.charAt(0).toUpperCase()
                          ) : (
                            <User className='h-12 w-12' />
                          )}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className='absolute top-4 right-4'>
                      <Button
                        onClick={handleEdit}
                        variant='secondary'
                        size='sm'
                      >
                        <Edit className='mr-2 h-4 w-4' />
                        Editar
                      </Button>
                    </div>
                  </div>
                  <div className='px-4 pt-16'>
                    <div className='flex items-center space-x-2'>
                      <h2 className='text-2xl font-medium'>
                        {user.first_name + ' ' + user.last_name ||
                          'No especificado'}
                      </h2>
                      <div className='flex h-5 w-5 items-center justify-center rounded-full bg-blue-500'>
                        {user.is_active ? (
                          <Check className='h-3 w-3 text-white' />
                        ) : (
                          <X className='h-3 w-3 text-white' />
                        )}
                      </div>
                    </div>
                    <p className='text-muted-foreground mb-2 text-base'>
                      {user.email}
                    </p>
                    <p className='text-muted-foreground mb-2 capitalize'>
                      {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                    </p>
                    <div className='mb-6 flex items-center space-x-6 text-sm text-gray-500'>
                      <div className='flex items-center space-x-1'>
                        <Calendar className='h-4 w-4' />
                        <span>
                          Miembro desde{' '}
                          {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
