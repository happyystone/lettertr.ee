import type { Route } from './+types/dashboard';
import DashboardPage from '../pages/dashboard-page';
import { generateMeta } from '@/lib/seo';

export const meta: Route.MetaFunction = () => {
  return generateMeta({
    title: 'Dashboard - Lettertree',
    description: 'Your dashboard overview',
    noindex: true,
    nofollow: true, // FIXME:
  });
};

export default DashboardPage;
