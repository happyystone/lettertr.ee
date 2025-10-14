import { NewsletterRepository } from '../repositories/newsletter.repository';
import type { FeedFilters, NewsletterStats } from '../types';

// FIXME:
export class NewsletterService {
  /**
   * 사용자의 뉴스레터 피드를 가져옵니다
   */
  static async getUserFeed(request: Request, filters: FeedFilters) {
    try {
      const newsletters = await NewsletterRepository.getFeed(request, filters);
      const stats = await NewsletterRepository.getStats(request);

      return {
        newsletters,
        stats,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          hasMore: newsletters.length === filters.limit,
        },
      };
    } catch (error) {
      console.error('Failed to fetch user feed:', error);
      throw new Error('피드를 불러오는데 실패했습니다');
    }
  }

  /**
   * 특정 뉴스레터의 상세 정보를 가져옵니다
   */
  static async getNewsletterDetail(request: Request, newsletterId: string) {
    try {
      const newsletter = await NewsletterRepository.getNewsletter(request, newsletterId);
      if (!newsletter) {
        throw new Error('뉴스레터를 찾을 수 없습니다');
      }

      // 자동으로 읽음 처리
      if (!newsletter.userInteraction?.isRead) {
        await NewsletterRepository.markAsRead(request, newsletterId);
      }

      // 이전/다음 뉴스레터 정보
      const navigation = await NewsletterRepository.getAdjacentNewsletters(request, newsletterId);

      return {
        newsletter,
        navigation,
      };
    } catch (error) {
      console.error('Failed to fetch newsletter detail:', error);
      throw error;
    }
  }

  /**
   * 뉴스레터 상호작용 처리 (북마크, 아카이브)
   */
  static async handleInteraction(
    request: Request,
    newsletterId: string,
    action: 'bookmark' | 'archive' | 'markRead',
  ) {
    try {
      switch (action) {
        case 'bookmark':
          return await NewsletterRepository.toggleBookmark(request, newsletterId);
        case 'archive':
          return await NewsletterRepository.toggleArchive(request, newsletterId);
        case 'markRead':
          await NewsletterRepository.markAsRead(request, newsletterId);
          return true;
        default:
          throw new Error('Invalid action');
      }
    } catch (error) {
      console.error(`Failed to ${action} newsletter:`, error);
      throw new Error(`${action} 처리에 실패했습니다`);
    }
  }

  /**
   * 뉴스레터를 폴더에 할당합니다
   */
  static async assignToFolder(request: Request, newsletterId: string, folderId: string) {
    try {
      await NewsletterRepository.assignToFolder(request, newsletterId, folderId);
      return { success: true };
    } catch (error) {
      console.error('Failed to assign newsletter to folder:', error);
      throw new Error('폴더 할당에 실패했습니다');
    }
  }

  /**
   * 사용자의 뉴스레터 통계를 가져옵니다
   */
  static async getUserStats(request: Request): Promise<NewsletterStats> {
    try {
      return await NewsletterRepository.getStats(request);
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      throw new Error('통계를 불러오는데 실패했습니다');
    }
  }

  /**
   * 뉴스레터 검색
   */
  static async searchNewsletters(request: Request, query: string, page = 1, limit = 20) {
    try {
      const filters: FeedFilters = {
        tab: 'all',
        sortBy: 'latest',
        searchQuery: query,
        page,
        limit,
      };

      return await NewsletterRepository.getFeed(request, filters);
    } catch (error) {
      console.error('Failed to search newsletters:', error);
      throw new Error('검색에 실패했습니다');
    }
  }

  /**
   * 뉴스레터 일괄 작업
   */
  static async bulkAction(
    request: Request,
    newsletterIds: string[],
    action: 'markRead' | 'archive' | 'delete',
  ) {
    try {
      const results = await Promise.all(
        newsletterIds.map(async (id) => {
          switch (action) {
            case 'markRead':
              await NewsletterRepository.markAsRead(request, id);
              return { id, success: true };
            case 'archive':
              const isArchived = await NewsletterRepository.toggleArchive(request, id);
              return { id, success: true, isArchived };
            default:
              return { id, success: false };
          }
        }),
      );

      return results;
    } catch (error) {
      console.error('Failed to perform bulk action:', error);
      throw new Error('일괄 작업에 실패했습니다');
    }
  }
}
