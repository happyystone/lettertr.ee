import { and, eq, desc, asc, ilike, or, sql, inArray, isNull } from 'drizzle-orm';

import { executeWithAuth } from '@/lib/db/authenticated-db';
import { auth } from '@/lib/auth/auth-server';

import {
  newsletters,
  newsletterSources,
  userNewsletters,
  userNewsletterSources,
  userFolders,
  newsletterFolders,
  userPreferences,
} from '../schema';
import type { FeedFilters, Newsletter, NewsletterStats } from '../types';

export class NewsletterRepository {
  // Get paginated feed with filters
  static async getFeed(request: Request, filters: FeedFilters) {
    const { tab, sortBy, searchQuery, page, limit } = filters;

    return executeWithAuth(request, async (db, user) => {
      let whereConditions = [];

      // ✅ 구독한 발신자(source)에서 온 뉴스레터만
      whereConditions.push(
        sql`EXISTS (
          SELECT 1 FROM ${userNewsletterSources}
          WHERE ${userNewsletterSources.sourceId} = ${newsletters.sourceId}
          AND ${userNewsletterSources.userId} = ${user.id}
          AND ${userNewsletterSources.isSubscribed} = true
        )`,
      );

      // ✅ 검색어 필터
      if (searchQuery) {
        whereConditions.push(
          or(
            ilike(newsletters.subject, `%${searchQuery}%`),
            ilike(newsletters.excerpt, `%${searchQuery}%`),
          ),
        );
      }

      // ✅ 탭 필터
      if (tab === 'unread') {
        whereConditions.push(
          or(
            isNull(userNewsletters.id), // interaction 기록 자체가 없으면 아직 안 읽은 상태
            eq(userNewsletters.isRead, false),
          ),
        );
      } else if (tab === 'bookmarked') {
        whereConditions.push(eq(userNewsletters.isBookmarked, true));
      } else if (tab === 'archived') {
        whereConditions.push(eq(userNewsletters.isArchived, true));
      }

      // ✅ 정렬 조건
      let orderByClause;
      switch (sortBy) {
        case 'oldest':
          orderByClause = asc(newsletters.receivedAt);
          break;
        case 'sender':
          orderByClause = asc(newsletterSources.name);
          break;
        case 'readtime':
          orderByClause = asc(newsletters.readTimeMinutes);
          break;
        case 'latest':
        default:
          orderByClause = desc(newsletters.receivedAt);
      }

      // ✅ 메인 쿼리 (한 방에 다 가져오기)
      const results = await db((tx) =>
        tx
          .select({
            newsletter: newsletters,
            source: newsletterSources,
            interaction: userNewsletters,
          })
          .from(newsletters)
          // 내 interaction 조인 (없을 수도 있으니 LEFT JOIN)
          .innerJoin(
            // ✅ leftJoin → innerJoin
            userNewsletters,
            and(
              eq(userNewsletters.newsletterId, newsletters.id),
              eq(userNewsletters.userId, user.id),
            ),
          )
          .leftJoin(newsletterSources, eq(newsletters.sourceId, newsletterSources.id))
          .where(and(...whereConditions))
          .orderBy(orderByClause)
          .limit(limit)
          .offset((page - 1) * limit),
      );

      // ✅ Transform results
      const newsletterList: Newsletter[] = results.map((row) => {
        const interaction = row.interaction;

        return {
          id: row.newsletter.id,
          subject: row.newsletter.subject,
          htmlContent: row.newsletter.htmlContent,
          textContent: row.newsletter.textContent,
          extractedContent: row.newsletter.extractedContent,
          excerpt: row.newsletter.excerpt,
          summary: row.newsletter.summary,
          receivedAt: row.newsletter.receivedAt,
          senderEmail: row.newsletter.senderEmail,
          senderName: row.newsletter.senderName,
          source: row.source
            ? {
                id: row.source.id,
                name: row.source.name,
                email: row.source.email,
                domain: row.source.domain,
                description: row.source.description,
                category: row.source.category,
                logoUrl: row.source.logoUrl,
                website: row.source.website,
                isVerified: row.source.isVerified,
                isFeatured: row.source.isFeatured,
              }
            : undefined,
          thumbnailUrl: row.newsletter.thumbnailUrl,
          originalUrl: row.newsletter.originalUrl,
          readTimeMinutes: row.newsletter.readTimeMinutes,
          tags: (row.newsletter.tags as string[]) || [],
          category: row.newsletter.category,
          userInteraction: interaction
            ? {
                isRead: interaction.isRead,
                isBookmarked: interaction.isBookmarked,
                isArchived: interaction.isArchived,
                readAt: interaction.readAt,
                bookmarkedAt: interaction.bookmarkedAt,
                archivedAt: interaction.archivedAt,
              }
            : undefined,
          createdAt: row.newsletter.createdAt,
          updatedAt: row.newsletter.updatedAt,
        };
      });

      return newsletterList;
    });
  }

