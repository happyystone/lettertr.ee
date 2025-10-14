import type { MetaDescriptor } from 'react-router';

export interface SeoConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  locale?: string;
  siteName?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  twitterCreator?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export const DEFAULT_SEO: SeoConfig = {
  siteName: 'Lettertree',
  locale: 'ko_KR',
  type: 'website',
  twitterCard: 'summary_large_image',
  twitterSite: '@lettertree',
  description: '수백 개의 뉴스레터를 한 곳에서 발견하고, 구독하고, 읽어보세요.',
  keywords: ['뉴스레터', '뉴스레터 구독', '뉴스레터 추천', '뉴스레터 큐레이션', 'newsletter'],
};

export function generateMeta(config: SeoConfig): MetaDescriptor[] {
  const merged = { ...DEFAULT_SEO, ...config };
  const meta: MetaDescriptor[] = [];

  // Title
  const fullTitle = merged.title
    ? `${merged.title} | ${merged.siteName}`
    : `${merged.siteName} - 당신의 뉴스레터 정원`;

  meta.push({ title: fullTitle });

  // Basic meta tags
  if (merged.description) {
    meta.push({ name: 'description', content: merged.description });
  }

  if (merged.keywords && merged.keywords.length > 0) {
    meta.push({ name: 'keywords', content: merged.keywords.join(', ') });
  }

  if (merged.author) {
    meta.push({ name: 'author', content: merged.author });
  }

  // Canonical URL
  if (merged.canonical) {
    meta.push({ tagName: 'link', rel: 'canonical', href: merged.canonical });
  }

  // Robots meta
  const robotsContent = [];
  if (merged.noindex) robotsContent.push('noindex');
  if (merged.nofollow) robotsContent.push('nofollow');
  if (robotsContent.length > 0) {
    meta.push({ name: 'robots', content: robotsContent.join(', ') });
  } else {
    meta.push({ name: 'robots', content: 'index, follow' });
  }

  // Open Graph tags
  meta.push(
    { property: 'og:title', content: fullTitle },
    { property: 'og:type', content: merged.type || 'website' },
    { property: 'og:locale', content: merged.locale || 'ko_KR' },
    { property: 'og:site_name', content: merged.siteName || 'Lettertree' },
  );

  if (merged.description) {
    meta.push({ property: 'og:description', content: merged.description });
  }

  if (merged.url) {
    meta.push({ property: 'og:url', content: merged.url });
  }

  if (merged.image) {
    meta.push(
      { property: 'og:image', content: merged.image },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: fullTitle },
    );
  }

  // Article specific OG tags
  if (merged.type === 'article') {
    if (merged.author) {
      meta.push({ property: 'article:author', content: merged.author });
    }
    if (merged.publishedTime) {
      meta.push({ property: 'article:published_time', content: merged.publishedTime });
    }
    if (merged.modifiedTime) {
      meta.push({ property: 'article:modified_time', content: merged.modifiedTime });
    }
    if (merged.section) {
      meta.push({ property: 'article:section', content: merged.section });
    }
    if (merged.tags && merged.tags.length > 0) {
      merged.tags.forEach((tag) => {
        meta.push({ property: 'article:tag', content: tag });
      });
    }
  }

  // Twitter Card tags
  meta.push(
    { name: 'twitter:card', content: merged.twitterCard || 'summary_large_image' },
    { name: 'twitter:title', content: fullTitle },
  );

  if (merged.description) {
    meta.push({ name: 'twitter:description', content: merged.description });
  }

  if (merged.image) {
    meta.push({ name: 'twitter:image', content: merged.image });
  }

  if (merged.twitterSite) {
    meta.push({ name: 'twitter:site', content: merged.twitterSite });
  }

  if (merged.twitterCreator) {
    meta.push({ name: 'twitter:creator', content: merged.twitterCreator });
  }

  // Additional SEO meta tags
  meta.push(
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { httpEquiv: 'X-UA-Compatible', content: 'IE=edge' },
    { name: 'format-detection', content: 'telephone=no' },
    { name: 'apple-mobile-web-app-title', content: 'Lettertree' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
  );

  return meta;
}

// Generate structured data (JSON-LD)
export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

export function generateWebSiteSchema(config: {
  name: string;
  url: string;
  description?: string;
  searchUrl?: string;
}): StructuredData {
  const schema: StructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.name,
    url: config.url,
  };

  if (config.description) {
    schema.description = config.description;
  }

  if (config.searchUrl) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${config.searchUrl}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    };
  }

  return schema;
}

export function generateOrganizationSchema(config: {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
}): StructuredData {
  const schema: StructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.name,
    url: config.url,
  };

  if (config.logo) {
    schema.logo = config.logo;
  }

  if (config.description) {
    schema.description = config.description;
  }

  if (config.sameAs && config.sameAs.length > 0) {
    schema.sameAs = config.sameAs;
  }

  return schema;
}

export function generateArticleSchema(config: {
  headline: string;
  description?: string;
  image?: string | string[];
  datePublished?: string;
  dateModified?: string;
  author?: {
    name: string;
    url?: string;
  };
  publisher?: {
    name: string;
    logo?: string;
  };
  url?: string;
  keywords?: string[];
}): StructuredData {
  const schema: StructuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: config.headline,
    datePublished: config.datePublished || new Date().toISOString(),
    dateModified: config.dateModified || config.datePublished || new Date().toISOString(),
  };

  if (config.description) {
    schema.description = config.description;
  }

  if (config.image) {
    schema.image = config.image;
  }

  if (config.author) {
    schema.author = {
      '@type': 'Person',
      name: config.author.name,
    };
    if (config.author.url) {
      schema.author.url = config.author.url;
    }
  }

  if (config.publisher) {
    schema.publisher = {
      '@type': 'Organization',
      name: config.publisher.name,
    };
    if (config.publisher.logo) {
      schema.publisher.logo = {
        '@type': 'ImageObject',
        url: config.publisher.logo,
      };
    }
  }

  if (config.url) {
    schema.mainEntityOfPage = {
      '@type': 'WebPage',
      '@id': config.url,
    };
  }

  if (config.keywords && config.keywords.length > 0) {
    schema.keywords = config.keywords.join(', ');
  }

  return schema;
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Helper to inject structured data into HTML
export function generateStructuredDataScript(data: StructuredData | StructuredData[]): string {
  const dataArray = Array.isArray(data) ? data : [data];
  return dataArray
    .map((item) => `<script type="application/ld+json">${JSON.stringify(item, null, 2)}</script>`)
    .join('\n');
}
