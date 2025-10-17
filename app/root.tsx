import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from 'react-router';
import clsx from 'clsx';
import { ThemeProvider, useTheme, PreventFlashOnWrongTheme } from 'remix-themes';

import { AuthProvider } from '@/common/components/auth-provider';
import { themeSessionResolver } from '@/lib/sessions.server';
import { site } from '@/config/site';
import { generateWebSiteSchema, generateOrganizationSchema } from '@/lib/seo';
import { cn } from '@/lib/utils';

import type { Route } from './+types/root';
import './style/globals.css';

// Return the theme from the session storage using the loader
export const loader = async ({ request }: Route.LoaderArgs) => {
  const { getTheme } = await themeSessionResolver(request);

  return {
    theme: getTheme(),
  };
};

export const links: Route.LinksFunction = () => [
  { rel: 'icon', href: site.favicon, type: 'image/x-icon' },
  { rel: 'shortcut icon', href: site.favicon, type: 'image/x-icon' },
  {
    rel: 'apple-touch-icon',
    sizes: '180x180',
    href: `${process.env.VITE_PUBLIC_APP_URL}/apple-touch-icon.png`,
  },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function App() {
  const data = useLoaderData<typeof loader>();
  const [theme] = useTheme();
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname.includes('/auth');

  // Generate structured data for the entire site
  const websiteSchema = generateWebSiteSchema({
    name: 'Lettertree',
    url: 'https://lettertr.ee',
    description: '뉴스레터를 한 곳에서 발견하고, 구독하고, 깔끔하게 읽어보세요.',
    searchUrl: 'https://lettertr.ee/discover',
  });

  const organizationSchema = generateOrganizationSchema({
    name: 'Lettertree',
    url: 'https://lettertr.ee',
    logo: 'https://lettertr.ee/logo.png',
    description: '뉴스레터 큐레이션 및 구독 관리 플랫폼',
    sameAs: [
      'https://twitter.com/lettertree',
      'https://www.facebook.com/lettertree',
      'https://www.instagram.com/lettertree',
    ],
  });

  return (
    <html lang="ko" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body
        className={cn(
          'flex min-h-svh flex-col antialiased',
          !isHome && 'bg-[#fafafa] dark:bg-[#1b1718]',
        )}
      >
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// Wrap your app with ThemeProvider.
// `specifiedTheme` is the stored theme in the session storage.
// `themeAction` is the action name that's used to change the theme in the session storage.
export default function AppWithThemeProvider() {
  const data = useLoaderData<typeof loader>();

  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <App />
    </ThemeProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
