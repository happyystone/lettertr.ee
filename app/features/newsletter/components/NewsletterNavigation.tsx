import { Link } from 'react-router';
import { Card } from '@/common/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NewsletterNavigationProps {
  previous: any | null;
  next: any | null;
}

export function NewsletterNavigation({ previous, next }: NewsletterNavigationProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2">
        {previous && (
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link to={`newsletter/${previous.id}`} className="block p-4">
              <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                <ChevronLeft className="h-4 w-4" />
                이전 뉴스레터
              </div>
              <h3 className="font-semibold line-clamp-2">{previous.subject}</h3>
              <p className="text-sm text-muted-foreground mt-1">{previous.source?.name}</p>
            </Link>
          </Card>
        )}

        {next && (
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link to={`newsletter/${next.id}`} className="block p-4">
              <div className="flex items-center justify-end gap-2 mb-2 text-sm text-muted-foreground">
                다음 뉴스레터
                <ChevronRight className="h-4 w-4" />
              </div>
              <h3 className="font-semibold line-clamp-2 text-right">{next.subject}</h3>
              <p className="text-sm text-muted-foreground mt-1 text-right">{next.source?.name}</p>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
