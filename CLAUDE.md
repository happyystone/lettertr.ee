# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Router v7 full-stack application built for newsletter management and discovery (Lettertree). It uses TypeScript, Tailwind CSS, Shadcn UI, Supabase, and Drizzle ORM.

## Essential Commands

### Development

```bash
npm run dev              # Start dev server at http://localhost:5173
npm run build           # Build for production
npm run start           # Start production server
npm run typecheck       # Run TypeScript type checking
```

### Database Management

```bash
npm run db:generate     # Generate Drizzle migrations
npm run db:migrate      # Run database migrations
npm run db:studio       # Open Drizzle Studio for DB management
npm run db:typegen      # Generate TypeScript types from Supabase
```

### Testing Single Features

- Navigate to specific routes: `/discover`, `/letters`, `/dashboard`
- Use React DevTools for component inspection
- Check Network tab for loader/action responses

## Architecture & Code Structure

### High-Level Architecture

- **React Router v7**: Modern file-based routing with loaders/actions pattern
- **Server-Side Rendering**: Full SSR support with data prefetching
- **Database**: PostgreSQL via Supabase with Drizzle ORM
- **Authentication**: Better-auth integration
- **State Management**: Server state via loaders/actions, client state via React hooks

### Directory Structure

```
app/
├── routes.ts               # Route definitions (imports from features/*/routes/)
├── api/                    # External API webhooks only
│   └── webhook.email.tsx   # Email webhook handler
├── common/                 # Shared across features
│   ├── components/ui/      # Shadcn UI components
│   ├── hooks/             # Common React hooks
│   ├── pages/             # Common pages
│   └── utils/             # Utility functions
├── features/              # Feature-based organization
│   └── [feature]/
│       ├── routes/        # React Router v7 route files
│       ├── pages/         # Feature-specific pages
│       ├── components/    # Feature components
│       ├── services/      # Business logic layer
│       ├── repositories/  # Data access layer (if needed)
│       ├── layouts/       # Feature layouts (if needed)
│       ├── hooks/         # Feature hooks (if needed)
│       ├── types/         # Type definitions (index.ts)
│       └── schema.ts      # Drizzle schema definitions
├── lib/                   # Application libraries
│   ├── auth/             # Authentication utilities
│   ├── payments/         # Payment utilities
│   └── utils.ts          # Global utilities
└── server/               # Server-side code
    └── db/              # Database configuration
```

### File Organization and Naming Conventions

#### 1. Route Files (`app/features/[feature]/routes/`)

- **Purpose**: React Router v7 route handlers with loader, action, meta functions
- **Naming**: Match URL structure
  - `discover.tsx` → `/discover`
  - `discover.$sourceId.tsx` → `/discover/:sourceId`
  - `discover.settings.tsx` → `/discover/settings`
- **Requirements**:
  - Must export `loader`, `action`, `meta` functions
  - Must export default page component (and export Errorboundary if exists)
  - Use `Route.LoaderArgs` and `Route.ActionArgs` types

#### 2. Page Components (`app/features/[feature]/pages/`)

- **Purpose**: Page components that receive props from route loaders
- **Naming**: `[feature]-[name]-page.tsx`
  - `discover-page.tsx`
  - `discover-detail-page.tsx`
  - `discover-settings-page.tsx`
  - `newsletter-list-page.tsx`
  - `newsletter-detail-page.tsx`
- **Rules**:
  - Receive data via props (`Route.ComponentProps`)
  - NO `useLoaderData()` or `useActionData()` hooks
  - Use kebab-case for file names
- **Type Definition Rules**:
  - ❌ NEVER use custom type names like `PageProps`, `DiscoverPageProps`, etc.
  - ✅ ALWAYS use `Route.ComponentProps` directly in component definition
  - Example:
    ```typescript
    // ❌ Wrong
    type PageProps = Route.ComponentProps;
    export default function DiscoverPage(props: PageProps) {}
    
    // ✅ Correct
    import type { Route } from '../routes/+types/discover';
    export default function DiscoverPage(props: Route.ComponentProps) {}
    ```

#### 3. External API Routes (`app/api/`)

- **Purpose**: External webhook handlers and API endpoints
- **Naming**: `[resource].[action].tsx`
  - `webhook.email.tsx`
  - `folders.tsx`
  - `newsletters.$id.tsx`
- **Note**: These are NOT page routes, only API handlers

