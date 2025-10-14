import { NewsletterSourceRepository } from '../repositories/newsletter-source.repository';
import { UserSubscriptionRepository } from '../repositories/user-subscription.repository';
import { FilterService } from './filter.service';
import { CacheService } from './cache.service';
import type {
  DiscoverFilters,
  DiscoverSourcesResult,
  NewsletterSourceWithStatus,
  SavedFilter,
  UserPreferences,
  SourceStats,
} from '../types';

export class DiscoverService {
  /**
   * 뉴스레터 발행자 목록 조회 (캐싱 포함)
   */
  static async discoverSources(
    request: Request,
    userId: string,
    filters: DiscoverFilters,
  ): Promise<DiscoverSourcesResult> {
    // 캐시 확인
    // const cacheKey = ''; // CacheService.getCacheKey('discover', userId, filters);

    const whereConditions = await FilterService.buildWhereConditions(filters, userId);

    // 2. 병렬 데이터 페칭
    const [sources, totalCount, filterCounts] = await Promise.all([
      NewsletterSourceRepository.findWithUserStatus(request, whereConditions, {
        page: filters.page,
        limit: filters.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      }),
      NewsletterSourceRepository.count(request, whereConditions),
      FilterService.getAvailableFilterCounts(request, filters, userId),
    ]);

    // 3. 결과 포맷팅
    return this.formatDiscoverResult(sources, totalCount, filters, filterCounts);
    // FIXME: 캐시 무효화중임. 캐시 서비스 이거 어떻게 좀 해라 ㅋ
    // return await CacheService.getOrSet(cacheKey, async () => {
    //   // 1. 필터 조건 생성
    //   const whereConditions = await FilterService.buildWhereConditions(filters, userId);

    //   // 2. 병렬 데이터 페칭
    //   const [sources, totalCount, filterCounts] = await Promise.all([
    //     NewsletterSourceRepository.findWithUserStatus(request, whereConditions, {
    //       page: filters.page,
    //       limit: filters.limit,
    //       sortBy: filters.sortBy,
    //       sortOrder: filters.sortOrder,
    //     }),
    //     NewsletterSourceRepository.count(request, whereConditions),
    //     FilterService.getAvailableFilterCounts(request, filters, userId),
    //   ]);
    //   console.log(sources);

    //   // 3. 결과 포맷팅
    //   return this.formatDiscoverResult(sources, totalCount, filters, filterCounts);
    // });
  }

  /**
   * 구독 처리 (트랜잭션)
   */
  static async subscribe(
    request: Request,
    userId: string,
    sourceId: string,
    options: { notificationEnabled?: boolean } = {},
  ) {
    // 캐시 무효화
    CacheService.invalidatePattern(`discover:${userId}:*`);

    return await UserSubscriptionRepository.create(request, { sourceId, ...options });
  }

  /**
   * 구독 취소 (트랜잭션)
   */
  static async unsubscribe(request: Request, userId: string, sourceId: string) {
    // 캐시 무효화
    CacheService.invalidatePattern(`discover:${userId}:*`);

    return await UserSubscriptionRepository.delete(request, sourceId);
  }

  /**
   * 대량 구독
   */
  static async bulkSubscribe(request: Request, userId: string, sourceIds: string[]) {
    const results = await Promise.allSettled(
      sourceIds.map((sourceId) => this.subscribe(request, userId, sourceId)),
    );

    return {
      succeeded: results
        .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
        .map((r) => r.value),
      failed: results
        .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
        .map((r, index) => ({
          sourceId: sourceIds[index],
          error: r.reason.message,
        })),
    };
  }

  /**
   * 추천 발행자 조회
   */
  static async getRecommendations(
    request: Request,
    limit = 10,
  ): Promise<NewsletterSourceWithStatus[]> {
    // 사용자 선호도 분석
    const preferences = await this.analyzeUserPreferences(request);

    // 추천 알고리즘 적용
    return await NewsletterSourceRepository.findRecommended(request, preferences, limit);
  }

