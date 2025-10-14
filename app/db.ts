import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as authSchema from '@/features/auth/schema';
import * as feedSchema from '@/features/newsletter/schema';
import * as marketingSchema from '@/features/marketing/schema';

const client = postgres(process.env.DATABASE_URL!, { prepare: false });

export const db = drizzle(client, {
  schema: {
    ...authSchema,
    ...feedSchema,
    ...marketingSchema,
  },
  // logger: true,
});
