import { NavItem } from '@/types';

export type Trademark = {
  logo: string;
  marca: string;
  titular: string;
  id: number;
  estado: string;
};

export const navItems: NavItem[] = [
  {
    title: 'Registro de Marcas',
    url: '/dashboard/trademark-registration',
    icon: 'trademark',
    shortcut: ['m', 'm'],
    isActive: false,
    items: [] // No child items
  }
];
