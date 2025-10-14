import React from 'react';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createAuthMiddleware } from 'better-auth/plugins';
import { localization } from 'better-auth-localization';

import { db } from '@/db';
import * as schema from '@/features/auth/schema';
import { sendEmail } from '@/lib/email/send';
// import { type Plan, plans } from '@/lib/payments/plans';

async function generateUniqueLettertreeEmail(userName: string): Promise<string> {
  const baseEmail = `${userName}@lettertr.ee`;
  const existingBase = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.lettertreeEmail, baseEmail))
    .limit(1);

  if (existingBase.length === 0) {
    return baseEmail;
  }
  const random = crypto.randomUUID().slice(0, 6);

  return `${userName}.${random}@lettertr.ee`;
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
    schema,
  }),
  user: {
    changeEmail: {
      enabled: false, // Disable email change to preserve lettertree email
    },
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      lettertreeEmail: {
        type: 'string',
        required: false,
        defaultValue: '',
      },
      region: {
        type: 'string',
        required: false,
        defaultValue: 'ROW',
      },
      isOnboarded: {
        type: 'boolean',
        required: false,
        defaultValue: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: 'Lettertree 비밀번호 재설정',
        heading: '비밀번호를 재설정해주세요.',
        content: React.createElement(
          React.Fragment,
          null,
          React.createElement(
            'p',
            null,
            '누군가 비밀번호 재설정을 요청했습니다. 본인이 맞다면 아래 버튼을 클릭하여 비밀번호를 재설정해주세요.',
          ),
          React.createElement(
            'p',
            null,
            '버튼이 작동하지 않는다면, 아래 링크를 클릭하여 비밀번호를 재설정해주세요.',
          ),
          React.createElement('p', null, url),
        ),
        url,
        action: '비밀번호 재설정',
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: 'Lettertree 회원가입을 환영합니다! 📨',
        heading: '이메일 주소를 인증해주세요.',
        content: React.createElement(
          React.Fragment,
          null,
          React.createElement('p', null, '회원가입을 진행해주셔서 감사합니다.'),
          React.createElement('p', null, '아래 버튼을 클릭하여 이메일 주소 인증을 완료해주세요.'),
          React.createElement(
            'p',
            null,
            '버튼이 작동하지 않는다면, 아래 링크를 클릭하여 이메일 주소 인증을 완료해주세요.',
          ),
          React.createElement('p', null, url),
        ),
        url,
        action: '이메일 주소 인증',
      });
    },
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const newSession = ctx.context?.newSession;

      if (!newSession?.user) return;
      const userId = newSession.user.id;

      try {
        const existingUser = await db
          .select({ lettertreeEmail: schema.users.lettertreeEmail })
          .from(schema.users)
          .where(eq(schema.users.id, userId))
          .limit(1);

        if (existingUser[0]?.lettertreeEmail) {
          console.log(
            `User ${userId} already has lettertree email: ${existingUser[0].lettertreeEmail}`,
          );
          return;
        }
        const userName = newSession.user.email?.split('@')[0] || 'user';
        const lettertreeEmail = await generateUniqueLettertreeEmail(userName);

        await db
          .update(schema.users)
          .set({
            lettertreeEmail,
            updatedAt: new Date(),
          })
          .where(eq(schema.users.id, userId));

        console.log(
          `✅ Assigned lettertree email ${lettertreeEmail} to user ${userId} via ${ctx.path}`,
        );
      } catch (error) {
        console.error(`❌ Failed to assign lettertree email to user ${userId}:`, error);
      }
    }),
  },
  // FIXME: 계정, 이메일, 이름 수정했더니 좌측 하단 바로 안 바뀌길래 너무 여러 곳에서 이슈가 있는 듯 하여 주석처리함 나중에 세부적으로 설정 필요
  // session: {
  //   cookieCache: {
  //     enabled: true,
  //     maxAge: 5 * 60, // Cache duration in seconds
  //   },
  // },
  plugins: [
    localization({
      defaultLocale: 'ko',
      fallbackLocale: 'default',
      translations: {
        ko: {
          // @ts-ignore
          USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: '이미 존재하는 이메일 주소입니다.',
        },
      },
    }),
  ],
});

export type AuthUser = (typeof auth.$Infer.Session)['user'];
