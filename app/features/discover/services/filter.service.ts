import { eq, and, or, ilike, gte, sql, isNotNull, isNull } from 'drizzle-orm';
import { newsletterSources, userNewsletterSources } from '@/features/newsletter/schema';
import { NewsletterSourceRepository } from '../repositories/newsletter-source.repository';
import type { DiscoverFilters, FilterCounts, CategoryCount, RegionCount } from '../types';

export class FilterService {
  /**
   * 필터 조건 생성
   */
  static async buildWhereConditions(filters: DiscoverFilters, userId: string) {
    const conditions = [];

    // 기본 조건: 활성 상태
    conditions.push(eq(newsletterSources.isActive, true));

    // 검색 조건
    if (filters.search) {
      const searchTerm = `%${filters.search}%`;
      conditions.push(
        or(
          ilike(newsletterSources.name, searchTerm),
          ilike(newsletterSources.description, searchTerm),
          ilike(newsletterSources.email, searchTerm),
        )!,
      );
    }

    // 카테고리 필터
    if (filters.category && filters.category !== 'ALL') {
      conditions.push(eq(newsletterSources.category, filters.category));
    }

    // 지역 필터
    if (filters.region !== 'ALL') {
      conditions.push(eq(newsletterSources.region, filters.region));
    }

    // 검증/추천 필터는 제거됨

    // 구독 상태 필터 (JOIN 조건으로 처리)
    if (filters.status === 'NEW') {
      // 최근 30일 이내 생성
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      conditions.push(gte(newsletterSources.createdAt, thirtyDaysAgo));
    } else if (filters.status === 'SUBSCRIBED') {
      conditions.push(
        and(eq(userNewsletterSources.userId, userId), eq(userNewsletterSources.isSubscribed, true)),
      );
    }

    return and(...conditions);
  }

  /**
   * 필터별 카운트 조회
   */
  static async getAvailableFilterCounts(
    request: Request,
    currentFilters: DiscoverFilters,
    userId: string,
  ): Promise<FilterCounts> {
    const [categories, statuses] = await Promise.all([
      this.getCategoryCounts(request, currentFilters, userId),
      // this.getRegionCounts(request, currentFilters, userId),
      this.getStatusCounts(request, currentFilters, userId),
    ]);

    return {
      categories,
      regions: [],
      statuses,
      total: await NewsletterSourceRepository.count(
        request,
        await this.buildWhereConditions({ ...currentFilters, category: null }, userId),
      ),
    };
  }

  /**
   * 카테고리별 카운트
   */
  private static async getCategoryCounts(
    request: Request,
    baseFilters: DiscoverFilters,
    userId: string,
  ): Promise<CategoryCount[]> {
    // 카테고리 필터를 제외한 조건으로 카운트
    const filtersWithoutCategory = { ...baseFilters, category: null };
    const whereConditions = await this.buildWhereConditions(filtersWithoutCategory, userId);

    const counts = await NewsletterSourceRepository.countByCategory(request, whereConditions);

    // 카테고리 라벨 매핑
    return counts.map(({ category, count }) => ({
      category,
      count,
      label: this.getCategoryLabel(category),
    }));
  }

  /**
   * 지역별 카운트
   */
  private static async getRegionCounts(
    request: Request,
    baseFilters: DiscoverFilters,
    userId: string,
  ): Promise<RegionCount[]> {
    const filtersWithoutRegion = { ...baseFilters, region: 'ALL' as const };
    const whereConditions = await this.buildWhereConditions(filtersWithoutRegion, userId);

    const counts = await NewsletterSourceRepository.countByRegion(request, whereConditions);

    // 지역 라벨 매핑
    return counts.map(({ region, count }) => ({
      region,
      count,
      label: this.getRegionLabel(region),
    }));
  }

