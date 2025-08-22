import { ProtectedRoute } from '@/components/auth/protected-route';
import AppSidebar from '@/components/layout/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { cookies } from 'next/headers';
import Header from '@/components/layout/header';

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Obtener el estado del sidebar desde las cookies
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <ProtectedRoute>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          {/* page main content */}
          {children}
          {/* page main content ends */}
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
