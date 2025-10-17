import { useSearchParams, Form, useNavigation } from 'react-router';

import { Input } from '@/common/components/ui/input';
import { Button } from '@/common/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/common/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/ui/select';

import { LettersContent } from '../components/LettersContent';
import { NewsletterGridSkeleton } from '../components/NewsletterGridSkeleton';
import type { Route } from '../routes/+types/letters';

export default function NewsletterListPage({ loaderData }: Route.ComponentProps) {
  const { newsletters, stats, filters, hasMore } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();

  const isLoading = navigation.state === 'loading';

  // URL 파라미터로 필터 관리
  const handleTabChange = (tab: string) => {
    setSearchParams((prev) => {
      prev.set('tab', tab);
      prev.set('page', '1');

      return prev;
    });
  };

  const handleSort = (sort: string) => {
    setSearchParams((prev) => {
      prev.set('sort', sort);
      prev.set('page', '1');

      return prev;
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-start gap-4 justify-between mb-4 lg:mb-6 flex-col lg:flex-row lg:items-center">
        <h1 className="text-[28px] font-bold">뉴스레터 피드</h1>
        <Form method="get" className="flex gap-2">
          <Input
            name="q"
            defaultValue={filters.searchQuery}
            placeholder="제목, 내용 등 키워드를 검색해보세요"
            className="w-64 border-0"
          />
          {/* FIXME: debounce */}
          <Button type="submit">검색</Button>
        </Form>
      </div>

      <div className="flex items-center gap-2 justify-between mb-6">
        <Tabs value={filters.tab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="all">
              전체
              <span className="ml-2 bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                {stats.total}
              </span>
            </TabsTrigger>
            <TabsTrigger value="unread">
              읽지 않음
              <span className="ml-2 bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                {stats.unread}
              </span>
            </TabsTrigger>
            {/* <TabsTrigger value="bookmarked">
              즐겨찾기
              <span className="ml-2 bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                {stats.bookmarked}
              </span>
            </TabsTrigger> */}
            <TabsTrigger value="bookmarked">
              보관함
              <span className="ml-2 bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                {stats.bookmarked}
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Select value={filters.sortBy} onValueChange={handleSort}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">최신순</SelectItem>
            <SelectItem value="oldest">오래된순</SelectItem>
            {/* <SelectItem value="sender">발신자순</SelectItem>
            <SelectItem value="readtime">읽기시간순</SelectItem> */}
          </SelectContent>
        </Select>
      </div>

      {isLoading && newsletters.length === 0 ? (
        <NewsletterGridSkeleton />
      ) : (
        <LettersContent
          newsletters={newsletters}
          isLoading={isLoading}
          currentPage={Number(searchParams.get('page')) || 1}
          hasMore={hasMore} // hasMore 전달
        />
      )}
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">오류가 발생했습니다</h1>
        <p className="text-muted-foreground mb-4">뉴스레터를 불러오는 중 문제가 발생했습니다.</p>
        <button
          onClick={() => window.location.reload()}
          className="text-primary hover:underline cursor-pointer"
        >
          새로고침 하기
        </button>
      </div>
    </div>
  );
}
