import { type ActionFunctionArgs, data } from 'react-router';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';
import { GoogleGenAI } from '@google/genai';

import { db } from '@/db';
import { users } from '@/features/auth/schema';
import {
  newsletters,
  newsletterSources,
  userNewsletters,
  userNewsletterSources,
} from '@/features/newsletter/schema';
import { parseEmail, type ParsedEmail } from '@/lib/email/parser';
import { site } from '@/config/site';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Cloudflare Email Worker webhook payload schema
const cloudflareEmailSchema = z.object({
  messageId: z.string(),
  from: z.object({
    address: z.string(), // SRS 형식도 허용하기 위해 string으로 변경
    name: z.string(),
  }),
  to: z.array(
    // 배열로 변경
    z.object({
      address: z.email(),
      name: z.string(),
    }),
  ),
  subject: z.string(),
  bodyHtml: z.string().optional(),
  bodyText: z.string().optional(),
  headers: z.record(z.string(), z.string()),
  attachments: z.array(
    z.object({
      filename: z.string(),
      contentType: z.string(),
      size: z.number(),
      content: z.string().optional(), // base64 encoded
    }),
  ),
  receivedAt: z.string(),
  rawSize: z.number(),
});

// Extract domain from email
function extractDomain(email: string): string {
  const parts = email.split('@');
  return parts[1] || '';
}

// Extract name from email if available
function extractName(email: string): string | null {
  // Email might be in format "Name <email@domain.com>"
  const match = email.match(/^(.*?)\s*<(.+?)>$/);
  if (match) {
    return match[1].trim() || null;
  }
  return null;
}

async function linkUserNewsletterAndUpdateSource(
  user: typeof users.$inferSelect,
  newsletter: typeof newsletters.$inferSelect,
  source: typeof newsletterSources.$inferSelect,
  parsedSource: ParsedEmail['letterSource'],
) {
  const isExistUserNewsletterSource = await db.query.userNewsletterSources.findFirst({
    where: (userNewsletterSources, { eq, and }) =>
      and(eq(userNewsletterSources.userId, user.id), eq(userNewsletterSources.sourceId, source.id)),
  });

  if (!isExistUserNewsletterSource) {
    await db.insert(userNewsletterSources).values({
      userId: user.id,
      sourceId: source.id,
      subscriptionEmail: user.lettertreeEmail,
    });
  }

  await db.insert(userNewsletters).values({
    userId: user.id,
    newsletterId: newsletter.id,
  });
  const subscriberCount = await db.query.userNewsletterSources.findMany({
    where: (userNewsletterSources, { eq }) => eq(userNewsletterSources.sourceId, source.id),
  });

  // 2번 업데이트된 newsletter source는 description, logoUrl, website, category를 더 이상 업데이트하지 않음
  if (source.updateCount >= 2) {
    await db
      .update(newsletterSources)
      .set({
        lastNewsletterAt: new Date(),
        updatedAt: new Date(),
        subscriberCount: subscriberCount.length,
      })
      .where(eq(newsletterSources.id, source.id));

    return;
  }

  // Update source statistics
  await db
    .update(newsletterSources)
    .set({
      description: parsedSource?.description || source.description,
      logoUrl: parsedSource?.logoUrl || source.logoUrl,
      website: parsedSource?.website || source.website,
      category: parsedSource?.category || source.category,
      lastNewsletterAt: new Date(),
      updatedAt: new Date(),
      subscriberCount: subscriberCount.length,
      updateCount: (source.updateCount || 0) + 1,
    })
    .where(eq(newsletterSources.id, source.id));
}

