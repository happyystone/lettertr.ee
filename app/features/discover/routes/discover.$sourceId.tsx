import type { Route } from './+types/discover.$sourceId';
import { authenticator } from '@/lib/auth.utils';
import { DiscoverService } from '@/features/discover/services/discover.service';
import DiscoverDetailPage from '@/features/discover/pages/discover-detail-page';
import { generateMeta } from '@/lib/seo';

/**
 * 개별 뉴스레터 소스 상세 페이지 Loader
 */
export async function loader({ request, params }: Route.LoaderArgs) {
  // 인증 확인
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth/sign-in',
  });

  if (!user) {
    throw new Response('Unauthorized', { status: 401 });
  }

  const { sourceId } = params;
  if (!sourceId) {
    throw new Response('Not Found', { status: 404 });
  }

  try {
    // 뉴스레터 소스 상세 정보 조회
    const [source, recentNewsletters, relatedSources] = await Promise.all([
      DiscoverService.getSourceDetail(request, sourceId),
      DiscoverService.getRecentNewsletters(sourceId, { limit: 10 }),
      DiscoverService.getRelatedSources(request, sourceId, { limit: 5 }),
    ]);

    if (!source) {
      throw new Response('Newsletter source not found', { status: 404 });
    }

    return {
      user,
      source,
      recentNewsletters,
      relatedSources,
    };
  } catch (error) {
    console.error('Failed to load newsletter source:', error);
    throw new Response('Failed to load newsletter source', { status: 500 });
  }
}

/**
 * 개별 뉴스레터 소스 액션 핸들러
 */
export async function action({ request, params }: Route.ActionArgs) {
  // 인증 확인
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth/sign-in',
  });

  if (!user) {
    throw new Response('Unauthorized', { status: 401 });
  }

  const { sourceId } = params;
  if (!sourceId) {
    throw new Response('Not Found', { status: 404 });
  }

  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  try {
    switch (intent) {
      case 'subscribe': {
        const subscriptionEmail = formData.get('subscriptionEmail') as string;
        const preferences = formData.get('preferences')
          ? JSON.parse(formData.get('preferences') as string)
          : undefined;

        await DiscoverService.subscribe(request, user.id, sourceId, {
          notificationEnabled: true,
        });

        // subscriptionEmail과 preferences는 별도로 처리 필요
        if (subscriptionEmail || preferences) {
          await DiscoverService.updateSubscriptionPreferences(user.id, sourceId, {
            subscriptionEmail,
            ...preferences,
          });
        }

        return {
          success: true,
          message: '구독이 완료되었습니다.',
        };
      }

      case 'unsubscribe': {
        await DiscoverService.unsubscribe(request, user.id, sourceId);
        return {
          success: true,
          message: '구독이 취소되었습니다.',
        };
      }

      case 'pause': {
        await DiscoverService.pauseSubscription(user.id, sourceId);
        return {
          success: true,
          message: '구독이 일시정지되었습니다.',
        };
      }

      case 'resume': {
        await DiscoverService.resumeSubscription(user.id, sourceId);
        return {
          success: true,
          message: '구독이 재개되었습니다.',
        };
      }

      case 'updatePreferences': {
        const preferences = JSON.parse(formData.get('preferences') as string);
        await DiscoverService.updateSubscriptionPreferences(user.id, sourceId, preferences);
        return {
          success: true,
          message: '구독 설정이 업데이트되었습니다.',
        };
      }

      case 'report': {
        const reason = formData.get('reason') as string;
        const details = formData.get('details') as string;

        await DiscoverService.reportSource(sourceId, {
          userId: user.id,
          reason,
          details,
        });

        return {
          success: true,
          message: '신고가 접수되었습니다.',
        };
      }

      default:
        throw new Response('Invalid action', { status: 400 });
    }
  } catch (error) {
    console.error('Action failed:', error);

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

export const meta: Route.MetaFunction = ({ data }) => {
  return generateMeta({
    title: data?.source?.name
      ? `${data.source.name} - Lettertree`
      : 'Newsletter Source - Lettertree',
    description:
      data?.source?.description || 'Newsletter source details and subscription management',
    noindex: true,
    nofollow: true, // FIXME:
  });
};

export default DiscoverDetailPage;
