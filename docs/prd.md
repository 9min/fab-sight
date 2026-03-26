# PRD - FabSight

## 1. 프로젝트 개요

- **목적**: 반도체 장비(Etcher/CVD)에서 발생하는 대용량 시계열 센서 데이터와 AI 이상 탐지(Anomaly Detection) 모델의 결과를 시각화하여, 엔지니어가 공정 이상 원인을 빠르게 분석하고 대응할 수 있도록 지원하는 웹 대시보드.
- **해결하는 문제**: 1만 건 이상의 대용량 시계열 데이터를 지연 없이 렌더링하고, AI 모델 예측 결과를 직관적으로 시각화하여 공정 이상 원인 분석 시간을 단축한다.
- **기대 효과**: 공정 이상 탐지 → 원인 분석 → 대응까지의 전체 사이클 시간 감소, 엔지니어의 데이터 기반 의사결정 지원.

## 2. 목표 사용자

- **주요 사용자**: 반도체 공정 엔지니어 (Etcher/CVD 장비 담당)
- **사용자 특성**: 공정 데이터에 대한 도메인 지식이 있으며, 센서 데이터의 이상 패턴을 파악하여 빠르게 대응해야 하는 역할. 복잡한 다변량 데이터를 동시에 분석하는 데 익숙하다.

## 3. 핵심 기능

- [ ] **시계열 공정 데이터 메인 대시보드**: 선택된 공정(Lot/Wafer)의 다변량 센서 데이터를 시간에 따라 선형 차트로 표시. 다중 Y축, 줌인/줌아웃, 패닝, 브러시 확대 기능 제공. X축은 wall clock과 경과 시간(elapsed time) 모드를 전환할 수 있다. 레시피 스텝 경계를 차트에 수직선으로 표시한다.
- [ ] **Spec Limit 표시**: 센서별 관리 한계선(USL/LSL, UCL/LCL)을 차트에 수평선으로 표시하여, 이상 심각도를 Spec Limit과의 거리로 직관적으로 판단할 수 있도록 한다.
- [ ] **AI 모델 결과 시각화**: AI 이상 탐지 모델의 예측 결과를 차트 위에 오버레이. 이상 포인트 강조, 이상 유형(Drift/Spike/Shift/Oscillation) 분류 표시, 툴팁에 이상 점수 및 유형 노출.
- [ ] **다변량 데이터 드릴다운 인터랙션**: 메인 차트에서 특정 시점 클릭 시, 해당 시점의 모든 센서 값을 방사형 차트(Radar Chart)로 표시하고, 원시 데이터를 테이블로 리스팅.
- [ ] **공정 비교 화면 (Compare Mode)**: Golden Lot 데이터와 현재 분석 중인 Lot 데이터를 겹쳐서 비교. 토글 활성화 시 Golden Lot이 점선으로 추가 렌더링. 비교는 동일 레시피/스텝 기준으로 elapsed time 축에서 수행한다.
- [ ] **Wafer-to-Wafer 비교**: 같은 Lot 내 Wafer 간 센서 트렌드를 겹쳐서 비교하여, 이상이 특정 Wafer에 국한되는지 Lot 전체에 해당하는지 판별할 수 있다.
- [ ] **R2R/APC Lot-to-Lot 트렌딩 뷰**: 챔버별 연속 Run의 특정 센서·스텝 평균값을 시계열로 표시. UCL/LCL 관리 한계선과 ±2σ 통계 밴드를 오버레이하여 공정 드리프트를 조기 감지한다. R2R 조정값(보정량)과 공정 결과 메트릭(막 두께, 균일도, 결함 수)을 하단 패널에 함께 표시하여 APC(Advanced Process Control) 피드백 효과를 확인할 수 있다.
- [ ] **용어사전 (Glossary)**: 반도체 공정 용어를 인라인 툴팁과 우측 Drawer로 제공. 엔지니어가 대시보드에서 용어를 즉시 확인할 수 있도록 지원한다.

## 4. 사용자 스토리

