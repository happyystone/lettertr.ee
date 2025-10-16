import { eq, and, sql, desc, asc } from 'drizzle-orm';

import { executeWithAuth } from '@/lib/db/authenticated-db';
import { userSubscriptions, newsletterSources } from '@/features/newsletter/schema';
import type { DiscoverFilters, UserPreferences } from '@/features/discover/types';

export interface CreateSubscriptionData {
  sourceId: string;
  subscriptionEmail?: string;
  preferences?: {
    frequency?: 'instant' | 'daily' | 'weekly';
    categories?: string[];
  };
}

export interface UpdateSubscriptionData {
  subscriptionEmail?: string;
  preferences?: {
    frequency?: 'instant' | 'daily' | 'weekly';
    categories?: string[];
  };
  isActive?: boolean;
  isPaused?: boolean;
}

export interface SubscriptionFilters {
  userId?: string;
  sourceId?: string;
  isActive?: boolean;
  isPaused?: boolean;
}

export interface PaginationOptions {
  limit?: number;
  offset?: number;
  orderBy?: 'subscribedAt' | 'lastNewsletterAt' | 'name';
  orderDirection?: 'asc' | 'desc';
}

export class UserSubscriptionRepository {
  /**
   * 구독 생성
   */
  static async create(request: Request, data: CreateSubscriptionData) {
    return executeWithAuth(request, async (db, user) => {
      const [subscription] = await db
        .insert(userSubscriptions)
        .values({
          userId: user.id,
          sourceId: data.sourceId,
          subscriptionEmail: data.subscriptionEmail,
          preferences: data.preferences || null,
          isActive: true,
          isPaused: false,
          subscribedAt: new Date(),
        })
        .returning();

      return subscription;
    });
  }

  /**
   * 구독 조회
   */
  static async findOne(request: Request, sourceId: string) {
    return executeWithAuth(request, async (db, user) => {
      const subscription = await db
        .select()
        .from(userSubscriptions)
        .where(and(eq(userSubscriptions.userId, user.id), eq(userSubscriptions.sourceId, sourceId)))
        .limit(1);

      return subscription[0] || null;
    });
  }

