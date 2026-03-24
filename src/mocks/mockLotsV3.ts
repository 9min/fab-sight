import { getSensorsForProcess } from "@/constants/sensorConfig";
import type { LotDataV3 } from "@/types/fab";
import { MOCK_EQUIPMENT } from "./equipment";
import { generateWaferRuns } from "./generateProcessDataV3";
import { RECIPE_CVD_STANDARD, RECIPE_ETCH_DEEP } from "./recipes";

const WAFER_COUNT = 3;

interface LotConfig {
	lotId: string;
	recipe: typeof RECIPE_CVD_STANDARD;
	equipmentId: string;
	chamberId: string;
	isGoldenLot: boolean;
	anomalyRatio: number;
}

const LOT_CONFIGS: LotConfig[] = [
	{
		lotId: "LOT-GOLDEN-001",
		recipe: RECIPE_CVD_STANDARD,
		equipmentId: "equip-cvd-01",
		chamberId: "cvd01-ch-a",
		isGoldenLot: true,
		anomalyRatio: 0.02,
	},
	{
		lotId: "LOT-20240301-A",
		recipe: RECIPE_CVD_STANDARD,
		equipmentId: "equip-cvd-01",
		chamberId: "cvd01-ch-a",
		isGoldenLot: false,
		anomalyRatio: 0.08,
	},
	{
		lotId: "LOT-20240301-B",
		recipe: RECIPE_ETCH_DEEP,
		equipmentId: "equip-etch-01",
		chamberId: "etch01-ch-a",
		isGoldenLot: false,
		anomalyRatio: 0.12,
	},
	{
		lotId: "LOT-20240302-A",
		recipe: RECIPE_CVD_STANDARD,
		equipmentId: "equip-cvd-01",
		chamberId: "cvd01-ch-b",
		isGoldenLot: false,
		anomalyRatio: 0.15,
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
}

export const MOCK_LOT_SUMMARIES_V3: LotSummaryV3[] = MOCK_LOTS_V3.map((lot) => ({
	lotId: lot.lotId,
	recipeName: lot.recipeName,
	equipmentId: lot.equipmentId,
	chamberId: lot.chamberId,
	isGoldenLot: lot.isGoldenLot,
	waferCount: lot.waferCount,
}));

export { MOCK_EQUIPMENT };
