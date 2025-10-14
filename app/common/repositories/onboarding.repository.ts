import { eq } from 'drizzle-orm';

import { users } from '@/features/auth/schema';
import { executeWithAuth } from '@/lib/db/authenticated-db';

export class OnboardingRepository {
  static async update(request: Request, userId: string) {
    return executeWithAuth(request, async (db) => {
      return db((tx) =>
        tx.update(users).set({ isOnboarded: true }).where(eq(users.id, userId)).returning(),
      );
    });
  }
}
