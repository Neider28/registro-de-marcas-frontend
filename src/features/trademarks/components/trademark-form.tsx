'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, User } from 'lucide-react';
import * as z from 'zod';
import React from 'react';
import { api } from '@/config/axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { refetchTrademarks } from '@/hooks/use-trademarks';
import { useTrademarkById } from '@/hooks/use-trademark-by-id';
import { AvatarLogo } from '@/components/ui/avatar-logo';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

const formSchema = z.object({
  logo: z
    .any()
    .optional()
    .refine((files) => {
      // Si no hay logo, es válido
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
    }, `Max file size is 5MB.`),
  marca: z.string().min(1, {
    message: 'Campo requerido'
  }),
  titular: z.string().min(1, {
    message: 'Campo requerido'
  })
});

type TrademarkRegistration = z.infer<typeof formSchema>;

const steps = [
  {
    id: 1,
    title: 'Información de la Marca',
    description: 'Completa los datos de la marca'
  },
  {
    id: 2,
    title: 'Información del Titular',
    description: 'Completa los datos del propietario de la marca'
  },
  { id: 3, title: 'Logo', description: 'Sube el logotipo asociado a la marca' },
  {
    id: 4,
    title: 'Resumen',
    description: 'Revisa y confirma la información registrada'
  }
];

