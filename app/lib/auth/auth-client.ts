import { createAuthClient } from 'better-auth/react';

import { site } from '@/config/site';

export const authClient = createAuthClient({
  baseURL: site.url,
  plugins: [],
});
