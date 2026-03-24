# 데이터 모델링 가이드

## 테이블 설계 원칙

### 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 테이블명 | `snake_case` 복수형 | `todos`, `user_profiles` |
| 컬럼명 | `snake_case` | `created_at`, `user_id` |
| 인덱스명 | `idx_테이블_컬럼` | `idx_todos_user_id` |
| RLS 정책명 | 한국어 서술형 | `사용자 본인 조회` |
| 함수명 | `snake_case` 동사형 | `update_updated_at()` |

### 정규화

- 기본적으로 제3정규형(3NF)을 따른다.
- 성능을 위해 비정규화하는 경우, 마이그레이션에 이유를 주석으로 남긴다.

```sql
-- 비정규화: 댓글 수를 posts에 캐싱 (조회 성능 최적화)
ALTER TABLE posts ADD COLUMN comment_count INTEGER DEFAULT 0;
```

## 필수 공통 컬럼

모든 테이블에 다음 컬럼을 포함한다:

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | `UUID` | 기본키. `gen_random_uuid()` 사용 |
| `created_at` | `TIMESTAMPTZ` | 생성 시각. `NOW()` 기본값 |
| `updated_at` | `TIMESTAMPTZ` | 수정 시각. 트리거로 자동 갱신 |

### 마이그레이션 템플릿

```sql
-- updated_at 자동 갱신 트리거 함수 (최초 1회 생성)
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 테이블 생성 템플릿
CREATE TABLE 테이블명 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- 비즈니스 컬럼들...
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- updated_at 트리거 연결
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON 테이블명
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS 활성화
ALTER TABLE 테이블명 ENABLE ROW LEVEL SECURITY;
```

## 외래키 및 관계 설계

### 1:N 관계 예제

```sql
-- 사용자(1) : 게시글(N)
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

### N:M 관계 예제 (조인 테이블)

```sql
-- 게시글(N) : 태그(M)
CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (post_id, tag_id)
);
```

### ON DELETE 옵션 가이드

| 옵션 | 동작 | 사용 시점 |
|------|------|----------|
| `CASCADE` | 부모 삭제 시 자식도 삭제 | 종속적 데이터 (댓글, 좋아요) |
| `SET NULL` | 부모 삭제 시 FK를 NULL로 | 참조만 하는 데이터 (작성자 탈퇴) |
| `RESTRICT` | 부모 삭제 차단 | 삭제 시 데이터 무결성 문제 (주문-상품) |

## 소프트 딜리트 vs 하드 딜리트

### 선택 기준

| 기준 | 소프트 딜리트 | 하드 딜리트 |
|------|-------------|------------|
| 데이터 복구 필요 | 필요 | 불필요 |
| 법적 보관 의무 | 있음 | 없음 |
| 연관 데이터 | 많음 | 적음 |
| 예시 | 사용자 계정, 게시글 | 임시 데이터, 로그 |

### 소프트 딜리트 구현

```sql
-- deleted_at 컬럼 추가
ALTER TABLE posts ADD COLUMN deleted_at TIMESTAMPTZ;

-- RLS 정책에서 삭제된 데이터 필터링
CREATE POLICY "삭제되지 않은 게시글만 조회" ON posts
  FOR SELECT USING (deleted_at IS NULL);
```

```ts
// 소프트 딜리트 서비스 함수
export async function softDeletePost(postId: string) {
  const { error } = await supabase
    .from("posts")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", postId);

  if (error) throw error;
}
```

## RLS 정책 설계

RLS 정책의 상세 구현은 [보안 가이드](security-guide.md)를 참조한다.

### 테이블 설계 시 RLS 체크리스트

- [ ] `user_id` 컬럼이 있는가? (사용자별 데이터 접근 제어)
- [ ] 공개 데이터인가? (비인증 사용자 조회 허용 여부)
- [ ] 역할 기반 접근이 필요한가? (관리자/일반 사용자 구분)
- [ ] CRUD 각 작업별 정책이 정의되어 있는가?
- [ ] 마이그레이션 파일에 RLS 정책이 포함되어 있는가?

## 마이그레이션 관리 전략

### 생성

```bash
# 새 마이그레이션 생성 (네이밍: 동사_테이블명)
npx supabase migration new create_todos_table
npx supabase migration new add_status_to_todos
npx supabase migration new create_post_tags_junction
```

### 적용

```bash
# 로컬: 데이터베이스 리셋 (모든 마이그레이션 재적용)
npx supabase db reset

