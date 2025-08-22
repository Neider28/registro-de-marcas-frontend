import { Icons } from '@/components/icons';

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  status_code: number;
  message: string;
  timestamp: string;
  data: T;
  error: string | null;
}

// Tipos específicos para diferentes endpoints
export interface LoginResponseData {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface Trademark {
  logo: string | null;
  marca: string;
  titular: string;
  id: number;
  estado: string;
}

export interface User {
  avatar: string | null;
  created_at: string;
  email: string;
  first_name: string;
  id: number;
  is_active: boolean;
  last_name: string;
  role: string;
  updated_at: string;
}
