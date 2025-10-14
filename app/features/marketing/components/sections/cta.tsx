// import { Badge } from '@/common/components/ui/badge';
// import { WaitlistForm } from '../waitlist-form';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
// import { AuroraText } from '@/common/components/ui/aurora-text';
import { Button } from '@/common/components/ui/button';

export const CTASection = () => {
  return (
    // <section id="cta" className="container mx-auto px-4 py-24 sm:py-32">
    //   <h2 className="mb-2 text-center text-lg text-primary tracking-wider">CTA</h2>
    //   <h2 className="mb-4 text-center font-bold text-3xl md:text-4xl">Call to Action</h2>
    // </section>
    <section id="cta" className="container mx-auto flex w-full justify-center px-4">
      <div className="grid place-items-center gap-8 py-20">
        <div className="space-y-8 text-center">
          <div className="flex flex-col items-center space-y-4 md:flex-row md:justify-center md:space-x-4 md:space-y-0">
            <Button asChild size="lg" className="group/arrow rounded-full">
              <Link to="/auth/sign-up">
                지금 바로 시작하기
                <ArrowRight className="ml-2 size-5 transition-transform group-hover/arrow:translate-x-1" />
              </Link>
            </Button>
          </div>
          {/* <Badge variant="outline" className="rounded-2xl py-2 text-sm">
            <span className="mr-2 text-primary">
              <Badge>Coming Soon</Badge>
            </span>
            <span> 9월 중 오픈 예정 </span>
          </Badge> */}

          {/* <div className="flex flex-col items-center space-y-4 md:flex-row md:justify-center md:space-x-4 md:space-y-0"> */}
          {/* <h2 className="flex items-center justify-center gap-4">서비스 오픈 알림 받기</h2> */}

          {/* <h1>
              <span className="bg-gradient-to-r from-primary to-[#93c5fd] bg-clip-text px-2 text-transparent">
                한 곳에서,
              </span>
              더 깔끔하게.
            </h1> */}
          {/* </div> */}

          {/* <p className="mx-auto max-w-screen-md text-muted-foreground text-xl">
            뉴스레터는 단순한 메일이 아니라,
            <br />
            누군가의 인사이트가 담긴 이야기입니다.
          </p> */}

          {/* <div className="mx-auto w-full max-w-md space-y-4">
            <WaitlistForm waitlistCount={waitlistCount} title="" />
          </div> */}
        </div>
      </div>
    </section>
  );
};
