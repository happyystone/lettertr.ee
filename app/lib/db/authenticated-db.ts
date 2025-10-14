import { sql } from 'drizzle-orm';

import { db } from '@/db';
import { auth } from '@/lib/auth/auth-server';

function createDrizzle(token: string) {
  return {
    rls: (async (transaction, ...rest) => {
      return await db.transaction(
        async (tx) => {
          try {
            await tx.execute(sql`
              -- 사용자 ID 설정
              select set_config('app.current_user_id', '${sql.raw(token)}', TRUE);
              set local role ${sql.raw(token ? 'authenticated' : 'anon')};
            `);

            return await transaction(tx);
          } catch (error) {
            console.error('💥 Transaction failed with error:', error);
            throw error;
          } finally {
            await tx.execute(sql`
              reset app.current_user_id;
              reset role;
            `);
          }
        },
        ...rest,
      );
    }) as typeof db.transaction,
  };
}

export async function executeWithAuth<T>(
  request: Request,
  callback: (
    db: ReturnType<typeof createDrizzle>['rls'],
    user: (typeof auth.$Infer.Session)['user'],
  ) => Promise<T>,
): Promise<T> {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user || !session.user.id) {
    throw new Error('Unauthorized: No valid session found');
  }
  const token = session.user.id;
  const dbWithRLS = createDrizzle(token);

  return await callback(dbWithRLS.rls, session.user);
}
