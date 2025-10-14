import type { Route } from './+types/billing';
import BillingPage from '../pages/billing-page';
import { generateMeta } from '@/lib/seo';

export const meta: Route.MetaFunction = () => {
  return generateMeta({
    title: 'Billing - Lettertree',
    description: 'Manage your subscription and billing information.',
    noindex: true,
    nofollow: true, // FIXME:
  });
};

export default BillingPage;
