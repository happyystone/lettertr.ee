import { generateMeta } from '@/lib/seo';

import AuthPage from '../pages/auth-$pathname-page';
import type { Route } from './+types/auth.$pathname';

// Meta function
export const meta: Route.MetaFunction = ({ params }) => {
  const titles: Record<string, string> = {
    'sign-in': 'Sign In - Lettertree',
    'sign-up': 'Sign Up - Lettertree',
    'forgot-password': 'Forgot Password - Lettertree',
  };

  return generateMeta({
    title: titles[params.pathname] || 'Authentication - Lettertree',
    description: 'Sign in or sign up to continue',
  });
};

// Export page component
export default AuthPage;
