import { db } from '@/db';
import { auth } from '@/lib/auth/auth-server';
import { eq, and, asc } from 'drizzle-orm';
import { userFolders, newsletterFolders, userNewsletters } from '../schema';
import type { UserFolder } from '../types';

export class FolderService {
  /**
   * 사용자의 모든 폴더를 가져옵니다
   */
  static async getUserFolders(request: Request): Promise<UserFolder[]> {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user || !session.user.id) {
      throw new Error('Unauthorized: No valid session found');
    }

    try {
      const folders = await db
        .select()
        .from(userFolders)
        .where(eq(userFolders.userId, session.user.id))
        .orderBy(asc(userFolders.sortOrder), asc(userFolders.name));

      return folders as UserFolder[];
    } catch (error) {
      console.error('Failed to fetch user folders:', error);
      throw new Error('폴더 목록을 불러오는데 실패했습니다');
    }
  }

  /**
   * 새 폴더를 생성합니다
   */
  static async createFolder(
    request: Request,
    data: {
      name: string;
      description?: string;
      color?: string;
    },
  ): Promise<UserFolder> {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user || !session.user.id) {
      throw new Error('Unauthorized: No valid session found');
    }

    try {
      // 현재 최대 sortOrder 가져오기
      const maxSortOrder = await db
        .select({ max: userFolders.sortOrder })
        .from(userFolders)
        .where(eq(userFolders.userId, session.user.id));

      const nextSortOrder = (maxSortOrder[0]?.max || 0) + 1;

      const [folder] = await db
        .insert(userFolders)
        .values({
          userId: session.user.id,
          name: data.name,
          description: data.description,
          color: data.color || '#6366f1',
          sortOrder: nextSortOrder,
        })
        .returning();

      return folder as UserFolder;
    } catch (error) {
      console.error('Failed to create folder:', error);
      throw new Error('폴더 생성에 실패했습니다');
    }
  }

  /**
   * 폴더 정보를 수정합니다
   */
  static async updateFolder(
    request: Request,
    folderId: string,
    data: {
      name?: string;
      description?: string;
      color?: string;
      sortOrder?: number;
    },
  ): Promise<UserFolder> {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user || !session.user.id) {
      throw new Error('Unauthorized: No valid session found');
    }

    try {
      const [folder] = await db
        .update(userFolders)
        .set(data)
        .where(and(eq(userFolders.id, folderId), eq(userFolders.userId, session.user.id)))
        .returning();

      if (!folder) {
        throw new Error('폴더를 찾을 수 없습니다');
      }

      return folder as UserFolder;
    } catch (error) {
      console.error('Failed to update folder:', error);
      throw error;
    }
  }

  /**
   * 폴더를 삭제합니다
   */
  static async deleteFolder(request: Request, folderId: string): Promise<void> {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user || !session.user.id) {
      throw new Error('Unauthorized: No valid session found');
    }

    try {
      await db
        .delete(userFolders)
        .where(and(eq(userFolders.id, folderId), eq(userFolders.userId, session.user.id)));
    } catch (error) {
      console.error('Failed to delete folder:', error);
      throw error;
    }
  }

  /**
   * 폴더에 포함된 뉴스레터 ID 목록을 가져옵니다
   */
  static async getFolderNewsletters(request: Request, folderId: string): Promise<string[]> {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user || !session.user.id) {
      throw new Error('Unauthorized: No valid session found');
    }

    try {
      // 먼저 폴더가 사용자 소유인지 확인
      const folder = await db
        .select()
        .from(userFolders)
        .where(and(eq(userFolders.id, folderId), eq(userFolders.userId, session.user.id)))
        .limit(1);

      if (!folder[0]) {
        throw new Error('폴더를 찾을 수 없습니다');
      }

      // 폴더에 속한 뉴스레터 ID 가져오기
      const newsletters = await db
        .select({ newsletterId: userNewsletters.newsletterId })
        .from(newsletterFolders)
        .innerJoin(userNewsletters, eq(userNewsletters.id, newsletterFolders.userNewsletterId))
        .where(
          and(
            eq(newsletterFolders.folderId, folderId),
            eq(userNewsletters.userId, session.user.id),
          ),
        );

      return newsletters.map((n) => n.newsletterId);
    } catch (error) {
      console.error('Failed to fetch folder newsletters:', error);
      throw error;
    }
  }

  /**
   * 뉴스레터를 폴더에 추가합니다
   */
  static async addNewsletterToFolder(
    request: Request,
    newsletterId: string,
    folderId: string,
  ): Promise<void> {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user || !session.user.id) {
      throw new Error('Unauthorized: No valid session found');
    }

    try {
      // userNewsletter 레코드 확인 또는 생성
      let userNewsletter = await db
        .select()
        .from(userNewsletters)
        .where(
          and(
            eq(userNewsletters.userId, session.user.id),
            eq(userNewsletters.newsletterId, newsletterId),
          ),
        )
        .limit(1);

      if (!userNewsletter[0]) {
        [userNewsletter[0]] = await db
          .insert(userNewsletters)
          .values({
            userId: session.user.id,
            newsletterId,
            isRead: false,
            isBookmarked: false,
            isArchived: false,
          })
          .returning();
      }

      // 폴더에 추가
      await db
        .insert(newsletterFolders)
        .values({
          userNewsletterId: userNewsletter[0].id,
          folderId,
        })
        .onConflictDoNothing();
    } catch (error) {
      console.error('Failed to add newsletter to folder:', error);
      throw new Error('뉴스레터를 폴더에 추가하는데 실패했습니다');
    }
  }

  /**
   * 뉴스레터를 폴더에서 제거합니다
   */
  static async removeNewsletterFromFolder(
    request: Request,
    newsletterId: string,
    folderId: string,
  ): Promise<void> {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user || !session.user.id) {
      throw new Error('Unauthorized: No valid session found');
    }

    try {
      // userNewsletter ID 가져오기
      const userNewsletter = await db
        .select()
        .from(userNewsletters)
        .where(
          and(
            eq(userNewsletters.userId, session.user.id),
            eq(userNewsletters.newsletterId, newsletterId),
          ),
        )
        .limit(1);

      if (!userNewsletter[0]) {
        return; // 이미 없으면 성공으로 처리
      }

      // 폴더에서 제거
      await db
        .delete(newsletterFolders)
        .where(
          and(
            eq(newsletterFolders.userNewsletterId, userNewsletter[0].id),
            eq(newsletterFolders.folderId, folderId),
          ),
        );
    } catch (error) {
      console.error('Failed to remove newsletter from folder:', error);
      throw new Error('뉴스레터를 폴더에서 제거하는데 실패했습니다');
    }
  }

  /**
   * 폴더 순서를 재정렬합니다
   */
  static async reorderFolders(request: Request, folderIds: string[]): Promise<void> {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user || !session.user.id) {
      throw new Error('Unauthorized: No valid session found');
    }

    try {
      await Promise.all(
        folderIds.map((folderId, index) =>
          db
            .update(userFolders)
            .set({ sortOrder: index })
            .where(and(eq(userFolders.id, folderId), eq(userFolders.userId, session.user.id))),
        ),
      );
    } catch (error) {
      console.error('Failed to reorder folders:', error);
      throw new Error('폴더 순서 변경에 실패했습니다');
    }
  }
}
