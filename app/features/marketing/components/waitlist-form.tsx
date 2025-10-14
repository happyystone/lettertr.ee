import { useState, useEffect } from 'react';
import { useFetcher } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, Users, AlertCircle, CheckIcon } from 'lucide-react';

import { AnimatedSubscribeButton } from '@/common/components/ui/animated-subscribe-button';
import { Input } from '@/common/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/common/components/ui/form';
import type { WaitlistActionResponse } from '../types';

const waitlistSchema = z.object({
  email: z.email('올바른 이메일 형식을 입력해주세요').min(1, '이메일을 입력해주세요'),
  name: z.string().optional(),
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

interface WaitlistFormProps {
  waitlistCount?: number;
  className?: string;
  title?: string;
}

export function WaitlistForm({
  waitlistCount = 0,
  className = '',
  title = '🚀 서비스 오픈 알림을 받아보세요!',
}: WaitlistFormProps) {
  const fetcher = useFetcher<WaitlistActionResponse>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: { email: '' },
  });

  const isSubmitting = fetcher.state === 'submitting';

  // Handle response
  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        setIsSubmitted(true);
        setErrorMessage(null);
        form.reset();
      } else {
        setErrorMessage(fetcher.data.message);
      }
    }
  }, [fetcher.data, form]);

  const onSubmit = (data: WaitlistFormData) => {
    fetcher.submit(
      {
        intent: 'join-waitlist',
        email: data.email,
      },
      { method: 'post' },
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="font-semibold text-lg">
        {isSubmitted ? '감사합니다! 성공적으로 등록되었습니다.' : title}
      </h3>
      <Form {...form}>
        <fetcher.Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center flex-col gap-4 sm:flex-row">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="이메일 주소를 입력하세요"
                      disabled={isSubmitting}
                      className="h-12 mt-0"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AnimatedSubscribeButton
              subscribeStatus={isSubmitted}
              type="submit"
              disabled={isSubmitting}
              className="group h-12 px-8 sm:w-auto text-sm hover:bg-primary/90"
            >
              <span className="inline-flex items-center">
                대기 리스트 등록
                <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <span className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4" />
                등록 완료!
              </span>
            </AnimatedSubscribeButton>
          </div>
        </fetcher.Form>
      </Form>

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">
          <AlertCircle className="h-4 w-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Social Proof */}
      {waitlistCount > 0 && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            현재 <span className="font-semibold text-primary">{waitlistCount}명</span>이 대기
            중입니다
          </span>
        </div>
      )}

      {/* Privacy Notice */}
      <p className="text-center text-xs text-muted-foreground">
        {isSubmitted
          ? '서비스가 오픈되면 가장 먼저 알려드리겠습니다.'
          : '이메일 주소는 서비스 런칭 알림 용도로만 사용되며, 스팸 메일은 절대 보내지 않습니다.'}
      </p>
    </div>
  );
}
