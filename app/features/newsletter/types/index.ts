// Newsletter types
export interface NewsletterSource {
  id: string;
  name: string;
  email: string;
  domain?: string | null;
  description?: string | null;
  category?: string | null;
  logoUrl?: string | null;
  website?: string | null;
  isVerified?: boolean;
  isFeatured?: boolean;
}

export interface Newsletter {
  id: string;
  subject: string;
  htmlContent?: string | null;
  textContent?: string | null;
  extractedContent?: string | null;
  excerpt?: string | null;
  summary?: string | null;
  receivedAt: Date;
  senderEmail: string;
  senderName?: string | null;
  source?: NewsletterSource;
  thumbnailUrl?: string | null;
  originalUrl?: string | null;
  readTimeMinutes?: number | null;
  tags: string[];
  category?: string | null;
  userInteraction?: UserInteraction;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserInteraction {
  isRead: boolean;
  isBookmarked: boolean;
  isArchived: boolean;
  readAt?: Date | null;
  bookmarkedAt?: Date | null;
  archivedAt?: Date | null;
}

export interface FeedFilters {
  tab: 'all' | 'unread' | 'bookmarked' | 'archived';
  sortBy: 'latest' | 'oldest' | 'sender' | 'readtime';
  searchQuery?: string;
  page: number;
  limit: number;
}

export interface NewsletterStats {
  total: number;
  unread: number;
  bookmarked: number;
  archived: number;
}

export interface UserFolder {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  color?: string | null;
  sortOrder?: number;
  createdAt: Date;
}

export interface UserPreferences {
  id: string;
  userId: string;
  region: 'KR' | 'ROW';
  preferredCategories: string[];
  readingSpeedWpm?: number;
  emailFrequency: 'instant' | 'daily' | 'weekly';
  settings?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}