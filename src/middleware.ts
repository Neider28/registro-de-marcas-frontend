import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que requieren autenticación (solo las más críticas)
const protectedRoutes = [
  '/profile',
  '/api/protected' // Si tienes APIs protegidas
];

// Rutas de autenticación (no accesibles si ya estás autenticado)
const authRoutes = ['/auth/sign-in', '/auth/sign-up'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Obtener el token de las cookies (accesible en el servidor)
  const token = request.cookies.get('auth-token')?.value;

  // Verificar si la ruta actual requiere autenticación
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Verificar si la ruta actual es de autenticación
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Si es una ruta protegida y no hay token, redirigir a login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/auth/sign-in', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Si es una ruta de auth y hay token, redirigir al dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(
      new URL('/dashboard/trademark-registration', request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
};
