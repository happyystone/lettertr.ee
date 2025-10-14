import { useState } from 'react';
import { Link } from 'react-router';
import { Card } from '@/common/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/common/components/ui/avatar';
import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import { Star, Users, ExternalLink, Check, Plus, Loader2 } from 'lucide-react';
import type { NewsletterSourceWithStatus } from '../types';
import { CATEGORIES } from '../types';

interface NewsletterSourceCardProps {
  source: NewsletterSourceWithStatus;
  onSubscribe: (sourceId: string) => void;
  onUnsubscribe: (sourceId: string) => void;
  isSubmitting?: boolean;
  variant?: 'default' | 'compact'; // FIXME: 이건 머임 대체 ㅋㅋ
}

export function NewsletterSourceCard({
  source,
  onSubscribe,
  onUnsubscribe,
  isSubmitting = false,
  variant = 'default',
}: NewsletterSourceCardProps) {
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscriptionToggle = async () => {
    setIsSubscribing(true);
    try {
      if (source.isSubscribed) {
        await onUnsubscribe(source.id);
      } else {
        await onSubscribe(source.id);
      }
    } finally {
      setIsSubscribing(false);
    }
  };

  const formatSubscriberCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  if (variant === 'compact') {
    return (
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 flex-shrink-0 border-1 border-gray-200">
            <AvatarImage
              className="object-contain"
              src={source.logoUrl || undefined}
              alt={source.name}
            />
            <AvatarFallback>{source.name[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <Link
                  to={`/discover/${source.id}`}
                  className="font-medium hover:underline flex items-center gap-1"
                >
                  {source.name}
                </Link>

                <div className="flex items-center gap-2 mt-2">
                  {source.category && (
                    <Badge variant="outline" className="text-xs mt-1">
                      {CATEGORIES[source.category as keyof typeof CATEGORIES] || source.category}
                    </Badge>
                  )}
                  {source.isFeatured && (
                    <Badge className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      추천
                    </Badge>
                  )}
                </div>
              </div>

              <Button
                variant={source.isSubscribed ? 'outline' : 'default'}
                size="sm"
                onClick={handleSubscriptionToggle}
                disabled={isSubscribing || isSubmitting}
                className="flex-shrink-0 min-w-[80px]"
                asChild
              >
                <Link to={source.subscribeUrl || ''}>
                  {isSubscribing ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : source.isSubscribed ? (
                    <>
                      <Check className="w-3 h-3 mr-1" />
                      구독중
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3 mr-1" />
                      구독
                    </>
                  )}
                </Link>
              </Button>
            </div>

            {source.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                {source.description}
              </p>
            )}

            <div className="flex items-center gap-3 mt-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {formatSubscriberCount(source.subscriberCount)} 구독자
              </span>
              {source.region === 'KR' && (
                <span className="text-blue-600 dark:text-blue-400">🇰🇷 한국</span>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow relative h-full flex flex-col">
      <div className="flex gap-4 flex-1">
        {/* 로고/아바타 */}
        <Avatar className="h-16 w-16 flex-shrink-0 border-1 border-gray-200">
          <AvatarImage
            className="object-contain"
            src={source.logoUrl || undefined}
            alt={source.name}
          />
          <AvatarFallback className="text-lg">
            {source.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* 콘텐츠 영역 */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* 헤더 */}
          <div className="flex items-center h-7 justify-between gap-2">
            <div className="flex-1">
              <a
                href={source.website || ''}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-lg flex items-center gap-2"
              >
                <div className="font-semibold text-lg flex items-center gap-2">
                  <span className="hover:underline">{source.name}</span>
                  <div className="flex gap-2">
                    {source.category && (
                      <Badge variant="outline" className="text-xs">
                        {CATEGORIES[source.category as keyof typeof CATEGORIES] || source.category}
                      </Badge>
                    )}
                  </div>
                </div>
              </a>
            </div>
            {/* {source.website && (
              <Button variant="ghost" size="icon" asChild className="flex-shrink-0">
                <a
                  href={source.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="웹사이트 방문"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </Button>
            )} */}
          </div>

          {/* 설명 - flex-1로 남은 공간 채우기 */}
          <div className="flex-1 flex flex-col">
            {source.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {source.description}
              </p>
            )}
          </div>

          {/* 하단 정보 및 액션 - mt-auto로 하단 고정 */}
          <div className="flex items-center justify-between mt-auto pt-3">
            {/* 구독자 수 및 최근 활동 */}
            <div className="min-h-[34px] flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {formatSubscriberCount(source.subscriberCount)} 구독자
              </span>
            </div>

            {source.isSubscribed ? (
              <Badge className="text-xs px-4 py-2" variant="outline">
                <Check className="w-4 h-4 mr-2" />
                구독중
              </Badge>
            ) : (
              <Button
                asChild
                variant={source.isSubscribed ? 'outline' : 'default'}
                size="sm"
                // onClick={handleSubscriptionToggle}
                // disabled={isSubscribing || isSubmitting}
                className="min-w-[100px] font-semibold"
              >
                <a
                  href={source.subscribeUrl || ''}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="구독하기"
                >
                  {/* <Plus className="w-4 h-4 mr-2" /> */}
                  <ExternalLink className="w-4 h-4 mr-2" />
                  구독하기
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
