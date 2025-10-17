export const site = {
  name: 'Lettertree',
  description: '모든 뉴스레터를 한 곳에서, 더 깔끔하게.',
  url: import.meta.env.VITE_PUBLIC_APP_URL || 'http://localhost:5173',
  domain: 'lettertr.ee',
  ogImage: `${import.meta.env.VITE_PUBLIC_APP_URL || 'http://localhost:5173'}/og.jpg`,
  favicon: '/favicon.ico',
  // favicon: `${site_url}/favicon.svg`,
  googleFavicon: `${import.meta.env.VITE_PUBLIC_APP_URL || 'http://localhost:5173'}/favicon.png`,
  lightlogo: '/bluelogoinlightmode.svg', //'blacklogo.svg', //'/bluelogoinlightmode.svg',
  darkLogo: '/bluelogoindarkmode.svg', //'/bluelogoindarkmode.svg',
  appleTouchIcon: `${import.meta.env.VITE_PUBLIC_APP_URL || 'http://localhost:5173'}/apple-touch-icon.png`,
  mailSupport: 'support@lettertr.ee', // Support email address
  mailFrom: import.meta.env.MAIL_FROM || 'noreply@lettertr.ee', // Transactional email address
  links: {
    twitter: 'https://twitter.com/lettertree',
    github: 'https://github.com/lettertree',
    linkedin: 'https://www.linkedin.com/company/lettertree/',
  },
} as const;
