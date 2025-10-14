import { useFetcher, Link } from 'react-router';
import { useState, useCallback } from 'react';
import {
  ArrowLeft,
  Download,
  Upload,
  Trash2,
  Save,
  RefreshCw,
  Filter,
  Bell,
  Mail,
  Calendar,
  Loader2,
  AlertCircle,
  Check,
} from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Card } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Switch } from '@/common/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/ui/select';
import type { Route } from '../routes/+types/discover.settings';

export default function DiscoverSettingsPage({ loaderData }: Route.ComponentProps) {
  const { subscriptionStats, userPreferences, savedFilters } = loaderData;
  const fetcher = useFetcher();

  const [preferences, setPreferences] = useState(userPreferences);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importFormat, setImportFormat] = useState<'csv' | 'json' | 'opml'>('csv');
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'opml'>('csv');

  const isLoading = fetcher.state === 'submitting';
  const isSaved = fetcher.state === 'idle' && fetcher.data?.success;

  const handlePreferenceChange = useCallback((key: string, value: string | boolean | number) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSavePreferences = useCallback(() => {
    fetcher.submit(
      {
        intent: 'updatePreferences',
        preferences: JSON.stringify(preferences),
      },
      { method: 'POST' },
    );
  }, [fetcher, preferences]);

  const handleDeleteFilter = useCallback(
    (filterId: string) => {
      fetcher.submit(
        {
          intent: 'deleteFilter',
          filterId,
        },
        { method: 'POST' },
      );
    },
    [fetcher],
  );

  const handleExportSubscriptions = useCallback(() => {
    fetcher.submit(
      {
        intent: 'exportSubscriptions',
        format: exportFormat,
      },
      { method: 'POST' },
    );
  }, [fetcher, exportFormat]);

  const handleImportSubscriptions = useCallback(() => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('intent', 'importSubscriptions');
    formData.append('file', selectedFile);
    formData.append('format', importFormat);

    fetcher.submit(formData, { method: 'POST' });
    setSelectedFile(null);
  }, [fetcher, selectedFile, importFormat]);

  const handleClearAllSubscriptions = useCallback(() => {
    if (deleteConfirmText !== 'DELETE_ALL_SUBSCRIPTIONS') return;

    fetcher.submit(
      {
        intent: 'clearAllSubscriptions',
        confirmation: deleteConfirmText,
      },
      { method: 'POST' },
    );

    setShowDeleteConfirm(false);
    setDeleteConfirmText('');
  }, [fetcher, deleteConfirmText]);

  const handleResetPreferences = useCallback(() => {
    fetcher.submit({ intent: 'resetPreferences' }, { method: 'POST' });
  }, [fetcher]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 헤더 */}
      <div className="mb-6">
        <Link
          to="/discover"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          디스커버로 돌아가기
        </Link>

        <h1 className="text-3xl font-bold mb-2">디스커버 설정</h1>
        <p className="text-muted-foreground">구독 관리 및 개인화 설정을 관리합니다.</p>
      </div>

      {/* 구독 통계 */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">구독 현황</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold">{subscriptionStats.total}</p>
            <p className="text-sm text-muted-foreground">전체 구독</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{subscriptionStats.active}</p>
            <p className="text-sm text-muted-foreground">활성 구독</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600">{subscriptionStats.paused}</p>
            <p className="text-sm text-muted-foreground">일시정지</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-600">{subscriptionStats.canceled}</p>
            <p className="text-sm text-muted-foreground">취소됨</p>
          </div>
        </div>
      </Card>

      {/* 탭 설정 */}
      <Tabs defaultValue="preferences" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="preferences">알림 설정</TabsTrigger>
          <TabsTrigger value="filters">저장된 필터</TabsTrigger>
          <TabsTrigger value="import-export">가져오기/내보내기</TabsTrigger>
          <TabsTrigger value="danger">데이터 관리</TabsTrigger>
        </TabsList>

        {/* 알림 설정 */}
        <TabsContent value="preferences">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">알림 설정</h2>

            <div className="space-y-6">
              {/* 이메일 알림 */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="text-base">
                    이메일 알림
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    새로운 뉴스레터 발행 시 이메일로 알림을 받습니다.
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange('emailNotifications', checked)
                  }
                />
              </div>

              {/* 푸시 알림 */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications" className="text-base">
                    푸시 알림
                  </Label>
                  <p className="text-sm text-muted-foreground">브라우저 푸시 알림을 받습니다.</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={preferences.pushNotifications}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange('pushNotifications', checked)
                  }
                />
              </div>

              {/* 다이제스트 빈도 */}
              <div>
                <Label htmlFor="digest-frequency" className="text-base mb-2 block">
                  다이제스트 빈도
                </Label>
                <Select
                  value={preferences.digestFrequency}
                  onValueChange={(value) => handlePreferenceChange('digestFrequency', value)}
                >
                  <SelectTrigger id="digest-frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">즉시</SelectItem>
                    <SelectItem value="daily">매일</SelectItem>
                    <SelectItem value="weekly">매주</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 자동 구독 */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-subscribe" className="text-base">
                    추천 자동 구독
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    관심사 기반 추천 뉴스레터를 자동으로 구독합니다.
                  </p>
                </div>
                <Switch
                  id="auto-subscribe"
                  checked={preferences.autoSubscribe}
                  onCheckedChange={(checked) => handlePreferenceChange('autoSubscribe', checked)}
                />
              </div>

              {/* 추천 표시 */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-recommendations" className="text-base">
                    추천 표시
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    디스커버 페이지에 추천 뉴스레터를 표시합니다.
                  </p>
                </div>
                <Switch
                  id="show-recommendations"
                  checked={preferences.showRecommendations}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange('showRecommendations', checked)
                  }
                />
              </div>

              {/* 저장 버튼 */}
              <div className="pt-4 border-t">
                <Button onClick={handleSavePreferences} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : isSaved ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {isSaved ? '저장됨' : '설정 저장'}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 저장된 필터 */}
        <TabsContent value="filters">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">저장된 필터</h2>

            {savedFilters.length > 0 ? (
              <div className="space-y-3">
                {savedFilters.map((filter) => (
                  <div
                    key={filter.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{filter.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {filter.usageCount}회 사용 ·{' '}
                        {new Date(filter.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/discover?filter=${filter.id}`}>
                          <Filter className="w-4 h-4 mr-1" />
                          적용
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFilter(filter.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">저장된 필터가 없습니다.</p>
            )}
          </Card>
        </TabsContent>

        {/* 가져오기/내보내기 */}
        <TabsContent value="import-export">
          <div className="space-y-4">
            {/* 내보내기 */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">구독 내보내기</h3>
              <p className="text-sm text-muted-foreground mb-4">
                현재 구독 중인 뉴스레터 목록을 파일로 내보냅니다.
              </p>

              <div className="flex gap-3">
                <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="opml">OPML</SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={handleExportSubscriptions} disabled={isLoading}>
                  <Download className="w-4 h-4 mr-2" />
                  내보내기
                </Button>
              </div>
            </Card>

            {/* 가져오기 */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">구독 가져오기</h3>
              <p className="text-sm text-muted-foreground mb-4">
                다른 서비스에서 내보낸 구독 목록을 가져옵니다.
              </p>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <Select
                    value={importFormat}
                    onValueChange={(value: any) => setImportFormat(value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="opml">OPML</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    type="file"
                    accept={`.${importFormat}`}
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="flex-1"
                  />
                </div>

                <Button
                  onClick={handleImportSubscriptions}
                  disabled={isLoading || !selectedFile}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  가져오기
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* 위험 구역 */}
        <TabsContent value="danger">
          <Card className="p-6 border-destructive">
            <h2 className="text-xl font-semibold mb-4 text-destructive">위험 구역</h2>

            <div className="space-y-6">
              {/* 설정 초기화 */}
              <div className="pb-4 border-b">
                <h3 className="font-medium mb-2">설정 초기화</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  모든 개인화 설정을 기본값으로 초기화합니다.
                </p>
                <Button variant="outline" onClick={handleResetPreferences} disabled={isLoading}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  설정 초기화
                </Button>
              </div>

              {/* 모든 구독 삭제 */}
              <div>
                <h3 className="font-medium mb-2">모든 구독 삭제</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  모든 뉴스레터 구독을 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없습니다.
                </p>

                {!showDeleteConfirm ? (
                  <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    모든 구독 삭제
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
                      <p className="text-sm font-medium flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        정말로 모든 구독을 삭제하시겠습니까?
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        확인하려면 아래에 DELETE_ALL_SUBSCRIPTIONS 를 입력하세요.
                      </p>
                    </div>

                    <Input
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="DELETE_ALL_SUBSCRIPTIONS"
                      className="font-mono"
                    />

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmText('');
                        }}
                      >
                        취소
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleClearAllSubscriptions}
                        disabled={deleteConfirmText !== 'DELETE_ALL_SUBSCRIPTIONS' || isLoading}
                      >
                        영구 삭제
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
