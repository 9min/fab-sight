import { getSensorsForProcess } from "@/constants/sensorConfig";
import type { LotDataV3 } from "@/types/fab";
import { MOCK_EQUIPMENT } from "./equipment";
import { generateWaferRuns } from "./generateProcessDataV3";
import { RECIPE_CVD_STANDARD, RECIPE_ETCH_DEEP } from "./recipes";

const WAFER_COUNT = 6;

interface LotConfig {
	lotId: string;
	recipe: typeof RECIPE_CVD_STANDARD;
	equipmentId: string;
	chamberId: string;
	isGoldenLot: boolean;
	anomalyRatio: number;
	runNumber: number;
}

/**
 * CVD-01 Chamber A 연속 10 Run 시나리오:
 * Run #1: Golden Lot (기준), Run #2~4: 안정, Run #5~7: drift 시작, Run #8~10: R2R 보정 후 수렴
 * + Etch-01 Chamber A 2 Run 추가 (다른 공정 타입 검증용)
 */
const LOT_CONFIGS: LotConfig[] = [
	// CVD-01 Chamber A — 연속 10 Run
	{
		lotId: "LOT-GOLDEN-001",
		recipe: RECIPE_CVD_STANDARD,
		equipmentId: "equip-cvd-01",
		chamberId: "cvd01-ch-a",
		isGoldenLot: true,
		anomalyRatio: 0.02,
		runNumber: 1,
	},
	{
		lotId: "LOT-20240301-A",
		recipe: RECIPE_CVD_STANDARD,
		equipmentId: "equip-cvd-01",
		chamberId: "cvd01-ch-a",
		isGoldenLot: false,
		anomalyRatio: 0.02,
		runNumber: 2,
	},
	{
		lotId: "LOT-20240301-B",
		recipe: RECIPE_CVD_STANDARD,
		equipmentId: "equip-cvd-01",
		chamberId: "cvd01-ch-a",
		isGoldenLot: false,
		anomalyRatio: 0.03,
		runNumber: 3,
	},
	{
		lotId: "LOT-20240301-C",
		recipe: RECIPE_CVD_STANDARD,
		equipmentId: "equip-cvd-01",
		chamberId: "cvd01-ch-a",
		isGoldenLot: false,
		anomalyRatio: 0.03,
		runNumber: 4,
	},
	{
		lotId: "LOT-20240302-A",
		recipe: RECIPE_CVD_STANDARD,
		equipmentId: "equip-cvd-01",
		chamberId: "cvd01-ch-a",
		isGoldenLot: false,
		anomalyRatio: 0.06,
		runNumber: 5,
	},
	{
		lotId: "LOT-20240302-B",
		recipe: RECIPE_CVD_STANDARD,
		equipmentId: "equip-cvd-01",
		chamberId: "cvd01-ch-a",
		isGoldenLot: false,
		anomalyRatio: 0.1,
		runNumber: 6,
	},
	{
		lotId: "LOT-20240302-C",
		recipe: RECIPE_CVD_STANDARD,
		equipmentId: "equip-cvd-01",
		chamberId: "cvd01-ch-a",
		isGoldenLot: false,
		anomalyRatio: 0.15,
		runNumber: 7,
	},
	{
		lotId: "LOT-20240303-A",
		recipe: RECIPE_CVD_STANDARD,
		equipmentId: "equip-cvd-01",
		chamberId: "cvd01-ch-a",
		isGoldenLot: false,
		anomalyRatio: 0.1,
		runNumber: 8,
	},
	{
		lotId: "LOT-20240303-B",
		recipe: RECIPE_CVD_STANDARD,
		equipmentId: "equip-cvd-01",
		chamberId: "cvd01-ch-a",
		isGoldenLot: false,
		anomalyRatio: 0.06,
		runNumber: 9,
	},
	{
		lotId: "LOT-20240303-C",
		recipe: RECIPE_CVD_STANDARD,
		equipmentId: "equip-cvd-01",
		chamberId: "cvd01-ch-a",
		isGoldenLot: false,
		anomalyRatio: 0.03,
		runNumber: 10,
	},
	// CVD-01 Chamber B — 안정 운영 5 Run (정상 챔버 비교 기준)
	{
		lotId: "LOT-CVD-B-001",
		recipe: RECIPE_CVD_STANDARD,
		equipmentId: "equip-cvd-01",
		chamberId: "cvd01-ch-b",
		isGoldenLot: false,
		anomalyRatio: 0.02,
		runNumber: 1,
	},
	{
		lotId: "LOT-CVD-B-002",
		recipe: RECIPE_CVD_STANDARD,
		equipmentId: "equip-cvd-01",
		chamberId: "cvd01-ch-b",
		isGoldenLot: false,
		anomalyRatio: 0.02,
		runNumber: 2,
	},
	{
		lotId: "LOT-CVD-B-003",
		recipe: RECIPE_CVD_STANDARD,
		equipmentId: "equip-cvd-01",
		chamberId: "cvd01-ch-b",
		isGoldenLot: false,
		anomalyRatio: 0.03,
		runNumber: 3,
	},
	{
		lotId: "LOT-CVD-B-004",
		recipe: RECIPE_CVD_STANDARD,
		equipmentId: "equip-cvd-01",
		chamberId: "cvd01-ch-b",
		isGoldenLot: false,
		anomalyRatio: 0.02,
		runNumber: 4,
	},
	{
		lotId: "LOT-CVD-B-005",
		recipe: RECIPE_CVD_STANDARD,
		equipmentId: "equip-cvd-01",
		chamberId: "cvd01-ch-b",
		isGoldenLot: false,
		anomalyRatio: 0.02,
		runNumber: 5,
	},
	// CVD-01 Chamber C — PM 후 컨디셔닝 3 Run (초기 불안정→안정화)
	{
		lotId: "LOT-CVD-C-001",
		recipe: RECIPE_CVD_STANDARD,
		equipmentId: "equip-cvd-01",
		chamberId: "cvd01-ch-c",
		isGoldenLot: false,
		anomalyRatio: 0.08,
		runNumber: 1,
	},
	{
		lotId: "LOT-CVD-C-002",
		recipe: RECIPE_CVD_STANDARD,
		equipmentId: "equip-cvd-01",
		chamberId: "cvd01-ch-c",
		isGoldenLot: false,
		anomalyRatio: 0.04,
		runNumber: 2,
	},
	{
		lotId: "LOT-CVD-C-003",
		recipe: RECIPE_CVD_STANDARD,
		equipmentId: "equip-cvd-01",
		chamberId: "cvd01-ch-c",
		isGoldenLot: false,
		anomalyRatio: 0.02,
		runNumber: 3,
	},
	// ETCH-01 Chamber A — 6 Run (RF 아킹 spike → 복구 시나리오)
	{
		lotId: "LOT-ETCH-001",
		recipe: RECIPE_ETCH_DEEP,
		equipmentId: "equip-etch-01",
		chamberId: "etch01-ch-a",
		isGoldenLot: false,
		anomalyRatio: 0.04,
		runNumber: 1,
	},
	{
		lotId: "LOT-ETCH-002",
		recipe: RECIPE_ETCH_DEEP,
		equipmentId: "equip-etch-01",
		chamberId: "etch01-ch-a",
		isGoldenLot: false,
		anomalyRatio: 0.05,
		runNumber: 2,
	},
	{
		lotId: "LOT-ETCH-003",
		recipe: RECIPE_ETCH_DEEP,
		equipmentId: "equip-etch-01",
		chamberId: "etch01-ch-a",
		isGoldenLot: false,
		anomalyRatio: 0.18,
		runNumber: 3,
	},
	{
		lotId: "LOT-ETCH-004",
		recipe: RECIPE_ETCH_DEEP,
		equipmentId: "equip-etch-01",
		chamberId: "etch01-ch-a",
		isGoldenLot: false,
		anomalyRatio: 0.1,
		runNumber: 4,
	},
	{
		lotId: "LOT-ETCH-005",
		recipe: RECIPE_ETCH_DEEP,
		equipmentId: "equip-etch-01",
		chamberId: "etch01-ch-a",
		isGoldenLot: false,
		anomalyRatio: 0.04,
		runNumber: 5,
	},
	{
		lotId: "LOT-ETCH-006",
		recipe: RECIPE_ETCH_DEEP,
		equipmentId: "equip-etch-01",
		chamberId: "etch01-ch-a",
		isGoldenLot: false,
		anomalyRatio: 0.03,
		runNumber: 6,
	},
	// ETCH-01 Chamber B — 안정 운영 4 Run (정상 Etch 비교 기준)
	{
		lotId: "LOT-ETCH-B-001",
		recipe: RECIPE_ETCH_DEEP,
		equipmentId: "equip-etch-01",
		chamberId: "etch01-ch-b",
		isGoldenLot: false,
		anomalyRatio: 0.03,
		runNumber: 1,
	},
	{
		lotId: "LOT-ETCH-B-002",
		recipe: RECIPE_ETCH_DEEP,
		equipmentId: "equip-etch-01",
		chamberId: "etch01-ch-b",
		isGoldenLot: false,
		anomalyRatio: 0.04,
		runNumber: 2,
	},
	{
		lotId: "LOT-ETCH-B-003",
		recipe: RECIPE_ETCH_DEEP,
		equipmentId: "equip-etch-01",
		chamberId: "etch01-ch-b",
		isGoldenLot: false,
		anomalyRatio: 0.03,
		runNumber: 3,
	},
	{
		lotId: "LOT-ETCH-B-004",
		recipe: RECIPE_ETCH_DEEP,
		equipmentId: "equip-etch-01",
		chamberId: "etch01-ch-b",
		isGoldenLot: false,
		anomalyRatio: 0.03,
		runNumber: 4,
	},
];

