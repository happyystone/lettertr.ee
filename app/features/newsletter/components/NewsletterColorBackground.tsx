import { cn } from '@/lib/utils';
import { NEWSLETTER_BACKGROUND_COLORS } from '../constants';

const getRandomColor = (newsletterId: string, theme: 'dark' | 'light'): string => {
  let hash = 0;
  for (let i = 0; i < newsletterId.length; i++) {
    const char = newsletterId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 32비트 정수로 변환
  }
  const index = Math.abs(hash) % NEWSLETTER_BACKGROUND_COLORS[theme].length;
  return NEWSLETTER_BACKGROUND_COLORS[theme][index];
};

// 컬러 배경 컴포넌트
export const NewsletterColorBackground = ({
  newsletterId,
  sourceName,
  theme,
}: {
  newsletterId: string;
  sourceName?: string;
  theme: 'dark' | 'light';
}) => {
  const colorClass = getRandomColor(newsletterId, theme);
  const initials = sourceName || '';

  return (
    <div
      className={cn(
        'w-full h-40 rounded-t-xl border-b border-gray-200 dark:border-gray-800 flex items-center justify-center',
        colorClass,
      )}
    >
      <span className="text-foreground text-2xl font-bold opacity-80">{initials}</span>
    </div>
  );
};
