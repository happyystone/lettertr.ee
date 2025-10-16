import * as cheerio from 'cheerio';
import { GoogleGenAI, Type } from '@google/genai';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { newsletters, newsletterSources } from '@/features/newsletter/schema';

// Email content parser utilities

export interface ParsedEmail {
  extractedContent: string;
  excerpt: string;
  thumbnailUrl?: string | null;
  originalUrl?: string;
  readTimeMinutes: number;
  tags: string[];
  category?: string;
  newsletterHash: string;
  letterSource?: {
    description?: string;
    logoUrl?: string;
    category?: string;
    website?: string;
    region?: 'KR' | 'ROW';
    subscribeUrl?: string;
  };
}

/**
 * Extract clean text content from HTML email
 */
export function extractTextFromHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // script 태그 제거
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // style 태그 제거
    .replace(/<[^>]*>/g, ' ') // 모든 HTML 태그 제거
    .replace(/&nbsp;/g, ' ') // &nbsp; 변환
    .replace(/&amp;/g, '&') // HTML 엔티티 변환
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ') // 연속된 공백을 하나로
    .trim();
}

export async function getNewsletterInfoWithAi(
  ai: GoogleGenAI,
  html: string,
  newsletterHash: string,
): Promise<{
  thumbnailUrl: string;
  category: string;
  originalUrl: string;
  tags: string[];
  source: ParsedEmail['letterSource'];
} | null> {
  const [existingNewsletter] = await db
    .select()
    .from(newsletters)
    .where(eq(newsletters.newsletterHash, newsletterHash))
    .limit(1);

  const source = existingNewsletter
    ? (
        await db
          .select()
          .from(newsletterSources)
          .where(eq(newsletterSources.id, existingNewsletter.sourceId))
          .limit(1)
      )[0]
    : null;

  // 해당 source의 뉴스레터가 이미 있으면서 동시에 2번 업데이트된 newsletter source는 더 이상 AI를 통한 업데이트를 하지 않음
  if (existingNewsletter && source && source.updateCount >= 2) {
    return {
      thumbnailUrl: existingNewsletter.thumbnailUrl || '',
      category: existingNewsletter.category || '',
      originalUrl: existingNewsletter.originalUrl || '',
      tags: existingNewsletter.tags || [],
      source: {
        description: source.description || '',
        logoUrl: source.logoUrl || '',
        category: source.category || '',
        website: source.website || '',
        region: (source.region as 'KR' | 'ROW') || 'ROW',
        subscribeUrl: source.subscribeUrl || '',
      },
    };
  }

  const requestMessage = `
    이 이메일 html에서 발신자의 정보를 source에 담아줘. 
    source는 뉴스레터 발행자의 간단한 설명(description), 발행자의 로고 이미지 url(logoUrl), 발행자의 카테고리(category), 발행자 웹사이트 url(website), 발행자 지역(region -> 한국이면 KR, 그 외는 ROW), 발행자 구독 url(subscribeUrl)을 담아줘.
    그리고 해당 뉴스레터에 가장 어울리는 썸네일 이미지, 카테고리, 태그들을 추출해주고, 이 뉴스레터의 원본 링크를 추출해줘. 
    카테고리는 AI, TECH, BUSINESS, STARTUP, DESIGN, MARKETING, PRODUCTIVITY... 이런식으로 너가 가장 어울리는 것을 하나 선택해서 반환해주고, 
    태그들도 너가 가장 어울린다고 생각하는 태그들을 배열로 반환해줘.
    다른 정보는 필요 없고, "뉴스레터 발행자 정보"와 "뉴스레터 썸네일 이미지의 url과 카테고리, 원본 링크 url, 태그들"만 딱 반환해줘.
    (그리고 만약, 위 정보들 중에 너가 특정할 수 없는 값이 있으면 해당 값은 아무것도 채우지 말고 비워두고 반환해줘)
  `;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ text: requestMessage }, { text: html }],
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          thumbnailUrl: { type: Type.STRING },
          category: { type: Type.STRING },
          originalUrl: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          source: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING },
              logoUrl: { type: Type.STRING },
              category: { type: Type.STRING },
              website: { type: Type.STRING },
              region: { type: Type.STRING, enum: ['KR', 'ROW'] },
              subscribeUrl: { type: Type.STRING },
            },
            required: ['description', 'logoUrl', 'category', 'website', 'region', 'subscribeUrl'],
            additionalProperties: false,
          },
        },
        required: ['thumbnailUrl', 'category', 'originalUrl', 'tags', 'source'],
        additionalProperties: false,
      },
    },
  });

  return response.text ? JSON.parse(response.text) : null;
}

/**
 * Extract first image URL from HTML content
 */
export function extractThumbnailUrl(html: string): string | null {
  // HTML 로드
  const $ = cheerio.load(html);

  // img 태그 찾기
  const images = $('img');

  if (images.length === 0) {
    return null;
  }

  // 가장 적합한 이미지 선택 로직
  // 우선순위: (1) width >= 200, (2) 첫 번째 img
  for (let i = 0; i < images.length; i++) {
    const img = images.eq(i);
    const src = img.attr('src');
    if (!src) continue;

    const widthAttr = parseInt(img.attr('width') || '0', 10);
    const style = img.attr('style') || '';
    const styleMatch = style.match(/max-width:\s*(\d+)px/i);
    const styleWidth = styleMatch ? parseInt(styleMatch[1], 10) : 0;

    const effectiveWidth = Math.max(widthAttr, styleWidth);

    if (effectiveWidth >= 200) {
      return src;
    }
  }

  return images.eq(images.length / 2).attr('src') || null;
}

/**
 * Extract main article URL from newsletter
 */