# 원격: 마이그레이션 푸시
npx supabase db push
```

### 롤백

Supabase CLI는 자동 롤백을 지원하지 않는다. 역방향 마이그레이션을 수동으로 작성한다.

```bash
npx supabase migration new revert_add_status_to_todos
```

```sql
-- 역방향 마이그레이션 예시
ALTER TABLE todos DROP COLUMN status;
```

### 작성 규칙

- 하나의 마이그레이션은 하나의 논리적 변경만 포함한다.
- DDL(구조 변경)과 DML(데이터 변경)을 분리한다.
- 모든 테이블 생성 마이그레이션에 RLS 정책을 포함한다.
- 인덱스 추가는 별도 마이그레이션으로 분리한다.

## 시드 데이터 관리

시드 데이터는 `supabase/seed.sql`에 작성한다.

```sql
-- supabase/seed.sql
-- 개발/테스트용 초기 데이터

INSERT INTO todos (id, user_id, title, is_completed) VALUES
  ('00000000-0000-0000-0000-000000000001', '사용자UUID', '첫 번째 할 일', false),
  ('00000000-0000-0000-0000-000000000002', '사용자UUID', '두 번째 할 일', true);
```

- `npx supabase db reset` 실행 시 자동 적용된다.
- 프로덕션 환경에는 적용하지 않는다.

## 타입 자동 생성

```bash
npx supabase gen types typescript --local > src/types/database.ts
```

생성된 타입에서 Row/Insert/Update 타입을 추출하여 사용한다:

```ts
import type { Database } from "./database";

// 행 타입 (SELECT 결과)
type Todo = Database["public"]["Tables"]["todos"]["Row"];

// 삽입 타입 (INSERT 시 필요한 필드)
type CreateTodoInput = Database["public"]["Tables"]["todos"]["Insert"];

// 수정 타입 (UPDATE 시 필요한 필드, 모두 optional)
type UpdateTodoInput = Database["public"]["Tables"]["todos"]["Update"];
```

## FabSight 데이터 모델

### FAB 데이터 계층 구조

실제 반도체 FAB의 데이터 계층을 반영한다. 상세 인터페이스 정의는 [PRD](prd.md)를 참조한다.

```
Equipment (장비)
  └─ Chamber (챔버, 장비당 2~6개)
      └─ Recipe (레시피 = 공정 조건 세트)
          └─ RecipeStep (레시피 내 단계, 3~20개)
          └─ Lot (로트 = 웨이퍼 묶음, 보통 25장)
              └─ Wafer (개별 웨이퍼)
                  └─ WaferRun (1회 공정 실행)
                      └─ ProcessDataPoint (센서 값, 1초 간격)
```

### MVP 단계: Mock 데이터 사용

MVP 단계에서는 Supabase 테이블 대신 `src/mocks/` 디렉토리의 Mock 데이터를 사용한다. Mock 데이터도 올바른 FAB 데이터 구조(Lot-Wafer 1:N, Recipe Step, 동적 센서)를 따라야 추후 Supabase 전환이 매끄럽다.

### 핵심 TypeScript 인터페이스

```typescript
// src/types/process.ts — 상세 정의는 PRD 참조

/** 공정 종류 */
type ProcessType = "CVD-PECVD" | "CVD-LPCVD" | "CVD-HDPCVD" | "ETCH-OXIDE" | "ETCH-SI" | "ETCH-DEEP";

/** 이상 유형 */
type AnomalyType = "drift" | "spike" | "shift" | "oscillation" | "out_of_range" | "pattern";

/** Lot (1:N Wafers) */
interface LotData {
  lotId: string;
  recipeId: string;
  recipeName: string;
  equipmentId: string;
  chamberId: string;
  isGoldenLot: boolean;
  waferCount: number;       // 보통 25
  wafers: WaferRun[];       // Lot → Wafer 1:N
}

/** Wafer 단위 공정 실행 */
interface WaferRun {
  waferId: string;
  slotNumber: number;       // 1~25
  startTime: string;
  endTime: string;
  data: ProcessDataPoint[];
}

/** 개별 시점 센서 데이터 */
interface ProcessDataPoint {
  timestamp: string;
  elapsedSec: number;                // 공정 시작 후 경과 시간
  stepId: string;                    // 현재 레시피 스텝
  sensors: Record<string, number>;   // 동적 센서 값
  isAnomaly: boolean;
  anomalyScore: number;
  anomalyType?: AnomalyType;
}

