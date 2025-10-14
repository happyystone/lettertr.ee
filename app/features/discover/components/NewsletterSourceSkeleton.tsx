import { Card } from '@/common/components/ui/card';
import { Skeleton } from '@/common/components/ui/skeleton';

export function NewsletterSourceSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex gap-4">
        {/* 아바타 스켈레톤 */}
        <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />

        {/* 콘텐츠 스켈레톤 */}
        <div className="flex-1 space-y-3">
          {/* 제목 및 배지 */}
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-12" />
              </div>
            </div>
            <Skeleton className="h-8 w-8" />
          </div>

          {/* 설명 */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          {/* 하단 정보 */}
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>
    </Card>
  );
}
