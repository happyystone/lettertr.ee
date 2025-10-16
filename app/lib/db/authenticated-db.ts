import { db } from '@/db';
import { auth } from '@/lib/auth/auth-server';

export async function executeWithAuth<T>(
  request: Request,
  callback: (database: typeof db, user: (typeof auth.$Infer.Session)['user']) => Promise<T>,
): Promise<T> {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user || !session.user.id) {
    throw new Error('Unauthorized: No valid session found');
  }

  return await callback(db, session.user);
}
