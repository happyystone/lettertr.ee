import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Waitlist entries for pre-launch email collection
export const waitlist = sqliteTable('waitlist', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  // Contact information
  email: text('email').notNull().unique(),
  name: text('name'), // Optional name field

  // Tracking
  source: text('source').default('homepage').notNull(), // homepage, pricing, blog, etc.
  status: text('status').default('pending').notNull(), // pending, invited, converted

  // Metadata for analytics
  metadata: text('metadata', { mode: 'json' })
    .$type<{
      referrer?: string;
      utmSource?: string;
      utmMedium?: string;
      utmCampaign?: string;
      utmTerm?: string;
      utmContent?: string;
      userAgent?: string;
      ipCountry?: string;
    }>()
    .default({}),

  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  invitedAt: integer('invited_at', { mode: 'timestamp' }), // When launch invitation was sent
  convertedAt: integer('converted_at', { mode: 'timestamp' }), // When they actually signed up
});

// Relations (if needed in the future for user conversion tracking)
export const waitlistRelations = relations(waitlist, ({}) => ({}));
