import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  index,
  uniqueIndex,
  varchar,
  pgPolicy,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { authenticatedRole, anonRole } from 'drizzle-orm/supabase';
import { users } from '../auth/schema';

// Newsletter sources (e.g., TechCrunch, BBC News) - 발신자 정보
export const newsletterSources = pgTable('newsletter_sources', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: varchar('email', { length: 255 }).notNull().unique(), // 발신자 이메일
  name: varchar('name', { length: 255 }).notNull(),
  domain: varchar('domain', { length: 255 }), // 도메인 (예: techcrunch.com)
  description: text('description'),
  category: varchar('category', { length: 100 }), // NEWS, AI, BUSINESS, TECH, etc.
  logoUrl: text('logo_url'),
  website: text('website'),
  subscribeUrl: text('subscribe_url'),

  // Discovery features
  isVerified: boolean('is_verified').default(false).notNull(), // 검증된 발신자
  isFeatured: boolean('is_featured').default(false).notNull(), // 추천 뉴스레터
  subscriberCount: integer('subscriber_count').default(0),

  isActive: boolean('is_active').default(true).notNull(),
  region: varchar('region', { length: 10 }).default('ROW').notNull(), // KR, ROW (Rest of World)

  // 통계
  totalNewsletters: integer('total_newsletters').default(0),
  lastNewsletterAt: timestamp('last_newsletter_at'),

  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => new Date())
    .notNull(),
  updateCount: integer('update_count').default(0).notNull(),
});

// Individual newsletter emails received via ForwardEmail
export const newsletters = pgTable(
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
    senderEmail: varchar('sender_email', { length: 255 }).notNull(),
    senderName: varchar('sender_name', { length: 255 }),

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
    headers: jsonb('headers').$type<Record<string, string>>().default({}),
    attachments: jsonb('attachments')
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
    tags: jsonb('tags').$type<string[]>().default([]),
    category: varchar('category', { length: 100 }), // auto-categorized

    // Status
    isActive: boolean('is_active').default(true).notNull(),

    // Timestamps
    receivedAt: timestamp('received_at').notNull(), // 이메일 수신 시간
    createdAt: timestamp('created_at')
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp('updated_at')
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index('newsletters_source_id_idx').on(table.sourceId),
    index('newsletters_received_at_idx').on(table.receivedAt),
    // RLS Policy: Users can only see newsletters from sources they subscribe to
    pgPolicy('newsletters_subscription_policy', {
      as: 'permissive',
      for: 'select',
      to: authenticatedRole,
      using: sql`EXISTS (
        SELECT 1 FROM ${userNewsletterSources}
        WHERE ${userNewsletterSources.sourceId} = source_id
        AND ${userNewsletterSources.userId} = current_setting('app.current_user_id')::text
        AND ${userNewsletterSources.isSubscribed} = true
      )`,
    }),
    // Anonymous/webhook can insert newsletters (for email processing)
    pgPolicy('newsletters_insert_policy', {
      as: 'permissive',
      for: 'insert',
      to: anonRole,
      withCheck: sql`source_id IS NOT NULL`,
    }),
  ],
);

// User-specific newsletter interactions
export const userNewsletters = pgTable(
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
    isRead: boolean('is_read').default(false).notNull(),
    isBookmarked: boolean('is_bookmarked').default(false).notNull(),
    isArchived: boolean('is_archived').default(false).notNull(),
    readAt: timestamp('read_at'),
    bookmarkedAt: timestamp('bookmarked_at'),
    archivedAt: timestamp('archived_at'),
    createdAt: timestamp('created_at')
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index('user_newsletters_user_id_idx').on(table.userId),
    uniqueIndex('user_newsletters_user_newsletter_unique').on(table.userId, table.newsletterId),
    // RLS Policy: Users can only access their own newsletter interactions
    pgPolicy('user_newsletters_policy', {
      as: 'permissive',
      for: 'all',
      to: authenticatedRole,
      using: sql`user_id = current_setting('app.current_user_id')::text`,
      withCheck: sql`user_id = current_setting('app.current_user_id')::text`,
    }),
  ],
);

