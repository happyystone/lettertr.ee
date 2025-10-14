import { type RouteConfig, index, route, layout, prefix } from '@react-router/dev/routes';

export default [
  // Marketing routes with layout
  layout('features/marketing/layouts/marketing-layout.tsx', [
    index('features/marketing/routes/index.tsx'),
  ]),

  // Onboarding routes
  route('api/onboarding', 'api/onboarding.ts'),

  // Authentication routes
  route('auth/:pathname', 'features/auth/routes/auth.$pathname.tsx'),

  // Better-Auth API routes - splat route로 변경하여 모든 하위 경로 처리
  route('api/auth/*', 'features/auth/api/api.auth.$.ts'),

  // Cloudflare Email Worker webhook
  route('api/webhooks/email', 'api/webhook.email.ts'),

  // Theme API routes
  route('action/set-theme', 'api/action.set-theme.ts'),

  // Dashboard routes with layout (protected)
  layout('features/dashboard/layouts/dashboard-layout.tsx', [
    // route('dashboard', 'features/dashboard/routes/dashboard.tsx'),
    route('/settings', 'features/dashboard/routes/settings.tsx'),
    // route('/analytics', 'features/dashboard/routes/analytics.tsx'),
    // route('/api', 'features/dashboard/routes/api.tsx'),
    // route('/billing', 'features/dashboard/routes/billing.tsx'),
    // route('/integrations', 'features/dashboard/routes/integrations.tsx'),
    route('/letters', 'features/newsletter/routes/letters.tsx'),
    ...prefix('discover', [
      index('features/discover/routes/discover.tsx'),
      // route('/:sourceId', 'features/discover/routes/discover.$sourceId.tsx'),
      // route('/settings', 'features/discover/routes/discover.settings.tsx'),
    ]),
  ]),
  route('letter/:id', 'features/newsletter/routes/letter.$id.tsx'),

  // Legal pages
  route('terms', 'features/legal/routes/terms.tsx'),
  route('privacy', 'features/legal/routes/privacy.tsx'),

  // SEO files
  route('sitemap.xml', 'features/marketing/routes/sitemap.xml.tsx'),
] satisfies RouteConfig;
