import { NewsletterSourceCard } from './NewsletterSourceCard';
import { NewsletterSourceSkeleton } from './NewsletterSourceSkeleton';
import type { NewsletterSourceWithStatus } from '../types';

interface NewsletterSourceGridProps {
  sources: NewsletterSourceWithStatus[];
  onSubscribe: (sourceId: string) => void;
  onUnsubscribe: (sourceId: string) => void;
  isLoading?: boolean;
  isSubmitting?: boolean;
  variant?: 'grid' | 'list';
}

export function NewsletterSourceGrid({
  sources,
  onSubscribe,
  onUnsubscribe,
  isLoading = false,
  isSubmitting = false,
  variant = 'grid',
}: NewsletterSourceGridProps) {
  // 로딩 상태
  if (isLoading && sources.length === 0) {
    return (
      <div
        className={
          variant === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-4'
        }
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <NewsletterSourceSkeleton key={i} />
        ))}
      </div>
    );
  }

  // 빈 상태
  if (sources.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto max-w-md">
          <h3 className="text-lg font-semibold mb-2">뉴스레터를 찾을 수 없습니다</h3>
          <p className="text-muted-foreground">필터를 조정하거나 검색어를 변경해보세요.</p>
        </div>
      </div>
    );
  }

  // 그리드/리스트 렌더링
  return (
    <div
      className={
        variant === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-4'
      }
    >
      {sources.map((source) => (
        <NewsletterSourceCard
          key={source.id}
          source={source}
          onSubscribe={onSubscribe}
          onUnsubscribe={onUnsubscribe}
          isSubmitting={isSubmitting}
        />
      ))}
    </div>
  );
}