  // Get single newsletter with details
  static async getNewsletter(request: Request, newsletterId: string) {
    return executeWithAuth(request, async (db) => {
      const result = await db((tx) =>
        tx
          .select({
            newsletter: newsletters,
            source: newsletterSources,
          })
          .from(newsletters)
          .leftJoin(newsletterSources, eq(newsletters.sourceId, newsletterSources.id))
          .where(eq(newsletters.id, newsletterId)) // RLS handles user filtering
          .limit(1),
      );

      if (!result[0]) return null;

      // Get user interaction
      // Note: RLS automatically filters to current user's interactions
      const interaction = await db((tx) =>
        tx
          .select()
          .from(userNewsletters)
          .where(eq(userNewsletters.newsletterId, newsletterId))
          .limit(1),
      );

      const row = result[0];
      return {
        id: row.newsletter.id,
        subject: row.newsletter.subject,
        htmlContent: row.newsletter.htmlContent,
        textContent: row.newsletter.textContent,
        extractedContent: row.newsletter.extractedContent,
        excerpt: row.newsletter.excerpt,
        summary: row.newsletter.summary,
        receivedAt: row.newsletter.receivedAt,
        senderEmail: row.newsletter.senderEmail,
        senderName: row.newsletter.senderName,
        source: row.source
          ? {
              id: row.source.id,
              name: row.source.name,
              email: row.source.email,
              domain: row.source.domain,
              description: row.source.description,
              category: row.source.category,
              logoUrl: row.source.logoUrl,
              website: row.source.website,
              isVerified: row.source.isVerified,
              isFeatured: row.source.isFeatured,
            }
          : undefined,
        thumbnailUrl: row.newsletter.thumbnailUrl,
        originalUrl: row.newsletter.originalUrl,
        readTimeMinutes: row.newsletter.readTimeMinutes,
        tags: (row.newsletter.tags as string[]) || [],
        category: row.newsletter.category,
        userInteraction: interaction[0]
          ? {
              isRead: interaction[0].isRead,
              isBookmarked: interaction[0].isBookmarked,
              isArchived: interaction[0].isArchived,
              readAt: interaction[0].readAt,
              bookmarkedAt: interaction[0].bookmarkedAt,
              archivedAt: interaction[0].archivedAt,
            }
          : undefined,
        createdAt: row.newsletter.createdAt,
        updatedAt: row.newsletter.updatedAt,
      } as Newsletter;
    });
  }

  // Get adjacent newsletters for navigation
  static async getAdjacentNewsletters(request: Request, newsletterId: string) {
    return executeWithAuth(request, async (db) => {
      const current = await this.getNewsletter(request, newsletterId);
      if (!current) return { previous: null, next: null };

      // Get previous newsletter
      const previous = await db((tx) =>
        tx
          .select({
            newsletter: newsletters,
            source: newsletterSources,
          })
          .from(newsletters)
          .leftJoin(newsletterSources, eq(newsletters.sourceId, newsletterSources.id))
          .where(sql`${newsletters.receivedAt} < ${current.receivedAt}`) // RLS handles user filtering
          .orderBy(desc(newsletters.receivedAt))
          .limit(1),
      );

      // Get next newsletter
      const next = await db((tx) =>
        tx
          .select({
            newsletter: newsletters,
            source: newsletterSources,
          })
          .from(newsletters)
          .leftJoin(newsletterSources, eq(newsletters.sourceId, newsletterSources.id))
          .where(sql`${newsletters.receivedAt} > ${current.receivedAt}`) // RLS handles user filtering
          .orderBy(asc(newsletters.receivedAt))
          .limit(1),
      );

      return {
        previous: previous[0]
          ? {
              id: previous[0].newsletter.id,
              subject: previous[0].newsletter.subject,
              source: {
                name: previous[0].source?.name || 'Unknown',
              },
            }
          : null,
        next: next[0]
          ? {
              id: next[0].newsletter.id,
              subject: next[0].newsletter.subject,
              source: {
                name: next[0].source?.name || 'Unknown',
              },
            }
          : null,
      };
    });
  }

