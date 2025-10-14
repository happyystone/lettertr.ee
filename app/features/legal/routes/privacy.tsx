import { ArrowLeft } from 'lucide-react';
import type { Route } from './+types/privacy';

export const meta: Route.MetaFunction = () => {
  return [
    { title: '개인정보처리방침 | Lettertree' },
    { name: 'description', content: 'Lettertree 개인정보처리방침' },
  ];
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white ">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 pb-4 mb-8 border-b border-gray-200">
          개인정보처리방침
        </h1>

        <div className="bg-white rounded-lg shadow-lg space-y-8">
          <section>
            <p className="text-sm text-gray-500 mb-8">시행일: 2025년 9월 20일</p>
            <p className="text-gray-600 leading-relaxed mb-4">
              해피스톤(이하 "회사")는 개인정보 보호법 제30조에 따라 정보주체의 개인정보를 보호하고
              이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보
              처리방침을 수립·공개합니다.
            </p>
          </section>

          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                제1조 (개인정보의 처리 목적)
              </h2>
              <p className="text-gray-600 mb-2">
                회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의
                목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법
                제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-600 ml-4">
                <li>
                  <strong>서비스 제공 및 계약 이행</strong>
                  <ul className="list-disc list-inside mt-1 ml-4">
                    <li>뉴스레터 구독 관리 및 추천 서비스 제공</li>
                    <li>맞춤형 콘텐츠 추천</li>
                  </ul>
                </li>
                <li>
                  <strong>회원 관리</strong>
                  <ul className="list-disc list-inside mt-1 ml-4">
                    <li>회원제 서비스 이용에 따른 본인 확인</li>
                    <li>불량회원의 부정 이용 방지</li>
                  </ul>
                </li>
                <li>
                  <strong>서비스 개선</strong>
                  <ul className="list-disc list-inside mt-1 ml-4">
                    <li>서비스 이용에 대한 통계 분석</li>
                    <li>이용자 선호도 분석</li>
                    <li>서비스 개선 및 신규 서비스 개발</li>
                  </ul>
                </li>
                <li>
                  <strong>마케팅 및 광고</strong>
                  <ul className="list-disc list-inside mt-1 ml-4">
                    <li>이벤트 및 행사 안내</li>
                    <li>서비스 홍보 및 마케팅</li>
                  </ul>
                </li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                제2조 (개인정보의 처리 및 보유 기간)
              </h2>

              <p className="text-gray-600 mb-2">
                회사는 법령에 따른 개인정보 보유·이용기간 또는 이용자로부터 개인정보를 수집 시에
                동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
              </p>

              <ol className="list-decimal list-inside space-y-2 text-gray-600 ml-4">
                <li>
                  <strong>회원정보</strong>
                  <ul className="list-disc list-inside mt-1 ml-4">
                    <li>보유기간: 회원 탈퇴 시까지</li>
                    <li>단, 관계법령에 따라 보존할 필요가 있는 경우 해당 기간 동안 보관</li>
                  </ul>
                </li>
                <li>
                  <strong>법령에 따른 보존</strong>
                  <ul className="list-disc list-inside mt-1 ml-4">
                    <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
                    <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                    <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
                    <li>표시·광고에 관한 기록: 6개월</li>
                    <li>웹사이트 방문기록: 3개월</li>
                  </ul>
                </li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                제3조 (개인정보의 수집 항목 및 수집 방법)
              </h2>
              <p className="text-gray-600 mb-2">
                회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집하고 있습니다. 회사는 민감정보
                및 고유식별정보를 원칙적으로 수집하지 않습니다. 부득이하게 수집하는 경우, 반드시
                사전 동의를 받습니다.
              </p>
              <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">가. 수집 항목</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600 ml-4">
                <li>
                  <strong>회원가입 시</strong>
                  <ul className="list-disc list-inside mt-1 ml-4">
                    <li>필수항목: 이메일 주소, 이름(닉네임), 비밀번호</li>
                    <li>선택항목: 없음</li>
                    <li>소셜 로그인 시: 소셜 계정 정보(이메일, 이름)</li>
                  </ul>
                </li>
                <li>
                  <strong>서비스 이용 과정에서 자동 수집되는 정보</strong>
                  <ul className="list-disc list-inside mt-1 ml-4">
                    <li>IP 주소, 쿠키, 서비스 이용 기록</li>
                    <li>방문 일시, 브라우저 종류 및 OS</li>
                    <li>디바이스 정보</li>
                  </ul>
                </li>
                <li>
                  <strong>뉴스레터 구독 시</strong>
                  <ul className="list-disc list-inside mt-1 ml-4">
                    <li>구독 뉴스레터 목록</li>
                    <li>구독 카테고리</li>
                    <li>읽은 뉴스레터 기록</li>
                  </ul>
                </li>
              </ol>

              <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">나. 수집 방법</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li>홈페이지 회원가입 및 서비스 이용</li>
                <li>이메일을 통한 뉴스레터 구독</li>
                <li>고객센터를 통한 상담 과정</li>
                <li>이벤트 응모</li>
              </ul>

              {/* <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">
                다. 회사는 서비스 개선 및 맞춤형 콘텐츠 제공을 위해 행태정보를 수집·이용합니다.
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li>수집 항목: 서비스 이용 기록, 검색/클릭 로그, 광고 ID(GA, 쿠키 등)</li>
                <li>이용 목적: 서비스 품질 개선, 통계 분석, 맞춤형 광고 제공</li>
                <li>보유 기간: 수집일로부터 3년</li>
                <li>이용자 권리: 브라우저 설정 또는 앱 권한 관리로 거부 가능</li>
              </ul> */}
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                제4조 (개인정보의 제3자 제공)
              </h2>
              <p className="text-gray-600 mb-2">
                회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만
                처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에
                해당하는 경우에만 개인정보를 제3자에게 제공합니다. 현재 회사는 이용자의 개인정보를
                제3자에게 제공하고 있지 않습니다.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                제5조 (개인정보 처리 위탁)
              </h2>
              <p className="text-gray-600 mb-2">
                회사는 서비스 이행을 위해 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:
              </p>

              <table className="w-full mt-3 border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">수탁업체</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">위탁업무 내용</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Supabase</td>
                    <td className="border border-gray-300 px-4 py-2">
                      데이터베이스 및 인증 서비스 제공
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Vercel</td>
                    <td className="border border-gray-300 px-4 py-2">웹 호스팅 서비스</td>
                  </tr>
                  {/* <tr>
                    <td className="border border-gray-300 px-4 py-2">Google Analytics</td>
                    <td className="border border-gray-300 px-4 py-2">서비스 이용 통계 분석</td>
                  </tr> */}
                </tbody>
              </table>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                제6조 (이용자의 권리와 행사방법)
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>
                  이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있습니다.
                </li>
                <li>
                  이용자는 언제든지 개인정보 처리 정지, 회원탈퇴 등을 통해 개인정보의 수집 및 이용
                  동의를 철회할 수 있습니다.
                </li>
                <li>
                  개인정보 조회, 수정, 삭제 요청은 서비스 내 '설정' 메뉴에서 직접 하거나,
                  개인정보보호책임자에게 서면, 전화, 이메일로 연락하시면 지체없이 조치하겠습니다.
                </li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">제7조 (개인정보의 파기)</h2>
              <p className="text-gray-600 mb-2">
                회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을
                때에는 지체없이 해당 개인정보를 파기합니다. 파기절차 및 방법은 다음과 같습니다.
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>
                  <strong>파기절차</strong>
                  <p className="mt-1">
                    이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져 내부 방침 및 기타 관련
                    법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다.
                  </p>
                </li>
                <li>
                  <strong>파기방법</strong>
                  <ul className="list-disc list-inside mt-1 ml-4">
                    <li>전자적 파일 형태: 기술적 방법을 사용하여 복구 불가능하도록 삭제</li>
                    <li>종이에 출력된 개인정보: 분쇄기로 분쇄하거나 소각</li>
                  </ul>
                </li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                제8조 (개인정보의 안전성 확보 조치)
              </h2>
              <p className="text-gray-600 mb-2">
                회사는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한
                기술적/관리적/물리적 조치를 하고 있습니다:
              </p>

              <ol className="list-decimal list-inside space-y-2 text-gray-600 ml-4">
                <li>
                  <strong>개인정보 암호화</strong>
                  <p className="mt-1">
                    이용자의 비밀번호는 암호화되어 저장 및 관리되고 있으며, 중요 데이터는 암호화하여
                    사용하는 등 별도의 보안기능을 사용하고 있습니다.
                  </p>
                </li>
                <li>
                  <strong>해킹 등에 대비한 기술적 대책</strong>
                  <p className="mt-1">
                    해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위해
                    보안프로그램을 설치하고 주기적인 갱신·점검을 하고 있습니다.
                  </p>
                </li>
                <li>
                  <strong>개인정보처리시스템 접근 제한</strong>
                  <p className="mt-1">
                    개인정보를 처리하는 데이터베이스시스템에 대한 접근권한의 부여, 변경, 말소를
                    통하여 개인정보에 대한 접근통제를 실시하고 있습니다.
                  </p>
                </li>
                <li>
                  <strong>개인정보 취급 직원의 최소화 및 교육</strong>
                  <p className="mt-1">
                    개인정보를 취급하는 직원을 최소한으로 제한하고, 주기적인 교육을 실시하여
                    개인정보 보호의 중요성을 인식시키고 있습니다.
                  </p>
                </li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                제9조 (개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항)
              </h2>
              <p className="text-gray-600 mb-2">
                회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로
                불러오는 '쿠키(cookie)'를 사용합니다. 쿠키는 웹사이트를 운영하는데 이용되는 서버가
                이용자의 브라우저에게 보내는 소량의 정보이며 이용자의 PC 컴퓨터 내의 하드디스크에
                저장되기도 합니다.
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>
                  쿠키의 사용 목적: 이용자가 방문한 각 서비스와 웹 사이트들에 대한 방문 및 이용형태,
                  인기 검색어, 보안접속 여부 등을 파악하여 이용자에게 최적화된 정보 제공을 위해
                  사용됩니다.
                </li>
                <li>
                  {`쿠키의 설치·운영 및 거부: 웹브라우저 상단의 도구>인터넷 옵션>개인정보 메뉴의 옵션 설정을 통해 쿠키 저장을 거부할 수 있습니다.`}
                </li>
                <li>쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.</li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                제10조 (개인정보 보호책임자)
              </h2>
              <p className="text-gray-600 mb-3">
                회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한
                이용자의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보보호책임자를 지정하고
                있습니다.
              </p>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">개인정보보호책임자</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>성명: 강희석</li>
                  <li>직책: 대표</li>
                  <li>이메일: support@lettertr.ee</li>
                  <li>문의 시 원칙적으로 10일 이내에 회신합니다.</li>
                  {/* <li>전화번호: 010-6735-6307</li> */}
                </ul>
              </div>

              <p className="text-gray-600 mt-3">
                이용자는 서비스를 이용하면서 발생한 모든 개인정보보호 관련 문의, 불만처리, 피해구제
                등에 관한 사항을 개인정보보호책임자에게 문의하실 수 있습니다.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                제11조 (개인정보 열람청구)
              </h2>
              <p className="text-gray-600 mb-2">
                정보주체는 개인정보 보호법 제35조에 따른 개인정보의 열람 청구를 아래의 부서에 할 수
                있습니다. 회사는 정보주체의 개인정보 열람청구가 신속하게 처리되도록 노력하겠습니다.
              </p>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">
                  개인정보 열람청구 접수·처리 부서
                </h3>
                <ul className="space-y-1 text-gray-600">
                  <li>부서명: 고객센터</li>
                  <li>담당자: 강희석</li>
                  <li>이메일: support@lettertr.ee</li>
                  <li>문의 시 원칙적으로 10일 이내에 회신합니다.</li>
                  {/* <li>전화번호: 010-6735-6307</li> */}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                제12조 (권익침해 구제방법)
              </h2>
              <p className="text-gray-600 mb-2">
                이용자는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회,
                한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수
                있습니다:
              </p>

              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>개인정보분쟁조정위원회: (국번없이) 1833-6972 (www.kopico.go.kr)</li>
                <li>개인정보침해신고센터: (국번없이) 118 (privacy.kisa.or.kr)</li>
                <li>대검찰청: (국번없이) 1301 (www.spo.go.kr)</li>
                <li>경찰청: (국번없이) 182 (ecrm.cyber.go.kr)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                제13조 (개인정보 유출 통지)
              </h2>
              <p className="text-gray-600 mb-2">
                회사는 개인정보의 유출이 발생한 경우에는 지체 없이 해당 정보주체에게 그 사실을
                알리고, 개인정보 보호법 제34조에 따라 관계기관에 신고하겠습니다.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                제14조 (개인정보의 국외 이전)
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>이전받는 자: Supabase, Vercel</li>
                <li>이전 국가: 미국</li>
                <li>이전 방법: 서비스 이용 시 네트워크 전송</li>
                <li>이전 항목: 회원 정보 및 서비스 이용 데이터</li>
                <li>목적: 데이터베이스 저장, 인증서비스, 웹 호스팅</li>
                <li>보유 기간: 회원 탈퇴 시 또는 계약 종료 시까지</li>
              </ul>
            </div>

            <div className="pt-8 border-t">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">부칙</h2>
              <p className="text-gray-600">본 개인정보처리방침은 2025년 9월 20일부터 시행됩니다.</p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t flex flex-col gap-4">
            <p className="text-gray-600">
              개인정보 처리에 관한 문의사항이 있으시면{' '}
              <a href="mailto:support@lettertr.ee" className="text-blue-600 hover:underline">
                support@lettertr.ee
              </a>
              으로 연락해 주시기 바랍니다.
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
