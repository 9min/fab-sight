# PRD - Amfibian Lite

## 1. 프로젝트 개요

- **목적**: 반도체 장비(Etcher/CVD)에서 발생하는 대용량 시계열 센서 데이터와 AI 이상 탐지(Anomaly Detection) 모델의 결과를 시각화하여, 엔지니어가 공정 이상 원인을 빠르게 분석하고 대응할 수 있도록 지원하는 웹 대시보드.
- **해결하는 문제**: 1만 건 이상의 대용량 시계열 데이터를 지연 없이 렌더링하고, AI 모델 예측 결과를 직관적으로 시각화하여 공정 이상 원인 분석 시간을 단축한다.
- **기대 효과**: 공정 이상 탐지 → 원인 분석 → 대응까지의 전체 사이클 시간 감소, 엔지니어의 데이터 기반 의사결정 지원.

## 2. 목표 사용자

- **주요 사용자**: 반도체 공정 엔지니어 (Etcher/CVD 장비 담당)
- **사용자 특성**: 공정 데이터에 대한 도메인 지식이 있으며, 센서 데이터의 이상 패턴을 파악하여 빠르게 대응해야 하는 역할. 복잡한 다변량 데이터를 동시에 분석하는 데 익숙하다.

## 3. 핵심 기능

- [ ] **시계열 공정 데이터 메인 대시보드**: 선택된 공정(Lot/Wafer)의 센서 데이터(온도, 압력, RF Power 등)를 시간에 따라 선형 차트로 표시. 다중 Y축, 줌인/줌아웃, 패닝, 브러시 확대 기능 제공.
- [ ] **AI 모델 결과 시각화**: AI 이상 탐지 모델의 예측 결과를 차트 위에 오버레이. 정상 공정 범위(Confidence Band) 표시, 이상 포인트 강조, 툴팁에 이상 점수 노출.
- [ ] **다변량 데이터 드릴다운 인터랙션**: 메인 차트에서 특정 시점 클릭 시, 해당 시점의 모든 센서 값을 방사형 차트(Radar Chart)로 표시하고, 원시 데이터를 테이블로 리스팅.
- [ ] **공정 비교 화면 (Compare Mode)**: Golden Lot 데이터와 현재 분석 중인 Lot 데이터를 겹쳐서 비교. 토글 활성화 시 Golden Lot이 점선으로 추가 렌더링.

## 4. 사용자 스토리

- 엔지니어로서 특정 Lot/Wafer의 센서 데이터를 시간순으로 확인하고 싶다. 그래서 공정 중 발생한 이상 구간을 빠르게 찾을 수 있다.
- 엔지니어로서 AI가 탐지한 이상 포인트와 이상 점수를 차트 위에서 직접 확인하고 싶다. 그래서 수동 모니터링 없이도 이상 징후를 놓치지 않을 수 있다.
- 엔지니어로서 이상 시점의 모든 센서 값을 한눈에 비교하고 싶다. 그래서 어떤 센서가 정상 범위를 벗어났는지 즉시 파악할 수 있다.
- 엔지니어로서 현재 Lot과 Golden Lot의 데이터를 겹쳐서 비교하고 싶다. 그래서 정상 공정과의 차이를 직관적으로 확인할 수 있다.

## 5. 기술 스택

- **프론트엔드**: Vite + React + TypeScript
- **백엔드**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **CSS**: Tailwind CSS
- **상태 관리**: Zustand (클라이언트 상태) + TanStack Query (서버 상태)
- **차트**: ECharts (echarts-for-react)
- **린트/포매팅**: Biome
- **테스트**: Vitest
- **패키지 매니저**: pnpm
- **배포**: Vercel (프론트엔드) + Supabase (백엔드)

## 6. 데이터 모델

```typescript
// 개별 시점의 센서 및 AI 예측 데이터 구조
export interface ProcessDataPoint {
  timestamp: string; // ISO 8601 string
  temperature: number; // 단위: °C
  pressure: number; // 단위: Torr
  rfPower: number; // 단위: W
  isAnomaly: boolean; // AI 이상 감지 여부
  anomalyScore: number; // 0.0 ~ 1.0
}

// 전체 공정(Lot) 데이터 묶음
export interface LotData {
  lotId: string;
  waferId: string;
  recipeName: string;
  startTime: string;
  endTime: string;
  data: ProcessDataPoint[]; // 최소 10,000개 이상
}
```

## 7. UI/UX 레이아웃

화면은 SPA 형태로 3개 영역으로 구성:

1. **Top Navigation Bar**: 프로젝트 로고, Lot/Wafer 선택 Dropdown, Compare Mode Toggle
2. **Left Sidebar (Filter Panel)**: 기간 선택 (Date Range Picker), 센서 선택 체크박스, AI 이상 탐지 표시 여부 Toggle
3. **Main Content Area (Split View)**:
   - [상단 60%] 메인 시계열 차트 (ECharts, 줌/패닝)
   - [하단 40%] 드릴다운 패널 (좌: Radar Chart / 우: Parameter Data Table)

## 8. 비기능 요구사항

- **성능**: 1만 건 이상 시계열 데이터의 지연 없는 렌더링. Canvas 기반 렌더링, LTTB 다운샘플링 적용.
- **보안**: Supabase RLS 정책 적용, 환경변수로 시크릿 관리, 사용자 입력 검증.
- **접근성**: 키보드 네비게이션, 시맨틱 HTML, 차트 대체 텍스트 제공.

## 9. 성능 최적화 전략

1. **Canvas 렌더링 우선**: SVG 대신 Canvas로 수만 개의 DOM 노드 생성 방지.
2. **React.memo / useCallback 적용**: ECharts 컴포넌트 불필요 리렌더링 방지.
3. **ECharts `appendData` 활용**: 청크 단위 비동기 데이터 로딩으로 초기 로딩 속도 개선.
4. **Data Downsampling (LTTB)**: 줌아웃 시 데이터 축소, 줌인 시 원본 데이터 렌더링.

## 10. 마일스톤

- **v0.1 MVP**: 메인 시계열 대시보드 + AI 이상탐지 시각화 + Mock 데이터 기반 동작
- **v0.2**: 드릴다운 인터랙션 + 공정 비교 모드
- **v1.0 정식 출시**: Supabase 연동, 실 데이터 기반 동작, 성능 최적화 완료
