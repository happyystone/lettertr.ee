import { auth } from '@/lib/auth/auth-server';

import type { Route } from './+types/api.auth.$';

// GET, POST, PUT, DELETE 등 모든 HTTP 메서드 처리
export async function loader({ request }: Route.LoaderArgs) {
  return auth.handler(request);
}

export async function action({ request }: Route.ActionArgs) {
  return auth.handler(request);
}

// React Router v7에서는 다른 HTTP 메서드들도 명시적으로 처리할 수 있습니다
export async function clientAction({ request }: Route.ClientActionArgs) {
  return auth.handler(request);
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  return auth.handler(request);
}
