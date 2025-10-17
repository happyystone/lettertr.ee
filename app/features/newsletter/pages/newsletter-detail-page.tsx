import type { Route } from '../routes/+types/letter.$id';
import { Link } from 'react-router';
import { useState } from 'react';
import { NewsletterContent } from '../components/NewsletterContent';
import { NewsletterActions } from '../components/NewsletterActions';
import { ReadingSettings } from '../components/ReadingSettings';
import { NewsletterNavigation } from '../components/NewsletterNavigation';
import { Separator } from '@/common/components/ui/separator';
import { ArrowLeft } from 'lucide-react';

// Component with Route.ComponentProps
export default function NewsletterDetailPage({ loaderData, actionData }: Route.ComponentProps) {
  const { newsletter, previousNewsletter, nextNewsletter } = loaderData;
  const [readingSettings, setReadingSettings] = useState({
    fontSize: 'medium' as const,
    lineHeight: 'normal' as const,
    width: 'normal' as const,
    focusMode: false,
  });

  // FIXME:
  // 키보드 네비게이션
  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     if (e.key === 'ArrowLeft' && previousNewsletter) {
  //       navigate(`/letter/${previousNewsletter.id}`);
  //     } else if (e.key === 'ArrowRight' && nextNewsletter) {
  //       navigate(`/letter/${nextNewsletter.id}`);
  //     } else if (e.key === 'Escape') {
  //       navigate('/letters');
  //     }
  //   };

  //   window.addEventListener('keydown', handleKeyDown);
  //   return () => window.removeEventListener('keydown', handleKeyDown);
  // }, [previousNewsletter, nextNewsletter, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      {!readingSettings.focusMode && (
        <header className="sticky top-0 bg-background/95 backdrop-blur border-b z-40">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link to="/letters" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>피드로 돌아가기</span>
                </Link>
                <Separator orientation="vertical" className="h-5" />
                <h1 className="font-semibold truncate max-w-md">{newsletter.subject}</h1>
              </div>

              <div className="flex items-center gap-2">
                <NewsletterActions
                  newsletterId={newsletter.id}
                  isBookmarked={newsletter.userInteraction?.isBookmarked}
                />
                {/* FIXME: */}
                {/* <ReadingSettings settings={readingSettings} onSettingsChange={setReadingSettings} /> */}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* 메인 컨텐츠 */}
      <NewsletterContent newsletter={newsletter} readingSettings={readingSettings} />

      {/* 네비게이션 */}
      {!readingSettings.focusMode && (
        <NewsletterNavigation previous={previousNewsletter} next={nextNewsletter} />
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
