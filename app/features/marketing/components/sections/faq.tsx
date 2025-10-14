import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/common/components/ui/accordion';

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: 'Lettertree는 무료인가요?',
    answer:
      '베타 기간 동안에는 모든 기본 기능이 무료로 제공 될 예정입니다. 추후 프리미엄 기능이 추가될 예정이며, 기본 기능들은 계속 무료로 이용 가능합니다.',
    value: 'item-1',
  },
  {
    question: '전용 이메일 주소는 어떻게 작동하나요?',
    answer:
      '가입 시 username@lettertr.ee 형태의 전용 이메일 주소를 제공합니다. 이 주소로 뉴스레터를 구독하면 수신한 뉴스레터를 Lettertree에서 확인할 수 있고, 개인 이메일과 완전히 분리하여 관리할 수 있습니다.',
    value: 'item-2',
  },
  // {
  //   question: '기존에 구독 중인 뉴스레터는 어떻게 이전하나요?',
  //   answer:
  //     '뉴스레터 발행사의 구독 관리 페이지에서 이메일 주소를 Lettertree 전용 주소로 변경하시면 됩니다. 자세한 가이드를 제공하고 있습니다.',
  //   value: 'item-3',
  // },
  // {
  //   question: '서비스는 언제 오픈되나요?',
  //   answer:
  //     '9월 중에 오픈 예정입니다. 서비스가 오픈되면 입력해주신 메일로 알려드리겠습니다. 많은 관심 부탁드립니다.',
  //   value: 'item-3',
  // },
  {
    question: '어떤 뉴스레터를 탐색할 수 있나요?',
    answer:
      '한국과 글로벌의 뉴스레터를 카테고리별로 탐색할 수 있습니다. 기술, 비즈니스, AI 등 다양한 분야의 뉴스레터를 제공할 예정입니다.',
    value: 'item-4',
  },
  {
    question: '모바일 앱도 제공되나요?',
    answer:
      '현재는 웹 버전만 제공 중이며, 모바일 웹에서 접근하시면 이용 가능합니다. iOS/Android 앱은 개발 예정입니다.',
    value: 'item-5',
  },
  {
    question: '내 데이터는 안전한가요?',
    answer:
      '모든 데이터는 암호화되어 안전하게 저장되며, 사용자 동의 없이 제3자와 절대 공유하지 않습니다. 저작권 보호를 위해 콘텐츠 재배포는 금지됩니다.',
    value: 'item-6',
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="container mx-auto px-4 py-24 sm:py-32 md:w-[700px]">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-center text-lg text-primary tracking-wider">FAQ</h2>

        <h2 className="text-center font-bold text-3xl md:text-4xl">자주 묻는 질문</h2>
      </div>

      <Accordion type="single" collapsible className="AccordionRoot">
        {FAQList.map(({ question, answer, value }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">{question}</AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
