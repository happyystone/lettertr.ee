import type { Route } from './+types/letter.$id';
import { redirect } from 'react-router';
import { auth } from '@/lib/auth/auth-server';
import { NewsletterRepository } from '../repositories/newsletter.repository';
import NewsletterDetailPage from '../pages/newsletter-detail-page';
import { generateMeta, generateArticleSchema } from '@/lib/seo';

export async function loader({ request, params }: Route.LoaderArgs) {
  const newsletter = await NewsletterRepository.getNewsletter(request, params.id!);

  if (!newsletter) throw new Response('Not Found', { status: 404 });

  // 자동 읽음 처리
  await NewsletterRepository.markAsRead(request, params.id!);

  // FIXME:
  // 이전/다음 뉴스레터
  // const { previous, next } = await NewsletterRepository.getAdjacentNewsletters(
  //   params.id!,
  //   session.user.id,
  // );

  return {
    newsletter,
    previousNewsletter: null,
    nextNewsletter: null,
  };
}

export async function action({ request, params }: Route.ActionArgs) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    throw redirect('/auth/sign-in');
  }
  const formData = await request.formData();
  const intent = formData.get('intent');

  switch (intent) {
    case 'bookmark':
      const isBookmarked = await NewsletterRepository.toggleBookmark(request, params.id!);
      return { success: isBookmarked };

    case 'archive':
      const isArchived = await NewsletterRepository.toggleArchive(request, params.id!);
      return { success: isArchived };

    case 'markRead':
      const isMarkedRead = await NewsletterRepository.markAsRead(request, params.id!, true);
      return { success: isMarkedRead };

    case 'markUnread':
      const isMarkedUnread = await NewsletterRepository.markAsRead(request, params.id!, false);
      return { success: isMarkedUnread };

    default:
      return { success: false };
  }
}

export const meta: Route.MetaFunction = ({ location, loaderData }) => {
  const newsletter = loaderData?.newsletter;
  const url = new URL(`https://lettertr.ee${location.pathname}${location.search}`);

  if (!newsletter) {
    return generateMeta({
      title: '뉴스레터',
      description: '뉴스레터를 읽어보세요',
      url: url.href,
    });
  }

  // Generate Article structured data
  const articleSchema = generateArticleSchema({
    headline: newsletter.subject,
    description: newsletter.excerpt || newsletter.subject,
    datePublished: newsletter.createdAt
      ? newsletter.createdAt.toString()
      : new Date().toISOString(),
    dateModified: newsletter.updatedAt
      ? newsletter.updatedAt.toString()
      : newsletter.createdAt
        ? newsletter.createdAt.toString()
        : new Date().toISOString(),
    author: newsletter.senderName
      ? {
          name: newsletter.senderName,
        }
      : undefined,
    publisher: {
      name: 'Lettertree',
      logo: 'https://lettertr.ee/logo.png',
    },
    url: url.href,
    keywords: newsletter.tags || [],
  });

  const meta = generateMeta({
    title: newsletter.subject,
    description: newsletter.excerpt || `${newsletter.senderName}의 뉴스레터: ${newsletter.subject}`,
    image: newsletter.thumbnailUrl || 'https://lettertr.ee/og-image.png',
    url: url.href,
    type: 'article',
    author: newsletter.senderName || undefined,
    publishedTime: newsletter.createdAt ? newsletter.createdAt.toString() : undefined,
    modifiedTime: newsletter.updatedAt ? newsletter.updatedAt.toString() : undefined,
    canonical: `https://lettertr.ee/letter/${newsletter.id}`,
  });

  // Add structured data script tag
  meta.push({
    tagName: 'script',
    type: 'application/ld+json',
    innerHTML: JSON.stringify(articleSchema),
  } as any);

  return meta;
};

export default NewsletterDetailPage;
