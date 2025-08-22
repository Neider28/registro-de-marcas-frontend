import { NavItem, Trademark } from '@/types';

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
