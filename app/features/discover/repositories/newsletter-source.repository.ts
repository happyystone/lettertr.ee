import { executeWithAuth } from '@/lib/db/authenticated-db';
import { eq, and, or, desc, asc, sql, inArray, gte, count, ilike } from 'drizzle-orm';
import {
  newsletterSources,
  userNewsletterSources,
  newsletters,
} from '@/features/newsletter/schema';
import type {
  NewsletterSource,
  NewsletterSourceWithStatus,
  UserPreferences,
  AutocompleteSuggestion,
} from '../types';

interface PaginationOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export class NewsletterSourceRepository {
  /**
   * 사용자 구독 상태를 포함한 발행자 조회
   */
  static async findWithUserStatus(
    request: Request,
    whereConditions: any,
    options: PaginationOptions,
  ): Promise<NewsletterSourceWithStatus[]> {
    return executeWithAuth(request, async (db, user) => {
      const query = db
        .select({
          source: newsletterSources,
          subscription: userNewsletterSources,
        })
        .from(newsletterSources)
        .leftJoin(
          userNewsletterSources,
          and(
            eq(userNewsletterSources.sourceId, newsletterSources.id),
            eq(userNewsletterSources.userId, user.id),
            eq(userNewsletterSources.isSubscribed, true),
          ),
        )
        .where(whereConditions)
        .orderBy(this.buildOrderBy(options.sortBy, options.sortOrder))
        .limit(options.limit)
        .offset((options.page - 1) * options.limit);

      const results = await query;

      return results.map((row) => ({
        ...row.source,
        isSubscribed: !!row.subscription,
        subscribedAt: row.subscription?.subscribedAt,
      })) as NewsletterSourceWithStatus[];
    });
  }

  /**
   * ID로 발행자 조회 (사용자 구독 상태 포함)
   */
  static async findByIdWithUserStatus(
    request: Request,
    sourceId: string,
  ): Promise<NewsletterSourceWithStatus | null> {
    return executeWithAuth(request, async (db, user) => {
      const result = await db
        .select({
          source: newsletterSources,
          subscription: userNewsletterSources,
        })
        .from(newsletterSources)
        .leftJoin(
          userNewsletterSources,
          and(
            eq(userNewsletterSources.sourceId, newsletterSources.id),
            eq(userNewsletterSources.userId, user.id),
            eq(userNewsletterSources.isSubscribed, true),
          ),
        )
        .where(eq(newsletterSources.id, sourceId))
        .limit(1);

      if (result.length === 0) return null;

      const row = result[0];
      return {
        ...row.source,
        isSubscribed: !!row.subscription,
        subscribedAt: row.subscription?.subscribedAt,
      } as NewsletterSourceWithStatus;
    });
  }

  /**
   * ID로 발행자 조회
   */
  static async findById(request: Request, sourceId: string): Promise<NewsletterSource | null> {
    return executeWithAuth(request, async (db) => {
      const result = await db
        .select()
        .from(newsletterSources)
        .where(eq(newsletterSources.id, sourceId))
        .limit(1);

      return (result[0] as NewsletterSource) || null;
    });
  }

  /**
   * 추천 발행자 조회
   */
  static async findRecommended(
    request: Request,
    preferences: UserPreferences,
    limit: number,
  ): Promise<NewsletterSourceWithStatus[]> {
    const conditions = [
      eq(newsletterSources.isActive, true),
      eq(newsletterSources.isVerified, true),
    ];

    // 선호 카테고리 필터
    if (preferences.categories.length > 0) {
      conditions.push(inArray(newsletterSources.category, preferences.categories));
    }

    // 선호 지역 필터
    if (preferences.region !== 'ALL') {
      conditions.push(eq(newsletterSources.region, preferences.region));
    }

    return executeWithAuth(request, async (db, user) => {
      const query = db
        .select({
          source: newsletterSources,
          subscription: userNewsletterSources,
        })
        .from(newsletterSources)
        .leftJoin(
          userNewsletterSources,
          and(
            eq(userNewsletterSources.sourceId, newsletterSources.id),
            eq(userNewsletterSources.userId, user.id),
            eq(userNewsletterSources.isSubscribed, true),
          ),
        )
        .where(and(...conditions))
        .orderBy(desc(newsletterSources.isFeatured), desc(newsletterSources.subscriberCount))
        .limit(limit);

      const results = await query;

      // 이미 구독중인 것 제외
      const sources = results
        .filter((row) => (preferences.excludeSubscribed ? !row.subscription : true))
        .map((row) => ({
          ...row.source,
          isSubscribed: !!row.subscription,
          subscribedAt: row.subscription?.subscribedAt,
        })) as NewsletterSourceWithStatus[];

      return sources;
    });
  }

