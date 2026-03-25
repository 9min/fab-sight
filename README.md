# FabSight

반도체 공정 데이터를 한눈에 분석하는 AI 기반 대시보드

## 프로젝트 소개

FabSight는 반도체 장비에서 발생하는 센서 데이터(온도, 압력, 가스 유량 등)를 시각화하고, AI가 감지한 이상 패턴을 직관적으로 보여주는 웹 대시보드입니다.

공정 엔지니어가 이상 원인을 빠르게 파악하고 대응할 수 있도록, 대용량 시계열 데이터의 실시간 탐색과 다변량 분석 기능을 제공합니다.

> 현재 MVP 단계로, Mock 데이터 기반으로 동작합니다.

## 주요 기능

- **시계열 센서 차트** — 다중 Y축으로 단위가 다른 센서 데이터를 한 화면에 표시. 줌/패닝으로 원하는 구간 탐색
- **AI 이상 탐지 시각화** — AI가 감지한 이상 포인트를 차트 위에 마커로 표시. 이상 유형(드리프트, 스파이크 등) 구분
- **드릴다운 분석** — 차트에서 특정 시점 클릭 시, 레이더 차트와 파라미터 테이블로 상세 분석
- **Golden Lot 비교** — 기준이 되는 정상 공정 데이터와 현재 데이터를 겹쳐서 비교
- **Wafer-to-Wafer 비교** — 같은 로트(제조 단위) 내 웨이퍼 간 균일도 비교
- **Spec Limit 표시** — 공정 규격 한계선(허용 범위)을 차트에 오버레이
- **용어사전** — 반도체 공정 용어를 인라인 툴팁과 Drawer로 설명
- **반응형 레이아웃** — 모바일부터 데스크톱까지 대응

## 기술 스택

| 카테고리 | 기술 |
|---------|------|
| 프론트엔드 | React 19 + TypeScript + Vite |
| 스타일링 | Tailwind CSS |
| 상태 관리 | Zustand (클라이언트) + TanStack Query (서버) |
| 차트 | ECharts (Canvas 렌더링) |
| 백엔드 | Supabase (PostgreSQL, Auth, Storage) |
| 테스트 | Vitest + Testing Library |
| 린트/포매팅 | Biome |
| 배포 | Vercel (프론트엔드) + Supabase (백엔드) |

## 시작하기

### 1. 사전 요구사항

- [Node.js](https://nodejs.org/) >= 20 (LTS)
- [pnpm](https://pnpm.io/) >= 9
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Supabase 로컬 실행용)
- [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started)

### 2. 저장소 클론 및 의존성 설치

```bash
git clone https://github.com/9min/fab-sight.git
cd fab-sight
pnpm install
```

### 3. 환경변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 파일을 열고 Supabase 정보를 입력합니다:

```
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=<Supabase 로컬 anon key>
```

> 로컬 Supabase를 사용하는 경우, `npx supabase start` 실행 후 출력되는 `anon key`를 입력하세요.

### 4. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 `http://localhost:5173`으로 접속하면 대시보드를 확인할 수 있습니다.

## 주요 스크립트

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 실행 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm preview` | 빌드 결과 미리보기 |
| `pnpm test` | 테스트 실행 |
| `pnpm test:watch` | 테스트 감시 모드 |
| `pnpm test:coverage` | 테스트 커버리지 리포트 |
| `pnpm lint` | Biome 린트 검사 |
| `pnpm lint:fix` | Biome 자동 수정 |
| `pnpm format` | 코드 포매팅 |
| `pnpm type-check` | TypeScript 타입 검사 |

## 프로젝트 구조

```
src/
├── app/            # 앱 진입점 (App.tsx)
├── components/     # UI 컴포넌트
│   ├── charts/     #   차트 (TimeSeriesChart, RadarChart)
│   ├── drilldown/  #   드릴다운 패널
│   ├── glossary/   #   용어사전
│   ├── icons/      #   SVG 아이콘
│   ├── layout/     #   레이아웃 (TopNav, Sidebar, MainContent)
│   └── ui/         #   공통 UI (ToggleButton, SegmentedControl 등)
├── constants/      # 상수 (센서 설정, 차트 설정, 용어사전)
├── hooks/          # 커스텀 훅
├── lib/            # 라이브러리 설정 (Supabase 클라이언트)
├── mocks/          # Mock 데이터
├── pages/          # 페이지 컴포넌트
├── services/       # 비즈니스 로직
├── stores/         # Zustand 상태 관리
├── types/          # TypeScript 타입 정의
└── utils/          # 유틸리티 함수 (다운샘플링 등)
```

## 문서

| 문서 | 설명 |
|------|------|
| [CLAUDE.md](CLAUDE.md) | 개발 규칙 및 코딩 컨벤션 |
| [docs/prd.md](docs/prd.md) | 제품 요구사항 문서 (PRD) |
| [docs/project-structure.md](docs/project-structure.md) | 프로젝트 폴더 구조 가이드 |
| [docs/design-guide.md](docs/design-guide.md) | 디자인 시스템 |
| [docs/testing-guide.md](docs/testing-guide.md) | 테스트 가이드 |
| [docs/dev-environment.md](docs/dev-environment.md) | 개발 환경 셋업 |
| [docs/git-workflow.md](docs/git-workflow.md) | Git 워크플로우 |
| [docs/security-guide.md](docs/security-guide.md) | 보안 가이드 |

## 라이선스

MIT
