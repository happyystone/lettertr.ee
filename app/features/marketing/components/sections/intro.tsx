import type { icons } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Icon } from '@/common/components/ui/icon';

interface DifferenceProps {
  icon: string;
  title: string;
  description: string;
}

const differenceList: DifferenceProps[] = [
  {
    icon: 'Folder',
    title: '뉴스레터 디렉토리',
    description: '국내 구독자들에게 꼭 필요한 다양한 뉴스레터 탐색 경험을 제공합니다.',
  },
  {
    icon: 'Target',
    title: '개인화 추천',
    description: '읽기 패턴을 기반으로 새로운 인사이트를 발견하게 해드릴게요.',
  },
  {
    icon: 'TrendingUp',
    title: '로드맵',
    description:
      'AI 요약, 번역, 팟캐스트 생성 등의 기능을 준비중이에요. 이를 통해 더 편리하게 뉴스레터를 읽을 수 있게 해드릴 예정입니다.',
  },
  {
    icon: 'Timer',
    title: '베타 사용자 우선 혜택',
    description:
      '지금 합류해주시면 피드백이 빠르게 반영되고, 베타 사용자에게만 제공되는 혜택을 드릴 예정입니다.',
  },
];

export const IntroSection = () => {
  return (
    <section id="intro" className="container mx-auto px-4 py-24 sm:py-32">
      <div className="grid place-items-center lg:grid-cols-2 lg:gap-24 xl:w-2/3 xl:mx-auto">
        <div className="w-full">
          <h2 className="mb-2 text-lg text-primary tracking-wider">서비스 소개</h2>
          <h2 className="mb-4 font-bold text-3xl md:text-4xl">왜 Lettertree인가요?</h2>
          <p className="mb-8 text-muted-foreground text-xl">
            바쁘고 혼잡한 메일함 대신,
            <br />
            오직 읽는 즐거움에만 집중하세요.
          </p>
        </div>

        <div className="grid w-full gap-4 lg:grid-cols-2">
          {differenceList.map(({ icon, title, description }, index) => (
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
