import { Outlet } from 'react-router';

import { Navbar } from '@/features/marketing/components/navbar';
import { FooterSection } from '@/features/marketing/components/sections/footer';
import type { Route } from './+types/marketing-layout';
import { auth } from '@/lib/auth/auth-server';

export async function loader({ request }: Route.LoaderArgs) {
  const session = await auth.api.getSession({
    headers: request.headers,
    query: { disableCookieCache: true },
  });

  return { user: session?.user };
}

export default function MarketingLayout({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <Navbar user={loaderData.user || null} />
      <Outlet />
      <FooterSection />
    </>
  );
}
