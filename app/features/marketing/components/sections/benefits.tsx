import type { icons } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Icon } from '@/common/components/ui/icon';

interface BenefitsProps {
  icon: string;
  title: string;
  description: string;
}

const benefitList: BenefitsProps[] = [
  {
    icon: 'Brain',
    title: '정보 과부하 해결',
    description:
      '중요한 개인 메일과 뉴스레터가 섞여 놓치는 일이 없습니다. 전용 공간에서 원하는 콘텐츠만 집중해서 읽으세요.',
  },
  {
    icon: 'Target',
    title: '맞춤형 콘텐츠 발견',
    description:
      '관심사 기반 추천 시스템으로 새로운 뉴스레터를 발견하고, 나에게 맞는 양질의 콘텐츠를 쉽게 찾아보세요.',
  },
  {
    icon: 'Timer',
    title: '시간 절약',
    description:
      '자동 분류와 스마트 정리 기능으로 뉴스레터 관리 시간을 대폭 줄이고, 읽기에만 집중할 수 있습니다.',
  },
  {
    icon: 'TrendingUp',
    title: '인사이트 축적',
    description:
      '하이라이트와 노트 기능으로 중요한 정보를 체계적으로 축적하고, 나만의 지식 베이스를 구축하세요.',
  },
];

export const BenefitsSection = () => {
  return (
    <section id="benefits" className="container mx-auto px-4 py-24 sm:py-32">
      <div className="grid place-items-center lg:grid-cols-2 lg:gap-24">
        <div>
          <h2 className="mb-2 text-lg text-primary tracking-wider">Benefits</h2>
          <h2 className="mb-4 font-bold text-3xl md:text-4xl">왜 Lettertree인가요?</h2>
          <p className="mb-8 text-muted-foreground text-xl">
            이메일 수신함에서 벗어나 내가 원하는 뉴스레터들을 한 곳에서 관리하고, 온전히 콘텐츠와
            인사이트에 집중하세요.
          </p>
        </div>

        <div className="grid w-full gap-4 lg:grid-cols-2">
          {benefitList.map(({ icon, title, description }, index) => (
            <Card key={title} className="group/number transition-all delay-75 hover:bg-sidebar">
              <CardHeader>
                <div className="flex justify-between">
                  <Icon
                    name={icon as keyof typeof icons}
                    size={32}
                    color="var(--primary)"
                    className="mb-6 text-primary"
                  />
                  <span className="font-medium text-5xl text-muted-foreground/15 transition-all delay-75 group-hover/number:text-muted-foreground/30">
                    0{index + 1}
                  </span>
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground">{description}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
