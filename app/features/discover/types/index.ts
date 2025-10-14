// 필터 타입
export interface DiscoverFilters {
  search: string;
  category: string | null;
  region: 'ALL' | 'KR' | 'ROW';
  status: 'ALL' | 'SUBSCRIBED' | 'NEW';
  sortBy: 'subscribers' | 'recent' | 'name' | 'activity';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

// 뉴스레터 소스 타입
export interface NewsletterSource {
  id: string;
  email: string;
  name: string;
  domain: string | null;
  description: string | null;
  category: string | null;
  logoUrl: string | null;
  website: string | null;
  subscribeUrl: string | null;
  isVerified: boolean;
  isFeatured: boolean;
  subscriberCount: number;
  isActive: boolean;
  region: 'KR' | 'ROW';
  totalNewsletters: number;
  lastNewsletterAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// 구독 상태를 포함한 뉴스레터 소스
export interface NewsletterSourceWithStatus extends NewsletterSource {
  isSubscribed: boolean;
  subscribedAt?: Date;
  recentNewsletters?: number;
  subscription?: {
    isPaused?: boolean;
    isActive?: boolean;
    subscriptionEmail?: string;
    preferences?: {
      frequency?: 'instant' | 'daily' | 'weekly';
      categories?: string[];
    };
  };
  stats?: {
    subscriberCount: number;
    recentGrowth: number;
    engagementRate: number;
    newsletterFrequency: string;
    totalNewsletters: number;
    popularTopics: string[];
    avgFrequency?: string;
    avgLength?: string;
  };
  publisherInfo?: {
    bio?: string;
    location?: string;
    twitter?: string;
    linkedin?: string;
    foundedYear?: number;
    founded?: string;
    team?: string;
  };
  fullDescription?: string;
}

// 카테고리 카운트
export interface CategoryCount {
  category: string;
  count: number;
  label: string;
}

// 지역 카운트
export interface RegionCount {
  region: string;
  count: number;
  label: string;
}

// 필터 카운트
export interface FilterCounts {
  categories: CategoryCount[];
  regions: RegionCount[];
  statuses: Record<string, number>;
  total: number;
}

// 페이지네이션
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasMore: boolean;
  limit: number;
}

// 디스커버 결과
export interface DiscoverSourcesResult {
  sources: NewsletterSourceWithStatus[];
  pagination: Pagination;
  filterCounts: FilterCounts;
  appliedFilters?: AppliedFilter[];
}

// 적용된 필터
export interface AppliedFilter {
  type: string;
  value: any;
}

// 저장된 필터
export interface SavedFilter {
  id: string;
  userId: string;
  name: string;
  filters: DiscoverFilters;
  createdAt: Date;
  usageCount?: number;
}

// 뉴스레터 컨텐츠
export interface Newsletter {
  id: string;
  sourceId: string;
  title: string;
  content?: string;
  excerpt?: string;
  publishedAt: Date;
  author?: string;
  tags?: string[];
}

// 사용자 선호도
export interface UserPreferences {
  categories: string[];
  region: 'KR' | 'ROW' | 'ALL';
  excludeSubscribed: boolean;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  digestFrequency?: 'daily' | 'weekly' | 'monthly';
  autoSubscribe?: boolean;
  showRecommendations?: boolean;
}

// 자동완성 제안
export interface AutocompleteSuggestion {
  id: string;
  name: string;
  category: string;
  logoUrl?: string;
  subscriberCount: number;
}

// 소스 통계
export interface SourceStats {
  subscriberCount: number;
  recentGrowth: number;
  engagementRate: number;
  newsletterFrequency: string;
  totalNewsletters: number;
}

// 카테고리 정의
export const CATEGORIES = {
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
} as const;

// 지역 라벨
export const REGION_LABELS = {
  ALL: '전체',
  KR: '한국',
  ROW: '글로벌',
} as const;

// 상태 라벨
export const STATUS_LABELS = {
  ALL: '전체',
  SUBSCRIBED: '구독중',
  NEW: '신규',
} as const;

// 정렬 옵션
export const SORT_OPTIONS = [
  { value: 'recent-desc', label: '최신순' },
  { value: 'subscribers-desc', label: '구독자 많은순' },
  { value: 'subscribers-asc', label: '구독자 적은순' },
  // { value: 'name-asc', label: '이름순' },
  // { value: 'activity-desc', label: '활동 많은순' },
] as const;
