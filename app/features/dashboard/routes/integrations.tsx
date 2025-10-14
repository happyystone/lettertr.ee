import type { Route } from './+types/integrations';
import IntegrationsPage from '../pages/integrations-page';
import { generateMeta } from '@/lib/seo';

export const meta: Route.MetaFunction = () => {
  return generateMeta({
    title: 'Integrations - Lettertree',
    description: 'Manage your third-party integrations and connections.',
    noindex: true,
    nofollow: true, // FIXME:
  });
};

export default IntegrationsPage;
