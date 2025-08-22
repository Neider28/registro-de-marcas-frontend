import { GalleryVerticalEnd } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Skeleton } from './skeleton';

const AvatarLogo = ({
  logo,
  marca,
  isLoading,
  onLogoChange
}: {
  logo: any;
  marca: string;
  isLoading: boolean;
  onLogoChange: (value: any) => void;
}) => {
  const getLogoForPreview = () => {
    if (!logo) return null;

    // Si es un File o array de Files, convertirlo a base64 para preview
    if (logo instanceof File) {
      return URL.createObjectURL(logo);
    }

    if (Array.isArray(logo) && logo[0] instanceof File) {
      return URL.createObjectURL(logo[0]);
    }

    // Si es un string (base64), retornarlo tal como está
    if (typeof logo === 'string' && logo.length > 0) {
      return logo;
    }

    return null;
  };

  const getInitials = (marca: string) => {
    if (!marca) return 'L';
    return marca.charAt(0).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className='flex flex-col items-center space-y-4'>
        <Skeleton className='h-48 w-48 rounded-full' />
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-3 w-32' />
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center space-y-4'>
      <div className='group relative cursor-pointer'>
        <Avatar className='border-muted group-hover:border-primary/50 h-48 w-48 border-4 shadow-lg transition-all duration-200'>
          {getLogoForPreview() ? (
            <AvatarImage
              src={getLogoForPreview()!}
              alt={`Logo de ${marca}`}
              className='object-cover'
            />
          ) : null}
          <AvatarFallback className='bg-primary/10 text-primary border-primary/20 border-2 text-4xl font-bold'>
            {getInitials(marca)}
          </AvatarFallback>
        </Avatar>

        {/* Overlay de cambio de logo - aparece al hacer hover */}
        <div className='absolute inset-0 flex items-center justify-center opacity-0 opacity-100 transition-opacity duration-200'>
          <div className='rounded-full bg-black/50 p-3 backdrop-blur-sm'>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-white/90'>
              <GalleryVerticalEnd className='h-4 w-4 text-black' />
            </div>
          </div>
        </div>

        {/* Click handler invisible que cubre toda el área del avatar */}
        <div
          className='absolute inset-0 h-full w-full cursor-pointer'
          onClick={() => {
            // Crear un input file oculto
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.multiple = false;
            input.onchange = (e) => {
              const target = e.target as HTMLInputElement;
              if (target.files && target.files[0]) {
                onLogoChange([target.files[0]]);
              }
            };
            input.click();
          }}
        />
      </div>
    </div>
  );
};

export { AvatarLogo };
