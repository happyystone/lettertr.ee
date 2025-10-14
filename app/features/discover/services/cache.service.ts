import { LRUCache } from 'lru-cache';
import crypto from 'crypto';

interface CacheOptions {
  ttl?: number;
  staleWhileRevalidate?: boolean;
}

class CacheService {
  private static instance: CacheService;
  private cache: LRUCache<string, any>;

  constructor() {
    this.cache = new LRUCache({
      max: 500, // 최대 500개 항목
      ttl: 1000 * 60 * 5, // 기본 5분
      allowStale: true,
      updateAgeOnGet: true,
      updateAgeOnHas: true,
    });
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * 캐시 키 생성
   */
  static getCacheKey(prefix: string, ...parts: any[]): string {
    const data = JSON.stringify(parts);
    const hash = crypto.createHash('md5').update(data).digest('hex');
    return `${prefix}:${hash}`;
  }

  /**
   * 캐시 조회 또는 설정
   */
  static async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    options: CacheOptions = {},
  ): Promise<T> {
    const instance = CacheService.getInstance();

    // 캐시 확인
    const cached = instance.cache.get(key);
    if (cached !== undefined) {
      // Stale-while-revalidate 패턴
      if (options.staleWhileRevalidate && instance.isStale(key)) {
        instance.revalidateInBackground(key, factory);
      }
      return cached;
    }

    // 캐시 미스 - 데이터 생성
    const result = await factory();

    // 캐시 저장
    instance.cache.set(key, result, { ttl: options.ttl });

    return result;
  }

  /**
   * 패턴 기반 캐시 무효화
   */
  static invalidatePattern(pattern: string) {
    const instance = CacheService.getInstance();
    const regex = new RegExp(pattern.replace('*', '.*'));
    const keys = [...instance.cache.keys()];

    keys.filter((key) => regex.test(key)).forEach((key) => instance.cache.delete(key));
  }

  /**
   * 특정 키 무효화
   */
  static invalidate(key: string) {
    const instance = CacheService.getInstance();
    instance.cache.delete(key);
  }

  /**
   * 전체 캐시 초기화
   */
  static clear() {
    const instance = CacheService.getInstance();
    instance.cache.clear();
  }

  /**
   * 캐시 상태 확인
   */
  private isStale(key: string): boolean {
    const ttl = this.cache.getRemainingTTL(key);
    const item = this.cache.get(key, { allowStale: true });

    if (!item) return true;

    // TTL의 50% 이상 경과시 stale로 판단
    const maxTTL = 1000 * 60 * 5; // 5분 기본값
    return ttl < maxTTL * 0.5;
  }

  /**
   * 백그라운드 재검증
   */
  private async revalidateInBackground<T>(key: string, factory: () => Promise<T>) {
    // 비동기로 백그라운드에서 실행
    setImmediate(async () => {
      try {
        const result = await factory();
        this.cache.set(key, result);
      } catch (error) {
        console.error(`Failed to revalidate cache for key: ${key}`, error);
      }
    });
  }

  /**
   * 캐시 통계
   */
  static getStats() {
    const instance = CacheService.getInstance();
    return {
      size: instance.cache.size,
      calculatedSize: instance.cache.calculatedSize,
      keys: [...instance.cache.keys()],
    };
  }
}

export { CacheService };
