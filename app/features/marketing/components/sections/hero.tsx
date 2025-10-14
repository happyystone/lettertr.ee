import { Link } from 'react-router';
import { Theme, useTheme } from 'remix-themes';
import { ArrowRight, Lock } from 'lucide-react';

import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import { site } from '@/config/site';
import type { AuthUser } from '@/lib/auth/auth-server';

export const HeroSection = ({ user }: { user: AuthUser | null }) => {
  const [theme] = useTheme();

  return (
    <section className="container mx-auto flex w-full justify-center px-4">
      <div className="grid place-items-center gap-8 py-20">
        <div className="space-y-8 text-center">
          <Badge variant="outline" className="rounded-2xl py-2 text-sm">
            <span className="mr-2 text-primary">
              <Badge> Beta Open </Badge>
            </span>
            <span> 베타 오픈 🎉 </span>
          </Badge>

          <div className="mx-auto max-w-screen-md text-center font-bold text-4xl md:text-6xl">
            <h1 className="mb-2">모든 뉴스레터를</h1>
            <h1>
              <span className="bg-gradient-to-r from-primary to-[#93c5fd] bg-clip-text px-2 text-transparent">
                {/* <AuroraText colors={['#1d4ed8', '#155DFC', '#2B7FFF', '#60a5fa']}> */}한 곳에서,
                {/* </AuroraText> */}
              </span>
              더 깔끔하게.
            </h1>
          </div>

          <p className="mx-auto max-w-screen-md text-muted-foreground text-xl">
            쌓이기만 하는 메일함 📨 이제는 나만의 공간에
            <br />
            모아서 깔끔하게 읽고, 새로운 뉴스레터까지 발견해보세요.
          </p>

          {/* 이전 CTA */}
          <div className="flex flex-col items-center space-y-4 md:flex-row md:justify-center md:space-x-4 md:space-y-0">
            <Button asChild size="lg" className="group/arrow rounded-full">
              <Link to={user ? '/letters' : '/auth/sign-up'}>
                무료로 시작하기
                <ArrowRight className="ml-2 size-5 transition-transform group-hover/arrow:translate-x-1" />
              </Link>
            </Button>

            {/* <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link to="/discover">
                <BookOpen className="mr-2 size-5" />
                뉴스레터 둘러보기
              </Link>
            </Button> */}
          </div>
          {/* Waitlist Form Section */}
          {/* <div className="mx-auto w-full max-w-md space-y-4">
            <WaitlistForm waitlistCount={waitlistCount} />
          </div> */}

          {/* Secondary CTA */}
          {/* <div className="flex justify-center pt-4">
            <Button asChild variant="ghost" size="lg" className="rounded-full">
              <Link to="/discover">
                <BookOpen className="mr-2 size-5" />
                미리 둘러보기
              </Link>
            </Button>
          </div> */}

          {/* Key Features */}
          {/* <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col items-center space-y-2">
              <div className="rounded-full bg-primary/10 p-3">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">전용 이메일 주소</h3>
              <p className="text-sm text-muted-foreground">
                lettertree 전용 이메일로
                <br />
                개인 메일과 완벽 분리
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="rounded-full bg-primary/10 p-3">
                <Inbox className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">스마트한 정리</h3>
              <p className="text-sm text-muted-foreground">
                주제별 폴더와 태그로
                <br />
                체계적인 콘텐츠 관리
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="rounded-full bg-primary/10 p-3">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">뉴스레터 탐색</h3>
              <p className="text-sm text-muted-foreground">
                관심사에 맞는 새로운
                <br />
                뉴스레터 발견 및 추천
              </p>
            </div>
          </div> */}
        </div>

        <div className="group relative mt-14">
          <div className="lg:-top-8 -translate-x-1/2 absolute top-2 left-1/2 mx-auto h-24 w-[90%] transform rounded-full bg-primary/50 blur-3xl lg:h-80" />
          <div className="relative mx-auto w-full max-w-5xl">
            <div className="flex h-10 items-center rounded-t-lg bg-sidebar px-4">
              <div className="flex space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-1/3">
                <div className="flex h-6 items-center justify-center rounded-md bg-secondary/50 px-3">
                  <Lock className="mr-1.5 size-3 text-muted-foreground" />
                  <div className="text-muted-foreground text-xs">{site.url}</div>
                </div>
              </div>
            </div>
          </div>
          <img
            width={1200}
            height={1200}
            className="relative mx-auto max-w-5xl flex w-full items-center rounded-b-lg"
            src={theme === Theme.DARK ? '/demo.png' : '/demo-light.png'}
            alt="letters"
          />
          <div className="absolute bottom-0 left-0 h-20 w-full rounded-lg bg-gradient-to-b from-background/0 via-background/50 to-background md:h-28" />
        </div>
      </div>
    </section>
  );
};
