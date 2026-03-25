/** 용어사전 카테고리 */
export type GlossaryCategory =
	| "processStructure"
	| "sensorMeasurement"
	| "anomalyDetection"
	| "compareFeature"
	| "chartOption";

/** 용어사전 항목 */
export interface GlossaryTerm {
	/** 고유 식별자 */
	id: string;
	/** 표시 용어 (예: "Lot (로트)") */
	term: string;
	/** 인라인 툴팁용 1줄 설명 */
	shortDescription: string;
	/** Drawer용 상세 설명 */
	fullDescription: string;
	/** 카테고리 */
	category: GlossaryCategory;
	/** 연관 용어 id 배열 */
	relatedTerms?: string[];
}

/** 카테고리 한국어 라벨 */
export const GLOSSARY_CATEGORIES: Record<GlossaryCategory, string> = {
	processStructure: "공정 구조",
	sensorMeasurement: "센서/측정",
	anomalyDetection: "이상 탐지",
	compareFeature: "비교 기능",
	chartOption: "차트 옵션",
};

/** 카테고리 표시 순서 */
export const GLOSSARY_CATEGORY_ORDER: GlossaryCategory[] = [
	"processStructure",
	"sensorMeasurement",
	"anomalyDetection",
	"compareFeature",
	"chartOption",
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
	// ── 공정 구조 ──
	{
		id: "lot",
		term: "Lot (로트)",
		shortDescription: "동일 조건으로 처리되는 웨이퍼 묶음",
		fullDescription:
			"하나의 레시피로 함께 처리되는 웨이퍼들의 그룹. 보통 25장의 웨이퍼로 구성되며, 공정 품질 관리의 기본 단위이다.",
		category: "processStructure",
		relatedTerms: ["wafer", "recipe"],
	},
	{
		id: "wafer",
		term: "Wafer (웨이퍼)",
		shortDescription: "반도체 회로를 새기는 원판형 기판",
		fullDescription:
			"실리콘으로 만든 얇은 원판. 이 위에 반도체 회로 패턴을 형성하며, 하나의 웨이퍼에서 수백~수천 개의 칩이 만들어진다.",
		category: "processStructure",
		relatedTerms: ["lot"],
	},
	{
		id: "equipment",
		term: "Equipment (장비)",
		shortDescription: "공정을 수행하는 반도체 제조 장비",
		fullDescription:
			"CVD(화학기상증착), Etcher(식각기) 등 특정 공정을 수행하는 장비. 각 장비는 하나 이상의 챔버를 포함한다.",
		category: "processStructure",
		relatedTerms: ["chamber"],
	},
	{
		id: "chamber",
		term: "Chamber (챔버)",
		shortDescription: "장비 내부의 실제 공정 반응 공간",
		fullDescription:
			"장비 안에서 웨이퍼가 실제로 처리되는 밀폐된 공간. 온도, 압력, 가스 등이 정밀하게 제어된다.",
		category: "processStructure",
		relatedTerms: ["equipment"],
	},
	{
		id: "recipe",
		term: "Recipe (레시피)",
		shortDescription: "공정 조건을 정의한 설정값 세트",
		fullDescription:
			"온도, 압력, 가스 유량, 시간 등 공정 파라미터의 조합. 각 레시피는 여러 스텝으로 구성되며, 동일한 결과물을 반복 생산하기 위한 표준이다.",
		category: "processStructure",
		relatedTerms: ["step", "lot"],
	},
	{
		id: "step",
		term: "Step (스텝)",
		shortDescription: "레시피 내의 개별 공정 단계",
		fullDescription:
			"레시피를 구성하는 세부 단계. 예: Pump Down(진공 배기) → Heat(가열) → Deposition(증착) → Purge(퍼징) → Vent(대기 개방)",
		category: "processStructure",
		relatedTerms: ["recipe"],
	},

	// ── 센서/측정 ──
	{
		id: "temperature",
		term: "Temperature (온도)",
		shortDescription: "공정 챔버 내부 온도 (°C)",
		fullDescription:
			"챔버 내부 또는 웨이퍼의 온도. 박막 품질과 균일도에 직접적인 영향을 미치는 핵심 파라미터이다.",
		category: "sensorMeasurement",
		relatedTerms: ["escTemperature"],
	},
	{
		id: "pressure",
		term: "Pressure (압력)",
		shortDescription: "챔버 내부 압력 (Torr/mTorr)",
		fullDescription:
			"챔버 내부의 기체 압력. 진공 상태에서 Torr 또는 mTorr 단위로 정밀 제어하며, 플라즈마 형성과 막질에 영향을 준다.",
		category: "sensorMeasurement",
	},
	{
		id: "rfPower",
		term: "RF Power (고주파 전력)",
		shortDescription: "플라즈마 생성용 고주파 전력 (W)",
		fullDescription:
			"Radio Frequency 전력. 챔버 내 가스를 플라즈마 상태로 만들어 화학 반응을 촉진한다. CVD 증착과 식각 공정에서 핵심적이다.",
		category: "sensorMeasurement",
	},
	{
		id: "flow",
		term: "Flow (가스 유량)",
		shortDescription: "공정 가스 유량 (sccm)",
		fullDescription:
			"챔버에 주입되는 가스의 흐름량. sccm(표준 세제곱센티미터/분) 단위로 측정하며, 각 가스별로 독립 제어된다.",
		category: "sensorMeasurement",
	},
	{
		id: "specLimit",
		term: "Spec Limit (규격 한계)",
		shortDescription: "공정 파라미터의 허용 한계선",
		fullDescription:
			"USL(상한 규격)과 LSL(하한 규격)로 구성. 이 범위를 벗어나면 공정 이상으로 판정되어 조치가 필요하다.",
		category: "sensorMeasurement",
		relatedTerms: ["uslLsl", "uclLcl"],
	},
	{
		id: "uslLsl",
		term: "USL/LSL (규격 상한/하한)",
		shortDescription: "규격 상한/하한 (Upper/Lower Spec Limit)",
		fullDescription:
			"USL은 허용되는 최대값, LSL은 최소값. 센서값이 이 범위 안에 있어야 정상 공정으로 인정된다.",
		category: "sensorMeasurement",
		relatedTerms: ["specLimit", "uclLcl"],
	},
	{
		id: "uclLcl",
		term: "UCL/LCL (관리 상한/하한)",
		shortDescription: "통계적 공정 관리의 관리 한계선",
		fullDescription:
			"통계적 공정 관리(SPC)에서 사용하는 관리 한계. Spec Limit보다 좁은 범위로, 이 선을 넘으면 공정 이상 징후로 판단한다.",
		category: "sensorMeasurement",
		relatedTerms: ["specLimit", "uslLsl"],
	},
	{
		id: "escTemperature",
		term: "ESC Temperature (정전척 온도)",
		shortDescription: "웨이퍼 고정용 정전척의 온도",
		fullDescription:
			"웨이퍼를 정전기력으로 고정하는 척(Electrostatic Chuck)의 온도. 웨이퍼 온도를 간접적으로 제어하며, 식각 균일도에 중요하다.",
		category: "sensorMeasurement",
		relatedTerms: ["temperature"],
	},

	// ── 이상 탐지 ──
	{
		id: "anomaly",
		term: "Anomaly (이상)",
		shortDescription: "센서 데이터의 비정상 패턴",
		fullDescription:
			"정상 범위를 벗어나거나 비정상적인 변화를 보이는 센서 데이터. AI 모델이 자동으로 감지하여 엔지니어에게 알려준다.",
		category: "anomalyDetection",
		relatedTerms: ["anomalyScore"],
	},
	{
		id: "anomalyScore",
		term: "Anomaly Score (이상 점수)",
		shortDescription: "이상 정도를 나타내는 수치 (0~1)",
		fullDescription:
			"0에 가까울수록 정상, 1에 가까울수록 비정상. 0.8 이상은 높은 이상, 0.5~0.8은 중간 이상으로 분류된다.",
		category: "anomalyDetection",
		relatedTerms: ["anomaly"],
	},
	{
		id: "drift",
		term: "Drift (드리프트)",
		shortDescription: "센서값이 점진적으로 편향되는 현상",
		fullDescription:
			"시간이 지남에 따라 센서값이 서서히 한쪽 방향으로 이동하는 패턴. 챔버 벽 오염, 부품 마모, 소모품 열화 등이 원인일 수 있다.",
		category: "anomalyDetection",
	},
	{
		id: "spike",
		term: "Spike (스파이크)",
		shortDescription: "순간적으로 급격히 튀는 값",
		fullDescription:
			"센서값이 매우 짧은 시간 동안 급격히 상승하거나 하락하는 현상. RF 아킹(Arc), 전기적 노이즈, 순간적 가스 공급 불안정 등이 원인일 수 있다.",
		category: "anomalyDetection",
	},
	{
		id: "shift",
		term: "Shift (시프트)",
		shortDescription: "센서값이 갑자기 단계적으로 변화",
		fullDescription:
			"특정 시점을 기준으로 센서값의 평균이 급격히 변하는 패턴. 부품 교체, 챔버 클리닝, MFC 캘리브레이션 오차 후 발생할 수 있다.",
		category: "anomalyDetection",
	},
	{
		id: "oscillation",
		term: "Oscillation (진동)",
		shortDescription: "센서값이 주기적으로 진동",
		fullDescription:
			"센서값이 일정한 주기로 반복적으로 오르내리는 패턴. PID 제어기 헌팅(hunting)이나 가스 공급 라인 불안정이 원인일 수 있다.",
		category: "anomalyDetection",
	},
	{
		id: "outOfRange",
		term: "Out-of-Range (범위 초과)",
		shortDescription: "규격 범위를 벗어난 값",
		fullDescription:
			"센서값이 설정된 Spec Limit(USL/LSL)을 초과한 상태. 즉각적인 조치가 필요한 심각한 이상이다.",
		category: "anomalyDetection",
		relatedTerms: ["specLimit", "uslLsl"],
	},

	// ── 비교 기능 ──
	{
		id: "goldenLot",
		term: "Golden Lot (기준 로트)",
		shortDescription: "정상 기준이 되는 표준 Lot",
		fullDescription:
			"이상적인 공정 조건에서 생산된 참조용 Lot. 현재 Lot의 센서 데이터를 Golden Lot과 비교하여 편차를 빠르게 파악할 수 있다.",
		category: "compareFeature",
		relatedTerms: ["lot", "w2wCompare"],
	},
	{
		id: "w2wCompare",
		term: "W2W 비교 (웨이퍼 간 비교)",
		shortDescription: "같은 Lot 내 웨이퍼 간 비교",
		fullDescription:
			"Wafer-to-Wafer 비교. 동일 Lot 내에서 웨이퍼별 센서 데이터를 겹쳐 표시하여, 웨이퍼 간 공정 균일도를 확인한다.",
		category: "compareFeature",
		relatedTerms: ["wafer", "goldenLot"],
	},

	// ── 차트 옵션 ──
	{
		id: "xAxisMode",
		term: "시각 / 경과 시간",
		shortDescription: "X축 시간 표시 방식 전환",
		fullDescription:
			"시각(Wall Clock)은 실제 시각(HH:MM:SS)으로 표시하고, 경과 시간(Elapsed)은 공정 시작 후 경과된 초 단위로 표시한다.",
		category: "chartOption",
	},
	{
		id: "lttb",
		term: "LTTB 다운샘플링",
		shortDescription: "대량 데이터의 시각적 압축 기법",
		fullDescription:
			"Largest Triangle Three Buckets 알고리즘. 수만 개의 데이터 포인트를 시각적 특성을 유지하면서 적은 수로 줄여 차트 성능을 향상시킨다.",
		category: "chartOption",
	},
	{
		id: "sensorSelection",
		term: "센서 선택",
		shortDescription: "차트에 표시할 센서 항목 선택",
		fullDescription:
			"여러 센서 중 관심 있는 항목만 선택하여 차트에 표시한다. 각 센서는 고유한 색상과 Y축을 가진다.",
		category: "chartOption",
	},
];

/** id로 용어를 조회한다 */
export function getGlossaryTerm(id: string): GlossaryTerm | undefined {
	return GLOSSARY_TERMS.find((t) => t.id === id);
}

/** 카테고리별로 그룹핑된 용어 맵을 반환한다 */
export function getTermsByCategory(): Record<GlossaryCategory, GlossaryTerm[]> {
	const result = {} as Record<GlossaryCategory, GlossaryTerm[]>;
	for (const category of GLOSSARY_CATEGORY_ORDER) {
		result[category] = GLOSSARY_TERMS.filter((t) => t.category === category);
	}
	return result;
}

/** 검색어로 용어를 필터링한다 (term, shortDescription, fullDescription 대상) */
export function searchGlossaryTerms(query: string): GlossaryTerm[] {
	const q = query.trim().toLowerCase();
	if (!q) return GLOSSARY_TERMS;
	return GLOSSARY_TERMS.filter(
		(t) =>
			t.term.toLowerCase().includes(q) ||
			t.shortDescription.toLowerCase().includes(q) ||
			t.fullDescription.toLowerCase().includes(q),
	);
}
