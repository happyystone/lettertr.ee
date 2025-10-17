import { useFetcher, useSearchParams, Link } from 'react-router';
import { useState, useEffect, useCallback } from 'react';
import { Loader2, Check } from 'lucide-react';

import { Button } from '@/common/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/common/components/ui/alert-dialog';
import { EmailCopy } from '@/features/dashboard/components/email-copy';

import { NewsletterSourceGrid } from '../components/NewsletterSourceGrid';
import { FilterBar } from '../components/FilterBar';
import { DiscoverHeader } from '../components/DiscoverHeader';
import { useLoadMore } from '../hooks/useLoadMore';
import type { DiscoverFilters } from '../types';
import type { Route } from '../routes/+types/discover';

// FIXME: 추가 페이지 로딩 중복 제거 필요, 리팩토링 필요
export default function DiscoverPage({ loaderData: data }: Route.ComponentProps) {
  const fetcher = useFetcher();
  const [searchParams, setSearchParams] = useSearchParams();

  const [displaySources, setDisplaySources] = useState(data.sources);
  const { loadNextPage, isLoadingMore, canLoadMore } = useLoadMore(
    data.filters.page,
    data.pagination.hasMore,
  );

  // 페이지가 1일 때는 새로운 데이터로 초기화, 그 외에는 누적
  useEffect(() => {
    if (data.filters.page === 1) {
      // 첫 페이지이거나 필터가 변경된 경우 - 새로운 데이터로 초기화
      setDisplaySources(data.sources);
    } else {
      // 추가 페이지 - 기존 데이터에 새 데이터 추가
      setDisplaySources((prev) => {
        // 중복 제거를 위해 기존 ID들을 Set으로 관리
        const existingIds = new Set(prev.map((n) => n.id));
        const newNewsletters = data.sources.filter((n) => !existingIds.has(n.id));
        return [...prev, ...newNewsletters];
      });
    }
  }, [data.sources, data.filters.page]);

  const isSubmitting = fetcher.state === 'submitting';

  // 구독 처리 (Optimistic Update)
  const handleSubscribe = useCallback(
    (sourceId: string) => {
      // 1. Optimistic UI 업데이트
      setDisplaySources((prev) =>
        prev.map((source) =>
          source.id === sourceId
            ? {
                ...source,
                isSubscribed: true,
                subscriberCount: source.subscriberCount + 1,
              }
            : source,
        ),
      );

      // 2. 서버 요청
      fetcher.submit({ intent: 'subscribe', sourceId }, { method: 'POST' });
    },
    [fetcher],
  );

  // 구독 취소 처리
  const handleUnsubscribe = useCallback(
    (sourceId: string) => {
      // 1. Optimistic UI 업데이트
      setDisplaySources((prev) =>
        prev.map((source) =>
          source.id === sourceId
            ? {
                ...source,
                isSubscribed: false,
                subscriberCount: Math.max(0, source.subscriberCount - 1),
              }
            : source,
        ),
      );

      // 2. 서버 요청
      fetcher.submit({ intent: 'unsubscribe', sourceId }, { method: 'POST' });
    },
    [fetcher],
  );

  // 필터 변경 처리
  const handleFilterChange = useCallback(
    (updates: Partial<DiscoverFilters>) => {
      const params = new URLSearchParams(searchParams);

      // 필터 업데이트
      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === null ||
          value === '' ||
          value === undefined ||
          (typeof value === 'boolean' && value === false)
        ) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      // 페이지 리셋
      if (!updates.page) {
        params.set('page', '1');
      }

      setSearchParams(params, { preventScrollReset: true });
    },
    [searchParams, setSearchParams],
  );

  // 검색 처리 (디바운싱)
  const handleSearch = useCallback(
    (search: string) => {
      handleFilterChange({ search });
    },
    [handleFilterChange],
  );

  const handleOnboarded = useCallback(() => {
    fetcher.submit({ userId: data.user.id }, { method: 'POST', action: '/api/onboarding' });
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      {/* 헤더 */}
      <DiscoverHeader onSearch={handleSearch} currentSearch={data.filters.search} />

      {/* 필터 바 */}
      <div>
        <FilterBar
          filters={data.filters}
          filterCounts={data.filterCounts}
          categories={data.categories}
          onChange={handleFilterChange}
        />
      </div>

      <AlertDialog open={!data.user.isOnboarded}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="mb-2 flex items-center">
              Lettertree에 오신 것을 환영합니다.
            </AlertDialogTitle>
            <AlertDialogDescription className="pl-1 mb-2">
              아래 적힌 이메일을 복사 후 원하시는 뉴스레터를 구독해보세요.
              <br />
              구독하신 뉴스레터는 자동으로 피드에 도착합니다.
            </AlertDialogDescription>
            <EmailCopy
              email={data.user.lettertreeEmail}
              isOnboarded={data.user.isOnboarded}
              userId={data.user.id}
              noTooltip={true}
              noMailIcon={true}
              disableOnboarding={true}
            />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="default" autoFocus={false} onClick={handleOnboarded}>
              <Check className="w-4 h-4 mr-2" />
              확인했어요
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 메인 콘텐츠 */}
      <main className="py-8">
        {/* 추천 섹션 */}
        {/* {data.recommendations && data.recommendations.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">추천 뉴스레터</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.recommendations.map((source) => (
                <NewsletterSourceCard
                  key={source.id}
                  source={source}
                  onSubscribe={handleSubscribe}
                  onUnsubscribe={handleUnsubscribe}
                  variant="compact"
                />
              ))}
            </div>
          </section>
        )} */}

        {/* 뉴스레터 그리드 */}
        <NewsletterSourceGrid
          sources={displaySources}
          onSubscribe={handleSubscribe}
          onUnsubscribe={handleUnsubscribe}
          isLoading={isLoadingMore}
          isSubmitting={isSubmitting}
        />

        {/* 더 보기 버튼 */}
        {data.pagination.hasMore && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={loadNextPage}
              disabled={!canLoadMore}
              variant="outline"
              size="lg"
              className="min-w-32"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                  로딩 중...
                </>
              ) : (
                '더 보기'
              )}
            </Button>
          </div>
        )}

        {/* 빈 상태 */}
        {/* {displaySources.length === 0 && !isNavigating && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">검색 결과가 없습니다.</p>
            <button onClick={() => setSearchParams({})} className="text-primary hover:underline">
              필터 초기화
            </button>
          </div>
        )} */}
      </main>
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
