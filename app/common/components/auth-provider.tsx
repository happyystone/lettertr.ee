import React, { useCallback, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router';
import { Toaster } from 'sonner';
import { AuthUIProvider, type AuthUIContextType } from '@daveyplate/better-auth-ui';

import { authClient } from '@/lib/auth/auth-client';

const CustomLink: AuthUIContextType['Link'] = React.memo(({ href, children, ...props }) => (
  <Link to={href} {...props}>
    {children}
  </Link>
));

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const handleNavigate = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate],
  );
  const handleReplace = useCallback(
    (path: string) => {
      navigate(path, { replace: true });
    },
    [navigate],
  );

  return (
    <AuthUIProvider
      authClient={authClient}
      navigate={handleNavigate}
      replace={handleReplace}
      redirectTo="/letters"
      // apiKey={true}
      // settings={{ url: '/dashboard/settings' }}
      social={{ providers: ['google'] }}
      avatar={{
        upload: async (file: File) => {
          // TODO: Implement upload
          return null;
        },
      }}
      emailVerification={true}
      signUp={{ fields: [] }} // 이름을 지우기 위한 props
      nameRequired={false}
      Link={CustomLink}
      localization={{
        SIGN_IN: '로그인',
        SIGN_IN_ACTION: '로그인',
        SIGN_IN_DESCRIPTION: '이메일과 비밀번호로 로그인하세요.',
        DONT_HAVE_AN_ACCOUNT: '계정이 없으신가요?',

        SIGN_UP: '회원가입',
        SIGN_UP_ACTION: '가입하기',
        SIGN_UP_DESCRIPTION: '이메일과 비밀번호로 계정을 생성하세요.',
        SIGN_UP_EMAIL: '인증 메일을 보내드렸습니다. 이메일을 확인해주세요.',
        ALREADY_HAVE_AN_ACCOUNT: '이미 계정이 있으신가요?',

        EMAIL: '이메일',
        EMAIL_PLACEHOLDER: '이메일 주소를 입력하세요',

        PASSWORD: '비밀번호',
        PASSWORD_PLACEHOLDER: '비밀번호를 입력하세요',
        PASSWORD_TOO_SHORT: '비밀번호는 8자 이상이어야 합니다.',

        FORGOT_PASSWORD: '비밀번호 재설정',
        FORGOT_PASSWORD_LINK: '비밀번호를 잊으셨나요?',

        OR_CONTINUE_WITH: '또는',
        IS_REQUIRED: '주소는 필수입니다.',
        PASSWORD_REQUIRED: '비밀번호는 필수입니다.',
        IS_INVALID: '양식이 올바르지 않습니다.',

        EMAIL_NOT_VERIFIED: '인증되지 않은 이메일 주소입니다.',
        INVALID_EMAIL_OR_PASSWORD: '이메일 또는 비밀번호가 올바르지 않습니다.',
        USER_ALREADY_EXISTS: '이미 존재하는 이메일 주소입니다. 다른 이메일 주소로 진행해주세요.',
        FORGOT_PASSWORD_DESCRIPTION: '비밀번호 재설정을 위한 이메일 주소를 입력해주세요.',
        FORGOT_PASSWORD_ACTION: '비밀번호 재설정',
        VERIFY_YOUR_EMAIL_DESCRIPTION: '이메일 주소 인증을 위한 이메일 주소를 입력해주세요.',
        FORGOT_PASSWORD_EMAIL: '비밀번호 재설정 메일을 보내드렸습니다. 이메일을 확인해주세요.',
        GO_BACK: '뒤로가기',

        NEW_PASSWORD: '새로운 비밀번호',
        NEW_PASSWORD_PLACEHOLDER: '새로운 비밀번호를 입력해주세요.',
        NEW_PASSWORD_REQUIRED: '새로운 비밀번호는 필수입니다.',

        RESET_PASSWORD: '비밀번호 재설정',
        RESET_PASSWORD_DESCRIPTION: '',
        RESET_PASSWORD_ACTION: '비밀번호 재설정',
        RESET_PASSWORD_SUCCESS: '비밀번호가 성공적으로 변경되었습니다.',

        // <ChangePasswordCard />
        SET_PASSWORD: '비밀번호 변경',
        SET_PASSWORD_DESCRIPTION: '버튼을 클릭하면 비밀번호 재설정 메일을 보내드립니다.',

        // <SessionsCard />
        SESSIONS: '세션 관리',
        SESSIONS_DESCRIPTION: '활성화된 세션을 로그아웃할 수 있습니다.',
        CURRENT_SESSION: '현재 세션',
        SIGN_OUT: '로그아웃',
        REVOKE: '로그아웃',

        // <DeleteAccountCard />
        DELETE_ACCOUNT: '계정 삭제',
        DELETE_ACCOUNT_DESCRIPTION: '계정을 삭제하면 더 이상 사용할 수 없습니다.',
        DELETE_ACCOUNT_SUCCESS: '계정이 성공적으로 삭제되었습니다.',
        DELETE_ACCOUNT_INSTRUCTIONS:
          '계정을 삭제하시면 되돌릴 수 없습니다. 정말로 삭제하시겠습니까?',
        CANCEL: '취소',
      }}
    >
      {children}
      <Toaster />
    </AuthUIProvider>
  );
}