  /**
   * 유사한 발행자 조회
   */
  static async findSimilar(
    request: Request,
    category: string | null,
    region: string,
    excludeId: string,
    limit: number,
  ): Promise<NewsletterSourceWithStatus[]> {
    const conditions = [
      eq(newsletterSources.isActive, true),
      sql`${newsletterSources.id} != ${excludeId}`,
    ];

    if (category) {
      conditions.push(eq(newsletterSources.category, category));
    }

    // @ts-ignore
    return executeWithAuth(request, async (db) => {
      const results = await db
        .select()
        .from(newsletterSources)
        .where(and(...conditions))
        .orderBy(desc(newsletterSources.subscriberCount), desc(newsletterSources.isVerified))
        .limit(limit);

      return results;
    });
  }

  /**
   * 이름으로 검색 (자동완성용)
   */
  static async searchByName(
    request: Request,
    query: string,
    limit: number,
  ): Promise<AutocompleteSuggestion[]> {
    const searchTerm = `%${query}%`;

    return executeWithAuth(request, async (db) => {
      const results = await db
        .select({
          id: newsletterSources.id,
          name: newsletterSources.name,
          category: newsletterSources.category,
          logoUrl: newsletterSources.logoUrl,
          subscriberCount: newsletterSources.subscriberCount,
        })
        .from(newsletterSources)
        .where(
          and(
            eq(newsletterSources.isActive, true),
            or(
              ilike(newsletterSources.name, searchTerm),
              ilike(newsletterSources.email, searchTerm),
            )!,
          ),
        )
        .orderBy(desc(newsletterSources.subscriberCount))
        .limit(limit);

      return results.map((r) => ({
        id: r.id,
        name: r.name,
        category: r.category || '',
        logoUrl: r.logoUrl || undefined,
        subscriberCount: r.subscriberCount || 0,
      }));
    });
  }

  /**
   * 전체 카운트
   */
  static async count(request: Request, whereConditions: any): Promise<number> {
    return executeWithAuth(request, async (db, user) => {
      const result = await db
        .select({ count: count() })
        .from(newsletterSources)
        .leftJoin(
          userNewsletterSources,
          and(
            eq(userNewsletterSources.sourceId, newsletterSources.id),
            eq(userNewsletterSources.userId, user.id),
          ),
        )
        .where(whereConditions);

      return result[0]?.count || 0;
    });
  }

  /**
   * 구독중인 발행자 카운트
   */
  static async countSubscribed(request: Request, whereConditions: any): Promise<number> {
    return executeWithAuth(request, async (db, user) => {
      const result = await db
        .select({ count: count() })
        .from(newsletterSources)
        .innerJoin(
          userNewsletterSources,
          and(
            eq(userNewsletterSources.sourceId, newsletterSources.id),
            eq(userNewsletterSources.userId, user.id),
            eq(userNewsletterSources.isSubscribed, true),
          ),
        )
        .where(whereConditions);

      return result[0]?.count || 0;
    });
  }

