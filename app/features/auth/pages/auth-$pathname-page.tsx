import { Link, useNavigation } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { AuthCard } from '@daveyplate/better-auth-ui';

import { Button } from '@/common/components/ui/button';

import type { Route } from '../routes/+types/auth.$pathname';

export default function AuthPage({ params }: Route.ComponentProps) {
  const navigation = useNavigation();
  const { pathname } = params;

  return navigation.state === 'loading' ? null : (
    <main className="container mx-auto flex grow flex-col items-center justify-center gap-4 self-center bg-background py-18 sm:py-22">
      <Link to="/" className="absolute top-6 left-8">
        <Button
          variant="outline"
          className="hover:bg-secondary hover:text-secondary-foreground"
          size="sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          홈으로
        </Button>
      </Link>

      <AuthCard classNames={{ form: { input: 'text-sm' } }} pathname={pathname} />

      {['sign-up'].includes(pathname) && (
        <div className="text-center text-muted-foreground text-sm">
          <p>
            계속 진행 시,{' '}
            <Link to="/terms" className="underline hover:text-foreground">
              이용약관
            </Link>{' '}
            및{' '}
            <Link to="/privacy" className="underline hover:text-foreground">
              개인정보처리방침
            </Link>
            에 동의한 것으로 간주해요.
          </p>
        </div>
      )}
    </main>
  );
}
