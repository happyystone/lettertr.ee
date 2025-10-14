import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  json,
  varchar,
  pgPolicy,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { authenticatedRole } from 'drizzle-orm/supabase';

export const users = pgTable(
  'users',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified')
      .$defaultFn(() => false)
      .notNull(),
    image: text('image'),
    avatar: text('avatar'),
    avatarUrl: text('avatar_url'),
    createdAt: timestamp('created_at')
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: timestamp('updated_at')
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    polarCustomerId: text('polar_customer_id'), // Changed from stripeCustomerId to polarCustomerId
    // Newsletter-related fields
    lettertreeEmail: text('lettertree_email').unique(), // username@lettertr.ee email
    region: varchar('region', { length: 3 }).default('ROW'), // 'KR' or 'ROW'
    preferences: json('preferences').$type<{
      categories: string[];
      languages: string[];
      emailFrequency: 'instant' | 'daily' | 'weekly';
      readingMode: 'light' | 'dark' | 'system';
    }>(),
    isOnboarded: boolean('is_onboarded').default(false).notNull(),
  },
  (table) => [
    // RLS Policy: Users can only access their own profile
    pgPolicy('users_self_policy', {
      as: 'permissive',
      for: 'all',
      to: authenticatedRole,
      using: sql`id = current_setting('app.current_user_id')::text`,
      withCheck: sql`id = current_setting('app.current_user_id')::text`,
    }),
  ],
);

export const sessions = pgTable(
  'sessions',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => [
    // RLS Policy: Users can only access their own sessions
    pgPolicy('sessions_user_policy', {
      as: 'permissive',
      for: 'all',
      to: authenticatedRole,
      using: sql`user_id = current_setting('app.current_user_id')::text`,
      withCheck: sql`user_id = current_setting('app.current_user_id')::text`,
    }),
  ],
);

export const accounts = pgTable(
  'accounts',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
  },
  (table) => [
    // RLS Policy: Users can only access their own OAuth accounts
    pgPolicy('accounts_user_policy', {
      as: 'permissive',
      for: 'all',
      to: authenticatedRole,
      using: sql`user_id = current_setting('app.current_user_id')::text`,
      withCheck: sql`user_id = current_setting('app.current_user_id')::text`,
    }),
  ],
);

export const verifications = pgTable(
  'verifications',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()),
    updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()),
  },
  (table) => [
    // RLS Policy: Users can only access their own verification tokens
    // Note: identifier is usually an email, so we match against the user's email
    pgPolicy('verifications_user_policy', {
      as: 'permissive',
      for: 'all',
      to: authenticatedRole,
      using: sql`identifier IN (
        SELECT email FROM users WHERE id = current_setting('app.current_user_id')::text
      )`,
      withCheck: sql`identifier IN (
        SELECT email FROM users WHERE id = current_setting('app.current_user_id')::text
      )`,
    }),
  ],
);

export const subscriptions = pgTable(
  'subscriptions',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }), // Added userId for RLS
    plan: text('plan').notNull(),
    referenceId: text('reference_id').notNull(),
    polarCustomerId: text('polar_customer_id'), // Changed from stripeCustomerId
    polarSubscriptionId: text('polar_subscription_id'), // Changed from stripeSubscriptionId
    status: text('status').default('incomplete'),
    periodStart: timestamp('period_start'),
    periodEnd: timestamp('period_end'),
    cancelAtPeriodEnd: boolean('cancel_at_period_end'),
    seats: integer('seats'),
    trialStart: timestamp('trial_start'),
    trialEnd: timestamp('trial_end'),
  },
  (table) => [
    // RLS Policy: Users can only access their own subscriptions
    pgPolicy('subscriptions_user_policy', {
      as: 'permissive',
      for: 'all',
      to: authenticatedRole,
      using: sql`user_id = current_setting('app.current_user_id')::text`,
      withCheck: sql`user_id = current_setting('app.current_user_id')::text`,
    }),
  ],
);
