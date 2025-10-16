import { sqliteTable, text, integer, index, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { users } from '../auth/schema';

// Newsletter sources (e.g., TechCrunch, BBC News) - 발신자 정보
export const newsletterSources = sqliteTable('newsletter_sources', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(), // 발신자 이메일
  name: text('name').notNull(),
  domain: text('domain'), // 도메인 (예: techcrunch.com)
  description: text('description'),
  category: text('category'), // NEWS, AI, BUSINESS, TECH, etc.
  logoUrl: text('logo_url'),
  website: text('website'),
  subscribeUrl: text('subscribe_url'),

  // Discovery features
  isVerified: integer('is_verified', { mode: 'boolean' }).default(false).notNull(), // 검증된 발신자
  isFeatured: integer('is_featured', { mode: 'boolean' }).default(false).notNull(), // 추천 뉴스레터
  subscriberCount: integer('subscriber_count').default(0),

  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
  region: text('region').default('ROW').notNull(), // KR, ROW (Rest of World)

  // 통계
  totalNewsletters: integer('total_newsletters').default(0),
  lastNewsletterAt: integer('last_newsletter_at', { mode: 'timestamp' }),

  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updateCount: integer('update_count').default(0).notNull(),
});

// Individual newsletter emails received via ForwardEmail
export const newsletters = sqliteTable(
  'newsletters',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    sourceId: text('source_id')
      .notNull()
      .references(() => newsletterSources.id, { onDelete: 'cascade' }), // 발신자 필수

    newsletterHash: text('newsletter_hash').notNull().unique(), // 뉴스레터 고유 ID (중복 방지용)

    // Email metadata
    messageId: text('message_id').notNull(),
    subject: text('subject').notNull(), // 이메일 제목
    senderEmail: text('sender_email').notNull(),
    senderName: text('sender_name'),

    // Content
    htmlContent: text('html_content'), // 원본 HTML
    textContent: text('text_content'), // 플레인 텍스트
    extractedContent: text('extracted_content'), // 정제된 콘텐츠
    excerpt: text('excerpt'), // 요약/미리보기
    summary: text('summary'), // AI 생성 요약 (future)

    // Extracted metadata
    thumbnailUrl: text('thumbnail_url'),
    originalUrl: text('original_url'), // 뉴스레터 내 원본 링크
    readTimeMinutes: integer('read_time_minutes').default(5),

    // Email headers and attachments
    headers: text('headers', { mode: 'json' }).$type<Record<string, string>>().default({}),
    attachments: text('attachments', { mode: 'json' })
      .$type<
        Array<{
          filename: string;
          contentType: string;
          size: number;
          url?: string;
        }>
      >()
      .default([]),

    // Organization
    tags: text('tags', { mode: 'json' }).$type<string[]>().default([]),
    category: text('category'), // auto-categorized

    // Status
    isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),

    // Timestamps
    receivedAt: integer('received_at', { mode: 'timestamp' }).notNull(), // 이메일 수신 시간
    createdAt: integer('created_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index('newsletters_source_id_idx').on(table.sourceId),
    index('newsletters_received_at_idx').on(table.receivedAt),
  ],
);

// User-specific newsletter interactions
export const userNewsletters = sqliteTable(
  'user_newsletters',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    newsletterId: text('newsletter_id')
      .notNull()
      .references(() => newsletters.id, { onDelete: 'cascade' }),
    isRead: integer('is_read', { mode: 'boolean' }).default(false).notNull(),
    isBookmarked: integer('is_bookmarked', { mode: 'boolean' }).default(false).notNull(),
    isArchived: integer('is_archived', { mode: 'boolean' }).default(false).notNull(),
    readAt: integer('read_at', { mode: 'timestamp' }),
    bookmarkedAt: integer('bookmarked_at', { mode: 'timestamp' }),
    archivedAt: integer('archived_at', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index('user_newsletters_user_id_idx').on(table.userId),
    uniqueIndex('user_newsletters_user_newsletter_unique').on(table.userId, table.newsletterId),
  ],
);

