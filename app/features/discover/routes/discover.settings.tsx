import type { Route } from './+types/discover.settings';
import { authenticator } from '@/lib/auth.utils';
import { DiscoverService } from '@/features/discover/services/discover.service';
import DiscoverSettingsPage from '@/features/discover/pages/discover-settings-page';
import { generateMeta } from '@/lib/seo';

/**
 * 디스커버 설정 페이지 Loader
 */
export async function loader({ request }: Route.LoaderArgs) {
  // 인증 확인
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  if (!user) {
    throw new Response('Unauthorized', { status: 401 });
  }

  try {
    // 사용자 구독 통계 및 설정 조회
    const [subscriptionStats, userPreferences, savedFilters] = await Promise.all([
      DiscoverService.getUserSubscriptionStats(user.id),
      DiscoverService.getUserPreferences(request),
      DiscoverService.getUserSavedFilters(request),
    ]);

    return {
      user,
      subscriptionStats,
      userPreferences,
      savedFilters,
    };
  } catch (error) {
    console.error('Failed to load settings:', error);
    throw new Response('Failed to load settings', { status: 500 });
  }
}

/**
 * 디스커버 설정 액션 핸들러
 */
export async function action({ request }: Route.ActionArgs) {
  // 인증 확인
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  if (!user) {
    throw new Response('Unauthorized', { status: 401 });
  }

  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  try {
    switch (intent) {
      case 'updatePreferences': {
        const preferences = JSON.parse(formData.get('preferences') as string);

        await DiscoverService.updateUserPreferences(request, preferences);

        return {
          success: true,
          message: '설정이 저장되었습니다.',
        };
      }

      case 'saveFilter': {
        const name = formData.get('name') as string;
        const filters = JSON.parse(formData.get('filters') as string);

        await DiscoverService.saveFilter(request, name, filters);

        return {
          success: true,
          message: '필터가 저장되었습니다.',
        };
      }

      case 'deleteFilter': {
        const filterId = formData.get('filterId') as string;

        await DiscoverService.deleteSavedFilter(request, filterId);

        return {
          success: true,
          message: '필터가 삭제되었습니다.',
        };
      }

      case 'updateFilter': {
        const filterId = formData.get('filterId') as string;
        const name = formData.get('name') as string;
        const filters = formData.get('filters')
          ? JSON.parse(formData.get('filters') as string)
          : undefined;

        await DiscoverService.updateSavedFilter(user.id, filterId, {
          name,
          filters,
        });

        return {
          success: true,
          message: '필터가 업데이트되었습니다.',
        };
      }

      case 'exportSubscriptions': {
        const format = formData.get('format') as 'csv' | 'json' | 'opml';

        const exportData = await DiscoverService.exportSubscriptions(user.id, format);

        // 다운로드 응답 반환
        const headers = new Headers();
        const filename = `subscriptions_${new Date().toISOString().split('T')[0]}.${format}`;

        headers.set(
          'Content-Type',
          format === 'json' ? 'application/json' : format === 'csv' ? 'text/csv' : 'text/xml',
        );
        headers.set('Content-Disposition', `attachment; filename="${filename}"`);

        return new Response(exportData, { headers });
      }

      case 'importSubscriptions': {
        const file = formData.get('file') as File;
        const format = formData.get('format') as 'csv' | 'json' | 'opml';

        if (!file) {
          throw new Response('No file provided', { status: 400 });
        }

        const content = await file.text();
        const result = await DiscoverService.importSubscriptions(user.id, content, format);

        return {
          success: true,
          message: `${result.imported}개의 구독이 가져오기되었습니다.`,
          result,
        };
      }

      case 'clearAllSubscriptions': {
        const confirmation = formData.get('confirmation') as string;

        if (confirmation !== 'DELETE_ALL_SUBSCRIPTIONS') {
          throw new Response('Invalid confirmation', { status: 400 });
        }

        await DiscoverService.clearAllSubscriptions(user.id);

        return {
          success: true,
          message: '모든 구독이 삭제되었습니다.',
        };
      }

      case 'resetPreferences': {
        await DiscoverService.resetUserPreferences(user.id);

        return {
          success: true,
          message: '설정이 초기화되었습니다.',
        };
      }

      default:
        throw new Response('Invalid action', { status: 400 });
    }
  } catch (error) {
    console.error('Settings action failed:', error);
    throw new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Action failed',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}

export const meta: Route.MetaFunction = () => {
  return generateMeta({
    title: 'Discover Settings - Lettertree',
    description: 'Manage your newsletter discovery preferences and subscription settings',
    noindex: true,
    nofollow: true, // FIXME:
  });
};

export default DiscoverSettingsPage;