  // Mark newsletter as read
  static async markAsRead(request: Request, newsletterId: string, isRead: boolean = true) {
    return executeWithAuth(request, async (db) => {
      const session = await auth.api.getSession({ headers: request.headers });
      if (!session?.user?.id) throw new Error('Unauthorized');

      // Check if newsletter exists and user has access (via RLS)
      const newsletter = await db((tx) =>
        tx.select().from(newsletters).where(eq(newsletters.id, newsletterId)).limit(1),
      );

      if (!newsletter[0]) return false;

      await db((tx) =>
        tx
          .insert(userNewsletters)
          .values({
            userId: session.user.id,
            newsletterId,
            isRead,
            readAt: isRead ? new Date() : null,
          })
          .onConflictDoUpdate({
            target: [userNewsletters.userId, userNewsletters.newsletterId],
            set: {
              isRead,
              readAt: isRead ? new Date() : null,
            },
          }),
      );

      return true;
    });
  }

  // Toggle bookmark status
  static async toggleBookmark(request: Request, newsletterId: string) {
    return executeWithAuth(request, async (db, user) => {
      // Check if newsletter exists and user has access (via RLS)
      const newsletter = await db((tx) =>
        tx.select().from(newsletters).where(eq(newsletters.id, newsletterId)).limit(1),
      );

      if (!newsletter[0]) return false;

      const existing = await db(
        (tx) =>
          tx.select().from(userNewsletters).where(eq(userNewsletters.newsletterId, newsletterId)), // RLS handles user filtering
      );

      const newValue = !existing[0]?.isBookmarked;

      await db((tx) =>
        tx
          .insert(userNewsletters)
          .values({
            userId: user.id,
            newsletterId,
            isBookmarked: newValue,
            bookmarkedAt: newValue ? new Date() : null,
          })
          .onConflictDoUpdate({
            target: [userNewsletters.userId, userNewsletters.newsletterId],
            set: {
              isBookmarked: newValue,
              bookmarkedAt: newValue ? new Date() : null,
            },
          }),
      );

      return newValue;
    });
  }

  // Toggle archive status
  static async toggleArchive(request: Request, newsletterId: string) {
    return executeWithAuth(request, async (db, user) => {
      // Check if newsletter exists and user has access (via RLS)
      const newsletter = await db((tx) =>
        tx.select().from(newsletters).where(eq(newsletters.id, newsletterId)).limit(1),
      );

      if (!newsletter[0]) return false;

      const existing = await db(
        (tx) =>
          tx.select().from(userNewsletters).where(eq(userNewsletters.newsletterId, newsletterId)), // RLS handles user filtering
      );

      const newValue = !existing[0]?.isArchived;

      await db((tx) =>
        tx
          .insert(userNewsletters)
          .values({
            userId: user.id,
            newsletterId,
            isArchived: newValue,
            archivedAt: newValue ? new Date() : null,
          })
          .onConflictDoUpdate({
            target: [userNewsletters.userId, userNewsletters.newsletterId],
            set: {
              isArchived: newValue,
              archivedAt: newValue ? new Date() : null,
            },
          }),
      );

      return newValue;
    });
  }

  // Get newsletter stats for user
  static async getStats(request: Request, filters: FeedFilters): Promise<NewsletterStats> {
    return executeWithAuth(request, async (db) => {
      // Total newsletters for this user (RLS automatically filters)
      const totalResult = await db(
        (tx) =>
          tx
            .select({ count: sql<number>`count(*)` })
            .from(newsletters)
            .innerJoin(userNewsletters, eq(userNewsletters.newsletterId, newsletters.id))
            .where(
              filters.searchQuery
                ? or(
                    ilike(newsletters.subject, `%${filters.searchQuery}%`),
                    ilike(newsletters.excerpt, `%${filters.searchQuery}%`),
                  )
                : undefined,
            ), // RLS handles user filtering
      );

      // Unread newsletters (no interaction or isRead is false)
      const unreadResult = await db((tx) =>
        tx
          .select({ count: sql<number>`count(*)` })
          .from(newsletters)
          .innerJoin(userNewsletters, eq(userNewsletters.newsletterId, newsletters.id))
          .where(
            and(
              or(eq(userNewsletters.isRead, false), sql`${userNewsletters.isRead} IS NULL`),
              filters.searchQuery
                ? or(
                    ilike(newsletters.subject, `%${filters.searchQuery}%`),
                    ilike(newsletters.excerpt, `%${filters.searchQuery}%`),
                  )
                : undefined,
            ),
          ),
      );

      // Bookmarked newsletters
      const bookmarkedResult = await db(
        (tx) =>
          tx
            .select({ count: sql<number>`count(*)` })
            .from(userNewsletters)
            .innerJoin(newsletters, eq(newsletters.id, userNewsletters.newsletterId))
            .where(
              and(
                eq(userNewsletters.isBookmarked, true),
                filters.searchQuery
                  ? or(
                      ilike(newsletters.subject, `%${filters.searchQuery}%`),
                      ilike(newsletters.excerpt, `%${filters.searchQuery}%`),
                    )
                  : undefined,
              ),
            ), // RLS handles user filtering
      );

      // Archived newsletters
      const archivedResult = await db((tx) =>
        tx
          .select({ count: sql<number>`count(*)` })
          .from(userNewsletters)
          .innerJoin(newsletters, eq(newsletters.id, userNewsletters.newsletterId))
          .where(
            and(
              eq(userNewsletters.isArchived, true),
              filters.searchQuery
                ? or(
                    ilike(newsletters.subject, `%${filters.searchQuery}%`),
                    ilike(newsletters.excerpt, `%${filters.searchQuery}%`),
                  )
                : undefined,
            ), // RLS handles user filtering
          ),
      );

      return {
        total: Number(totalResult[0]?.count || 0),
        unread: Number(unreadResult[0]?.count || 0),
        bookmarked: Number(bookmarkedResult[0]?.count || 0),
        archived: Number(archivedResult[0]?.count || 0),
      };
    });
  }