export default function TrademarkForm({
  trademarkId,
  pageTitle
}: {
  trademarkId: string;
  pageTitle: string;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Usar el hook para cargar datos si no es 'new'
  const { trademark, isLoading, error } = useTrademarkById(trademarkId);

  // Función para procesar datos iniciales y convertir base64 a File
  const processInitialData = (data: any | null) => {
    if (!data) return { marca: '', titular: '', logo: null };

    return {
      marca: data.marca || '',
      titular: data.titular || '',
      logo: data.logo // Conservar el valor original
    };
  };

  // Separate state for each field to prevent cross-contamination
  const [fieldValues, setFieldValues] = useState(() =>
    processInitialData(null)
  );

  // Actualizar fieldValues cuando se cargan los datos de la API
  useEffect(() => {
    if (trademark && trademarkId !== 'new') {
      setFieldValues(processInitialData(trademark));
    }
  }, [trademark, trademarkId]);

  // Cleanup para URLs de objeto
  useEffect(() => {
    return () => {
      // Limpiar URLs de objeto cuando el componente se desmonta
      if (fieldValues.logo instanceof File) {
        URL.revokeObjectURL(URL.createObjectURL(fieldValues.logo));
      }
      if (
        Array.isArray(fieldValues.logo) &&
        fieldValues.logo[0] instanceof File
      ) {
        URL.revokeObjectURL(URL.createObjectURL(fieldValues.logo[0]));
      }
    };
  }, [fieldValues.logo]);

  const defaultValues = {
    marca: fieldValues.marca,
    titular: fieldValues.titular,
    logo: fieldValues.logo
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues,
    mode: 'onChange'
  });

  // Update form values when fieldValues change
  React.useEffect(() => {
    form.reset(fieldValues);
  }, [fieldValues, form]);

  // Sync form values with fieldValues before submit
  React.useEffect(() => {
    if (currentStep === 4) {
      // Asegurar que el formulario tenga los valores más recientes
      form.setValue('marca', fieldValues.marca);
      form.setValue('titular', fieldValues.titular);
      form.setValue('logo', fieldValues.logo);

      // Trigger validation para asegurar que no hay errores
      form.trigger();
    }
  }, [currentStep, fieldValues, form]);

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

  async function onSubmit(values: TrademarkRegistration) {
    try {
      setIsSubmitting(true);

      // Validar que el formulario sea válido antes de proceder
      const isValid = await form.trigger();

      if (!isValid) {
        toast.error(
          'Por favor corrige los errores en el formulario antes de continuar.'
        );
        return;
      }

      // 👉 Convierte el archivo a base64 si existe
      const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      };

      let logoBase64: string | null = null;

      // Manejar diferentes tipos de logo
      if (values.logo) {
        if (
          typeof values.logo === 'string' &&
          values.logo.startsWith('data:image')
        ) {
          // Si ya es base64, usarlo tal como está
          logoBase64 = values.logo;
        } else if (values.logo instanceof File) {
          // Si es un archivo individual, convertirlo
          logoBase64 = await convertToBase64(values.logo);
        } else if (
          Array.isArray(values.logo) &&
          values.logo[0] instanceof File
        ) {
          // Si es un array de archivos, convertir el primero
          logoBase64 = await convertToBase64(values.logo[0]);
        }
      }

      // Prepara los datos JSON con base64
      const jsonData = {
        parameter: {
          marca: values.marca,
          titular: values.titular,
          estado: 'activo',
          logo: logoBase64
        }
      };

      // Determinar si es creación o edición
      const isEditing = trademarkId !== 'new';

      if (isEditing) {
        // Edición - usar PATCH
        await api.patch(
          `${process.env.NEXT_PUBLIC_API_TRADEMARK || ''}${trademarkId}`,
          jsonData
        );
        toast.success('Marca actualizada exitosamente');
      } else {
        // Creación - usar POST
        await api.post(process.env.NEXT_PUBLIC_API_TRADEMARK || '', jsonData);
        toast.success('Marca registrada exitosamente');
      }

      await refetchTrademarks();

      router.push('/dashboard/trademark-registration');
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 422) {
        toast.error(
          'Error de validación. Por favor revisa los datos ingresados.'
        );
      } else if (error.response?.status === 401) {
        toast.error('No autorizado. Por favor inicia sesión nuevamente.');
      } else {
        toast.error(
          `Error al ${trademarkId !== 'new' ? 'actualizar' : 'registrar'} la marca. Por favor intenta nuevamente.`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const nextStep = () => {
    // Validate current step before proceeding using local state
    if (currentStep === 1) {
      const marcaValue = fieldValues.marca;
      if (!marcaValue || marcaValue.trim().length === 0) {
        form.setError('marca', { message: 'Campo requerido' });
        return;
      }
      // Clear any previous errors for marca
      form.clearErrors('marca');
    }

    if (currentStep === 2) {
      const titularValue = fieldValues.titular;
      if (!titularValue || titularValue.trim().length === 0) {
        form.setError('titular', { message: 'Campo requerido' });
        return;
      }
      // Clear any previous errors for titular
      form.clearErrors('titular');
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Validate all fields before allowing submit
  const canSubmit = () => {
    const hasRequiredFields =
      fieldValues.marca.trim() !== '' && fieldValues.titular.trim() !== '';

    // Verificar que no haya errores de validación en el formulario
    const hasNoFormErrors = Object.keys(form.formState.errors).length === 0;

    return hasRequiredFields && hasNoFormErrors;
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === steps.length;

  // Mostrar error si hay un problema cargando los datos
  if (error) {
    return (
      <Card className='mx-auto mb-4 w-full'>
        <CardContent className='pt-6'>
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
            <h3 className='mb-2 text-lg font-semibold'>
              Error al cargar la marca
            </h3>
            <p className='text-muted-foreground mb-4'>{error}</p>
            <Button
              onClick={() => router.back()}
              className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 transition-colors'
            >
              Volver
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='marca'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center gap-2'>
                    Marca a Registrar
                    <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className='h-9 w-full' />
                    ) : (
                      <Input
                        placeholder='Ej: InnovaBrands'
                        value={fieldValues.marca}
                        onChange={(e) => {
                          updateFieldValue('marca', e.target.value);
                          field.onChange(e.target.value);
                        }}
                        className={
                          form.formState.errors.marca
                            ? 'border-red-500 focus:border-red-500'
                            : ''
                        }
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case 2:
        return (
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='titular'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center gap-2'>
                    Titular de la Marca
                    <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className='h-10 w-full' />
                    ) : (
                      <Input
                        placeholder='Ej: Neider Silva'
                        value={fieldValues.titular}
                        onChange={(e) => {
                          updateFieldValue('titular', e.target.value);
                          field.onChange(e.target.value);
                        }}
                        className={
                          form.formState.errors.titular
                            ? 'border-red-500 focus:border-red-500'
                            : ''
                        }
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case 3:
        return (
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='logo'
              render={({ field }) => (
                <div className='space-y-6'>
                  {isLoading ? (
                    <div className='flex justify-center'>
                      <Skeleton className='h-32 w-32 rounded-full' />
                    </div>
                  ) : (
                    <div className='flex flex-col items-center space-y-6'>
                      <AvatarLogo
                        logo={fieldValues.logo}
                        marca={fieldValues.marca}
                        isLoading={isLoading}
                        onLogoChange={(value) => {
                          updateFieldValue('logo', value);
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
                </div>
              )}
            />
          </div>
        );
      case 4:
        return (
          <div className='space-y-6'>
            {/* Single Summary Card */}
            <div className='bg-muted/50 rounded-lg border p-8'>
              <div className='flex items-start gap-8'>
                {/* Logo Section - Left Side */}
                <div className='flex-shrink-0'>
                  {isLoading ? (
                    <Skeleton className='h-48 w-48 rounded-full' />
                  ) : fieldValues.logo ? (
                    <Avatar className='border-primary/20 h-48 w-48 border-4 shadow-lg'>
                      {(() => {
                        if (
                          typeof fieldValues.logo === 'string' &&
                          fieldValues.logo.startsWith('data:image')
                        ) {
                          return (
                            <AvatarImage
                              src={fieldValues.logo}
                              alt='Logo'
                              className='object-cover'
                            />
                          );
                        }
                        if (
                          fieldValues.logo instanceof File ||
                          (Array.isArray(fieldValues.logo) &&
                            fieldValues.logo[0] instanceof File)
                        ) {
                          const file = Array.isArray(fieldValues.logo)
                            ? fieldValues.logo[0]
                            : fieldValues.logo;
                          return (
                            <AvatarImage
                              src={URL.createObjectURL(file)}
                              alt='Logo'
                              className='object-cover'
                            />
                          );
                        }
                        return null;
                      })()}
                      <AvatarFallback className='bg-primary/10 text-primary border-primary/20 border-2 text-6xl font-bold'>
                        {fieldValues.marca
                          ? fieldValues.marca.charAt(0).toUpperCase()
                          : 'L'}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className='bg-muted/50 border-muted-foreground/30 flex h-48 w-48 items-center justify-center rounded-full border-4 border-dashed'>
                      <User className='text-muted-foreground h-24 w-24' />
                    </div>
                  )}

                  {/* Logo Status */}
                  <div className='mt-4 text-center'>
                    <h4 className='mb-1 text-sm font-medium'>
                      Logo de la Marca
                    </h4>
                    {isLoading ? (
                      <Skeleton className='mx-auto h-4 w-32' />
                    ) : fieldValues.logo ? (
                      <span className='text-muted-foreground bg-primary/10 rounded-full px-3 py-1 text-xs'>
                        {typeof fieldValues.logo === 'string'
                          ? 'Logo existente cargado'
                          : 'Archivo seleccionado'}
                      </span>
                    ) : (
                      <span className='text-muted-foreground bg-muted rounded-full px-3 py-1 text-xs'>
                        No se ha cargado ningún logo
                      </span>
                    )}
                  </div>
                </div>

                {/* Information Section - Right Side */}
                <div className='flex-1 space-y-6'>
                  {/* Marca Section */}
                  <div className='bg-primary/5 rounded-lg border p-6'>
                    <div className='flex items-center gap-4'>
                      <div className='flex-1'>
                        <h4 className='text-foreground mb-2 text-lg font-semibold'>
                          Marca a Registrar
                        </h4>
                        {isLoading ? (
                          <Skeleton className='h-8 w-64' />
                        ) : (
                          <p className='text-foreground text-2xl font-bold'>
                            {fieldValues.marca || 'No especificada'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Titular Section */}
                  <div className='bg-primary/5 rounded-lg border p-6'>
                    <div className='flex items-center gap-4'>
                      <div className='flex-1'>
                        <h4 className='text-foreground mb-2 text-lg font-semibold'>
                          Titular de la Marca
                        </h4>
                        {isLoading ? (
                          <Skeleton className='h-8 w-56' />
                        ) : (
                          <p className='text-foreground text-2xl font-bold'>
                            {fieldValues.titular || 'No especificado'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className='bg-primary/5 border-primary/20 rounded-lg border p-4'>
                    <div className='flex items-center gap-3'>
                      <div className='bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full'>
                        <Check className='text-primary h-4 w-4' />
                      </div>
                      <div>
                        <p className='text-primary text-sm font-medium'>
                          Información lista para{' '}
                          {trademarkId !== 'new' ? 'actualizar' : 'registrar'}
                        </p>
                        <p className='text-muted-foreground text-xs'>
                          Revisa que todos los datos sean correctos antes de
                          continuar
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className='mx-auto mb-4 w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>

        {/* Stepper Header */}
        <div className='mt-6'>
          <div className='flex items-center justify-center'>
            {steps.map((step, index) => (
              <div key={step.id} className='flex items-center'>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    currentStep > step.id
                      ? 'bg-primary border-primary text-primary-foreground'
                      : currentStep === step.id
                        ? 'border-primary text-primary'
                        : 'border-muted-foreground text-muted-foreground'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className='h-4 w-4' />
                  ) : (
                    step.id
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 w-16 ${
                      currentStep > step.id ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className='mt-4 text-center'>
            <h3 className='font-medium'>{steps[currentStep - 1].title}</h3>
            <p className='text-muted-foreground text-sm'>
              {steps[currentStep - 1].description}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className='flex justify-between pt-6'>
              <Button
                type='button'
                variant='outline'
                onClick={prevStep}
                disabled={isFirstStep || isLoading}
                className='flex items-center gap-2'
              >
                <ChevronLeft className='h-4 w-4' />
                Atrás
              </Button>

              <div className='flex gap-2'>
                {!isLastStep ? (
                  <Button
                    type='button'
                    onClick={nextStep}
                    disabled={isLoading}
                    className='flex items-center gap-2'
                  >
                    Siguiente
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                ) : (
                  <div className='flex gap-2'>
                    <Button
                      type='submit'
                      disabled={isSubmitting || !canSubmit() || isLoading}
                      className='flex items-center gap-2'
                    >
                      {isSubmitting ? (
                        <>
                          <div className='mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white' />
                          {trademarkId !== 'new'
                            ? 'Actualizando...'
                            : 'Creando...'}
                        </>
                      ) : trademarkId !== 'new' ? (
                        'Actualizar'
                      ) : (
                        'Crear'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