- 엔지니어로서 특정 Lot의 특정 Wafer에 대한 센서 데이터를 시간순으로 확인하고 싶다. 그래서 공정 중 발생한 이상 구간을 빠르게 찾을 수 있다.
- 엔지니어로서 AI가 탐지한 이상 포인트의 점수와 유형(Drift/Spike/Shift 등)을 차트 위에서 직접 확인하고 싶다. 그래서 이상 유형에 따라 적절한 대응 조치를 즉시 결정할 수 있다.
- 엔지니어로서 이상 시점의 모든 센서 값을 한눈에 비교하고, Spec Limit과의 거리를 확인하고 싶다. 그래서 어떤 센서가 관리 한계를 벗어났는지 즉시 파악할 수 있다.
- 엔지니어로서 현재 Lot과 Golden Lot의 데이터를 같은 레시피 스텝 기준으로 겹쳐서 비교하고 싶다. 그래서 정상 공정과의 차이를 직관적으로 확인할 수 있다.
- 엔지니어로서 같은 Lot 내 Wafer 간 데이터를 비교하고 싶다. 그래서 이상이 몇 번째 Wafer부터 시작됐는지 파악할 수 있다.
- 엔지니어로서 장비/챔버 기준으로 데이터를 필터링하고 싶다. 그래서 특정 챔버에서 반복되는 이상 패턴을 추적할 수 있다.

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

### FAB 데이터 계층 구조

실제 반도체 FAB의 데이터 계층을 반영한다.

```
Equipment (장비)
  └─ Chamber (챔버, 장비당 2~6개)
      └─ Recipe (레시피 = 공정 조건 세트)
          └─ RecipeStep (레시피 내 단계, 3~20개)
          └─ Lot (로트 = 웨이퍼 묶음, 보통 25장)
              └─ Wafer (개별 웨이퍼)
                  └─ WaferRun (1회 공정 실행)
                      └─ ProcessDataPoint (센서 값, 1초 또는 서브초 간격)
```

### 핵심 TypeScript 인터페이스

```typescript
/** 장비 */
export interface Equipment {
  equipmentId: string;
  name: string;            // 예: "CVD-01", "ETCH-03"
  type: ProcessType;
  chambers: Chamber[];
}

/** 챔버 */
export interface Chamber {
  chamberId: string;
  name: string;            // 예: "Chamber A", "Chamber B"
  equipmentId: string;
}

/** 공정 종류 */
export type ProcessType = "CVD-PECVD" | "CVD-LPCVD" | "CVD-HDPCVD" | "ETCH-OXIDE" | "ETCH-SI" | "ETCH-DEEP";

/** 레시피 */
export interface Recipe {
  recipeId: string;
  name: string;            // 예: "CVD-STANDARD", "ETCH-DEEP"
  processType: ProcessType;
  steps: RecipeStep[];
}

/** 레시피 스텝 */
export interface RecipeStep {
  stepId: string;
  stepNumber: number;      // 1, 2, 3, ...
  name: string;            // 예: "Pump Down", "Stabilize", "Deposition", "Purge", "Vent"
  durationSec: number;     // 목표 소요 시간 (초)
  targetParams: Record<string, number>;  // 목표 센서 값 (예: { temperature: 400, pressure: 3.5 })
}

/** 센서 메타데이터 */
export interface SensorMeta {
  key: string;             // 예: "temperature", "pressure", "SiH4_flow"
  label: string;           // 예: "Temperature", "Pressure", "SiH4 Flow"
  unit: string;            // 예: "°C", "Torr", "mTorr", "sccm", "W"
  color: string;           // 차트 색상
  specLimits?: {
    usl?: number;          // Upper Spec Limit
    lsl?: number;          // Lower Spec Limit
    ucl?: number;          // Upper Control Limit
    lcl?: number;          // Lower Control Limit
  };
}

/** Lot (로트 = 웨이퍼 묶음) */
export interface LotData {
  lotId: string;
  recipeId: string;
  recipeName: string;
  equipmentId: string;
  chamberId: string;
  isGoldenLot: boolean;
  waferCount: number;      // 보통 25
  wafers: WaferRun[];      // 1:N 관계
}

/** Wafer 단위 공정 실행 데이터 */
export interface WaferRun {
  waferId: string;
  slotNumber: number;      // Lot 내 슬롯 위치 (1~25)
  startTime: string;       // ISO 8601
  endTime: string;
  data: ProcessDataPoint[];
}

/** 이상 유형 */
export type AnomalyType = "drift" | "spike" | "shift" | "oscillation" | "out_of_range" | "pattern";

/** 개별 시점의 센서 및 AI 예측 데이터 */
export interface ProcessDataPoint {
  timestamp: string;                   // ISO 8601
  elapsedSec: number;                  // 공정 시작 후 경과 시간 (초)
  stepId: string;                      // 현재 레시피 스텝
  sensors: Record<string, number>;     // 동적 센서 값 (예: { temperature: 400.2, pressure: 3.51, SiH4_flow: 200.5 })
  isAnomaly: boolean;
  anomalyScore: number;                // 0.0 ~ 1.0
  anomalyType?: AnomalyType;          // 이상 유형 (이상 시에만)
}
```

