import { redirect } from 'react-router';
import { auth } from '@/lib/auth/auth-server';
import type { Session, User } from 'better-auth';

export interface AuthenticatedUser extends User {
  session: Session;
}

/**
 * Authenticator 서비스 - Better Auth 기반 인증 처리
 */
export const authenticator = {
  /**
   * 사용자가 인증되었는지 확인하고 사용자 정보를 반환
   * @param request - Request 객체
   * @param options - 인증 옵션
   * @returns 인증된 사용자 정보 또는 리다이렉트
   */
  async isAuthenticated(
    request: Request,
    options?: {
      failureRedirect?: string;
      successRedirect?: string;
    },
  ): Promise<AuthenticatedUser | null> {
    try {
      // Better Auth 세션 확인
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      // 세션이 없는 경우
      if (!session) {
        throw redirect(options?.failureRedirect || '/auth/sign-in');
      }

      // 세션이 있는 경우
      const authenticatedUser: AuthenticatedUser = {
        ...session.user,
        session: session.session,
      };

      // 성공 리다이렉트가 설정된 경우
      if (options?.successRedirect) {
        throw redirect(options.successRedirect);
      }

      return authenticatedUser;
    } catch (error) {
      // redirect throw는 그대로 전파
      if (error instanceof Response) {
        throw error;
      }

      // 기타 에러 처리
      console.error('Authentication error:', error);

      throw redirect(options?.failureRedirect || '/auth/sign-in');
    }
  },

  /**
   * 로그아웃 처리
   * @param request - Request 객체
   * @param redirectTo - 로그아웃 후 리다이렉트할 경로
   */
  async logout(request: Request, redirectTo: string = '/'): Promise<Response> {
    try {
      // Better Auth 로그아웃
      await auth.api.signOut({
        headers: request.headers,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }

    // 로그아웃 후 리다이렉트
    return redirect(redirectTo);
  },

  /**
   * 사용자 정보만 가져오기 (리다이렉트 없음)
   * @param request - Request 객체
   * @returns 사용자 정보 또는 null
   */
  async getUser(request: Request): Promise<User | null> {
    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      return session?.user || null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  },

  /**
   * 세션 정보 가져오기
   * @param request - Request 객체
   * @returns 세션 정보 또는 null
   */
  async getSession(request: Request): Promise<Session | null> {
    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      return session?.session || null;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  },

  /**
   * 인증 필수 체크 (인증되지 않은 경우 에러 발생)
   * @param request - Request 객체
   * @returns 인증된 사용자 정보
   */
  async requireAuth(request: Request): Promise<AuthenticatedUser> {
    const user = await this.isAuthenticated(request);

    if (!user) {
      throw new Response('Unauthorized', { status: 401 });
    }

    return user;
  },

  /**
   * 특정 역할이 있는지 확인
   * @param request - Request 객체
   * @param role - 확인할 역할
   * @returns 역할 보유 여부
   */
  async hasRole(request: Request, role: string): Promise<boolean> {
    const user = await this.getUser(request);

    if (!user) {
      return false;
    }

    // Better Auth의 역할 시스템을 사용하는 경우
    // 실제 구현은 프로젝트의 역할 관리 방식에 따라 조정 필요
    // @ts-expect-error FIXME: 역할 시스템 구현 필요
    return user.role === role;
  },

  /**
   * 관리자 권한 확인
   * @param request - Request 객체
   * @returns 관리자 여부
   */
  async isAdmin(request: Request): Promise<boolean> {
    // FIXME: 역할 시스템 구현 필요
    return this.hasRole(request, 'admin');
  },
};

// 타입 내보내기
export type { User, Session } from 'better-auth';
