import { useFetcher, Link } from 'react-router';
import { useState, useCallback } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  Users,
  Clock,
  CheckCircle,
  Globe,
  Mail,
  Pause,
  Play,
  Flag,
  Share2,
  Calendar,
  TrendingUp,
  Tag,
} from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Card } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/common/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs';
import { NewsletterSourceCard } from '../components/NewsletterSourceCard';
import type { Route } from '../routes/+types/discover.$sourceId';

export default function NewsletterDetailPage({ loaderData }: Route.ComponentProps) {
  const { source, recentNewsletters, relatedSources } = loaderData;
  const fetcher = useFetcher();
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  const isSubscribed = source.isSubscribed;
  const isPaused = source.subscription?.isPaused;
  const isLoading = fetcher.state === 'submitting';

  const handleSubscribe = useCallback(() => {
    fetcher.submit({ intent: 'subscribe', sourceId: source.id }, { method: 'POST' });
  }, [fetcher, source.id]);

  const handleUnsubscribe = useCallback(() => {
    fetcher.submit({ intent: 'unsubscribe', sourceId: source.id }, { method: 'POST' });
  }, [fetcher, source.id]);

  const handlePause = useCallback(() => {
    fetcher.submit({ intent: 'pause', sourceId: source.id }, { method: 'POST' });
  }, [fetcher, source.id]);

  const handleResume = useCallback(() => {
    fetcher.submit({ intent: 'resume', sourceId: source.id }, { method: 'POST' });
  }, [fetcher, source.id]);

  const handleReport = useCallback(() => {
    if (!reportReason) return;

    fetcher.submit(
      {
        intent: 'report',
        sourceId: source.id,
        reason: reportReason,
        details: reportDetails,
      },
      { method: 'POST' },
    );

    setShowReportDialog(false);
    setReportReason('');
    setReportDetails('');
  }, [fetcher, source.id, reportReason, reportDetails]);

  const handleShare = useCallback(() => {
    const url = window.location.href;
    const text = `${source.name} 뉴스레터를 확인해보세요!`;

    if (navigator.share) {
      navigator.share({ title: source.name, text, url });
    } else {
      navigator.clipboard.writeText(url);
      // TODO: Show toast notification
    }
  }, [source.name]);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatRelativeTime = (date: Date | string) => {
    const now = new Date();
    const then = new Date(date);
    const diff = now.getTime() - then.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return '오늘';
    if (days === 1) return '어제';
    if (days < 7) return `${days}일 전`;
    if (days < 30) return `${Math.floor(days / 7)}주 전`;
    if (days < 365) return `${Math.floor(days / 30)}개월 전`;
    return `${Math.floor(days / 365)}년 전`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* 헤더 */}
      <div className="mb-6">
        <Link
          to="/discover"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          디스커버로 돌아가기
        </Link>

        <div className="flex items-start gap-6">
          {/* 로고 */}
          <Avatar className="h-24 w-24 flex-shrink-0">
            <AvatarImage src={source.logoUrl || undefined} alt={source.name} />
            <AvatarFallback className="text-2xl">
              {source.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* 기본 정보 */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{source.name}</h1>
              {source.isVerified && (
                <Badge variant="secondary">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  검증됨
                </Badge>
              )}
              {source.isFeatured && <Badge variant="default">추천</Badge>}
            </div>

            <p className="text-lg text-muted-foreground mb-4">{source.description}</p>

            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {source.subscriberCount.toLocaleString()} 구독자
              </span>
              {source.lastNewsletterAt && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  최근 발행: {formatRelativeTime(source.lastNewsletterAt)}
                </span>
              )}
              {source.category && (
                <Badge variant="outline">
                  <Tag className="w-3 h-3 mr-1" />
                  {source.category}
                </Badge>
              )}
              {source.region === 'KR' && <Badge variant="outline">🇰🇷 한국</Badge>}
            </div>

            {/* 액션 버튼 */}
            <div className="flex items-center gap-3">
              {!isSubscribed ? (
                <Button onClick={handleSubscribe} disabled={isLoading} size="lg">
                  구독하기
                </Button>
              ) : (
                <>
                  {isPaused ? (
                    <Button onClick={handleResume} disabled={isLoading} variant="default" size="lg">
                      <Play className="w-4 h-4 mr-2" />
                      구독 재개
                    </Button>
                  ) : (
                    <Button onClick={handlePause} disabled={isLoading} variant="outline" size="lg">
                      <Pause className="w-4 h-4 mr-2" />
                      일시정지
                    </Button>
                  )}
                  <Button
                    onClick={handleUnsubscribe}
                    disabled={isLoading}
                    variant="destructive"
                    size="lg"
                  >
                    구독 취소
                  </Button>
                </>
              )}

              {source.website && (
                <Button variant="outline" size="lg" asChild>
                  <a href={source.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="w-4 h-4 mr-2" />
                    웹사이트
                  </a>
                </Button>
              )}

              <Button variant="ghost" size="lg" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>

              <Button variant="ghost" size="lg" onClick={() => setShowReportDialog(true)}>
                <Flag className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <Tabs defaultValue="about" className="mt-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="about">소개</TabsTrigger>
          <TabsTrigger value="recent">최근 뉴스레터</TabsTrigger>
          <TabsTrigger value="stats">통계</TabsTrigger>
          <TabsTrigger value="related">연관 뉴스레터</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">상세 소개</h2>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">{source.fullDescription || source.description}</p>
            </div>

            {source.publisherInfo && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-3">발행자 정보</h3>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  {source.publisherInfo.founded && (
                    <>
                      <dt className="text-muted-foreground">설립</dt>
                      <dd>{source.publisherInfo.founded}</dd>
                    </>
                  )}
                  {source.publisherInfo.location && (
                    <>
                      <dt className="text-muted-foreground">위치</dt>
                      <dd>{source.publisherInfo.location}</dd>
                    </>
                  )}
                  {source.publisherInfo.team && (
                    <>
                      <dt className="text-muted-foreground">팀</dt>
                      <dd>{source.publisherInfo.team}</dd>
                    </>
                  )}
                </dl>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          <div className="space-y-4">
            {recentNewsletters.length > 0 ? (
              recentNewsletters.map((newsletter) => (
                <Card key={newsletter.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{newsletter.title}</h3>
                      {newsletter.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {newsletter.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(newsletter.publishedAt)}
                        </span>
                        {newsletter.readTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {newsletter.readTime}분 읽기
                          </span>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/letter/${newsletter.id}`}>
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center text-muted-foreground">
                아직 발행된 뉴스레터가 없습니다.
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">통계</h2>
            {source.stats ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">총 발행 수</p>
                    <p className="text-2xl font-bold">{source.stats.totalNewsletters || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">발행 주기</p>
                    <p className="text-2xl font-bold">{source.stats.avgFrequency || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">평균 길이</p>
                    <p className="text-2xl font-bold">{source.stats.avgLength || 0}분</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">구독자 증가</p>
                    <p className="text-2xl font-bold flex items-center">
                      <TrendingUp className="w-5 h-5 mr-1 text-green-500" />
                      +12%
                    </p>
                  </div>
                </div>
                {source.stats.popularTopics && source.stats.popularTopics.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-lg font-semibold mb-3">인기 주제</h3>
                    <div className="flex flex-wrap gap-2">
                      {source.stats.popularTopics.map((topic) => (
                        <Badge key={topic} variant="secondary">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">통계 정보가 아직 없습니다.</p>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="related" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedSources.length > 0 ? (
              relatedSources.map((relatedSource) => (
                <NewsletterSourceCard
                  key={relatedSource.id}
                  source={relatedSource}
                  onSubscribe={() => {}}
                  onUnsubscribe={() => {}}
                  variant="compact"
                />
              ))
            ) : (
              <Card className="col-span-2 p-8 text-center text-muted-foreground">
                연관된 뉴스레터가 없습니다.
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* 신고 다이얼로그 */}
      {showReportDialog && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">뉴스레터 신고</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">신고 사유</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">선택해주세요</option>
                  <option value="spam">스팸</option>
                  <option value="inappropriate">부적절한 콘텐츠</option>
                  <option value="misleading">오해의 소지가 있는 정보</option>
                  <option value="copyright">저작권 침해</option>
                  <option value="other">기타</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">상세 내용 (선택사항)</label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  rows={4}
                  placeholder="신고 사유를 자세히 설명해주세요..."
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowReportDialog(false)}>
                  취소
                </Button>
                <Button onClick={handleReport} disabled={!reportReason}>
                  신고하기
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
