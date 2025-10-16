import { env } from 'cloudflare:workers';

const site_url = env.VITE_PUBLIC_APP_URL || 'http://localhost:5173';

export const site = {
  name: 'Lettertree',
  description: '모든 뉴스레터를 한 곳에서, 더 깔끔하게.',
  url: site_url,
  domain: 'lettertr.ee',
  ogImage: `${site_url}/og.jpg`,
  favicon: '/favicon.ico',
  // favicon: `${site_url}/favicon.svg`,
  googleFavicon: `${site_url}/favicon.png`,
  lightlogo: '/bluelogoinlightmode.svg', //'blacklogo.svg', //'/bluelogoinlightmode.svg',
  darkLogo: '/bluelogoindarkmode.svg', //'/bluelogoindarkmode.svg',
  appleTouchIcon: `${site_url}/apple-touch-icon.png`,
  mailSupport: 'support@lettertr.ee', // Support email address
  mailFrom: import.meta.env.MAIL_FROM || 'noreply@lettertr.ee', // Transactional email address
  links: {
    twitter: 'https://twitter.com/lettertree',
    github: 'https://github.com/lettertree',
    linkedin: 'https://www.linkedin.com/company/lettertree/',
  },
} as const;
