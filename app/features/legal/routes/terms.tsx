import { ArrowLeft } from 'lucide-react';
import type { Route } from './+types/terms';

export const meta: Route.MetaFunction = () => {
  return [
    { title: '이용약관 | Lettertree' },
    { name: 'description', content: 'Lettertree 서비스 이용약관' },
  ];
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 pb-4 mb-8 border-b border-gray-200">
          이용약관
        </h1>

        <div className="bg-white rounded-lg shadow-lg space-y-8">
          <section>
            <p className="text-sm text-gray-500 mb-8">시행일: 2025년 9월 20일</p>
          </section>

          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">제1조 (목적)</h2>
              <p className="text-gray-600 leading-relaxed">
                본 약관은 해피스톤(이하 "회사")가 제공하는 뉴스레터 큐레이션 및 관리 서비스(이하
                "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을
                목적으로 합니다.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">제2조 (용어의 정의)</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>
                  "서비스"란 회사가 제공하는 뉴스레터 구독, 관리, 발견 관련 제반 서비스를
                  의미합니다.
                </li>
                <li>
                  "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을
                  말합니다.
                </li>
                <li>
                  "회원"이란 회사와 서비스 이용계약을 체결하고 이용자 아이디를 부여받은 이용자를
                  말합니다.
                </li>
                <li>"뉴스레터"란 이메일로 전달되는 정기 간행물 형태의 콘텐츠를 말합니다.</li>
                <li>"큐레이션"이란 다양한 뉴스레터를 선별하여 추천하는 서비스를 말합니다.</li>
                <li>
                  "콘텐츠"란 회사가 제공하는 서비스 내에 게시된 모든 글, 이미지, 동영상 등 모든
                  정보를 의미합니다.
                </li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">제3조 (약관 외 준칙)</h2>
              <p className="text-gray-600 leading-relaxed">
                이 약관에 명시되지 않은 사항에 대해서는 전기통신사업법, 전자상거래 등에서의
                소비자보호에 관한 법률, 개인정보 보호법 등 관련 법령과 일반적인 상관례에 따릅니다.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                제4조 (약관의 게시와 개정)
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>회사는 본 약관을 서비스 내 또는 연결화면에 게시합니다.</li>
                <li>
                  회사는 필요한 경우 관련 법령을 위반하지 않는 범위에서 본 약관을 개정할 수
                  있습니다.
                </li>
                <li>
                  약관 개정 시 적용일자 및 개정 사유를 명시하여 최소 7일 전부터 공지합니다. 다만,
                  이용자에게 불리한 변경의 경우 최소 30일 전부터 공지합니다.
                </li>
                <li>
                  회원이 개정약관에 동의하지 않는 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.
                  개정된 약관의 효력 발생일 이후에도 서비스를 계속 이용할 경우 약관의 변경사항에
                  동의한 것으로 간주됩니다.
                </li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                제5조 (회원가입 및 회원정보 관리)
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>
                  회원가입은 이용자가 본 약관에 동의하고 회사가 정한 절차에 따라 회원정보를
                  입력함으로써 이루어집니다.
                </li>
                <li>
                  회원가입 시 제공한 정보는 정확해야 하며, 변경사항이 있을 경우 즉시 수정해야
                  합니다.
                </li>
                <li>
                  회원은 언제든지 서비스 내 절차를 통해 탈퇴를 요청할 수 있으며, 회사는 관련 법령이
                  정하는 범위 내에서 즉시 처리합니다.
                </li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                제6조 (회원 및 비회원의 의무)
              </h2>
              <p className="text-gray-600 mb-2">이용자는 다음 행위를 해서는 안 됩니다:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li>신청 또는 변경 시 허위 내용의 등록</li>
                <li>타인의 정보 도용</li>
                <li>회사가 게시한 정보의 변경</li>
                <li>회사가 금지한 정보의 송신 또는 게시</li>
                <li>회사와 기타 제3자의 저작권 등 지적재산권 침해</li>
                <li>회사 및 기타 제3자의 명예를 손상시키는 행위</li>
                <li>외설적이거나 폭력적인 콘텐츠 전송 또는 게시</li>
                <li>서비스의 안정적 운영을 방해하는 행위</li>
                <li>기타 불법적이거나 부당한 행위</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                제7조 (회원 아이디 및 비밀번호 관리에 대한 의무)
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>
                  회원의 아이디와 비밀번호에 관한 관리책임은 회원에게 있으며, 이를 제3자가
                  이용하도록 하여서는 안 됩니다.
                </li>
                <li>
                  회사는 회원의 아이디가 개인정보 유출 우려가 있거나, 반사회적 또는 미풍양속에
                  어긋나거나 회사 및 회사의 운영자로 오인할 우려가 있는 경우, 해당 아이디의 이용을
                  제한할 수 있습니다.
                </li>
                <li>
                  회원은 아이디 및 비밀번호가 도용되거나 제3자가 사용하고 있음을 인지한 경우에는
                  이를 즉시 회사에 통지하고 회사의 안내에 따라야 합니다.
                </li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                제8조 (회사의 권리와 콘텐츠 이용)
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>
                  서비스 및 관련 소프트웨어, 디자인, 마크, 로고 등 일체의 권리는 회사에 귀속됩니다.
                </li>
                <li>
                  회원이 서비스 내에서 작성한 콘텐츠의 저작권은 원칙적으로 회원에게 귀속됩니다.
                </li>
                <li>
                  회사는 서비스 운영, 홍보 등을 위하여 필요한 범위 내에서 회원의 콘텐츠를 무상으로
                  이용할 수 있습니다.
                </li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                제9조 (유료 서비스 및 환불)
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>유료 서비스의 결제, 해지, 환불 정책은 관련 법령 및 회사의 정책에 따릅니다.</li>
                <li>
                  이용자가 정기구독을 해지할 경우, 다음 결제일부터 이용이 중단되며 이미 결제된
                  금액은 환불되지 않습니다. 단, 법령상 달리 정한 경우는 예외로 합니다.
                </li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                제10조 (서비스의 제공 및 책임 제한)
              </h2>
              <p className="text-gray-600 mb-2">회사는 다음과 같은 서비스를 제공합니다:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li>뉴스레터 발견 및 추천 서비스</li>
                <li>뉴스레터 구독 관리 서비스</li>
                <li>뉴스레터 카테고리별 정리 서비스</li>
                <li>개인화된 뉴스레터 추천 서비스</li>
                <li>뉴스레터 아카이빙 서비스</li>
                <li>기타 회사가 정하는 서비스</li>
              </ul>
              <p className="text-gray-600 mt-2">
                회사는 서비스의 전부 또는 일부를 변경할 수 있으며, 필요한 경우 사전에 공지합니다.
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-600 mt-4">
                <li>
                  회사는 시스템 점검, 교체, 통신 두절 등 서비스 제공이 일시적으로 중단될 경우 이를
                  사전에 공지합니다. 다만, 불가피한 사유가 있을 경우 사후에 공지할 수 있습니다.
                </li>
                <li>
                  회사는 천재지변, 불가항력 등 회사의 합리적 통제범위를 벗어난 사유로 서비스를
                  제공할 수 없는 경우 책임을 지지 않습니다.
                </li>
                <li>
                  회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대해서는 책임을 지지 않습니다.
                </li>
                <li>
                  유료 서비스의 경우, 회사의 고의 또는 중대한 과실로 인한 손해에 대해서만
                  배상합니다.
                </li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">제11조 (광고 및 마케팅)</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>회사는 서비스 운영과 관련하여 광고를 게재할 수 있습니다.</li>
                <li>
                  회원에게 사전 동의를 받은 경우에 한해 이메일, 푸시 알림 등으로 마케팅 정보를
                  발송할 수 있습니다.
                </li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">제12조 (분쟁 해결)</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>회사와 회원 간 분쟁은 상호 협의하여 해결함을 원칙으로 합니다.</li>
                <li>
                  협의가 이루어지지 않을 경우, 이용자는 관련 법령에 따라 한국인터넷진흥원,
                  한국소비자원 등 분쟁조정기구에 분쟁조정을 신청할 수 있습니다.
                </li>
                <li>최종적으로는 대한민국 법원을 관할 법원으로 합니다.</li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                제13조 (회원자격 상실 등)
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>
                  회사는 회원이 다음 각 호에 해당하는 경우 회원자격을 제한 또는 상실시킬 수
                  있습니다.
                </li>
                <ul className="list-disc list-inside ml-6 space-y-1 text-gray-600">
                  <li>가입 신청 시 허위 내용을 등록한 경우</li>
                  <li>타인의 서비스를 방해하거나 정보를 도용하는 경우</li>
                  <li>법령이나 본 약관이 금지하는 행위를 하는 경우</li>
                </ul>
                <li>
                  회사는 회원자격 상실 시 회원등록을 말소하며, 회원에게 사전에 통지합니다. (회원등록
                  말소 전에 최소 30일 이상의 기간을 정하여 소명 기회를 부여합니다)
                </li>
              </ol>
            </div>

            <div className="pt-8 border-t">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">부칙</h2>
              <p className="text-gray-600">본 약관은 2025년 9월 20일부터 시행됩니다.</p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t flex flex-col gap-4">
            <p className="text-gray-600">
              문의사항이 있으시면{' '}
              <a href="mailto:support@lettertr.ee" className="text-blue-600 hover:underline">
                support@lettertr.ee
              </a>
              로 연락해 주시기 바랍니다.
            </p>
            <a href="/" className="text-blue-600 hover:underline flex items-center gap-2">
              <ArrowLeft className="size-5" /> 홈으로 돌아가기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
