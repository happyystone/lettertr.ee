import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1';

import * as authSchema from '@/features/auth/schema';
import * as feedSchema from '@/features/newsletter/schema';
import * as marketingSchema from '@/features/marketing/schema';

// // 모든 스키마를 하나로 합칩니다.
const schema = {
  ...authSchema,
  ...feedSchema,
  ...marketingSchema,
};

// // Drizzle 인스턴스의 전체 타입을 정의하여 자동 완성을 지원합니다.
export type DB = DrizzleD1Database<typeof schema>;

// DB 인스턴스를 저장할 싱글톤(singleton) 변수입니다.
// 앱 전체에서 하나의 DB 인스턴스만 존재하도록 관리합니다.
let dbInstance: DB | null = null;

/**
 * 워커의 fetch 핸들러에서 D1 바인딩을 받아 DB 인스턴스를 초기화합니다.
 * 한 번 초기화된 후에는 기존 인스턴스를 계속 반환합니다. (싱글톤 패턴)
 * @param d1Binding - Cloudflare 워커의 env에서 받은 D1 바인딩.
 * @returns 초기화된 Drizzle DB 인스턴스.
 */
export function initializeDb(d1Binding: D1Database): DB {
  if (dbInstance) {
    return dbInstance;
  }
  dbInstance = drizzle(d1Binding);
  return dbInstance;
}

/**
 * 다른 파일에서 'import { db } from "@/db"'를 통해 사용할 DB 프록시 객체입니다.
 * 이 객체의 속성에 접근하려고 할 때마다 dbInstance가 초기화되었는지 확인합니다.
 * 이를 통해 DB가 초기화되기 전에 접근하는 것을 막고, 명확한 에러를 발생시킵니다.
 */
const handler: ProxyHandler<DB> = {
  get(target, prop) {
    if (!dbInstance) {
      throw new Error(
        'Database has not been initialized. Make sure to call initializeDb() in your Cloudflare Worker entrypoint before using the db object.',
      );
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return dbInstance[prop];
  },
};

export const db = new Proxy<DB>({} as DB, handler);

// export const db = drizzle<typeof schema>(process.env.LETTERTREE_BINDING);
