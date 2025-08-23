'use client';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import * as z from 'zod';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

export const metadata: Metadata = {
  title: 'InnovaBrands | Registrarse',
  description: 'Página de registro para la aplicación.'
};

// Schema de validación con Zod
const signUpFormSchema = z.object({
  first_name: z
    .string()
    .min(1, { message: 'El nombre es requerido' })
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  last_name: z
    .string()
    .min(1, { message: 'El apellido es requerido' })
    .min(2, { message: 'El apellido debe tener al menos 2 caracteres' }),
  email: z
    .string()
    .min(1, { message: 'El correo electrónico es requerido' })
    .email({ message: 'Ingresa un correo electrónico válido' }),
  password: z
    .string()
    .min(1, { message: 'La contraseña es requerida' })
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
});

type SignUpFormData = z.infer<typeof signUpFormSchema>;

export default function SignUpViewPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();

  // Configuración del formulario con React Hook Form y Zod
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: ''
    },
    mode: 'onSubmit'
  });

  // Función de submit
  async function onSubmit(values: SignUpFormData) {
    try {
      setIsSubmitting(true);

      // Usar la función de login del contexto
      const success = await signUp(values);

      if (!success) {
        // El error ya se maneja en el contexto
        setIsSubmitting(false);
      }

      router.push('/auth/sign-in');
    } catch (error) {
      toast.error('Error inesperado en el registro');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <Link
        href='/auth/sign-in'
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute top-4 right-4 hidden md:top-8 md:right-8'
        )}
      >
        Iniciar Sesión
      </Link>
      <div className='bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r'>
        <div className='absolute inset-0 bg-zinc-900' />
        <div className='relative z-20 flex items-center text-lg font-medium'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='mr-2 h-6 w-6'
          >
            <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
          </svg>
          InnovaBrands
        </div>
        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>
              &ldquo;InnovaBrands es una empresa que se dedica a la creación de
              marcas y productos de alta calidad.&rdquo;
            </p>
            <footer className='text-sm'>InnovaBrands</footer>
          </blockquote>
        </div>
      </div>
      <div className='flex h-full items-center justify-center p-4'>
        <div className='flex w-full max-w-md flex-col items-center justify-center space-y-6'>
          <Card className='w-full py-14'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
              >
                <CardHeader className='space-y-1'>
                  <CardTitle className='text-center text-2xl'>
                    Crear Cuenta
                  </CardTitle>
                  <CardDescription className='text-center'>
                    Completa el formulario para crear tu cuenta
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='first_name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-1'>
                          Nombre
                          <span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Tu nombre'
                            autoComplete='given-name'
                            {...field}
                            className={
                              form.formState.errors.first_name
                                ? 'border-red-500 focus:border-red-500'
                                : ''
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
                        <FormLabel className='flex items-center gap-1'>
                          Apellido
                          <span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Tu apellido'
                            autoComplete='family-name'
                            {...field}
                            className={
                              form.formState.errors.last_name
                                ? 'border-red-500 focus:border-red-500'
                                : ''
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-1'>
                          Correo electrónico
                          <span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='tucorreo@email.com'
                            type='email'
                            autoComplete='email'
                            {...field}
                            className={
                              form.formState.errors.email
                                ? 'border-red-500 focus:border-red-500'
                                : ''
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-1'>
                          Contraseña
                          <span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <Input
                              placeholder='••••••••'
                              type={showPassword ? 'text' : 'password'}
                              autoComplete='new-password'
                              {...field}
                              className={
                                form.formState.errors.password
                                  ? 'border-red-500 focus:border-red-500'
                                  : ''
                              }
                            />
                            <Button
                              type='button'
                              variant='ghost'
                              size='icon'
                              className='absolute top-0 right-0 h-full border-none px-3 py-2 hover:bg-transparent'
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className='h-4 w-4' />
                              ) : (
                                <Eye className='h-4 w-4' />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className='flex flex-col space-y-3'>
                  <Button
                    className='w-full'
                    variant='default'
                    size='lg'
                    type='submit'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
                  </Button>
                  <div className='mt-4 text-center text-sm'>
                    ¿Ya tienes una cuenta?{' '}
                    <Link
                      href='/auth/sign-in'
                      className='text-primary font-medium hover:underline'
                    >
                      Inicia sesión aquí
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}
