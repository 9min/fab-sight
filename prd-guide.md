# 📝 [PRD] FabSight: AI 기반 반도체 공정 데이터 분석 대시보드 (MVP)

## 1. 프로젝트 개요 (Overview)
* **목적:** 반도체 장비(Etcher/CVD)에서 발생하는 대용량 시계열 센서 데이터와 AI 이상 탐지(Anomaly Detection) 모델의 결과를 시각화하여, 엔지니어가 공정 이상 원인을 빠르게 분석하고 대응할 수 있도록 지원하는 웹 대시보드.
* **핵심 가치:** * 1만 건 이상의 대용량 시계열 데이터의 지연 없는 렌더링.
    * AI 모델 예측 결과의 직관적인 시각화 (정상/이상 구간 하이라이팅).
    * 특정 시점 클릭 시 다변량 데이터 기반의 드릴다운(Drill-down) 및 비교(Compare) 분석 제공.

## 3. 핵심 기능 명세 (Key Features)

### 3.1. 시계열 공정 데이터 메인 대시보드 (Time-Series Dashboard)
* **기능 설명:** 선택된 공정(Lot/Wafer)의 센서 데이터(온도, 압력, RF Power 등)를 시간에 따라 선형 차트(Line Chart)로 표시.
* **상세 요구사항:**
    * X축은 시간(Timestamp), Y축은 다중 축(Multiple Y-Axes)을 사용하여 단위가 다른 센서 데이터를 한 화면에 겹쳐서 시각화.
    * 마우스 휠을 통한 X축 줌인/줌아웃(Data Zoom) 및 패닝 기능 필수.
    * 브러시(Brush) 기능을 통해 특정 시간대를 드래그하여 확대하는 기능 제공.

### 3.2. AI 모델 결과 시각화 (AI Anomaly Visualization)
* **기능 설명:** 백엔드(가상)에서 전달받은 AI 모델의 예측 결과를 차트 위에 오버레이.
* **상세 요구사항:**
    * 차트 배경에 '정상 공정 범위(Confidence Band)'를 옅은 색상으로 표시(Area Chart 활용).
    * `isAnomaly: true`인 데이터 포인트는 붉은색 마커(Scatter Point)로 강조.
    * 툴팁(Tooltip) 호버 시, 해당 시점의 센서 실제 값과 AI가 부여한 이상 점수(Anomaly Score)를 함께 노출.

### 3.3. 다변량 데이터 드릴다운 인터랙션 (Drill-down Interaction)
* **기능 설명:** 메인 시계열 차트에서 특정 시점(Point)을 클릭하면, 해당 시점의 상세 다변량 데이터를 하단 패널에 표시.
* **상세 요구사항:**
    * **방사형 차트(Radar Chart):** 클릭한 시점의 모든 센서 값을 정규화(Normalization)하여 다각형 형태로 표시. 어느 센서 값이 정상 범위를 벗어났는지 한눈에 파악.
    * **파라미터 테이블:** 해당 시점의 원시 데이터(Raw Data)를 데이터 그리드(Table) 형태로 리스팅 및 정렬 기능 제공.

### 3.4. 공정 비교 화면 (Compare Mode)
* **기능 설명:** 기준이 되는 'Golden Lot(가장 완벽했던 공정 데이터)'과 현재 분석 중인 Lot 데이터를 겹쳐서 비교.
* **상세 요구사항:**
    * 우측 상단 'Compare' 토글 버튼 활성화 시, Golden Lot 데이터가 점선(Dashed Line) 형태로 메인 차트에 추가 렌더링.

## 4. UI/UX 화면 설계 (Layout Structure)

화면은 크게 3개의 영역으로 분할하여 Single Page Application(SPA) 형태로 구성합니다.

1.  **Top Navigation Bar:**
    * 프로젝트 로고 (FabSight)
    * 공정(Lot/Wafer) 선택 Dropdown
    * Compare Mode Toggle
2.  **Left Sidebar (Filter Panel):**
    * 기간 선택 (Date Range Picker)
    * 센서 선택 체크박스 (Temperature, Pressure, Gas Flow 등 표시 여부 On/Off)
    * AI 이상 탐지 표시 여부 Toggle
3.  **Main Content Area (Split View):**
    * **[Top 60%] Main Chart Area:** 대용량 시계열 ECharts 렌더링 영역 (줌/패닝 인터랙션 집중).
    * **[Bottom 40%] Drill-down Panel:** 차트 포인트 클릭 시 렌더링되는 영역. (좌측: Radar Chart / 우측: Parameter Data Table).

## 5. 데이터 모델 설계 (Data Model)

프론트엔드 상태 및 컴포넌트 Props에 사용될 핵심 TypeScript 인터페이스입니다.

```typescript
// 1. 개별 시점의 센서 및 AI 예측 데이터 구조
export interface ProcessDataPoint {
  timestamp: string; // ISO 8601 string
  temperature: number; // 단위: °C
  pressure: number; // 단위: Torr
  rfPower: number; // 단위: W
  isAnomaly: boolean; // AI 이상 감지 여부
  anomalyScore: number; // 0.0 ~ 1.0 (1.0에 가까울수록 이상 확률 높음)
}

// 2. 전체 공정(Lot) 데이터 묶음
export interface LotData {
  lotId: string;
  waferId: string;
  recipeName: string;
  startTime: string;
  endTime: string;
  data: ProcessDataPoint[]; // 최소 10,000개 이상의 배열
}
```

## 6. 성능 최적화 전략 (Performance Optimization)
에이머슬리 채용 공고의 핵심인 '대용량 데이터 렌더링' 대응 전략입니다.

1.  **Canvas 렌더링 우선:** SVG 대신 Canvas를 사용하여 수만 개의 DOM 노드 생성을 방지.
2.  **React.memo 및 useCallback 적용:** 차트 상위 컴포넌트의 상태(필터 등)가 변경될 때, ECharts 컴포넌트 자체가 불필요하게 리렌더링(Unmount/Mount)되지 않도록 메모이제이션 철저히 적용.
3.  **ECharts `appendData` 활용 (옵션):** 초기 로딩 속도 개선을 위해 청크(Chunk) 단위로 데이터를 분할하여 차트에 비동기적으로 밀어 넣는 방식 고려.
4.  **Data Downsampling (LTTB 알고리즘 등):** 줌아웃 상태에서는 데이터를 축소하여 그리고, 줌인 할 때만 원본 데이터를 Fetch/Render 하는 시각적 최적화 로직 적용.

## 7. AI 도구 활용 생산성 향상 리포트 (JD 필수 요건 대응)
면접 및 README 제출 시 **반드시** 강조해야 할 섹션입니다.

* **Mock Data Generation:** 복잡한 시계열 다변량 공정 데이터 세트를 직접 타이핑하지 않고, LLM에 프롬프트를 입력하여 현실적인 노이즈(Noise)와 이상(Anomaly) 패턴이 포함된 JSON 데이터를 1만 건 이상 자동 생성.
* **코드 작성 및 리팩토링:** Claude Code 등을 활용하여 ECharts의 방대한 옵션(Option) 객체 보일러플레이트를 빠르게 구성하고, React Query의 데이터 패칭 훅(Hook) 구조를 설계함.
* **문서화 자동화:** 작성된 유틸리티 함수 및 주요 컴포넌트의 JSDoc을 AI 도구로 자동 생성하여 코드의 가독성과 유지보수성을 극대화함.
