import type { ReactNode } from 'react';
import { Resend } from 'resend';
import { EmailTemplate } from '@daveyplate/better-auth-ui/server';

import { site } from '@/config/site';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  to,
  subject,
  heading,
  content,
  url,
  action,
}: {
  to: string;
  subject: string;
  heading: string;
  content: ReactNode;
  url: string;
  action: string;
}) => {
  await resend.emails.send({
    from: `${site.name} <support@lettertr.ee>`,
    to,
    subject,
    react: EmailTemplate({
      heading,
      content,
      action,
      url,
      siteName: site.name,
      baseUrl: process.env.VITE_PUBLIC_APP_URL,
      imageUrl: `${process.env.VITE_PUBLIC_APP_URL}/email_logo.png`,
    }),
  });
};