export function extractOriginalUrl(html: string): string | undefined {
  const $ = cheerio.load(html);

  // Common patterns for "Read more" or main article links
  const patterns = [
    'a:contains("Read more")',
    'a:contains("Read More")',
    'a:contains("Continue reading")',
    'a:contains("View in browser")',
    'a:contains("Read the full")',
    'a:contains("Read article")',
    'a:contains("Full article")',
    'a.primary-button',
    'a.main-cta',
    'a.read-more',
  ];

  for (const pattern of patterns) {
    const link = $(pattern).first();
    if (link.length) {
      const href = link.attr('href');
      if (href && href.startsWith('http')) {
        return href;
      }
    }
  }

  // If no specific pattern found, look for the first substantial link
  const allLinks = $('a[href^="http"]').filter((_, el): boolean => {
    const text = $(el).text().trim();
    const href = $(el).attr('href');

    // Skip social media and unsubscribe links
    if (href && /twitter|facebook|linkedin|instagram|unsubscribe/i.test(href)) {
      return false;
    }

    // Look for links with substantial text
    return text.length > 1;
  });

  if (allLinks.length) {
    return allLinks.first().attr('href');
  }

  return undefined;
}

/**
 * Generate excerpt from content
 */
export function generateExcerpt(htmlContent?: string | null, textContent?: string): string {
  const content = textContent || htmlContent?.replace(/<[^>]*>/g, ' ') || '';

  return content
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/ {2,}/g, ' ')
    .slice(0, 200);
}

/**
 * Calculate reading time based on word count
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 400): number {
  const wordCount = content.split(/\s+/).filter((word) => word.length > 0).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Auto-categorize newsletter based on content
 */
export function categorizeNewsletter(content: string, subject: string): string | undefined {
  const text = (subject + ' ' + content).toLowerCase();

  const categories = {
    TECH: [
      'technology',
      'software',
      'programming',
      'developer',
      'code',
      'api',
      'framework',
      'javascript',
      'python',
      'react',
      'ai',
      'machine learning',
      'crypto',
      'blockchain',
    ],
    BUSINESS: [
      'business',
      'startup',
      'entrepreneur',
      'investor',
      'funding',
      'venture',
      'market',
      'stock',
      'finance',
      'economy',
      'revenue',
      'profit',
    ],
    NEWS: [
      'breaking',
      'news',
      'update',
      'report',
      'headline',
      'today',
      'latest',
      'current',
      'happening',
    ],
    DESIGN: [
      'design',
      'ux',
      'ui',
      'user experience',
      'interface',
      'figma',
      'sketch',
      'typography',
      'color',
      'layout',
    ],
    MARKETING: [
      'marketing',
      'seo',
      'growth',
      'conversion',
      'campaign',
      'advertising',
      'brand',
      'social media',
      'content marketing',
    ],
    PRODUCTIVITY: [
      'productivity',
      'tips',
      'workflow',
      'efficiency',
      'time management',
      'tools',
      'apps',
      'organization',
    ],
    SCIENCE: [
      'science',
      'research',
      'study',
      'experiment',
      'discovery',
      'biology',
      'physics',
      'chemistry',
      'space',
      'nasa',
    ],
    HEALTH: [
      'health',
      'fitness',
      'wellness',
      'medical',
      'doctor',
      'patient',
      'treatment',
      'disease',
      'mental health',
      'nutrition',
    ],
  };

  const scores: Record<string, number> = {};

  for (const [category, keywords] of Object.entries(categories)) {
    scores[category] = 0;
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        scores[category]++;
      }
    }
  }

  // Find category with highest score
  let maxScore = 0;
  let bestCategory: string | undefined;

  for (const [category, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestCategory = category;
    }
  }

  return maxScore > 0 ? bestCategory : undefined;
}

/**
 * Extract tags from newsletter content
 */
export function extractTags(content: string, subject: string): string[] {
  const text = (subject + ' ' + content).toLowerCase();
  const tags = new Set<string>();

  // Common technology tags
  const techTags = [
    'javascript',
    'typescript',
    'react',
    'vue',
    'angular',
    'nodejs',
    'python',
    'rust',
    'go',
    'java',
    'kubernetes',
    'docker',
    'aws',
    'azure',
    'gcp',
  ];

  for (const tag of techTags) {
    if (text.includes(tag)) {
      tags.add(tag);
    }
  }

  // Extract hashtags if present
  const hashtagMatches = text.match(/#[a-z0-9]+/gi);
  if (hashtagMatches) {
    hashtagMatches.forEach((tag) => {
      tags.add(tag.substring(1).toLowerCase());
    });
  }

  return Array.from(tags).slice(0, 10); // Limit to 10 tags
}

/**
 * Parse email and extract all relevant information
 */
export async function parseEmail(
  html: string,
  text: string | undefined,
  subject: string,
  ai: GoogleGenAI,
): Promise<ParsedEmail> {
  const content = html ? extractTextFromHtml(html) : text || '';
  const newsletterHash = crypto.createHash('sha256').update(content).digest('hex');
  const info = await getNewsletterInfoWithAi(ai, html, newsletterHash);

  return {
    extractedContent: content,
    excerpt: generateExcerpt(content),
    thumbnailUrl: info?.thumbnailUrl || extractThumbnailUrl(html),
    originalUrl: info?.originalUrl || extractOriginalUrl(html),
    readTimeMinutes: calculateReadingTime(content),
    tags: info?.tags || extractTags(content, subject),
    category: info?.category || categorizeNewsletter(content, subject),
    newsletterHash,
    letterSource: {
      description: info?.source?.description || '',
      logoUrl: info?.source?.logoUrl || '',
      category: info?.source?.category || '',
      website: info?.source?.website || '',
      region: info?.source?.region || 'ROW',
    },
  };
}
