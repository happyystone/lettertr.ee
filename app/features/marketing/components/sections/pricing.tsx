import { Button } from '@/common/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/common/components/ui/card';

enum PopularPlan {
  NO = 0,
  YES = 1,
}

interface PlanProps {
  title: string;
  popular: PopularPlan;
  price: number | string;
  description: string;
  buttonText: string;
  benefitList: string[];
  disabled?: boolean;
}

const plans: PlanProps[] = [
  {
    title: 'Free',
    popular: 1,
    price: 0,
    description: '수많은 뉴스레터를 쉽게 관리할 수 있습니다.',
    buttonText: '무료로 시작하기',
    benefitList: [
      '20개의 뉴스레터 수신 가능',
      '뉴스레터 분류 기능',
      '하이라이트와 노트 기능',
      'AI 요약과 번역 기능',
      '팟캐스트 생성',
    ],
  },
  {
    title: 'Premium',
    popular: 0,
    price: '-',
    description: 'AI 요약, 번역, 팟캐스트 등 다양한 기능을 사용할 수 있습니다.',
    buttonText: '시작하기',
    benefitList: [
      '4 team member',
      '8 GB storage',
      'Up to 6 pages',
      'Priority support',
      'AI 요약과 번역 기능',
      '팟캐스트 생성',
    ],
    disabled: true,
  },
  // {
  //   title: 'Enterprise',
  //   popular: 0,
  //   price: 120,
  //   description:
  //     'Comprehensive solution for large organizations with extensive customization needs.',
  //   buttonText: 'Contact Us',
  //   benefitList: [
  //     '10 team member',
  //     '20 GB storage',
  //     'Up to 10 pages',
  //     'Phone & email support',
  //     'AI assistance',
  //   ],
  // },
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="container mx-auto px-4 py-24 sm:py-32">
      <h2 className="mb-2 text-center text-lg text-primary tracking-wider">Pricing</h2>

      <h2 className="mb-4 text-center font-bold text-3xl md:text-4xl">Get unlimited access</h2>

      <h3 className="mx-auto pb-14 text-center text-muted-foreground text-xl md:w-1/2">
        Choose the perfect plan that fits your needs and budget.
      </h3>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {plans.map(({ title, popular, price, description, buttonText, benefitList, disabled }) => (
          <Card
            key={title}
            className={
              popular === PopularPlan?.YES
                ? 'border-[1.5px] border-primary shadow-black/10 drop-shadow-xl lg:scale-[1.1] dark:shadow-white/10'
                : disabled
                  ? 'bg-muted-foreground/10 shadow-black/10 drop-shadow-xl lg:scale-[1.1] dark:shadow-white/10'
                  : ''
            }
          >
            <CardHeader>
              <CardTitle className="pb-2">{title}</CardTitle>

              <CardDescription className="pb-4">{description}</CardDescription>

              <div>
                <span className="font-bold text-3xl">₩{price}</span>
                <span className="text-muted-foreground"> /월</span>
              </div>
            </CardHeader>

            <CardContent className="flex">
              <div className="space-y-4">
                {benefitList.map((benefit) => (
                  <span key={benefit} className="flex items-center gap-2">
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 21 21"
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-shrink-0 fill-current"
                    >
                      <path d="M14.3589 2.6492H7.3756C4.34227 2.6492 2.53394 4.45753 2.53394 7.49087V14.4659C2.53394 17.5075 4.34227 19.3159 7.3756 19.3159H14.3506C17.3839 19.3159 19.1923 17.5075 19.1923 14.4742V7.49087C19.2006 4.45753 17.3923 2.6492 14.3589 2.6492ZM14.8506 9.06587L10.1256 13.7909C10.0089 13.9075 9.8506 13.9742 9.68394 13.9742C9.51727 13.9742 9.35894 13.9075 9.24227 13.7909L6.88394 11.4325C6.64227 11.1909 6.64227 10.7909 6.88394 10.5492C7.1256 10.3075 7.5256 10.3075 7.76727 10.5492L9.68394 12.4659L13.9673 8.18253C14.2089 7.94087 14.6089 7.94087 14.8506 8.18253C15.0923 8.4242 15.0923 8.81587 14.8506 9.06587Z" />
                    </svg>
                    <h3>{benefit}</h3>
                  </span>
                ))}
              </div>
            </CardContent>

            <CardFooter>
              <Button
                disabled={true}
                variant={popular === PopularPlan?.YES ? 'default' : 'secondary'}
                className="w-full"
              >
                서비스 오픈 예정
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
