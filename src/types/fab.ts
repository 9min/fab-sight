/** 공정 종류 */
export type ProcessType =
	| "CVD-PECVD"
	| "CVD-LPCVD"
	| "CVD-HDPCVD"
	| "ETCH-OXIDE"
	| "ETCH-SI"
	| "ETCH-DEEP";

/** 이상 유형 */
export type AnomalyType = "drift" | "spike" | "shift" | "oscillation" | "out_of_range" | "pattern";

/** 장비 */
export interface Equipment {
	equipmentId: string;
	name: string;
	type: ProcessType;
	chambers: Chamber[];
}

/** 챔버 */
export interface Chamber {
	chamberId: string;
	name: string;
	equipmentId: string;
}

/** 레시피 */
export interface Recipe {
	recipeId: string;
	name: string;
	processType: ProcessType;
	steps: RecipeStep[];
}

/** 레시피 스텝 */
export interface RecipeStep {
	stepId: string;
	stepNumber: number;
	name: string;
	durationSec: number;
	targetParams: Record<string, number>;
}

/** Spec Limit (관리 한계) */
export interface SpecLimits {
	usl?: number;
	lsl?: number;
	ucl?: number;
	lcl?: number;
	/** Spec이 적용되는 주요 공정 스텝 (예: "Deposition", "Etch Phase") */
	stepContext?: string;
}

/** 센서 메타데이터 */
export interface SensorMeta {
	key: string;
	label: string;
	unit: string;
	color: string;
	specLimits?: SpecLimits;
}

/** Lot (로트 = 웨이퍼 묶음) */
export interface LotDataV3 {
	lotId: string;
	recipeId: string;
	recipeName: string;
	equipmentId: string;
	chamberId: string;
	isGoldenLot: boolean;
	waferCount: number;
	wafers: WaferRun[];
}

/** Wafer 단위 공정 실행 데이터 */
export interface WaferRun {
	waferId: string;
	slotNumber: number;
	startTime: string;
	endTime: string;
	data: ProcessDataPointV3[];
}

/** 개별 시점의 센서 및 AI 예측 데이터 (v0.3) */
export interface ProcessDataPointV3 {
	timestamp: string;
	elapsedSec: number;
	stepId: string;
	sensors: Record<string, number>;
	isAnomaly: boolean;
	anomalyScore: number;
	anomalyType?: AnomalyType;
}
