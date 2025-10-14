import { Mail, FolderOpen, Search, Bookmark, Bell, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';

interface FeaturesProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const featureList: FeaturesProps[] = [
  {
    icon: <Mail className="h-6 w-6 text-primary" />,
    title: '전용 이메일 주소',
    description:
      '@lettertr.ee 도메인의 전용 이메일 주소로 개인 메일과 뉴스레터를 완벽하게 분리합니다.',
  },
  {
    icon: <FolderOpen className="h-6 w-6 text-primary" />,
    title: '스마트 폴더 시스템',
    description: '주제별 자동 분류와 사용자 정의 폴더로 뉴스레터를 체계적으로 관리하세요.',
  },
  {
    icon: <Search className="h-6 w-6 text-primary" />,
    title: '뉴스레터 탐색',
    description: '수천 개의 한국 및 글로벌 뉴스레터를 탐색하고 관심사에 맞는 콘텐츠를 발견하세요.',
  },
  {
    icon: <Bookmark className="h-6 w-6 text-primary" />,
    title: '하이라이트 & 북마크',
    description: '중요한 내용을 하이라이트하고 나중에 읽을 콘텐츠를 북마크로 저장하세요.',
  },
  {
    icon: <Bell className="h-6 w-6 text-primary" />,
    title: '맞춤형 알림',
    description: '즐겨찾는 뉴스레터 발행 시 실시간 알림을 받고 놓치지 않고 읽어보세요.',
  },
  {
    icon: <Globe className="h-6 w-6 text-primary" />,
    title: '다국어 지원',
    description: '한국어와 영어를 기본 지원하며, 지역별 맞춤 뉴스레터를 추천받을 수 있습니다.',
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="container mx-auto px-4 py-24 sm:py-32">
      <h2 className="mb-2 text-center text-lg text-primary tracking-wider">핵심 기능</h2>
      <h2 className="mb-4 text-center font-bold text-3xl md:text-4xl">뉴스레터 관리의 모든 것</h2>
      <h3 className="mx-auto mb-8 text-center text-muted-foreground text-xl md:w-2/3">
        이메일 수신함의 혼란에서 벗어나
        <br />
        체계적이고 효율적인 뉴스레터 관리를 경험하세요.
        <br />
        Lettertree가 제공하는 강력한 기능들을 만나보세요.
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featureList.map(({ icon, title, description }) => (
          <div key={title}>
            <Card className="h-full border-0 bg-background shadow-none">
              <CardHeader className="flex items-center justify-center gap-4 align-middle pb-2">
                <div className="rounded-full bg-primary/20 p-2 ring-8 ring-primary/10">{icon}</div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-center text-muted-foreground">{description}</CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};
