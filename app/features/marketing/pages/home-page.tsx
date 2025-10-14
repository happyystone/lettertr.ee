import { BenefitsSection } from '@/features/marketing/components/sections/benefits';
import { CommunitySection } from '@/features/marketing/components/sections/community';
import { ContactSection } from '@/features/marketing/components/sections/contact';
import { FAQSection } from '@/features/marketing/components/sections/faq';
import { FeaturesSection } from '@/features/marketing/components/sections/features';
import { HeroSection } from '@/features/marketing/components/sections/hero';
import { PricingSection } from '@/features/marketing/components/sections/pricing';
import { ServicesSection } from '@/features/marketing/components/sections/services';
import { TeamSection } from '@/features/marketing/components/sections/team';
import { TestimonialSection } from '@/features/marketing/components/sections/testimonial';
import { Trusted } from '@/features/marketing/components/sections/trusted';
import { ValueSection } from '@/features/marketing/components/sections/value';
import { IntroSection } from '@/features/marketing/components/sections/intro';
import { CTASection } from '@/features/marketing/components/sections/cta';
import { site } from '@/config/site';

import type { Route } from '../routes/+types/index';

export const meta: Route.MetaFunction = () => [
  { title: `${site.name} - 뉴스레터 어그리게이터` },
  { name: 'description', content: site.description },
  // Open Graph
  { property: 'og:type', content: 'website' },
  { property: 'og:url', content: site.url },
  { property: 'og:title', content: `${site.name} - 뉴스레터 어그리게이터` },
  { property: 'og:description', content: site.description },
  { property: 'og:image', content: site.ogImage },
  { property: 'og:image:width', content: '1200' },
  { property: 'og:image:height', content: '750' },
  { property: 'og:image:alt', content: site.name },
  // Twitter
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:site', content: site.url },
  { name: 'twitter:title', content: `${site.name} - 뉴스레터 어그리게이터` },
  { name: 'twitter:description', content: site.description },
  { name: 'twitter:image', content: site.ogImage },
  { name: 'twitter:image:alt', content: site.name },
];

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <HeroSection user={loaderData.user || null} />
      {/* <Trusted /> */}
      <ValueSection />
      <IntroSection />
      {/* <BenefitsSection /> */}
      {/* <FeaturesSection /> */}
      {/* <ServicesSection /> */}
      {/* <TestimonialSection /> */}
      {/* <TeamSection /> */}
      {/* <CommunitySection /> */}
      {/* <PricingSection /> */}
      {/* <ContactSection /> */}
      <FAQSection />
      {/* <CTASection /> */}
    </>
  );
}
