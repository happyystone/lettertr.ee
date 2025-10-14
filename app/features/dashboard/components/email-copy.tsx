import { useState } from 'react';
import { useFetcher } from 'react-router';
import { Copy, Check, Mail } from 'lucide-react';
import { toast } from 'sonner';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/common/components/ui/tooltip';
import { Button } from '@/common/components/ui/button';

// FIXME: common 으로 이동 필요
export function EmailCopy({
  email,
  isOnboarded,
  userId,
  noTooltip = false,
  noMailIcon = false,
  buttonVariant = 'outline',
  disableOnboarding = false,
}: {
  email: string | null | undefined;
  isOnboarded: boolean;
  userId: string;
  noTooltip?: boolean;
  noMailIcon?: boolean;
  buttonVariant?: 'default' | 'outline';
  disableOnboarding?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const fetcher = useFetcher();

  const handleCopy = async () => {
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      toast.success('이메일 주소가 복사되었습니다!', { position: 'top-right' });

      if (!isOnboarded && !disableOnboarding) {
        fetcher.submit(
          { userId },
          {
            method: 'post',
            action: `/api/onboarding`,
          },
        );
      }

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('복사에 실패했습니다. 다시 시도해주세요.', { position: 'top-right' });
    }
  };

  return (
    <TooltipProvider>
      <Tooltip open={noTooltip ? false : undefined}>
        <TooltipTrigger asChild className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center flex-1 bg-muted pl-4 pr-18 py-2.5 rounded-lg font-mono text-sm">
              {!noMailIcon && <Mail className="h-5 w-5 mr-2" />}
              {email}
            </div>
            <Button variant={buttonVariant} size="icon" onClick={handleCopy} className="shrink-0">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs text-balance text-[14px]">
          {/* 이 이메일 주소로 뉴스레터를 구독하시면 Lettertree가 자동으로 수집합니다! */}
          뉴스레터 구독 시 사용하세요!
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
