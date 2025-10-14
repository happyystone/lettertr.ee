// Docs: https://www.better-auth.com/docs/plugins/polar
import { auth } from '@/lib/auth/auth-server';
import { authClient } from '@/lib/auth/auth-client';

export async function getActiveSubscription(request: Request): Promise<{
  status: boolean;
  message?: string;
  subscription: any | null;
}> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return {
      status: false,
      message: 'You need to be logged in.',
      subscription: null,
    };
  }

  try {
    // Use Polar's customer state API to get subscription info
    // @ts-expect-error
    const { data: activeSub } = await authClient.customer.subscriptions.list({
      query: {
        page: 1,
        limit: 10,
        active: true,
      },
    });

    console.log(activeSub);

    return {
      subscription: activeSub ?? null,
      status: true,
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: 'Something went wrong.',
      subscription: null,
    };
  }
}

export async function updateExistingSubscription(
  request: Request,
  subId: string,
  newProductSlug: string,
): Promise<{ status: boolean; message: string }> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return {
      status: false,
      message: 'You need to be logged in.',
    };
  }

  if (!subId || !newProductSlug) {
    return {
      status: false,
      message: 'Invalid parameters.',
    };
  }

  try {
    // With Polar, subscription updates are typically handled through checkout
    // Trigger a new checkout for the new product/plan
    // @ts-expect-error
    const checkoutResult = await authClient.checkout({
      products: [subId],
      slug: newProductSlug,
    });

    console.log(checkoutResult);

    return {
      status: true,
      message: 'Subscription update initiated. Please complete the checkout.',
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: 'Something went wrong while updating the subscription.',
    };
  }
}