### 센서 구성 (공정별)

센서는 공정 종류에 따라 달라진다. MVP에서는 아래 센서를 지원한다.

| 공정 | 주요 센서 | 단위 참고 |
|------|----------|----------|
| CVD (PECVD) | temperature, pressure, rfPower, rfReflected, SiH4_flow, NH3_flow, N2_flow, spacing | 압력: Torr |
| CVD (LPCVD) | temperature, pressure, SiH4_flow, DCS_flow, N2_flow | 압력: Torr (0.1~2) |
| Etch (Oxide) | escTemperature, pressure, sourcePower, biasPower, CF4_flow, CHF3_flow, Ar_flow, O2_flow, dcBias | **압력: mTorr** |
| Etch (Deep Si) | escTemperature, pressure, sourcePower, biasPower, SF6_flow, C4F8_flow, Ar_flow | **압력: mTorr** |

> **주의**: Etch 공정의 압력 단위는 mTorr다. CVD(Torr)와 혼동하지 않는다.

## 7. UI/UX 레이아웃

화면은 SPA 형태로 3개 영역으로 구성:

1. **Top Navigation Bar**: 프로젝트 로고, Equipment/Chamber 선택, Lot 선택, Wafer 선택 Dropdown, Compare Mode Toggle, 용어사전 버튼. 뷰 모드(시계열/Lot 트렌딩)는 데스크톱에서 TopNav에, 모바일에서는 Sidebar 상단에 표시한다.
2. **Left Sidebar (Filter Panel)**:
   - 시계열 뷰: 센서 선택 체크박스 (공정 종류에 따라 동적), AI 이상 탐지 표시 여부 Toggle, Spec Limit 표시 Toggle, Wafer 비교 Toggle, X축 모드 전환 (wall clock / elapsed time)
   - Lot 트렌딩 뷰: 분석할 단일 센서 선택 드롭다운, 분석할 레시피 스텝 선택 드롭다운
3. **Main Content Area (Split View)**:
   - 시계열 뷰: [상단 60%] 메인 시계열 차트 (ECharts, 줌/패닝, 스텝 경계선 표시, Spec Limit 수평선) / [하단 40%] 드릴다운 패널 (좌: Radar Chart / 우: Parameter Data Table)
   - Lot 트렌딩 뷰: [상단] Lot-to-Lot 트렌드 차트 (Run별 센서 평균, UCL/LCL, ±2σ 밴드, 공정별 판정 색상) / [하단] R2R 조정값 차트 + 공정 결과 메트릭 테이블

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
- **v0.2**: 드릴다운 인터랙션 + 공정 비교 모드 (Golden Lot, Wafer-to-Wafer)
- **v0.3**: 데이터 모델 고도화 (Lot-Wafer 1:N, Equipment/Chamber, Recipe Step, 동적 센서, Spec Limit, 이상 유형 분류)
- **v0.4**: R2R/APC Lot-to-Lot 트렌딩 뷰 + 전체 챔버 Mock 데이터 확장 (28 Lots, 5 챔버) + 엔지니어 UX 개선 (센서/스텝 선택, 공정별 판정, 차트 컨텍스트 헤더, 용어사전)
- **v1.0 정식 출시**: Supabase 연동, 실 데이터 기반 동작, 성능 최적화 완료
