import { pgTable, text, timestamp, varchar, jsonb, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Waitlist entries for pre-launch email collection
export const waitlist = pgTable('waitlist', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  // Contact information
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }), // Optional name field

  // Tracking
  source: varchar('source', { length: 50 }).default('homepage').notNull(), // homepage, pricing, blog, etc.
  status: varchar('status', { length: 20 }).default('pending').notNull(), // pending, invited, converted

  // Metadata for analytics
  metadata: jsonb('metadata')
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
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
  invitedAt: timestamp('invited_at'), // When launch invitation was sent
  convertedAt: timestamp('converted_at'), // When they actually signed up
});

// Relations (if needed in the future for user conversion tracking)
export const waitlistRelations = relations(waitlist, ({}) => ({}));
