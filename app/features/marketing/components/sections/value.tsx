import { Mail, FolderOpen, Search, Bookmark, Bell, Globe, BookOpenTextIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';

interface ValueProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const valueList: ValueProps[] = [
  {
    icon: <Mail className="h-5 w-5 text-primary" />,
    title: '전용 이메일 발급',
    description:
      '모든 뉴스레터를 @lettertr.ee 주소로 받아, 개인 메일과 완벽하게 분리한 나만의 공간을 만듭니다.',
  },
  {
    icon: <BookOpenTextIcon className="h-5 w-5 text-primary" />,
    title: '읽기 최적화',
    description: '광고와 잡음을 제거한 깔끔한 화면에서 콘텐츠에만 집중하세요.',
  },
  //   {
  //     icon: <FolderOpen className="h-6 w-6 text-primary" />,
  //     title: '스마트 폴더 시스템',
  //     description: '주제별 자동 분류와 사용자 정의 폴더로 뉴스레터를 체계적으로 관리하세요.',
  //   },
  {
    icon: <Search className="h-5 w-5 text-primary" />,
    title: '새로운 뉴스레터 발견',
    description: '관심사 기반 디렉토리에서 나에게 딱 맞는 뉴스레터를 찾아보세요.',
  },
  //   {
  //     icon: <Bookmark className="h-6 w-6 text-primary" />,
  //     title: '하이라이트 & 북마크',
  //     description: '중요한 내용을 하이라이트하고 나중에 읽을 콘텐츠를 북마크로 저장하세요.',
  //   },
  //   {
  //     icon: <Bell className="h-6 w-6 text-primary" />,
  //     title: '맞춤형 알림',
  //     description: '즐겨찾는 뉴스레터 발행 시 실시간 알림을 받고 놓치지 않고 읽어보세요.',
  //   },
  {
    icon: <Globe className="h-5 w-5 text-primary" />,
    title: '글로벌 뉴스레터',
    description: '국내 뉴스레터 뿐만 아니라, 해외 뉴스레터도 한 곳에서 읽어보세요.',
  },
];

export const ValueSection = () => {
  return (
    <section id="features" className="container mx-auto px-4 py-24 sm:py-32">
      <h2 className="mb-2 text-center text-lg text-primary tracking-wider">기능</h2>
      <h2 className="mb-4 text-center font-bold text-3xl md:text-4xl">나만의 뉴스레터 공간</h2>
      <h3 className="mx-auto mb-8 text-center text-muted-foreground text-xl md:w-2/3">
        개인 이메일에서 해방시켜드릴게요.
        <br />
        전용 메일박스에서 뉴스레터를 깔끔하게 모아보세요.
        {/* <br /> */}
        {/* Lettertree가 제공하는 강력한 기능들을 만나보세요. */}
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 lg:w-2/3 lg:mx-auto">
        {valueList.map(({ icon, title, description }) => (
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
