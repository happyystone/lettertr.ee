import { db } from '@/db';
import { auth } from '@/lib/auth/auth-server';
import { eq, and, desc, or, ilike } from 'drizzle-orm';
import { newsletterSources, userNewsletterSources } from '../schema';
import type { NewsletterSource } from '../types';

export class SubscriptionService {
  /**
   * 사용자가 구독한 뉴스레터 소스 목록을 가져옵니다
   */
  static async getUserSubscriptions(request: Request): Promise<NewsletterSource[]> {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user || !session.user.id) {
      throw new Error('Unauthorized: No valid session found');
    }

    try {
      const subscriptions = await db
        .select({ source: newsletterSources })
        .from(userNewsletterSources)
        .innerJoin(newsletterSources, eq(newsletterSources.id, userNewsletterSources.sourceId))
        .where(
          and(
            eq(userNewsletterSources.userId, session.user.id),
            eq(userNewsletterSources.isSubscribed, true),
          ),
        )
        .orderBy(desc(userNewsletterSources.subscribedAt));

      return subscriptions.map((s) => s.source as NewsletterSource);
    } catch (error) {
      console.error('Failed to fetch user subscriptions:', error);
      throw new Error('구독 목록을 불러오는데 실패했습니다');
    }
  }

  /**
   * 뉴스레터 소스를 구독합니다
   */
  static async subscribe(request: Request, sourceId: string): Promise<void> {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user || !session.user.id) {
      throw new Error('Unauthorized: No valid session found');
    }

    try {
      await db
        .insert(userNewsletterSources)
        .values({
          userId: session.user.id,
          sourceId,
          isSubscribed: true,
        })
        .onConflictDoUpdate({
          target: [userNewsletterSources.userId, userNewsletterSources.sourceId],
          set: {
            isSubscribed: true,
            subscribedAt: new Date(),
            unsubscribedAt: null,
          },
        });
    } catch (error) {
      console.error('Failed to subscribe:', error);
      throw new Error('구독에 실패했습니다');
    }
  }

  /**
   * 뉴스레터 소스 구독을 취소합니다
   */
  static async unsubscribe(request: Request, sourceId: string): Promise<void> {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user || !session.user.id) {
      throw new Error('Unauthorized: No valid session found');
    }

    try {
      await db
        .update(userNewsletterSources)
        .set({
          isSubscribed: false,
          unsubscribedAt: new Date(),
        })
        .where(
          and(
            eq(userNewsletterSources.userId, session.user.id),
            eq(userNewsletterSources.sourceId, sourceId),
          ),
        );
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      throw new Error('구독 취소에 실패했습니다');
    }
  }

  /**
   * 구독 가능한 뉴스레터 소스를 탐색합니다
   */
  static async discoverSources(
    request: Request,
    filters: {
      region?: 'KR' | 'ROW';
      category?: string;
      featured?: boolean;
      searchQuery?: string;
    } = {},
  ): Promise<NewsletterSource[]> {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user || !session.user.id) {
      throw new Error('Unauthorized: No valid session found');
    }

    let whereConditions = [eq(newsletterSources.isActive, true)];

    if (filters.region) {
      whereConditions.push(eq(newsletterSources.region, filters.region));
    }

    if (filters.category) {
      whereConditions.push(eq(newsletterSources.category, filters.category));
    }

    if (filters.featured) {
      whereConditions.push(eq(newsletterSources.isFeatured, true));
    }

    if (filters.searchQuery) {
      whereConditions.push(
        or(
          ilike(newsletterSources.name, `%${filters.searchQuery}%`),
          ilike(newsletterSources.description, `%${filters.searchQuery}%`),
        )!,
      );
    }

    try {
      const sources = await db
        .select()
        .from(newsletterSources)
        .where(and(...whereConditions))
        .orderBy(
          desc(newsletterSources.subscriberCount),
          desc(newsletterSources.isVerified),
          desc(newsletterSources.isFeatured),
        );

      return sources as NewsletterSource[];
    } catch (error) {
      console.error('Failed to discover sources:', error);
      throw new Error('뉴스레터 소스 탐색에 실패했습니다');
    }
  }

  /**
   * 인기 뉴스레터 소스를 가져옵니다
   */
  static async getPopularSources(request: Request, limit = 10): Promise<NewsletterSource[]> {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user || !session.user.id) {
      throw new Error('Unauthorized: No valid session found');
    }

    try {
      const sources = await db
        .select()
        .from(newsletterSources)
        .where(and(eq(newsletterSources.isActive, true), eq(newsletterSources.isVerified, true)))
        .orderBy(desc(newsletterSources.subscriberCount))
        .limit(limit);

      return sources as NewsletterSource[];
    } catch (error) {
      console.error('Failed to fetch popular sources:', error);
      throw new Error('인기 뉴스레터 목록을 불러오는데 실패했습니다');
    }
  }

  /**
   * 추천 뉴스레터 소스를 가져옵니다
   */
  static async getFeaturedSources(
    request: Request,
    region?: 'KR' | 'ROW',
  ): Promise<NewsletterSource[]> {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user || !session.user.id) {
      throw new Error('Unauthorized: No valid session found');
    }

    let whereConditions = [
      eq(newsletterSources.isActive, true),
      eq(newsletterSources.isFeatured, true),
    ];

    if (region) {
      whereConditions.push(eq(newsletterSources.region, region));
    }

    try {
      const sources = await db
        .select()
        .from(newsletterSources)
        .where(and(...whereConditions))
        .orderBy(desc(newsletterSources.subscriberCount));

      return sources as NewsletterSource[];
    } catch (error) {
      console.error('Failed to fetch featured sources:', error);
      throw new Error('추천 뉴스레터 목록을 불러오는데 실패했습니다');
    }
  }

  /**
   * 카테고리별 뉴스레터 소스를 가져옵니다
   */
  static async getSourcesByCategory(
    request: Request,
    category: string,
  ): Promise<NewsletterSource[]> {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user || !session.user.id) {
      throw new Error('Unauthorized: No valid session found');
    }

    try {
      const sources = await db
        .select()
        .from(newsletterSources)
        .where(and(eq(newsletterSources.isActive, true), eq(newsletterSources.category, category)))
        .orderBy(desc(newsletterSources.subscriberCount));

      return sources as NewsletterSource[];
    } catch (error) {
      console.error('Failed to fetch sources by category:', error);
      throw new Error('카테고리별 뉴스레터 목록을 불러오는데 실패했습니다');
    }
  }

  /**
   * 뉴스레터 소스의 구독자 수를 업데이트합니다
   */
  static async updateSubscriberCount(request: Request, sourceId: string): Promise<void> {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user || !session.user.id) {
      throw new Error('Unauthorized: No valid session found');
    }

    try {
      const count = await db
        .select({ count: userNewsletterSources.userId })
        .from(userNewsletterSources)
        .where(
          and(
            eq(userNewsletterSources.sourceId, sourceId),
            eq(userNewsletterSources.isSubscribed, true),
          ),
        );

      await db
        .update(newsletterSources)
        .set({
          subscriberCount: count.length,
        })
        .where(eq(newsletterSources.id, sourceId));
    } catch (error) {
      console.error('Failed to update subscriber count:', error);
      // 실패해도 무시 (백그라운드 작업)
    }
  }
}
