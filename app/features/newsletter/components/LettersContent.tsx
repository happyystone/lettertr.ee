import { useState, useEffect } from 'react';
import { NewsletterCard } from './NewsletterCard';
import { useLoadMore } from '../hooks/useLoadMore';
import type { Newsletter } from '../types';
import { Loader2 } from 'lucide-react';
import { Button } from '@/common/components/ui/button';

interface FeedContentProps {
  newsletters: Newsletter[];
  isLoading: boolean;
  currentPage: number;
  hasMore?: boolean;
}

export function LettersContent({
  newsletters,
  isLoading,
  currentPage,
  hasMore = true,
}: FeedContentProps) {
  const [displayNewsletters, setDisplayNewsletters] = useState<Newsletter[]>([]);
  const { loadNextPage, isLoadingMore, canLoadMore } = useLoadMore(currentPage, hasMore);

  // 페이지가 1일 때는 새로운 데이터로 초기화, 그 외에는 누적
  useEffect(() => {
    if (currentPage === 1) {
      // 첫 페이지이거나 필터가 변경된 경우 - 새로운 데이터로 초기화
      setDisplayNewsletters(newsletters);
    } else {
      // 추가 페이지 - 기존 데이터에 새 데이터 추가
      setDisplayNewsletters((prev) => {
        // 중복 제거를 위해 기존 ID들을 Set으로 관리
        const existingIds = new Set(prev.map((n) => n.id));
        const newNewsletters = newsletters.filter((n) => !existingIds.has(n.id));
        return [...prev, ...newNewsletters];
      });
    }
  }, [newsletters, currentPage]);

  if (displayNewsletters.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">표시할 뉴스레터가 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7">
        {displayNewsletters.map((newsletter) => (
          <NewsletterCard key={newsletter.id} newsletter={newsletter} />
        ))}
      </div>

      {/* 더보기 버튼 */}
      {hasMore && (
        <div className="flex justify-center py-8">
          <Button
            onClick={loadNextPage}
            disabled={!canLoadMore}
            variant="outline"
            size="lg"
            className="min-w-32"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                로딩 중...
              </>
            ) : (
              '더보기'
            )}
          </Button>
        </div>
      )}

      {/* 마지막 페이지 표시 */}
      {!hasMore && displayNewsletters.length > 0 && (
        <div className="text-center py-8">
          {/* <p className="text-muted-foreground text-sm">모든 뉴스레터를 확인했습니다.</p> */}
        </div>
      )}
    </>
  );
}
