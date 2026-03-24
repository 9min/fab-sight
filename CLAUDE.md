# CLAUDE.md - FabSight 프로젝트 규칙

## 프로젝트 개요

AI 기반 반도체 공정 데이터 분석 대시보드. 대용량 시계열 센서 데이터와 AI 이상 탐지 모델 결과를 시각화하여, 엔지니어가 공정 이상 원인을 빠르게 분석하고 대응할 수 있도록 지원한다.

## 기술 스택

- **프론트엔드**: Vite + React + TypeScript
- **백엔드(BaaS)**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **CSS**: Tailwind CSS
- **상태 관리**: Zustand (클라이언트 상태) + TanStack Query (서버 상태)
- **차트**: ECharts (echarts-for-react)
- **린트/포매팅**: Biome
- **테스트**: Vitest
- **배포**: Vercel (프론트엔드), Supabase (백엔드)
- **패키지 매니저**: pnpm
- **버전 관리**: Git (GitHub Flow)

## 핵심 규칙

### 언어

- 코드 내 주석, 커밋 메시지, PR 설명 등 모든 문서는 **한국어**로 작성한다.

### 코드 스타일

- Biome 설정을 따른다. (`biome.json` 참조)
- TypeScript strict 모드를 사용한다.
- `any` 타입 사용을 금지한다. 불가피한 경우 `unknown`을 사용하고 타입 가드를 적용한다.
- 함수형 컴포넌트와 훅을 사용한다. 클래스 컴포넌트는 사용하지 않는다.
- 네이밍 컨벤션:
  - 컴포넌트: `PascalCase`
  - 함수/변수: `camelCase`
  - 상수: `UPPER_SNAKE_CASE`
  - 타입/인터페이스: `PascalCase`
  - 파일명: 컴포넌트는 `PascalCase.tsx`, 그 외는 `camelCase.ts`

### 커밋 및 푸시

- **작업 완료 후 커밋/푸시는 직접 요청받았을 때만 진행한다.** 명시적 요청 없이 자동으로 커밋하거나 푸시하지 않는다.

### 브랜치 전략

- GitHub Flow 기반: `main`(또는 `master`) → `feature/*`, `fix/*`, `hotfix/*`
- **`main` 또는 `master` 브랜치에 직접 커밋하거나 푸시하는 것은 절대 금지한다.** 어떤 상황에서도 예외 없이 반드시 feature 브랜치를 생성한 후 PR을 통해 머지한다.
- 작업 시작 전 현재 브랜치를 반드시 확인한다. `main` 또는 `master` 브랜치에 있다면 즉시 작업 브랜치로 전환한다.
- `git push --force` 및 프로덕션 브랜치(`main`, `master`)로의 직접 푸시는 사용하지 않는다.

### 커밋 컨벤션

- Gitmoji + Conventional Commits 형식
- 예: `✨ feat: 사용자 로그인 기능 추가`
- 예: `🐛 fix: 토큰 만료 시 리다이렉트 오류 수정`

### 테스트 (TDD)

- **TDD(Test-Driven Development) 방식으로 개발한다.** 테스트 코드를 먼저 작성한 후 구현 코드를 작성한다.
- TDD 사이클: Red(실패하는 테스트 작성) → Green(테스트를 통과하는 최소 구현) → Refactor(코드 개선)
- 새로운 기능에는 반드시 테스트 코드를 포함한다.
- Vitest를 사용하며, 테스트 파일은 `*.test.ts` 또는 `*.test.tsx` 형식을 따른다.

### Supabase 사용 규칙

- Supabase 클라이언트는 `lib/supabase.ts`에서 단일 인스턴스로 생성하여 사용한다.
- SPA에서는 `createClient`를 사용한다. SSR 도입 시 클라이언트 구분은 [project-structure.md](docs/project-structure.md)를 참조한다.
- 데이터베이스 접근은 반드시 RLS(Row Level Security) 정책을 통해 보호한다.
- 직접 SQL보다 Supabase Client 메서드(`.from().select()` 등)를 우선 사용한다.
- 복잡한 비즈니스 로직은 Edge Functions 또는 Database Functions(RPC)로 처리한다.

### 보안

- **기능 개발 시 보안 검토를 필수로 수행한다.** 구현 완료 후 보안 체크리스트를 점검한다.
- 환경변수로 시크릿을 관리한다. 코드에 하드코딩 금지.
- `SUPABASE_URL`과 `SUPABASE_ANON_KEY`는 클라이언트에 노출 가능하지만, `SERVICE_ROLE_KEY`는 서버 측에서만 사용한다.
- 사용자 입력은 반드시 검증하고 새니타이즈한다.
- OWASP Top 10을 준수한다.
- 모든 테이블에 RLS 정책을 활성화한다.
- 보안 관련 상세 체크리스트는 [security-guide.md](docs/security-guide.md)를 참조한다.

### 에러 처리

- 프론트엔드: Error Boundary + try-catch 패턴
- Supabase: `{ data, error }` 패턴으로 에러를 처리한다. `error`를 항상 확인한다.

### 프로젝트 고유 규칙

- ECharts는 Canvas 렌더링을 우선 사용한다. SVG 렌더러는 특별한 사유가 없으면 사용하지 않는다.
- 차트 컴포넌트에는 `React.memo`와 `useCallback`을 적용하여 불필요한 리렌더링을 방지한다.
- Mock 데이터는 `src/mocks/` 디렉토리에서 관리한다. MVP 단계에서는 Mock 데이터를 사용하고, 추후 Supabase로 전환한다.
- 대용량 시계열 데이터(1만 건 이상) 렌더링 시 LTTB 다운샘플링을 적용한다.

## 상세 문서 참조

각 항목에 대한 상세 내용은 아래 문서를 참조한다.

| 문서 | 설명 |
|------|------|
| [docs/prd.md](docs/prd.md) | 제품 요구사항 문서 (PRD) |
| [docs/git-workflow.md](docs/git-workflow.md) | Git 워크플로우 및 브랜치 전략 |
| [docs/commit-convention.md](docs/commit-convention.md) | 커밋 메시지 컨벤션 |
| [docs/project-structure.md](docs/project-structure.md) | 프로젝트 폴더 구조 가이드 |
| [docs/lint-config.md](docs/lint-config.md) | Biome 린트/포매팅 설정 |
| [docs/design-guide.md](docs/design-guide.md) | 디자인 가이드 (UI 컨벤션 + 디자인 시스템) |
| [docs/testing-guide.md](docs/testing-guide.md) | 테스트 코드 가이드 |
| [docs/security-guide.md](docs/security-guide.md) | 보안 가이드 |
| [docs/cicd-guide.md](docs/cicd-guide.md) | CI/CD 설정 가이드 |
| [docs/code-review-checklist.md](docs/code-review-checklist.md) | 코드 리뷰 체크리스트 |
| [docs/error-handling.md](docs/error-handling.md) | 에러 핸들링 가이드 |
| [docs/dev-environment.md](docs/dev-environment.md) | 개발 환경 셋업 가이드 |
| [docs/state-management.md](docs/state-management.md) | 상태 관리 전략 |
| [docs/performance-guide.md](docs/performance-guide.md) | 성능 최적화 가이드 |
| [docs/data-modeling.md](docs/data-modeling.md) | 데이터 모델링 가이드 |
| [docs/maintainability-guide.md](docs/maintainability-guide.md) | 유지보수 가이드 (아키텍처·설계 원칙) |
