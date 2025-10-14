import { useFetcher } from 'react-router';
import { Bookmark, BookmarkCheck, Share2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/common/components/ui/button';
import { ModeToggle } from '@/common/components/mode-toggle';
import { cn } from '@/lib/utils';

interface NewsletterActionsProps {
  newsletterId: string;
  isBookmarked?: boolean;
}

export function NewsletterActions({ newsletterId, isBookmarked }: NewsletterActionsProps) {
  const fetcher = useFetcher();

  const handleBookmark = () => {
    fetcher.submit({ intent: 'bookmark' }, { method: 'post' });
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: '뉴스레터 공유',
          url,
        });
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('링크가 복사되었습니다');
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          'relative size-10 overflow-hidden rounded-full',
          isBookmarked && 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
        )}
        onClick={handleBookmark}
        disabled={fetcher.state !== 'idle'}
      >
        {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      </Button>
      <ModeToggle />
      {/* FIXME: */}
      {/* <Button variant="ghost" size="sm" onClick={handleShare}>
        <Share2 className="h-4 w-4" />
      </Button> */}
    </>
  );
}
