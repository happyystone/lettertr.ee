import type { Route } from './+types/analytics';
import AnalyticsPage from '../pages/analytics-page';
import { generateMeta } from '@/lib/seo';

export const meta: Route.MetaFunction = () => {
  return generateMeta({
    title: 'Analytics - Lettertree',
    description: 'View your newsletter analytics and insights.',
    noindex: true,
    nofollow: true, // FIXME:
  });
};

export default AnalyticsPage;
