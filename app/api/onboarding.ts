import { redirect } from 'react-router';

import { auth } from '@/lib/auth/auth-server';
import { OnboardingRepository } from '@/common/repositories/onboarding.repository';

import type { Route } from './+types/onboarding';

export async function action({ request }: Route.ActionArgs) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    throw redirect('/auth/sign-in');
  }
  const formData = await request.formData();
  const userId = formData.get('userId');

  if (!userId || typeof userId !== 'string') {
    throw new Error('userId is required');
  }
  const isSuccess = await OnboardingRepository.update(request, userId);

  return { success: isSuccess };
}