function buildLot(config: LotConfig): LotDataV3 {
	const sensorsMeta = getSensorsForProcess(config.recipe.processType);
	const wafers = generateWaferRuns({
		recipe: config.recipe,
		sensorsMeta,
		waferCount: WAFER_COUNT,
		anomalyRatio: config.anomalyRatio,
		waferVariation: 0.02,
	});

	return {
		lotId: config.lotId,
		recipeId: config.recipe.recipeId,
		recipeName: config.recipe.name,
		equipmentId: config.equipmentId,
		chamberId: config.chamberId,
		isGoldenLot: config.isGoldenLot,
		waferCount: WAFER_COUNT,
		wafers,
		runNumber: config.runNumber,
	};
}

/** v0.3 Mock Lot 데이터 */
export const MOCK_LOTS_V3: LotDataV3[] = LOT_CONFIGS.map(buildLot);

/** 드롭다운용 Lot 요약 정보 */
export interface LotSummaryV3 {
	lotId: string;
	recipeName: string;
	equipmentId: string;
	chamberId: string;
	isGoldenLot: boolean;
	waferCount: number;
	runNumber: number;
}

export const MOCK_LOT_SUMMARIES_V3: LotSummaryV3[] = MOCK_LOTS_V3.map((lot) => ({
	lotId: lot.lotId,
	recipeName: lot.recipeName,
	equipmentId: lot.equipmentId,
	chamberId: lot.chamberId,
	isGoldenLot: lot.isGoldenLot,
	waferCount: lot.waferCount,
	runNumber: lot.runNumber,
}));

export { MOCK_EQUIPMENT };
