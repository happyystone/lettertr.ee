import type { Route } from './+types/api';
import ApiPage from '../pages/api-page';
import { generateMeta } from '@/lib/seo';

export const meta: Route.MetaFunction = () => {
  return generateMeta({
    title: 'API Keys - Lettertree',
    description: 'Manage your API keys and access tokens.',
    noindex: true,
    nofollow: true, // FIXME:
  });
};

export default ApiPage;
