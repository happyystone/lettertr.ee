import { eq } from 'drizzle-orm';

import { users } from '@/features/auth/schema';
import { db } from '@/db';
import { auth } from '@/lib/auth/auth-server';

export class OnboardingRepository {
  static async update(request: Request, userId: string) {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user || !session.user.id) {
      throw new Error('Unauthorized: No valid session found');
    }

    // Verify the userId matches the authenticated user
    if (session.user.id !== userId) {
      throw new Error('Unauthorized: User ID mismatch');
    }

    return db.update(users).set({ isOnboarded: true }).where(eq(users.id, userId)).returning();
  }
}