async function processCloudflareEmail(parsedData: z.infer<typeof cloudflareEmailSchema>) {
  try {
    // Extract recipient email (should be username@lettertr.ee)
    // to 필드가 배열이므로 첫 번째 수신자를 사용
    const recipientEmail = parsedData.to[0]?.address;

    if (recipientEmail === site.mailFrom) {
      return data({ success: true }, { status: 200 });
    }

    if (!recipientEmail || !recipientEmail.endsWith('@lettertr.ee')) {
      console.log(`Ignoring email to non-lettertr.ee address: ${recipientEmail}`);
      return data({ message: 'Not a lettertr.ee email' }, { status: 200 });
    }

    // Extract sender info
    const senderEmail = parsedData.from.address;
    const senderName = parsedData.from.name || extractName(parsedData.from.address);

    console.log(`Processing email from ${senderEmail} to ${recipientEmail}`);

    // Find user by lettertree email
    const user = await db.query.users.findFirst({
      where: eq(users.lettertreeEmail, recipientEmail),
    });

    if (!user) {
      console.error(`User not found for email: ${recipientEmail}`);
      return data({ message: 'User not found' }, { status: 200 });
    }

    // Parse email content
    const sanitizedHtml = DOMPurify.sanitize(parsedData.bodyHtml || '');
    const parsedEmail = await parseEmail(
      sanitizedHtml,
      parsedData.bodyText,
      parsedData.subject,
      ai,
    );

    // Check if newsletter source exists, create if not
    let source = await db.query.newsletterSources.findFirst({
      where: eq(newsletterSources.email, senderEmail),
    });

    if (!source) {
      // Create new newsletter source
      const [newSource] = await db
        .insert(newsletterSources)
        .values({
          email: senderEmail,
          name: senderName || senderEmail,
          domain: extractDomain(senderEmail),
          updateCount: 0,
          ...parsedEmail.letterSource,
        })
        .returning();

      source = newSource;
    }

    // Process attachments (store metadata only, not content)
    const attachmentMetadata = parsedData.attachments.map((att) => ({
      filename: att.filename,
      contentType: att.contentType,
      size: att.size,
      // Don't store actual content in DB, could use S3/R2 for that
    }));

    // Create newsletter entry
    const [newsletter] = await db
      .insert(newsletters)
      .values({
        sourceId: source.id,
        newsletterHash: parsedEmail.newsletterHash,
        messageId: parsedData.messageId,
        subject: parsedData.subject,
        senderEmail: senderEmail,
        senderName: senderName,
        htmlContent: sanitizedHtml,
        textContent: parsedData.bodyText,
        extractedContent: parsedEmail.extractedContent,
        excerpt: parsedEmail.excerpt,
        thumbnailUrl: parsedEmail.thumbnailUrl,
        originalUrl: parsedEmail.originalUrl,
        readTimeMinutes: parsedEmail.readTimeMinutes,
        tags: parsedEmail.tags,
        category: parsedEmail.category,
        headers: parsedData.headers,
        attachments: attachmentMetadata,
        receivedAt: new Date(parsedData.receivedAt),
      })
      .returning();

    await linkUserNewsletterAndUpdateSource(user, newsletter, source, parsedEmail.letterSource);
    console.log(`Newsletter processed successfully: ${newsletter.id}`);

    // Return success with newsletter ID
    return data(
      {
        success: true,
        message: 'Newsletter processed successfully',
        id: newsletter.id,
        messageId: parsedData.messageId,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error processing Cloudflare email:', error);

    // Return error but with 200 status to prevent Worker retries
    // Worker will handle the error based on response content
    return data(
      {
        success: false,
        error: 'Failed to process email',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 200 },
    );
  }
}

// Verify webhook signature from Cloudflare Worker
async function verifyCloudflareSignature(
  payload: string,
  signature: string | null,
  timestamp: string | null,
  secret: string,
): Promise<boolean> {
  if (!signature || !timestamp) return false;

  // Check timestamp to prevent replay attacks (5 minute window)
  const currentTime = Date.now();
  const webhookTime = parseInt(timestamp);
  if (Math.abs(currentTime - webhookTime) > 300000) {
    console.error('Webhook timestamp too old or too far in future');
    return false;
  }

  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${payload}`)
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

export async function action({ request }: ActionFunctionArgs) {
  // Only accept POST requests
  if (request.method !== 'POST') {
    return data({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    // Get headers for verification
    const signature = request.headers.get('x-cf-signature');
    const timestamp = request.headers.get('x-cf-timestamp');
    const workerVersion = request.headers.get('x-cf-email-worker');

    console.log(`Worker version: ${workerVersion}`);

    // Get webhook secret from environment
    const webhookSecret = process.env.CLOUDFLARE_EMAIL_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('CLOUDFLARE_EMAIL_WEBHOOK_SECRET not configured');
      return data({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    // Get raw body for signature verification
    const rawBody = await request.text();

    // Verify signature
    if (!verifyCloudflareSignature(rawBody, signature, timestamp, webhookSecret)) {
      console.error('Invalid signature');
      return data({ error: 'Invalid signature' }, { status: 401 });
    }

    // Parse the payload
    const payload = JSON.parse(rawBody);
    const parsed = cloudflareEmailSchema.safeParse(payload);

    if (!parsed.success) {
      console.error('Invalid webhook payload:', parsed.error);
      return data({ error: 'Invalid payload format' }, { status: 400 });
    }
    const parsedData = parsed.data;

    // Process the email
    return await processCloudflareEmail(parsedData);
  } catch (error) {
    console.error('Webhook processing error:', error);

    return data(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 },
    );
  }
}

// This webhook doesn't have a loader
export function loader() {
  return data({ message: 'Webhook endpoint' }, { status: 200 });
}
