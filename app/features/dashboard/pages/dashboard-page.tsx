import { PageHeader } from '@/features/dashboard/components/page-header';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Hi, Welcome back 👋"
        description="Here's what's happening with your account today."
      />
    </div>
  );
}
