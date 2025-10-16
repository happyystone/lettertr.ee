import { createRequestHandler } from 'react-router';
// import { initializeDb } from '@/db'; // 수정한 db.ts에서 initializeDb 함수를 가져옵니다.

export type Env = {
  LETTERTREE_BINDING: D1Database;
};

declare module 'react-router' {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE,
);

export default {
  async fetch(request, env, ctx) {
    // initializeDb(env.LETTERTREE_BINDING); // DB 초기화

    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<Env>;