  /**
   * 구독 상태별 카운트
   */
  private static async getStatusCounts(
    request: Request,
    baseFilters: DiscoverFilters,
    userId: string,
  ): Promise<Record<string, number>> {
    const filtersWithoutStatus = { ...baseFilters, status: 'ALL' as const };
    const whereConditions = await this.buildWhereConditions(filtersWithoutStatus, userId);

    const [all, subscribed, newSources] = await Promise.all([
      NewsletterSourceRepository.count(request, whereConditions),
      NewsletterSourceRepository.countSubscribed(request, whereConditions),
      NewsletterSourceRepository.countNew(request, whereConditions),
    ]);

    return {
      ALL: all,
      SUBSCRIBED: subscribed,
      NEW: newSources,
    };
  }

  /**
   * 필터 유효성 검증
   */
  static validateFilters(filters: DiscoverFilters): boolean {
    // 페이지 번호 검증
    if (filters.page < 1) return false;

    // 페이지 크기 검증
    if (filters.limit < 1 || filters.limit > 100) return false;

    // 지역 값 검증
    if (!['ALL', 'KR', 'ROW'].includes(filters.region)) return false;

    // 상태 값 검증
    if (!['ALL', 'SUBSCRIBED', 'NEW'].includes(filters.status)) return false;

    // 정렬 기준 검증
    if (!['subscribers', 'recent', 'name', 'activity'].includes(filters.sortBy)) return false;

    // 정렬 순서 검증
    if (!['asc', 'desc'].includes(filters.sortOrder)) return false;

    return true;
  }

  /**
   * 카테고리 라벨 조회
   */
  private static getCategoryLabel(category: string): string {
    const categoryLabels: Record<string, string> = {
      NEWS: '뉴스',
      AI: 'AI/기술',
      BUSINESS: '비즈니스',
      TECH: '테크',
      STARTUP: '스타트업',
      MARKETING: '마케팅',
      DESIGN: '디자인',
      CULTURE: '문화/예술',
      ECONOMY: '경제/금융',
      LIFESTYLE: '라이프스타일',
      EDUCATION: '교육',
      SCIENCE: '과학',
      HEALTH: '건강',
      ENTERTAINMENT: '엔터테인먼트',
      POLITICS: '정치',
      SPORTS: '스포츠',
    };

    return categoryLabels[category] || category;
  }

  /**
   * 지역 라벨 조회
   */
  private static getRegionLabel(region: string): string {
    const regionLabels: Record<string, string> = {
      KR: '한국',
      ROW: '글로벌',
    };

    return regionLabels[region] || region;
  }

  /**
   * 기본 필터 값
   */
  static getDefaultFilters(): DiscoverFilters {
    return {
      search: '',
      category: null,
      region: 'ALL',
      status: 'ALL',
      sortBy: 'subscribers',
      sortOrder: 'desc',
      page: 1,
      limit: 20,
    };
  }

  /**
   * URL 파라미터를 필터로 변환
   */
  static parseFiltersFromURL(searchParams: URLSearchParams): DiscoverFilters {
    const defaults = this.getDefaultFilters();

    return {
      search: searchParams.get('search') || defaults.search,
      category: searchParams.get('category') || defaults.category,
      region: (searchParams.get('region') as 'ALL' | 'KR' | 'ROW') || defaults.region,
      status: (searchParams.get('status') as 'ALL' | 'SUBSCRIBED' | 'NEW') || defaults.status,
      sortBy: (searchParams.get('sortBy') as any) || defaults.sortBy,
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || defaults.sortOrder,
      page: parseInt(searchParams.get('page') || String(defaults.page)),
      limit: parseInt(searchParams.get('limit') || String(defaults.limit)),
    };
  }

  /**
   * 필터를 URL 파라미터로 변환
   */
  static filtersToURLParams(filters: DiscoverFilters): URLSearchParams {
    const params = new URLSearchParams();

    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category', filters.category);
    if (filters.region !== 'ALL') params.set('region', filters.region);
    if (filters.status !== 'ALL') params.set('status', filters.status);
    if (filters.sortBy !== 'subscribers') params.set('sortBy', filters.sortBy);
    if (filters.sortOrder !== 'desc') params.set('sortOrder', filters.sortOrder);
    if (filters.page > 1) params.set('page', String(filters.page));
    if (filters.limit !== 20) params.set('limit', String(filters.limit));

    return params;
  }
}
