'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
  title: string;
  link: string;
};

type RoutePattern = {
  pattern: RegExp;
  breadcrumbs: (params: Record<string, string>) => BreadcrumbItem[];
};

// This allows to add custom title as well
const routePatterns: RoutePattern[] = [
  {
    pattern: /^\/dashboard$/,
    breadcrumbs: () => [{ title: 'Dashboard', link: '/dashboard' }]
  },
  {
    pattern: /^\/dashboard\/trademark-registration$/,
    breadcrumbs: () => [
      { title: 'Dashboard', link: '/dashboard' },
      { title: 'Registro de Marcas', link: '/dashboard/trademark-registration' }
    ]
  },
  {
    pattern: /^\/dashboard\/trademark-registration\/new$/,
    breadcrumbs: () => [
      { title: 'Dashboard', link: '/dashboard' },
      {
        title: 'Registro de Marcas',
        link: '/dashboard/trademark-registration'
      },
      { title: 'Nuevo', link: '/dashboard/trademark-registration/new' }
    ]
  },
  {
    pattern: /^\/dashboard\/trademark-registration\/([^\/]+)$/,
    breadcrumbs: (params) => [
      { title: 'Dashboard', link: '/dashboard' },
      {
        title: 'Registro de Marcas',
        link: '/dashboard/trademark-registration'
      },
      {
        title: 'Editar',
        link: `/dashboard/trademark-registration/${params.id}`
      }
    ]
  }
];

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Check if we have a pattern that matches this path
    for (const route of routePatterns) {
      const match = pathname.match(route.pattern);
      if (match) {
        // Extract dynamic parameters from the match
        const params: Record<string, string> = {};
        if (route.pattern.toString().includes('([^\\/]+)')) {
          // For the trademark-registration/:id pattern
          params.id = match[1];
        }
        return route.breadcrumbs(params);
      }
    }

    // If no pattern match, fall back to generating breadcrumbs from the path
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path
      };
    });
  }, [pathname]);

  return breadcrumbs;
}