/** 센서 메타데이터 (Spec Limit 포함) */
interface SensorMeta {
  key: string;
  label: string;
  unit: string;       // 공정별로 다름 (Torr vs mTorr 등)
  color: string;
  specLimits?: { usl?: number; lsl?: number; ucl?: number; lcl?: number; };
}
```

### 핵심 설계 원칙

| 원칙 | 설명 |
|------|------|
| **Lot-Wafer 1:N** | 1 Lot = 25 Wafers. `LotData.wafers`로 접근 |
| **Equipment/Chamber 추적** | 이상 발생 시 "어떤 장비의 어떤 챔버인가?" 추적 가능 |
| **Recipe Step 포함** | 센서 패턴은 스텝에 의해 결정됨. 스텝 없이는 정상/이상 판단 불가 |
| **동적 센서** | 공정 종류별 센서 수/종류가 다름. `Record<string, number>` 사용 |
| **공정별 단위 구분** | CVD: 압력 Torr, Etch: 압력 **mTorr**. SensorMeta.unit으로 관리 |
| **이상 유형 분류** | Drift/Spike/Shift/Oscillation 등 유형별 대응이 다름 |

### 추후 Supabase 테이블 설계 (v1.0)

```sql
-- 장비
CREATE TABLE equipment (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id TEXT UNIQUE NOT NULL,   -- "CVD-01", "ETCH-03"
  name TEXT NOT NULL,
  process_type TEXT NOT NULL,          -- "CVD-PECVD", "ETCH-OXIDE" 등
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 챔버 (Equipment 1:N Chamber)
CREATE TABLE chambers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chamber_id TEXT UNIQUE NOT NULL,
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,                  -- "Chamber A", "Chamber B"
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 레시피
CREATE TABLE recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,                  -- "CVD-STANDARD", "ETCH-DEEP"
  process_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 레시피 스텝 (Recipe 1:N Step)
CREATE TABLE recipe_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  step_number INTEGER NOT NULL,
  name TEXT NOT NULL,                  -- "Pump Down", "Deposition" 등
  duration_sec INTEGER NOT NULL,
  target_params JSONB NOT NULL,        -- {"temperature": 400, "pressure": 3.5, ...}
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Lot (로트)
CREATE TABLE lots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lot_id TEXT UNIQUE NOT NULL,
  recipe_id UUID REFERENCES recipes(id) NOT NULL,
  chamber_id UUID REFERENCES chambers(id) NOT NULL,
  is_golden_lot BOOLEAN DEFAULT FALSE,
  wafer_count INTEGER NOT NULL DEFAULT 25,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Wafer (Lot 1:N Wafer)
CREATE TABLE wafers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lot_id UUID REFERENCES lots(id) ON DELETE CASCADE NOT NULL,
  wafer_id TEXT NOT NULL,
  slot_number INTEGER NOT NULL,        -- 1~25
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 공정 데이터 포인트 (시계열, 동적 센서)
CREATE TABLE process_data_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wafer_id UUID REFERENCES wafers(id) ON DELETE CASCADE NOT NULL,
  step_id UUID REFERENCES recipe_steps(id) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  elapsed_sec DOUBLE PRECISION NOT NULL,
  sensors JSONB NOT NULL,              -- {"temperature": 400.2, "pressure": 3.51, "SiH4_flow": 200.5}
  is_anomaly BOOLEAN DEFAULT FALSE,
  anomaly_score DOUBLE PRECISION DEFAULT 0.0,
  anomaly_type TEXT,                   -- "drift", "spike", "shift" 등
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 성능 인덱스
CREATE INDEX idx_wafers_lot_id ON wafers(lot_id);
CREATE INDEX idx_process_data_wafer_id ON process_data_points(wafer_id);
CREATE INDEX idx_process_data_timestamp ON process_data_points(timestamp);
CREATE INDEX idx_process_data_step_id ON process_data_points(step_id);
CREATE INDEX idx_process_data_anomaly ON process_data_points(is_anomaly) WHERE is_anomaly = TRUE;
CREATE INDEX idx_lots_chamber_id ON lots(chamber_id);
CREATE INDEX idx_lots_recipe_id ON lots(recipe_id);
```

## 관련 문서

- [보안 가이드](security-guide.md)
- [프로젝트 구조](project-structure.md)
- [개발 환경 셋업](dev-environment.md)