  /**
   * 카테고리 목록 조회
   */
  static async getCategories(request: Request) {
    return await NewsletterSourceRepository.getUniqueCategories(request);
    // FIXME: 캐시 무효화중임. 캐시 서비스 이거 어떻게 좀 해라 ㅋ
    // return await CacheService.getOrSet(
    //   'categories:all',
    //   async () => {
    //     return await NewsletterSourceRepository.getUniqueCategories(request);
    //   },
    //   { ttl: 3600000 }, // 1시간 캐싱
    // );
  }

  /**
   * 자동완성 검색
   */
  static async searchAutocomplete(request: Request, query: string, limit = 5) {
    if (query.length < 2) return [];

    return await NewsletterSourceRepository.searchByName(request, query, limit);
  }

  /**
   * 발행자 상세 정보 조회
   */
  static async getSourceDetail(
    request: Request,
    sourceId: string,
  ): Promise<NewsletterSourceWithStatus | null> {
    return await NewsletterSourceRepository.findByIdWithUserStatus(request, sourceId);
  }

  /**
   * 발행자 통계 조회
   */
  static async getSourceStats(request: Request, sourceId: string): Promise<SourceStats> {
    return await CacheService.getOrSet(
      `stats:source:${sourceId}`,
      async () => {
        const [
          subscriberCount,
          recentGrowth,
          engagementRate,
          newsletterFrequency,
          totalNewsletters,
        ] = await Promise.all([
          NewsletterSourceRepository.getSubscriberCount(request, sourceId),
          this.calculateRecentGrowth(request, sourceId),
          this.calculateEngagementRate(request, sourceId),
          this.calculateNewsletterFrequency(request, sourceId),
          NewsletterSourceRepository.getTotalNewsletters(request, sourceId),
        ]);

        return {
          subscriberCount,
          recentGrowth,
          engagementRate,
          newsletterFrequency,
          totalNewsletters,
        };
      },
      { ttl: 900000 }, // 15분 캐싱
    );
  }

  /**
   * 관련 발행자 조회
   */
  static async getRelatedSources(
    request: Request,
    sourceId: string,
    options: { limit?: number } = {},
  ): Promise<NewsletterSourceWithStatus[]> {
    const source = await NewsletterSourceRepository.findById(request, sourceId);
    if (!source) return [];

    const similarSources = await NewsletterSourceRepository.findSimilar(
      request,
      source.category,
      source.region,
      sourceId,
      options.limit || 4,
    );

    // userId를 사용하여 사용자별 상태 추가
    return await NewsletterSourceRepository.findWithUserStatus(
      request,
      { id: { in: similarSources.map((s) => s.id) } },
      {
        page: 1,
        limit: options.limit || 4,
        sortBy: 'subscribers',
        sortOrder: 'desc',
      },
    );
  }

  /**
   * 최근 뉴스레터 조회
   */
  static async getRecentNewsletters(
    sourceId: string,
    options: { limit?: number } = {},
  ): Promise<any[]> {
    // 실제 구현은 newsletter feature의 repository를 사용해야 함
    // 현재는 임시 구현
    return [];
  }

  /**
   * 구독 일시정지
   */
  static async pauseSubscription(userId: string, sourceId: string): Promise<void> {
    // 캐시 무효화
    CacheService.invalidatePattern(`discover:${userId}:*`);

    // 실제 구현은 UserSubscriptionRepository에 추가 필요
    // await UserSubscriptionRepository.pauseSubscription(userId, sourceId);
  }

  /**
   * 구독 재개
   */
  static async resumeSubscription(userId: string, sourceId: string): Promise<void> {
    // 캐시 무효화
    CacheService.invalidatePattern(`discover:${userId}:*`);

    // 실제 구현은 UserSubscriptionRepository에 추가 필요
    // await UserSubscriptionRepository.resumeSubscription(userId, sourceId);
  }

