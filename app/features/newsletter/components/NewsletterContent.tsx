import { useEffect, useRef } from 'react';
import { Globe, Clock } from 'lucide-react';

import { Card, CardContent } from '@/common/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/common/components/ui/avatar';
import { Badge } from '@/common/components/ui/badge';
import { cn } from '@/lib/utils';

import type { Newsletter } from '../types';

interface NewsletterContentProps {
  newsletter: Newsletter;
  readingSettings: {
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    lineHeight: 'compact' | 'normal' | 'relaxed';
    width: 'narrow' | 'normal' | 'wide';
    focusMode: boolean;
  };
}

export function NewsletterContent({ newsletter, readingSettings }: NewsletterContentProps) {
  const shadowHostRef = useRef<HTMLDivElement>(null);
  const getWidthClass = () => {
    switch (readingSettings.width) {
      case 'narrow':
        return 'max-w-2xl';
      case 'wide':
        return 'max-w-6xl';
      default:
        return 'max-w-4xl';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  // FIXME: 리팩토링, 커스텀 hook 등
  useEffect(() => {
    if (shadowHostRef.current && newsletter.htmlContent) {
      // Shadow DOM 생성
      // const shadowRoot = shadowHostRef.current.attachShadow({ mode: 'open' });
      let shadowRoot: ShadowRoot;

      // Shadow DOM이 이미 있는지 확인
      if (shadowHostRef.current.shadowRoot) {
        shadowRoot = shadowHostRef.current.shadowRoot;
        // 기존 내용 제거
        shadowRoot.innerHTML = '';
      } else {
        // 새로운 Shadow DOM 생성
        shadowRoot = shadowHostRef.current.attachShadow({ mode: 'open' });
      }

      // HTML을 파싱해서 head와 body 분리
      const parser = new DOMParser();
      const doc = parser.parseFromString(newsletter.htmlContent, 'text/html');

      // 스타일 추출
      const styles = doc.querySelectorAll('style');
      styles.forEach((style) => {
        shadowRoot.appendChild(style.cloneNode(true));
      });

      // body 내용 추가
      const bodyElement = doc.body.cloneNode(true) as HTMLBodyElement;
      shadowRoot.appendChild(bodyElement);
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (shadowHostRef.current?.shadowRoot) {
        shadowHostRef.current.shadowRoot.innerHTML = '';
      }
    };
  }, [newsletter.htmlContent]);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className={cn('mx-auto', getWidthClass())}>
        {/* 메타데이터 */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="h-12 w-12 border-1 border-gray-200">
                {newsletter.source?.logoUrl && (
                  <AvatarImage className="object-contain" src={newsletter.source.logoUrl} />
                )}
                <AvatarFallback>
                  {newsletter.source?.name?.substring(0, 2).toUpperCase() || 'UN'}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-semibold">{newsletter.source?.name || 'Unknown'}</h2>
                  {newsletter.source?.category && (
                    <Badge variant="secondary">{newsletter.source.category}</Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {formatDate(newsletter.receivedAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />약 {newsletter.readTimeMinutes || 5}분 읽기
                  </span>
                </div>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold mb-3">{newsletter.subject}</h1>

            {newsletter.excerpt && (
              <p className="text-lg text-muted-foreground mb-4">{newsletter.excerpt}</p>
            )}

            {newsletter.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {newsletter.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-8">
            {newsletter.htmlContent ? (
              <div ref={shadowHostRef} className="w-full bg-card" />
            ) : (
              <div className="p-8">
                <p className="text-center text-muted-foreground">
                  뉴스레터 콘텐츠를 불러올 수 없습니다.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
