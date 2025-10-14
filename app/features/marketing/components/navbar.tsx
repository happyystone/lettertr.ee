import { UserButton } from '@daveyplate/better-auth-ui';
import { Menu, X } from 'lucide-react';
import { Theme, useTheme } from 'remix-themes';
import { Link } from 'react-router';
import React from 'react';

import { ModeToggle } from '@/common/components/mode-toggle';
import { Button } from '@/common/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/common/components/ui/navigation-menu';
import { Separator } from '@/common/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/common/components/ui/sheet';
import { site } from '@/config/site';
import type { AuthUser } from '@/lib/auth/auth-server';

interface RouteProps {
  href: string;
  label: string;
}

interface FeatureProps {
  title: string;
  description: string;
}

const routeList: RouteProps[] = [
  {
    href: '#features',
    label: '기능',
  },
  {
    href: '#intro',
    label: '서비스 소개',
  },
  {
    href: '#faq',
    label: 'FAQ',
  },
  // {
  //   href: '#testimonials',
  //   label: 'Testimonials',
  // },
  // {
  //   href: '#pricing',
  //   label: 'Pricing',
  // },
  // {
  //   href: '#contact',
  //   label: 'Contact',
  // },
];

const featureList: FeatureProps[] = [
  {
    title: 'Showcase Your Value',
    description: 'Highlight how your product solves user problems effectively.',
  },
  {
    title: 'Build Trust',
    description: 'Leverage social proof elements to establish trust and credibility.',
  },

  {
    title: 'Scale Fast',
    description: 'Built-in tools and integrations to help you scale your business.',
  },
];

export const Navbar = ({ user }: { user: AuthUser | null }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [theme] = useTheme();
  const logo = theme === Theme.DARK ? site.darkLogo : site.lightlogo;

  return (
    <div className="sticky top-2 z-50 mx-auto w-[98%] max-w-7xl px-4">
      <nav className="rounded-xl border border-border bg-card/50 shadow-black/2 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3 lg:px-6">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2 font-bold">
            <div className="relative">
              <img src={logo} alt={site.name} width={30} height={30} />
            </div>
            <h3 className="font-bold text-xl lg:text-2xl">{site.name}</h3>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-1 lg:flex">
            <NavigationMenu>
              <NavigationMenuList className="space-x-2">
                {/* <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-auto bg-transparent px-4 py-2 font-medium text-foreground hover:bg-accent/50">
                    Solutions
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[600px] grid-cols-2 gap-6 p-6">
                      <div className="relative overflow-hidden rounded-lg">
                        <img
                          src="/demo-img.png"
                          alt="Product Demo"
                          className="h-full w-full object-cover"
                          width={300}
                          height={200}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                      <ul className="flex flex-col gap-3">
                        {featureList.map(({ title, description }) => (
                          <li key={title}>
                            <NavigationMenuLink asChild>
                              <Link
                                to="#features"
                                className="group block rounded-lg p-3 text-sm transition-colors hover:bg-accent/50"
                              >
                                <p className="mb-1 font-semibold text-foreground leading-none group-hover:text-primary">
                                  {title}
                                </p>
                                <p className="line-clamp-2 text-muted-foreground text-xs">
                                  {description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem> */}

                {routeList.map(({ href, label }) => (
                  <NavigationMenuItem key={href}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={href}
                        className="rounded-lg px-4 py-2 font-medium text-sm transition-colors hover:bg-accent/50 hover:text-primary"
                      >
                        {label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 lg:flex">
            {/* <Button asChild variant="outline" size="icon" className="size-10 rounded-full">
              <Link to={site.links.github} target="_blank" aria-label="View on GitHub">
                <RiGithubFill className="size-5 fill-foreground" />
              </Link>
            </Button> */}
            {user ? (
              <Button asChild size="sm" variant="outline" className="ml-2">
                <Link to="/letters">뉴스레터 피드</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="sm" variant="outline" className="ml-2">
                  <Link to="/auth/sign-in?redirectTo=/discover">로그인</Link>
                </Button>
                <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                  <Link to="/auth/sign-up?redirectTo=/discover">시작하기</Link>
                </Button>
              </>
            )}
            <ModeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* <Button asChild variant="outline" size="icon" className="size-10 rounded-full">
              <Link to={site.links.github} target="_blank" aria-label="View on GitHub">
                <RiGithubFill className="size-5 fill-foreground" />
              </Link>
            </Button> */}
            <ModeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg hover:bg-accent/50"
                  aria-label="Toggle menu"
                >
                  {isOpen ? <X className="size-4" /> : <Menu className="size-4" />}
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-full max-w-sm border-border/50 border-l bg-background/95 backdrop-blur-md"
              >
                <div className="flex h-full flex-col">
                  <SheetHeader className="pb-4">
                    <SheetTitle>
                      <Link
                        to="/"
                        className="flex items-center gap-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <img src={logo} alt={site.name} width={32} height={32} />
                        <span className="font-bold text-lg">{site.name}</span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>

                  <Separator className="mb-4" />

                  {/* Mobile Navigation Links */}
                  <div className="flex flex-1 flex-col">
                    <div className="space-y-1">
                      {routeList.map(({ href, label }) => (
                        <Button
                          key={href}
                          onClick={() => setIsOpen(false)}
                          asChild
                          variant="ghost"
                          className="h-auto w-full justify-start px-3 py-2.5 font-medium hover:bg-accent/50"
                        >
                          <Link to={href}>{label}</Link>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Actions */}
                  <SheetFooter className="flex-row gap-2 border-border/50 border-t pt-4">
                    {user ? (
                      <>
                        <Button
                          asChild
                          variant="outline"
                          className="w-full"
                          onClick={() => setIsOpen(false)}
                        >
                          <Link to="/letters">뉴스레터 피드</Link>
                        </Button>
                        <div className="flex justify-end pt-2">
                          <UserButton size="icon" />
                        </div>
                      </>
                    ) : (
                      <>
                        <Button
                          asChild
                          variant="outline"
                          className="w-full"
                          onClick={() => setIsOpen(false)}
                        >
                          <Link to="/auth/sign-in?redirectTo=/discover">로그인</Link>
                        </Button>
                        <Button
                          asChild
                          className="w-full bg-primary hover:bg-primary/90"
                          onClick={() => setIsOpen(false)}
                        >
                          <Link to="/auth/sign-up?redirectTo=/discover">시작하기</Link>
                        </Button>
                      </>
                    )}
                  </SheetFooter>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </div>
  );
};
