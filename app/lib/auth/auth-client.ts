import { createAuthClient } from 'better-auth/react';

// import { site } from '@/config/site';

export const authClient = createAuthClient({
  baseURL: 'http://localhost:5173', // site.url,
  plugins: [],
});