// User newsletter source subscriptions
export const userNewsletterSources = sqliteTable(
  'user_newsletter_sources',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    sourceId: text('source_id')
      .notNull()
      .references(() => newsletterSources.id, { onDelete: 'cascade' }),
    isSubscribed: integer('is_subscribed', { mode: 'boolean' }).default(true).notNull(),
    isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
    isPaused: integer('is_paused', { mode: 'boolean' }).default(false).notNull(),
    subscriptionEmail: text('subscription_email'),
    preferences: text('preferences', { mode: 'json' }).$type<{
      frequency?: 'instant' | 'daily' | 'weekly';
      categories?: string[];
    }>(),
    subscribedAt: integer('subscribed_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
    unsubscribedAt: integer('unsubscribed_at', { mode: 'timestamp' }),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index('user_newsletter_sources_source_id_idx').on(table.sourceId),
    index('user_newsletter_sources_user_source_idx').on(table.userId, table.sourceId),
  ],
);

// Alias for backward compatibility
export const userSubscriptions = userNewsletterSources;

// User-created folders for organization
export const userFolders = sqliteTable(
  'user_folders',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    description: text('description'),
    color: text('color').default('#6366f1'), // Hex color code
    sortOrder: integer('sort_order').default(0),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [index('user_folders_user_id_idx').on(table.userId)],
);

// Newsletter-to-folder assignments
export const newsletterFolders = sqliteTable(
  'newsletter_folders',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userNewsletterId: text('user_newsletter_id')
      .notNull()
      .references(() => userNewsletters.id, { onDelete: 'cascade' }),
    folderId: text('folder_id')
      .notNull()
      .references(() => userFolders.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [index('newsletter_folders_user_newsletter_idx').on(table.userNewsletterId)],
);

// User preferences for feed personalization
export const userPreferences = sqliteTable(
  'user_preferences',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' })
      .unique(),
    region: text('region').default('ROW').notNull(), // KR, ROW
    preferredCategories: text('preferred_categories', { mode: 'json' })
      .$type<string[]>()
      .default([]),
    readingSpeedWpm: integer('reading_speed_wpm').default(200), // Words per minute for read time calculation
    emailFrequency: text('email_frequency').default('instant'), // instant, daily, weekly
    settings: text('settings', { mode: 'json' }).$type<Record<string, any>>().default({}), // UI preferences, etc.
    createdAt: integer('created_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [index('user_preferences_user_id_idx').on(table.userId)],
);

// Relations
export const newsletterSourcesRelations = relations(newsletterSources, ({ many }) => ({
  newsletters: many(newsletters),
  userSubscriptions: many(userNewsletterSources),
}));

export const newslettersRelations = relations(newsletters, ({ one, many }) => ({
  source: one(newsletterSources, {
    fields: [newsletters.sourceId],
    references: [newsletterSources.id],
  }),
  userInteractions: many(userNewsletters),
}));

export const userNewslettersRelations = relations(userNewsletters, ({ one }) => ({
  user: one(users, {
    fields: [userNewsletters.userId],
    references: [users.id],
  }),
  newsletter: one(newsletters, {
    fields: [userNewsletters.newsletterId],
    references: [newsletters.id],
  }),
}));

export const userNewsletterSourcesRelations = relations(userNewsletterSources, ({ one }) => ({
  user: one(users, {
    fields: [userNewsletterSources.userId],
    references: [users.id],
  }),
  source: one(newsletterSources, {
    fields: [userNewsletterSources.sourceId],
    references: [newsletterSources.id],
  }),
}));

export const userFoldersRelations = relations(userFolders, ({ one, many }) => ({
  user: one(users, {
    fields: [userFolders.userId],
    references: [users.id],
  }),
  newsletterAssignments: many(newsletterFolders),
}));

export const newsletterFoldersRelations = relations(newsletterFolders, ({ one }) => ({
  userNewsletter: one(userNewsletters, {
    fields: [newsletterFolders.userNewsletterId],
    references: [userNewsletters.id],
  }),
  folder: one(userFolders, {
    fields: [newsletterFolders.folderId],
    references: [userFolders.id],
  }),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id],
  }),
}));
