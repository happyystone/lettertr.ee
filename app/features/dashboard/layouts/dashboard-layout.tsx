import { Outlet, redirect } from 'react-router';

import { ModeToggle } from '@/common/components/mode-toggle';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/common/components/ui/sidebar';
import { Separator } from '@/common/components/ui/separator';
import { auth } from '@/lib/auth/auth-server';

import { AppSidebar } from '../components/app-sidebar';
import { EmailCopy } from '../components/email-copy';
import type { Route } from './+types/dashboard-layout';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const session = await auth.api.getSession({
    headers: request.headers,
    query: { disableCookieCache: true },
  });

  if (!session?.user) {
    throw redirect('/auth/sign-in');
  }
  const cookie = request.headers.get('Cookie');

  return {
    user: session?.user,
    sidebarOpen: cookie?.includes('sidebar_state') ? cookie.includes('sidebar_state=true') : true,
  };
};

export default function DashboardLayout({ loaderData }: Route.ComponentProps) {
  return (
    <SidebarProvider defaultOpen={loaderData.sidebarOpen}>
      <AppSidebar />
      <SidebarInset>
        <div className="@container">
          <div className="mx-auto w-full">
            <header className="flex flex-wrap items-center gap-3 border-b p-3 transition-all ease-linear">
              <div className="flex flex-1 items-center gap-2">
                <SidebarTrigger className="rounded-full" />
                {/* <div className="max-lg:hidden lg:contents">
                  <Separator
                    orientation="vertical"
                    className="me-2 data-[orientation=vertical]:h-4"
                  />
                  <DynamicBreadcrumb />
                </div> */}
                <Separator
                  orientation="vertical"
                  className="me-2 data-[orientation=vertical]:h-4"
                />
                <EmailCopy
                  email={loaderData.user.lettertreeEmail}
                  isOnboarded={loaderData.user.isOnboarded || false}
                  userId={loaderData.user.id}
                />
              </div>
              <ModeToggle />
            </header>
            <div className="overflow-hidden">
              <div className="p-6">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
