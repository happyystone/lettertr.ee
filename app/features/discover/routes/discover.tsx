import { redirect } from 'react-router';

import { DiscoverService } from '@/features/discover/services/discover.service';
import type { DiscoverFilters } from '@/features/discover/types';
import DiscoverPage from '@/features/discover/pages/discover-page';
import { generateMeta } from '@/lib/seo';
import { auth } from '@/lib/auth/auth-server';

import type { Route } from './+types/discover';

export async function loader({ request }: Route.LoaderArgs) {
  const session = await auth.api.getSession({
    headers: request.headers,
    query: { disableCookieCache: true },
  });

  if (!session?.user) {
    throw redirect('/auth/sign-in');
  }
  const url = new URL(request.url);
  const count = Number(url.searchParams.get('count')) || 20;
  const page = count > 20 ? 1 : Number(url.searchParams.get('page')) || 1;

  const filters: DiscoverFilters = {
    search: url.searchParams.get('search') || '',
    category: url.searchParams.get('category') || null,
    region: (url.searchParams.get('region') as 'ALL' | 'KR' | 'ROW') || 'ALL',
    status: (url.searchParams.get('status') as 'ALL' | 'SUBSCRIBED' | 'NEW') || 'ALL',
    sortBy: (url.searchParams.get('sortBy') as any) || 'recent',
    sortOrder: (url.searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    page,
    limit: count,
  };

  const [discoverData, categories] = await Promise.all([
    DiscoverService.discoverSources(request, session.user.id, filters),
    DiscoverService.getCategories(request),
    // DiscoverService.getRecommendations(request, 5),
  ]);
  const hasMore = filters.search
    ? filters.page * filters.limit < discoverData.filterCounts?.statuses?.ALL
    : filters.category === 'ALL'
      ? filters.page * filters.limit < discoverData.filterCounts?.statuses?.ALL
      : filters.page * filters.limit < discoverData.filterCounts?.statuses?.[filters.status];

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      isOnboarded: session.user.isOnboarded || false,
      lettertreeEmail: session.user.lettertreeEmail,
    },
    ...discoverData,
    categories,
    // recommendations,
    filters, // 현재 필터 상태 반환
    hasMore,
  };
}

export async function action({ request }: Route.ActionArgs) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    throw redirect('/auth/sign-in');
  }

  // 2. FormData 파싱
  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  // 3. Intent별 처리
  try {
    switch (intent) {
      case 'subscribe': {
        const sourceId = formData.get('sourceId') as string;
        const result = await DiscoverService.subscribe(request, session.user.id, sourceId);
        return { success: true, action: 'subscribe', ...result };
      }

      case 'unsubscribe': {
        const sourceId = formData.get('sourceId') as string;
        const result = await DiscoverService.unsubscribe(request, session.user.id, sourceId);
        return { success: true, action: 'unsubscribe', ...result };
      }

      case 'bulk-subscribe': {
        const sourceIds = JSON.parse(formData.get('sourceIds') as string);
        const result = await DiscoverService.bulkSubscribe(request, session.user.id, sourceIds);
        return { success: true, action: 'bulk-subscribe', ...result };
      }

      case 'save-filter': {
        const name = formData.get('name') as string;
        const filters = JSON.parse(formData.get('filters') as string);
        const result = await DiscoverService.saveFilter(request, name, filters);
        return { success: true, action: 'save-filter', ...result };
      }

      default:
        throw new Error(`Unknown intent: ${intent}`);
    }
  } catch (error) {
    console.error('Action error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export const meta: Route.MetaFunction = ({ loaderData, location }) => {
  const url = new URL(`https://lettertr.ee${location.pathname}${location.search}`);
  const sourcesCount = loaderData?.sources?.length || 0;
  const category = url.searchParams.get('category');

  const title = category ? `${category} 뉴스레터 발견하기` : '뉴스레터 발견하기';

  const description = category
    ? `${category} 카테고리의 인기 뉴스레터를 발견하고 구독하세요. ${sourcesCount}개 이상의 엄선된 뉴스레터가 준비되어 있습니다.`
    : `다양한 분야의 ${sourcesCount}개 이상의 뉴스레터를 발견하고 구독하세요. 당신에게 꼭 맞는 뉴스레터를 찾아보세요.`;

  return generateMeta({
    title,
    description,
    keywords: [
      '뉴스레터 발견',
      '뉴스레터 탐색',
      '뉴스레터 카테고리',
      '인기 뉴스레터',
      '추천 뉴스레터',
      category,
    ].filter(Boolean) as string[],
    image: 'https://lettertr.ee/og-image.png',
    url: url.href,
    type: 'website',
    canonical: `https://lettertr.ee/discover${category ? `?category=${category}` : ''}`,
  });
};

// 핸들 설정 (breadcrumb 등)
export const handle = {
  breadcrumb: () => '디스커버',
  title: '뉴스레터 탐색',
};

export default DiscoverPage;
export { ErrorBoundary } from '@/features/discover/pages/discover-page';