  // Get user's subscribed newsletter sources
  static async getUserSources(request: Request) {
    return executeWithAuth(request, async (db) => {
      const sources = await db(
        (tx) =>
          tx
            .select({
              source: newsletterSources,
              subscription: userNewsletterSources,
            })
            .from(userNewsletterSources)
            .innerJoin(newsletterSources, eq(newsletterSources.id, userNewsletterSources.sourceId))
            .where(eq(userNewsletterSources.isSubscribed, true)), // RLS handles user filtering
      );

      return sources.map((row) => ({
        ...row.source,
        subscribedAt: row.subscription.subscribedAt,
      }));
    });
  }

  // Get user's folders
  static async getUserFolders(request: Request) {
    return executeWithAuth(request, async (db) => {
      return await db((tx) =>
        tx
          .select()
          .from(userFolders)
          // RLS handles user filtering, no WHERE clause needed
          .orderBy(asc(userFolders.sortOrder), asc(userFolders.name)),
      );
    });
  }

  // Assign newsletter to folder
  static async assignToFolder(request: Request, newsletterId: string, folderId: string) {
    return executeWithAuth(request, async (db, user) => {
      // First get or create the userNewsletter entry
      const userNewsletter = await db((tx) =>
        tx
          .select()
          .from(userNewsletters)
          .where(eq(userNewsletters.newsletterId, newsletterId)) // RLS handles user filtering
          .limit(1),
      );

      if (!userNewsletter[0]) {
        // Check if newsletter exists and user has access (via RLS)
        const newsletter = await db((tx) =>
          tx.select().from(newsletters).where(eq(newsletters.id, newsletterId)).limit(1),
        );

        if (!newsletter[0]) return;

        await db((tx) =>
          tx.insert(userNewsletters).values({
            userId: user.id,
            newsletterId,
            isRead: false,
            isBookmarked: false,
            isArchived: false,
          }),
        );
      }

      // Get the userNewsletter ID
      const userNewsletterRecord = await db((tx) =>
        tx
          .select()
          .from(userNewsletters)
          .where(eq(userNewsletters.newsletterId, newsletterId)) // RLS handles user filtering
          .limit(1),
      );

      if (!userNewsletterRecord[0]) return;

      // Assign to folder
      await db((tx) =>
        tx
          .insert(newsletterFolders)
          .values({
            userNewsletterId: userNewsletterRecord[0].id,
            folderId,
          })
          .onConflictDoNothing(),
      );
    });
  }

  // Get user preferences
  static async getUserPreferences(request: Request) {
    return executeWithAuth(request, async (db) => {
      const prefs = await db((tx) =>
        tx
          .select()
          .from(userPreferences)
          // RLS handles user filtering, no WHERE clause needed
          .limit(1),
      );

      return prefs[0] || null;
    });
  }

  // Update user preferences
  static async updateUserPreferences(
    request: Request,
    preferences: Partial<typeof userPreferences.$inferInsert>,
  ) {
    return executeWithAuth(request, async (db, user) => {
      await db((tx) =>
        tx
          .insert(userPreferences)
          .values({
            userId: user.id,
            ...preferences,
          })
          .onConflictDoUpdate({
            target: userPreferences.userId,
            set: preferences,
          }),
      );
    });
  }
}