  /**
   * 구독 설정 업데이트
   */
  static async updateSubscriptionPreferences(
    userId: string,
    sourceId: string,
    preferences: any,
  ): Promise<void> {
    // 캐시 무효화
    CacheService.invalidatePattern(`discover:${userId}:*`);

    // 실제 구현은 UserSubscriptionRepository에 추가 필요
    // await UserSubscriptionRepository.updateSubscriptionPreferences(userId, sourceId, preferences);
  }

  /**
   * 발행자 신고
   */
  static async reportSource(
    sourceId: string,
    report: { userId: string; reason: string; details?: string },
  ): Promise<void> {
    // 실제 구현은 별도의 ReportRepository 필요
    console.log('Report source:', sourceId, report);
  }

  /**
   * 사용자 구독 통계 조회
   */
  static async getUserSubscriptionStats(userId: string): Promise<any> {
    // 실제 구현은 UserSubscriptionRepository에 추가 필요
    return {
      totalSubscriptions: 0,
      activeSubscriptions: 0,
      pausedSubscriptions: 0,
      categories: [],
    };
  }

  /**
   * 저장된 필터 수정
   */
  static async updateSavedFilter(
    userId: string,
    filterId: string,
    updates: { name?: string; filters?: DiscoverFilters },
  ): Promise<void> {
    // 실제 구현은 UserSubscriptionRepository에 추가 필요
    // await UserSubscriptionRepository.updateSavedFilter(userId, filterId, updates);
  }

  /**
   * 구독 내보내기
   */
  static async exportSubscriptions(
    userId: string,
    format: 'csv' | 'json' | 'opml',
  ): Promise<string> {
    // 실제 구현은 UserSubscriptionRepository에 추가 필요
    return '';
  }

  /**
   * 구독 가져오기
   */
  static async importSubscriptions(
    userId: string,
    content: string,
    format: 'csv' | 'json' | 'opml',
  ): Promise<{ imported: number; failed: number }> {
    // 실제 구현은 UserSubscriptionRepository에 추가 필요
    return { imported: 0, failed: 0 };
  }

  /**
   * 모든 구독 삭제
   */
  static async clearAllSubscriptions(userId: string): Promise<void> {
    // 캐시 무효화
    CacheService.invalidatePattern(`discover:${userId}:*`);

    // 실제 구현은 UserSubscriptionRepository에 추가 필요
    // await UserSubscriptionRepository.clearAllSubscriptions(userId);
  }

  /**
   * 사용자 선호도 초기화
   */
  static async resetUserPreferences(userId: string): Promise<void> {
    // 캐시 무효화
    CacheService.invalidatePattern(`discover:${userId}:*`);

    // 실제 구현은 UserSubscriptionRepository에 추가 필요
    // await UserSubscriptionRepository.resetUserPreferences(userId);
  }

  /**
   * 필터 저장
   */
  static async saveFilter(
    request: Request,
    name: string,
    filters: DiscoverFilters,
  ): Promise<SavedFilter> {
    return await UserSubscriptionRepository.saveUserFilter(request, name, filters);
  }

  /**
   * 저장된 필터 조회
   */
  static async getUserSavedFilters(request: Request): Promise<SavedFilter[]> {
    return await UserSubscriptionRepository.getUserSavedFilters(request);
  }

  /**
   * 저장된 필터 삭제
   */
  static async deleteSavedFilter(request: Request, filterId: string): Promise<void> {
    await UserSubscriptionRepository.deleteSavedFilter(request, filterId);
  }

  /**
   * 사용자 선호도 조회
   */
  static async getUserPreferences(request: Request): Promise<UserPreferences> {
    return await UserSubscriptionRepository.getUserPreferences(request);
  }

  /**
   * 사용자 선호도 업데이트
   */
  static async updateUserPreferences(
    request: Request,
    preferences: Partial<UserPreferences>,
  ): Promise<void> {
    await UserSubscriptionRepository.updateUserPreferences(request, preferences);
  }

