import { generateMeta } from '@/lib/seo';
import { auth } from '@/lib/auth/auth-server';

import HomePage from '../pages/home-page';
import { WaitlistService } from '../services/waitlist.service';
import type { WaitlistActionResponse, WaitlistMetadata } from '../types';
import type { Route } from './+types/index';

export async function loader({ request }: Route.LoaderArgs) {
  const session = await auth.api.getSession({
    headers: request.headers,
    query: { disableCookieCache: true },
  });

  return { user: session?.user };
}

export async function action({ request }: Route.ActionArgs): Promise<WaitlistActionResponse> {
  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  if (intent === 'join-waitlist') {
    const email = formData.get('email') as string;
    const name = formData.get('name') as string | undefined;

    // Get metadata from request
    const url = new URL(request.url);
    const metadata: WaitlistMetadata = {
      referrer: request.headers.get('referer') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    };

    // Extract UTM parameters if present
    ['utmSource', 'utmMedium', 'utmCampaign', 'utmTerm', 'utmContent'].forEach((param) => {
      const value = url.searchParams.get(param.replace('utm', 'utm_'));
      if (value) {
        metadata[param as keyof WaitlistMetadata] = value;
      }
    });

    // Add to waitlist
    const result = await WaitlistService.addToWaitlist(email, {
      name,
      source: 'homepage',
      metadata,
    });

    // Get updated count if successful
    if (result.success) {
      const count = await WaitlistService.getWaitlistCount();
      return { ...result, count };
    }

    return result;
  }

  return {
    success: false,
    message: 'Invalid request',
  };
}

export const meta: Route.MetaFunction = ({ location }) => {
  const url = new URL(`https://lettertr.ee${location.pathname}${location.search}`);

  return generateMeta({
    title: '모든 뉴스레터를 한 곳에서',
    description:
      '개인 이메일과 뉴스레터를 완벽히 분리하여, 온전히 콘텐츠 소비에만 집중할 수 있는 깔끔하고 지능적인 구독 경험을 제공합니다.',
    keywords: [
      '뉴스레터',
      '뉴스레터 관리',
      '뉴스레터 구독',
      '이메일 관리',
      '콘텐츠 큐레이션',
      'newsletter',
      'lettertree',
      '뉴스레터 추천',
      '뉴스레터 플랫폼',
    ],
    image: 'https://lettertr.ee/og-image.png',
    url: url.href,
    type: 'website',
    canonical: 'https://lettertr.ee',
  });
};

export default HomePage;