#### 4. Feature Directory Structure

Each feature should maintain consistent subdirectory structure:

```
app/features/[feature]/
├── routes/        # Route handlers (mandatory if feature has routes)
├── pages/         # Page components (mandatory if feature has UI)
├── components/    # Feature-specific components
├── services/      # Business logic layer
├── repositories/  # Data access layer (optional)
├── layouts/       # Layout components (optional)
├── hooks/         # Custom hooks (optional)
├── types/         # Type definitions as index.ts (optional)
├── constants.ts   # Constants (optional)
└── schema.ts      # Database schema (optional)
```

#### 5. Standardization Guidelines

**Currently Inconsistent Areas to Fix:**

1. **discover feature**: Has `routes/` directory ✅ (correct pattern)
2. **newsletter feature**: Missing `routes/` directory, route files in root
3. **dashboard feature**: Missing `routes/` directory, route files in root
4. **auth feature**: Has `api/` subdirectory for auth endpoints
5. **marketing feature**: Missing `routes/` directory

**Type Files**:

- Use `types/index.ts` for type definitions (discover, newsletter ✅)
- Avoid `types.ts` in feature root

**Naming Patterns**:

- Pages: Always use `[feature]-[name]-page.tsx` format
- Routes: Match URL structure exactly
- Services: `[domain].service.ts`
- Repositories: `[entity].repository.ts`
- Components: PascalCase for component files

#### 6. Route Registration (`app/routes.ts`)

- Import ONLY from:
  - `app/features/[feature]/routes/*` for page routes
  - `app/api/*` for external API routes
- Use React Router v7 route helpers: `index`, `route`, `layout`, `prefix`

### Key Architectural Patterns

1. **Hybrid Data Loading**: Uses React Router's loader/action pattern for internal features, with capability to add API routes later
2. **Repository Pattern**: Data access abstracted through repository classes
3. **Service Layer**: Business logic separated from UI and data layers
4. **Optimistic UI**: Client-side state updates before server confirmation
5. **LRU Caching**: Performance optimization with cache invalidation patterns

## Critical Rules & Conventions

### MUST Follow (From .cursor/rules/)

1. **UI Component Imports**
   - ❌ NEVER import from `@radix-ui/*` directly
   - ✅ ALWAYS import from `@/common/components/ui/*` (Shadcn UI)

2. **React Router v7 Specifics**
   - ❌ NO `@remix-run` imports
   - ✅ Import from `react-router` instead
   - ❌ NO `useLoaderData()` or `useActionData()` in components
   - ✅ Components receive data via props: `Route.ComponentProps`
   - ❌ NO `json()` function usage
   - ✅ Return plain objects from loaders/actions
   - ❌ NO custom type aliases for `Route.ComponentProps` (like `PageProps`)
   - ✅ Use `Route.ComponentProps` directly in component signatures

3. **Page Requirements**
   - Every route file MUST export: `loader`, `action`, and `meta` functions
   - Use proper typing:
     ```typescript
     import type { Route } from './+types/[routename]';
     export async function loader({ request }: Route.LoaderArgs) {}
     export async function action({ request }: Route.ActionArgs) {}
     export const meta: Route.MetaFunction = () => {};
     ```

4. **Form Handling**
   - Client validation: Use `react-hook-form`
   - Server submission: Use `<Form>` or `<fetcher.Form>` from react-router

5. **Package Management**
   - MUST use `npm` (not yarn/pnpm/bun)

### Code Style Guidelines

- **TypeScript**: Strict typing required
- **Functional Components**: No class components
- **Early Returns**: Prefer guard clauses
- **Pure Functions**: Minimize side effects
- **Descriptive Naming**: Clear variable/function names over comments
- **한국어 응답**: Always respond in Korean when explaining code
- **Prettier 포맷팅**: 파일 생성/수정 시 항상 Prettier 포맷팅이 적용된 것처럼 작성
  - 파일 끝에 개행 문자 추가
  - 일관된 들여쓰기 (2 spaces)
  - 세미콜론 사용
  - 작은따옴표 사용 (JSX 속성 제외)
  - 후행 쉼표 사용 (ES5)

### Library Usage

- `date-fns`: Date/time handling
- `ts-pattern`: Pattern matching
- `react-use`: React hooks
- `es-toolkit`: Utilities
- `lucide-react`: Icons
- `zod`: Schema validation
- `tailwindcss`: Styling
- `supabase`: Backend services
- `drizzle-orm`: Database ORM