// User newsletter source subscriptions
export const userNewsletterSources = pgTable(
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
    isSubscribed: boolean('is_subscribed').default(true).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    isPaused: boolean('is_paused').default(false).notNull(),
    subscriptionEmail: varchar('subscription_email', { length: 255 }),
    preferences: jsonb('preferences').$type<{
      frequency?: 'instant' | 'daily' | 'weekly';
      categories?: string[];
    }>(),
    subscribedAt: timestamp('subscribed_at')
      .$defaultFn(() => new Date())
      .notNull(),
    unsubscribedAt: timestamp('unsubscribed_at'),
    updatedAt: timestamp('updated_at')
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index('user_newsletter_sources_source_id_idx').on(table.sourceId),
    index('user_newsletter_sources_user_source_idx').on(table.userId, table.sourceId),
    // RLS Policy: Users can only manage their own subscriptions
    pgPolicy('user_newsletter_sources_policy', {
      as: 'permissive',
      for: 'all',
      to: authenticatedRole,
      using: sql`user_id = current_setting('app.current_user_id')::text`,
      withCheck: sql`user_id = current_setting('app.current_user_id')::text`,
    }),
  ],
);

// Alias for backward compatibility
export const userSubscriptions = userNewsletterSources;

// User-created folders for organization
export const userFolders = pgTable(
  'user_folders',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    color: varchar('color', { length: 20 }).default('#6366f1'), // Hex color code
    sortOrder: integer('sort_order').default(0),
    createdAt: timestamp('created_at')
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index('user_folders_user_id_idx').on(table.userId),
    // RLS Policy: Users can only manage their own folders
    pgPolicy('user_folders_policy', {
      as: 'permissive',
      for: 'all',
      to: authenticatedRole,
      using: sql`user_id = current_setting('app.current_user_id')::text`,
      withCheck: sql`user_id = current_setting('app.current_user_id')::text`,
    }),
  ],
);

// Newsletter-to-folder assignments
export const newsletterFolders = pgTable(
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
    createdAt: timestamp('created_at')
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index('newsletter_folders_user_newsletter_idx').on(table.userNewsletterId),
    // RLS Policy: Users can only manage newsletter-folder associations for their own newsletters
    pgPolicy('newsletter_folders_policy', {
      as: 'permissive',
      for: 'all',
      to: authenticatedRole,
      using: sql`EXISTS (
        SELECT 1 FROM user_newsletters un
        WHERE un.id = user_newsletter_id
        AND un.user_id = current_setting('app.current_user_id')::text
      )`,
      withCheck: sql`EXISTS (
        SELECT 1 FROM user_newsletters un
        WHERE un.id = user_newsletter_id
        AND un.user_id = current_setting('app.current_user_id')::text
      )`,
    }),
  ],
);

// User preferences for feed personalization
export const userPreferences = pgTable(
  'user_preferences',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' })
      .unique(),
    region: varchar('region', { length: 10 }).default('ROW').notNull(), // KR, ROW
    preferredCategories: jsonb('preferred_categories').$type<string[]>().default([]),
    readingSpeedWpm: integer('reading_speed_wpm').default(200), // Words per minute for read time calculation
    emailFrequency: varchar('email_frequency', { length: 20 }).default('instant'), // instant, daily, weekly
    settings: jsonb('settings').$type<Record<string, any>>().default({}), // UI preferences, etc.
    createdAt: timestamp('created_at')
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp('updated_at')
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index('user_preferences_user_id_idx').on(table.userId),
    // RLS Policy: Users can only manage their own preferences
    pgPolicy('user_preferences_policy', {
      as: 'permissive',
      for: 'all',
      to: authenticatedRole,
      using: sql`user_id = current_setting('app.current_user_id')::text`,
      withCheck: sql`user_id = current_setting('app.current_user_id')::text`,
    }),
  ],
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