  /**
   * 사용자 선호도 분석
   */
  private static async analyzeUserPreferences(request: Request): Promise<UserPreferences> {
    const subscriptions = await UserSubscriptionRepository.getUserSubscriptions(request);

    // 카테고리 분포 분석
    const categoryCount = new Map<string, number>();
    const regionCount = new Map<string, number>();

    subscriptions.forEach((sub) => {
      if (sub.category) {
        categoryCount.set(sub.category, (categoryCount.get(sub.category) || 0) + 1);
      }
      regionCount.set(sub.region, (regionCount.get(sub.region) || 0) + 1);
    });

    // 상위 카테고리 및 지역 추출
    const topCategories = Array.from(categoryCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category);

    const preferredRegion =
      (Array.from(regionCount.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] as 'KR' | 'ROW') ||
      'ALL';

    return {
      categories: topCategories,
      region: preferredRegion,
      excludeSubscribed: true,
    };
  }

  /**
   * 결과 포맷팅
   */
  private static formatDiscoverResult(
    sources: NewsletterSourceWithStatus[],
    totalCount: number,
    filters: DiscoverFilters,
    filterCounts: any,
  ): DiscoverSourcesResult {
    return {
      sources,
      pagination: {
        currentPage: filters.page,
        totalPages: Math.ceil(totalCount / filters.limit),
        totalCount,
        hasMore: filters.page * filters.limit < totalCount,
        limit: filters.limit,
      },
      filterCounts,
      appliedFilters: this.getAppliedFilters(filters),
    };
  }

  /**
   * 적용된 필터 요약
   */
  private static getAppliedFilters(filters: DiscoverFilters) {
    const applied = [];

    if (filters.search) applied.push({ type: 'search', value: filters.search });
    if (filters.category) applied.push({ type: 'category', value: filters.category });
    if (filters.region !== 'ALL') applied.push({ type: 'region', value: filters.region });
    if (filters.status !== 'ALL') applied.push({ type: 'status', value: filters.status });

    return applied;
  }

  /**
   * 최근 성장률 계산
   */
  private static async calculateRecentGrowth(request: Request, sourceId: string): Promise<number> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [previousCount, currentCount] = await Promise.all([
      NewsletterSourceRepository.getSubscriberCountAt(request, sourceId, thirtyDaysAgo),
      NewsletterSourceRepository.getSubscriberCount(request, sourceId),
    ]);

    if (previousCount === 0) return 0;

    return ((currentCount - previousCount) / previousCount) * 100;
  }

  /**
   * 참여율 계산
   */
  private static async calculateEngagementRate(
    request: Request,
    sourceId: string,
  ): Promise<number> {
    // 최근 30일간 발송된 뉴스레터 대비 읽은 비율
    const stats = await NewsletterSourceRepository.getEngagementStats(request, sourceId);

    if (stats.totalSent === 0) return 0;

    return (stats.totalRead / stats.totalSent) * 100;
  }

  /**
   * 뉴스레터 발송 주기 계산
   */
  private static async calculateNewsletterFrequency(
    request: Request,
    sourceId: string,
  ): Promise<string> {
    const recentNewsletters = await NewsletterSourceRepository.getRecentNewsletters(
      request,
      sourceId,
      10,
    );

    if (recentNewsletters.length < 2) return 'unknown';

    // 평균 발송 간격 계산
    const intervals = [];
    for (let i = 1; i < recentNewsletters.length; i++) {
      const diff =
        recentNewsletters[i - 1].receivedAt.getTime() - recentNewsletters[i].receivedAt.getTime();
      intervals.push(diff);
    }

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const days = avgInterval / (1000 * 60 * 60 * 24);

    if (days < 1.5) return '매일';
    if (days < 5) return '주 2-3회';
    if (days < 9) return '주 1회';
    if (days < 20) return '격주';
    if (days < 35) return '월 1회';
    return '비정기';
  }
}