  /**
   * 사용자의 모든 구독 조회
   */
  static async findByUser(
    request: Request,
    filters: SubscriptionFilters = {},
    options: PaginationOptions = {},
  ) {
    return executeWithAuth(request, async (db, user) => {
      const { limit = 20, offset = 0, orderBy = 'subscribedAt', orderDirection = 'desc' } = options;

      // WHERE 조건 구성
      const whereConditions = [eq(userSubscriptions.userId, user.id)];

      if (filters.isActive !== undefined) {
        whereConditions.push(eq(userSubscriptions.isActive, filters.isActive));
      }

      if (filters.isPaused !== undefined) {
        whereConditions.push(eq(userSubscriptions.isPaused, filters.isPaused));
      }

      // ORDER BY 설정
      let orderByClause;
      switch (orderBy) {
        case 'lastNewsletterAt':
          orderByClause =
            orderDirection === 'asc'
              ? asc(newsletterSources.lastNewsletterAt)
              : desc(newsletterSources.lastNewsletterAt);
          break;
        case 'name':
          orderByClause =
            orderDirection === 'asc' ? asc(newsletterSources.name) : desc(newsletterSources.name);
          break;
        case 'subscribedAt':
        default:
          orderByClause =
            orderDirection === 'asc'
              ? asc(userSubscriptions.subscribedAt)
              : desc(userSubscriptions.subscribedAt);
          break;
      }

      // 구독 정보와 뉴스레터 소스 정보 JOIN
      const subscriptions = await db
        .select({
          subscription: userSubscriptions,
          source: newsletterSources,
        })
        .from(userSubscriptions)
        .innerJoin(newsletterSources, eq(userSubscriptions.sourceId, newsletterSources.id))
        .where(and(...whereConditions))
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset);

      // 전체 개수 조회
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(userSubscriptions)
        .where(and(...whereConditions));

      return {
        data: subscriptions,
        pagination: {
          total: count,
          limit,
          offset,
          hasMore: offset + limit < count,
        },
      };
    });
  }

  /**
   * 구독 업데이트
   */
  static async update(request: Request, sourceId: string, data: UpdateSubscriptionData) {
    return executeWithAuth(request, async (db, user) => {
      const [updated] = await db
        .update(userSubscriptions)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(and(eq(userSubscriptions.userId, user.id), eq(userSubscriptions.sourceId, sourceId)))
        .returning();

      return updated;
    });
  }

  /**
   * 구독 취소 (소프트 삭제)
   */
  static async cancel(request: Request, sourceId: string) {
    return executeWithAuth(request, async (db, user) => {
      const [canceled] = await db
        .update(userSubscriptions)
        .set({
          isActive: false,
          unsubscribedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(and(eq(userSubscriptions.userId, user.id), eq(userSubscriptions.sourceId, sourceId)))
        .returning();

      return canceled;
    });
  }

  /**
   * 구독 재활성화
   */
  static async reactivate(request: Request, sourceId: string) {
    return executeWithAuth(request, async (db, user) => {
      const [reactivated] = await db
        .update(userSubscriptions)
        .set({
          isActive: true,
          isPaused: false,
          unsubscribedAt: null,
          updatedAt: new Date(),
        })
        .where(and(eq(userSubscriptions.userId, user.id), eq(userSubscriptions.sourceId, sourceId)))
        .returning();

      return reactivated;
    });
  }

  /**
   * 구독 일시정지
   */
  static async pause(request: Request, sourceId: string) {
    return executeWithAuth(request, async (db, user) => {
      const [paused] = await db
        .update(userSubscriptions)
        .set({
          isPaused: true,
          updatedAt: new Date(),
        })
        .where(and(eq(userSubscriptions.userId, user.id), eq(userSubscriptions.sourceId, sourceId)))
        .returning();

      return paused;
    });
  }

  /**
   * 구독 재개
   */
  static async resume(request: Request, sourceId: string) {
    return executeWithAuth(request, async (db, user) => {
      const [resumed] = await db
        .update(userSubscriptions)
        .set({
          isPaused: false,
          updatedAt: new Date(),
        })
        .where(and(eq(userSubscriptions.userId, user.id), eq(userSubscriptions.sourceId, sourceId)))
        .returning();

      return resumed;
    });
  }

  /**
   * 구독 완전 삭제 (하드 삭제)
   */
  static async delete(request: Request, sourceId: string) {
    return executeWithAuth(request, async (db, user) => {
      const deleted = await db
        .delete(userSubscriptions)
        .where(and(eq(userSubscriptions.userId, user.id), eq(userSubscriptions.sourceId, sourceId)))
        .returning();

      return deleted[0] || null;
    });
  }

  /**
   * 대량 구독 생성
   */
  static async bulkCreate(request: Request, sourceIds: string[]) {
    return executeWithAuth(request, async (db, user) => {
      const subscriptions = await db
        .insert(userSubscriptions)
        .values(
          sourceIds.map((sourceId) => ({
            userId: user.id,
            sourceId,
            isActive: true,
            isPaused: false,
            subscribedAt: new Date(),
            preferences: {},
          })),
        )
        .onConflictDoNothing()
        .returning();

      return subscriptions;
    });
  }

  /**
   * 대량 구독 취소
   */
  static async bulkCancel(request: Request, sourceIds: string[]) {
    return executeWithAuth(request, async (db, user) => {
      const canceled = await db
        .update(userSubscriptions)
        .set({
          isActive: false,
          unsubscribedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(userSubscriptions.userId, user.id),
            sql`${userSubscriptions.sourceId} = ANY(${sourceIds})`,
          ),
        )
        .returning();

      return canceled;
    });
  }

  /**
   * 구독 통계 조회
   */
  static async getUserStats(request: Request) {
    return executeWithAuth(request, async (db, user) => {
      const stats = await db
        .select({
          total: sql<number>`count(*)::int`,
          active: sql<number>`count(*) filter (where ${userSubscriptions.isActive} = true)::int`,
          paused: sql<number>`count(*) filter (where ${userSubscriptions.isPaused} = true)::int`,
          canceled: sql<number>`count(*) filter (where ${userSubscriptions.isActive} = false)::int`,
        })
        .from(userSubscriptions)
        .where(eq(userSubscriptions.userId, user.id));

      return (
        stats[0] || {
          total: 0,
          active: 0,
          paused: 0,
          canceled: 0,
        }
      );
    });
  }

  /**
   * 사용자 필터 저장
   */
  static async saveUserFilter(request: Request, name: string, filters: DiscoverFilters) {
    return executeWithAuth(request, async (db, user) => {
      // 실제 구현은 별도의 savedFilters 테이블이 필요
      // 임시로 빈 객체 반환
      return {
        id: crypto.randomUUID(),
        userId: user.id,
        name,
        filters,
        createdAt: new Date(),
        usageCount: 0,
      };
    });
  }

  /**
   * 사용자 저장된 필터 조회
   */
  static async getUserSavedFilters(request: Request) {
    return executeWithAuth(request, async (db, user) => {
      // 실제 구현은 별도의 savedFilters 테이블이 필요
      // 임시로 빈 배열 반환
      return [];
    });
  }

  /**
   * 저장된 필터 삭제
   */
  static async deleteSavedFilter(request: Request, filterId: string) {
    return executeWithAuth(request, async (db, user) => {
      // 실제 구현은 별도의 savedFilters 테이블이 필요
      // 임시로 undefined 반환
      return;
    });
  }

  /**
   * 사용자 선호도 조회
   */
  static async getUserPreferences(request: Request) {
    return executeWithAuth(request, async (db, user) => {
      // 실제 구현은 별도의 userPreferences 테이블이 필요
      // 임시로 기본값 반환
      return {
        categories: [],
        region: 'ALL' as const,
        excludeSubscribed: false,
        emailNotifications: true,
        pushNotifications: false,
        digestFrequency: 'weekly' as const,
        autoSubscribe: false,
        showRecommendations: true,
      };
    });
  }

  /**
   * 사용자 선호도 업데이트
   */
  static async updateUserPreferences(request: Request, preferences: Partial<UserPreferences>) {
    return executeWithAuth(request, async (db, user) => {
      // 실제 구현은 별도의 userPreferences 테이블이 필요
      // 임시로 undefined 반환
      return;
    });
  }

  /**
   * 사용자 구독 목록 조회
   */
  static async getUserSubscriptions(request: Request) {
    return executeWithAuth(request, async (db, user) => {
      const results = await db
        .select({
          subscription: userSubscriptions,
          source: newsletterSources,
        })
        .from(userSubscriptions)
        .innerJoin(newsletterSources, eq(userSubscriptions.sourceId, newsletterSources.id))
        .where(
          and(
            eq(userSubscriptions.userId, user.id),
            eq(userSubscriptions.isSubscribed, true),
            eq(userSubscriptions.isActive, true),
          ),
        );

      return results.map((r) => ({
        id: r.source.id,
        name: r.source.name,
        category: r.source.category,
        region: r.source.region,
        subscribedAt: r.subscription.subscribedAt,
      }));
    });
  }
}
