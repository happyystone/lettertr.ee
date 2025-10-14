import type { Route } from './+types/settings';
import SettingsPage from '../pages/settings-page';
import { generateMeta } from '@/lib/seo';

export const meta: Route.MetaFunction = () => {
  return generateMeta({
    title: '설정 - Lettertree',
    description: '계정 설정 및 환경설정을 관리합니다.',
  });
};

export default SettingsPage;