## Current Rule Violations to Fix

### 1. Route File Organization (최우선 순위)

**위반 현황:**

- **newsletter feature**: Route 파일들이 `routes/` 디렉토리 없이 root에 존재
- **dashboard feature**: Route 파일들이 `routes/` 디렉토리 없이 root에 존재
- **marketing feature**: Route 파일들이 `routes/` 디렉토리 없이 root에 존재
- **auth feature**: Route 파일들이 `routes/` 디렉토리 없이 root에 존재

**해결 방안:**
각 feature에 `routes/` 디렉토리 생성 후 route 파일 이동 필요

### 2. Route Files Naming (높은 우선순위)

- 모든 route 파일은 URL 구조와 일치하도록 네이밍

### 3. useLoaderData Usage (높은 우선순위)

**위반 파일들:**

- `/app/features/discover/pages/discover-page.tsx`
- `/app/features/discover/pages/discover-settings-page.tsx`
- `/app/features/discover/pages/discover-detail-page.tsx`

**문제:** `useLoaderData()` 사용 중
**해결:** Props로 데이터 받도록 수정 필요

### 4. json() Function Usage (높은 우선순위)

**위반 파일들:**

- `/app/features/discover/routes/discover.tsx`
- `/app/features/discover/routes/discover.$sourceId.tsx`
- `/app/features/discover/routes/discover.settings.tsx`

**문제:** `json()` 함수 사용 중
**해결:** Plain object return으로 변경 필요

### 5. Route Type Imports (높은 우선순위)

**문제:** `LoaderFunctionArgs`, `ActionFunctionArgs` from 'react-router' 사용
**해결:** `Route.LoaderArgs`, `Route.ActionArgs` from `./+types/...` 사용 필요

### 6. Missing meta Function (낮은 우선순위)

**위반 파일들:**

- `/app/features/discover/routes/discover.$sourceId.tsx`
- `/app/features/discover/routes/discover.settings.tsx`

**문제:** meta function export 누락
**해결:** 각 route에 meta function 추가 필요

### 7. API Routes Organization (중간 우선순위)

**현재:** `app/api/` 디렉토리에 여러 API 파일 존재
**개선:** External webhook만 `app/api/`에, 내부 API는 feature의 `api/` 디렉토리로 이동 고려

## Migration Roadmap

### Phase 1: Route Files Reorganization

1. Create `routes/` directories in each feature
2. Move route handlers from pages to routes directories
3. Update `app/routes.ts` imports

**Priority Order:**

1. `newsletter` feature (2 routes)
2. `dashboard` feature (6 routes)
3. `marketing` feature (1 route)
4. `auth` feature (1 route)

### Phase 2: Naming Convention Fixes

1. Rename page files to `[feature]-[name]-page.tsx` format
2. Update route file imports
3. Ensure consistent kebab-case naming

### Phase 3: Code Pattern Fixes

1. Replace `json()` with plain object returns
2. Replace `useLoaderData()` with props
3. Update type imports to use `Route.LoaderArgs`
4. Add missing `meta` functions

## Implementation Process

모든 작업은 다음 3단계를 순서대로 따라야 합니다:

### Phase 1: Codebase Exploration & Analysis

- 관련 파일 검색 및 분석
- 코딩 컨벤션 파악
- 의존성 및 패턴 문서화

### Phase 2: Implementation Planning

- 모듈별 구현 계획 수립
- 구체적인 작업 목록 작성
- 성공 기준 정의

### Phase 3: Implementation Execution

- 계획에 따른 구현
- 모든 성공 기준 검증
- 코드 컨벤션 준수 확인

## Database Schema Additions

새 테이블 추가 시:

1. SQL 쿼리를 `/sql/` 디렉토리에 저장
2. 터미널에서 실행할 수 있도록 제공
3. Drizzle schema 파일 업데이트

## Component Additions

새 Shadcn UI 컴포넌트 필요 시:

```bash
npx shadcn@latest add [component-name]
```

## Performance Considerations

- 캐싱: LRU 캐시 전략 사용 중
- 옵티미스틱 UI: 구독/좋아요 등 즉각 반응
- 병렬 데이터 로딩: Promise.all 활용
- 디바운싱: 검색 입력에 300ms 디바운스 적용
