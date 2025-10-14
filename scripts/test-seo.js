#!/usr/bin/env node

/**
 * SEO Testing Script
 * 개발 서버에서 SEO 개선 사항을 테스트합니다
 */

const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

// 색상 코드
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

// 테스트 결과 출력
function logResult(test, passed, message) {
  const status = passed ? `${colors.green}✅` : `${colors.red}❌`;
  const color = passed ? colors.green : colors.red;
  console.log(`${status} ${test}${colors.reset}`);
  if (message) {
    console.log(`  ${color}→ ${message}${colors.reset}`);
  }
}

// 헤더 출력
function logSection(title) {
  console.log(`\n${colors.blue}━━━ ${title} ━━━${colors.reset}`);
}

// 메타 태그 검사
async function checkMetaTags(url, pageName) {
  logSection(`Testing ${pageName} Meta Tags`);

  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // 필수 메타 태그
    const title = document.querySelector('title');
    logResult('Title Tag', title && title.textContent.length > 0, title?.textContent);

    const description = document.querySelector('meta[name="description"]');
    logResult('Description', description && description.content.length > 0, description?.content);

    const viewport = document.querySelector('meta[name="viewport"]');
    logResult(
      'Viewport',
      viewport && viewport.content.includes('width=device-width'),
      viewport?.content,
    );

    const charset = document.querySelector('meta[charset]');
    logResult(
      'Charset',
      charset && charset.getAttribute('charset') === 'utf-8',
      charset?.getAttribute('charset'),
    );

    // Open Graph 태그
    const ogTitle = document.querySelector('meta[property="og:title"]');
    logResult('OG Title', ogTitle && ogTitle.content.length > 0, ogTitle?.content);

    const ogDescription = document.querySelector('meta[property="og:description"]');
    logResult(
      'OG Description',
      ogDescription && ogDescription.content.length > 0,
      ogDescription?.content,
    );

    const ogImage = document.querySelector('meta[property="og:image"]');
    logResult('OG Image', ogImage && ogImage.content.length > 0, ogImage?.content);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    logResult('OG URL', ogUrl && ogUrl.content.length > 0, ogUrl?.content);

    // Twitter Card 태그
    const twitterCard = document.querySelector('meta[name="twitter:card"]');
    logResult('Twitter Card', twitterCard && twitterCard.content.length > 0, twitterCard?.content);

    // Canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    logResult('Canonical URL', canonical && canonical.href.length > 0, canonical?.href);

    // Structured Data
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
    logResult(
      'JSON-LD Structured Data',
      jsonLdScripts.length > 0,
      `Found ${jsonLdScripts.length} schema(s)`,
    );

    if (jsonLdScripts.length > 0) {
      jsonLdScripts.forEach((script, index) => {
        try {
          const data = JSON.parse(script.textContent);
          console.log(`  ${colors.yellow}→ Schema ${index + 1}: ${data['@type']}${colors.reset}`);
        } catch (e) {
          console.log(`  ${colors.red}→ Schema ${index + 1}: Invalid JSON${colors.reset}`);
        }
      });
    }
  } catch (error) {
    console.error(`${colors.red}Error testing ${pageName}: ${error.message}${colors.reset}`);
  }
}

// robots.txt 검사
async function checkRobotsTxt() {
  logSection('Testing robots.txt');

  try {
    const response = await fetch(`${BASE_URL}/robots.txt`);
    const text = await response.text();

    logResult('robots.txt exists', response.status === 200, `Status: ${response.status}`);

    if (response.status === 200) {
      logResult('User-agent directive', text.includes('User-agent:'), 'Found User-agent rules');
      logResult('Sitemap directive', text.includes('Sitemap:'), text.match(/Sitemap: .*/)?.[0]);
      logResult('Allow directive', text.includes('Allow:'), 'Found Allow rules');
      logResult('Disallow directive', text.includes('Disallow:'), 'Found Disallow rules');
    }
  } catch (error) {
    console.error(`${colors.red}Error testing robots.txt: ${error.message}${colors.reset}`);
  }
}

// sitemap.xml 검사
async function checkSitemapXml() {
  logSection('Testing sitemap.xml');

  try {
    const response = await fetch(`${BASE_URL}/sitemap.xml`);
    const text = await response.text();

    logResult('sitemap.xml exists', response.status === 200, `Status: ${response.status}`);

    if (response.status === 200) {
      const dom = new JSDOM(text, { contentType: 'text/xml' });
      const document = dom.window.document;

      const urls = document.querySelectorAll('url');
      logResult('URL entries', urls.length > 0, `Found ${urls.length} URLs`);

      const hasLoc = document.querySelector('loc');
      logResult('Location tags', hasLoc !== null, 'Found <loc> tags');

      const hasLastmod = document.querySelector('lastmod');
      logResult('Lastmod tags', hasLastmod !== null, 'Found <lastmod> tags');

      const hasChangefreq = document.querySelector('changefreq');
      logResult('Changefreq tags', hasChangefreq !== null, 'Found <changefreq> tags');

      const hasPriority = document.querySelector('priority');
      logResult('Priority tags', hasPriority !== null, 'Found <priority> tags');
    }
  } catch (error) {
    console.error(`${colors.red}Error testing sitemap.xml: ${error.message}${colors.reset}`);
  }
}

// 메인 테스트 실행
async function runTests() {
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}   SEO Testing for Lettertree${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`Testing URL: ${colors.yellow}${BASE_URL}${colors.reset}\n`);

  // robots.txt 및 sitemap 검사
  await checkRobotsTxt();
  await checkSitemapXml();

  // 주요 페이지 메타 태그 검사
  await checkMetaTags(`${BASE_URL}`, 'Homepage');

  // Note: 인증이 필요한 페이지는 로그인 후 테스트 필요
  // await checkMetaTags(`${BASE_URL}/discover`, 'Discover Page');
  // await checkMetaTags(`${BASE_URL}/letters`, 'Letters Page');

  console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.green}   SEO Testing Complete!${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  console.log(`${colors.yellow}💡 Note: Some pages require authentication.${colors.reset}`);
  console.log(`${colors.yellow}   Test them manually after logging in.${colors.reset}\n`);
}

// 스크립트 실행
runTests().catch(console.error);
