import { Link } from 'react-router';
import { Mail } from 'lucide-react';
import { Theme, useTheme } from 'remix-themes';

import XIcon from '@/common/components/icons/x-icon';
import GithubIcon from '@/common/components/icons/github-icon';
import LinkedInIcon from '@/common/components/icons/linkedin-icon';
import { Button } from '@/common/components/ui/button';
import { Separator } from '@/common/components/ui/separator';
import { site } from '@/config/site';

interface FooterLinkProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
  external?: boolean;
}

interface FooterSectionProps {
  key: string;
  title: string;
  links: FooterLinkProps[];
}

const footerSections: FooterSectionProps[] = [
  {
    key: '1',
    title: '',
    links: [],
  },
  {
    key: '2',
    title: '',
    links: [],
  },
  {
    key: '3',
    title: '제품',
    links: [
      { href: '#features', label: '기능' },
      { href: '#intro', label: '서비스 소개' },
      { href: '#faq', label: 'FAQ' },
      // { href: '#pricing', label: 'Pricing' },
      // { href: '#integrations', label: 'Integrations' },
      // { href: '#api', label: 'API' },
    ],
  },
  // {
  //   key: '4',
  //   title: '회사',
  //   links: [
  //     { href: '#about', label: 'About Us' },
  //     { href: '#careers', label: 'Careers' },
  //     { href: '#blog', label: 'Blog' },
  //   ],
  // },
  // {
  //   title: '리소스',
  //   links: [
  //     { href: '#documentation', label: 'Documentation' },
  //     { href: '#help', label: 'Help Center' },
  //     { href: '#status', label: 'Status' },
  //   ],
  // },
  {
    key: '5',
    title: '회사',
    links: [
      { href: '/privacy', label: '개인정보 처리방침' },
      { href: '/terms', label: '이용약관' },
      // { href: '#cookies', label: '쿠키 정책' },
    ],
  },
];

const socialLinks: FooterLinkProps[] = [
  // {
  //   href: site.links.github,
  //   label: 'GitHub',
  //   icon: <GithubIcon className="size-5 fill-foreground" />,
  //   external: true,
  // },
  // {
  //   href: site.links.twitter,
  //   label: 'Twitter',
  //   icon: <XIcon className="size-5 fill-foreground" />,
  //   external: true,
  // },
  // {
  //   href: 'https://linkedin.com',
  //   label: 'LinkedIn',
  //   icon: <LinkedInIcon className="size-5 fill-foreground" />,
  //   external: true,
  // },
  {
    href: `mailto:${site.mailSupport}`,
    label: 'Email',
    icon: <Mail className="size-5" />,
  },
];

export const FooterSection = () => {
  const [theme] = useTheme();
  const logo = theme === Theme.DARK ? site.darkLogo : site.lightlogo;

  return (
    <footer id="footer">
      <div className="mx-auto max-w-7xl pt-16 pb-0 lg:pb-16">
        <div className="relative overflow-hidden rounded-xl border border-border bg-card/50 shadow-xl backdrop-blur-sm">
          <div className="relative p-8 lg:p-12">
            {/* Main Footer Content */}
            <div className="space-y-8 lg:space-y-0">
              {/* Desktop Layout: Side by side */}
              <div className="hidden gap-12 lg:grid lg:grid-cols-6">
                {/* Brand Section */}
                <div className="col-span-2">
                  <Link to="/" className="group mb-4 flex gap-2 font-bold">
                    <div className="relative">
                      <img src={logo} alt={site.name} width={30} height={30} />
                    </div>
                    <h3 className="font-bold text-2xl">{site.name}</h3>
                  </Link>
                  <p className="mb-6 text-muted-foreground text-sm leading-relaxed">
                    {site.description}
                  </p>
                  <Link
                    to={`mailto:${site.mailSupport}`}
                    aria-label="Email"
                    className="flex w-fit items-center gap-2 text-muted-foreground text-sm underline-offset-4 transition-colors duration-200 hover:text-foreground hover:underline"
                  >
                    <Mail className="size-5" />
                    {site.mailSupport}
                  </Link>

                  {/* <p className="mb-6 text-muted-foreground text-sm leading-relaxed"></p> */}
                  {/* Social Links */}
                  {/* <div className="flex gap-2">
                    {socialLinks.map((social) => (
                      <Button
                        key={social.label}
                        asChild
                        variant="ghost"
                        size="sm"
                        className="p-2 hover:bg-accent/50"
                      >
                        <Link
                          to={social.href}
                          target={social.external ? '_blank' : undefined}
                          rel={social.external ? 'noopener noreferrer' : undefined}
                          aria-label={social.label}
                        >
                          {social.icon}
                        </Link>
                      </Button>
                    ))}
                  </div> */}
                </div>

                {/* Footer Links Desktop */}
                {footerSections.map((section) => (
                  <div key={section.key} className="flex flex-col">
                    <h4 className="mb-4 font-semibold text-foreground text-sm uppercase tracking-wide">
                      {section.title}
                    </h4>
                    <ul className="space-y-3">
                      {section.links.map((link) => (
                        <li key={link.label}>
                          <Link
                            to={link.href}
                            className="text-muted-foreground text-sm underline-offset-4 transition-colors duration-200 hover:text-foreground hover:underline"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Mobile/Tablet Layout: Stacked */}
              <div className="lg:hidden md:flex md:flex-row md:justify-between md:items-center">
                {/* Brand Section Mobile */}
                <div className="mb-8">
                  <Link to="/" className="group mb-4 flex gap-2 font-bold">
                    <div className="relative">
                      <img src={logo} alt={site.name} width={30} height={30} />
                    </div>
                    <h3 className="font-bold text-2xl">{site.name}</h3>
                  </Link>
                  <p className="mb-6 max-w-sm text-muted-foreground text-sm leading-relaxed">
                    {site.description}
                  </p>
                  <Link
                    to={`mailto:${site.mailSupport}`}
                    aria-label="Email"
                    className="flex w-fit items-center gap-2 text-muted-foreground text-sm underline-offset-4 transition-colors duration-200 hover:text-foreground hover:underline"
                  >
                    <Mail className="size-5" />
                    {site.mailSupport}
                  </Link>
                  {/* Social Links Mobile */}
                  {/* <div className="flex gap-2">
                    {socialLinks.map((social) => (
                      <Button
                        key={social.label}
                        asChild
                        variant="ghost"
                        size="sm"
                        className="p-2 hover:bg-accent/50"
                      >
                        <Link
                          to={social.href}
                          target={social.external ? '_blank' : undefined}
                          rel={social.external ? 'noopener noreferrer' : undefined}
                          aria-label={social.label}
                        >
                          {social.icon}
                        </Link>
                      </Button>
                    ))}
                  </div> */}
                </div>

                {/* Footer Links Mobile - Grid */}
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                  {footerSections.map((section) => (
                    <div key={section.key} className="flex flex-col">
                      <h4 className="mb-4 font-semibold text-foreground text-sm uppercase tracking-wide">
                        {section.title}
                      </h4>
                      <ul className="space-y-3">
                        {section.links.map((link) => (
                          <li key={link.label}>
                            <Link
                              to={link.href}
                              className="text-muted-foreground text-sm underline-offset-4 transition-colors duration-200 hover:text-foreground hover:underline"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Separator className="my-8 bg-border/50" />

            {/* Bottom Section */}
            <div className="flex flex-col justify-between gap-4 lg:flex-row">
              <div className="flex flex-col items-center gap-4 text-muted-foreground text-sm sm:flex-row">
                <p>&copy; 2025 {site.name}. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
