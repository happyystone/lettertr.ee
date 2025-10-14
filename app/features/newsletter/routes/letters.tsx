import { generateMeta } from '@/lib/seo';

import { NewsletterRepository } from '../repositories/newsletter.repository';
import NewsletterListPage from '../pages/newsletter-list-page';
import type { Route } from './+types/letters';

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  // FIXME: CHATGPT 말대로 이상해지긴 하네
  const count = Number(url.searchParams.get('count')) || 20;
  const page = count > 20 ? 1 : Number(url.searchParams.get('page')) || 1;

  const filters = {
    tab: (url.searchParams.get('tab') || 'all') as 'all' | 'unread' | 'bookmarked' | 'archived',
    sortBy: (url.searchParams.get('sort') || 'latest') as
      | 'latest'
      | 'oldest'
      | 'sender'
      | 'readtime',
    searchQuery: url.searchParams.get('q') || '',
    page,
    limit: count,
  };

  const [newsletters, stats] = await Promise.all([
    NewsletterRepository.getFeed(request, filters),
    NewsletterRepository.getStats(request, filters),
  ]);
  const hasMore = filters.searchQuery
    ? filters.page * filters.limit < stats.total
    : filters.tab === 'all'
      ? filters.page * filters.limit < stats.total
      : filters.page * filters.limit < stats[filters.tab];

  // console.log(newsletters.map((n) => n.id));
  return { newsletters, stats, filters, hasMore };
}

export const meta: Route.MetaFunction = () => {
  return generateMeta({
    title: '뉴스레터 피드',
    description: '뉴스레터 피드를 확인해보세요.',
  });
};

export default NewsletterListPage;