  /**
   * 신규 발행자 카운트
   */
  static async countNew(request: Request, whereConditions: any): Promise<number> {
    return executeWithAuth(request, async (db) => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await db
        .select({ count: count() })
        .from(newsletterSources)
        .where(and(whereConditions, gte(newsletterSources.createdAt, thirtyDaysAgo)));

      return result[0]?.count || 0;
    });
  }

  /**
   * 카테고리별 카운트
   */
  static async countByCategory(
    request: Request,
    whereConditions: any,
  ): Promise<{ category: string; count: number }[]> {
    return executeWithAuth(request, async (db, user) => {
      const results = await db
        .select({
          category: newsletterSources.category,
          count: count(),
        })
        .from(newsletterSources)
        .leftJoin(
          userNewsletterSources,
          and(
            eq(userNewsletterSources.sourceId, newsletterSources.id),
            eq(userNewsletterSources.userId, user.id),
          ),
        )
        .where(whereConditions)
        .groupBy(newsletterSources.category);

      return results.map((r) => ({
        category: r.category || 'UNCATEGORIZED',
        count: r.count,
      }));
    });
  }

  /**
   * 지역별 카운트
   */
  static async countByRegion(
    request: Request,
    whereConditions: any,
  ): Promise<{ region: string; count: number }[]> {
    return executeWithAuth(request, async (db, user) => {
      const results = await db
        .select({
          region: newsletterSources.region,
          count: count(),
        })
        .from(newsletterSources)
        .leftJoin(
          userNewsletterSources,
          and(
            eq(userNewsletterSources.sourceId, newsletterSources.id),
            eq(userNewsletterSources.userId, user.id),
          ),
        )
        .where(whereConditions)
        .groupBy(newsletterSources.region);

      return results.map((r) => ({
        region: r.region,
        count: r.count,
      }));
    });
  }

  /**
   * 유니크 카테고리 목록
   */
  static async getUniqueCategories(request: Request): Promise<string[]> {
    return executeWithAuth(request, async (db) => {
      const results = await db
        .selectDistinct({
          category: newsletterSources.category,
        })
        .from(newsletterSources)
        .where(
          and(eq(newsletterSources.isActive, true), sql`${newsletterSources.category} IS NOT NULL`),
        );

      return results.map((r) => r.category).filter(Boolean) as string[];
    });
  }

  /**
   * 구독자 수 조회
   */
  static async getSubscriberCount(request: Request, sourceId: string): Promise<number> {
    return executeWithAuth(request, async (db) => {
      const result = await db
        .select({ count: newsletterSources.subscriberCount })
        .from(newsletterSources)
        .where(eq(newsletterSources.id, sourceId))
        .limit(1);

      return result[0]?.count || 0;
    });
  }

  /**
   * 특정 시점의 구독자 수 조회
   */
  static async getSubscriberCountAt(
    request: Request,
    sourceId: string,
    date: Date,
  ): Promise<number> {
    // TODO: 구독 히스토리 테이블이 필요한 경우 구현
    // 현재는 현재 구독자 수만 반환
    return this.getSubscriberCount(request, sourceId);
  }

  /**
   * 참여 통계
   */
  static async getEngagementStats(
    request: Request,
    sourceId: string,
  ): Promise<{ totalSent: number; totalRead: number }> {
    // TODO: 실제 참여 통계 구현
    return { totalSent: 100, totalRead: 75 };
  }

  /**
   * 최근 뉴스레터
   */
  static async getRecentNewsletters(request: Request, sourceId: string, limit: number) {
    return executeWithAuth(request, async (db) => {
      const results = await db
        .select()
        .from(newsletters)
        .where(eq(newsletters.sourceId, sourceId))
        .orderBy(desc(newsletters.receivedAt))
        .limit(limit);

      return results;
    });
  }

  /**
   * 총 뉴스레터 수
   */
  static async getTotalNewsletters(request: Request, sourceId: string): Promise<number> {
    return executeWithAuth(request, async (db) => {
      const result = await db
        .select({ count: count() })
        .from(newsletters)
        .where(eq(newsletters.sourceId, sourceId));

      return result[0]?.count || 0;
    });
  }

  /**
   * 정렬 조건 생성
   */
  private static buildOrderBy(sortBy: string, sortOrder: 'asc' | 'desc') {
    const direction = sortOrder === 'asc' ? asc : desc;

    switch (sortBy) {
      case 'subscribers':
        return direction(newsletterSources.subscriberCount);
      case 'recent':
        return direction(newsletterSources.createdAt);
      case 'name':
        return direction(newsletterSources.name);
      case 'activity':
        return direction(newsletterSources.totalNewsletters);
      default:
        return desc(newsletterSources.subscriberCount);
    }
  }
}
