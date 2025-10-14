import { APIKeysCard } from '@daveyplate/better-auth-ui';
import { PageHeader } from '@/features/dashboard/components/page-header';

export default function APIKeysSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="API page" description="Manage your API keys." />
      <APIKeysCard className="max-w-xl" />
    </div>
  );
}
