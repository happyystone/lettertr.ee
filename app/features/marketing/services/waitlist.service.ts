import { db } from '@/db';
import { waitlist } from '../schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import type { WaitlistEntry, WaitlistMetadata } from '../types';

export class WaitlistService {
  /**
   * Add email to waitlist
   */
  static async addToWaitlist(
    email: string,
    options: {
      name?: string;
      source?: string;
      metadata?: WaitlistMetadata;
    } = {},
  ): Promise<{ success: boolean; message: string; isExisting?: boolean }> {
    try {
      // Check if email already exists
      const existing = await db
        .select()
        .from(waitlist)
        .where(eq(waitlist.email, email.toLowerCase()))
        .limit(1);

      if (existing.length > 0) {
        return {
          success: false,
          message: '이미 대기 리스트에 등록된 이메일입니다.',
          isExisting: true,
        };
      }

      // Add to waitlist
      await db.insert(waitlist).values({
        email: email.toLowerCase(),
        name: options.name,
        source: options.source || 'homepage',
        metadata: options.metadata || {},
      });

      return {
        success: true,
        message: '대기 리스트에 성공적으로 등록되었습니다!',
      };
    } catch (error) {
      console.error('Failed to add to waitlist:', error);
      return {
        success: false,
        message: '등록 중 오류가 발생했습니다. 다시 시도해주세요.',
      };
    }
  }

  /**
   * Check if email exists in waitlist
   */
  static async checkDuplicate(email: string): Promise<boolean> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(waitlist)
      .where(eq(waitlist.email, email.toLowerCase()));

    return result[0]?.count > 0;
  }

  /**
   * Get total waitlist count
   */
  static async getWaitlistCount(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(waitlist)
      .where(eq(waitlist.status, 'pending'));

    return result[0]?.count || 0;
  }

  /**
   * Get waitlist entries (admin only)
   */
  static async getWaitlistEntries(
    options: {
      status?: 'pending' | 'invited' | 'converted';
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<{
    entries: WaitlistEntry[];
    total: number;
  }> {
    const { status = 'pending', limit = 50, offset = 0 } = options;

    // Get entries
    const entries = await db
      .select()
      .from(waitlist)
      .where(eq(waitlist.status, status))
      .orderBy(desc(waitlist.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(waitlist)
      .where(eq(waitlist.status, status));

    return {
      entries: entries as WaitlistEntry[],
      total: totalResult[0]?.count || 0,
    };
  }

  /**
   * Update waitlist entry status
   */
  static async updateStatus(
    email: string,
    status: 'pending' | 'invited' | 'converted',
  ): Promise<boolean> {
    try {
      const updateData: any = { status };

      // Set appropriate timestamp based on status
      if (status === 'invited') {
        updateData.invitedAt = new Date();
      } else if (status === 'converted') {
        updateData.convertedAt = new Date();
      }

      const result = await db
        .update(waitlist)
        .set(updateData)
        .where(eq(waitlist.email, email.toLowerCase()));

      return true;
    } catch (error) {
      console.error('Failed to update waitlist status:', error);
      return false;
    }
  }

  /**
   * Mark emails as invited (for bulk launch notifications)
   */
  static async markAsInvited(emails: string[]): Promise<number> {
    try {
      const lowerEmails = emails.map((e) => e.toLowerCase());

      await db
        .update(waitlist)
        .set({
          status: 'invited',
          invitedAt: new Date(),
        })
        .where(and(sql`${waitlist.email} = ANY(${lowerEmails})`, eq(waitlist.status, 'pending')));

      return emails.length;
    } catch (error) {
      console.error('Failed to mark as invited:', error);
      return 0;
    }
  }

  /**
   * Get statistics for dashboard
   */
  static async getStatistics() {
    const stats = await db
      .select({
        total: sql<number>`count(*)`,
        pending: sql<number>`count(*) filter (where ${waitlist.status} = 'pending')`,
        invited: sql<number>`count(*) filter (where ${waitlist.status} = 'invited')`,
        converted: sql<number>`count(*) filter (where ${waitlist.status} = 'converted')`,
      })
      .from(waitlist);

    return {
      total: stats[0]?.total || 0,
      pending: stats[0]?.pending || 0,
      invited: stats[0]?.invited || 0,
      converted: stats[0]?.converted || 0,
      conversionRate:
        stats[0]?.invited > 0 ? ((stats[0]?.converted / stats[0]?.invited) * 100).toFixed(1) : '0',
    };
  }

  /**
   * Export waitlist to CSV format
   */
  static async exportToCSV(status?: 'pending' | 'invited' | 'converted'): Promise<string> {
    const query = status
      ? db.select().from(waitlist).where(eq(waitlist.status, status))
      : db.select().from(waitlist);

    const entries = await query.orderBy(desc(waitlist.createdAt));

    // Create CSV header
    const headers = [
      'Email',
      'Name',
      'Source',
      'Status',
      'Created At',
      'Invited At',
      'Converted At',
    ];
    const csvRows = [headers.join(',')];

    // Add data rows
    for (const entry of entries) {
      const row = [
        entry.email,
        entry.name || '',
        entry.source,
        entry.status,
        entry.createdAt.toISOString(),
        entry.invitedAt?.toISOString() || '',
        entry.convertedAt?.toISOString() || '',
      ];
      csvRows.push(row.map((v) => `"${v}"`).join(','));
    }

    return csvRows.join('\n');
  }
}
