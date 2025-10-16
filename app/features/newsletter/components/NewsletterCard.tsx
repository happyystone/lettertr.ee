import { useFetcher, Link } from 'react-router';
import { Theme, useTheme } from 'remix-themes';
import { Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react';

import { Card, CardHeader, CardContent, CardFooter } from '@/common/components/ui/card';
import { Button } from '@/common/components/ui/button';
import { Badge } from '@/common/components/ui/badge';
import { cn } from '@/lib/utils';

import { NEWSLETTER_NO_IMAGE_URL_SOURCE } from '../constants';
import { NewsletterColorBackground } from './NewsletterColorBackground';
import type { Newsletter } from '../types';

export function NewsletterCard({ newsletter }: { newsletter: Newsletter }) {
  const fetcher = useFetcher();
  const [theme] = useTheme();

  // 낙관적 UI 업데이트
  const optimisticBookmark = fetcher.formData?.get('intent') === 'bookmark';
  const optimisticRead = fetcher.formData?.get('intent') === 'markRead';
  const isBookmarked = optimisticBookmark
    ? !newsletter.userInteraction?.isBookmarked
    : newsletter.userInteraction?.isBookmarked;
  const isRead = optimisticRead
    ? !newsletter.userInteraction?.isRead
    : newsletter.userInteraction?.isRead;

  const handleBookmark = () => {
    fetcher.submit(
      { intent: 'bookmark' },
      {
        method: 'post',
        action: `/letter/${newsletter.id}`,
      },
    );
  };

  const handleMarkRead = () => {
    if (newsletter.userInteraction?.isRead) return;

    fetcher.submit(
      { intent: 'markRead' },
      {
        method: 'post',
        action: `/letter/${newsletter.id}`,
      },
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 이미지 표시 여부 결정
  const shouldShowImage =
    !NEWSLETTER_NO_IMAGE_URL_SOURCE.includes(newsletter.source?.name || '') &&
    newsletter.thumbnailUrl;

  return (
    <Card className="hover:shadow-lg hover:translate-y-[-4px] transition-all duration-200 ease-in-out flex-col justify-between pt-0">
      {/* FIXME: 카드 전체가 링크인게 낫지 않나?, 전체에 하면 UI 깨지긴 하는데, content, footer에 링크를 각각 달던가 */}
      {/* <Link to={`/letter/${newsletter.id}`} onClick={handleMarkRead}> */}
      <CardHeader className={cn('p-0', isRead && 'opacity-60')}>
        <a
          href={`/letter/${newsletter.id}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="뉴스레터 방문"
          onClick={handleMarkRead}
        >
          {shouldShowImage ? (
            <img
              src={newsletter.thumbnailUrl || ''}
              alt={newsletter.source?.name}
              className="w-full h-40 object-cover rounded-t-xl border-b border-gray-200 dark:border-gray-800"
            />
          ) : (
            <NewsletterColorBackground
              newsletterId={newsletter.id}
              sourceName={newsletter.source?.name}
              theme={theme === Theme.DARK ? 'dark' : 'light'}
            />
          )}
          <div className="flex items-start justify-between px-6 pt-6">
            <div className="flex-1">
              {/* <Link to={`/letter/${newsletter.id}`} onClick={handleMarkRead}> */}
              <h3 className="font-semibold text-lg line-clamp-2 break-all">{newsletter.subject}</h3>
              {/* </Link> */}
              <p className="text-sm text-muted-foreground mt-1">
                {newsletter.source?.name || 'Unknown'} • {formatDate(newsletter.receivedAt)}
              </p>
            </div>
          </div>
          {/* </Link> */}
        </a>
      </CardHeader>

      {(newsletter.tags.length > 0 || newsletter.excerpt) && (
        <CardContent className={cn(isRead && 'opacity-50')}>
          {newsletter.excerpt && (
            <p className="line-clamp-2 text-muted-foreground">{newsletter.excerpt}</p>
          )}
          {newsletter.tags.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap ml-[-3px]">
              {newsletter.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs min-w-fit">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      )}

      <CardFooter className={cn('flex items-center justify-between', isRead && 'opacity-50')}>
        <span className="text-sm text-muted-foreground min-w-fit">
          약 {newsletter.readTimeMinutes || 5}분 읽기
        </span>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            disabled={fetcher.state !== 'idle'}
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>

          <Button variant="ghost" size="sm" asChild>
            <a
              href={newsletter.originalUrl || ''}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="웹사이트 방문"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
